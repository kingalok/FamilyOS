create extension if not exists pg_cron;
create extension if not exists pg_net;
create extension if not exists vault;

create or replace function public.invoke_send_telegram_digests()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  project_url text;
  anon_jwt text;
  request_id bigint;
begin
  /*
    Expected Vault secret names:
    - familyos_project_url   => https://<project-ref>.supabase.co
    - familyos_anon_jwt      => legacy anon JWT key from Supabase Settings > API

    We intentionally schedule the function hourly in UTC and let the Edge Function
    decide whether London-local time is within the 7:00 a.m. send window.
    This avoids DST-specific cron maintenance in the database layer.
  */
  select decrypted_secret
  into project_url
  from vault.decrypted_secrets
  where name = 'familyos_project_url';

  select decrypted_secret
  into anon_jwt
  from vault.decrypted_secrets
  where name = 'familyos_anon_jwt';

  if project_url is null then
    raise exception 'Missing Vault secret: familyos_project_url';
  end if;

  if anon_jwt is null then
    raise exception 'Missing Vault secret: familyos_anon_jwt';
  end if;

  select net.http_post(
    url := project_url || '/functions/v1/send-telegram-digests',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || anon_jwt,
      'apikey', anon_jwt
    ),
    body := jsonb_build_object(
      'source', 'pg_cron',
      'triggered_at', now()
    )
  )
  into request_id;

  return request_id;
end;
$$;

comment on function public.invoke_send_telegram_digests() is
  'Invokes the FamilyOS Telegram digest Edge Function using Vault-managed secrets.';

do $$
begin
  if exists (
    select 1
    from cron.job
    where jobname = 'familyos-send-telegram-digests-hourly'
  ) then
    perform cron.unschedule('familyos-send-telegram-digests-hourly');
  end if;
end
$$;

select cron.schedule(
  'familyos-send-telegram-digests-hourly',
  '0 * * * *',
  $$
  select public.invoke_send_telegram_digests();
  $$
);
