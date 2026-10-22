-- Solartech · esquema inicial de leads del sitio web.
-- La web escribe solo desde el servidor (service role). El equipo comercial lee y
-- actualiza desde /admin/leads autenticado con Supabase Auth (tabla staff).

create extension if not exists "pgcrypto";

create type lead_status as enum ('nuevo', 'contactado', 'visita', 'propuesta', 'ganado', 'perdido');
create type client_type as enum ('empresa', 'agro', 'hogar');
create type business_model_interest as enum ('epc', 'ppa', 'no_se');

create table public.staff (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null unique,
  role text not null default 'asesor' check (role in ('asesor', 'admin')),
  created_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Origen del formulario
  source text not null default 'cotizador' check (source in ('cotizador', 'contacto', 'calculadora')),

  -- Paso 1 · tipo y ubicación
  tipo_cliente client_type,
  departamento text,
  ciudad text,

  -- Paso 2 · consumo
  factura_cop numeric(14, 0),
  consumo_kwh numeric(12, 2),
  tarifa_kwh numeric(10, 2),
  factura_path text, -- ruta en el bucket privado "facturas"

  -- Paso 3 · instalación
  techo text check (techo in ('lamina', 'teja_barro', 'losa', 'suelo')),
  area_m2 numeric(10, 2),
  baterias boolean,
  modelo_interes business_model_interest,

  -- Resultado del motor de cálculo (versión incluida para auditar cambios de parámetros)
  resultado_json jsonb,
  quote_engine_version text,

  -- Paso 4 · contacto
  nombre text not null,
  empresa text,
  nit text,
  email text not null,
  celular text not null,
  mensaje text,

  -- Habeas Data (Ley 1581 de 2012)
  consentimiento_datos boolean not null check (consentimiento_datos),
  consentimiento_at timestamptz not null default now(),
  politica_version text not null,

  -- Atribución
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  gclid text,
  fbclid text,
  landing_page text,
  referrer text,
  ip_hash text,
  user_agent text,

  -- Gestión comercial
  score smallint not null default 0,
  prioridad text not null default 'media' check (prioridad in ('alta', 'media', 'baja')),
  estado lead_status not null default 'nuevo',
  asesor_id uuid references public.staff (user_id) on delete set null,
  notas text,
  synced_solartech_app_at timestamptz
);

create index leads_created_at_idx on public.leads (created_at desc);
create index leads_estado_idx on public.leads (estado);
create index leads_email_idx on public.leads (lower(email));

create function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_set_updated_at before update on public.leads
for each row execute function public.set_updated_at();

-- Bitácora de cambios de estado (trazabilidad del embudo).
create table public.lead_events (
  id bigint generated always as identity primary key,
  lead_id uuid not null references public.leads (id) on delete cascade,
  created_at timestamptz not null default now(),
  actor_id uuid references public.staff (user_id) on delete set null,
  type text not null,
  data jsonb
);

create index lead_events_lead_idx on public.lead_events (lead_id, created_at desc);

-- ---------- RLS ----------
alter table public.staff enable row level security;
alter table public.leads enable row level security;
alter table public.lead_events enable row level security;

create function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.staff where user_id = auth.uid());
$$;

create policy "staff lee staff" on public.staff for select to authenticated using (public.is_staff());
create policy "staff lee leads" on public.leads for select to authenticated using (public.is_staff());
create policy "staff actualiza leads" on public.leads for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "staff lee eventos" on public.lead_events for select to authenticated using (public.is_staff());
create policy "staff crea eventos" on public.lead_events for insert to authenticated with check (public.is_staff());
-- Sin políticas para anon: los inserts llegan solo por la API del sitio con service role.

-- ---------- Storage: facturas (privado) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('facturas', 'facturas', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "staff lee facturas" on storage.objects for select to authenticated
using (bucket_id = 'facturas' and public.is_staff());
