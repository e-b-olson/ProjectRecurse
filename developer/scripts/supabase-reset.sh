#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "This stops the local stack and removes Supabase Docker volumes for this project." >&2
read -r -p "Continue? [y/N] " reply
if [[ ! "${reply,,}" =~ ^y(es)?$ ]]; then
  echo "Aborted."
  exit 0
fi

docker compose -f docker-compose.supabase.yml run --rm supabase stop --no-backup
