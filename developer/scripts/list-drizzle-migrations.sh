#!/usr/bin/env bash

set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL environment variable is not set"
  exit 1
fi

psql "$DATABASE_URL" -c "
SELECT
  id,
  hash,
  created_at
FROM __drizzle_migrations
ORDER BY created_at;
"