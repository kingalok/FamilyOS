# FamilyOS

FamilyOS is a private AI-native family operating system built on one shared Supabase Postgres database.

It is structured around two access paths to the same source of truth:

- Human door: a Next.js web application
- AI door: a Python agent/service layer that can later be exposed through MCP

The important design choice is that MCP is not the business logic. Core logic lives in reusable Python services, while the web app and future MCP layer both depend on the same shared data model.

## Architecture

FamilyOS follows a "one database, two doors" model:

1. Supabase Postgres is the system of record.
2. The Next.js app provides the human-facing UI over the shared data.
3. The Python agent layer talks to the same database through reusable domain services.
4. A future MCP layer should wrap domain tools rather than expose raw SQL as the main interface.

This keeps the foundation extendable for future domains like contacts, assets, shopping, documents, routines, school logistics, health reminders, and finance reminders.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Postgres
- SQL migrations in `supabase/migrations`
- Seed data in `supabase/seed.sql`
- Python 3.11+ scaffold with `psycopg`, `langgraph`, and `langchain-core`

## Project Structure

```text
FamilyOS/
  app/
  components/
  lib/
  public/
  supabase/
    migrations/
    seed.sql
  agent/
    app/
      graph/
      services/
      tools/
      cli.py
  README.md
  .env.example
  package.json
```

## Current Domains

- People
- Events
- Tasks
- Knowledge Items

## Frontend Setup

1. Create local environment variables:

```bash
cp .env.example .env.local
```

2. Fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
DATABASE_URL=...
```

3. Install frontend dependencies:

```bash
npm install
```

4. Run the Next.js app:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Python Agent Setup

The agent scaffold expects Python 3.11+.

Using `uv`:

```bash
cd agent
uv sync
uv run familyos-agent list-open-tasks
uv run familyos-agent upcoming-events
uv run familyos-agent run-graph --request "show me upcoming events"
```

Using `pip`:

```bash
cd agent
python3.11 -m venv .venv
source .venv/bin/activate
pip install -e .
familyos-agent list-open-tasks
```

## Supabase Setup For `myworld`

Manual Supabase steps:

1. Create or open the Supabase project/environment named `myworld`.
2. Copy the project URL into `NEXT_PUBLIC_SUPABASE_URL`.
3. Copy the publishable key into `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
4. Copy the Postgres connection string into `DATABASE_URL`.
5. For this internal POC, keep auth minimal for now. If you enable RLS later, add policies that match your chosen access pattern.

## Run Migrations

With Supabase CLI:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

Or run the migration manually in Supabase SQL editor:

- [`supabase/migrations/20250316180000_init_familyos.sql`](/Users/Alok_Sharma/Documents/myrepo/FamilyOS/supabase/migrations/20250316180000_init_familyos.sql)

## Seed Data

If you use the Supabase CLI and want a clean local reset:

```bash
supabase db reset
```

Or run the seed file directly:

- [`supabase/seed.sql`](/Users/Alok_Sharma/Documents/myrepo/FamilyOS/supabase/seed.sql)

The seed includes:

- Alok Sharma
- Shilpa
- Aarav
- Sample tasks
- Sample events
- Sample knowledge items

## Web App Routes

- `/`
- `/people`
- `/people/new`
- `/people/[id]`
- `/events`
- `/events/new`
- `/events/[id]`
- `/tasks`
- `/tasks/new`
- `/tasks/[id]`
- `/knowledge`
- `/knowledge/new`
- `/knowledge/[id]`

## Dashboard Coverage

- Upcoming events
- Open tasks
- Overdue tasks
- Recently updated knowledge items
- People count

## Vercel Deployment

1. Push this repo to GitHub.
2. Import it into Vercel.
3. Keep the project root at the repository root.
4. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
5. Deploy.

Notes:

- The frontend is Vercel-friendly.
- `DATABASE_URL` is only required for the Python agent or any future backend process using the service layer.

## MCP Later

Recommended future direction:

1. Use Supabase MCP directly for trusted low-level access when appropriate.
2. Add a custom FamilyOS MCP server later only if you want higher-level domain tools and guardrails.
3. Wrap the methods in [`agent/app/tools/familyos_tools.py`](/Users/Alok_Sharma/Documents/myrepo/FamilyOS/agent/app/tools/familyos_tools.py), not raw SQL.

The seam for that is already shown in [`agent/app/mcp_stub.py`](/Users/Alok_Sharma/Documents/myrepo/FamilyOS/agent/app/mcp_stub.py).

## Key Commands

Frontend:

```bash
npm install
npm run dev
npm run build
```

Supabase:

```bash
supabase db push
supabase db reset
```

Python:

```bash
cd agent
uv sync
uv run familyos-agent list-open-tasks
uv run familyos-agent run-graph --request "show open tasks"
```

## Notes

- Secrets are environment-variable driven only.
- Core searchable data lives in standard SQL columns.
- `jsonb metadata` is used for extensibility.
- The Python graph is intentionally thin and readable.
- Core Python services are the right future seam for MCP wrapping.
