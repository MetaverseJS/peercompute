from __future__ import annotations

from dataclasses import dataclass
import ipaddress
import os
import shutil
import shlex
import subprocess
import time
from pathlib import Path
from typing import Any, Iterable


class TopologyError(RuntimeError):
  pass


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
      wrapper = f"bash -lc {shlex.quote(f'{cmd}; rc=$?; echo __EXIT_CODE:$rc') }"
      output = str(agent.node.cmd(wrapper) or '')
      lines = output.splitlines()
      exit_code = 0
      clean_lines: list[str] = []
      for line in lines:
        if line.startswith('__EXIT_CODE:'):
          try:
            exit_code = int(line.split(':', 1)[1].strip())
          except ValueError:
            exit_code = 1
          continue
        clean_lines.append(line)
      return exit_code, '\n'.join(clean_lines), ''

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
      for node in self._iter_all_nodes():
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
    agents = self._allocate_agents()
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
        image=str(self.config.get('agents', {}).get('image') or 'mcr.microsoft.com/playwright:v1.56.1-noble'),
        command=str(self.config.get('agents', {}).get('command') or 'sleep infinity'),
      )
      net.addLink(node, segment['switch'])
      agent.node = node

    net.start()

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

    self._seed_agent_hosts()

    self._net = net
    self._core_switch = core_switch
    self._agents = agents
    self._agent_index = {agent.name: agent for agent in agents}
    self._services = service_records
    self.actual_mode = 'containernet'
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
      # Containernet shells into containers with `bash`, so use bash-capable images.
      'dns': 'node:24-bookworm',
      'https': 'node:24-bookworm',
      'relay': 'node:24-bookworm',
      'turn': 'node:24-bookworm',
    }
    return defaults.get(key, 'ubuntu:24.04')

  def _add_docker_node(self, net: Any, name: str, image: str, command: str) -> Any:
    volume = f'{self.repo_root}:/workspace:rw'
    kwargs = {
      'dimage': image,
      'dcmd': command,
      'rm': True,
      'volumes': [volume],
      'environment': {
        'NODE_ENV': 'development',
      },
    }
    try:
      return net.addDocker(name, **kwargs)
    except TypeError:
      kwargs.pop('volumes', None)
      kwargs.pop('environment', None)
      try:
        return net.addDocker(name, **kwargs)
      except Exception as exc:
        raise TopologyError(
          f'Failed to start docker node {name} with image {image} and command {command!r}: {exc}. '
          'Containernet docker nodes require shell-compatible images (bash) and a valid startup command.'
        ) from exc
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

    router_lan = f'nat_{segment_id}-lan'
    router_wan = f'nat_{segment_id}-wan'

    router.cmd(f'ip addr flush dev {router_lan} || true')
    router.cmd(f'ip addr add {gateway4}/{network4.prefixlen} dev {router_lan}')
    if uplink4:
      router.cmd(f'ip addr flush dev {router_wan} || true')
      router.cmd(f'ip addr add {uplink4} dev {router_wan}')

    router.cmd(f'ip -6 addr flush dev {router_lan} || true')
    router.cmd(f'ip -6 addr add {gateway6}/{network6.prefixlen} dev {router_lan}')
    if uplink6:
      router.cmd(f'ip -6 addr flush dev {router_wan} || true')
      router.cmd(f'ip -6 addr add {uplink6} dev {router_wan}')

    router.cmd('sysctl -w net.ipv4.ip_forward=1 >/dev/null 2>&1')
    router.cmd('sysctl -w net.ipv6.conf.all.forwarding=1 >/dev/null 2>&1')
    router.cmd(f'iptables -t nat -C POSTROUTING -o {router_wan} -j MASQUERADE >/dev/null 2>&1 || iptables -t nat -A POSTROUTING -o {router_wan} -j MASQUERADE')
    router.cmd(f'ip6tables -t nat -C POSTROUTING -o {router_wan} -j MASQUERADE >/dev/null 2>&1 || true')

  def _configure_agent(self, agent: AgentRecord) -> None:
    if agent.node is None:
      return

    segment = self._segment_config(agent.segment_id)
    network4 = ipaddress.ip_network(str(segment.get('ipv4_subnet')), strict=False)
    network6 = ipaddress.ip_network(str(segment.get('ipv6_subnet')), strict=False)
    gateway4 = str(segment.get('gateway4') or next(network4.hosts()))
    gateway6 = str(segment.get('gateway6') or next(network6.hosts()))

    if agent.ipv4:
      agent.node.cmd('ip addr flush dev eth0 || true')
      agent.node.cmd(f'ip addr add {agent.ipv4}/{network4.prefixlen} dev eth0')
      agent.node.cmd(f'ip route replace default via {gateway4} dev eth0')

    if agent.ipv6:
      agent.node.cmd('ip -6 addr flush dev eth0 || true')
      agent.node.cmd(f'ip -6 addr add {agent.ipv6}/{network6.prefixlen} dev eth0')
      agent.node.cmd(f'ip -6 route replace default via {gateway6} dev eth0')

    agent.node.cmd('mkdir -p /workspace/net-chaos-lab/artifacts || true')

  def _configure_service(self, record: ServiceRecord, key: str) -> None:
    if record.node is None:
      return

    core_network4 = ipaddress.ip_network(str(self.config.get('core_services', {}).get('subnet_ipv4') or '10.40.254.0/24'), strict=False)
    core_network6 = ipaddress.ip_network(str(self.config.get('core_services', {}).get('subnet_ipv6') or 'fd42:40:254::/64'), strict=False)

    if record.ipv4:
      record.node.cmd('ip addr flush dev eth0 || true')
      record.node.cmd(f'ip addr add {record.ipv4}/{core_network4.prefixlen} dev eth0')

    if record.ipv6:
      record.node.cmd('ip -6 addr flush dev eth0 || true')
      record.node.cmd(f'ip -6 addr add {record.ipv6}/{core_network6.prefixlen} dev eth0')

    spec = self._service_start_spec(record, key)
    if spec is None:
      return

    self._start_service_process(record, key, spec)
    self._wait_for_service_health(record, key, spec)

  def _service_start_spec(self, record: ServiceRecord, key: str) -> dict[str, Any] | None:
    if key == 'dns':
      host_map = self.get_service_host_map()
      host_lines = '\n'.join(
        f"echo 'address=/{host}/{ip}' >> /tmp/dnsmasq.conf"
        for host, ip in host_map.items()
        if host and ip
      )
      command = (
        "if ! command -v dnsmasq >/dev/null 2>&1; then\n"
        "  apt-get update >/tmp/dns-apt.log 2>&1 && \\\n"
        "  DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends dnsmasq >/tmp/dns-apt-install.log 2>&1\n"
        "fi\n"
        "cat >/tmp/dnsmasq.conf <<'EOF'\n"
        "port=53\n"
        "no-resolv\n"
        "server=1.1.1.1\n"
        "server=8.8.8.8\n"
        "listen-address=0.0.0.0\n"
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
      return {
        'command': (
          "if ! command -v caddy >/dev/null 2>&1; then\n"
          "  apt-get update >/tmp/https-apt.log 2>&1 && \\\n"
          "  DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends caddy >/tmp/https-apt-install.log 2>&1\n"
          "fi\n"
          "caddy file-server --root /workspace/docs --listen :443 >/tmp/https.log 2>&1 &\n"
          "echo $! >/tmp/https.pid\n"
        ),
        'pid_file': '/tmp/https.pid',
        'log_file': '/tmp/https.log',
        'tcp_port': 443,
      }

    if key == 'relay':
      relay_host = record.host or 'relay.peercompute.test'
      return {
        'command': (
          "cd /workspace\n"
          "RELAY_PUBLIC_PROTOCOL=ws "
          f"RELAY_PUBLIC_HOST={shlex.quote(relay_host)} "
          "RELAY_LISTEN_HOST=0.0.0.0 "
          "RELAY_LISTEN_PORT=8080 "
          "node /workspace/peercompute/src/relay/server.js >/tmp/relay.log 2>&1 &\n"
          "echo $! >/tmp/relay.pid\n"
        ),
        'pid_file': '/tmp/relay.pid',
        'log_file': '/tmp/relay.log',
        'tcp_port': 8080,
      }

    if key == 'turn':
      return {
        'command': (
          "if ! command -v turnserver >/dev/null 2>&1; then\n"
          "  apt-get update >/tmp/turn-apt.log 2>&1 && \\\n"
          "  DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends coturn >/tmp/turn-apt-install.log 2>&1\n"
          "fi\n"
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
        port_cmd = f'echo >/dev/tcp/127.0.0.1/{int(tcp_port)}'
        rc, _, _ = self._exec_node_shell(record.node, port_cmd)
        if rc != 0:
          last_error = f'tcp port {tcp_port} is not accepting connections'
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

    wrapped = f'{script}\nrc=$?\necho __EXIT_CODE:$rc\n'
    command = f"bash -lc {shlex.quote(wrapped)}"
    output = str(node.cmd(command) or '')

    rc = 1
    lines: list[str] = []
    for raw in output.splitlines():
      if raw.startswith('__EXIT_CODE:'):
        try:
          rc = int(raw.split(':', 1)[1].strip())
        except ValueError:
          rc = 1
        continue
      lines.append(raw)
    stdout = '\n'.join(lines)
    return rc, stdout, ''

  def _seed_agent_hosts(self) -> None:
    host_map = self.get_service_host_map()
    for agent in self._agents:
      if agent.node is None:
        continue
      for host, ip in host_map.items():
        if not host or not ip:
          continue
        escaped = shlex.quote(f'{ip} {host}')
        agent.node.cmd(f"bash -lc \"grep -q '{host}' /etc/hosts || echo {escaped} >> /etc/hosts\"")

  def _segment_config(self, segment_id: str) -> dict[str, Any]:
    for segment in self.config.get('segments', []):
      if isinstance(segment, dict) and str(segment.get('id')) == segment_id:
        return segment
    raise TopologyError(f'Unknown segment id: {segment_id}')

  def _iter_all_nodes(self) -> list[Any]:
    nodes: list[Any] = []
    nodes.extend(self._segment_routers.values())
    nodes.extend([agent.node for agent in self._agents if agent.node is not None])
    nodes.extend([service.node for service in self._services.values() if service.node is not None])
    return nodes

  def _apply_ip_mode_to_node(self, node: Any, mode: str) -> None:
    if mode == 'dual-stack':
      node.cmd('sysctl -w net.ipv6.conf.all.disable_ipv6=0 >/dev/null 2>&1')
      node.cmd('iptables -D OUTPUT -m comment --comment chaos-ipv6-only -j DROP >/dev/null 2>&1 || true')
      return

    if mode == 'ipv4-only':
      node.cmd('sysctl -w net.ipv6.conf.all.disable_ipv6=1 >/dev/null 2>&1')
      node.cmd('iptables -D OUTPUT -m comment --comment chaos-ipv6-only -j DROP >/dev/null 2>&1 || true')
      return

    node.cmd('sysctl -w net.ipv6.conf.all.disable_ipv6=0 >/dev/null 2>&1')
    node.cmd('iptables -C OUTPUT -m comment --comment chaos-ipv6-only -j DROP >/dev/null 2>&1 || iptables -A OUTPUT -m comment --comment chaos-ipv6-only -j DROP')

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


__all__ = ['ChaosTopology', 'TopologyError', 'AgentRecord', 'ServiceRecord']
