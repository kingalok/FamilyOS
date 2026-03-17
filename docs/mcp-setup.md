# FamilyOS MCP Setup

## Current Architecture

FamilyOS already has the first access path working:

- Web UI -> Supabase

In this repo, the web app uses:

- [`lib/supabase/server.ts`](/Users/Alok_Sharma/Documents/myrepo/FamilyOS/lib/supabase/server.ts) for server-side Supabase access
- [`lib/supabase/client.ts`](/Users/Alok_Sharma/Documents/myrepo/FamilyOS/lib/supabase/client.ts) for browser-side access
- [`lib/data.ts`](/Users/Alok_Sharma/Documents/myrepo/FamilyOS/lib/data.ts) for shared reads against `people`, `events`, `tasks`, and `knowledge_items`
- [`app/actions.ts`](/Users/Alok_Sharma/Documents/myrepo/FamilyOS/app/actions.ts) for writes from the web UI

So the current production path is:

`Next.js web UI -> Supabase Postgres`

## Missing MCP Path

The missing second door is:

`AI/LLM -> MCP -> Supabase`

That does not require a custom FamilyOS MCP server yet.

For the simplest correct setup, use the hosted Supabase MCP capability so your AI client can connect to the same Supabase project that powers the web app.

Important: Supabase documents the hosted MCP path as a development and testing tool, not something to expose casually against sensitive production data. For FamilyOS, that means you should be deliberate if `myworld` contains real household information.

## How Supabase MCP Fits Into FamilyOS

FamilyOS is a good fit for Supabase MCP because the core data already lives in one shared database.

This means:

- the web app stays the human door
- Supabase MCP becomes the AI door
- both paths operate on the same underlying FamilyOS records

For FamilyOS, Supabase MCP should be used primarily as a direct data access layer for:

- reading `people`
- reading and updating `tasks`
- reading and updating `events`
- reading and updating `knowledge_items`
- querying the helper views added for AI-friendly read access

Supabase MCP can also write to the FamilyOS database. You do not need a custom FamilyOS MCP server for that. The hosted Supabase MCP server exposes database tools such as `execute_sql`, which means your MCP client can insert and update records against the same project used by the web app.

## AI-Friendly Views Added

This repo includes a helper migration:

- [`supabase/migrations/20250316203000_mcp_helper_views.sql`](/Users/Alok_Sharma/Documents/myrepo/FamilyOS/supabase/migrations/20250316203000_mcp_helper_views.sql)

It creates:

- `upcoming_events_view`
- `open_tasks_view`
- `recent_knowledge_items_view`

These views are useful because they give AI tools stable, intent-friendly read models without needing to reconstruct joins and filters every time.

## AI-Friendly Write Helpers Added

This repo also includes a write-helper migration:

- [`supabase/migrations/20250316204500_mcp_write_helpers.sql`](/Users/Alok_Sharma/Documents/myrepo/FamilyOS/supabase/migrations/20250316204500_mcp_write_helpers.sql)

It creates:

- `create_task(...)`
- `create_event(...)`
- `save_knowledge_item(...)`
- `update_task_status(...)`

These functions are useful for MCP because they give your AI client a smaller and more stable write surface than free-form `insert` or `update` statements every time.

## Manual Steps You Still Need To Do

These steps happen outside the repo.

### In Supabase

1. Ensure your FamilyOS schema migrations are applied to the `myworld` project.
2. Apply the helper view migration if it is not already applied.
3. Apply the write-helper migration if you want structured MCP write operations.
4. Decide whether MCP should point at a development branch, a non-production project, or your live project in read-only mode.
5. Review Supabase MCP security guidance before connecting an AI client.

### In Your AI Client

1. Use an MCP-capable client such as Cursor, Claude Code, or another client that supports remote MCP servers.
2. Configure the client to connect to the hosted Supabase MCP endpoint.
3. Scope the connection to your `myworld` project reference.
4. Choose read-only mode if you only want analysis, or omit `read_only=true` if you want MCP write capability.
5. Limit features to what you actually need, ideally database-only for FamilyOS at the beginning.
6. Authenticate through the Supabase browser login flow when prompted.
7. Verify the client can see your FamilyOS schema, helper views, and write-helper functions.

Example hosted configuration shape:

```text
https://mcp.supabase.com/mcp?project_ref=<your-project-ref>&read_only=true&features=database
```

If you intentionally want write access for trusted internal workflows, use:

```text
https://mcp.supabase.com/mcp?project_ref=<your-project-ref>&features=database
```

That allows the MCP client to use database tools for inserts and updates. For FamilyOS, prefer calling the helper functions above rather than generating arbitrary write SQL whenever possible.

## Authentication Notes

For the hosted Supabase MCP flow, Supabase currently documents that browser login is the normal path and a personal access token is no longer required for standard interactive setup.

You may still need manual credentials in special cases such as:

- CI environments
- MCP clients that require manual headers
- clients that require manual OAuth app configuration

In those cases, the useful values are:

- `SUPABASE_PROJECT_REF`
- `SUPABASE_ACCESS_TOKEN`

## Recommended First MCP Queries

Once connected, test with prompts like:

- "List the tables in the FamilyOS database using MCP."
- "Show me open tasks from `open_tasks_view`."
- "Show upcoming family events from `upcoming_events_view`."
- "Show recent active knowledge items from `recent_knowledge_items_view`."
- "Create a new FamilyOS task by calling `create_task(...)`."
- "Mark a task done by calling `update_task_status(...)`."

## What This Repo Does Not Do Yet

This repo does not yet:

- register an MCP client for you
- create Supabase OAuth apps for you
- enforce production-safe RLS policies for MCP usage
- provide a custom FamilyOS MCP server

That is intentional. The goal here is to keep FamilyOS simple and ready for Supabase MCP, not to build another infrastructure layer prematurely.
