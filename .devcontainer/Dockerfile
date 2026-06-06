# syntax=docker/dockerfile:1.7
FROM node:24.13.0-bullseye-slim@sha256:8c1784228377880d8e8992ce35aa3f4a496e5ee00960a33262bbc7d17718890f AS node
FROM sbtscala/scala-sbt:eclipse-temurin-21.0.8_9_1.11.6_2.13.16@sha256:7f8d1f78e15fd13905253b41b984ac9d52ae035b20e8376d385317e91c68bf13 AS sbt

FROM mcr.microsoft.com/devcontainers/python:3.12-bookworm@sha256:e1f700bf0e30d38d1d3aae95f35ab3fb6dc0708a6fb199841e7b3f31a7893b2b

COPY --from=node /usr/local/ /usr/local/
COPY --from=sbt /opt/java/openjdk/ /opt/java/openjdk/
COPY --from=sbt /usr/share/sbt/ /usr/share/sbt/

ENV LANG=C.UTF-8 \
    TZ=Asia/Tokyo \
    PYTHONUNBUFFERED=1 \
    HOME=/home/vscode \
    JAVA_HOME=/opt/java/openjdk \
    PATH=/opt/kaitai-struct-compiler/bin:/home/vscode/.local/bin:/usr/share/sbt/bin:/opt/java/openjdk/bin:/usr/local/bin:${PATH}

COPY backend/kaitai_struct_compiler/ /tmp/kaitai_struct_compiler/

RUN --mount=type=cache,target=/root/.sbt \
    --mount=type=cache,target=/root/.ivy2 \
    --mount=type=cache,target=/root/.cache/coursier \
    cd /tmp/kaitai_struct_compiler \
    && sbt "project compilerJVM" stage \
    && mkdir -p /opt/kaitai-struct-compiler \
    && cp -a jvm/target/universal/stage/. /opt/kaitai-struct-compiler/ \
    && chmod -R a+rX /opt/kaitai-struct-compiler \
    && chmod a+x /opt/kaitai-struct-compiler/bin/kaitai-struct-compiler \
    && rm -rf /tmp/kaitai_struct_compiler

RUN mkdir -p /workspace/l-uploader /workspace/.cache/sbt /workspace/.cache/ivy2 /workspace/.cache/coursier /workspace/.pnpm-store /home/vscode/.agents /home/vscode/.ssh /home/vscode/.codex /home/vscode/.vscode-server \
    && chown -R vscode:vscode /workspace /home/vscode/.agents /home/vscode/.ssh /home/vscode/.codex /home/vscode/.vscode-server \
    && printf '\nexport GPG_TTY=$(tty)\n' >> /etc/bash.bashrc

USER vscode
