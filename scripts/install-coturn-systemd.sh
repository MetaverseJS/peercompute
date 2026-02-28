#!/usr/bin/env bash
if [ -z "${BASH_VERSION:-}" ]; then
  echo "This script requires bash. Run: bash scripts/install-coturn-systemd.sh" >&2
  exit 1
fi
set -euo pipefail

service_name="${COTURN_SERVICE_NAME:-peercompute-coturn}"
service_user="${COTURN_SERVICE_USER:-turnserver}"
service_group="${COTURN_SERVICE_GROUP:-$service_user}"
config_file="${COTURN_CONFIG_FILE:-/etc/turnserver.conf}"
turn_bin="${COTURN_BIN:-$(command -v turnserver || true)}"
unit_path="/etc/systemd/system/${service_name}.service"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Re-run with sudo to install the coturn systemd unit:"
  echo "  sudo -E bash $0"
  exit 1
fi

if [[ -z "$turn_bin" ]]; then
  echo "turnserver binary not found. Install coturn first (e.g. sudo apt install coturn)." >&2
  exit 1
fi

if [[ ! -f "$config_file" ]]; then
  echo "Coturn config file not found: $config_file" >&2
  echo "Set COTURN_CONFIG_FILE=/path/to/turnserver.conf or create /etc/turnserver.conf first." >&2
  exit 1
fi

if ! id -u "$service_user" >/dev/null 2>&1; then
  echo "Service user '$service_user' does not exist." >&2
  echo "Set COTURN_SERVICE_USER/COTURN_SERVICE_GROUP, or install coturn package user defaults." >&2
  exit 1
fi

cat > "$unit_path" <<EOF
[Unit]
Description=PeerCompute Coturn Server
After=network.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=$turn_bin -c $config_file --no-cli
Restart=on-failure
RestartSec=2
User=$service_user
Group=$service_group
AmbientCapabilities=CAP_NET_BIND_SERVICE
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full
ProtectHome=true
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
LimitNOFILE=1048576

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now "$service_name"
systemctl status "$service_name" --no-pager
