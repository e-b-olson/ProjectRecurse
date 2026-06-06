# Supabase integration tests

Standalone test suite for **ProjectRecurse** Supabase integrations (PostgREST + Auth + RLS). It lives outside `app/` so the app’s `package.json` and source files stay untouched.

## Safety: no live/production data

Tests **refuse to run** unless all of the following are true:

1. `INTEGRATION_TESTS_ENABLED=true` in `integration-tests/.env.local`
2. `SUPABASE_URL` points at **local** Supabase (`localhost` / `127.0.0.1`), **or** you set `SUPABASE_ALLOWED_PROJECT_REF` to a **dedicated non-production** project ref

All writes use isolated fixtures (`integration-<run>-…@test.local`) and **teardown deletes** test users (cascading related rows) and beta registration rows via the service role. Do not point this suite at production.

## Prerequisites

1. **Local Supabase** (recommended):

   ```bash
   cd app
   npx supabase start
   npx supabase status   # copy API URL, anon key, service_role key
   ```

2. **Schema** on that database (same migrations as the app):

   ```bash
   cd app
   # DATABASE_URL from `supabase status` → DB URL (port 54322 locally)
   npm run db:migrate
   ```

## Setup

```bash
cd integration-tests
cp .env.example .env.local
# Edit .env.local with values from `supabase status`
npm install
```

Example `.env.local` for local Supabase:

```env
INTEGRATION_TESTS_ENABLED=true
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service_role key>
```

## Run

```bash
npm test              # full suite
npm run test:smoke    # connectivity only
npm run test:watch    # watch mode
npm run typecheck
```

## Layout

| Path | Purpose |
|------|---------|
| `src/support/env.ts` | Opt-in + host/project-ref guards |
| `src/support/clients.ts` | Anon, authenticated, and service-role clients |
| `src/support/fixtures.ts` | Test users, projects, tasks |
| `src/support/cleanup.ts` | Deletes fixture data after the run |
| `src/suites/smoke/` | API reachability and schema exposure |
| `src/suites/public/` | `beta_registrations` (anon insert) |
| `src/suites/auth/` | `profiles` trigger and policies |
| `src/suites/rls/` | `projects`, `tasks`, `task_volunteers`, `skills`, `task_skills` |

## CI suggestion

Run only when a local or staging Supabase is available; inject secrets from CI vars named `SUPABASE_*` for a **test** project, never production. Keep `INTEGRATION_TESTS_ENABLED=true` scoped to that job.
