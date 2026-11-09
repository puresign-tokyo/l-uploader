FROM valkey/valkey:8.1.11-trixie@sha256:8f836008e0986c36adf50da714c7060cf689dbb335f61fe077939d90fa650809
WORKDIR /app
COPY ./config/valkey-conf.sh /app/valkey-conf.sh
CMD ["/bin/bash", "-c", "/bin/bash /app/valkey-conf.sh && exec valkey-server /tmp/valkey.conf"]
