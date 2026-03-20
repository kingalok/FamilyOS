# send-telegram-digests

Supabase Edge Function for FamilyOS Telegram digests.

## Required Secrets

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

## Behavior

- Uses `Europe/London` as the business timezone
- Daily digest: every day at 7:00 a.m. London time for tomorrow
- Weekly digest: every Saturday at 7:00 a.m. London time for Saturday through Friday
- Monthly digest: on the 1st at 7:00 a.m. London time for the month

## No-Items Behavior

If there are no tasks or events in the digest window, the function does not send a Telegram message.
It logs the period as `skipped` in `notification_log`.

## Suggested Scheduling

The simplest setup is one cron invocation at 7:00 a.m. London time each day.
The function decides internally whether daily, weekly, and/or monthly digests are due.

If you also invoke it manually for testing, use a POST body such as:

```json
{
  "force": true
}
```

You can also force only specific digest types:

```json
{
  "force": true,
  "digestTypes": ["daily"]
}
```

Supported values:

- `daily`
- `weekly`
- `monthly`

Optional test override:

```json
{
  "force": true,
  "digestTypes": ["weekly", "monthly"],
  "runAt": "2026-03-01T07:00:00Z"
}
```
