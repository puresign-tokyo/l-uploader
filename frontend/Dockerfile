FROM node:24.13.0-bullseye-slim@sha256:8c1784228377880d8e8992ce35aa3f4a496e5ee00960a33262bbc7d17718890f as build-stage

WORKDIR /app
ENV LANG=C.UTF-8 \
    TZ=Asia/Tokyo

COPY ./app/package.json /app
COPY ./app/pnpm-lock.yaml /app
COPY ./app/.npmrc /app

RUN corepack enable && \
    corepack prepare pnpm@10.30.3 --activate && \
    pnpm install --frozen-lockfile --ignore-scripts

COPY ./app .

# 何故かunheadがコピーされなかったので決め打ちでコピー
RUN --network=none pnpm nuxt:prepare && \
    pnpm build && \
    rm -rf .output/server/node_modules/unhead && \
    cp -aL node_modules/unhead .output/server/node_modules/unhead

FROM gcr.io/distroless/nodejs24-debian13:nonroot@sha256:9eeb7f5887d0e239e78264b06f7f11d2e14be534050481803a9e4728fcdd278e

WORKDIR /app

ENV LANG=C.UTF-8 \
    TZ=Asia/Tokyo

COPY --from=build-stage /app/.output ./.output
COPY --from=build-stage /app/package.json ./package.json

ENV NODE_ENV=production

CMD [".output/server/index.mjs"]
