# Pythonランタイムを親イメージとして使用
FROM python:3.12

# 作業ディレクトリを/appに設定
WORKDIR /app

RUN apt update && \
    apt install -y wget default-jre cron && \
    wget https://github.com/kaitai-io/kaitai_struct_compiler/releases/download/0.10/kaitai-struct-compiler_0.10_all.deb && \
    dpkg -i kaitai-struct-compiler_0.10_all.deb && \
    rm kaitai-struct-compiler_0.10_all.deb && \
    rm -rf /var/lib/apt/lists/*

COPY ./src /app

# 現在のディレクトリの内容をコンテナ内の/appにコピー
COPY ./requirements.txt /app
COPY ./cron/cron-conf /etc/cron.d/cron-conf
COPY ./entrypoint.sh /entrypoint.sh

RUN chmod 0644 /etc/cron.d/cron-conf && crontab /etc/cron.d/cron-conf

ENV PYTHONPATH=/app

# requirements.txtで指定された必要なパッケージをインストール
RUN pip install -r requirements.txt

# # コンテナ起動時にapp.pyを実行
RUN find /app/parsers/threp-ksy -name "*.ksy" -exec ksc -t python --outdir /app/parsers/py-code {} \;
ENTRYPOINT [ "/entrypoint.sh" ]