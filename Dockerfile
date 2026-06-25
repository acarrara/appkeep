# Stage 1: Build the Angular app
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json .npmrc ./

# Install all deps but skip postinstall (it tries to build without env vars)
RUN npm ci --ignore-scripts

COPY . .

# Build args for generating src/credentials.json and src/vapid.json
ARG CLIENT_ID
ARG VAPID_PUBLIC_KEY
ARG BUILD_CONFIG=production

ENV clientID=$CLIENT_ID
ENV VAPID_PUBLIC_KEY=$VAPID_PUBLIC_KEY

RUN node scripts/credentials.js && \
    npx ng build --configuration $BUILD_CONFIG

# Stage 2: Shared production dependencies
FROM node:22-alpine AS runner-base

WORKDIR /app

COPY package*.json .npmrc ./

RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /app/dist ./dist

# Stage 3: Production runner (default) — no e2e files
FROM runner-base AS runner

COPY scripts/server.js ./scripts/
COPY scripts/api/ ./scripts/api/

EXPOSE 3000

CMD ["node", "scripts/server.js"]

# Stage 4: E2E runner — same structure, auth.js replaced with e2e version
FROM runner-base AS runner-e2e

COPY scripts/server.js ./scripts/
COPY scripts/api/ ./scripts/api/
COPY scripts/e2e/auth.js ./scripts/api/auth.js

EXPOSE 3000

CMD ["node", "scripts/server.js"]