FROM node:24.22.1-bookworm-slim@sha256:1681862882da07ee5476fee047bcf34138833f1df42633bb25bcb0f438d5bf3d AS build-stage

WORKDIR /app
ENV LANG=C.UTF-8 \
    TZ=Asia/Tokyo

COPY ./app/package.json /app
COPY ./app/pnpm-lock.yaml /app
COPY ./app/pnpm-workspace.yaml /app
COPY ./app/patches /app/patches
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

FROM gcr.io/distroless/nodejs24-debian13:nonroot@sha256:78f07ef1b5ea71ad7c055df15d0dd8997f2d288f9158623c4d4ae3d765b7d50d

WORKDIR /app

ENV LANG=C.UTF-8 \
    TZ=Asia/Tokyo

COPY --from=build-stage /app/.output ./.output
COPY --from=build-stage /app/package.json ./package.json

ENV NODE_ENV=production

USER 65532:65532

CMD [".output/server/index.mjs"]
