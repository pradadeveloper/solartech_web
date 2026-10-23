-- Tipos de cliente iguales a los del CRM (solartech_app: Hogar, Comercial, Empresa, Gran Escala).
-- 'agro' se conserva para los leads que ya lo tienen; el sitio deja de enviarlo.
alter type client_type add value if not exists 'comercial';
alter type client_type add value if not exists 'gran_escala';
