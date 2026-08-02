# Astro-Track-Frontend

Angular frontend application for the Astro Track astronomy management platform.

## Continuous Integration

Frontend CI runs on pushes to `main` and pull requests targeting `main`.
The workflow installs dependencies, validates the Angular production build, and runs the automated test suite.

Workflow file:

- `.github/workflows/frontend-ci.yml`

## Docker Compose orchestration (Issue #9)

This repository contains a Docker Compose stack that orchestrates:

- Angular frontend on `http://localhost:4200`
- ASP.NET Core backend on `http://localhost:5000`
- Oracle Database Free exposed on `localhost:${ORACLE_HOST_PORT}` (container port `1521`)

### Why Oracle schema is not auto-run at startup

`Astro_Track_Project.sql` starts with destructive `DROP TABLE ... PURGE` statements and includes demonstration inserts/operations.
Automatically running that script on every container start is unsafe, especially with persistent volumes.

Safe approach used here:

- Start Oracle container with persistent storage.
- Run schema script manually once when you intentionally initialize a fresh local database.

## Files used by orchestration

- `docker-compose.yml`
- `Dockerfile` (frontend)
- `docker/backend.Dockerfile` (builds backend image from sibling repo context)
- `.env.example`

Database bootstrap script ownership:

- Owned by sibling repository: `Astro-Track-Oracle-SQL`
- Script path in that repo: `sql/docker-compose/init_celestial_objects_bootstrap.sql`

## Local secrets setup

1. Copy `.env.example` to `.env`.
2. Replace placeholder values with local-only secrets.
3. Keep `.env` uncommitted.

Required `.env` variables:

- `ORACLE_PASSWORD`
- `ORACLE_HOST_PORT` (default `1522`)
- `ORACLE_APP_USER`
- `ORACLE_APP_PASSWORD`

If port `1522` is already in use on your machine, set `ORACLE_HOST_PORT` to an available port (for example `1523`).

## Start the stack

From this folder (`Astro-Track-Frontend`):

```powershell
docker compose up -d --build
```

## Manual one-time schema initialization (safe mode)

Run this only when initializing a fresh Oracle data volume.

Recommended for local API verification (deterministic, minimal scope):

```powershell
docker compose exec -T oracle bash -lc "sqlplus ${ORACLE_APP_USER}/${ORACLE_APP_PASSWORD}@localhost/FREEPDB1 @/workspace/sql/docker-compose/init_celestial_objects_bootstrap.sql"
```

This bootstrap script is non-destructive and safe to rerun:

- It does not use DROP TABLE, DROP USER, or PURGE.
- Reruns must not delete existing rows.
- Reruns must not insert duplicate rows.
- Expected local bootstrap dataset size: 21 CELESTIALOBJECTS rows.

Optional full project script (destructive and may contain non-essential/demo SQL blocks):

```powershell
docker compose exec -T oracle bash -lc "sqlplus ${ORACLE_APP_USER}/${ORACLE_APP_PASSWORD}@localhost/FREEPDB1 @/workspace/sql/Astro_Track_Project.sql"
```

The backend container uses Oracle service discovery inside Compose network with:

- `Data Source=oracle:1521/FREEPDB1`

## Verification endpoints

- `http://localhost:5000/health`
- `http://localhost:5000/health/database`
- `http://localhost:5000/api/celestial-objects`
- `http://localhost:4200/celestial-objects`

## Common commands

```powershell
docker compose config
docker compose build
docker compose up -d
docker compose ps
docker compose logs backend --tail 200
docker compose logs oracle --tail 200
```

Stop stack:

```powershell
docker compose down
```

Stop stack and remove volume (fresh Oracle reset):

```powershell
docker compose down -v
```
