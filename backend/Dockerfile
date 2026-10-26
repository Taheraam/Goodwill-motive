# syntax=docker/dockerfile:1
# Goodwill Motive API — multi-stage build. Build context is the repo root (monorepo):
#   docker build -f backend/Dockerfile -t goodwill-api .

# ---------- build stage: install deps, generate Prisma client, compile TS ----------
FROM node:20-bookworm-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
 && rm -rf /var/lib/apt/lists/*

# Manifests first so the dependency layer is cached until package files change.
COPY package.json package-lock.json .npmrc ./
COPY backend/package.json backend/
COPY packages/shared/package.json packages/shared/
COPY frontend-web/package.json frontend-web/
COPY frontend-mobile/package.json frontend-mobile/
RUN npm ci --workspace=backend --workspace=@goodwill/shared --include-workspace-root=false --no-audit --no-fund

COPY packages/shared packages/shared
COPY backend backend
RUN npm run build --workspace=@goodwill/shared \
 && npm run build --workspace=backend \
 && npm prune --omit=dev --workspace=backend --workspace=@goodwill/shared

# ---------- runtime stage: only what `node dist/src/main` needs ----------
FROM node:20-bookworm-slim AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build --chown=node:node /app/package.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/packages/shared ./packages/shared
COPY --from=build --chown=node:node /app/backend/package.json ./backend/
COPY --from=build --chown=node:node /app/backend/node_modules ./backend/node_modules
COPY --from=build --chown=node:node /app/backend/dist ./backend/dist
COPY --from=build --chown=node:node /app/backend/prisma ./backend/prisma

# Never run as root inside the container.
USER node
WORKDIR /app/backend
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3001)+'/api').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist/src/main"]
