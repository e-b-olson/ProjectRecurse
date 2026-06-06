#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

docker compose -f docker-compose.supabase.yml run --rm supabase stop
