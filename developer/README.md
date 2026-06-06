# Developer environment (Docker)

Docker setup for the Next.js app and a **local Supabase** stack used for development and integration tests.

## Prerequisites

- Docker Desktop (or Docker Engine) with the daemon running
- ~4 GB RAM free for the Supabase stack (Postgres, Auth, PostgREST, Realtime, Storage, Studio, Inbucket)

## Local Supabase

Configuration lives in `app/supabase/config.toml` (API **54321**, Postgres **54322**, Studio **54323**, Inbucket **54324**).

### Start / stop

From this directory:

```bash
chmod +x scripts/supabase-*.sh   # once
./scripts/supabase-start.sh
./scripts/supabase-status.sh     # copy API URL, anon key, service_role key, DB URL
./scripts/supabase-stop.sh
```

Equivalent without the helper scripts:

```bash
docker compose -f docker-compose.supabase.yml run --rm supabase start
docker compose -f docker-compose.supabase.yml run --rm supabase status
docker compose -f docker-compose.supabase.yml run --rm supabase stop
```

Or from `app/` if you have the CLI installed locally:

```bash
npx supabase start
npx supabase status
```

### Apply app schema (Drizzle)

After Supabase is running, apply migrations from the app container or host:

```bash
# Host (from app/, after copying keys from supabase status):
export DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
npm run db:migrate

# Or via the app Docker image:
./scripts/migrate.sh
```

Set `DATABASE_URL` in `app/.env.local` to the same DB URL when running migrations inside Docker.

### App and integration-test env

Copy examples and fill in values from `supabase status`:

| File | Use |
|------|-----|
| `app/.env.local.example` | Next.js app (host) |
| `app/.env.local.docker.example` | Next.js app inside `docker compose` app service |
| `integration-tests/.env.example` | Vitest suite |

### Reset local data

```bash
./scripts/supabase-reset.sh
./scripts/supabase-start.sh
npm run db:migrate   # from ProjectRecurse/ or ./scripts/migrate.sh
```

## Next.js app container

```bash
# Ensure app/.env.local exists (see examples above)
docker compose up app
```

Open [http://localhost:3000](http://localhost:3000). When the app runs in Docker, Supabase must be reachable at `host.docker.internal` (see `.env.local.docker.example`).

## Layout

| Path | Purpose |
|------|---------|
| `Dockerfile` | Node 22 image for the app |
| `docker-compose.yml` | App (and test) dev services |
| `docker-compose.supabase.yml` | Supabase CLI runner (starts stack on Docker host) |
| `scripts/supabase-*.sh` | Start / stop / status / reset helpers |
| `scripts/dx.sh` | Run arbitrary commands in the app container |
| `scripts/migrate.sh` | Run Drizzle migrations in the app container |
