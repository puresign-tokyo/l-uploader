#!/bin/bash

cat <<EOF > /app/redis.conf
user default off
user ${REDIS_USER} on >${REDIS_PASS} allcommands allkeys
EOF