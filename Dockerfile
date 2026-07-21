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

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "build"]