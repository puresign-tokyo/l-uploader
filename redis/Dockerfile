FROM redis:8.0@sha256:ae471bdc20de180beed36e347d170ec0bdf8faa327959ea1f24692f22b05b955
WORKDIR /app
COPY ./config/redis-conf.sh /app/redis-conf.sh
CMD ["/bin/bash", "-c", "/bin/bash /app/redis-conf.sh && redis-server /app/redis.conf"]