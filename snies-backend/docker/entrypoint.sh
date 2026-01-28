#!/bin/sh
set -e

python /app/docker/wait_for_db.py

python /app/config/manage.py migrate --noinput

if [ "${COLLECTSTATIC:-0}" = "1" ]; then
  python /app/config/manage.py collectstatic --noinput
fi

exec "$@"

