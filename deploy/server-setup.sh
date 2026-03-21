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

: "${DEPLOY_PATH:?DEPLOY_PATH is required}"

sudo mkdir -p "$DEPLOY_PATH"

if id -u deploy >/dev/null 2>&1; then
  sudo chown -R deploy:deploy "$DEPLOY_PATH"
fi

echo "Deployment directory ready: $DEPLOY_PATH"
echo "Upload the contents of dist/ to this directory during deployment."
