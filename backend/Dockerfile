FROM sbtscala/scala-sbt:eclipse-temurin-21.0.8_9_1.11.6_2.13.16@sha256:7f8d1f78e15fd13905253b41b984ac9d52ae035b20e8376d385317e91c68bf13 AS kaitai-builder

WORKDIR /build/kaitai_struct_compiler
COPY ./kaitai_struct_compiler ./
RUN mkdir -p /build/formats && sbt compilerJVM/stage

FROM eclipse-temurin:21.0.8_9-jre@sha256:66bb900643426ad01996d25bada7d56751913f9cec3b827fcb715d2ec9a0fbfc AS parser-builder

WORKDIR /app
COPY --from=kaitai-builder /build/kaitai_struct_compiler/jvm/target/universal/stage /opt/kaitai-struct-compiler
COPY ./src/parsers/threp-ksy /app/parsers/threp-ksy
ENV JAVA_HOME=/opt/java/openjdk \
    PATH=/opt/kaitai-struct-compiler/bin:/opt/java/openjdk/bin:$PATH
RUN mkdir -p /app/parsers/py_code && \
    find /app/parsers/threp-ksy -name "*.ksy" -exec kaitai-struct-compiler -t python --outdir /app/parsers/py_code {} \;

FROM python:3.13-trixie@sha256:71d866ed79158f6ff25b096687f90ca706684937ea2032b86e479a060d9eaa7d AS python-dependencies

WORKDIR /build
COPY ./requirements.txt ./
RUN python -m pip install --no-compile --require-hashes --target /opt/site-packages -r requirements.txt
RUN mkdir -p /home/app/replays && chown -R 10001:10001 /home/app

FROM gcr.io/distroless/python3-debian13:nonroot@sha256:774595d652a294b54c9bd575b2d9fdd1a4b47547dc17b8bfa4c0e953c64855b3

WORKDIR /app

COPY --chown=10001:10001 ./src /app
COPY --chown=10001:10001 --from=parser-builder /app/parsers/py_code /app/parsers/py_code
COPY --chown=10001:10001 --from=python-dependencies /opt/site-packages /usr/lib/python3/dist-packages
COPY --from=python-dependencies /home/app /home/app

USER 10001:10001

ENV PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

CMD ["/app/container_entrypoint.py"]
