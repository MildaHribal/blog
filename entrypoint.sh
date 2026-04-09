#!/bin/sh
set -e

echo "[entrypoint] Starting server..."
exec node server.js
