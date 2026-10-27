# MZEYFILMS

Portfolio site built with SvelteKit 3 and Svelte 5, running on Bun 1.4.4 with a
PocketBase-backed admin area.

## Requirements

- [Bun](https://bun.com) 1.4.4 or newer
- Docker (for the production image)

## Local development

```bash
bun install
cp .env.example .env
bun run dev
```

The dev server runs on `http://localhost:5173`. CSRF checks are disabled in
development. To preview a production build locally, build it with `ORIGIN`
matching the preview address:

```bash
ORIGIN=http://localhost:4173 bun run build
bun run preview
```

You can also put `ORIGIN=http://localhost:4173` in `.env.local`; Vite gives it
priority over `.env`, and Docker ignores `.env.*` files. `ORIGIN` is baked into
the build, so changing it always requires rebuilding. If it is not set,
SvelteKit derives the origin from each request at runtime.

`bun run build` deletes `.svelte-kit` and `build` before running Vite. Without
that clean step SvelteKit can reuse a server bundle compiled with the previous
`paths.origin`, so the old origin keeps causing 403 errors even after a rebuild.

Run PocketBase separately (for example with `pocketbase serve`) and set
`POCKETBASE_INTERNAL_URL` and `PUBLIC_POCKETBASE_URL` in `.env`. The backend
needs the same superuser credentials configured in the app. If you do not set
`POCKETBASE_EMBEDDED=true`, the app never starts PocketBase itself.

Useful commands:

```bash
bun run check  # svelte-check
bun run build  # clean production build (must run under Bun)
bun ./build    # start the production server
```

`@sveltejs/adapter-bun` calls Bun's build API, so the build must run under Bun.
The `build` script cleans the old output and then invokes Vite. The build output
lives in `build/` and expects `package.json` plus the production dependencies in
`node_modules`.

## Deployment with Coolify (Dockerfile)

Deploy this repository as a Dockerfile application in Coolify. The root
`Dockerfile` builds both the SvelteKit server and PocketBase into one image:

1. Set the build argument `ORIGIN` to the public URL visitors use, for example
   `https://mzeyfilms.com`. It is baked into SvelteKit's `paths.origin` at build
   time and used for CSRF checks.
2. Set the runtime environment variables listed below, including
   `BODY_SIZE_LIMIT=536870912` so temporary 512 MiB video uploads reach the app.
   If Coolify's proxy enforces a smaller request limit, raise it there too.
3. Expose port `3000`.
4. Mount a persistent volume at `/app/pb_data` so PocketBase data and uploaded
   files survive redeploys.
5. Point the Coolify domain at port `3000` and enable HTTPS.

No Cloudflare Tunnel or `cloudflared` container is needed: Coolify's reverse
proxy terminates TLS and forwards requests to the app.

The first time the container starts, `PRIVATE_POCKETBASE_EMAIL` and
`PRIVATE_POCKETBASE_PASSWORD` create or update the PocketBase superuser. Sign in
at `/admin` with `PRIVATE_LOGIN_USERNAME` and `PRIVATE_LOGIN_PASSWORD`, then open
the dashboard. Missing PocketBase collections (`folders`, `images`, `videos`)
are created automatically; existing collections and records are left untouched.

Public PocketBase files are served through `/pb/...`, and optimized images
through `/image/...`. For example, the PocketBase admin UI is available at
`/pb/_/`.

## Self-hosting with Docker Compose

`compose.yml` runs the same image locally or on a VPS:

```bash
cp .env.example .env
docker compose up -d --build
```

The website is published on port `3000`. PocketBase and the optional image
worker have no published ports. `compose.yml` passes `ORIGIN` as a build
argument and reads the remaining settings from `.env`.

The optional image transformation stack (next-image-transformation + imgproxy)
is not started by default, so an imgproxy problem can never block the site:

```bash
docker compose --profile images up -d --build
```

Then set `IMAGE_PROXY_INTERNAL_URL=http://image-transformer:3000` in `.env`.
Without it, `/image/...` redirects to the original file.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `ORIGIN` | Public URL of the site. Read at build time and baked into `paths.origin` for CSRF checks and prerendering. If omitted, the origin is derived from each request. |
| `BODY_SIZE_LIMIT` | Maximum request body size. Use `536870912` (512 MiB) to allow temporary local-video uploads. |
| `PRIVATE_LOGIN_USERNAME` / `PRIVATE_LOGIN_PASSWORD` | Site admin credentials. |
| `PRIVATE_POCKETBASE_EMAIL` / `PRIVATE_POCKETBASE_PASSWORD` | PocketBase superuser used by the server and schema bootstrap. |
| `POCKETBASE_EMBEDDED` | `true` in the all-in-one image. Set `false` for a separate PocketBase. |
| `POCKETBASE_INTERNAL_URL` | Private PocketBase URL used server-side. Defaults to `http://127.0.0.1:8090` in the combined image. |
| `PUBLIC_POCKETBASE_URL` | Browser-visible PocketBase URL. Defaults to `/pb` in the combined image. |
| `POCKETBASE_PROXY_ENABLED` | Set `false` to disable the `/pb` proxy when browsers talk directly to PocketBase. |
| `IMAGE_PROXY_INTERNAL_URL` | Private URL of the image transformer. Empty disables optimization. |
| `IMAGE_PROXY_LOCAL_ORIGIN` | Internal origin used to fetch local PocketBase files. Compose sets `http://website:3000`. |
| `IMAGE_PROXY_ALLOWED_REMOTE_DOMAINS` | Extra comma-separated hosts accepted by the image transformer. |
| `PUBLIC_IMAGE_PROXY_URL` | Legacy browser-direct transformer endpoint. Prefer `IMAGE_PROXY_INTERNAL_URL`. |
| `PUBLIC_POCKETBASE_URL_IMG_API` | Legacy PocketBase file API URL. Prefer `PUBLIC_POCKETBASE_URL`. |
| `YTDLP_COOKIES_FILE` | Path to a Netscape `cookies.txt` for yt-dlp. |
| `YTDLP_COOKIES` | Raw `cookies.txt` content (use `\n` for newlines). |
| `YTDLP_PROXY` | Optional HTTP/SOCKS proxy for yt-dlp. |
| `YTDLP_EXTRA_ARGS` | Extra space-separated yt-dlp flags. |

All variables are optional at build time. PocketBase credentials are validated
when the server first authenticates, so secrets never need to be present in the
build environment.

## Split deployment

The frontend and PocketBase can run on different machines. Build the
PocketBase-only image:

```bash
docker build -f Dockerfile.pocketbase -t mzey-pocketbase .
docker volume create mzey-pocketbase-data
docker run -d --name mzey-pocketbase --restart unless-stopped \
  --env-file .env -v mzey-pocketbase-data:/pb/pb_data -p 8090:8090 mzey-pocketbase
```

Give it a reachable HTTPS hostname through Coolify or another reverse proxy, then
run the website image with:

```dotenv
POCKETBASE_EMBEDDED=false
POCKETBASE_INTERNAL_URL=https://pocketbase.example.com
PUBLIC_POCKETBASE_URL=https://pocketbase.example.com
POCKETBASE_PROXY_ENABLED=false
```

`POCKETBASE_INTERNAL_URL` is used for server-to-server calls and can be a private
LAN/VPN address. `PUBLIC_POCKETBASE_URL` is the browser-visible URL used in
stored file paths. To keep serving PocketBase through `/pb`, leave
`POCKETBASE_PROXY_ENABLED` enabled and set `PUBLIC_POCKETBASE_URL=/pb`.

## Backup

The important state is the `pocketbase_data` volume, containing the SQLite
database and uploaded files. Back it up regularly:

```bash
docker run --rm -v pocketbase_data:/data -v "$PWD":/backup alpine \
  tar czf /backup/pocketbase-backup.tgz -C /data .
```

Keep a copy off the machine. Restore only into a stopped deployment with a
deliberately selected target volume.

## Admin dashboard

Sign in at `/admin` with `PRIVATE_LOGIN_USERNAME` and `PRIVATE_LOGIN_PASSWORD`.
The admin session is independent of PocketBase, so `/admin/dashboard` and its
tools stay reachable when PocketBase is offline (for example with
`bun run preview`). In that state the dashboard shows an offline banner and the
video/photo pages disable their content and actions until PocketBase responds
again.

If login fails with `403 Cross-site POST form submissions are forbidden`, the
build's `ORIGIN` does not match the URL in the browser. Rebuild with the correct
`ORIGIN` (for example `http://localhost:4173`); the build log prints the value
that was baked in. Changing `.env` without rebuilding has no effect.

## Animated AVIF previews

The production image installs `ffmpeg` for both YouTube and local video
sources, plus `yt-dlp` for YouTube downloads. Datacenter IPs can be blocked by
YouTube; see the commented `YTDLP_*` variables in `.env.example` when that
happens. The app tries non-web player clients first and falls back to cookies or
a proxy when configured.

Video uploads generate the HD and SD previews automatically. The same pipeline
is available without PocketBase from **Admin → Conversione**
(`/admin/dashboard/conversion`). Choose a source:

- **YouTube**: paste a video URL and optionally set the clip start in seconds.
- **File locale**: pick a video from your computer (MP4, MOV, MKV, WebM, AVI,
  and similar formats, up to 512 MiB). The file is uploaded to the OS temporary
  directory only to extract previews and is never saved in PocketBase. The
  website content still requires a YouTube URL.

The job runs in the background and the page polls its progress, then shows
animated previews, file sizes, and download buttons for both versions.

The video admin page also accepts an optional local file when adding or editing
a video: it uses the temporary upload to refresh the AVIF previews, while the
YouTube URL remains the only source stored and published.

Conversions produce the same files as uploads: HD AVIF at 720px/24 fps and SD
AVIF at 320px/15 fps. Generated files are kept in the OS temporary directory
for 24 hours and then deleted; restarting the server discards the in-memory job
list, and stale directories are cleaned when the next job starts. Unclaimed
temporary source uploads expire after 6 hours. Downloads and inline previews
are served through authenticated endpoints, so they are only available to a
signed-in admin.
