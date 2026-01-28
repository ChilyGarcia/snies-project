#!/bin/sh
set -e

# En Windows es común que los .sh queden con CRLF y fallen al ejecutarse en Linux.
# Convertimos CRLF -> LF en runtime (aunque /app esté montado como volumen).
if command -v sed >/dev/null 2>&1; then
  sed -i 's/\r$//' /app/docker/entrypoint.sh || true
  sed -i 's/\r$//' /app/docker/wait_for_db.py || true
fi

exec sh /app/docker/entrypoint.sh "$@"

