# FamilyOS Telegram Digests

## What The Feature Does

FamilyOS can send digest reminders to Telegram using the Telegram Bot API.

It covers:

- daily digests
- weekly digests
- monthly digests

The data comes from your existing FamilyOS `tasks` and `events` tables.

## Digest Behavior

### Daily

- runs once per day via cron
- sends items planned for tomorrow

### Weekly

- the same daily-triggered function checks the London-local date
- if the London-local day is Saturday, it also sends the weekly digest
- weekly window: Saturday through next Friday

### Monthly

- the same daily-triggered function checks the London-local date
- if the London-local day is the 1st, it also sends the monthly digest
- monthly window: the month

## Database Setup

Apply this migration:

- [`supabase/migrations/20250317120000_telegram_digest_support.sql`](/Users/Alok_Sharma/Documents/myrepo/FamilyOS/supabase/migrations/20250317120000_telegram_digest_support.sql)

This migration adds:

- `notification_log`
- digest window helper functions
- task/event digest helper functions

## Edge Function

Function path:

- [`supabase/functions/send-telegram-digests/index.ts`](/Users/Alok_Sharma/Documents/myrepo/FamilyOS/supabase/functions/send-telegram-digests/index.ts)

Deploy with:

```bash
cd /Users/Alok_Sharma/Documents/myrepo/FamilyOS
npx --yes supabase login
npx --yes supabase link --project-ref cnyanecvpotsfrjwzqdc
npx --yes supabase functions deploy send-telegram-digests --project-ref cnyanecvpotsfrjwzqdc
```

## Required Secrets

Configure these in Supabase Edge Function secrets:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

The hosted Supabase Edge Function environment already provides:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Cron Setup

Use the Supabase Dashboard scheduler / cron UI.

Create one job only:

- target: `send-telegram-digests`
- schedule: `0 6 * * *`

Note:

- [`supabase/migrations/20250317133000_schedule_telegram_digests.sql`](/Users/Alok_Sharma/Documents/myrepo/FamilyOS/supabase/migrations/20250317133000_schedule_telegram_digests.sql) is intentionally a no-op placeholder in this repo
- for FamilyOS, the real cron setup is managed in the Supabase Dashboard because the earlier Vault-based SQL scheduling approach is not portable across all Supabase projects

Why one job is enough:

- the function always handles the daily digest
- it also decides weekly/monthly sends internally based on the London-local date
- no separate weekly or monthly cron jobs are required

## Manual Testing

Before relying on cron, test from the Supabase Dashboard with:

```json
{
  "force": true,
  "digestTypes": ["daily"]
}
```

Also test:

```json
{
  "force": true,
  "digestTypes": ["weekly"]
}
```

```json
{
  "force": true,
  "digestTypes": ["monthly"]
}
```

Optional:

```json
{
  "force": true,
  "digestTypes": ["daily"],
  "runAt": "2026-03-01T06:00:00Z"
}
```

## What To Verify

After manual testing or cron setup, verify:

1. Telegram receives the message
2. `notification_log` records `sent` or `skipped`
3. repeat sends for the same period do not duplicate

Example verification query:

```sql
select
  digest_type,
  period_start,
  period_end,
  status,
  sent_at,
  created_at
from public.notification_log
order by created_at desc
limit 20;
```

## Important Note About Vault

For this FamilyOS project, use the Supabase Dashboard cron integration directly.

Do not rely on the Vault-based SQL cron approach if your project does not support the `vault` extension.
