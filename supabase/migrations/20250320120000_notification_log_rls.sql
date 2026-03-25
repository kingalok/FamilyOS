-- Telegram digests were removed, but notification_log may still exist in the
-- public schema from prior setup. Enable RLS so the table is no longer exposed
-- without protection through PostgREST.

alter table if exists public.notification_log enable row level security;

drop policy if exists "notification_log_select_authenticated" on public.notification_log;
create policy "notification_log_select_authenticated"
on public.notification_log
for select
to authenticated
using (auth.role() = 'authenticated');

drop policy if exists "notification_log_insert_authenticated" on public.notification_log;
create policy "notification_log_insert_authenticated"
on public.notification_log
for insert
to authenticated
with check (auth.role() = 'authenticated');

drop policy if exists "notification_log_update_authenticated" on public.notification_log;
create policy "notification_log_update_authenticated"
on public.notification_log
for update
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "notification_log_delete_authenticated" on public.notification_log;
create policy "notification_log_delete_authenticated"
on public.notification_log
for delete
to authenticated
using (auth.role() = 'authenticated');
