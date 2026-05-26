#!/usr/bin/env bash
set -euo pipefail

host="${TENCENT_HOST:-mira-intelligence.com}"
user="${TENCENT_USER:-ubuntu}"
port="${TENCENT_PORT:-22}"
key="${TENCENT_SSH_KEY_PATH:-$HOME/.ssh/tencent_mira_ed25519}"
deploy_path="${TENCENT_DEPLOY_PATH:-/opt/mira-docs/site}"

npm run build

rsync -az --delete \
  -e "ssh -i ${key} -p ${port}" \
  build/ "${user}@${host}:${deploy_path}/"

ssh -i "${key}" -p "${port}" "${user}@${host}" \
  'if command -v docker >/dev/null 2>&1 && docker ps --format "{{.Names}}" | grep -qx mira-docs; then docker exec mira-docs nginx -s reload >/dev/null 2>&1 || true; fi'
