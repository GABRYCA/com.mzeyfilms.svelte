#!/bin/sh
set -eu

PB_DATA_DIR="${POCKETBASE_DATA_DIR:-/app/pb_data}"
PB_HTTP_ADDRESS="${POCKETBASE_HTTP_ADDRESS:-0.0.0.0:8090}"

if [ "${POCKETBASE_EMBEDDED:-true}" = "false" ]; then
	# Frontend-only mode: point POCKETBASE_INTERNAL_URL and
	# PUBLIC_POCKETBASE_URL to the separate PocketBase machine.
	exec node build
fi

mkdir -p "$PB_DATA_DIR"

if [ -n "${PRIVATE_POCKETBASE_EMAIL:-}" ] && [ -n "${PRIVATE_POCKETBASE_PASSWORD:-}" ]; then
	# Idempotent: ensures the configured superuser exists on a fresh or restored volume.
	pocketbase superuser upsert "$PRIVATE_POCKETBASE_EMAIL" "$PRIVATE_POCKETBASE_PASSWORD" --dir="$PB_DATA_DIR"
else
	echo "[PocketBase] PRIVATE_POCKETBASE_EMAIL/PASSWORD are not set; use the PocketBase UI to create a superuser."
fi

pocketbase serve --http="$PB_HTTP_ADDRESS" --dir="$PB_DATA_DIR" &
PB_PID=$!

shutdown() {
	kill -TERM "$PB_PID" 2>/dev/null || true
	wait "$PB_PID" 2>/dev/null || true
}
trap shutdown INT TERM EXIT

# Give PocketBase a short head start so the first page loads don't hit a
# still-booting API. If it doesn't become ready in time, the website still
# starts; server loads already fail open when locals.pb is unavailable.
PB_STARTUP_TIMEOUT="${POCKETBASE_STARTUP_TIMEOUT:-30}"
PB_WAITED=0
until node -e "fetch('http://127.0.0.1:8090/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"; do
	PB_WAITED=$((PB_WAITED + 1))
	if [ "$PB_WAITED" -ge "$PB_STARTUP_TIMEOUT" ]; then
		echo "[PocketBase] not ready after ${PB_STARTUP_TIMEOUT}s; starting website anyway."
		break
	fi
	sleep 1
done
if [ "$PB_WAITED" -lt "$PB_STARTUP_TIMEOUT" ]; then
	echo "[PocketBase] ready after ${PB_WAITED}s."
fi

node build &
APP_PID=$!
wait "$APP_PID"
