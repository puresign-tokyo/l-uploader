FROM redis:8.0
WORKDIR /app
COPY ./config/redis-conf.sh /app/redis-conf.sh
CMD ["/bin/bash", "-c", "/bin/bash /app/redis-conf.sh && redis-server /app/redis.conf"]