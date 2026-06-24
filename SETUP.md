# Setup

This guide covers everything you need to run `komodo` locally.

---

## Prerequisites

- Docker + Docker Compose
- Stripe account (for test keys)

---

## Architecture Overview

All services are containerized and managed by Docker Compose. Nginx is the single entry point for all browser traffic.

| Service      | Description                        | URL / Port                                     |
| ------------ | ---------------------------------- | ---------------------------------------------- |
| **nginx**    | Reverse proxy — single entry point | `http://localhost` (port `80`)                 |
| **frontend** | React + Vite static assets         | `http://localhost`                             |
| **backend**  | Spring Boot API                    | `http://localhost/api/` (internal port `8080`) |
| **postgres** | PostgreSQL 17 database             | `localhost:5432` (IDE/DBeaver access)          |
| **pgAdmin**  | Database browser                   | `http://localhost:5050`                        |

The frontend communicates exclusively through **nginx on port `80`** — it never talks directly to the backend container.

---

## Startup

From the project root:

```bash
docker compose up -d --build
```

This builds and starts all five services in the correct order:

1. **PostgreSQL 17** starts first and passes its healthcheck
2. **Backend** (Spring Boot) starts after Postgres — Flyway runs migrations on startup
3. **Frontend** (Nginx serving Vite static assets) starts after the backend
4. **Root Nginx** starts last — proxies `/api/*` and `/webhooks/*` to the backend, everything else to the frontend

To stop all services:

```bash
docker compose down
```

> **Note:** `docker compose down` preserves the database. The `postgres_data` named volume persists across restarts. To wipe the database, run `docker compose down -v`.

---

## Environment Variables

Create a `.env` file at the project root (never commit this file):

```dotenv
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Postgres
POSTGRES_DB=komodo
POSTGRES_USER=komodo_user
POSTGRES_PASSWORD=komodo_pass

# pgAdmin
PGADMIN_DEFAULT_EMAIL=admin@local.dev
PGADMIN_DEFAULT_PASSWORD=adminpass

# Spring
SPRING_PROFILES_ACTIVE=dev
```

### Variable Reference

| Variable                   | Description                                                |
| -------------------------- | ---------------------------------------------------------- |
| `STRIPE_SECRET_KEY`        | Stripe secret key (`sk_test_...`) — backend only           |
| `STRIPE_WEBHOOK_SECRET`    | Stripe webhook signing secret (`whsec_...`) — backend only |
| `POSTGRES_DB`              | PostgreSQL database name                                   |
| `POSTGRES_USER`            | PostgreSQL username                                        |
| `POSTGRES_PASSWORD`        | PostgreSQL password                                        |
| `PGADMIN_DEFAULT_EMAIL`    | pgAdmin login email                                        |
| `PGADMIN_DEFAULT_PASSWORD` | pgAdmin login password                                     |
| `SPRING_PROFILES_ACTIVE`   | Spring profile (`dev` locally)                             |

### Frontend Environment Variables

The frontend reads `VITE_STRIPE_PUBLISHABLE_KEY` at **build time** from `frontend/.env.local` — it is not injected by Docker Compose:

```dotenv
# frontend/.env.local — gitignored, never committed
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Service URLs

| Service         | URL                        | Notes                            |
| --------------- | -------------------------- | -------------------------------- |
| Frontend        | http://localhost           | Served by root Nginx             |
| Backend API     | http://localhost/api/      | Proxied by Nginx to backend:8080 |
| Stripe Webhooks | http://localhost/webhooks/ | Proxied by Nginx to backend:8080 |
| pgAdmin         | http://localhost:5050      | Direct, not behind Nginx         |
| PostgreSQL      | localhost:5432             | Direct, for IDE/DBeaver only     |

---

## Verifying the Setup

Once all containers are running:

```bash
# Check all services are up
docker compose ps

# Check backend logs (Flyway migrations + Spring startup)
docker compose logs -f backend

# Verify the API is reachable through nginx
curl http://localhost/api/v1/products
```

---

## Stripe Webhooks (Local Development)

Stripe can't reach `localhost` directly. Use the Stripe CLI to forward events:

```bash
stripe listen --forward-to localhost/webhooks/stripe
```

This gives you a `whsec_...` secret — put it in `.env` as `STRIPE_WEBHOOK_SECRET`.

---

## Database

Schema is managed by **Flyway** — migration files live in `backend/src/main/resources/db/migration/` and run automatically on backend startup. Hibernate never creates or alters tables (`ddl-auto: validate`).

To inspect the database, open pgAdmin at `http://localhost:5050` and connect to:

| Field    | Value         |
| -------- | ------------- |
| Host     | `postgres`    |
| Port     | `5432`        |
| Database | `komodo`      |
| Username | `komodo_user` |
| Password | `komodo_pass` |

---

## nginx Configuration

Two nginx configs exist in this project — they serve different purposes:

**`nginx/nginx.conf`** — root reverse proxy (routes traffic between frontend and backend):

```nginx
location /api/       → proxies to backend:8080
location /webhooks/  → proxies to backend:8080
location /           → proxies to frontend:80
```

**`frontend/nginx.conf`** — static file server inside the frontend container:

```nginx
location / {
    try_files $uri $uri/ /index.html;  # SPA fallback for React Router
}
```
