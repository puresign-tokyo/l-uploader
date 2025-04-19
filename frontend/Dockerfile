# ビルド環境

FROM node:18.12.0-buster as build-stage

ENV TZ Asia/Tokyo

WORKDIR /app

ARG VUE_APP_BACKEND_HOST
ARG VUE_APP_BACKEND_PORT
ARG VUE_APP_HTTP_PROTOCOL

ENV VUE_APP_BACKEND_HOST=$VUE_APP_BACKEND_HOST
ENV VUE_APP_BACKEND_PORT=$VUE_APP_BACKEND_PORT
ENV VUE_APP_HTTP_PROTOCOL=$VUE_APP_HTTP_PROTOCOL

RUN yarn global add @vue/cli

COPY ./app /app

RUN yarn build

# 本番環境
FROM nginx as production-stage

ENV TZ Asia/Tokyo

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]