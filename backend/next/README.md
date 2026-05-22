# Developer environment (Docker)

Docker setup for the Next.js app

## Prerequisites

- Docker Desktop (or Docker Engine) with the daemon running

## Build Docker Container

From the root directory:

```bash
docker build -f backend/next/Dockerfile .  
```

## Build the Next Backend

```bash
docker-compose -f backend/next/docker-compose.yml build next
```

## Start the Next Backend

```bash
docker-compose -f backend/next/docker-compose.yml up next

```

Open [http://localhost:3000](http://localhost:3000). When the app runs in Docker.

## Layout

| Path | Purpose |
|------|---------|
| `Dockerfile` | Node 22 image for the app |
| `docker-compose.yml` | App (and test) dev services |
