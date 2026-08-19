# MZEYFILMS

SvelteKit 2 / Svelte 5 portfolio site with a PocketBase-backed admin area.

## Default deployment: one command

The default `Dockerfile` runs both the SvelteKit app and PocketBase. `compose.yml`
also starts a Cloudflare Tunnel (cloudflared) so a single
`docker compose up -d --build` is enough for a fresh host. The optional
next-image-transformation API + imgproxy stack is available through the
`images` Compose profile but is intentionally not started by default: the
website serves original files when the image proxy is absent, so an imgproxy
issue can never block the site. PocketBase data lives in `/app/pb_data`; the
named `pocketbase_data` Docker volume survives container recreation and updates.

1. Copy `.env.example` to `.env` and set at least `ORIGIN`, the admin-login
   credentials, and `PRIVATE_POCKETBASE_EMAIL` / `PRIVATE_POCKETBASE_PASSWORD`.
   Use long, unique passwords. These PocketBase credentials create (or update)
   the PocketBase superuser when the empty volume starts.
2. Start it:

   ```powershell
   docker compose up -d --build
   ```

3. Visit `/admin`, sign in with `PRIVATE_LOGIN_USERNAME` and
   `PRIVATE_LOGIN_PASSWORD`, then open the dashboard. The site creates any
   missing PocketBase collections automatically: `folders`, `images`, and
   `videos`. Existing collections and records are never changed by this step.

The website is served on port `3000`. PocketBase and the image worker have no
published ports. Public file/admin requests use `/pb/...`; optimized images use
`/image/...`. For example, the PocketBase admin UI is available at `/pb/_/`.
A single Cloudflare Tunnel hostname is sufficient.

The image transformer is the self-hosted
[Coolify next-image-transformation](https://github.com/coollabsio/next-image-transformation)
service you used before, paired with imgproxy. It fetches local PocketBase files
over Docker's private `website` network alias instead of sending them out to
Cloudflare and back. No `PUBLIC_IMAGE_PROXY_URL` is needed for the standard
deployment.

If you want the optimized-image stack, start it explicitly (it remains optional
and never blocks the website):

```powershell
docker compose --profile images up -d --build
```

With that profile, add `IMAGE_PROXY_INTERNAL_URL=http://image-transformer:3000`
to `.env` so the SvelteKit server sends `/image/...` requests to the transformer.

Example `cloudflared` ingress on the Orange Pi:

```yaml
ingress:
  - hostname: mzeyfilms.example.com
    service: http://localhost:3000
  - service: http_status:404
```

Set `ORIGIN=https://mzeyfilms.example.com` in `.env`. Do not expose port 8090
unless direct PocketBase access is specifically wanted.

### Backup the data

The important state is the `pocketbase_data` volume, including both the SQLite
database and uploaded files. Back it up before machine changes and regularly:

```powershell
docker run --rm -v pocketbase_data:/data -v ${PWD}:/backup alpine tar czf /backup/pocketbase-backup.tgz -C /data .
```

Keep a copy of that archive off the machine. Restore only into a stopped
deployment with a deliberately selected target volume.

## Optional split deployment

The frontend and PocketBase can run on different machines. `Dockerfile.pocketbase`
builds an ARM64/AMD64 PocketBase-only image:

```powershell
docker build -f Dockerfile.pocketbase -t mzey-pocketbase .
docker volume create mzey-pocketbase-data
docker run -d --name mzey-pocketbase --restart unless-stopped --env-file .env -v mzey-pocketbase-data:/pb/pb_data -p 8090:8090 mzey-pocketbase
```

Give that machine a reachable HTTPS hostname (for example
`https://pocketbase.mzeyfilms.example.com`) through its own Cloudflare Tunnel.
On the frontend machine, use these runtime variables in addition to the normal
login credentials:

```dotenv
POCKETBASE_EMBEDDED=false
POCKETBASE_INTERNAL_URL=https://pocketbase.mzeyfilms.example.com
PUBLIC_POCKETBASE_URL=https://pocketbase.mzeyfilms.example.com
POCKETBASE_PROXY_ENABLED=false
```

Then run the standard website image with those variables. In this mode it does
not start its bundled PocketBase process. The dashboard still creates the three
default collections on first authenticated visit, using the same superuser
credentials on the remote PocketBase instance.

`POCKETBASE_INTERNAL_URL` is for server-to-server calls and can be a private
LAN/VPN address. `PUBLIC_POCKETBASE_URL` is the browser-visible URL used in
stored image paths; it must be reachable by visitors. If a reverse proxy should
continue serving PocketBase through `/pb`, leave `POCKETBASE_PROXY_ENABLED`
enabled and set `PUBLIC_POCKETBASE_URL=/pb` instead.

The same compose file can retain the image transformer in a split deployment.
Set `IMAGE_PROXY_ALLOWED_REMOTE_DOMAINS` to the hostnames it may fetch (for
example `pocketbase.mzeyfilms.example.com`). To use a transformer on another
machine instead, set `IMAGE_PROXY_INTERNAL_URL` to its private/reachable API
URL; `/image/...` continues to be the single public browser endpoint.

## Environment variables

The all-in-one defaults need no PocketBase URL settings:

- `PRIVATE_LOGIN_USERNAME`, `PRIVATE_LOGIN_PASSWORD` – site admin login.
- `PRIVATE_POCKETBASE_EMAIL`, `PRIVATE_POCKETBASE_PASSWORD` – PocketBase
  superuser used by the server and schema bootstrap.
- `POCKETBASE_INTERNAL_URL` – optional private PocketBase URL. Defaults to
  `http://127.0.0.1:8090` in the combined container.
- `PUBLIC_POCKETBASE_URL` – optional public PocketBase URL. Defaults to `/pb`
  in the combined container.
- `POCKETBASE_EMBEDDED=false` – frontend-only mode.
- `POCKETBASE_PROXY_ENABLED=false` – disables the `/pb` proxy when the browser
  talks directly to a remote PocketBase host.
- `IMAGE_PROXY_INTERNAL_URL` – optional private URL of the image transformer.
  The default Compose value is empty (image optimization disabled, original
  images are served). Set it to `http://image-transformer:3000` when using the
  `images` profile or to an external transformer URL.
- `IMAGE_PROXY_ALLOWED_REMOTE_DOMAINS` – comma-separated extra source hosts
  accepted by the integrated transformer. The default permits internal
  PocketBase files only.
- `PUBLIC_IMAGE_PROXY_URL` – legacy browser-direct transformer endpoint. It is
  baked into the frontend at image build time; prefer `IMAGE_PROXY_INTERNAL_URL`.

`PUBLIC_POCKETBASE_URL_IMG_API` remains supported for an existing deployment,
but new deployments should use `PUBLIC_POCKETBASE_URL`.

## Development

```bash
npm install
npm run dev
```

For local development, run PocketBase separately and set
`POCKETBASE_INTERNAL_URL` and `PUBLIC_POCKETBASE_URL` in `.env`. The backend
needs the same superuser credentials configured in the app.

> **ORIGIN matters for form actions.** SvelteKit's CSRF protection rejects
> POST form submissions when `ORIGIN` doesn't match the URL you're using in the
> browser (403 "Cross-site POST form submissions are forbidden"). When testing
> on `http://localhost:3000`, set `ORIGIN=http://localhost:3000` for that test.
> In production keep `ORIGIN` set to the Cloudflare HTTPS hostname, e.g.
> `https://mzeyfilms.com`.

## YouTube animated previews

The production Dockerfile installs `ffmpeg` and `yt-dlp` for automatic YouTube
to AVIF previews. Datacenter IPs can be blocked by YouTube; see the commented
`YTDLP_COOKIES_FILE`, `YTDLP_COOKIES`, `YTDLP_PROXY`, and `YTDLP_EXTRA_ARGS`
variables in `.env.example` when that happens.
