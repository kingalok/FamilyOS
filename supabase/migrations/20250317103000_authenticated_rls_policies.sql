-- FamilyOS keeps the access model intentionally simple for now:
-- authenticated users can read and write all FamilyOS records,
-- while anon/public access is blocked.

alter table public.people enable row level security;
alter table public.events enable row level security;
alter table public.tasks enable row level security;
alter table public.knowledge_items enable row level security;

-- Make the helper views respect the caller's privileges and underlying RLS.
alter view public.upcoming_events_view set (security_invoker = true);
alter view public.open_tasks_view set (security_invoker = true);
alter view public.recent_knowledge_items_view set (security_invoker = true);

-- Remove broad access from helper views/functions, then grant only what the
-- authenticated app/MCP session should use.
revoke all on public.upcoming_events_view from public, anon;
revoke all on public.open_tasks_view from public, anon;
revoke all on public.recent_knowledge_items_view from public, anon;

grant select on public.upcoming_events_view to authenticated;
grant select on public.open_tasks_view to authenticated;
grant select on public.recent_knowledge_items_view to authenticated;

revoke all on function public.create_task(text, text, text, text, text, timestamptz, uuid, uuid, text[], jsonb) from public, anon;
revoke all on function public.create_event(text, text, text, text, timestamptz, timestamptz, text, uuid, text[], jsonb) from public, anon;
revoke all on function public.save_knowledge_item(text, text, text, text, text, uuid, text[], jsonb) from public, anon;
revoke all on function public.update_task_status(uuid, text, text, timestamptz, jsonb) from public, anon;

grant execute on function public.create_task(text, text, text, text, text, timestamptz, uuid, uuid, text[], jsonb) to authenticated;
grant execute on function public.create_event(text, text, text, text, timestamptz, timestamptz, text, uuid, text[], jsonb) to authenticated;
grant execute on function public.save_knowledge_item(text, text, text, text, text, uuid, text[], jsonb) to authenticated;
grant execute on function public.update_task_status(uuid, text, text, timestamptz, jsonb) to authenticated;

drop policy if exists "people_select_authenticated" on public.people;
create policy "people_select_authenticated"
on public.people
for select
to authenticated
using (auth.role() = 'authenticated');

drop policy if exists "people_insert_authenticated" on public.people;
create policy "people_insert_authenticated"
on public.people
for insert
to authenticated
with check (auth.role() = 'authenticated');

drop policy if exists "people_update_authenticated" on public.people;
create policy "people_update_authenticated"
on public.people
for update
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "people_delete_authenticated" on public.people;
create policy "people_delete_authenticated"
on public.people
for delete
to authenticated
using (auth.role() = 'authenticated');

drop policy if exists "events_select_authenticated" on public.events;
create policy "events_select_authenticated"
on public.events
for select
to authenticated
using (auth.role() = 'authenticated');

drop policy if exists "events_insert_authenticated" on public.events;
create policy "events_insert_authenticated"
on public.events
for insert
to authenticated
with check (auth.role() = 'authenticated');

drop policy if exists "events_update_authenticated" on public.events;
create policy "events_update_authenticated"
on public.events
for update
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "events_delete_authenticated" on public.events;
create policy "events_delete_authenticated"
on public.events
for delete
to authenticated
using (auth.role() = 'authenticated');

drop policy if exists "tasks_select_authenticated" on public.tasks;
create policy "tasks_select_authenticated"
on public.tasks
for select
to authenticated
using (auth.role() = 'authenticated');

drop policy if exists "tasks_insert_authenticated" on public.tasks;
create policy "tasks_insert_authenticated"
on public.tasks
for insert
to authenticated
with check (auth.role() = 'authenticated');

drop policy if exists "tasks_update_authenticated" on public.tasks;
create policy "tasks_update_authenticated"
on public.tasks
for update
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "tasks_delete_authenticated" on public.tasks;
create policy "tasks_delete_authenticated"
on public.tasks
for delete
to authenticated
using (auth.role() = 'authenticated');

drop policy if exists "knowledge_items_select_authenticated" on public.knowledge_items;
create policy "knowledge_items_select_authenticated"
on public.knowledge_items
for select
to authenticated
using (auth.role() = 'authenticated');

drop policy if exists "knowledge_items_insert_authenticated" on public.knowledge_items;
create policy "knowledge_items_insert_authenticated"
on public.knowledge_items
for insert
to authenticated
with check (auth.role() = 'authenticated');

drop policy if exists "knowledge_items_update_authenticated" on public.knowledge_items;
create policy "knowledge_items_update_authenticated"
on public.knowledge_items
for update
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "knowledge_items_delete_authenticated" on public.knowledge_items;
create policy "knowledge_items_delete_authenticated"
on public.knowledge_items
for delete
to authenticated
using (auth.role() = 'authenticated');
