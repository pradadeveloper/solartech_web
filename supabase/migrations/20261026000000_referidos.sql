-- Programa de Referidos Comerciales: asesores externos y brókers que agendan una reunión
-- para conocer la modalidad. No son leads de clientes: van en su propia tabla.

create table public.aliados_referidos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  nombre text not null,
  email text not null,
  celular text not null,
  empresa text,
  ciudad text not null,
  perfil text not null,
  referidos_esperados text,
  mensaje text,

  -- Cita solicitada (hora de Colombia) y su instante exacto.
  modalidad text not null check (modalidad in ('virtual', 'presencial')),
  fecha_cita date not null,
  hora_cita text not null,
  cita_at timestamptz not null,

  -- Habeas Data (Ley 1581 de 2012)
  consentimiento_datos boolean not null check (consentimiento_datos),
  politica_version text not null,

  -- Seguimiento del equipo comercial
  estado text not null default 'pendiente' check (estado in ('pendiente', 'confirmada', 'realizada', 'aliado', 'descartada')),
  asesor_id uuid references public.staff (user_id) on delete set null,
  notas text,

  -- Atribución
  utm_source text,
  utm_medium text,
  utm_campaign text,
  landing_page text,
  ip_hash text
);

create index aliados_referidos_created_idx on public.aliados_referidos (created_at desc);
-- Una franja solo se puede reservar una vez mientras la cita siga vigente.
create unique index aliados_referidos_franja_idx on public.aliados_referidos (cita_at)
  where estado in ('pendiente', 'confirmada');

create trigger aliados_referidos_set_updated_at before update on public.aliados_referidos
for each row execute function public.set_updated_at();

alter table public.aliados_referidos enable row level security;
create policy "staff lee aliados" on public.aliados_referidos for select to authenticated using (public.is_staff());
create policy "staff actualiza aliados" on public.aliados_referidos for update to authenticated
  using (public.is_staff()) with check (public.is_staff());
-- Sin políticas para anon: las solicitudes llegan solo por la API del sitio con service role.
