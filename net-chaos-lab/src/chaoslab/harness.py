from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
import json
import os
from pathlib import Path
import subprocess
from typing import Any


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
    self.probe_script = repo_root / 'net-chaos-lab' / 'agent' / 'probe.mjs'

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
  ) -> dict[str, Any]:
    command = [
      'node',
      str(self.probe_script),
      '--url',
      str(url),
      '--waitMs',
      str(wait_ms),
      '--minPeers',
      str(min_peers),
      '--mode',
      str(mode),
      '--media',
      'true' if media else 'false',
    ]

    exit_code = 1
    stdout = ''
    stderr = ''

    # Prefer in-agent execution when the topology is live under Containernet.
    if self.topology.actual_mode == 'containernet':
      exit_code, stdout, stderr = self.topology.run_command_in_agent(agent_name, command)
      if exit_code != 0:
        self._log(f'In-agent probe failed for {agent_name}; retrying on host. rc={exit_code}')

    if self.topology.actual_mode != 'containernet' or exit_code != 0:
      proc = subprocess.run(
        command,
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
        'url': url,
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
      'url': payload.get('url') or url,
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
      'error': payload.get('error') or (stderr.strip() if exit_code != 0 else None),
      'exit_code': exit_code,
    }
    return normalized

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
