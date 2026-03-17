# FamilyOS

FamilyOS is a private AI-native family operating system built on one shared Supabase Postgres database.

## One Database, Two Doors

FamilyOS is designed around one source of truth with two access paths:

- Web UI -> Supabase: the deployed Next.js app is the human door for browsing and updating family data.
- AI/LLM -> MCP -> Supabase: an MCP-capable AI client can use Supabase MCP to read and work with the same FamilyOS data.

This keeps the architecture simple. The database remains the system of record, the web app remains the human interface, and MCP becomes the AI access path instead of a separate application stack.

## Architecture

FamilyOS follows a "one database, two doors" model:

1. Supabase Postgres is the system of record.
2. The Next.js app provides the human-facing UI over the shared data.
3. Supabase MCP is the preferred AI access path when you want ChatGPT-compatible or agent-compatible tools over the same data.
4. Helper views in Supabase provide simpler read models for common AI workflows.

This keeps the foundation extendable for future domains like contacts, assets, shopping, documents, routines, school logistics, health reminders, and finance reminders without adding unnecessary infrastructure.

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

## MCP

FamilyOS is prepared for Supabase MCP usage without adding a custom MCP server.

- Use the hosted Supabase MCP endpoint against your `myworld` project.
- Prefer querying FamilyOS tables and the MCP-friendly helper views:
  - `upcoming_events_view`
  - `open_tasks_view`
  - `recent_knowledge_items_view`
- If you want AI write capability, connect without `read_only=true` and keep the connection project-scoped.
- Prefer structured SQL helper functions for writes:
  - `create_task(...)`
  - `create_event(...)`
  - `save_knowledge_item(...)`
  - `update_task_status(...)`
- Treat hosted Supabase MCP as a development/testing access path and review Supabase security guidance before connecting it to sensitive family data.
- Add a custom FamilyOS MCP server only later if you need higher-level domain tools, stricter guardrails, or workflow orchestration beyond direct Supabase access.

Detailed setup steps live in [`docs/mcp-setup.md`](/Users/Alok_Sharma/Documents/myrepo/FamilyOS/docs/mcp-setup.md).

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
