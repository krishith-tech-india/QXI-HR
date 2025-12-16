# QXI-HR Container Deployment

This repo now ships Docker builds for the API, UI, and PostgreSQL. Use the stack name `qxihr-stack` so it stays isolated from other projects on the VPS.

## Local (docker compose)
1. `cp .env.example .env` and fill secrets (security key, email, R2 keys).
2. `docker compose up -d --build`
3. UI is on `http://localhost:8081` (change `UI_PORT_HOST` in `.env` to avoid clashes). API is on `http://localhost:5215`.

## GitHub Actions deployment (VPS)
Secrets expected:
- `VPS_HOST`, `VPS_SSH_USER`, `VPS_SSH_KEY`
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `API_PORT_HOST`, `UI_PORT_HOST` (pick free ports to avoid other projects)
- `TRAEFIK_API_HOST`, `TRAEFIK_UI_HOST` if fronted by Traefik (defaults: `api.qxihr.com`, `qxihr.com`)
- `APPSETTINGS__APIUrl`, `APPSETTINGS__SecurityKey`, `APPSETTINGS__TokenExpiryHours`, `APPSETTINGS__ClientList__0`, `APPSETTINGS__ClientList__1`
- `EMAILSETTINGS__*` values, `CLOUDFLARER2__*` values
- Optional: `VITE_API_BASE_URL` for the UI build (defaults to `http://localhost:5215/`)

What the workflow does:
- Builds & pushes API/UI images to GHCR (`ghcr.io/<owner>/qxi-hr-api|ui`).
- Copies `docker-compose.yml` to `/opt/qxihr` on the VPS.
- Writes `/opt/qxihr/.env` with the secrets and ports above (only this stack is touched).
- Runs `docker compose -p qxihr-stack up -d --remove-orphans` so other projects are unaffected.

## Updating ports or data paths
- Adjust `API_PORT_HOST` and `UI_PORT_HOST` in the VPS secrets to avoid conflicts.
- Postgres data is stored in the named volume `qxihr_pgdata` and will not clash with other stacks.

## Traefik (existing on VPS)
- VPS already has Traefik running on ports 80/443 with external network `web` (used by other apps). Preferred prod deploy is to attach API/UI to that network and let Traefik route hostnames.
- Use the override file for Traefik: `docker-compose.traefik.yml` (adds labels, disables host ports, joins `web`).
- Ensure the `web` network exists (`docker network ls` shows it) before running the override.
- Example prod bring-up on VPS (no host ports published):
  ```
  docker compose -p qxihr-stack -f docker-compose.yml -f docker-compose.traefik.yml up -d
  ```
- Set `TRAEFIK_API_HOST`/`TRAEFIK_UI_HOST` in `.env` or secrets (defaults to `api.qxihr.com` / `qxihr.com`). Certs handled by Traefik via `le` resolver already configured.

## Database
- To use an external DB (e.g., Supabase), set `CONNECTIONSTRINGS__PostgreSQLConnection` in secrets/.env; the `db` service is gated behind the `local-db` profile so it won’t start in prod.
- For local Postgres container: run with profile `local-db` and leave the default connection string (`Host=db;...`), e.g.:
  ```
  docker compose --profile local-db up -d
  ```
