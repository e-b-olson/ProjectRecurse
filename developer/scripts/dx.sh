#!/usr/bin/env bash

if [ ! -f .env ]; then
  cat > .env <<EOF
UID=$(id -u)
GID=$(id -g)
EOF
fi

if [ -t 0 ]; then
  docker compose run --rm app "$@"
else
  docker compose run --rm -T app "$@"
fi

