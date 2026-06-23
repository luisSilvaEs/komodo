# Komodo — Architecture

## Tech Stack

### Frontend

| Layer        | Technology                                  | Notes                                     |
| ------------ | ------------------------------------------- | ----------------------------------------- |
| Framework    | React 18+ with TypeScript                   | Component-based UI                        |
| Build Tool   | Vite                                        | Fast dev server and production bundler    |
| Routing      | React Router v6                             | Client-side routing                       |
| Server State | TanStack Query (React Query)                | Products, order status, async data        |
| Client State | Zustand                                     | Cart state                                |
| Styling      | Tailwind CSS                                | Utility-first CSS                         |
| Payments UI  | @stripe/react-stripe-js + @stripe/stripe-js | Payment Element (not legacy Card Element) |
| Container    | Nginx (alpine)                              | Serves static `dist/` files inside Docker |

### Backend

| Layer       | Technology                    | Notes                                                  |
| ----------- | ----------------------------- | ------------------------------------------------------ |
| Language    | Java 25                       | Latest LTS                                             |
| Framework   | Spring Boot 4.0               | REST API, auto-configuration                           |
| REST        | Spring Web                    | Controllers, request mapping                           |
| Persistence | Spring Data JPA               | Repositories, entity mapping                           |
| Security    | Spring Security               | Not in scope for Module 1; structure accommodates it   |
| Database    | PostgreSQL 17                 | Primary data store                                     |
| Migrations  | Flyway                        | Schema versioning; `ddl-auto: create` is never used    |
| Payments    | Stripe Java SDK               | PaymentIntent creation, webhook signature verification |
| Base Image  | eclipse-temurin:25-jdk-alpine | Build and runtime stages                               |

### Infrastructure

| Component        | Technology                               | Notes                                                                            |
| ---------------- | ---------------------------------------- | -------------------------------------------------------------------------------- |
| Containerization | Docker + Docker Compose                  | All services run in containers from Module 1                                     |
| Reverse Proxy    | Nginx (alpine)                           | Single entry point; routes `/api/` and `/webhooks/` to backend, `/*` to frontend |
| Database UI      | pgAdmin 4                                | Available at `http://localhost:5050`                                             |
| Network          | Docker bridge network (`komodo_network`) | All services communicate by service name                                         |

### Stripe Keys

| Key             | Prefix        | Location                                                  |
| --------------- | ------------- | --------------------------------------------------------- |
| Publishable key | `pk_test_...` | Frontend env var (`VITE_STRIPE_PUBLISHABLE_KEY`)          |
| Secret key      | `sk_test_...` | Backend env var (`STRIPE_SECRET_KEY`) — never in frontend |
| Webhook secret  | `whsec_...`   | Backend env var (`STRIPE_WEBHOOK_SECRET`)                 |

---

## Project Structure

```
komodo/
├── docker-compose.yml              # Orchestrates all services
├── .env                            # STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET (never commit)
├── .gitignore
│
├── nginx/
│   └── nginx.conf                  # Reverse proxy config
│                                   # Routes: /webhooks/* and /api/* → backend
│                                   #         /*                      → frontend
│
├── frontend/                       # Vite + React + TypeScript
│   ├── Dockerfile                  # Multi-stage: node:22-alpine → nginx:alpine
│   ├── nginx.conf                  # Static file server config (serves dist/, handles React Router)
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── types/                  # Shared TypeScript interfaces (PascalCase)
│       │   ├── Product.ts
│       │   ├── Order.ts
│       │   └── Cart.ts
│       ├── api/                    # TanStack Query hooks
│       │   ├── useProducts.ts
│       │   ├── useCreateOrder.ts
│       │   └── useOrderStatus.ts
│       └── features/
│           ├── catalog/            # Product listing page and cards
│           │   ├── CatalogPage.tsx
│           │   └── ProductCard.tsx
│           ├── cart/               # Cart state (Zustand store)
│           │   └── cartStore.ts
│           └── checkout/           # Stripe Payment Element integration
│               ├── CheckoutPage.tsx
│               └── PaymentForm.tsx
│
└── backend/                        # Spring Boot
    ├── Dockerfile                  # Multi-stage: eclipse-temurin:25-jdk-alpine (build + run)
    ├── pom.xml
    └── src/
        └── main/
            ├── java/com/komodo/
            │   ├── KomodoApplication.java
            │   ├── catalog/        # Product entity, repository, service, controller
            │   │   ├── Product.java
            │   │   ├── ProductRepository.java
            │   │   ├── ProductService.java
            │   │   └── ProductController.java
            │   ├── order/          # Order lifecycle
            │   │   ├── Order.java
            │   │   ├── OrderStatus.java   # PENDING_PAYMENT → CONFIRMED → CANCELLED / REFUNDED
            │   │   ├── OrderRepository.java
            │   │   ├── OrderService.java
            │   │   └── OrderController.java
            │   ├── payment/        # Stripe PaymentIntent + webhook handler
            │   │   ├── PaymentService.java
            │   │   ├── PaymentController.java
            │   │   └── StripeWebhookController.java
            │   └── common/         # Shared utilities
            │       ├── exception/
            │       │   └── GlobalExceptionHandler.java
            │       └── money/
            │           └── MoneyUtils.java
            └── resources/
                ├── application.yml
                └── db/migration/   # Flyway migrations
                    └── V1__init.sql
```

---

## Traffic Flow

```
Browser
  └──→ nginx (port 80) — single entry point
         ├── /webhooks/*  ──→ backend:8080  (Stripe and future external systems)
         ├── /api/*       ──→ backend:8080  (REST API)
         └── /*           ──→ frontend:80   (React SPA static files)
```

All services communicate inside `komodo_network` by service name. Only three ports are exposed to the host:

```
Host machine (your browser)
    │
    │ :80
    ▼
┌─────────────────────────────────────────────────────┐
│                   komodo_network                    │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │              nginx (reverse proxy)            │  │
│  │                                               │  │
│  │  /webhooks/*  ──────────────────────────────┐ │  │
│  │  /api/*       ──────────────────────────┐   │ │  │
│  │  /*           ──────────────────┐       │   │ │  │
│  └─────────────────────────────────┼───────┼───┘ │  │
│                                    │       │       │  │
│                          ┌─────────▼──┐  ┌─▼────────┐  │
│                          │  frontend  │  │ backend  │  │
│                          │   :80      │  │  :8080   │  │
│                          └────────────┘  └────┬─────┘  │
│                                               │        │
│                                    ┌──────────▼──────┐ │
│                                    │    postgres      │ │
│                                    │     :5432        │ │
│                                    └─────────────────┘ │
│                                                     │
│  ┌──────────┐                                       │
│  │ pgadmin  │ (:5050 exposed to host)               │
│  └──────────┘                                       │
└─────────────────────────────────────────────────────┘
```

Only three ports are exposed to the host machine:

| Port   | Service  | Purpose                         |
| ------ | -------- | ------------------------------- |
| `80`   | nginx    | All browser traffic             |
| `5432` | postgres | Direct access for IDE / DBeaver |
| `5050` | pgAdmin  | Database GUI                    |

---

## Key Implementation Rules

### Money

- Always store as **integers (cents/centavos)** — never `float` or `double`
- Use `BIGINT` in PostgreSQL for monetary columns
- Format to display strings (`$19.99`) only at the presentation layer

### Orders and Payments

- `payments` table is separate from `orders` — one order can have multiple payment attempts
- **Never confirm an order on a frontend redirect** — only on a verified Stripe webhook event
- Implement idempotency on webhook handling — the same event may arrive more than once

### Database

- Schema managed exclusively by **Flyway** migrations under `src/main/resources/db/migration/`
- Migration files follow the pattern `V{version}__{description}.sql`
- `spring.jpa.hibernate.ddl-auto` is always `validate` or `none` — never `create` or `update`

---

## Planned Modules

| Module            | Scope                                                                               |
| ----------------- | ----------------------------------------------------------------------------------- |
| 1 — B2C Payments  | Product catalog, cart, checkout, Stripe PaymentIntent, webhooks, order confirmation |
| 2 — Auth & Roles  | JWT-based auth via jwt-oauth-mfa-app backend, user roles (customer, admin)          |
| 3 — B2B           | Organizations, multi-user accounts, role-based access (buyer, approver, finance)    |
| 4 — Quotes & POs  | Pre-order pricing, purchase order approval flows                                    |
| 5 — Invoicing     | Invoice generation, net-30/60 terms, payment matching                               |
| 6 — CFDI (Mexico) | Electronic invoice emission via a PAC (e.g. Facturapi)                              |
| 7 — Ledger        | Double-entry accounting basics, reconciliation                                      |
| 8 — Dunning       | Failed payment retries and notification flows                                       |
