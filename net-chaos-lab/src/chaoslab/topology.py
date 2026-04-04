from __future__ import annotations

from dataclasses import dataclass
import ipaddress
import json
import os
import re
import shutil
import shlex
import subprocess
import time
from pathlib import Path
from typing import Any, Iterable


class TopologyError(RuntimeError):
  pass


DEFAULT_CHAOSLAB_IMAGE = os.environ.get('CHAOSLAB_DEFAULT_IMAGE', 'peercompute/net-chaos-lab-node:latest')
DEFAULT_CHAOSLAB_IMAGE_REV_LABEL = 'org.peercompute.chaoslab.image-rev'
DEFAULT_CHAOSLAB_IMAGE_REV = os.environ.get(
  'CHAOSLAB_DEFAULT_IMAGE_REV',
  '20260216-playwright-runtime',
)


@dataclass
class AgentRecord:
  name: str
  segment_id: str
  ipv4: str | None
  ipv6: str | None
  node: Any = None
  enabled: bool = True


@dataclass
class ServiceRecord:
  name: str
  host: str
  ipv4: str | None
  ipv6: str | None
  node: Any = None


class ChaosTopology:
  _SHELL_EXIT_SENTINEL = '__CHAOSLAB_EXIT_CODE__:'
  _ANSI_ESCAPE_RE = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
  _CONTROL_CHAR_RE = re.compile(r'[\x00-\x08\x0B-\x1F\x7F]')

  def __init__(
    self,
    config: dict[str, Any],
    repo_root: Path,
    artifacts_dir: Path,
    mode: str = 'auto',
    logger: Any = print,
  ):
    normalized_mode = str(mode or 'auto').strip().lower()
    if normalized_mode not in {'auto', 'containernet', 'dry-run'}:
      raise TopologyError(f'Unknown topology mode: {mode}')

    self.config = config
    self.repo_root = repo_root
    self.artifacts_dir = artifacts_dir
    self.mode = normalized_mode
    self.actual_mode = 'dry-run'
    self.logger = logger

    self._cn: dict[str, Any] | None = None
    self._net = None
    self._core_switch = None
    self._segment_switches: dict[str, Any] = {}
    self._segment_uplinks: dict[str, Any] = {}
    self._segment_routers: dict[str, Any] = {}
    self._agents: list[AgentRecord] = []
    self._agent_index: dict[str, AgentRecord] = {}
    self._services: dict[str, ServiceRecord] = {}
    self._partitioned_segments: set[str] = set()
    self._link_profiles: dict[str, dict[str, float]] = {}
    self._ip_mode = 'dual-stack'
    self._ip_mode_scope = self._resolve_ip_mode_scope()
    self._host_forward_policy_prev: dict[str, str] = {}
    self._host_bridge_nf_prev: dict[str, str] = {}
    self._started = False
    self._service_health_cfg = self._load_service_health_config()

  @property
  def started(self) -> bool:
    return self._started

  @property
  def ip_mode(self) -> str:
    return self._ip_mode

  def _log(self, message: str) -> None:
    self.logger(f'[topology] {message}')

  def _try_load_containernet(self) -> dict[str, Any]:
    try:
      from mininet.net import Containernet  # type: ignore
      from mininet.node import Controller  # type: ignore
      from mininet.link import TCLink  # type: ignore
    except Exception:
      try:
        # Backward-compat fallback for legacy module layouts.
        from containernet.net import Containernet  # type: ignore
        from containernet.node import Controller  # type: ignore
        from mininet.link import TCLink  # type: ignore
      except Exception as exc:
        raise TopologyError(
          'Containernet not available. Install Containernet + Mininet or run with --mode dry-run.'
        ) from exc
    return {
      'Containernet': Containernet,
      'Controller': Controller,
      'TCLink': TCLink,
    }

  def start(self) -> None:
    if self._started:
      return

    self._prepare_link_profiles()

    if self.mode == 'dry-run':
      self._start_dry_run()
      self._started = True
      return

    try:
      self._start_containernet()
      self._started = True
      return
    except Exception as exc:
      self._restore_host_forwarding_policy()
      self._restore_host_bridge_nf_policy()
      if self.mode == 'containernet':
        raise
      self._log(f'Containernet startup failed, falling back to dry-run: {exc}')
      self._start_dry_run()
      self._started = True

  def stop(self) -> None:
    if not self._started:
      return

    if self._net is not None:
      try:
        self._net.stop()
      except Exception as exc:
        self._log(f'Containernet stop warning: {exc}')
      finally:
        self._restore_host_forwarding_policy()
        self._restore_host_bridge_nf_policy()

    self._net = None
    self._core_switch = None
    self._segment_switches.clear()
    self._segment_uplinks.clear()
    self._segment_routers.clear()
    for agent in self._agents:
      agent.node = None
      agent.enabled = True
    for service in self._services.values():
      service.node = None
    self._partitioned_segments.clear()
    self._ip_mode = 'dual-stack'
    self._started = False

  def list_agents(self) -> list[AgentRecord]:
    return list(self._agents)

  def list_services(self) -> list[ServiceRecord]:
    return list(self._services.values())

  def get_probe_agents(self, limit: int | None = None) -> list[AgentRecord]:
    active = [agent for agent in self._agents if agent.enabled]
    if not active:
      return []
    if limit is None or limit <= 0 or limit >= len(active):
      return active
    return active[:limit]

  def run_command_in_agent(self, agent_name: str, command: list[str], timeout_s: int = 180) -> tuple[int, str, str]:
    agent = self._agent_index.get(agent_name)
    if not agent:
      return 1, '', f'Agent not found: {agent_name}'

    if not agent.enabled:
      return 1, '', f'Agent is offline: {agent_name}'

    if self.actual_mode == 'containernet' and agent.node is not None:
      cmd = ' '.join(shlex.quote(part) for part in command)
      wrapped = f'{cmd}; rc=$?; printf "{self._SHELL_EXIT_SENTINEL}%s\\n" "$rc"'
      shell_command = f"env TERM=dumb bash --noprofile --norc -lc {shlex.quote(wrapped)}"
      raw_output = str(agent.node.cmd(shell_command) or '')
      exit_code, stdout = self._parse_shell_output(raw_output, default_rc=1)
      return exit_code, stdout, ''

    proc = subprocess.run(
      command,
      cwd=str(self.repo_root),
      text=True,
      capture_output=True,
      timeout=timeout_s,
      check=False,
    )
    return proc.returncode, proc.stdout, proc.stderr

  def run_command_in_service(
    self,
    service_name: str,
    command: list[str],
    timeout_s: int = 180,
  ) -> tuple[int, str, str]:
    record = self._services.get(service_name)
    if record is None or record.node is None:
      return 1, '', f'Service not found or offline: {service_name}'
    return self._run_command_in_containernet_node(record.node, command, timeout_s)

  def run_command_in_router(
    self,
    segment_id: str,
    command: list[str],
    timeout_s: int = 180,
  ) -> tuple[int, str, str]:
    node = self._segment_routers.get(segment_id)
    if node is None:
      return 1, '', f'Router not found for segment: {segment_id}'
    return self._run_command_in_containernet_node(node, command, timeout_s)

  def _run_command_in_containernet_node(
    self,
    node: Any,
    command: list[str],
    timeout_s: int = 180,
  ) -> tuple[int, str, str]:
    if self.actual_mode == 'containernet' and node is not None:
      cmd = ' '.join(shlex.quote(part) for part in command)
      wrapped = f'{cmd}; rc=$?; printf "{self._SHELL_EXIT_SENTINEL}%s\\n" "$rc"'
      shell_command = f"env TERM=dumb bash --noprofile --norc -lc {shlex.quote(wrapped)}"
      raw_output = str(node.cmd(shell_command) or '')
      exit_code, stdout = self._parse_shell_output(raw_output, default_rc=1)
      return exit_code, stdout, ''

    proc = subprocess.run(
      command,
      cwd=str(self.repo_root),
      text=True,
      capture_output=True,
      timeout=timeout_s,
      check=False,
    )
    return proc.returncode, proc.stdout, proc.stderr

  def apply_partition(self, segments: list[str], action: str) -> dict[str, Any]:
    normalized = str(action or '').strip().lower()
    if normalized not in {'isolate', 'heal'}:
      raise TopologyError(f'Unknown partition action: {action}')

    changed: list[str] = []
    for segment_id in segments:
      if segment_id not in self._segment_uplinks:
        continue
      if normalized == 'isolate':
        self._set_uplink(segment_id, enabled=False)
        self._partitioned_segments.add(segment_id)
      else:
        self._set_uplink(segment_id, enabled=True)
        self._partitioned_segments.discard(segment_id)
      changed.append(segment_id)

    return {
      'action': normalized,
      'segments': changed,
      'partitioned_segments': sorted(self._partitioned_segments),
    }

  def set_link_profile(self, link_id: str, bw_mbit: float, delay_ms: float, loss_pct: float) -> dict[str, Any]:
    normalized_link = str(link_id or '').strip()
    if not normalized_link:
      raise TopologyError('Missing link id for bandwidth shift')

    profile = {
      'bw_mbit': float(max(0.1, bw_mbit)),
      'delay_ms': float(max(0.0, delay_ms)),
      'loss_pct': float(max(0.0, min(100.0, loss_pct))),
    }
    self._link_profiles[normalized_link] = profile

    if self.actual_mode == 'containernet':
      link = self._segment_uplinks.get(normalized_link.split(':', 1)[0])
      if link is not None:
        try:
          link.intf1.config(
            bw=profile['bw_mbit'],
            delay=f"{profile['delay_ms']}ms",
            loss=profile['loss_pct'],
          )
          link.intf2.config(
            bw=profile['bw_mbit'],
            delay=f"{profile['delay_ms']}ms",
            loss=profile['loss_pct'],
          )
        except Exception as exc:
          self._log(f'Failed to apply runtime link profile on {normalized_link}: {exc}')

    return {
      'link': normalized_link,
      **profile,
    }

  def set_ip_mode(self, mode: str) -> dict[str, Any]:
    normalized = str(mode or '').strip().lower()
    if normalized not in {'dual-stack', 'ipv4-only', 'ipv6-only'}:
      raise TopologyError(f'Unknown ip mode: {mode}')

    self._ip_mode = normalized
    if self.actual_mode == 'containernet':
      if self._ip_mode_scope == 'agents':
        for agent in self._agents:
          if agent.node is None:
            continue
          self._apply_ip_mode_to_agent(agent, normalized)
        if normalized in {'dual-stack', 'ipv6-only'}:
          self._seed_ipv6_neighbors()
      else:
        for node in self._iter_ip_mode_nodes():
          self._apply_ip_mode_to_node(node, normalized)

    return {
      'mode': normalized,
    }

  def churn_agents(self, action: str, count: int = 1) -> dict[str, Any]:
    normalized = str(action or '').strip().lower()
    if normalized not in {'drop', 'restore'}:
      raise TopologyError(f'Unknown churn action: {action}')

    affected: list[str] = []
    if normalized == 'drop':
      budget = max(1, int(count))
      for agent in self._agents:
        if budget <= 0:
          break
        if not agent.enabled:
          continue
        agent.enabled = False
        affected.append(agent.name)
        budget -= 1
        if self.actual_mode == 'containernet' and agent.node is not None:
          try:
            agent.node.cmd('ip link set dev eth0 down')
          except Exception as exc:
            self._log(f'Failed to drop {agent.name}: {exc}')
    else:
      for agent in self._agents:
        if agent.enabled:
          continue
        agent.enabled = True
        affected.append(agent.name)
        if self.actual_mode == 'containernet' and agent.node is not None:
          try:
            agent.node.cmd('ip link set dev eth0 up')
          except Exception as exc:
            self._log(f'Failed to restore {agent.name}: {exc}')

    return {
      'action': normalized,
      'affected': affected,
    }

  def get_service_host_map(self) -> dict[str, str]:
    mapping: dict[str, str] = {}
    for record in self._services.values():
      if record.ipv4:
        mapping[record.host] = record.ipv4
    return mapping

  def get_service_host_entries(self) -> list[tuple[str, str]]:
    entries: list[tuple[str, str]] = []
    for record in self._services.values():
      if record.host and record.ipv4:
        entries.append((record.host, record.ipv4))
      if record.host and record.ipv6:
        entries.append((record.host, record.ipv6))
    return entries

  def get_state_snapshot(self) -> dict[str, Any]:
    network_cfg = self.config.get('network', {}) if isinstance(self.config, dict) else {}
    segments_cfg = self.config.get('segments', []) if isinstance(self.config, dict) else []
    agents_source = self._agents or self._allocate_agents()
    services_source = self._services or self._build_service_records()

    segments: list[dict[str, Any]] = []
    for raw in segments_cfg:
      if not isinstance(raw, dict):
        continue
      segment_id = str(raw.get('id') or '').strip()
      if not segment_id:
        continue
      profile = self._resolve_segment_link_profile(segment_id)
      nat_cfg = raw.get('nat') if isinstance(raw.get('nat'), dict) else {}
      segments.append({
        'id': segment_id,
        'ipv4_subnet': str(raw.get('ipv4_subnet') or ''),
        'ipv6_subnet': str(raw.get('ipv6_subnet') or ''),
        'gateway4': str(raw.get('gateway4') or ''),
        'gateway6': str(raw.get('gateway6') or ''),
        'partitioned': segment_id in self._partitioned_segments,
        'uplink_enabled': segment_id not in self._partitioned_segments,
        'link_profile': {
          'bw_mbit': float(profile.get('bw_mbit', 0.0)),
          'delay_ms': float(profile.get('delay_ms', 0.0)),
          'loss_pct': float(profile.get('loss_pct', 0.0)),
        },
        'nat': {
          'enabled': bool(nat_cfg.get('enabled')),
          'type': str(nat_cfg.get('type') or ''),
          'uplink_ipv4': str(nat_cfg.get('uplink_ipv4') or ''),
          'uplink_ipv6': str(nat_cfg.get('uplink_ipv6') or ''),
        },
      })

    agents = [
      {
        'name': agent.name,
        'segment_id': agent.segment_id,
        'ipv4': agent.ipv4,
        'ipv6': agent.ipv6,
        'enabled': bool(agent.enabled),
      }
      for agent in agents_source
    ]
    services = [
      {
        'name': name,
        'host': record.host,
        'ipv4': record.ipv4,
        'ipv6': record.ipv6,
      }
      for name, record in services_source.items()
    ]
    agent_online = sum(1 for agent in agents if agent.get('enabled'))
    partitioned_segments = sorted(self._partitioned_segments)

    return {
      'name': str(network_cfg.get('name') or 'peercompute-chaos-lab'),
      'actual_mode': self.actual_mode,
      'requested_mode': self.mode,
      'started': bool(self._started),
      'ip_mode': self._ip_mode,
      'ip_mode_scope': self._ip_mode_scope,
      'core_switch': str(network_cfg.get('core_switch') or 'core'),
      'agent_total': len(agents),
      'agent_online': int(agent_online),
      'service_total': len(services),
      'segment_total': len(segments),
      'partitioned_segments': partitioned_segments,
      'segments': segments,
      'agents': agents,
      'services': services,
    }

  def _start_dry_run(self) -> None:
    self.actual_mode = 'dry-run'
    self._agents = self._allocate_agents()
    self._agent_index = {agent.name: agent for agent in self._agents}
    self._services = self._build_service_records()
    self._segment_uplinks = {
      str(segment.get('id')): object()
      for segment in self.config.get('segments', [])
      if isinstance(segment, dict) and segment.get('id')
    }
    self._log(
      f"Dry-run topology ready with {len(self._agents)} agents and {len(self._services)} services."
    )

  def _start_containernet(self) -> None:
    self._validate_containernet_host_prereqs()
    self._cleanup_stale_mininet_state()
    self._ensure_container_images()
    self._ensure_host_forwarding_policy()
    self._ensure_host_bridge_nf_policy()
    self._cn = self._try_load_containernet()
    Containernet = self._cn['Containernet']
    Controller = self._cn['Controller']
    TCLink = self._cn['TCLink']

    net = Containernet(controller=Controller, link=TCLink)
    net.addController('c0')

    switch_dpid_index = 1

    def next_switch_dpid() -> str:
      nonlocal switch_dpid_index
      dpid = self._format_switch_dpid(switch_dpid_index)
      switch_dpid_index += 1
      return dpid

    core_switch_id = str(self.config.get('network', {}).get('core_switch') or 'core')
    core_switch = net.addSwitch(core_switch_id, dpid=next_switch_dpid())

    segments = self.config.get('segments', [])
    segment_map: dict[str, dict[str, Any]] = {}

    for segment in segments:
      segment_id = str(segment.get('id'))
      if not segment_id:
        continue
      segment_switch = net.addSwitch(f'sw_{segment_id}', dpid=next_switch_dpid())
      link_profile = self._resolve_segment_link_profile(segment_id)
      uplink = net.addLink(
        segment_switch,
        core_switch,
        cls=TCLink,
        bw=link_profile['bw_mbit'],
        delay=f"{link_profile['delay_ms']}ms",
        loss=link_profile['loss_pct'],
      )

      router_name = f'nat_{segment_id}'
      router = net.addHost(router_name)
      net.addLink(router, segment_switch, intfName1=f'{router_name}-lan')
      net.addLink(router, core_switch, intfName1=f'{router_name}-wan')

      segment_map[segment_id] = {
        'cfg': segment,
        'switch': segment_switch,
        'router': router,
        'uplink': uplink,
      }

    service_records = self._build_service_records()
    self._services = service_records
    agents = self._allocate_agents()
    self._agents = agents
    self._agent_index = {agent.name: agent for agent in agents}
    self._cleanup_planned_docker_nodes(service_records.values(), agents)

    for key, record in service_records.items():
      node = self._add_docker_node(
        net,
        name=record.name,
        image=self._service_image(key),
        command='sleep infinity',
      )
      net.addLink(node, core_switch)
      record.node = node

    for agent in agents:
      segment = segment_map.get(agent.segment_id)
      if not segment:
        raise TopologyError(f'Agent segment not found: {agent.segment_id}')
      node = self._add_docker_node(
        net,
        name=agent.name,
        image=str(self.config.get('agents', {}).get('image') or DEFAULT_CHAOSLAB_IMAGE),
        command=str(self.config.get('agents', {}).get('command') or 'sleep infinity'),
      )
      net.addLink(node, segment['switch'])
      agent.node = node

    net.start()
    # Set mode before route/interface validation so startup fails fast on bad network state.
    self.actual_mode = 'containernet'

    for record in service_records.values():
      self._ensure_node_network_tooling(record.node, record.name)
    for agent in agents:
      self._ensure_node_network_tooling(agent.node, agent.name)

    # Configure NAT and addressing after interfaces exist.
    for segment_id, entry in segment_map.items():
      segment = entry['cfg']
      router = entry['router']
      self._configure_router(router, segment)

      self._segment_switches[segment_id] = entry['switch']
      self._segment_routers[segment_id] = router
      self._segment_uplinks[segment_id] = entry['uplink']

    for agent in agents:
      self._configure_agent(agent)

    for key, record in service_records.items():
      self._configure_service(record, key)

    self._seed_ipv6_neighbors()
    self._validate_core_service_reachability()
    self._seed_agent_hosts(agents)
    self._validate_agent_probe_runtime(agents)

    self._net = net
    self._core_switch = core_switch
    self._agents = agents
    self._agent_index = {agent.name: agent for agent in agents}
    self._services = service_records
    self._log(
      f"Containernet topology ready with {len(self._agents)} agents and {len(self._services)} services."
    )

  def _load_service_health_config(self) -> dict[str, float]:
    cfg = self.config.get('core_services', {}).get('health', {})
    timeout_seconds = float(cfg.get('timeout_seconds', 20))
    poll_interval_seconds = float(cfg.get('poll_interval_seconds', 1))
    return {
      'timeout_seconds': max(2.0, timeout_seconds),
      'poll_interval_seconds': max(0.2, poll_interval_seconds),
    }

  def _validate_containernet_host_prereqs(self) -> None:
    required_bins = ['docker', 'mn', 'ip', 'iptables', 'tc']
    missing = [binary for binary in required_bins if shutil.which(binary) is None]
    if missing:
      raise TopologyError(
        f'Containernet prerequisites missing on host: {", ".join(missing)}. '
        'Install required tooling or use --mode dry-run.'
      )

    docker_info = subprocess.run(
      ['docker', 'info'],
      cwd=str(self.repo_root),
      text=True,
      capture_output=True,
      check=False,
    )
    if docker_info.returncode != 0:
      hint = (docker_info.stderr or docker_info.stdout or '').strip()
      raise TopologyError(
        f'Docker daemon is not reachable (docker info failed): {hint or "unknown error"}'
      )

  def _ensure_host_forwarding_policy(self) -> None:
    if os.geteuid() != 0:
      self._log('Skipping host forwarding policy check: requires root.')
      return

    if self._host_forward_policy_prev:
      return

    for binary in ('iptables', 'ip6tables'):
      if shutil.which(binary) is None:
        continue

      inspect = subprocess.run(
        [binary, '-S', 'FORWARD'],
        cwd=str(self.repo_root),
        text=True,
        capture_output=True,
        check=False,
      )
      output = (inspect.stdout or '') + (inspect.stderr or '')
      policy = ''
      for raw_line in output.splitlines():
        line = raw_line.strip()
        if line.startswith('-P FORWARD '):
          parts = line.split()
          if len(parts) >= 3:
            policy = parts[2].upper()
          break

      if not policy:
        continue

      self._host_forward_policy_prev[binary] = policy
      if policy == 'ACCEPT':
        continue

      apply_res = subprocess.run(
        [binary, '-P', 'FORWARD', 'ACCEPT'],
        cwd=str(self.repo_root),
        text=True,
        capture_output=True,
        check=False,
      )
      if apply_res.returncode == 0:
        self._log(f'Host {binary} FORWARD policy adjusted: {policy} -> ACCEPT.')
      else:
        detail = '\n'.join(
          part
          for part in [(apply_res.stdout or '').strip(), (apply_res.stderr or '').strip()]
          if part
        ).strip()
        self._log(
          f'Warning: failed to set host {binary} FORWARD policy to ACCEPT'
          + (f': {detail}' if detail else '.')
        )

  def _restore_host_forwarding_policy(self) -> None:
    if os.geteuid() != 0:
      return
    if not self._host_forward_policy_prev:
      return

    for binary, policy in self._host_forward_policy_prev.items():
      if not policy:
        continue
      restore = subprocess.run(
        [binary, '-P', 'FORWARD', policy],
        cwd=str(self.repo_root),
        text=True,
        capture_output=True,
        check=False,
      )
      if restore.returncode != 0:
        detail = '\n'.join(
          part
          for part in [(restore.stdout or '').strip(), (restore.stderr or '').strip()]
          if part
        ).strip()
        self._log(
          f'Warning: failed to restore host {binary} FORWARD policy to {policy}'
          + (f': {detail}' if detail else '.')
        )

    self._host_forward_policy_prev = {}

  def _ensure_host_bridge_nf_policy(self) -> None:
    if os.geteuid() != 0:
      self._log('Skipping host bridge netfilter check: requires root.')
      return
    if self._host_bridge_nf_prev:
      return
    if shutil.which('sysctl') is None:
      self._log('Skipping host bridge netfilter check: sysctl not found.')
      return

    keys = (
      'net.bridge.bridge-nf-call-iptables',
      'net.bridge.bridge-nf-call-ip6tables',
    )
    for key in keys:
      read_res = subprocess.run(
        ['sysctl', '-n', key],
        cwd=str(self.repo_root),
        text=True,
        capture_output=True,
        check=False,
      )
      if read_res.returncode != 0:
        # Kernel/module may not expose bridge netfilter sysctls; skip quietly.
        continue
      value = str(read_res.stdout or '').strip()
      if not value:
        continue

      self._host_bridge_nf_prev[key] = value
      if value == '0':
        continue

      write_res = subprocess.run(
        ['sysctl', '-w', f'{key}=0'],
        cwd=str(self.repo_root),
        text=True,
        capture_output=True,
        check=False,
      )
      if write_res.returncode == 0:
        self._log(f'Host {key} adjusted: {value} -> 0.')
      else:
        detail = '\n'.join(
          part
          for part in [(write_res.stdout or '').strip(), (write_res.stderr or '').strip()]
          if part
        ).strip()
        self._log(
          f'Warning: failed to set host {key}=0'
          + (f': {detail}' if detail else '.')
        )

  def _restore_host_bridge_nf_policy(self) -> None:
    if os.geteuid() != 0:
      return
    if not self._host_bridge_nf_prev:
      return
    if shutil.which('sysctl') is None:
      self._host_bridge_nf_prev = {}
      return

    for key, value in self._host_bridge_nf_prev.items():
      if value == '':
        continue
      restore = subprocess.run(
        ['sysctl', '-w', f'{key}={value}'],
        cwd=str(self.repo_root),
        text=True,
        capture_output=True,
        check=False,
      )
      if restore.returncode != 0:
        detail = '\n'.join(
          part
          for part in [(restore.stdout or '').strip(), (restore.stderr or '').strip()]
          if part
        ).strip()
        self._log(
          f'Warning: failed to restore host {key}={value}'
          + (f': {detail}' if detail else '.')
        )
    self._host_bridge_nf_prev = {}

  def _cleanup_stale_mininet_state(self) -> None:
    if os.geteuid() != 0:
      self._log('Skipping Mininet cleanup (mn -c): requires root.')
      return

    cleanup = subprocess.run(
      ['mn', '-c'],
      cwd=str(self.repo_root),
      text=True,
      capture_output=True,
      check=False,
      timeout=120,
    )

    if cleanup.returncode == 0:
      self._log('Mininet cleanup complete (mn -c).')
      return

    detail = '\n'.join(
      part for part in [(cleanup.stdout or '').strip(), (cleanup.stderr or '').strip()] if part
    ).strip()
    self._log(
      'Mininet cleanup warning (mn -c failed)'
      + (f': {detail}' if detail else '.')
    )

  def _prepare_link_profiles(self) -> None:
    defaults = self.config.get('links', {}).get('defaults', {})
    base_profile = {
      'bw_mbit': float(defaults.get('bw_mbit', 100)),
      'delay_ms': float(defaults.get('delay_ms', 5)),
      'loss_pct': float(defaults.get('loss_pct', 0)),
    }
    self._link_profiles['default'] = base_profile

    overrides = self.config.get('links', {}).get('overrides', [])
    for entry in overrides:
      if not isinstance(entry, dict):
        continue
      from_segment = str(entry.get('from') or '')
      to_segment = str(entry.get('to') or '')
      if not from_segment or not to_segment:
        continue
      link_id = f'{from_segment}:{to_segment}'
      self._link_profiles[link_id] = {
        'bw_mbit': float(entry.get('bw_mbit', base_profile['bw_mbit'])),
        'delay_ms': float(entry.get('delay_ms', base_profile['delay_ms'])),
        'loss_pct': float(entry.get('loss_pct', base_profile['loss_pct'])),
      }

  def _resolve_segment_link_profile(self, segment_id: str) -> dict[str, float]:
    direct = self._link_profiles.get(f'{segment_id}:core')
    if direct:
      return direct
    reverse = self._link_profiles.get(f'core:{segment_id}')
    if reverse:
      return reverse
    return self._link_profiles.get('default', {'bw_mbit': 100.0, 'delay_ms': 5.0, 'loss_pct': 0.0})

  def _build_service_records(self) -> dict[str, ServiceRecord]:
    records: dict[str, ServiceRecord] = {}
    core_services = self.config.get('core_services', {})
    for key in ('dns', 'https', 'relay', 'turn'):
      cfg = core_services.get(key) or {}
      host = str(cfg.get('host') or f'{key}.peercompute.test')
      ipv4 = self._strip_prefix(cfg.get('ipv4'))
      ipv6 = self._strip_prefix(cfg.get('ipv6'))
      records[key] = ServiceRecord(
        name=f'svc_{key}',
        host=host,
        ipv4=ipv4,
        ipv6=ipv6,
      )
    return records

  def _service_image(self, key: str) -> str:
    cfg = self.config.get('core_services', {}).get(key, {})
    configured = cfg.get('image')
    if configured:
      return str(configured)
    defaults = {
      # Default to a prebuilt chaos-lab image that already includes iproute2/dnsmasq/caddy/coturn.
      'dns': DEFAULT_CHAOSLAB_IMAGE,
      'https': DEFAULT_CHAOSLAB_IMAGE,
      'relay': DEFAULT_CHAOSLAB_IMAGE,
      'turn': DEFAULT_CHAOSLAB_IMAGE,
    }
    return defaults.get(key, DEFAULT_CHAOSLAB_IMAGE)

  def _required_container_images(self) -> list[str]:
    images: set[str] = set()
    for key in ('dns', 'https', 'relay', 'turn'):
      images.add(self._service_image(key))
    agent_image = str(self.config.get('agents', {}).get('image') or DEFAULT_CHAOSLAB_IMAGE)
    if agent_image:
      images.add(agent_image)
    return sorted(image for image in images if image)

  def _docker_image_exists(self, image: str) -> bool:
    inspect = subprocess.run(
      ['docker', 'image', 'inspect', image],
      cwd=str(self.repo_root),
      text=True,
      capture_output=True,
      check=False,
    )
    return inspect.returncode == 0

  def _docker_image_label(self, image: str, label: str) -> str | None:
    inspect = subprocess.run(
      ['docker', 'image', 'inspect', '-f', f'{{{{index .Config.Labels "{label}"}}}}', image],
      cwd=str(self.repo_root),
      text=True,
      capture_output=True,
      check=False,
    )
    if inspect.returncode != 0:
      return None
    value = str(inspect.stdout or '').strip()
    if not value or value == '<no value>':
      return None
    return value

  def _default_image_revision_mismatch(self, image: str) -> bool:
    actual = self._docker_image_label(image, DEFAULT_CHAOSLAB_IMAGE_REV_LABEL)
    return actual != DEFAULT_CHAOSLAB_IMAGE_REV

  def _ensure_container_images(self) -> None:
    required = self._required_container_images()
    if not required:
      return

    allow_autobuild = str(os.environ.get('CHAOSLAB_SKIP_IMAGE_BUILD', '')).strip().lower() not in {
      '1',
      'true',
      'yes',
      'on',
    }
    for image in required:
      if not self._docker_image_exists(image):
        if image == DEFAULT_CHAOSLAB_IMAGE and allow_autobuild:
          self._build_default_chaos_image(image)
          continue
        hint = (
          f'Missing required Docker image: {image}. '
          'Pull/build it before running containernet mode.'
        )
        if image == DEFAULT_CHAOSLAB_IMAGE and not allow_autobuild:
          hint += (
            ' Auto-build is disabled via CHAOSLAB_SKIP_IMAGE_BUILD. '
            f'Run: docker build -t {DEFAULT_CHAOSLAB_IMAGE} '
            '-f net-chaos-lab/docker/chaos-node.Dockerfile net-chaos-lab/docker'
          )
        raise TopologyError(hint)

      if image == DEFAULT_CHAOSLAB_IMAGE and self._default_image_revision_mismatch(image):
        if allow_autobuild:
          self._log(
            f'Chaos-lab image revision mismatch detected for {image}; rebuilding to {DEFAULT_CHAOSLAB_IMAGE_REV}.'
          )
          self._build_default_chaos_image(image)
          continue
        raise TopologyError(
          f'Chaos-lab image {image} is stale (expected revision {DEFAULT_CHAOSLAB_IMAGE_REV}). '
          'Auto-build is disabled via CHAOSLAB_SKIP_IMAGE_BUILD; rebuild manually before running containernet mode.'
        )

  def _build_default_chaos_image(self, image: str) -> None:
    dockerfile = self.repo_root / 'net-chaos-lab/docker/chaos-node.Dockerfile'
    context_dir = dockerfile.parent
    if not dockerfile.exists():
      raise TopologyError(
        f'Required chaos-lab Dockerfile is missing: {dockerfile}. '
        f'Cannot build image {image}.'
      )

    self._log(f'Building missing chaos-lab docker image: {image}')
    build = subprocess.run(
      ['docker', 'build', '-t', image, '-f', str(dockerfile), str(context_dir)],
      cwd=str(self.repo_root),
      text=True,
      capture_output=True,
      check=False,
    )
    if build.returncode != 0:
      detail = '\n'.join(
        part for part in [(build.stdout or '').strip(), (build.stderr or '').strip()] if part
      ).strip()
      tail = '\n'.join(detail.splitlines()[-60:]) if detail else ''
      raise TopologyError(
        f'Failed to build docker image {image} from {dockerfile}.'
        + (f' Build output tail:\n{tail}' if tail else '')
      )
    self._log(f'Built docker image: {image}')

  def _add_docker_node(self, net: Any, name: str, image: str, command: str) -> Any:
    volume = f'{self.repo_root}:/workspace:rw'
    kwargs: dict[str, Any] = {
      'dimage': image,
      'dcmd': command,
      'rm': True,
      # Keep docker bridge networking disabled so Mininet controls all interfaces/routes.
      'network_mode': 'none',
      # Containernet nodes must be able to mutate routes/addresses for topology setup.
      'privileged': True,
      'cap_add': ['NET_ADMIN', 'NET_RAW'],
      'volumes': [volume],
      'environment': {
        'NODE_ENV': 'development',
        'CHAOSLAB_PLAYWRIGHT_MODULE': '/opt/chaoslab/node_modules/playwright/index.js',
      },
    }
    try:
      return net.addDocker(name, **kwargs)
    except TypeError:
      # Older Containernet builds may not accept some docker kwargs.
      fallback_keys = ['network_mode', 'cap_add', 'privileged', 'volumes', 'environment']
      for key in fallback_keys:
        kwargs.pop(key, None)
        try:
          return net.addDocker(name, **kwargs)
        except TypeError:
          continue
        except Exception as exc:
          raise TopologyError(
            f'Failed to start docker node {name} with image {image} and command {command!r}: {exc}. '
            'Containernet docker nodes require shell-compatible images (bash) and a valid startup command.'
          ) from exc
      raise TopologyError(
        f'Failed to start docker node {name} with image {image} and command {command!r}: '
        'Containernet addDocker rejected required kwargs.'
      )
    except Exception as exc:
      raise TopologyError(
        f'Failed to start docker node {name} with image {image} and command {command!r}: {exc}. '
        'Containernet docker nodes require shell-compatible images (bash) and a valid startup command.'
      ) from exc

  @staticmethod
  def _planned_docker_node_names(
    services: Iterable[ServiceRecord],
    agents: Iterable[AgentRecord],
  ) -> list[str]:
    names = {record.name for record in services if record and record.name}
    names.update(agent.name for agent in agents if agent and agent.name)
    return sorted(names)

  def _cleanup_planned_docker_nodes(
    self,
    services: Iterable[ServiceRecord],
    agents: Iterable[AgentRecord],
  ) -> None:
    names = self._planned_docker_node_names(services, agents)
    for name in names:
      self._remove_stale_docker_container(name)
    if names:
      self._log(f'Stale docker preflight cleanup completed for {len(names)} planned nodes.')

  def _remove_stale_docker_container(self, name: str) -> None:
    container_name = f'mn.{name}'
    proc = subprocess.run(
      ['docker', 'rm', '-f', container_name],
      cwd=str(self.repo_root),
      text=True,
      capture_output=True,
      check=False,
    )
    if proc.returncode == 0:
      self._log(f'Removed stale docker container: {container_name}')
      return

    stderr = (proc.stderr or '').strip()
    stdout = (proc.stdout or '').strip()
    message = stderr or stdout
    if 'No such container' in message:
      return
    self._log(
      f'Warning: failed to remove stale docker container {container_name}'
      + (f': {message}' if message else '')
    )

  def _allocate_agents(self) -> list[AgentRecord]:
    segments = [segment for segment in self.config.get('segments', []) if isinstance(segment, dict)]
    if not segments:
      raise TopologyError('No network segments configured')

    count = int(self.config.get('agents', {}).get('count', 10))
    count = max(1, min(50, count))

    allocators: dict[str, dict[str, Any]] = {}
    for segment in segments:
      seg_id = str(segment.get('id') or '')
      if not seg_id:
        continue
      network4 = ipaddress.ip_network(str(segment.get('ipv4_subnet')), strict=False)
      network6 = ipaddress.ip_network(str(segment.get('ipv6_subnet')), strict=False)
      gateway4 = str(segment.get('gateway4') or next(network4.hosts()))
      gateway6 = str(segment.get('gateway6') or next(network6.hosts()))
      allocators[seg_id] = {
        'network4': network4,
        'network6': network6,
        'gateway4': gateway4,
        'gateway6': gateway6,
        'iter4': iter(network4.hosts()),
        'iter6': iter(network6.hosts()),
      }

    records: list[AgentRecord] = []
    seg_order = [str(segment.get('id')) for segment in segments if segment.get('id')]

    for index in range(count):
      segment_id = seg_order[index % len(seg_order)]
      allocator = allocators[segment_id]
      ipv4 = self._next_host_ip(allocator['iter4'], skip=allocator['gateway4'])
      ipv6 = self._next_host_ip(allocator['iter6'], skip=allocator['gateway6'])
      record = AgentRecord(
        name=f'agent-{index + 1:02d}',
        segment_id=segment_id,
        ipv4=ipv4,
        ipv6=ipv6,
      )
      records.append(record)

    return records

  def _next_host_ip(self, iterator: Any, skip: str) -> str:
    while True:
      candidate = str(next(iterator))
      if candidate != skip:
        return candidate

  def _configure_router(self, router: Any, segment: dict[str, Any]) -> None:
    segment_id = str(segment.get('id'))
    network4 = ipaddress.ip_network(str(segment.get('ipv4_subnet')), strict=False)
    network6 = ipaddress.ip_network(str(segment.get('ipv6_subnet')), strict=False)
    gateway4 = str(segment.get('gateway4') or next(network4.hosts()))
    gateway6 = str(segment.get('gateway6') or next(network6.hosts()))
    uplink4 = str(segment.get('nat', {}).get('uplink_ipv4') or '')
    uplink6 = str(segment.get('nat', {}).get('uplink_ipv6') or '')
    uplink_network4: ipaddress.IPv4Network | None = None
    uplink_network6: ipaddress.IPv6Network | None = None

    if uplink4:
      try:
        parsed4 = ipaddress.ip_interface(uplink4)
      except ValueError:
        parsed4 = None
      if isinstance(parsed4, ipaddress.IPv4Interface):
        uplink_network4 = parsed4.network

    if uplink6:
      try:
        parsed6 = ipaddress.ip_interface(uplink6)
      except ValueError:
        parsed6 = None
      if isinstance(parsed6, ipaddress.IPv6Interface):
        uplink_network6 = parsed6.network

    router_lan = f'nat_{segment_id}-lan'
    router_wan = f'nat_{segment_id}-wan'

    router.cmd(f'ip addr flush dev {router_lan} || true')
    router.cmd(f'ip addr add {gateway4}/{network4.prefixlen} dev {router_lan}')
    if uplink4:
      router.cmd(f'ip addr flush dev {router_wan} || true')
      router.cmd(f'ip addr add {uplink4} dev {router_wan}')

    # Preserve link-local IPv6 addresses; they are required for reliable ND/NDP.
    router.cmd(f'ip -6 addr flush dev {router_lan} scope global || true')
    router.cmd(f'ip -6 addr add {gateway6}/{network6.prefixlen} dev {router_lan}')
    if uplink6:
      router.cmd(f'ip -6 addr flush dev {router_wan} scope global || true')
      router.cmd(f'ip -6 addr add {uplink6} dev {router_wan}')

    router.cmd('sysctl -w net.ipv4.ip_forward=1 >/dev/null 2>&1')
    router.cmd('sysctl -w net.ipv6.conf.all.forwarding=1 >/dev/null 2>&1')
    router.cmd('sysctl -w net.ipv4.conf.all.rp_filter=0 >/dev/null 2>&1')
    router.cmd('sysctl -w net.ipv4.conf.default.rp_filter=0 >/dev/null 2>&1')
    router.cmd(f'sysctl -w net.ipv4.conf.{router_lan}.rp_filter=0 >/dev/null 2>&1')
    router.cmd(f'sysctl -w net.ipv4.conf.{router_wan}.rp_filter=0 >/dev/null 2>&1')
    # Explicitly enable IPv6 forwarding on router interfaces as well as global/default
    # scopes to avoid interface-level forwarding drift between stage transitions.
    router.cmd(f'sysctl -w net.ipv6.conf.{router_lan}.forwarding=1 >/dev/null 2>&1')
    router.cmd(f'sysctl -w net.ipv6.conf.{router_wan}.forwarding=1 >/dev/null 2>&1')
    # Reset router FORWARD chains to a deterministic pass-through baseline.
    # This avoids inherited/stale chain state shadow-dropping routed lab traffic.
    router.cmd('iptables -F FORWARD >/dev/null 2>&1 || true')
    router.cmd('ip6tables -F FORWARD >/dev/null 2>&1 || true')
    router.cmd('iptables -P FORWARD ACCEPT >/dev/null 2>&1 || true')
    router.cmd('ip6tables -P FORWARD ACCEPT >/dev/null 2>&1 || true')
    router.cmd('iptables -A FORWARD -j ACCEPT >/dev/null 2>&1 || true')
    router.cmd('ip6tables -A FORWARD -j ACCEPT >/dev/null 2>&1 || true')
    router.cmd(f'iptables -t nat -C POSTROUTING -o {router_wan} -j MASQUERADE >/dev/null 2>&1 || iptables -t nat -A POSTROUTING -o {router_wan} -j MASQUERADE')
    # Keep IPv6 routed-only. Remove any stale NAT66 masquerade rule if present.
    router.cmd(f'ip6tables -t nat -D POSTROUTING -o {router_wan} -j MASQUERADE >/dev/null 2>&1 || true')
    router.cmd(f'iptables -C FORWARD -i {router_lan} -o {router_wan} -j ACCEPT >/dev/null 2>&1 || iptables -A FORWARD -i {router_lan} -o {router_wan} -j ACCEPT')
    router.cmd(f'iptables -C FORWARD -i {router_wan} -o {router_lan} -j ACCEPT >/dev/null 2>&1 || iptables -A FORWARD -i {router_wan} -o {router_lan} -j ACCEPT')
    router.cmd(
      f'iptables -C FORWARD -i {router_wan} -o {router_lan} -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT >/dev/null 2>&1 '
      f'|| iptables -A FORWARD -i {router_wan} -o {router_lan} -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT'
    )
    router.cmd(f'ip6tables -C FORWARD -i {router_lan} -o {router_wan} -j ACCEPT >/dev/null 2>&1 || ip6tables -A FORWARD -i {router_lan} -o {router_wan} -j ACCEPT')
    router.cmd(f'ip6tables -C FORWARD -i {router_wan} -o {router_lan} -j ACCEPT >/dev/null 2>&1 || ip6tables -A FORWARD -i {router_wan} -o {router_lan} -j ACCEPT')
    router.cmd(
      f'ip6tables -C FORWARD -i {router_wan} -o {router_lan} -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT >/dev/null 2>&1 '
      f'|| ip6tables -A FORWARD -i {router_wan} -o {router_lan} -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT'
    )

    core_services4, core_services6 = self._core_service_networks()
    if core_services4 is not None and core_services4 != uplink_network4:
      router.cmd(f'ip route replace {core_services4.with_prefixlen} dev {router_wan}')
    if core_services6 is not None and core_services6 != uplink_network6:
      router.cmd(f'ip -6 route replace {core_services6.with_prefixlen} dev {router_wan}')

  def _configure_agent(self, agent: AgentRecord) -> None:
    if agent.node is None:
      return

    intf = self._node_runtime_interface(agent.node)
    desired_mac = self._stable_agent_mac(agent)
    self._set_node_interface_mac(agent.node, intf, desired_mac, f'agent {agent.name}')
    segment = self._segment_config(agent.segment_id)
    network4 = ipaddress.ip_network(str(segment.get('ipv4_subnet')), strict=False)
    network6 = ipaddress.ip_network(str(segment.get('ipv6_subnet')), strict=False)
    gateway4 = str(segment.get('gateway4') or next(network4.hosts()))
    gateway6 = str(segment.get('gateway6') or next(network6.hosts()))

    if agent.ipv4:
      agent.node.cmd(f'ip addr flush dev {intf} || true')
      agent.node.cmd(f'ip addr add {agent.ipv4}/{network4.prefixlen} dev {intf}')
      agent.node.cmd(f'ip link set dev {intf} up >/dev/null 2>&1 || true')
      if self.actual_mode == 'containernet':
        intf = self._ensure_default_route(
          node=agent.node,
          family='ipv4',
          gateway=gateway4,
          intf=intf,
          context=f'agent {agent.name}',
        )
      else:
        agent.node.cmd(f'ip route replace default via {gateway4} dev {intf}')

    if agent.ipv6:
      # Preserve link-local IPv6 addresses; they are required for reliable ND/NDP.
      agent.node.cmd(f'ip -6 addr flush dev {intf} scope global || true')
      agent.node.cmd(f'ip -6 addr add {agent.ipv6}/{network6.prefixlen} dev {intf}')
      agent.node.cmd(f'ip link set dev {intf} up >/dev/null 2>&1 || true')
      if self.actual_mode == 'containernet':
        intf = self._ensure_default_route(
          node=agent.node,
          family='ipv6',
          gateway=gateway6,
          intf=intf,
          context=f'agent {agent.name}',
        )
      else:
        agent.node.cmd(f'ip -6 route replace default via {gateway6} dev {intf}')

    # Docker bridge eth0 may carry a default route that bypasses Mininet links.
    # Remove bridge defaults once Mininet defaults are set.
    if intf != 'eth0':
      agent.node.cmd('ip route del default dev eth0 >/dev/null 2>&1 || true')
      agent.node.cmd('ip -6 route del default dev eth0 >/dev/null 2>&1 || true')

    dns_record = self._services.get('dns')
    nameservers: list[str] = []
    if dns_record is not None:
      if dns_record.ipv4:
        nameservers.append(dns_record.ipv4)
      if dns_record.ipv6:
        nameservers.append(dns_record.ipv6)
    if nameservers:
      resolv_payload = '\n'.join(f'nameserver {ip}' for ip in nameservers)
      self._exec_node_shell(
        agent.node,
        (
          "cat >/etc/resolv.conf <<'EOF'\n"
          f"{resolv_payload}\n"
          "options timeout:1 attempts:2\n"
          "EOF\n"
        ),
      )

    agent.node.cmd('mkdir -p /workspace/net-chaos-lab/artifacts || true')

    if self.actual_mode == 'containernet':
      self._validate_agent_routing(agent, intf)

  @staticmethod
  def _stable_agent_mac(agent: AgentRecord) -> str:
    match = re.search(r'(\d+)$', str(agent.name or ''))
    numeric = int(match.group(1)) if match else 0
    seg_hash = sum(ord(ch) for ch in str(agent.segment_id or '')) % 256
    hi = (numeric >> 8) & 0xFF
    lo = numeric & 0xFF
    return f'02:50:{seg_hash:02x}:00:{hi:02x}:{lo:02x}'

  def _set_node_interface_mac(self, node: Any, intf: str, mac: str, context: str) -> None:
    if not intf or not mac:
      return
    rc, _, _ = self._exec_node_shell(
      node,
      (
        f'ip link set dev {intf} down >/dev/null 2>&1 || true\n'
        f'ip link set dev {intf} address {mac} >/dev/null 2>&1 || true\n'
        f'ip link set dev {intf} up >/dev/null 2>&1 || true'
      ),
    )
    if rc != 0:
      self._log(f'Warning: failed to set interface MAC for {context}: intf={intf} mac={mac}')

  def _interface_mac(self, node: Any, intf: str) -> str:
    if not intf:
      return ''
    rc, stdout, _ = self._exec_node_shell(
      node,
      f'ip -o link show dev {intf} 2>&1',
    )
    if rc != 0:
      return ''
    match = re.search(r'link/(?:ether|loopback)\s+([0-9a-f:]{17})', (stdout or '').lower())
    return match.group(1) if match else ''

  def _seed_ipv6_neighbors(self) -> None:
    if self.actual_mode != 'containernet':
      return

    https_record = self._services.get('https')
    for segment in self.config.get('segments', []) if isinstance(self.config, dict) else []:
      if not isinstance(segment, dict):
        continue
      segment_id = str(segment.get('id') or '').strip()
      if not segment_id:
        continue
      router = self._segment_routers.get(segment_id)
      if router is None:
        continue

      lan_if = f'nat_{segment_id}-lan'
      wan_if = f'nat_{segment_id}-wan'
      gateway6 = str(segment.get('gateway6') or '').strip()
      uplink6 = str(segment.get('nat', {}).get('uplink_ipv6') or '').strip()
      router_uplink_ip6 = ''
      if uplink6:
        try:
          router_uplink_ip6 = str(ipaddress.ip_interface(uplink6).ip)
        except ValueError:
          router_uplink_ip6 = ''

      router_lan_mac = self._interface_mac(router, lan_if)
      router_wan_mac = self._interface_mac(router, wan_if)
      if gateway6 and router_lan_mac:
        for agent in self._agents:
          if agent.node is None or agent.segment_id != segment_id or not agent.ipv6:
            continue
          intf = self._node_runtime_interface(agent.node)
          agent_mac = self._interface_mac(agent.node, intf)
          self._exec_node_shell(
            agent.node,
            f'ip -6 neigh replace {gateway6} lladdr {router_lan_mac} nud permanent dev {intf} >/dev/null 2>&1 || true',
          )
          if agent_mac:
            self._exec_node_shell(
              router,
              f'ip -6 neigh replace {agent.ipv6} lladdr {agent_mac} nud permanent dev {lan_if} >/dev/null 2>&1 || true',
            )

      if (
        https_record is not None
        and https_record.node is not None
        and https_record.ipv6
        and router_uplink_ip6
      ):
        service_intf = self._node_runtime_interface(https_record.node)
        service_mac = self._interface_mac(https_record.node, service_intf)
        if router_wan_mac:
          self._exec_node_shell(
            https_record.node,
            f'ip -6 neigh replace {router_uplink_ip6} lladdr {router_wan_mac} nud permanent dev {service_intf} >/dev/null 2>&1 || true',
          )
        if service_mac:
          self._exec_node_shell(
            router,
            f'ip -6 neigh replace {https_record.ipv6} lladdr {service_mac} nud permanent dev {wan_if} >/dev/null 2>&1 || true',
          )

  def _ensure_default_route(
    self,
    node: Any,
    family: str,
    gateway: str,
    intf: str,
    context: str,
  ) -> str:
    if family not in {'ipv4', 'ipv6'}:
      raise TopologyError(f'Unsupported route family: {family}')

    if family == 'ipv4':
      show_cmd = 'ip route show default 2>&1'
      del_cmd = 'ip route del default >/dev/null 2>&1 || true'
      set_cmd = lambda iface, onlink: (
        f'ip route replace default via {gateway} dev {iface}'
        + (' onlink' if onlink else '')
      )
    else:
      show_cmd = 'ip -6 route show default 2>&1'
      del_cmd = 'ip -6 route del default >/dev/null 2>&1 || true'
      set_cmd = lambda iface, onlink: (
        f'ip -6 route replace default via {gateway} dev {iface}'
        + (' onlink' if onlink else '')
      )

    def route_matches(output: str, iface: str) -> bool:
      return f'via {gateway}' in output and f'dev {iface}' in output

    def apply_and_verify(iface: str, onlink: bool) -> tuple[bool, str]:
      self._exec_node_shell(node, del_cmd)
      rc_set, out_set, _ = self._exec_node_shell(node, set_cmd(iface, onlink))
      rc_show, out_show, _ = self._exec_node_shell(node, show_cmd)
      detail = (
        f'set_rc={rc_set}, set_out="{(out_set or "").strip()}", '
        f'show_rc={rc_show}, show_out="{(out_show or "").strip()}"'
      )
      ok = rc_show == 0 and route_matches((out_show or '').strip(), iface)
      return ok, detail

    # Fast path: route already correct.
    rc_show, out_show, _ = self._exec_node_shell(node, show_cmd)
    if rc_show == 0 and route_matches((out_show or '').strip(), intf):
      return intf

    ok, detail = apply_and_verify(intf, onlink=False)
    if ok:
      return intf

    ok_onlink, detail_onlink = apply_and_verify(intf, onlink=True)
    if ok_onlink:
      return intf

    match = re.search(r'-eth(\d+)$', intf)
    if match:
      fallback = f'eth{match.group(1)}'
      if fallback != intf:
        rc_link, _, _ = self._exec_node_shell(node, f'ip link show dev {fallback} >/dev/null 2>&1')
        if rc_link == 0:
          ok_fallback, detail_fallback = apply_and_verify(fallback, onlink=True)
          if ok_fallback:
            self._log(f'{context}: default route interface remap {intf} -> {fallback}')
            return fallback
          raise TopologyError(
            f'{context} default route setup failed for {family} gateway {gateway}: '
            f'primary[{detail}] primary_onlink[{detail_onlink}] fallback[{detail_fallback}]'
          )

    raise TopologyError(
      f'{context} default route setup failed for {family} gateway {gateway}: '
      f'primary[{detail}] primary_onlink[{detail_onlink}]'
    )

  def _configure_service(self, record: ServiceRecord, key: str) -> None:
    if record.node is None:
      return

    intf = self._node_runtime_interface(record.node)
    core_network4 = ipaddress.ip_network(str(self.config.get('core_services', {}).get('subnet_ipv4') or '10.40.254.0/24'), strict=False)
    core_network6 = ipaddress.ip_network(str(self.config.get('core_services', {}).get('subnet_ipv6') or 'fd42:40:254::/64'), strict=False)
    record.node.cmd(f'ip link set dev {intf} up >/dev/null 2>&1 || true')

    if record.ipv4:
      record.node.cmd(f'ip addr flush dev {intf} || true')
      record.node.cmd(f'ip addr add {record.ipv4}/{core_network4.prefixlen} dev {intf}')

    if record.ipv6:
      # Preserve link-local IPv6 addresses; they are required for reliable ND/NDP.
      record.node.cmd(f'ip -6 addr flush dev {intf} scope global || true')
      record.node.cmd(f'ip -6 addr add {record.ipv6}/{core_network6.prefixlen} dev {intf}')

    segment_routes4, segment_routes6 = self._core_segment_routes()
    for network, gateway in segment_routes4:
      if network == core_network4:
        continue
      record.node.cmd(
        f'ip route replace {network.with_prefixlen} via {gateway.compressed} dev {intf} onlink'
      )
    for network, gateway in segment_routes6:
      if network == core_network6:
        continue
      record.node.cmd(
        f'ip -6 route replace {network.with_prefixlen} via {gateway.compressed} dev {intf} onlink'
      )

    uplink_networks4, uplink_networks6 = self._core_uplink_networks()
    for network in uplink_networks4:
      if network == core_network4:
        continue
      record.node.cmd(f'ip route replace {network.with_prefixlen} dev {intf}')
    for network in uplink_networks6:
      if network == core_network6:
        continue
      record.node.cmd(f'ip -6 route replace {network.with_prefixlen} dev {intf}')

    spec = self._service_start_spec(record, key)
    if spec is None:
      return

    self._start_service_process(record, key, spec)
    self._wait_for_service_health(record, key, spec)

  def _validate_core_service_reachability(self) -> None:
    if self.actual_mode != 'containernet':
      return

    https = self._services.get('https')
    if https is None or https.node is None:
      return
    sample_agents: dict[str, AgentRecord] = {}
    for agent in self._agents:
      if agent.node is None or not agent.enabled:
        continue
      sample_agents.setdefault(agent.segment_id, agent)

    if not sample_agents:
      return

    require_ipv6 = not bool(https.ipv4) and bool(https.ipv6)
    probe_targets: list[dict[str, Any]] = []
    if https.ipv4:
      probe_targets.append({
        'family': 'ipv4',
        'target': str(https.ipv4),
        'probe': f'echo >/dev/tcp/{https.ipv4}/443',
        'route': f'ip route get {https.ipv4} 2>&1',
        'required': True,
      })
    if https.ipv6:
      probe_targets.append({
        'family': 'ipv6',
        'target': str(https.ipv6),
        'probe': f'curl -6 -k -sS -o /dev/null --max-time 4 https://[{https.ipv6}]/netviz/',
        'route': f'ip -6 route get {https.ipv6} 2>&1',
        'required': require_ipv6,
      })
    if not probe_targets:
      return

    hard_failures: list[str] = []
    soft_failures: list[str] = []
    timeout_s = 8.0
    poll_s = 0.5

    for segment_id, agent in sorted(sample_agents.items(), key=lambda item: item[0]):
      for target in probe_targets:
        deadline = time.monotonic() + timeout_s
        rc_probe = 1
        probe_out = ''
        while time.monotonic() < deadline:
          rc_probe, probe_out, _ = self._exec_node_shell(agent.node, target['probe'])
          if rc_probe == 0:
            break
          time.sleep(poll_s)

        if rc_probe == 0:
          continue

        rc_route, route_out, _ = self._exec_node_shell(agent.node, target['route'])
        detail = (
          f'{agent.name}@{segment_id} {target["family"]}({target["target"]}): '
          f'probe_rc={rc_probe}, probe_out="{(probe_out or "").strip()}", '
          f'route_rc={rc_route}, route_out="{(route_out or "").strip()}"'
        )
        if bool(target.get('required')):
          hard_failures.append(detail)
        else:
          soft_failures.append(detail)

    if soft_failures:
      self._log(
        'Warning: optional core HTTPS reachability probes failed: '
        + ' | '.join(soft_failures)
      )

    if not hard_failures:
      return

    _, service_diag, _ = self._exec_node_shell(
      https.node,
      (
        "printf -- '--- ip addr ---\\n'; ip -4 addr show 2>&1; "
        "printf -- '\\n--- ip -6 addr ---\\n'; ip -6 addr show 2>&1; "
        "printf -- '\\n--- ip route ---\\n'; ip route 2>&1; "
        "printf -- '\\n--- ip -6 route ---\\n'; ip -6 route 2>&1; "
        "printf -- '\\n--- listeners ---\\n'; (ss -ltnp 2>/dev/null | grep -E '[:.]443\\b' || true); "
        "printf -- '\\n--- caddy pid ---\\n'; "
        "pid=$(cat /tmp/https.pid 2>/dev/null || true); "
        "[ -n \"$pid\" ] && (kill -0 \"$pid\" 2>/dev/null && echo \"alive:$pid\" || echo \"dead:$pid\") || echo 'missing'; "
        "printf -- '\\n--- https log tail ---\\n'; tail -n 40 /tmp/https.log 2>/dev/null || true"
      ),
    )
    raise TopologyError(
      'Core HTTPS reachability validation failed from sample agents. '
      + ' | '.join(hard_failures)
      + (f'\nService diagnostics:\n{service_diag.strip()}' if service_diag and service_diag.strip() else '')
    )

  def _validate_agent_routing(self, agent: AgentRecord, intf: str) -> None:
    if agent.node is None:
      return
    segment = self._segment_config(agent.segment_id)
    network4 = ipaddress.ip_network(str(segment.get('ipv4_subnet')), strict=False)
    gateway4 = str(segment.get('gateway4') or next(network4.hosts()))

    if agent.ipv4:
      rc, stdout, _ = self._exec_node_shell(
        agent.node,
        f'ip -4 addr show dev {intf} 2>&1',
      )
      addr_output = (stdout or '').strip()
      if rc != 0 or agent.ipv4 not in addr_output:
        raise TopologyError(
          f'Agent {agent.name} IPv4 not configured on {intf}: expected {agent.ipv4}. '
          f'Output: "{addr_output}"'
        )

      rc, stdout, _ = self._exec_node_shell(
        agent.node,
        'ip route show default 2>&1',
      )
      default_output = (stdout or '').strip()
      if rc != 0 or f'via {gateway4}' not in default_output or f'dev {intf}' not in default_output:
        raise TopologyError(
          f'Agent {agent.name} default route mismatch: expected via {gateway4} dev {intf}, '
          f'got "{default_output}".'
        )

    https_record = self._services.get('https')
    if https_record is None or not https_record.ipv4:
      return

    rc, stdout, _ = self._exec_node_shell(
      agent.node,
      f'ip route get {https_record.ipv4} 2>&1',
    )
    route_output = (stdout or '').strip()
    if rc != 0:
      raise TopologyError(
        f'Agent route probe failed for {agent.name} (service={https_record.ipv4}, rc={rc})'
        + (f': {route_output}' if route_output else '')
      )
    if (
      f'dev {intf}' not in route_output
      or f'via {gateway4}' not in route_output
      or (agent.ipv4 and f'src {agent.ipv4}' not in route_output)
    ):
      raise TopologyError(
        f'Agent {agent.name} route mismatch for {https_record.ipv4}: '
        f'expected via {gateway4} dev {intf}'
        + (f' src {agent.ipv4}' if agent.ipv4 else '')
        + f', got "{route_output}". '
        'Container likely lacks NET_ADMIN privileges or interface selection is wrong.'
      )

  def _service_start_spec(self, record: ServiceRecord, key: str) -> dict[str, Any] | None:
    if key == 'dns':
      host_entries = self.get_service_host_entries()
      host_lines = '\n'.join(
        f"echo 'address=/{host}/{ip}' >> /tmp/dnsmasq.conf"
        for host, ip in host_entries
        if host and ip
      )
      command = (
        "command -v dnsmasq >/dev/null 2>&1 || { echo 'dnsmasq missing from container image'; exit 127; }\n"
        "cat >/tmp/dnsmasq.conf <<'EOF'\n"
        "port=53\n"
        "no-resolv\n"
        "server=1.1.1.1\n"
        "server=8.8.8.8\n"
        "listen-address=0.0.0.0\n"
        "listen-address=::\n"
        "bind-interfaces\n"
        "log-queries\n"
        "log-facility=/tmp/dnsmasq-runtime.log\n"
        "EOF\n"
        f"{host_lines}\n"
        "dnsmasq --conf-file=/tmp/dnsmasq.conf --keep-in-foreground >/tmp/dns.log 2>&1 &\n"
        "echo $! >/tmp/dns.pid\n"
      )
      return {
        'command': command,
        'pid_file': '/tmp/dns.pid',
        'log_file': '/tmp/dns.log',
        'tcp_port': 53,
      }

    if key == 'https':
      site_targets: list[str] = []
      cert_alt_names: list[str] = []
      if record.host:
        site_targets.append(f'https://{record.host}')
        cert_alt_names.append(f'DNS:{record.host}')
      if record.ipv4:
        site_targets.append(f'https://{record.ipv4}')
        cert_alt_names.append(f'IP:{record.ipv4}')
      if record.ipv6:
        site_targets.append(f'https://[{record.ipv6}]')
        cert_alt_names.append(f'IP:{record.ipv6}')
      if not site_targets:
        site_targets.append('https://localhost')
      if not cert_alt_names:
        cert_alt_names.append('DNS:localhost')
      site_label = ', '.join(site_targets)
      cert_san = shlex.quote(','.join(cert_alt_names))
      cert_subject = shlex.quote(f'/CN={record.host or "demos.peercompute.test"}')
      ready_checks: list[str] = []
      if record.host:
        host_resolve = shlex.quote(f'{record.host}:443:127.0.0.1')
        host_url = shlex.quote(f'https://{record.host}/netviz/')
        ready_checks.append(
          "status=$(curl -k -sS -o /dev/null -w '%{http_code}' --max-time 4 "
          f"--resolve {host_resolve} {host_url} 2>/dev/null || true); "
          "[[ \"$status\" =~ ^[0-9]{3}$ ]]"
        )
      if record.ipv4:
        ipv4_url = shlex.quote(f'https://{record.ipv4}/netviz/')
        ready_checks.append(
          "status=$(curl -k -sS -o /dev/null -w '%{http_code}' --max-time 4 "
          f"{ipv4_url} 2>/dev/null || true); "
          "[[ \"$status\" =~ ^[0-9]{3}$ ]]"
        )
      if record.ipv6:
        ipv6_url = shlex.quote(f'https://[{record.ipv6}]/netviz/')
        ready_checks.append(
          "status=$(curl -6 -k -sS -o /dev/null -w '%{http_code}' --max-time 6 "
          f"{ipv6_url} 2>/dev/null || true); "
          "[[ \"$status\" =~ ^[0-9]{3}$ ]]"
        )
      return {
        'command': (
          "command -v caddy >/dev/null 2>&1 || { echo 'caddy missing from container image'; exit 127; }\n"
          "command -v openssl >/dev/null 2>&1 || { echo 'openssl missing from container image'; exit 127; }\n"
          "openssl req -x509 -newkey rsa:2048 -nodes -days 2 "
          "-keyout /tmp/chaoslab-https.key -out /tmp/chaoslab-https.crt "
          f"-subj {cert_subject} -addext \"subjectAltName={cert_san}\" >/tmp/https-cert.log 2>&1\n"
          "cat >/tmp/Caddyfile <<'EOF'\n"
          "{\n"
          "  servers {\n"
          "    protocols h1 h2\n"
          "  }\n"
          "}\n"
          f"{site_label} {{\n"
          "  bind 0.0.0.0 ::\n"
          "  tls /tmp/chaoslab-https.crt /tmp/chaoslab-https.key\n"
          "  root * /workspace/docs\n"
          "  file_server\n"
          "}\n"
          "EOF\n"
          "caddy run --config /tmp/Caddyfile --adapter caddyfile >/tmp/https.log 2>&1 &\n"
          "echo $! >/tmp/https.pid\n"
        ),
        'pid_file': '/tmp/https.pid',
        'log_file': '/tmp/https.log',
        'tcp_port': 443,
        'ready_checks': ready_checks,
      }

    if key == 'relay':
      relay_host = record.host or 'relay.peercompute.test'
      turn_record = self._services.get('turn') or self._build_service_records().get('turn')
      turn_host = (turn_record.host if turn_record else '') or 'turn.peercompute.test'
      relay_cert_alt_names: list[str] = [f'DNS:{relay_host}']
      if record.ipv4:
        relay_cert_alt_names.append(f'IP:{record.ipv4}')
      if record.ipv6:
        relay_cert_alt_names.append(f'IP:{record.ipv6}')
      relay_cert_san = shlex.quote(','.join(relay_cert_alt_names))
      relay_cert_subject = shlex.quote(f'/CN={relay_host}')
      relay_config_path = '/workspace/docs/netviz/relay-config.json'
      relay_webrtc_config = json.dumps({
        'iceServers': [
          {'urls': [f'stun:{turn_host}:3478']},
          {
            'urls': [
              f'turn:{turn_host}:3478?transport=udp',
              f'turn:{turn_host}:3478?transport=tcp',
            ],
            'username': 'peer',
            'credential': 'compute',
          },
        ],
      }, separators=(',', ':'))
      return {
        'command': (
          "command -v openssl >/dev/null 2>&1 || { echo 'openssl missing from container image'; exit 127; }\n"
          "openssl req -x509 -newkey rsa:2048 -nodes -days 2 "
          "-keyout /tmp/chaoslab-relay.key -out /tmp/chaoslab-relay.crt "
          f"-subj {relay_cert_subject} -addext \"subjectAltName={relay_cert_san}\" >/tmp/relay-cert.log 2>&1\n"
          "cd /workspace\n"
          "RELAY_PUBLIC_PROTOCOL=wss "
          f"RELAY_PUBLIC_HOST={shlex.quote(relay_host)} "
          "RELAY_PUBLIC_PORT=8080 "
          "RELAY_LISTEN_HOST=0.0.0.0 "
          "RELAY_LISTEN_PORT=8080 "
          "RELAY_SSL_CERT=/tmp/chaoslab-relay.crt "
          "RELAY_SSL_KEY=/tmp/chaoslab-relay.key "
          f"RELAY_WEBRTC_CONFIG={shlex.quote(relay_webrtc_config)} "
          f"RELAY_CONFIG_FILE={shlex.quote(relay_config_path)} "
          "node /workspace/peercompute/src/relay/server.js >/tmp/relay.log 2>&1 &\n"
          "echo $! >/tmp/relay.pid\n"
        ),
        'pid_file': '/tmp/relay.pid',
        'log_file': '/tmp/relay.log',
        'tcp_port': 8080,
        'ready_checks': [
          f"[ -s {shlex.quote(relay_config_path)} ]",
          f"grep -q '/wss/' {shlex.quote(relay_config_path)}",
          f"grep -q {shlex.quote(relay_host)} {shlex.quote(relay_config_path)}",
          f"grep -q {shlex.quote(turn_host)} {shlex.quote(relay_config_path)}",
          f"grep -q '\"iceServers\"' {shlex.quote(relay_config_path)}",
        ],
      }

    if key == 'turn':
      return {
        'command': (
          "command -v turnserver >/dev/null 2>&1 || { echo 'turnserver missing from container image'; exit 127; }\n"
          "turnserver -n --fingerprint --lt-cred-mech --realm peercompute.test --user peer:compute "
          ">/tmp/turn.log 2>&1 &\n"
          "echo $! >/tmp/turn.pid\n"
        ),
        'pid_file': '/tmp/turn.pid',
        'log_file': '/tmp/turn.log',
      }

    return None

  def _start_service_process(self, record: ServiceRecord, key: str, spec: dict[str, Any]) -> None:
    rc, stdout, stderr = self._exec_node_shell(record.node, spec['command'])
    if rc != 0:
      detail = '\n'.join(part for part in [stdout.strip(), stderr.strip()] if part).strip()
      raise TopologyError(
        f'Service start command failed for {key} ({record.host}), rc={rc}'
        + (f': {detail}' if detail else '')
      )

  def _wait_for_service_health(self, record: ServiceRecord, key: str, spec: dict[str, Any]) -> None:
    pid_file = str(spec.get('pid_file') or '')
    tcp_port = spec.get('tcp_port')
    ready_checks_raw = spec.get('ready_checks')
    if isinstance(ready_checks_raw, str):
      ready_checks = [ready_checks_raw]
    elif isinstance(ready_checks_raw, list):
      ready_checks = [str(cmd) for cmd in ready_checks_raw if str(cmd or '').strip()]
    else:
      ready_checks = []
    log_file = str(spec.get('log_file') or f'/tmp/{key}.log')
    timeout = float(self._service_health_cfg.get('timeout_seconds', 20))
    interval = float(self._service_health_cfg.get('poll_interval_seconds', 1))
    deadline = time.monotonic() + timeout
    last_error = 'unknown'

    while time.monotonic() < deadline:
      alive_cmd = (
        f'pid=$(cat {shlex.quote(pid_file)} 2>/dev/null || true); '
        '[ -n "$pid" ] && kill -0 "$pid" 2>/dev/null'
      )
      rc, _, _ = self._exec_node_shell(record.node, alive_cmd)
      if rc != 0:
        last_error = f'process from {pid_file} is not alive'
        time.sleep(interval)
        continue

      if tcp_port is not None:
        tcp_targets = ['127.0.0.1']
        if record.ipv4:
          tcp_targets.append(record.ipv4)
        all_targets_healthy = True
        for target in tcp_targets:
          port_cmd = f'echo >/dev/tcp/{target}/{int(tcp_port)}'
          rc, _, _ = self._exec_node_shell(record.node, port_cmd)
          if rc != 0:
            all_targets_healthy = False
            last_error = f'tcp port {tcp_port} is not accepting connections on {target}'
            break
        if not all_targets_healthy:
          time.sleep(interval)
          continue

      checks_healthy = True
      for index, check_cmd in enumerate(ready_checks):
        rc_ready, ready_stdout, _ = self._exec_node_shell(record.node, check_cmd)
        if rc_ready != 0:
          checks_healthy = False
          ready_detail = (ready_stdout or '').strip()
          if not ready_detail:
            ready_detail = 'non-zero exit'
          last_error = (
            f'ready check {index + 1}/{len(ready_checks)} failed: {ready_detail}'
          )
          break
      if not checks_healthy:
        time.sleep(interval)
        continue

      self._log(f'Service healthy: {key} ({record.host})')
      return

    tail_cmd = f'tail -n 40 {shlex.quote(log_file)} 2>/dev/null || true'
    _, stdout, _ = self._exec_node_shell(record.node, tail_cmd)
    log_tail = stdout.strip()
    raise TopologyError(
      f'Service health check failed for {key} ({record.host}): {last_error}. '
      + (f'Log tail:\n{log_tail}' if log_tail else 'No service logs available.')
    )

  def _exec_node_shell(self, node: Any, script: str) -> tuple[int, str, str]:
    if node is None:
      return 1, '', 'node is None'

    wrapped = (
      f'{script}\n'
      'rc=$?\n'
      f'printf "{self._SHELL_EXIT_SENTINEL}%s\\n" "$rc"\n'
    )
    command = f"env TERM=dumb bash --noprofile --norc -c {shlex.quote(wrapped)}"
    raw_output = str(node.cmd(command) or '')
    rc, stdout = self._parse_shell_output(raw_output, default_rc=1)
    return rc, stdout, ''

  def _ensure_node_network_tooling(self, node: Any, node_name: str) -> None:
    if node is None:
      raise TopologyError(f'Cannot ensure networking tools for {node_name}: node is None')

    rc, _, _ = self._exec_node_shell(node, 'command -v ip >/dev/null 2>&1')
    if rc == 0:
      return

    raise TopologyError(
      f'`ip` command is missing in {node_name}; networking setup cannot proceed. '
      f'Use an agent/service image that includes iproute2 (default: {DEFAULT_CHAOSLAB_IMAGE}).'
    )

  @classmethod
  def _sanitize_shell_output(cls, text: str) -> str:
    cleaned = str(text or '').replace('\r', '')
    cleaned = cls._ANSI_ESCAPE_RE.sub('', cleaned)
    cleaned = cls._CONTROL_CHAR_RE.sub('', cleaned)
    return cleaned

  @classmethod
  def _parse_shell_output(cls, text: str, default_rc: int = 1) -> tuple[int, str]:
    cleaned = cls._sanitize_shell_output(text)
    rc = int(default_rc)
    stdout_lines: list[str] = []
    marker = cls._SHELL_EXIT_SENTINEL
    for raw in cleaned.splitlines():
      if marker in raw:
        prefix, suffix = raw.split(marker, 1)
        prefix = prefix.rstrip()
        if prefix and prefix.strip() not in {'>', '>>'}:
          stdout_lines.append(prefix)
        value = suffix.strip().split(' ', 1)[0]
        try:
          rc = int(value)
        except ValueError:
          rc = int(default_rc)
        continue
      if raw.strip() in {'>', '>>'}:
        # Containernet interactive shells can emit continuation prompts on wrapped commands.
        continue
      stdout_lines.append(raw.rstrip())
    stdout = '\n'.join(line for line in stdout_lines if line).strip()
    return rc, stdout

  def _seed_agent_hosts(self, agents: Iterable[AgentRecord] | None = None) -> None:
    host_entries = self.get_service_host_entries()
    target_agents = list(agents) if agents is not None else self._agents
    for agent in target_agents:
      if agent.node is None:
        continue
      for host, ip in host_entries:
        if not host or not ip:
          continue
        escaped = shlex.quote(f'{ip} {host}')
        rc, _, _ = self._exec_node_shell(agent.node, f'echo {escaped} >> /etc/hosts')
        if rc != 0:
          self._log(f'Warning: failed to seed /etc/hosts for {agent.name}: {host} -> {ip}')

  def _validate_agent_probe_runtime(self, agents: Iterable[AgentRecord] | None = None) -> None:
    target_agents = list(agents) if agents is not None else self._agents
    if not target_agents:
      return

    candidate = next((agent for agent in target_agents if agent and agent.node is not None), None)
    if candidate is None or candidate.node is None:
      return

    # Run a lightweight Playwright launch/close in-container before probes.
    # This fails fast on image/runtime mismatches (e.g. package/browser version drift).
    check_cmd = (
      'cd /workspace || exit 44\n'
      'node /workspace/net-chaos-lab/agent/runtime-check.mjs'
    )

    rc, stdout, _ = self._exec_node_shell(candidate.node, check_cmd)
    if rc == 0:
      return

    detail = (stdout or '').strip()
    detail_tail = '\n'.join(detail.splitlines()[-25:]).strip() if detail else ''
    hint = (
      'Rebuild the lab image with `npm run chaos-lab:image:build` so Playwright package and '
      'browser binaries stay in sync.'
    )
    raise TopologyError(
      f'Agent probe runtime validation failed in {candidate.name} (rc={rc}). {hint}'
      + (f' Diagnostic tail:\n{detail_tail}' if detail_tail else '')
    )

  def _segment_config(self, segment_id: str) -> dict[str, Any]:
    for segment in self.config.get('segments', []):
      if isinstance(segment, dict) and str(segment.get('id')) == segment_id:
        return segment
    raise TopologyError(f'Unknown segment id: {segment_id}')

  def _core_service_networks(self) -> tuple[ipaddress.IPv4Network | None, ipaddress.IPv6Network | None]:
    core_cfg = self.config.get('core_services', {}) if isinstance(self.config, dict) else {}
    subnet4_text = str(core_cfg.get('subnet_ipv4') or '').strip()
    subnet6_text = str(core_cfg.get('subnet_ipv6') or '').strip()
    network4: ipaddress.IPv4Network | None = None
    network6: ipaddress.IPv6Network | None = None

    if subnet4_text:
      try:
        parsed4 = ipaddress.ip_network(subnet4_text, strict=False)
      except ValueError as exc:
        raise TopologyError(f'Invalid core_services.subnet_ipv4: {subnet4_text}') from exc
      if isinstance(parsed4, ipaddress.IPv4Network):
        network4 = parsed4

    if subnet6_text:
      try:
        parsed6 = ipaddress.ip_network(subnet6_text, strict=False)
      except ValueError as exc:
        raise TopologyError(f'Invalid core_services.subnet_ipv6: {subnet6_text}') from exc
      if isinstance(parsed6, ipaddress.IPv6Network):
        network6 = parsed6

    return network4, network6

  def _core_uplink_networks(self) -> tuple[list[ipaddress.IPv4Network], list[ipaddress.IPv6Network]]:
    networks4: set[ipaddress.IPv4Network] = set()
    networks6: set[ipaddress.IPv6Network] = set()
    segments = self.config.get('segments', []) if isinstance(self.config, dict) else []
    for raw in segments:
      if not isinstance(raw, dict):
        continue
      nat_cfg = raw.get('nat') if isinstance(raw.get('nat'), dict) else {}
      uplink4_text = str(nat_cfg.get('uplink_ipv4') or '').strip()
      uplink6_text = str(nat_cfg.get('uplink_ipv6') or '').strip()

      if uplink4_text:
        try:
          parsed4 = ipaddress.ip_interface(uplink4_text)
        except ValueError as exc:
          raise TopologyError(f'Invalid segment nat.uplink_ipv4: {uplink4_text}') from exc
        if isinstance(parsed4, ipaddress.IPv4Interface):
          networks4.add(parsed4.network)

      if uplink6_text:
        try:
          parsed6 = ipaddress.ip_interface(uplink6_text)
        except ValueError as exc:
          raise TopologyError(f'Invalid segment nat.uplink_ipv6: {uplink6_text}') from exc
        if isinstance(parsed6, ipaddress.IPv6Interface):
          networks6.add(parsed6.network)

    sorted4 = sorted(networks4, key=lambda network: str(network))
    sorted6 = sorted(networks6, key=lambda network: str(network))
    return sorted4, sorted6

  def _core_segment_routes(
    self,
  ) -> tuple[
    list[tuple[ipaddress.IPv4Network, ipaddress.IPv4Address]],
    list[tuple[ipaddress.IPv6Network, ipaddress.IPv6Address]],
  ]:
    routes4: set[tuple[ipaddress.IPv4Network, ipaddress.IPv4Address]] = set()
    routes6: set[tuple[ipaddress.IPv6Network, ipaddress.IPv6Address]] = set()
    segments = self.config.get('segments', []) if isinstance(self.config, dict) else []
    for raw in segments:
      if not isinstance(raw, dict):
        continue
      nat_cfg = raw.get('nat') if isinstance(raw.get('nat'), dict) else {}

      subnet4_text = str(raw.get('ipv4_subnet') or '').strip()
      uplink4_text = str(nat_cfg.get('uplink_ipv4') or '').strip()
      if subnet4_text and uplink4_text:
        try:
          network4 = ipaddress.ip_network(subnet4_text, strict=False)
        except ValueError as exc:
          raise TopologyError(f'Invalid segment ipv4_subnet: {subnet4_text}') from exc
        try:
          uplink4 = ipaddress.ip_interface(uplink4_text)
        except ValueError as exc:
          raise TopologyError(f'Invalid segment nat.uplink_ipv4: {uplink4_text}') from exc
        if isinstance(network4, ipaddress.IPv4Network) and isinstance(uplink4, ipaddress.IPv4Interface):
          routes4.add((network4, uplink4.ip))

      subnet6_text = str(raw.get('ipv6_subnet') or '').strip()
      uplink6_text = str(nat_cfg.get('uplink_ipv6') or '').strip()
      if subnet6_text and uplink6_text:
        try:
          network6 = ipaddress.ip_network(subnet6_text, strict=False)
        except ValueError as exc:
          raise TopologyError(f'Invalid segment ipv6_subnet: {subnet6_text}') from exc
        try:
          uplink6 = ipaddress.ip_interface(uplink6_text)
        except ValueError as exc:
          raise TopologyError(f'Invalid segment nat.uplink_ipv6: {uplink6_text}') from exc
        if isinstance(network6, ipaddress.IPv6Network) and isinstance(uplink6, ipaddress.IPv6Interface):
          routes6.add((network6, uplink6.ip))

    sorted4 = sorted(routes4, key=lambda item: (str(item[0]), str(item[1])))
    sorted6 = sorted(routes6, key=lambda item: (str(item[0]), str(item[1])))
    return sorted4, sorted6

  def _iter_all_nodes(self) -> list[Any]:
    nodes: list[Any] = []
    nodes.extend(self._segment_routers.values())
    nodes.extend([agent.node for agent in self._agents if agent.node is not None])
    nodes.extend([service.node for service in self._services.values() if service.node is not None])
    return nodes

  def _iter_ip_mode_nodes(self) -> list[Any]:
    if self._ip_mode_scope == 'all':
      return self._iter_all_nodes()
    return [agent.node for agent in self._agents if agent.node is not None]

  def _resolve_ip_mode_scope(self) -> str:
    network_cfg = self.config.get('network') if isinstance(self.config, dict) else {}
    configured = ''
    if isinstance(network_cfg, dict):
      configured = str(network_cfg.get('ip_mode_scope') or '')
    raw_scope = os.environ.get('CHAOSLAB_IP_MODE_SCOPE', configured).strip().lower()
    normalized = raw_scope.replace('_', '-')
    if not normalized:
      return 'agents'
    if normalized in {'agents', 'all'}:
      return normalized
    self._log(f'Unknown ip_mode_scope "{raw_scope}", defaulting to "agents".')
    return 'agents'

  def _apply_ip_mode_to_node(self, node: Any, mode: str) -> None:
    ipv6_only_tag = 'chaos-ipv6-only'
    ipv4_only_tag = 'chaos-ipv4-only'
    self._clear_ip_mode_filter_rules(node)

    if mode == 'dual-stack':
      return

    if mode == 'ipv4-only':
      node.cmd(
        f'ip6tables -C OUTPUT -m comment --comment {ipv4_only_tag} -j DROP >/dev/null 2>&1 '
        f'|| ip6tables -A OUTPUT -m comment --comment {ipv4_only_tag} -j DROP'
      )
      return

    node.cmd(
      f'iptables -C OUTPUT -m comment --comment {ipv6_only_tag} -j DROP >/dev/null 2>&1 '
      f'|| iptables -A OUTPUT -m comment --comment {ipv6_only_tag} -j DROP'
    )

  def _clear_ip_mode_filter_rules(self, node: Any) -> None:
    ipv6_only_tag = 'chaos-ipv6-only'
    ipv4_only_tag = 'chaos-ipv4-only'
    node.cmd(
      f'iptables -D OUTPUT -m comment --comment {ipv6_only_tag} -j DROP >/dev/null 2>&1 || true'
    )
    node.cmd(
      f'ip6tables -D OUTPUT -m comment --comment {ipv4_only_tag} -j DROP >/dev/null 2>&1 || true'
    )

  def _apply_ip_mode_to_agent(self, agent: AgentRecord, mode: str) -> None:
    if agent.node is None:
      return
    node = agent.node
    self._clear_ip_mode_filter_rules(node)

    try:
      segment = self._segment_config(agent.segment_id)
      network4 = ipaddress.ip_network(str(segment.get('ipv4_subnet')), strict=False)
      network6 = ipaddress.ip_network(str(segment.get('ipv6_subnet')), strict=False)
      gateway4 = str(segment.get('gateway4') or next(network4.hosts()))
      gateway6 = str(segment.get('gateway6') or next(network6.hosts()))
      intf = self._node_runtime_interface(node)
    except Exception:
      # If segment metadata is unavailable, fall back to filter-only behavior.
      self._apply_ip_mode_to_node(node, mode)
      return

    if mode == 'dual-stack':
      intf = self._ensure_default_route(
        node=node,
        family='ipv4',
        gateway=gateway4,
        intf=intf,
        context=f'agent {agent.name} ip-mode dual-stack',
      )
      intf = self._ensure_default_route(
        node=node,
        family='ipv6',
        gateway=gateway6,
        intf=intf,
        context=f'agent {agent.name} ip-mode dual-stack',
      )
      return

    if mode == 'ipv4-only':
      self._ensure_default_route(
        node=node,
        family='ipv4',
        gateway=gateway4,
        intf=intf,
        context=f'agent {agent.name} ip-mode ipv4-only',
      )
      self._exec_node_shell(node, 'ip -6 route del default >/dev/null 2>&1 || true')
      return

    intf = self._ensure_default_route(
      node=node,
      family='ipv6',
      gateway=gateway6,
      intf=intf,
      context=f'agent {agent.name} ip-mode ipv6-only',
    )
    self._exec_node_shell(node, 'ip route del default >/dev/null 2>&1 || true')
    self._warm_agent_ipv6_path(
      agent=agent,
      intf=intf,
      gateway6=gateway6,
      service_ipv6=(self._services.get('https').ipv6 if self._services.get('https') is not None else None),
    )

  def _warm_agent_ipv6_path(
    self,
    agent: AgentRecord,
    intf: str,
    gateway6: str,
    service_ipv6: str | None,
  ) -> None:
    if agent.node is None:
      return

    warmup_timeout_s = self._env_int(
      'CHAOSLAB_IPV6_WARMUP_TIMEOUT_S',
      12,
      minimum=2,
      maximum=60,
    )
    sleep_ms = self._env_int(
      'CHAOSLAB_IPV6_WARMUP_STEP_MS',
      600,
      minimum=100,
      maximum=3000,
    )
    deadline = time.monotonic() + float(warmup_timeout_s)
    last_detail = 'no checks executed'
    attempt = 0
    warmup_flush_neigh = self._env_int(
      'CHAOSLAB_IPV6_WARMUP_FLUSH_NEIGH',
      0,
      minimum=0,
      maximum=1,
    ) == 1

    if warmup_flush_neigh:
      self._exec_node_shell(agent.node, f'ip -6 neigh flush dev {intf} >/dev/null 2>&1 || true')

    while time.monotonic() <= deadline:
      attempt += 1
      rc_ping, _, _ = self._exec_node_shell(
        agent.node,
        f'ping -6 -c 1 -w 2 {gateway6}',
      )
      self._exec_node_shell(agent.node, 'ip -6 route flush cache >/dev/null 2>&1 || true')
      if rc_ping != 0:
        last_detail = f'attempt={attempt} ping_gateway_rc={rc_ping}'
        if time.monotonic() >= deadline:
          break
        time.sleep(float(sleep_ms) / 1000.0)
        continue

      if service_ipv6:
        rc_curl, out_curl, _ = self._exec_node_shell(
          agent.node,
          (
            f"curl -6 -k -sS -o /dev/null -w '%{{http_code}}' --max-time 5 "
            f"https://[{service_ipv6}]/netviz/"
          ),
        )
        status = (out_curl or '').strip().splitlines()[-1:] or ['']
        http_code = status[0]
        if rc_curl == 0 and http_code.isdigit() and int(http_code) >= 200 and int(http_code) < 400:
          return
        last_detail = f'attempt={attempt} curl_rc={rc_curl} http={http_code or "none"}'
      else:
        return

      if time.monotonic() >= deadline:
        break
      time.sleep(float(sleep_ms) / 1000.0)

    self._log(
      f'Warning: ipv6-only warmup did not converge for {agent.name} '
      f'(gateway={gateway6}, service={service_ipv6 or "n/a"}, {last_detail})'
    )

  def _set_uplink(self, segment_id: str, enabled: bool) -> None:
    if self.actual_mode != 'containernet':
      return

    link = self._segment_uplinks.get(segment_id)
    if link is None:
      return

    state = 'up' if enabled else 'down'
    try:
      link.intf1.ifconfig(state)
      link.intf2.ifconfig(state)
    except Exception as exc:
      self._log(f'Failed to set uplink {segment_id} {state}: {exc}')

  @staticmethod
  def _env_int(name: str, default: int, *, minimum: int, maximum: int) -> int:
    raw = str(os.environ.get(name, '') or '').strip()
    if not raw:
      return default
    try:
      value = int(raw)
    except ValueError:
      return default
    return max(minimum, min(maximum, value))

  @staticmethod
  def _strip_prefix(value: Any) -> str | None:
    if value is None:
      return None
    text = str(value).strip()
    if not text:
      return None
    if '/' in text:
      return text.split('/', 1)[0]
    return text

  @staticmethod
  def _format_switch_dpid(index: int) -> str:
    idx = int(index)
    if idx < 1:
      raise TopologyError(f'Invalid switch dpid index: {index}')
    # Mininet expects 16 hex chars for deterministic switch DPIDs.
    return f'{idx:016x}'

  @staticmethod
  def _node_data_interface(node: Any) -> str:
    if node is None:
      return 'eth0'
    getter = getattr(node, 'intfNames', None)
    if callable(getter):
      try:
        names = [str(name).strip() for name in getter() if str(name).strip()]
      except Exception:
        names = []
      node_name = str(getattr(node, 'name', '') or '').strip()
      if node_name:
        preferred_prefix = f'{node_name}-eth'
        for name in names:
          if name.startswith(preferred_prefix):
            return name
      for name in names:
        if name == 'lo':
          continue
        if '-eth' in name:
          return name
      for name in names:
        if name in {'lo', 'eth0'}:
          continue
        return name
      for name in names:
        if name != 'lo':
          return name
    return 'eth0'

  def _node_runtime_interface(self, node: Any) -> str:
    candidate = self._node_data_interface(node)
    if node is None or self.actual_mode != 'containernet':
      return candidate

    rc, _, _ = self._exec_node_shell(node, f'ip link show dev {candidate} >/dev/null 2>&1')
    if rc == 0:
      return candidate

    match = re.search(r'-eth(\d+)$', candidate)
    if match:
      fallback = f'eth{match.group(1)}'
      rc, _, _ = self._exec_node_shell(node, f'ip link show dev {fallback} >/dev/null 2>&1')
      if rc == 0:
        self._log(f'Interface remap: {candidate} -> {fallback}')
        return fallback

    rc, stdout, _ = self._exec_node_shell(
      node,
      "ip -o link show 2>/dev/null | awk -F': ' '{print $2}'",
    )
    if rc == 0 and stdout:
      names: list[str] = []
      for raw in stdout.splitlines():
        name = raw.strip()
        if not name:
          continue
        if '@' in name:
          name = name.split('@', 1)[0].strip()
        if name:
          names.append(name)
      for preferred in names:
        if preferred in {'lo', 'eth0'}:
          continue
        self._log(f'Interface remap: {candidate} -> {preferred}')
        return preferred
      for fallback in names:
        if fallback != 'lo':
          self._log(f'Interface remap: {candidate} -> {fallback}')
          return fallback

    raise TopologyError(
      f'Failed to resolve runtime interface for node '
      f'{getattr(node, "name", "<unknown>")}: candidate={candidate}'
    )


__all__ = ['ChaosTopology', 'TopologyError', 'AgentRecord', 'ServiceRecord']
