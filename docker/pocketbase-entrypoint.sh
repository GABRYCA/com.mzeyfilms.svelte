#!/bin/sh
set -eu

PB_DATA_DIR="${POCKETBASE_DATA_DIR:-/pb/pb_data}"
mkdir -p "$PB_DATA_DIR"

if [ -n "${PRIVATE_POCKETBASE_EMAIL:-}" ] && [ -n "${PRIVATE_POCKETBASE_PASSWORD:-}" ]; then
	pocketbase superuser upsert "$PRIVATE_POCKETBASE_EMAIL" "$PRIVATE_POCKETBASE_PASSWORD" --dir="$PB_DATA_DIR"
else
	echo "[PocketBase] No superuser env supplied; create one at /_/."
fi

exec pocketbase serve --http="${POCKETBASE_HTTP_ADDRESS:-0.0.0.0:8090}" --dir="$PB_DATA_DIR"
