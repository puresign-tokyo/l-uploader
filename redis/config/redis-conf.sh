#!/bin/bash

cat <<EOF > /tmp/redis.conf
dir /data
user default off
user ${REDIS_USER} on >${REDIS_PASS} allcommands allkeys
EOF