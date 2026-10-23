-- Solartech · campos de seguimiento e historial sobre la tabla de leads.
-- Ya aplicada en el proyecto qiixdysbgquqauolrayg. El CRM de asesores es solartech_app:
-- aquí la web guarda una copia de respaldo de cada lead, con el número de cotización
-- oficial (numero_cotizacion, propuesta_url) cuando solartech_app lo registra.
--
-- Equivalencia con los estados de solartech_app (Google Sheets) para la importación:
--   Nuevo → nuevo · En negociación → negociacion · Cotizado / Enviado → propuesta
--   Cerrado → ganado · Perdido → perdido

-- ---------- Orígenes y datos de leads que no vienen del sitio ----------
alter table public.leads drop constraint leads_source_check;
alter table public.leads add constraint leads_source_check
  check (source in ('cotizador', 'contacto', 'calculadora', 'solartech_app', 'manual', 'importado'));

-- Los leads cargados a mano o importados pueden no tener correo, celular o
-- autorización registrada; los del sitio siempre la traen (Habeas Data).
alter table public.leads
  alter column email drop not null,
  alter column celular drop not null,
  alter column consentimiento_datos drop not null,
  alter column consentimiento_at drop not null,
  alter column politica_version drop not null;
alter table public.leads drop constraint leads_consentimiento_datos_check;
alter table public.leads add constraint leads_consentimiento_web_check
  check (source not in ('cotizador', 'contacto', 'calculadora') or (consentimiento_datos is true and politica_version is not null));
alter table public.leads add constraint leads_contacto_check check (email is not null or celular is not null);

alter table public.leads
  -- Proyecto (lo llena el cotizador o el asesor al dimensionar)
  add column kwp numeric(10, 2),
  add column valor_proyecto_cop numeric(14, 0),
  add column ahorro_mensual_cop numeric(14, 0),
  add column payback_meses numeric(6, 1),
  add column propuesta_url text,
  -- Seguimiento
  add column proxima_accion text,
  add column proxima_accion_at timestamptz,
  add column ultimo_contacto_at timestamptz,
  add column estado_at timestamptz not null default now(),
  add column cerrado_at timestamptz,
  add column motivo_perdida text,
  add column preferencia_contacto text,
  add column canal_conociste text,
  -- Trazabilidad de la importación desde Google Sheets / solartech_app
  add column numero_cotizacion integer,
  add column legacy_id text unique;

create index leads_asesor_idx on public.leads (asesor_id);
create index leads_proxima_accion_idx on public.leads (proxima_accion_at)
  where estado not in ('ganado', 'perdido');

-- ---------- Asesores ----------
alter table public.staff
  add column celular text,
  add column activo boolean not null default true;

create function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.staff where user_id = auth.uid() and role = 'admin');
$$;

-- ---------- Fechas del embudo ----------
create function public.leads_before_update() returns trigger
language plpgsql as $$
begin
  if new.estado is distinct from old.estado then
    new.estado_at = now();
    new.cerrado_at = case when new.estado in ('ganado', 'perdido') then now() end;
  end if;
  return new;
end;
$$;

create trigger leads_before_update before update on public.leads
for each row execute function public.leads_before_update();

-- ---------- Bitácora automática ----------
-- Cada alta, cambio de etapa, de asesor o de próxima acción queda en lead_events,
-- venga del panel, del sitio o de un script. Las notas las inserta el panel.
create function public.log_lead_changes() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  actor uuid := (select user_id from public.staff where user_id = auth.uid());
begin
  if tg_op = 'INSERT' then
    insert into public.lead_events (lead_id, actor_id, type, data)
    values (new.id, actor, 'creado', jsonb_build_object('source', new.source));
    return new;
  end if;

  if new.estado is distinct from old.estado then
    insert into public.lead_events (lead_id, actor_id, type, data)
    values (new.id, actor, 'estado', jsonb_build_object('de', old.estado, 'a', new.estado, 'motivo', new.motivo_perdida));
  end if;
  if new.asesor_id is distinct from old.asesor_id then
    insert into public.lead_events (lead_id, actor_id, type, data)
    values (new.id, actor, 'asesor', jsonb_build_object('de', old.asesor_id, 'a', new.asesor_id));
  end if;
  if new.proxima_accion_at is distinct from old.proxima_accion_at or new.proxima_accion is distinct from old.proxima_accion then
    insert into public.lead_events (lead_id, actor_id, type, data)
    values (new.id, actor, 'proxima_accion', jsonb_build_object('accion', new.proxima_accion, 'fecha', new.proxima_accion_at));
  end if;
  return new;
end;
$$;

create trigger leads_log_insert after insert on public.leads
for each row execute function public.log_lead_changes();
create trigger leads_log_update after update on public.leads
for each row execute function public.log_lead_changes();

-- ---------- RLS adicional ----------
-- Todo el equipo ve toda la bandeja (equipo pequeño, se reparten por asesor_id).
create policy "staff crea leads" on public.leads for insert to authenticated with check (public.is_staff());
create policy "admin borra leads" on public.leads for delete to authenticated using (public.is_admin());
create policy "admin gestiona staff" on public.staff for all to authenticated using (public.is_admin()) with check (public.is_admin());
