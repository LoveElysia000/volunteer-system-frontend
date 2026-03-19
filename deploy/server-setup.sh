#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${1:-$SCRIPT_DIR/deploy.env}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing deploy env file: $ENV_FILE" >&2
  echo "Copy deploy/deploy.env.example to deploy/deploy.env and fill in the real values." >&2
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

: "${FRONTEND_DOMAIN:?FRONTEND_DOMAIN is required}"
: "${DEPLOY_PATH:?DEPLOY_PATH is required}"
: "${NGINX_CONFIG_PATH:?NGINX_CONFIG_PATH is required}"

sudo mkdir -p "$DEPLOY_PATH"

if id -u deploy >/dev/null 2>&1; then
  sudo chown -R deploy:deploy "$DEPLOY_PATH"
fi

echo "Deployment directory ready: $DEPLOY_PATH"
echo "Choose one of the following Nginx templates and copy it to:"
echo "  $NGINX_CONFIG_PATH"
echo
echo "For HTTP internal testing:"
echo "  sudo cp \"$SCRIPT_DIR/nginx.http.conf\" \"$NGINX_CONFIG_PATH\""
echo
echo "For HTTPS production:"
echo "  sudo cp \"$SCRIPT_DIR/nginx.https.conf\" \"$NGINX_CONFIG_PATH\""
echo
echo "Before reloading Nginx, replace these placeholders in the copied file:"
echo "  your-frontend-domain.com -> $FRONTEND_DOMAIN"
echo "  /var/www/volunteer-system-frontend -> $DEPLOY_PATH"
echo
echo "Then run:"
echo "  sudo nginx -t"
echo "  sudo systemctl reload nginx"
