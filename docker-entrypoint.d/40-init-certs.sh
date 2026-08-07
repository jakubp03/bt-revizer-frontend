#!/bin/sh
set -eu

CERT_PATH="${SSL_CERT_PATH:-/etc/nginx/certs/fullchain.pem}"
KEY_PATH="${SSL_KEY_PATH:-/etc/nginx/certs/privkey.pem}"
DOMAIN_NAME="${DOMAIN_NAME:-localhost}"

mkdir -p "$(dirname "$CERT_PATH")"

if [ ! -f "$CERT_PATH" ] || [ ! -f "$KEY_PATH" ]; then
  echo "Generating self-signed certificate for ${DOMAIN_NAME}"
  openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout "$KEY_PATH" \
    -out "$CERT_PATH" \
    -subj "/CN=${DOMAIN_NAME}"
fi