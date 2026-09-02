FROM redis:8.6.6-trixie@sha256:51d21cdd406d5cee4e4b2c002310dd413b2c5a87b0f4c36d30fcbb7684a00541
WORKDIR /app
COPY ./config/redis-conf.sh /app/redis-conf.sh
CMD ["/bin/bash", "-c", "/bin/bash /app/redis-conf.sh && redis-server /tmp/redis.conf"]
