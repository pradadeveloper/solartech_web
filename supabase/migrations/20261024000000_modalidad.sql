-- Solartech · modalidad de negocio de cada cotización (solartech_app).
--   recursos_propios: el cliente compra el sistema.
--   ppa: un tercero invierte y el cliente paga la energía con descuento.
-- tipo_documento decide si aplican los beneficios de la Ley 1715 (solo NIT).
-- contribucion: el cliente paga contribución (+20 % sobre la tarifa).

alter table public.leads
  add column if not exists modalidad text not null default 'recursos_propios',
  add column if not exists tipo_documento text,
  add column if not exists contribucion boolean not null default false;

alter table public.leads drop constraint if exists leads_modalidad_check;
alter table public.leads add constraint leads_modalidad_check
  check (modalidad in ('recursos_propios', 'ppa'));

alter table public.leads drop constraint if exists leads_tipo_documento_check;
alter table public.leads add constraint leads_tipo_documento_check
  check (tipo_documento is null or tipo_documento in ('CC', 'NIT', 'CE', 'PH'));

alter table public.propuestas
  add column if not exists modalidad text not null default 'recursos_propios';
