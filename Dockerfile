# syntax=docker/dockerfile:1

ARG POCKETBASE_VERSION=0.40.6

FROM alpine:3.24 AS pocketbase
ARG POCKETBASE_VERSION
ARG TARGETARCH

RUN apk add --no-cache ca-certificates unzip wget \
	&& case "$TARGETARCH" in \
		amd64) PB_ARCH=amd64 ;; \
		arm64) PB_ARCH=arm64 ;; \
		*) echo "Unsupported PocketBase architecture: $TARGETARCH" >&2; exit 1 ;; \
	   esac \
	&& wget -q "https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/pocketbase_${POCKETBASE_VERSION}_linux_${PB_ARCH}.zip" -O /tmp/pocketbase.zip \
	&& unzip -q /tmp/pocketbase.zip -d /tmp/pocketbase \
	&& install -m 0755 /tmp/pocketbase/pocketbase /usr/local/bin/pocketbase

FROM oven/bun:1.4.4-alpine AS builder
WORKDIR /app

# paths.origin is baked into the build. Set this build arg to the public URL
# visitors use (Coolify: Build Pack -> Build Arguments).
ARG ORIGIN=https://mzeyfilms.com
ENV ORIGIN=$ORIGIN

COPY package.json bun.lock ./
# The image installs yt-dlp via apk/pip at runtime, so dependency lifecycle
# scripts (which would download a duplicate binary) are not needed here.
RUN bun install --frozen-lockfile --ignore-scripts

COPY . .
RUN bun run --bun build

FROM oven/bun:1.4.4-alpine AS production-dependencies
WORKDIR /app

# Only runtime dependencies are needed: adapter-bun bundles devDependencies.
COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile --ignore-scripts

FROM oven/bun:1.4.4-alpine
WORKDIR /app

RUN apk add --no-cache ca-certificates ffmpeg libstdc++ python3 py3-pip \
	&& pip3 install --no-cache-dir --break-system-packages -U yt-dlp \
	&& ffmpeg -version \
	&& yt-dlp --version

COPY --from=builder /app/build ./build
COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=pocketbase /usr/local/bin/pocketbase /usr/local/bin/pocketbase
COPY docker/entrypoint.sh /usr/local/bin/website-entrypoint
RUN chmod +x /usr/local/bin/website-entrypoint

VOLUME ["/app/pb_data"]
EXPOSE 3000 8090

ENV NODE_ENV=production
ENV POCKETBASE_EMBEDDED=true
ENV POCKETBASE_INTERNAL_URL=http://127.0.0.1:8090
ENV PUBLIC_POCKETBASE_URL=/pb
# Admin video uploads accept temporary source files up to 512 MiB. adapter-bun
# defaults to 512K; YouTube-only conversions need a much smaller limit.
ENV BODY_SIZE_LIMIT=536870912

ENTRYPOINT ["website-entrypoint"]
