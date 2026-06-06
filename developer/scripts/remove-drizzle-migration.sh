#!/usr/bin/env bash

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <migration_hash>"
  exit 1
fi

MIGRATION_HASH="$1"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL environment variable is not set"
  exit 1
fi

echo "Removing migration: $MIGRATION_HASH"

psql "$DATABASE_URL" <<SQL
DELETE FROM __drizzle_migrations
WHERE hash = '$MIGRATION_HASH';
SQL

echo "Done."