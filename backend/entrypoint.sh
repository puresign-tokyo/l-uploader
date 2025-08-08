#!/bin/bash

# cron 起動
service cron start

python /app/app.py

touch /var/log/cron.log
chmod 644 /var/log/cron.log

tail -f /var/log/cron.log
