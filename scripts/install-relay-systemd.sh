#!/usr/bin/env bash
if [ -z "${BASH_VERSION:-}" ]; then
  echo "This script requires bash. Run: bash scripts/install-relay-systemd.sh" >&2
  exit 1
fi
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
service_name="${RELAY_SERVICE_NAME:-peercompute-relay}"
service_user="${RELAY_SERVICE_USER:-${SUDO_USER:-$USER}}"
service_group="${RELAY_SERVICE_GROUP:-$service_user}"
relay_impl="${RELAY_IMPL:-go}"
unit_path="/etc/systemd/system/${service_name}.service"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Re-run with sudo to install the systemd unit:"
  echo "  sudo -E bash $0"
  exit 1
fi

cat > "$unit_path" <<EOF
[Unit]
Description=PeerCompute Backend Server
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory=$repo_root
ExecStart=/usr/bin/env bash $repo_root/scripts/pcserver.sh
Restart=on-failure
RestartSec=2
User=$service_user
Group=$service_group
Environment=NODE_ENV=production
Environment=RELAY_IMPL=$relay_impl
Environment=PCSERVER_ENABLE_RELAY=1
Environment=PCSERVER_ENABLE_TURN=1

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now "$service_name"
systemctl status "$service_name" --no-pager
