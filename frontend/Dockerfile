FROM node:24.13.0-bullseye-slim as build-stage

WORKDIR /app
ENV LANG=C.UTF-8 \
    TZ=Asia/Tokyo

COPY ./app/package.json /app
COPY ./app/package-lock.json /app

RUN npm ci

COPY ./app .

RUN npm run build

FROM node:24.13.0-bullseye-slim

WORKDIR /app

ENV LANG=C.UTF-8 \
    TZ=Asia/Tokyo

COPY --from=build-stage /app/.output ./.output
COPY --from=build-stage /app/package.json ./package.json

ENV NODE_ENV=production

USER node

CMD ["node", ".output/server/index.mjs"]