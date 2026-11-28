# Stepwise production image (used by Render's Docker runtime).
# Node 22 serves the app and API; OpenJDK 17 runs Java code in the sandboxed JVM driver.
# Python runs in the browser (Pyodide). C/C++ need Docker-in-Docker or Judge0 (set JUDGE0_URL), which Render doesn't provide.

FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:22-bookworm-slim
RUN apt-get update \
 && apt-get install -y --no-install-recommends openjdk-17-jdk-headless \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
# RUNNER=local: no Docker-in-Docker on Render. Writable paths live in /tmp (the app runs as the non-root "node" user).
ENV NODE_ENV=production \
    RUNNER=local \
    SANDBOX_DIR=/tmp/stepwise-sandbox \
    DATA_DIR=/tmp/stepwise-data
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
COPY server ./server
COPY scripts/start.mjs scripts/migrate-to-postgres.mjs ./scripts/
# Render provides PORT; the server listens on it and serves both the app and /api.
EXPOSE 10000
USER node
CMD ["node", "--experimental-sqlite", "--no-warnings=ExperimentalWarning", "scripts/start.mjs"]
