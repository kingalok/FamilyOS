create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text,
  relationship text,
  email text,
  phone text,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  status text not null default 'planned',
  event_start timestamptz,
  event_end timestamptz,
  location text,
  owner_person_id uuid references public.people(id) on delete set null,
  tags text[] not null default '{}'::text[],
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  status text not null default 'open',
  priority text not null default 'medium',
  due_at timestamptz,
  owner_person_id uuid references public.people(id) on delete set null,
  related_event_id uuid references public.events(id) on delete set null,
  tags text[] not null default '{}'::text[],
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.knowledge_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  category text,
  status text not null default 'active',
  source text,
  owner_person_id uuid references public.people(id) on delete set null,
  tags text[] not null default '{}'::text[],
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_people_full_name on public.people (full_name);
create index if not exists idx_events_event_start on public.events (event_start);
create index if not exists idx_events_owner_person_id on public.events (owner_person_id);
create index if not exists idx_events_status on public.events (status);
create index if not exists idx_tasks_status_due_at on public.tasks (status, due_at);
create index if not exists idx_tasks_owner_person_id on public.tasks (owner_person_id);
create index if not exists idx_tasks_related_event_id on public.tasks (related_event_id);
create index if not exists idx_knowledge_items_updated_at on public.knowledge_items (updated_at desc);
create index if not exists idx_knowledge_items_owner_person_id on public.knowledge_items (owner_person_id);

create index if not exists idx_events_tags_gin on public.events using gin (tags);
create index if not exists idx_tasks_tags_gin on public.tasks using gin (tags);
create index if not exists idx_knowledge_items_tags_gin on public.knowledge_items using gin (tags);
create index if not exists idx_people_metadata_gin on public.people using gin (metadata);
create index if not exists idx_events_metadata_gin on public.events using gin (metadata);
create index if not exists idx_tasks_metadata_gin on public.tasks using gin (metadata);
create index if not exists idx_knowledge_items_metadata_gin on public.knowledge_items using gin (metadata);

drop trigger if exists trg_people_updated_at on public.people;
create trigger trg_people_updated_at
before update on public.people
for each row
execute function public.set_updated_at();

drop trigger if exists trg_events_updated_at on public.events;
create trigger trg_events_updated_at
before update on public.events
for each row
execute function public.set_updated_at();

drop trigger if exists trg_tasks_updated_at on public.tasks;
create trigger trg_tasks_updated_at
before update on public.tasks
for each row
execute function public.set_updated_at();

drop trigger if exists trg_knowledge_items_updated_at on public.knowledge_items;
create trigger trg_knowledge_items_updated_at
before update on public.knowledge_items
for each row
execute function public.set_updated_at();

comment on table public.people is 'Core people records for the FamilyOS shared operating system.';
comment on table public.events is 'Structured family events and time-bound plans.';
comment on table public.tasks is 'Actionable work items linked to family members and events.';
comment on table public.knowledge_items is 'Long-lived notes and shared household knowledge.';
