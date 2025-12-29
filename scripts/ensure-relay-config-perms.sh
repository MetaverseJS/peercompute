#!/usr/bin/env bash
if [ -z "${BASH_VERSION:-}" ]; then
  echo "This script requires bash. Run: bash scripts/ensure-relay-config-perms.sh" >&2
  exit 1
fi
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
relay_cfg_json="$repo_root/config/relay.json"

if [[ ! -f "$relay_cfg_json" ]]; then
  echo "[relay-perms] config/relay.json not found; nothing to update." >&2
  exit 0
fi

relay_config_file="$(node -e "const fs=require('fs');const p='$relay_cfg_json';const cfg=JSON.parse(fs.readFileSync(p,'utf8'));if(cfg.relayConfigFile)process.stdout.write(String(cfg.relayConfigFile));")"

if [[ -z "$relay_config_file" ]]; then
  echo "[relay-perms] relayConfigFile not set in config/relay.json; nothing to update." >&2
  exit 0
fi

relay_config_path="$relay_config_file"
if [[ "$relay_config_path" != /* ]]; then
  relay_config_path="$repo_root/$relay_config_path"
fi
relay_config_dir="$(dirname "$relay_config_path")"

acl_user="${RELAY_ACL_USER:-${NGINX_USER:-}}"
if [[ -z "$acl_user" ]] && command -v nginx >/dev/null 2>&1; then
  acl_user="$(nginx -T 2>/dev/null | awk '$1 == "user" {print $2}' | sed 's/;//' | head -n1 || true)"
fi
if [[ -z "$acl_user" ]]; then
  acl_user="www-data"
fi
export RELAY_ACL_USER="$acl_user"

echo "[relay-perms] Granting read access on $relay_config_path to user '$acl_user'"

if command -v setfacl >/dev/null 2>&1; then
  acl_stop="${RELAY_ACL_ROOT:-}"
  if [[ -z "$acl_stop" && -n "${HOME:-}" && "$relay_config_dir" == "$HOME"* ]]; then
    acl_stop="$HOME"
  fi
  if [[ -z "$acl_stop" ]]; then
    acl_stop="/"
  fi

  acl_dir="$relay_config_dir"
  while :; do
    setfacl -m "u:${acl_user}:rx" "$acl_dir" 2>/dev/null || true
    if [[ "$acl_dir" == "$acl_stop" || "$acl_dir" == "/" ]]; then
      break
    fi
    acl_dir="$(dirname "$acl_dir")"
  done

  setfacl -d -m "u:${acl_user}:rx" "$relay_config_dir" 2>/dev/null || true
  if [[ -f "$relay_config_path" ]]; then
    setfacl -m "u:${acl_user}:r" "$relay_config_path" 2>/dev/null || true
  fi
else
  echo "[relay-perms] setfacl not found; falling back to chmod (less secure)." >&2
  chmod o+rx "$relay_config_dir" 2>/dev/null || true
  if [[ -f "$relay_config_path" ]]; then
    chmod o+r "$relay_config_path" 2>/dev/null || true
  fi
fi

echo "[relay-perms] Done."
