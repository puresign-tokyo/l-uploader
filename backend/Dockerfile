# Pythonランタイムを親イメージとして使用
FROM python:3.12

RUN apt update && \
    apt install -y wget default-jre tini && \
    wget https://github.com/kaitai-io/kaitai_struct_compiler/releases/download/0.10/kaitai-struct-compiler_0.10_all.deb && \
    dpkg -i kaitai-struct-compiler_0.10_all.deb && \
    rm kaitai-struct-compiler_0.10_all.deb && \
    rm -rf /var/lib/apt/lists/* &&\
    wget -O /usr/local/bin/supercronic https://github.com/aptible/supercronic/releases/download/v0.2.34/supercronic-linux-amd64 && \
    chmod +x /usr/local/bin/supercronic


RUN groupadd -g 10001 app && useradd -u 10001 -g app -m -s /usr/sbin/nologin app

# 作業ディレクトリを/appに設定
WORKDIR /app


# 現在のディレクトリの内容をコンテナ内の/appにコピー
COPY ./requirements.txt /app
RUN pip install -r requirements.txt
COPY ./src /app
COPY ./cron/cron.conf /etc/cron.d/cron.conf

RUN chown app:app /etc/cron.d/cron.conf && chmod 0644 /etc/cron.d/cron.conf
RUN chown -R app:app /app
RUN mkdir -p /home/app/replays && chown -R app:app /home/app/replays

USER app

ENV PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app


# # コンテナ起動時にapp.pyを実行
RUN find /app/parsers/threp-ksy -name "*.ksy" -exec ksc -t python --outdir /app/parsers/py_code {} \;
ENTRYPOINT ["/usr/bin/tini","--"]
CMD ["/bin/sh","-c","supercronic /etc/cron.d/cron.conf & exec python /app/app.py"]