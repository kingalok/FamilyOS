create table if not exists public.notification_log (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'telegram',
  recipient_key text not null default 'default',
  digest_type text not null check (digest_type in ('daily', 'weekly', 'monthly')),
  period_start timestamptz not null,
  period_end timestamptz not null,
  status text not null default 'sent' check (status in ('pending', 'sent', 'failed', 'skipped')),
  sent_at timestamptz,
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint notification_log_period_check check (period_end > period_start)
);

create index if not exists idx_notification_log_digest_lookup
  on public.notification_log (provider, recipient_key, digest_type, period_start desc);

create index if not exists idx_notification_log_status
  on public.notification_log (status, created_at desc);

create index if not exists idx_notification_log_metadata_gin
  on public.notification_log using gin (metadata);

create unique index if not exists idx_notification_log_sent_unique
  on public.notification_log (provider, recipient_key, digest_type, period_start, period_end)
  where status = 'sent';

drop trigger if exists trg_notification_log_updated_at on public.notification_log;
create trigger trg_notification_log_updated_at
before update on public.notification_log
for each row
execute function public.set_updated_at();

comment on table public.notification_log is
  'Logs Telegram digest delivery attempts and prevents duplicate sends for the same digest period.';

comment on column public.notification_log.period_start is
  'Inclusive UTC start boundary for the digest payload.';

comment on column public.notification_log.period_end is
  'Exclusive UTC end boundary for the digest payload.';

create or replace function public.daily_digest_window(
  p_run_at timestamptz,
  p_timezone text default 'Europe/London'
)
returns table (
  digest_type text,
  period_start timestamptz,
  period_end timestamptz
)
language sql
stable
as $$
  with local_context as (
    select (p_run_at at time zone p_timezone) as local_run_at
  ),
  bounds as (
    select
      ((local_run_at::date + 1)::timestamp at time zone p_timezone) as start_utc,
      ((local_run_at::date + 2)::timestamp at time zone p_timezone) as end_utc
    from local_context
  )
  select
    'daily'::text,
    start_utc,
    end_utc
  from bounds;
$$;

create or replace function public.weekly_digest_window(
  p_run_at timestamptz,
  p_timezone text default 'Europe/London'
)
returns table (
  digest_type text,
  period_start timestamptz,
  period_end timestamptz
)
language sql
stable
as $$
  with local_context as (
    select (p_run_at at time zone p_timezone) as local_run_at
  ),
  anchor as (
    select
      (
        local_run_at::date
        - (((extract(dow from local_run_at::date)::int + 1) % 7) * interval '1 day')
      )::date as saturday_start
    from local_context
  ),
  bounds as (
    select
      (saturday_start::timestamp at time zone p_timezone) as start_utc,
      ((saturday_start + 7)::timestamp at time zone p_timezone) as end_utc
    from anchor
  )
  select
    'weekly'::text,
    start_utc,
    end_utc
  from bounds;
$$;

create or replace function public.monthly_digest_window(
  p_run_at timestamptz,
  p_timezone text default 'Europe/London'
)
returns table (
  digest_type text,
  period_start timestamptz,
  period_end timestamptz
)
language sql
stable
as $$
  with local_context as (
    select (p_run_at at time zone p_timezone) as local_run_at
  ),
  anchor as (
    select date_trunc('month', local_run_at)::date as month_start
    from local_context
  ),
  bounds as (
    select
      (month_start::timestamp at time zone p_timezone) as start_utc,
      ((month_start + interval '1 month')::timestamp at time zone p_timezone) as end_utc
    from anchor
  )
  select
    'monthly'::text,
    start_utc,
    end_utc
  from bounds;
$$;

create or replace function public.digest_tasks_in_window(
  p_period_start timestamptz,
  p_period_end timestamptz
)
returns table (
  id uuid,
  title text,
  description text,
  category text,
  status text,
  priority text,
  due_at timestamptz,
  owner_person_id uuid,
  related_event_id uuid,
  tags text[],
  metadata jsonb
)
language sql
stable
as $$
  select
    t.id,
    t.title,
    t.description,
    t.category,
    t.status,
    t.priority,
    t.due_at,
    t.owner_person_id,
    t.related_event_id,
    t.tags,
    t.metadata
  from public.tasks t
  where t.due_at is not null
    and t.due_at >= p_period_start
    and t.due_at < p_period_end
    and t.status not in ('done', 'cancelled')
  order by t.due_at asc, t.created_at asc;
$$;

create or replace function public.digest_events_in_window(
  p_period_start timestamptz,
  p_period_end timestamptz
)
returns table (
  id uuid,
  title text,
  description text,
  category text,
  status text,
  event_start timestamptz,
  event_end timestamptz,
  location text,
  owner_person_id uuid,
  tags text[],
  metadata jsonb
)
language sql
stable
as $$
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
    e.tags,
    e.metadata
  from public.events e
  where e.event_start is not null
    and e.event_start < p_period_end
    and coalesce(e.event_end, e.event_start) >= p_period_start
    and e.status <> 'cancelled'
  order by e.event_start asc, e.created_at asc;
$$;

create or replace function public.digest_items_in_window(
  p_period_start timestamptz,
  p_period_end timestamptz
)
returns table (
  item_type text,
  item_id uuid,
  title text,
  subtitle text,
  scheduled_at timestamptz,
  status text,
  payload jsonb
)
language sql
stable
as $$
  select
    'task'::text as item_type,
    t.id as item_id,
    t.title,
    coalesce(t.category, t.priority, 'task') as subtitle,
    t.due_at as scheduled_at,
    t.status,
    jsonb_build_object(
      'description', t.description,
      'priority', t.priority,
      'tags', t.tags,
      'metadata', t.metadata,
      'related_event_id', t.related_event_id,
      'owner_person_id', t.owner_person_id
    ) as payload
  from public.digest_tasks_in_window(p_period_start, p_period_end) t

  union all

  select
    'event'::text as item_type,
    e.id as item_id,
    e.title,
    coalesce(e.category, e.location, 'event') as subtitle,
    e.event_start as scheduled_at,
    e.status,
    jsonb_build_object(
      'description', e.description,
      'event_end', e.event_end,
      'location', e.location,
      'tags', e.tags,
      'metadata', e.metadata,
      'owner_person_id', e.owner_person_id
    ) as payload
  from public.digest_events_in_window(p_period_start, p_period_end) e

  order by scheduled_at asc nulls last, title asc;
$$;

comment on function public.daily_digest_window(timestamptz, text) is
  'Returns the next-day digest window in UTC using a business timezone such as Europe/London.';

comment on function public.weekly_digest_window(timestamptz, text) is
  'Returns the current Saturday to next Friday digest window in UTC using a business timezone such as Europe/London.';

comment on function public.monthly_digest_window(timestamptz, text) is
  'Returns the current month digest window in UTC using a business timezone such as Europe/London.';

comment on function public.digest_tasks_in_window(timestamptz, timestamptz) is
  'Returns active tasks due within a digest window.';

comment on function public.digest_events_in_window(timestamptz, timestamptz) is
  'Returns non-cancelled events overlapping a digest window.';

comment on function public.digest_items_in_window(timestamptz, timestamptz) is
  'Returns a unified task/event feed for Telegram digest generation.';
