#!/bin/sh
set -e

COMPOSE_FILE="$(dirname "$0")/docker-compose.prod.yml"

echo "[deploy] Logging in to GHCR..."
echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USER" --password-stdin

echo "[deploy] Pulling latest image..."
docker compose -f "$COMPOSE_FILE" pull

echo "[deploy] Restarting services..."
docker compose -f "$COMPOSE_FILE" up -d --force-recreate --remove-orphans

echo "[deploy] Cleaning up old images..."
docker image prune -f

echo "[deploy] Done."

