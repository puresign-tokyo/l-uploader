#!/bin/bash

cat <<EOF > /docker-entrypoint-initdb.d/init-user.js
db.createUser({
  user: "${MONGO_APP_USER}",
  pwd: "${MONGO_APP_PASS}",
  roles: [{ role: "readWrite", db: "${MONGO_DATABASE}" }]
});
EOF