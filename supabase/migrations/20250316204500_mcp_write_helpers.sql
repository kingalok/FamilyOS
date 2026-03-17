create or replace function public.create_task(
  p_title text,
  p_description text default null,
  p_category text default null,
  p_status text default 'open',
  p_priority text default 'medium',
  p_due_at timestamptz default null,
  p_owner_person_id uuid default null,
  p_related_event_id uuid default null,
  p_tags text[] default '{}'::text[],
  p_metadata jsonb default '{}'::jsonb
)
returns public.tasks
language sql
as $$
  insert into public.tasks (
    title,
    description,
    category,
    status,
    priority,
    due_at,
    owner_person_id,
    related_event_id,
    tags,
    metadata
  )
  values (
    p_title,
    p_description,
    p_category,
    p_status,
    p_priority,
    p_due_at,
    p_owner_person_id,
    p_related_event_id,
    coalesce(p_tags, '{}'::text[]),
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning *;
$$;

create or replace function public.create_event(
  p_title text,
  p_description text default null,
  p_category text default null,
  p_status text default 'planned',
  p_event_start timestamptz default null,
  p_event_end timestamptz default null,
  p_location text default null,
  p_owner_person_id uuid default null,
  p_tags text[] default '{}'::text[],
  p_metadata jsonb default '{}'::jsonb
)
returns public.events
language sql
as $$
  insert into public.events (
    title,
    description,
    category,
    status,
    event_start,
    event_end,
    location,
    owner_person_id,
    tags,
    metadata
  )
  values (
    p_title,
    p_description,
    p_category,
    p_status,
    p_event_start,
    p_event_end,
    p_location,
    p_owner_person_id,
    coalesce(p_tags, '{}'::text[]),
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning *;
$$;

create or replace function public.save_knowledge_item(
  p_title text,
  p_content text default null,
  p_category text default null,
  p_status text default 'active',
  p_source text default null,
  p_owner_person_id uuid default null,
  p_tags text[] default '{}'::text[],
  p_metadata jsonb default '{}'::jsonb
)
returns public.knowledge_items
language sql
as $$
  insert into public.knowledge_items (
    title,
    content,
    category,
    status,
    source,
    owner_person_id,
    tags,
    metadata
  )
  values (
    p_title,
    p_content,
    p_category,
    p_status,
    p_source,
    p_owner_person_id,
    coalesce(p_tags, '{}'::text[]),
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning *;
$$;

create or replace function public.update_task_status(
  p_task_id uuid,
  p_status text,
  p_priority text default null,
  p_due_at timestamptz default null,
  p_metadata_patch jsonb default '{}'::jsonb
)
returns public.tasks
language plpgsql
as $$
declare
  updated_task public.tasks;
begin
  update public.tasks
  set
    status = p_status,
    priority = coalesce(p_priority, priority),
    due_at = coalesce(p_due_at, due_at),
    metadata = coalesce(metadata, '{}'::jsonb) || coalesce(p_metadata_patch, '{}'::jsonb)
  where id = p_task_id
  returning * into updated_task;

  return updated_task;
end;
$$;

comment on function public.create_task(text, text, text, text, text, timestamptz, uuid, uuid, text[], jsonb) is
  'MCP-friendly helper for inserting a new FamilyOS task.';

comment on function public.create_event(text, text, text, text, timestamptz, timestamptz, text, uuid, text[], jsonb) is
  'MCP-friendly helper for inserting a new FamilyOS event.';

comment on function public.save_knowledge_item(text, text, text, text, text, uuid, text[], jsonb) is
  'MCP-friendly helper for inserting a new FamilyOS knowledge item.';

comment on function public.update_task_status(uuid, text, text, timestamptz, jsonb) is
  'MCP-friendly helper for updating FamilyOS task status and related fields.';
