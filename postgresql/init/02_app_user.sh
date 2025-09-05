#!/usr/bin/env bash
set -euo pipefail

POSTGRES_APP_USER="${POSTGRES_APP_USER:-app_user}"
POSTGRES_APP_PASS="${POSTGRES_APP_PASS:-change_me}"

psql -v ON_ERROR_STOP=1 \
     -v app_user="$POSTGRES_APP_USER" \
     -v app_pass="$POSTGRES_APP_PASS" \
     --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<'EOSQL'
CREATE ROLE :"app_user" LOGIN PASSWORD :'app_pass';
GRANT SELECT, INSERT, DELETE ON TABLE public.posts TO :"app_user";
GRANT USAGE, SELECT ON SEQUENCE public.posts_replay_id_seq TO :"app_user";
EOSQL