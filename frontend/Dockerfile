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

FROM node:24.13.0-bullseye-slim@sha256:8c1784228377880d8e8992ce35aa3f4a496e5ee00960a33262bbc7d17718890f

WORKDIR /app

ENV LANG=C.UTF-8 \
    TZ=Asia/Tokyo

COPY --from=build-stage /app/.output ./.output
COPY --from=build-stage /app/package.json ./package.json

ENV NODE_ENV=production

USER node

CMD ["node", ".output/server/index.mjs"]
