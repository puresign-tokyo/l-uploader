FROM redis:8.6.3-trixie@sha256:4d25e2fe601f7ffaeb4437cb6ced3518bc36edf34ebe98863c80836943d94529
WORKDIR /app
COPY ./config/redis-conf.sh /app/redis-conf.sh
CMD ["/bin/bash", "-c", "/bin/bash /app/redis-conf.sh && redis-server /app/redis.conf"]
