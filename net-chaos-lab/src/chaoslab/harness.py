from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
import json
import os
from pathlib import Path
import subprocess
import time
from typing import Any
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse


@dataclass
class DemoProcess:
  command: str
  cwd: Path
  log_path: Path
  process: subprocess.Popen[str]


class ChaosHarness:
  def __init__(
    self,
    repo_root: Path,
    topology: Any,
    metrics: Any,
    artifacts_dir: Path,
    logger: Any = print,
  ):
    self.repo_root = repo_root
    self.topology = topology
    self.metrics = metrics
    self.artifacts_dir = artifacts_dir
    self.logger = logger
    self.demo: DemoProcess | None = None
    self.host_probe_script = repo_root / 'net-chaos-lab' / 'agent' / 'probe.mjs'
    self.agent_probe_script = Path('/workspace/net-chaos-lab/agent/probe.mjs')
    self.allow_host_probe_fallback = (
      str(os.environ.get('CHAOSLAB_ALLOW_HOST_PROBE_FALLBACK', '')).strip().lower()
      in {'1', 'true', 'yes', 'on'}
    )

  def _log(self, message: str) -> None:
    self.logger(f'[harness] {message}')

  def start_demo(self, command: str, cwd: Path | None = None, env_overrides: dict[str, str] | None = None) -> None:
    if not command:
      return
    if self.demo is not None:
      raise RuntimeError('Demo process already running')

    run_cwd = cwd or self.repo_root
    log_path = self.artifacts_dir / 'demo.log'
    env = os.environ.copy()
    if env_overrides:
      env.update({key: str(value) for key, value in env_overrides.items()})

    log_handle = log_path.open('a', encoding='utf-8')
    process = subprocess.Popen(
      ['bash', '-lc', command],
      cwd=str(run_cwd),
      env=env,
      text=True,
      stdout=log_handle,
      stderr=subprocess.STDOUT,
    )

    self.demo = DemoProcess(
      command=command,
      cwd=run_cwd,
      log_path=log_path,
      process=process,
    )
    self._log(f'Demo process started: {command} (pid={process.pid})')
    self.metrics.record('demo_process_started', {
      'command': command,
      'pid': process.pid,
      'cwd': str(run_cwd),
      'log_path': str(log_path),
    })

  def stop_demo(self) -> None:
    if self.demo is None:
      return

    process = self.demo.process
    if process.poll() is None:
      process.terminate()
      try:
        process.wait(timeout=12)
      except subprocess.TimeoutExpired:
        process.kill()

    exit_code = process.poll()
    self._log(f'Demo process stopped with exit code {exit_code}')
    self.metrics.record('demo_process_stopped', {
      'exit_code': exit_code,
      'command': self.demo.command,
    })
    self.demo = None

  def run_probe_cycle(
    self,
    url: str,
    min_peers: int,
    wait_ms: int,
    mode: str,
    media: bool,
    simulate_profile: str = '',
    simulate_ms: int = 0,
    limit_agents: int | None = None,
    parallelism: int = 4,
  ) -> list[dict[str, Any]]:
    agents = self.topology.get_probe_agents(limit_agents)
    if not agents:
      self._log('No agents available for probe cycle')
      return []

    workers = max(1, min(parallelism, len(agents)))
    self._log(f'Running probe cycle against {len(agents)} agents (parallelism={workers})')

    results: list[dict[str, Any]] = []
    with ThreadPoolExecutor(max_workers=workers) as pool:
      futures = {
        pool.submit(
          self._probe_one,
          agent.name,
          url,
          min_peers,
          wait_ms,
          mode,
          media,
          str(simulate_profile or '').strip(),
          int(simulate_ms or 0),
        ): agent.name
        for agent in agents
      }

      for future in as_completed(futures):
        agent_name = futures[future]
        try:
          payload = future.result()
        except Exception as exc:
          payload = {
            'agent': agent_name,
            'ok': False,
            'error': str(exc),
            'connected': False,
            'peer_count': 0,
            'convergence_ms': None,
            'media_ok': False,
          }

        payload['agent'] = agent_name
        self.metrics.record('probe_result', payload)
        results.append(payload)

    return results

  def _probe_one(
    self,
    agent_name: str,
    url: str,
    min_peers: int,
    wait_ms: int,
    mode: str,
    media: bool,
    simulate_profile: str = '',
    simulate_ms: int = 0,
  ) -> dict[str, Any]:
    probe_url = self._normalize_probe_url(mode, url)
    preflight: dict[str, Any] | None = None
    probe_execution = 'host'
    effective_url = probe_url
    if self.topology.actual_mode == 'containernet':
      preflight = self._run_agent_network_preflight(agent_name, probe_url)
      preferred_url = str(preflight.get('preferred_url') or '').strip()
      fallback_url = str(preflight.get('fallback_url') or '').strip()
      if preferred_url:
        effective_url = preferred_url
      elif fallback_url:
        effective_url = fallback_url
      if not bool(preflight.get('ok')):
        if self._is_preflight_hard_failure(preflight):
          return {
            'ok': False,
            'mode': mode,
            'url': effective_url,
            'connected': False,
            'peer_count': 0,
            'convergence_ms': None,
            'media_ok': False,
            'diagnostics': {'netviz': None, 'rtc': None, 'preflight': preflight},
            'network_preflight': preflight,
            'probe_execution': 'agent',
            'infra_failure': True,
            'error': preflight.get('error') or 'agent preflight failed',
            'exit_code': int(preflight.get('exit_code') or 1),
          }
        self._log(
          'Agent preflight warning '
          f'({agent_name}): {preflight.get("error") or "unknown"}; continuing probe.'
        )

    probe_script = self.host_probe_script
    if self.topology.actual_mode == 'containernet':
      probe_script = self.agent_probe_script

    command = [
      'node',
      str(probe_script),
      '--url',
      str(effective_url),
      '--waitMs',
      str(wait_ms),
      '--minPeers',
      str(min_peers),
      '--mode',
      str(mode),
      '--media',
      'true' if media else 'false',
    ]
    if simulate_profile:
      command.extend(['--simulateProfile', str(simulate_profile)])
    if int(simulate_ms or 0) > 0:
      command.extend(['--simulateMs', str(int(simulate_ms))])

    exit_code = 1
    stdout = ''
    stderr = ''

    # Prefer in-agent execution when the topology is live under Containernet.
    if self.topology.actual_mode == 'containernet':
      probe_execution = 'agent'
      exit_code, stdout, stderr = self.topology.run_command_in_agent(agent_name, command)
      if exit_code != 0:
        if self.allow_host_probe_fallback:
          self._log(
            f'In-agent probe failed for {agent_name}; retrying on host (fallback enabled). rc={exit_code}'
          )
        else:
          detail = '\n'.join(
            part for part in [(stdout or '').strip(), (stderr or '').strip()] if part
          ).strip()
          detail_tail = '\n'.join(detail.splitlines()[-25:]).strip() if detail else ''
          parsed_payload = self._extract_probe_payload(stdout)
          if parsed_payload is not None:
            if not parsed_payload.get('error'):
              parsed_payload['error'] = f'in-agent probe exited with rc={exit_code}'
              if detail_tail:
                parsed_payload['error'] = (
                  f'{parsed_payload["error"]}. Diagnostic tail:\n{detail_tail}'
                )
            if not isinstance(parsed_payload.get('network_preflight'), dict) and isinstance(preflight, dict):
              parsed_payload['network_preflight'] = preflight
            if not parsed_payload.get('probe_execution'):
              parsed_payload['probe_execution'] = probe_execution
            if 'infra_failure' not in parsed_payload and isinstance(preflight, dict):
              parsed_payload['infra_failure'] = not bool(preflight.get('ok'))
            stdout = json.dumps(parsed_payload) + '\n'
            stderr = detail
          else:
            error = (
              f'in-agent probe failed (rc={exit_code}); host fallback is disabled. '
              'Set CHAOSLAB_ALLOW_HOST_PROBE_FALLBACK=1 to enable fallback.'
            )
            if detail_tail:
              error = f'{error} Diagnostic tail:\n{detail_tail}'
            return {
              'ok': False,
              'mode': mode,
              'url': effective_url,
              'connected': False,
              'peer_count': 0,
              'convergence_ms': None,
              'media_ok': False,
              'diagnostics': {'netviz': None, 'rtc': None, 'preflight': preflight},
              'network_preflight': preflight,
              'probe_execution': probe_execution,
              'infra_failure': True,
              'error': error,
              'exit_code': exit_code,
            }

    if self.topology.actual_mode != 'containernet' or (exit_code != 0 and self.allow_host_probe_fallback):
      if self.topology.actual_mode == 'containernet':
        probe_execution = 'host-fallback'
      proc = subprocess.run(
        [
          'node',
          str(self.host_probe_script),
          '--url',
          str(effective_url),
          '--waitMs',
          str(wait_ms),
          '--minPeers',
          str(min_peers),
          '--mode',
          str(mode),
          '--media',
          'true' if media else 'false',
          *(['--simulateProfile', str(simulate_profile)] if simulate_profile else []),
          *(['--simulateMs', str(int(simulate_ms))] if int(simulate_ms or 0) > 0 else []),
        ],
        cwd=str(self.repo_root),
        text=True,
        capture_output=True,
        check=False,
      )
      exit_code = proc.returncode
      stdout = proc.stdout
      stderr = proc.stderr

    payload = self._extract_probe_payload(stdout)
    if payload is None:
      payload = {
        'ok': False,
        'mode': mode,
        'url': effective_url,
        'connected': False,
        'peer_count': 0,
        'convergence_ms': None,
        'media_ok': False,
        'error': 'probe output missing JSON payload',
      }

    def to_int(*keys: str, default: int = 0) -> int:
      for key in keys:
        value = payload.get(key)
        if isinstance(value, bool):
          continue
        if isinstance(value, (int, float)):
          return int(value)
        if isinstance(value, str) and value.strip():
          try:
            return int(float(value.strip()))
          except ValueError:
            continue
      return int(default)

    def to_float(*keys: str, default: float = 0.0) -> float:
      for key in keys:
        value = payload.get(key)
        if isinstance(value, bool):
          continue
        if isinstance(value, (int, float)):
          return float(value)
        if isinstance(value, str) and value.strip():
          try:
            return float(value.strip())
          except ValueError:
            continue
      return float(default)

    normalized = {
      'ok': bool(payload.get('ok')) and exit_code == 0,
      'mode': payload.get('mode') or mode,
      'url': payload.get('url') or effective_url,
      'connected': bool(payload.get('connected')),
      'peer_count': to_int('peer_count', 'peerCount'),
      'convergence_ms': payload.get('convergence_ms', payload.get('convergenceMs')),
      'media_ok': bool(payload.get('media_ok', payload.get('mediaOk'))),
      'direct_peer_count': to_int('direct_peer_count', 'directPeerCount'),
      'relay_peer_count': to_int('relay_peer_count', 'relayPeerCount'),
      'webrtc_peer_count': to_int('webrtc_peer_count', 'webrtcPeerCount'),
      'announced_direct_webrtc_addrs_count': to_int(
        'announced_direct_webrtc_addrs_count',
        'announcedDirectWebrtcAddrsCount',
      ),
      'announced_relay_webrtc_addrs_count': to_int(
        'announced_relay_webrtc_addrs_count',
        'announcedRelayWebrtcAddrsCount',
      ),
      'has_direct_announce': bool(payload.get('has_direct_announce', payload.get('hasDirectAnnounce'))),
      'has_direct_connection': bool(payload.get('has_direct_connection', payload.get('hasDirectConnection'))),
      'has_relay_webrtc_connection': bool(
        payload.get('has_relay_webrtc_connection', payload.get('hasRelayWebrtcConnection'))
      ),
      'stability_sample_count': to_int('stability_sample_count', 'stabilitySampleCount'),
      'stability_sample_window_ms': to_int('stability_sample_window_ms', 'stabilitySampleWindowMs'),
      'peer_set_change_count': to_int('peer_set_change_count', 'peerSetChangeCount'),
      'direct_connection_flip_count': to_int(
        'direct_connection_flip_count',
        'directConnectionFlipCount',
      ),
      'relay_connection_flip_count': to_int(
        'relay_connection_flip_count',
        'relayConnectionFlipCount',
      ),
      'direct_connection_sample_rate': to_float(
        'direct_connection_sample_rate',
        'directConnectionSampleRate',
      ),
      'relay_connection_sample_rate': to_float(
        'relay_connection_sample_rate',
        'relayConnectionSampleRate',
      ),
      'stability_avg_peer_count': to_float('stability_avg_peer_count', 'stabilityAvgPeerCount'),
      'stability_min_peer_count': to_float('stability_min_peer_count', 'stabilityMinPeerCount'),
      'stability_max_peer_count': to_float('stability_max_peer_count', 'stabilityMaxPeerCount'),
      'diagnostics': payload.get('diagnostics') if isinstance(payload.get('diagnostics'), dict) else None,
      'network_preflight': payload.get('network_preflight')
      if isinstance(payload.get('network_preflight'), dict)
      else (preflight if isinstance(preflight, dict) else None),
      'probe_execution': payload.get('probe_execution') or probe_execution,
      'infra_failure': bool(payload.get('infra_failure')),
      'error': payload.get('error') or (stderr.strip() if exit_code != 0 else None),
      'exit_code': exit_code,
    }
    if normalized['network_preflight'] is None and isinstance(normalized['diagnostics'], dict):
      preflight_diag = normalized['diagnostics'].get('preflight')
      if isinstance(preflight_diag, dict):
        normalized['network_preflight'] = preflight_diag
    if not normalized['infra_failure'] and isinstance(normalized['network_preflight'], dict):
      normalized['infra_failure'] = not bool(normalized['network_preflight'].get('ok'))
    return normalized

  @staticmethod
  def _normalize_probe_url(mode: str, url: str) -> str:
    parsed = urlparse(url)
    if str(mode or '').strip().lower() != 'netviz':
      return url
    if not parsed.scheme or not parsed.netloc:
      return url

    query_items = dict(parse_qsl(parsed.query, keep_blank_values=True))
    defaults = {
      'room': 'telemetry',
      'topologyId': 'netviz-topology',
      'topologyType': 'distributed',
      'autoConnect': '1',
    }
    changed = False
    for key, value in defaults.items():
      current = str(query_items.get(key, '')).strip()
      if not current:
        query_items[key] = value
        changed = True

    if not changed:
      return url
    return urlunparse(parsed._replace(query=urlencode(query_items, doseq=True)))

  @staticmethod
  def _is_preflight_hard_failure(preflight: dict[str, Any]) -> bool:
    if not isinstance(preflight, dict):
      return True
    if not bool(preflight.get('probe_script_ok', False)):
      return True
    error = str(preflight.get('error') or '').strip().lower()
    if not error:
      return False
    hard_tokens = (
      'missing probe script',
      'curl missing',
      'probe url has no hostname',
      'https preflight failed',
    )
    return any(token in error for token in hard_tokens)

  def _topology_ip_mode(self) -> str:
    mode = getattr(self.topology, 'ip_mode', 'dual-stack')
    normalized = str(mode or 'dual-stack').strip().lower()
    if normalized in {'ipv4-only', 'ipv6-only', 'dual-stack'}:
      return normalized
    return 'dual-stack'

  def _service_host_maps(self) -> tuple[dict[str, str], dict[str, str]]:
    ipv4_map: dict[str, str] = {}
    ipv6_map: dict[str, str] = {}

    entries_getter = getattr(self.topology, 'get_service_host_entries', None)
    if callable(entries_getter):
      try:
        entries = entries_getter()
      except Exception:
        entries = []
      if isinstance(entries, list):
        for item in entries:
          if not isinstance(item, (list, tuple)) or len(item) < 2:
            continue
          host = str(item[0] or '').strip()
          ip = str(item[1] or '').strip()
          if not host or not ip:
            continue
          if ':' in ip:
            ipv6_map[host] = ip
          else:
            ipv4_map[host] = ip

    map_getter = getattr(self.topology, 'get_service_host_map', None)
    if callable(map_getter):
      try:
        mapping = map_getter()
      except Exception:
        mapping = {}
      if isinstance(mapping, dict):
        for key, value in mapping.items():
          host = str(key or '').strip()
          ip = str(value or '').strip()
          if host and ip and host not in ipv4_map and ':' not in ip:
            ipv4_map[host] = ip

    return ipv4_map, ipv6_map

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
  def _build_ip_fallback_url(url: str, host: str, ip: str) -> str:
    parsed = urlparse(url)
    if not host or not ip:
      return url
    if ':' in ip and not ip.startswith('['):
      host_part = f'[{ip}]'
    else:
      host_part = ip
    if parsed.port:
      netloc = f'{host_part}:{parsed.port}'
    else:
      netloc = host_part
    return urlunparse(parsed._replace(netloc=netloc))

  def _run_agent_network_preflight(self, agent_name: str, url: str) -> dict[str, Any]:
    parsed = urlparse(url)
    host = str(parsed.hostname or '').strip()
    ip_mode = self._topology_ip_mode()
    curl_family_flag = '-6' if ip_mode == 'ipv6-only' else ('-4' if ip_mode == 'ipv4-only' else None)
    service_map_v4, service_map_v6 = self._service_host_maps()
    if ip_mode == 'ipv6-only':
      preferred_service_ip = service_map_v6.get(host) or service_map_v4.get(host)
    elif ip_mode == 'ipv4-only':
      preferred_service_ip = service_map_v4.get(host) or service_map_v6.get(host)
    else:
      preferred_service_ip = service_map_v4.get(host) or service_map_v6.get(host)
    preferred_url = (
      self._build_ip_fallback_url(url, host, preferred_service_ip)
      if host and preferred_service_ip and ip_mode in {'ipv4-only', 'ipv6-only'}
      else None
    )
    curl_max_time_s = self._env_int(
      'CHAOSLAB_PREFLIGHT_CURL_MAX_TIME',
      8,
      minimum=4,
      maximum=60,
    )
    curl_attempts = self._env_int(
      'CHAOSLAB_PREFLIGHT_CURL_ATTEMPTS',
      2,
      minimum=1,
      maximum=6,
    )
    curl_retry_delay_ms = self._env_int(
      'CHAOSLAB_PREFLIGHT_CURL_RETRY_DELAY_MS',
      700,
      minimum=0,
      maximum=10000,
    )

    def parse_curl_status(text: str) -> tuple[int | None, str, int | None]:
      token = text.splitlines()[-1].strip() if text else ''
      parts = token.split()
      status = int(parts[0]) if parts and parts[0].isdigit() else None
      remote_ip = parts[1] if len(parts) >= 2 else ''
      remote_port = int(parts[2]) if len(parts) >= 3 and parts[2].isdigit() else None
      return status, remote_ip, remote_port

    def run_curl_probe(target_url: str, family_flag: str | None) -> tuple[int, str, int | None, str, int | None, int]:
      transient_rc = {7, 28, 35, 52, 56}
      attempts_used = 0
      last_rc = 1
      last_status_raw = ''
      last_status_code: int | None = None
      last_remote_ip = ''
      last_remote_port: int | None = None

      for attempt in range(1, curl_attempts + 1):
        attempts_used = attempt
        curl_cmd = [
          'curl',
          '-k',
          '-sS',
          '-o',
          '/dev/null',
          '-w',
          '%{http_code} %{remote_ip} %{remote_port}',
          '--max-time',
          str(curl_max_time_s),
        ]
        if family_flag:
          curl_cmd.append(family_flag)
        curl_cmd.append(target_url)

        rc_curl, curl_stdout, _ = self.topology.run_command_in_agent(agent_name, curl_cmd)
        status_raw = (curl_stdout or '').strip()
        status_code, remote_ip, remote_port = parse_curl_status(status_raw)
        https_ok = bool(rc_curl == 0 and status_code is not None and 200 <= status_code < 400)

        last_rc = rc_curl
        last_status_raw = status_raw
        last_status_code = status_code
        last_remote_ip = remote_ip
        last_remote_port = remote_port

        if https_ok:
          break

        has_next = attempt < curl_attempts
        if not has_next:
          break

        if rc_curl not in transient_rc and status_code is not None:
          # Non-transient result (for example 4xx/5xx): no value in retrying.
          break

        if curl_retry_delay_ms > 0:
          time.sleep(curl_retry_delay_ms / 1000.0)

      return (
        last_rc,
        last_status_raw,
        last_status_code,
        last_remote_ip,
        last_remote_port,
        attempts_used,
      )

    preflight: dict[str, Any] = {
      'ok': False,
      'host': host,
      'url': url,
      'ip_mode': ip_mode,
      'curl_family': curl_family_flag or '',
      'curl_max_time_s': curl_max_time_s,
      'curl_attempts': curl_attempts,
      'curl_retry_delay_ms': curl_retry_delay_ms,
      'dns_ok': False,
      'hosts_entry_ok': False,
      'https_ok': False,
      'probe_script_ok': False,
      'probe_script_rc': None,
      'dns_rc': None,
      'hosts_rc': None,
      'resolver_rc': None,
      'curl_check_rc': None,
      'curl_rc': None,
      'curl_status_raw': '',
      'curl_remote_ip': '',
      'curl_remote_port': None,
      'curl_attempt_count': 0,
      'fallback_curl_rc': None,
      'fallback_status_raw': '',
      'fallback_remote_ip': '',
      'fallback_remote_port': None,
      'fallback_curl_attempt_count': 0,
      'http_status': None,
      'resolver': '',
      'dns_output': '',
      'hosts_output': '',
      'hosts_file_tail': '',
      'hosts_file_tail_rc': None,
      'route_to_fallback': '',
      'route_to_fallback_rc': None,
      'ip6_route_default': '',
      'ip6_route_default_rc': None,
      'ip6_route_table': '',
      'ip6_route_table_rc': None,
      'ip6_neigh': '',
      'ip6_neigh_rc': None,
      'ip6_rule': '',
      'ip6_rule_rc': None,
      'ip6tables_forward': '',
      'ip6tables_forward_rc': None,
      'agent_ip6_link': '',
      'agent_ip6_link_rc': None,
      'agent_ip6_addr': '',
      'agent_ip6_addr_rc': None,
      'router_ip6_addr': '',
      'router_ip6_addr_rc': None,
      'router_ip6_route': '',
      'router_ip6_route_rc': None,
      'router_ip6tables_forward': '',
      'router_ip6tables_forward_rc': None,
      'router_ip6_neigh_lan': '',
      'router_ip6_neigh_lan_rc': None,
      'router_ipv6_forwarding': '',
      'router_ipv6_forwarding_rc': None,
      'router_to_service_ipv6': '',
      'router_to_service_ipv6_rc': None,
      'service_ip6_addr': '',
      'service_ip6_addr_rc': None,
      'service_ip6_route': '',
      'service_ip6_route_rc': None,
      'service_listeners': '',
      'service_listeners_rc': None,
      'service_ip': preferred_service_ip,
      'preferred_url': preferred_url,
      'error': None,
      'exit_code': 1,
      'fallback_url': None,
      'fallback_https_ok': False,
      'effective_url': preferred_url or url,
    }
    if not host:
      preflight['error'] = 'probe URL has no hostname'
      return preflight

    rc, stdout, _ = self.topology.run_command_in_agent(
      agent_name,
      ['bash', '-lc', f'test -f {self.agent_probe_script}'],
    )
    preflight['probe_script_rc'] = rc
    preflight['probe_script_ok'] = (rc == 0)
    if rc != 0:
      preflight['error'] = f'missing probe script in agent: {self.agent_probe_script}'
      preflight['exit_code'] = rc
      return preflight

    rc, stdout, _ = self.topology.run_command_in_agent(agent_name, ['getent', 'hosts', host])
    preflight['dns_rc'] = rc
    preflight['dns_output'] = (stdout or '').strip()
    preflight['dns_ok'] = (rc == 0 and bool(preflight['dns_output']))

    rc_hosts, hosts_stdout, _ = self.topology.run_command_in_agent(
      agent_name,
      ['bash', '-lc', f'grep -F -- {host} /etc/hosts'],
    )
    preflight['hosts_rc'] = rc_hosts
    preflight['hosts_output'] = (hosts_stdout or '').strip()
    preflight['hosts_entry_ok'] = any(
      host == part.split()[1]
      for part in preflight['hosts_output'].splitlines()
      if len(part.split()) >= 2
    ) or any(host in part for part in preflight['hosts_output'].splitlines())

    rc_hosts_file, hosts_file_stdout, _ = self.topology.run_command_in_agent(
      agent_name,
      ['bash', '-lc', 'tail -n 20 /etc/hosts 2>/dev/null || true'],
    )
    preflight['hosts_file_tail_rc'] = rc_hosts_file
    preflight['hosts_file_tail'] = (hosts_file_stdout or '').strip()

    if preflight['hosts_entry_ok']:
      preflight['dns_ok'] = True

    rc_resolv, resolv_stdout, _ = self.topology.run_command_in_agent(
      agent_name,
      ['bash', '-lc', 'head -n 6 /etc/resolv.conf 2>/dev/null || true'],
    )
    preflight['resolver_rc'] = rc_resolv
    if rc_resolv == 0:
      preflight['resolver'] = (resolv_stdout or '').strip()

    rc_curl_check, _, _ = self.topology.run_command_in_agent(
      agent_name,
      ['bash', '-lc', 'command -v curl >/dev/null 2>&1'],
    )
    preflight['curl_check_rc'] = rc_curl_check
    if rc_curl_check != 0:
      preflight['error'] = 'curl missing in agent container'
      preflight['exit_code'] = rc_curl_check
      return preflight

    (
      rc_curl,
      status_raw,
      status_code,
      curl_remote_ip,
      curl_remote_port,
      curl_attempt_count,
    ) = run_curl_probe(url, curl_family_flag)
    preflight['curl_rc'] = rc_curl
    preflight['curl_status_raw'] = status_raw
    preflight['curl_remote_ip'] = curl_remote_ip
    preflight['curl_remote_port'] = curl_remote_port
    preflight['curl_attempt_count'] = curl_attempt_count
    preflight['http_status'] = status_code
    preflight['https_ok'] = bool(
      rc_curl == 0
      and status_code is not None
      and 200 <= status_code < 400
    )

    if not preflight['https_ok']:
      mapped_ip = str(preflight.get('service_ip') or '').strip()
      if mapped_ip:
        if ':' in mapped_ip:
          route_cmd = ['bash', '-lc', f'ip -6 route get {mapped_ip} 2>&1']
        else:
          route_cmd = ['bash', '-lc', f'ip route get {mapped_ip} 2>&1']
        rc_route, route_stdout, _ = self.topology.run_command_in_agent(agent_name, route_cmd)
        preflight['route_to_fallback_rc'] = rc_route
        preflight['route_to_fallback'] = (route_stdout or '').strip()

        fallback_url = self._build_ip_fallback_url(url, host, mapped_ip)
        fallback_family_flag = '-6' if ':' in mapped_ip else '-4'
        (
          rc_fallback,
          fallback_status_raw,
          fallback_status,
          fallback_remote_ip,
          fallback_remote_port,
          fallback_attempt_count,
        ) = run_curl_probe(fallback_url, fallback_family_flag)
        preflight['fallback_curl_rc'] = rc_fallback
        preflight['fallback_status_raw'] = fallback_status_raw
        preflight['fallback_remote_ip'] = fallback_remote_ip
        preflight['fallback_remote_port'] = fallback_remote_port
        preflight['fallback_curl_attempt_count'] = fallback_attempt_count
        fallback_https_ok = bool(
          rc_fallback == 0
          and fallback_status is not None
          and 200 <= fallback_status < 400
        )
        preflight['fallback_url'] = fallback_url
        preflight['fallback_https_ok'] = fallback_https_ok
        if fallback_https_ok:
          preflight['effective_url'] = fallback_url

    preflight['ok'] = bool(
      preflight['dns_ok'] and (preflight['https_ok'] or preflight['fallback_https_ok'])
    )
    preflight['exit_code'] = 0 if preflight['ok'] else 1
    if not preflight['dns_ok']:
      preflight['error'] = (
        f'dns resolution failed for {host} '
        f'(dns_rc={preflight.get("dns_rc")}, hosts_rc={preflight.get("hosts_rc")})'
      )
    elif not preflight['https_ok'] and not preflight['fallback_https_ok']:
      if status_code is None:
        preflight['error'] = (
          'https preflight failed (no HTTP status) '
          f'(curl_rc={preflight.get("curl_rc")}, fallback_curl_rc={preflight.get("fallback_curl_rc")})'
        )
      else:
        preflight['error'] = (
          f'https preflight returned status {status_code} '
          f'(curl_rc={preflight.get("curl_rc")}, fallback_curl_rc={preflight.get("fallback_curl_rc")})'
        )

    # Forced IPv6-stage failures can hide the exact drop locus. Capture
    # per-agent route/neighbor/filter state for post-run triage.
    if ip_mode == 'ipv6-only' and not preflight['ok']:
      debug_commands = {
        'ip6_route_default': ['bash', '-lc', 'ip -6 route show default 2>&1'],
        'ip6_route_table': ['bash', '-lc', 'ip -6 route show 2>&1'],
        'ip6_neigh': ['bash', '-lc', 'ip -6 neigh show 2>&1'],
        'ip6_rule': ['bash', '-lc', 'ip -6 rule show 2>&1'],
        'ip6tables_forward': ['bash', '-lc', 'ip6tables -L FORWARD -n -v 2>&1 || true'],
        'agent_ip6_link': ['bash', '-lc', 'ip -o link show 2>&1'],
        'agent_ip6_addr': ['bash', '-lc', 'ip -6 addr show 2>&1'],
      }
      for key, command in debug_commands.items():
        rc_diag, stdout_diag, _ = self.topology.run_command_in_agent(agent_name, command)
        preflight[f'{key}_rc'] = rc_diag
        preflight[key] = (stdout_diag or '').strip()
      agent_index = getattr(self.topology, '_agent_index', {})
      agent_record = agent_index.get(agent_name) if isinstance(agent_index, dict) else None
      segment_id = getattr(agent_record, 'segment_id', None)
      service_ipv6 = str(preflight.get('service_ip') or '')
      if segment_id and hasattr(self.topology, 'run_command_in_router'):
        lan_if = f'nat_{segment_id}-lan'
        wan_if = f'nat_{segment_id}-wan'
        router_commands = {
          'router_ip6_addr': ['bash', '-lc', 'ip -6 addr show 2>&1'],
          'router_ip6_route': ['bash', '-lc', 'ip -6 route show 2>&1'],
          'router_ip6tables_forward': ['bash', '-lc', 'ip6tables -L FORWARD -n -v 2>&1 || true'],
          'router_ip6_neigh_lan': ['bash', '-lc', f'ip -6 neigh show dev {lan_if} 2>&1 || true'],
          'router_ipv6_forwarding': [
            'bash',
            '-lc',
            (
              'printf "all=%s default=%s lan=%s wan=%s\\n" '
              '$(cat /proc/sys/net/ipv6/conf/all/forwarding 2>/dev/null || echo x) '
              '$(cat /proc/sys/net/ipv6/conf/default/forwarding 2>/dev/null || echo x) '
              f'$(cat /proc/sys/net/ipv6/conf/{lan_if}/forwarding 2>/dev/null || echo x) '
              f'$(cat /proc/sys/net/ipv6/conf/{wan_if}/forwarding 2>/dev/null || echo x)'
            ),
          ],
        }
        if ':' in service_ipv6:
          router_commands['router_to_service_ipv6'] = [
            'bash',
            '-lc',
            (
              "curl -6 -k -sS -o /dev/null -w '%{http_code} %{remote_ip} %{remote_port}' "
              f"--max-time 6 https://[{service_ipv6}]/netviz/ 2>&1"
            ),
          ]
        for key, command in router_commands.items():
          rc_diag, stdout_diag, _ = self.topology.run_command_in_router(segment_id, command)
          preflight[f'{key}_rc'] = rc_diag
          preflight[key] = (stdout_diag or '').strip()
      if hasattr(self.topology, 'run_command_in_service'):
        service_commands = {
          'service_ip6_addr': ['bash', '-lc', 'ip -6 addr show 2>&1'],
          'service_ip6_route': ['bash', '-lc', 'ip -6 route show 2>&1'],
          'service_listeners': ['bash', '-lc', "ss -lnt 2>&1 | grep -E '(:443\\s|:443$)' || true"],
        }
        for key, command in service_commands.items():
          rc_diag, stdout_diag, _ = self.topology.run_command_in_service('https', command)
          preflight[f'{key}_rc'] = rc_diag
          preflight[key] = (stdout_diag or '').strip()
    return preflight

  def _extract_probe_payload(self, stdout: str) -> dict[str, Any] | None:
    lines = [line.strip() for line in (stdout or '').splitlines() if line.strip()]
    for line in reversed(lines):
      try:
        parsed = json.loads(line)
      except json.JSONDecodeError:
        continue
      if isinstance(parsed, dict):
        return parsed
    return None


__all__ = ['ChaosHarness', 'DemoProcess']
