create or replace view public.upcoming_events_view as
select
  e.id,
  e.title,
  e.description,
  e.category,
  e.status,
  e.event_start,
  e.event_end,
  e.location,
  e.owner_person_id,
  p.full_name as owner_name,
  e.tags,
  e.metadata,
  e.created_at,
  e.updated_at
from public.events e
left join public.people p on p.id = e.owner_person_id
where e.event_start is not null
  and e.event_start >= now()
order by e.event_start asc;

create or replace view public.open_tasks_view as
select
  t.id,
  t.title,
  t.description,
  t.category,
  t.status,
  t.priority,
  t.due_at,
  t.owner_person_id,
  p.full_name as owner_name,
  t.related_event_id,
  e.title as related_event_title,
  t.tags,
  t.metadata,
  t.created_at,
  t.updated_at
from public.tasks t
left join public.people p on p.id = t.owner_person_id
left join public.events e on e.id = t.related_event_id
where t.status = 'open'
order by t.due_at asc nulls last, t.created_at desc;

create or replace view public.recent_knowledge_items_view as
select
  k.id,
  k.title,
  k.content,
  k.category,
  k.status,
  k.source,
  k.owner_person_id,
  p.full_name as owner_name,
  k.tags,
  k.metadata,
  k.created_at,
  k.updated_at
from public.knowledge_items k
left join public.people p on p.id = k.owner_person_id
where k.status = 'active'
order by k.updated_at desc;

comment on view public.upcoming_events_view is 'MCP-friendly read model for upcoming FamilyOS events.';
comment on view public.open_tasks_view is 'MCP-friendly read model for currently open FamilyOS tasks.';
comment on view public.recent_knowledge_items_view is 'MCP-friendly read model for recently updated active knowledge items.';
