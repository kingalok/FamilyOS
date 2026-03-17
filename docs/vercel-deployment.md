# FamilyOS Vercel Deployment

## Required Vercel Environment Variables

Set these in the Vercel project:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Do not put the Supabase service role key in the browser environment.

## Redeploy Checklist

1. Push the latest FamilyOS code to GitHub.
2. Open the FamilyOS project in Vercel.
3. Go to Settings -> Environment Variables.
4. Verify:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
5. Trigger a redeploy.

## Post-Deploy Smoke Test

After deployment:

1. Open the app.
2. Confirm unauthenticated access redirects to `/login`.
3. Sign in with your Supabase email/password user.
4. Open:
   - `/`
   - `/people`
   - `/tasks`
5. Create or edit one record to confirm authenticated RLS-backed access works.
6. Click logout and confirm you return to `/login`.

## If Login Fails

Check:

- email/password auth is enabled in Supabase
- the user exists in Supabase Auth
- RLS policies allow the `authenticated` role to access FamilyOS tables
- Vercel env vars match the same Supabase project used by FamilyOS
