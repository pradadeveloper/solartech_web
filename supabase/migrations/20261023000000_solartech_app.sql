-- Solartech · solartech_app (CRM de asesores) deja Google Sheets y pasa a esta base.
-- Desde aquí la web y solartech_app comparten los mismos leads, asesores e historial:
--   · El sitio crea el lead y solartech_app lo completa (número de cotización, PDF).
--   · Los asesores entran a solartech_app con Supabase Auth (tabla staff).
--   · Cada asesor ve sus leads y los que están sin asignar; el admin ve todo.

-- ---------- Estados ----------
-- solartech_app distingue "Cotizado" (propuesta) de "Enviado" (enviada al cliente).
alter type public.lead_status add value if not exists 'negociacion' after 'visita';
alter type public.lead_status add value if not exists 'enviado' after 'propuesta';

-- ---------- Asesores ----------
-- Lo que lleva la firma del PDF.
alter table public.staff
  add column if not exists apellido text,
  add column if not exists cargo text not null default 'Asesor Comercial';

-- Un asesor desactivado deja de tener acceso aunque conserve su usuario de Auth.
create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.staff where user_id = auth.uid() and activo);
$$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.staff where user_id = auth.uid() and role = 'admin' and activo);
$$;

-- ---------- Datos del dimensionamiento de solartech_app ----------
alter table public.leads
  add column codigo_publico text unique,        -- código corto del link que recibe el cliente
  add column version_de uuid references public.leads (id) on delete cascade,
  add column version_num smallint,              -- cotización 83_2 → numero 83, versión 2
  add column tipo_solicitud text,               -- texto original (Hogar, Empresa, Comercial…)
  add column sistema_interes text,              -- Interconectado, Híbrido…
  add column tipo_techo text,                   -- texto original (Standing Seam, Termoacústica…)
  add column radiacion_solar numeric(5, 2),
  add column npaneles integer,
  add column ninversores integer,
  add column ahorro_anual_cop numeric(14, 0),
  add column opciones jsonb not null default '[]'::jsonb;

create unique index leads_numero_version_idx
  on public.leads (numero_cotizacion, coalesce(version_num, 0))
  where numero_cotizacion is not null;
create index leads_version_de_idx on public.leads (version_de);

-- Consecutivo de cotizaciones: lo pide solartech_app con la service role.
create sequence public.numero_cotizacion_seq;

create function public.sincronizar_numero_cotizacion() returns integer
language sql security definer set search_path = public as $$
  select setval('public.numero_cotizacion_seq',
                greatest(coalesce((select max(numero_cotizacion) from public.leads), 0), 1),
                (select max(numero_cotizacion) from public.leads) is not null)::integer;
$$;

create function public.siguiente_numero_cotizacion() returns integer
language sql security definer set search_path = public as $$
  select nextval('public.numero_cotizacion_seq')::integer;
$$;

revoke execute on function public.sincronizar_numero_cotizacion() from public, anon, authenticated;
revoke execute on function public.siguiente_numero_cotizacion() from public, anon, authenticated;
grant execute on function public.sincronizar_numero_cotizacion() to service_role;
grant execute on function public.siguiente_numero_cotizacion() to service_role;

select public.sincronizar_numero_cotizacion();

-- ---------- Propuestas formales (una por opción elegida por el asesor) ----------
create table public.propuestas (
  id text primary key,                          -- ST-XXXXXXXX, va en el link público
  lead_id uuid references public.leads (id) on delete set null,
  created_at timestamptz not null default now(),
  created_by uuid references public.staff (user_id) on delete set null,
  opcion text,
  kwp numeric(10, 2),
  paneles integer,
  inversion_cop numeric(14, 0),
  ahorro_mensual_cop numeric(14, 0),
  roi_anios numeric(5, 1),
  nombre_cliente text,
  ciudad text,
  consumo_kwh numeric(12, 2),
  sistema text,
  techo text,
  pdf_url text,
  estado text not null default 'Enviada'
);
create index propuestas_lead_idx on public.propuestas (lead_id);

-- ---------- Parámetros del cotizador (costo kWp, potencia de panel, empresa…) ----------
create table public.app_config (
  clave text primary key,
  valor jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.staff (user_id) on delete set null
);

-- ---------- RLS: cada asesor ve lo suyo y lo que está sin asignar ----------
create function public.puede_ver_lead(asesor uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_admin() or (public.is_staff() and (asesor is null or asesor = auth.uid()));
$$;

drop policy if exists "staff lee leads" on public.leads;
drop policy if exists "staff actualiza leads" on public.leads;
drop policy if exists "staff crea leads" on public.leads;
create policy "staff lee leads" on public.leads for select to authenticated
  using (public.puede_ver_lead(asesor_id));
-- Al tocar un lead sin asignar, el asesor queda como dueño (solo el admin reparte a otros).
create policy "staff actualiza leads" on public.leads for update to authenticated
  using (public.puede_ver_lead(asesor_id))
  with check (public.is_admin() or (public.is_staff() and asesor_id = auth.uid()));
create policy "staff crea leads" on public.leads for insert to authenticated
  with check (public.is_admin() or (public.is_staff() and asesor_id = auth.uid()));

drop policy if exists "staff lee eventos" on public.lead_events;
drop policy if exists "staff crea eventos" on public.lead_events;
create policy "staff lee eventos" on public.lead_events for select to authenticated
  using (exists (select 1 from public.leads l where l.id = lead_id));
create policy "staff crea eventos" on public.lead_events for insert to authenticated
  with check (public.is_staff() and actor_id = auth.uid()
              and exists (select 1 from public.leads l where l.id = lead_id));

alter table public.propuestas enable row level security;
create policy "staff lee propuestas" on public.propuestas for select to authenticated
  using (public.is_staff());
create policy "staff crea propuestas" on public.propuestas for insert to authenticated
  with check (public.is_staff() and created_by = auth.uid());

alter table public.app_config enable row level security;
create policy "staff lee config" on public.app_config for select to authenticated
  using (public.is_staff());
create policy "admin escribe config" on public.app_config for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------- PDFs de propuestas ----------
-- Público: el cliente abre el link sin cuenta. El nombre lleva un sufijo aleatorio
-- para que no se pueda adivinar; solo el backend (service role) sube archivos.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('propuestas', 'propuestas', true, 20971520, array['application/pdf'])
on conflict (id) do nothing;
