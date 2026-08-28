ARG POCKETBASE_VERSION=0.39.11

FROM alpine:3.21 AS pocketbase
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

FROM node:25-alpine AS builder
WORKDIR /app

RUN apk add --no-cache python3 && ln -sf /usr/bin/python3 /usr/bin/python

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm prune --production

FROM node:25-alpine
WORKDIR /app

RUN apk add --no-cache ca-certificates ffmpeg python3 py3-pip \
	&& pip3 install --no-cache-dir --break-system-packages -U yt-dlp \
	&& ffmpeg -version \
	&& yt-dlp --version

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
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
ENTRYPOINT ["website-entrypoint"]