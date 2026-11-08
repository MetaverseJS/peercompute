#!/usr/bin/env bash
if [ -z "${BASH_VERSION:-}" ]; then
  echo "This script requires bash. Run: bash scripts/dev-vpn-coturn.sh" >&2
  exit 1
fi
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
dry_run=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      dry_run=1
      shift
      ;;
    *)
      echo "[dev-vpn-coturn] unknown argument: $1" >&2
      exit 2
      ;;
  esac
done

detect_vpn_host() {
  if [[ -n "${RELAY_PUBLIC_HOST:-}" ]]; then
    printf '%s\n' "$RELAY_PUBLIC_HOST"
    return 0
  fi
  if [[ -n "${RELAY_TURN_HOST:-}" ]]; then
    printf '%s\n' "$RELAY_TURN_HOST"
    return 0
  fi
  if command -v tailscale >/dev/null 2>&1; then
    local tailscale_ip
    tailscale_ip="$(tailscale ip -4 2>/dev/null | sed -n '1p' || true)"
    if [[ -n "$tailscale_ip" ]]; then
      printf '%s\n' "$tailscale_ip"
      return 0
    fi
  fi
  node "$repo_root/scripts/get-local-ip.mjs"
}

if ! command -v turnserver >/dev/null 2>&1; then
  echo "[dev-vpn-coturn] turnserver not found. Install coturn first, e.g. sudo apt install coturn." >&2
  exit 127
fi

vpn_host="$(detect_vpn_host)"
if [[ -z "$vpn_host" ]]; then
  echo "[dev-vpn-coturn] could not detect a VPN/LAN host. Set RELAY_PUBLIC_HOST=<ip-or-dns>." >&2
  exit 2
fi

: "${RELAY_DEV_EXPOSE_LAN:=1}"
: "${RELAY_PUBLIC_HOST:=$vpn_host}"
: "${RELAY_LISTEN_HOST:=0.0.0.0}"
: "${RELAY_LISTEN_PORT:=0}"
: "${RELAY_PUBLIC_PORT:=}"
: "${RELAY_TURN_HOST:=$RELAY_PUBLIC_HOST}"
: "${RELAY_TURN_PORT:=3478}"
: "${RELAY_TURN_USERNAME:=peer}"
: "${RELAY_TURN_CREDENTIAL:=compute}"
: "${DEV_OPEN_OVERVIEW:=0}"
: "${PEERCOMPUTE_NO_OPEN:=1}"

export RELAY_DEV_EXPOSE_LAN
export RELAY_PUBLIC_HOST
export RELAY_LISTEN_HOST
export RELAY_LISTEN_PORT
export RELAY_PUBLIC_PORT
export RELAY_TURN_HOST
export RELAY_TURN_PORT
export RELAY_TURN_USERNAME
export RELAY_TURN_CREDENTIAL
export DEV_OPEN_OVERVIEW
export PEERCOMPUTE_NO_OPEN

echo "[dev-vpn-coturn] RELAY_PUBLIC_HOST=$RELAY_PUBLIC_HOST"
echo "[dev-vpn-coturn] RELAY_LISTEN_HOST=$RELAY_LISTEN_HOST"
echo "[dev-vpn-coturn] RELAY_LISTEN_PORT=$RELAY_LISTEN_PORT"
echo "[dev-vpn-coturn] RELAY_TURN_HOST=$RELAY_TURN_HOST"
echo "[dev-vpn-coturn] RELAY_TURN_PORT=$RELAY_TURN_PORT"
echo "[dev-vpn-coturn] DEV_OPEN_OVERVIEW=$DEV_OPEN_OVERVIEW"

if [[ "$dry_run" == "1" ]]; then
  echo "[dev-vpn-coturn] dry-run command: bash $repo_root/scripts/dev-local-relay.sh"
  exit 0
fi

exec bash "$repo_root/scripts/dev-local-relay.sh"
