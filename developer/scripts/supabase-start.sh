#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if ! docker info >/dev/null 2>&1; then
  echo "Docker is not running. Start Docker Desktop (or the daemon) and retry." >&2
  exit 1
fi

docker compose -f docker-compose.supabase.yml run --rm supabase start

echo ""
echo "Run ./scripts/supabase-status.sh for API URL, keys, and DATABASE_URL."
