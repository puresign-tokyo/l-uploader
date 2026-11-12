FROM node:24.22.3-bookworm-slim@sha256:dc26ae92c9fb15cf6b1d63e20f0944b2efe0f115b20e00be48fb23fceb061c54 AS build-stage

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

FROM gcr.io/distroless/nodejs24-debian13:nonroot@sha256:9fc11f6ee65993285c0fe3c4c9bbc4fd275fd4470572f58834ce490df91056e3

WORKDIR /app

ENV LANG=C.UTF-8 \
    TZ=Asia/Tokyo

COPY --from=build-stage /app/.output ./.output
COPY --from=build-stage /app/package.json ./package.json

ENV NODE_ENV=production

USER 65532:65532

CMD [".output/server/index.mjs"]
