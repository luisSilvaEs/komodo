# =============================================================================
# Stage 1 — Build
# =============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first to leverage Docker layer caching.
# node_modules are only reinstalled when package.json or lockfile changes.
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build the static assets
COPY . .
RUN npm run build

# =============================================================================
# Stage 2 — Serve
# =============================================================================
FROM nginx:alpine AS runtime

# Copy built assets from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the static file server config (not the reverse proxy one)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80