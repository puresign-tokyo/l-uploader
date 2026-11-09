#!/bin/bash

cat <<EOF > /tmp/valkey.conf
dir /data
user default off
user ${REDIS_USER} on >${REDIS_PASS} allcommands allkeys
EOF
