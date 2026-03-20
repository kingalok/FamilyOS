# send-telegram-digests

Supabase Edge Function for FamilyOS Telegram digests.

## Required Secrets

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

## Behavior

- Uses `Europe/London` as the business timezone
- Daily digest: every day the function runs, for tomorrow
- Weekly digest: when the London-local day is Saturday, for Saturday through Friday
- Monthly digest: when the London-local day is the 1st, for the month

## No-Items Behavior

If there are no tasks or events in the digest window, the function does not send a Telegram message.
It logs the period as `skipped` in `notification_log`.

## Suggested Scheduling

The simplest setup is one cron invocation once per day in UTC.
For FamilyOS, a daily cron such as `0 6 * * *` is enough.
The function decides internally whether weekly and/or monthly digests are also due based on the London-local date.

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
