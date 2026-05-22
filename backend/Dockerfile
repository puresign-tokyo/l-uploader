FROM sbtscala/scala-sbt:eclipse-temurin-21.0.8_9_1.11.6_2.13.16 AS kaitai-builder

WORKDIR /build/kaitai_struct_compiler
COPY ./kaitai_struct_compiler ./
RUN mkdir -p /build/formats && sbt compilerJVM/stage

FROM eclipse-temurin:21.0.8_9-jre AS parser-builder

WORKDIR /app
COPY --from=kaitai-builder /build/kaitai_struct_compiler/jvm/target/universal/stage /opt/kaitai-struct-compiler
COPY ./src/parsers/threp-ksy /app/parsers/threp-ksy
ENV JAVA_HOME=/opt/java/openjdk \
    PATH=/opt/kaitai-struct-compiler/bin:/opt/java/openjdk/bin:$PATH
RUN mkdir -p /app/parsers/py_code && \
    find /app/parsers/threp-ksy -name "*.ksy" -exec kaitai-struct-compiler -t python --outdir /app/parsers/py_code {} \;

# Pythonランタイムを親イメージとして使用
FROM python:3.12

RUN groupadd -g 10001 app && useradd -u 10001 -g app -m -s /usr/sbin/nologin app

# 作業ディレクトリを/appに設定
WORKDIR /app

# 現在のディレクトリの内容をコンテナ内の/appにコピー
COPY ./requirements.lock /app
RUN pip install --require-hashes -r requirements.lock
COPY ./src /app
COPY --from=parser-builder /app/parsers/py_code /app/parsers/py_code

RUN chown -R app:app /app
RUN mkdir -p /home/app/replays && chown -R app:app /home/app/replays

USER app

ENV PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app


# # コンテナ起動時にapp.pyを実行
CMD ["python", "/app/container_entrypoint.py"]
