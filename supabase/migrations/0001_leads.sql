-- Contactos de las dos rutas del embudo de Nicanor: consejería gratuita y autodiagnóstico.
-- Ejecutar una vez en el SQL Editor del proyecto de Supabase.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  ruta text not null check (ruta in ('consejeria', 'diagnostico')),
  nombre text not null,
  email text not null,
  whatsapp text not null,

  -- Consejería
  situacion text,
  problema text,
  urgencia text,
  -- Comunes
  quien_busca text,
  disposicion text,
  -- Diagnóstico
  respuestas jsonb,
  puntaje int check (puntaje between 5 and 20),
  perfil text check (perfil in ('crecimiento', 'piloto', 'distancia', 'quiebre')),
  alerta_individual boolean not null default false,
  alerta_crisis boolean not null default false,

  nivel text check (nivel in ('calificado', 'tibio', 'frio')),
  completed_at timestamptz,
  agendado_at timestamptz,
  estado text not null default 'nuevo'
    check (estado in ('nuevo', 'contactado', 'agendo', 'asistio', 'paciente', 'no_interesa')),
  notas text,

  -- Atribución y datos para la API de Conversiones de Meta
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  origen text,
  fbclid text,
  fbp text,
  fbc text,
  user_agent text,
  client_ip text,
  event_source_url text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_estado_idx on public.leads (estado);

create table if not exists public.historial_estado (
  id bigserial primary key,
  lead_id uuid not null references public.leads (id) on delete cascade,
  estado_anterior text,
  estado_nuevo text not null,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_updated_at on public.leads;
create trigger leads_updated_at before update on public.leads
  for each row execute function public.set_updated_at();

-- Sin políticas públicas: solo el servidor (clave secreta) lee y escribe.
alter table public.leads enable row level security;
alter table public.historial_estado enable row level security;
