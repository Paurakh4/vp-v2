ARG NODE_VERSION=20
ARG APP_DIRNAME=web
ARG PROJECT=@kan/web

# 1. Alpine image
FROM node:${NODE_VERSION}-alpine AS alpine
RUN apk update
RUN apk add --no-cache libc6-compat python3 make g++ netcat-openbsd

# Setup pnpm and turbo on the alpine base
FROM alpine AS base
RUN corepack enable
# Replace <your-major-version> with the major version installed in your repository. For example:
# RUN npm install turbo@2.1.3 --global
RUN npm install turbo@2.3.1 --global

RUN pnpm config set store-dir ~/.pnpm-store

# 2. Prune projects
FROM base AS pruner
# https://stackoverflow.com/questions/49681984/how-to-get-version-value-of-package-json-inside-of-dockerfile
# RUN export VERSION=$(npm run version)

ARG PROJECT

# Set working directory
WORKDIR /app

# It might be the path to <ROOT> turborepo
COPY . .
 
# Generate a partial monorepo with a pruned lockfile for a target workspace.
# Assuming "@acme/nextjs" is the name entered in the project's package.json: { name: "@acme/nextjs" }
RUN turbo prune --scope=${PROJECT} --scope=@kan/db --docker
 
# 3. Build the project
FROM base AS builder
ARG PROJECT

# Environment to skip .env validation on build
ENV CI=true

WORKDIR /app

# Copy lockfile and package.json's of isolated subworkspace
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

# First install the dependencies (as they change less often)
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install --frozen-lockfile
 
# Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .

# Compile i18n messages before building
RUN pnpm --filter=@kan/web lingui:compile

RUN pnpm build --filter=${PROJECT}

# Copy static files to standalone directory
RUN mkdir -p apps/web/.next/standalone/.next && \
    cp -r apps/web/public apps/web/.next/standalone/ && \
    cp -r apps/web/.next/static apps/web/.next/standalone/.next/

# 4. Final image - runner stage to run the application
FROM base AS runner
ARG APP_DIRNAME
 
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

WORKDIR /app

ENV NODE_ENV=production

# Copy the full application for now (simpler approach)
COPY --chown=nextjs:nodejs --from=builder /app/ ./

WORKDIR /app/apps/${APP_DIRNAME}

ARG PORT=3000
ENV PORT=${PORT}
EXPOSE ${PORT}

# Create a startup script that handles migrations and starts the app
USER root
RUN printf '#!/bin/sh\nset -e\necho "Waiting for database..."\nwhile ! nc -z postgres 5432; do sleep 1; done\necho "Database is ready!"\necho "Running database migrations..."\ncd /app && pnpm db:migrate || echo "Migration failed, continuing..."\necho "Starting application..."\ncd /app/apps/web && pnpm start\n' > /app/start.sh && chmod +x /app/start.sh
USER nextjs

CMD ["/app/start.sh"]

