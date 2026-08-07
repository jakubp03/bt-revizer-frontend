#!/bin/sh
set -eu

CERT_PATH="${SSL_CERT_PATH:-/etc/nginx/certs/fullchain.pem}"
KEY_PATH="${SSL_KEY_PATH:-/etc/nginx/certs/privkey.pem}"
INTERVAL="${CERT_WATCH_INTERVAL_SECONDS:-300}"

watch_certs() {
  last_sum=""

  while true; do
    if [ -f "$CERT_PATH" ] && [ -f "$KEY_PATH" ]; then
      current_sum="$(sha256sum "$CERT_PATH" "$KEY_PATH" | sha256sum | awk '{print $1}')"

      if [ -n "$last_sum" ] && [ "$current_sum" != "$last_sum" ]; then
        echo "TLS certificate change detected, reloading nginx"
        nginx -s reload || true
      fi

      last_sum="$current_sum"
    fi

    sleep "$INTERVAL"
  done
}

watch_certs &