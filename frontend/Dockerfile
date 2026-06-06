# ─── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

# Enable corepack so pnpm is available without a separate install step
RUN corepack enable

WORKDIR /app

# Copy lockfile and manifest first — same caching strategy as the backend
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build the Vite bundle
COPY . .
RUN pnpm build

# ─── Stage 2: Serve ────────────────────────────────────────────────────────────
FROM nginx:alpine AS runtime

# Remove the default Nginx placeholder page
RUN rm -rf /usr/share/nginx/html/*

# Copy the Vite build output from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]