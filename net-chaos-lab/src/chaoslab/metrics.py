from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
import json
import statistics
from typing import Any


def utc_now_iso() -> str:
  return datetime.now(timezone.utc).isoformat()


@dataclass
class MetricsPaths:
  artifacts_dir: Path
  events_jsonl: Path
  summary_json: Path


class MetricsStore:
  def __init__(self, artifacts_dir: Path, run_id: str):
    self.run_id = run_id
    self.paths = MetricsPaths(
      artifacts_dir=artifacts_dir,
      events_jsonl=artifacts_dir / 'metrics-events.jsonl',
      summary_json=artifacts_dir / 'metrics-summary.json',
    )
    self.paths.artifacts_dir.mkdir(parents=True, exist_ok=True)

  def record(self, event_type: str, payload: dict[str, Any] | None = None) -> None:
    entry = {
      'run_id': self.run_id,
      'ts': utc_now_iso(),
      'type': event_type,
      'payload': payload or {},
    }
    with self.paths.events_jsonl.open('a', encoding='utf-8') as handle:
      handle.write(json.dumps(entry, ensure_ascii=True) + '\n')

  def read_events(self) -> list[dict[str, Any]]:
    if not self.paths.events_jsonl.exists():
      return []
    rows: list[dict[str, Any]] = []
    with self.paths.events_jsonl.open('r', encoding='utf-8') as handle:
      for raw in handle:
        raw = raw.strip()
        if not raw:
          continue
        try:
          parsed = json.loads(raw)
          if isinstance(parsed, dict):
            rows.append(parsed)
        except json.JSONDecodeError:
          continue
    return rows

  def build_summary(self) -> dict[str, Any]:
    events = self.read_events()
    probe_events = [e for e in events if e.get('type') == 'probe_result']
    scenario_events = [e for e in events if e.get('type') == 'scenario_event']

    success_values = []
    media_values = []
    convergence_values = []
    direct_announce_values = []
    direct_connection_values = []
    relay_webrtc_connection_values = []
    direct_peer_counts = []
    relay_peer_counts = []
    announced_direct_webrtc_addrs_counts = []
    stability_sample_counts = []
    peer_set_change_counts = []
    direct_connection_flip_counts = []
    relay_connection_flip_counts = []
    direct_connection_sample_rates = []
    relay_connection_sample_rates = []
    stability_avg_peer_counts = []
    preflight_ok_values = []
    preflight_dns_values = []
    preflight_https_values = []
    preflight_hosts_entry_values = []
    infra_failure_values = []
    rtc_probe_count = 0
    rtc_host_only_local_probe_count = 0
    rtc_local_candidate_types: dict[str, int] = {}
    rtc_remote_candidate_types: dict[str, int] = {}

    def _inc(target: dict[str, int], key: str | None, value: int = 1) -> None:
      label = key or 'unknown'
      target[label] = int(target.get(label, 0)) + int(value)

    for event in probe_events:
      payload = event.get('payload') or {}
      success_values.append(1 if payload.get('ok') else 0)
      media_flag = payload.get('media_ok')
      if media_flag is None:
        media_flag = payload.get('mediaOk')
      media_values.append(1 if media_flag else 0)

      convergence = payload.get('convergence_ms')
      if convergence is None:
        convergence = payload.get('convergenceMs')
      if isinstance(convergence, (int, float)) and convergence >= 0:
        convergence_values.append(float(convergence))

      has_direct_announce = payload.get('has_direct_announce')
      if has_direct_announce is None:
        has_direct_announce = payload.get('hasDirectAnnounce')
      direct_announce_values.append(1 if has_direct_announce else 0)

      has_direct_connection = payload.get('has_direct_connection')
      if has_direct_connection is None:
        has_direct_connection = payload.get('hasDirectConnection')
      direct_connection_values.append(1 if has_direct_connection else 0)

      has_relay_webrtc_connection = payload.get('has_relay_webrtc_connection')
      if has_relay_webrtc_connection is None:
        has_relay_webrtc_connection = payload.get('hasRelayWebrtcConnection')
      relay_webrtc_connection_values.append(1 if has_relay_webrtc_connection else 0)

      direct_peer_count = payload.get('direct_peer_count')
      if direct_peer_count is None:
        direct_peer_count = payload.get('directPeerCount')
      if isinstance(direct_peer_count, (int, float)):
        direct_peer_counts.append(float(max(0, direct_peer_count)))

      relay_peer_count = payload.get('relay_peer_count')
      if relay_peer_count is None:
        relay_peer_count = payload.get('relayPeerCount')
      if isinstance(relay_peer_count, (int, float)):
        relay_peer_counts.append(float(max(0, relay_peer_count)))

      direct_addrs_count = payload.get('announced_direct_webrtc_addrs_count')
      if direct_addrs_count is None:
        direct_addrs_count = payload.get('announcedDirectWebrtcAddrsCount')
      if isinstance(direct_addrs_count, (int, float)):
        announced_direct_webrtc_addrs_counts.append(float(max(0, direct_addrs_count)))

      stability_sample_count = payload.get('stability_sample_count')
      if stability_sample_count is None:
        stability_sample_count = payload.get('stabilitySampleCount')
      if isinstance(stability_sample_count, (int, float)) and stability_sample_count >= 0:
        stability_sample_counts.append(float(stability_sample_count))

      peer_set_change_count = payload.get('peer_set_change_count')
      if peer_set_change_count is None:
        peer_set_change_count = payload.get('peerSetChangeCount')
      if isinstance(peer_set_change_count, (int, float)) and peer_set_change_count >= 0:
        peer_set_change_counts.append(float(peer_set_change_count))

      direct_connection_flip_count = payload.get('direct_connection_flip_count')
      if direct_connection_flip_count is None:
        direct_connection_flip_count = payload.get('directConnectionFlipCount')
      if isinstance(direct_connection_flip_count, (int, float)) and direct_connection_flip_count >= 0:
        direct_connection_flip_counts.append(float(direct_connection_flip_count))

      relay_connection_flip_count = payload.get('relay_connection_flip_count')
      if relay_connection_flip_count is None:
        relay_connection_flip_count = payload.get('relayConnectionFlipCount')
      if isinstance(relay_connection_flip_count, (int, float)) and relay_connection_flip_count >= 0:
        relay_connection_flip_counts.append(float(relay_connection_flip_count))

      direct_connection_sample_rate = payload.get('direct_connection_sample_rate')
      if direct_connection_sample_rate is None:
        direct_connection_sample_rate = payload.get('directConnectionSampleRate')
      if isinstance(direct_connection_sample_rate, (int, float)):
        direct_connection_sample_rates.append(float(max(0.0, min(1.0, direct_connection_sample_rate))))

      relay_connection_sample_rate = payload.get('relay_connection_sample_rate')
      if relay_connection_sample_rate is None:
        relay_connection_sample_rate = payload.get('relayConnectionSampleRate')
      if isinstance(relay_connection_sample_rate, (int, float)):
        relay_connection_sample_rates.append(float(max(0.0, min(1.0, relay_connection_sample_rate))))

      stability_avg_peer_count = payload.get('stability_avg_peer_count')
      if stability_avg_peer_count is None:
        stability_avg_peer_count = payload.get('stabilityAvgPeerCount')
      if isinstance(stability_avg_peer_count, (int, float)) and stability_avg_peer_count >= 0:
        stability_avg_peer_counts.append(float(stability_avg_peer_count))

      diagnostics = payload.get('diagnostics')
      rtc = diagnostics.get('rtc') if isinstance(diagnostics, dict) else None
      if isinstance(rtc, dict):
        rtc_probe_count += 1
        local_types = rtc.get('localCandidateTypes')
        remote_types = rtc.get('remoteCandidateTypes')
        local_total = 0
        local_host = 0
        if isinstance(local_types, dict):
          for key, value in local_types.items():
            count = int(value) if isinstance(value, (int, float)) else 0
            _inc(rtc_local_candidate_types, str(key), count)
            local_total += count
            if str(key) == 'host':
              local_host += count
        if isinstance(remote_types, dict):
          for key, value in remote_types.items():
            count = int(value) if isinstance(value, (int, float)) else 0
            _inc(rtc_remote_candidate_types, str(key), count)
        if local_total > 0 and local_host == local_total:
          rtc_host_only_local_probe_count += 1

      preflight = payload.get('network_preflight')
      if preflight is None:
        preflight = payload.get('networkPreflight')
      if isinstance(preflight, dict):
        preflight_ok = preflight.get('ok')
        if isinstance(preflight_ok, bool):
          preflight_ok_values.append(1 if preflight_ok else 0)

        dns_ok = preflight.get('dns_ok')
        if dns_ok is None:
          dns_ok = preflight.get('dnsOk')
        if isinstance(dns_ok, bool):
          preflight_dns_values.append(1 if dns_ok else 0)

        https_ok = preflight.get('https_ok')
        if https_ok is None:
          https_ok = preflight.get('httpsOk')
        if isinstance(https_ok, bool):
          preflight_https_values.append(1 if https_ok else 0)

        hosts_entry_ok = preflight.get('hosts_entry_ok')
        if hosts_entry_ok is None:
          hosts_entry_ok = preflight.get('hostsEntryOk')
        if isinstance(hosts_entry_ok, bool):
          preflight_hosts_entry_values.append(1 if hosts_entry_ok else 0)

      infra_failure = payload.get('infra_failure')
      if infra_failure is None:
        infra_failure = payload.get('infraFailure')
      if infra_failure is None and isinstance(preflight, dict):
        preflight_ok = preflight.get('ok')
        if isinstance(preflight_ok, bool):
          infra_failure = not preflight_ok
      if isinstance(infra_failure, bool):
        infra_failure_values.append(1 if infra_failure else 0)

    success_rate = (sum(success_values) / len(success_values)) if success_values else 0.0
    media_rate = (sum(media_values) / len(media_values)) if media_values else 0.0
    direct_announce_rate = (sum(direct_announce_values) / len(direct_announce_values)) if direct_announce_values else 0.0
    direct_connection_rate = (sum(direct_connection_values) / len(direct_connection_values)) if direct_connection_values else 0.0
    relay_webrtc_connection_rate = (
      (sum(relay_webrtc_connection_values) / len(relay_webrtc_connection_values))
      if relay_webrtc_connection_values
      else 0.0
    )

    if convergence_values:
      convergence_avg = statistics.mean(convergence_values)
      ordered = sorted(convergence_values)
      idx = int(round((len(ordered) - 1) * 0.95))
      convergence_p95 = ordered[idx]
    else:
      convergence_avg = 0.0
      convergence_p95 = 0.0

    avg_direct_peer_count = statistics.mean(direct_peer_counts) if direct_peer_counts else 0.0
    avg_relay_peer_count = statistics.mean(relay_peer_counts) if relay_peer_counts else 0.0
    avg_announced_direct_webrtc_addrs = (
      statistics.mean(announced_direct_webrtc_addrs_counts)
      if announced_direct_webrtc_addrs_counts
      else 0.0
    )
    stability_probe_count = sum(1 for value in stability_sample_counts if value > 0)
    avg_stability_sample_count = (
      statistics.mean(stability_sample_counts)
      if stability_sample_counts
      else 0.0
    )
    avg_peer_set_change_count = (
      statistics.mean(peer_set_change_counts)
      if peer_set_change_counts
      else 0.0
    )
    avg_direct_connection_flip_count = (
      statistics.mean(direct_connection_flip_counts)
      if direct_connection_flip_counts
      else 0.0
    )
    avg_relay_connection_flip_count = (
      statistics.mean(relay_connection_flip_counts)
      if relay_connection_flip_counts
      else 0.0
    )
    avg_direct_connection_sample_rate = (
      statistics.mean(direct_connection_sample_rates)
      if direct_connection_sample_rates
      else 0.0
    )
    avg_relay_connection_sample_rate = (
      statistics.mean(relay_connection_sample_rates)
      if relay_connection_sample_rates
      else 0.0
    )
    avg_stability_peer_count = (
      statistics.mean(stability_avg_peer_counts)
      if stability_avg_peer_counts
      else 0.0
    )
    rtc_host_only_local_rate = (
      rtc_host_only_local_probe_count / rtc_probe_count
      if rtc_probe_count > 0
      else 0.0
    )
    preflight_probe_count = len(preflight_ok_values)
    preflight_success_rate = (
      statistics.mean(preflight_ok_values)
      if preflight_ok_values
      else 0.0
    )
    preflight_dns_success_rate = (
      statistics.mean(preflight_dns_values)
      if preflight_dns_values
      else 0.0
    )
    preflight_https_success_rate = (
      statistics.mean(preflight_https_values)
      if preflight_https_values
      else 0.0
    )
    preflight_hosts_entry_rate = (
      statistics.mean(preflight_hosts_entry_values)
      if preflight_hosts_entry_values
      else 0.0
    )
    infra_failure_rate = (
      statistics.mean(infra_failure_values)
      if infra_failure_values
      else 0.0
    )

    summary = {
      'run_id': self.run_id,
      'updated_at': utc_now_iso(),
      'probe_total': len(probe_events),
      'connection_success_rate': success_rate,
      'media_success_rate': media_rate,
      'convergence_avg_ms': convergence_avg,
      'convergence_p95_ms': convergence_p95,
      'scenario_event_count': len(scenario_events),
      'direct_announce_rate': direct_announce_rate,
      'direct_connection_rate': direct_connection_rate,
      'relay_webrtc_connection_rate': relay_webrtc_connection_rate,
      'avg_direct_peer_count': avg_direct_peer_count,
      'avg_relay_peer_count': avg_relay_peer_count,
      'avg_announced_direct_webrtc_addrs': avg_announced_direct_webrtc_addrs,
      'stability_probe_count': stability_probe_count,
      'avg_stability_sample_count': avg_stability_sample_count,
      'avg_peer_set_change_count': avg_peer_set_change_count,
      'avg_direct_connection_flip_count': avg_direct_connection_flip_count,
      'avg_relay_connection_flip_count': avg_relay_connection_flip_count,
      'avg_direct_connection_sample_rate': avg_direct_connection_sample_rate,
      'avg_relay_connection_sample_rate': avg_relay_connection_sample_rate,
      'avg_stability_peer_count': avg_stability_peer_count,
      'rtc_probe_count': rtc_probe_count,
      'rtc_host_only_local_rate': rtc_host_only_local_rate,
      'rtc_local_candidate_types': rtc_local_candidate_types,
      'rtc_remote_candidate_types': rtc_remote_candidate_types,
      'preflight_probe_count': preflight_probe_count,
      'preflight_success_rate': preflight_success_rate,
      'preflight_dns_success_rate': preflight_dns_success_rate,
      'preflight_https_success_rate': preflight_https_success_rate,
      'preflight_hosts_entry_rate': preflight_hosts_entry_rate,
      'infra_failure_rate': infra_failure_rate,
    }

    with self.paths.summary_json.open('w', encoding='utf-8') as handle:
      json.dump(summary, handle, indent=2)

    return summary


def tail_events(events_path: Path, limit: int = 50) -> list[dict[str, Any]]:
  if not events_path.exists():
    return []
  rows: list[dict[str, Any]] = []
  with events_path.open('r', encoding='utf-8') as handle:
    for raw in handle:
      raw = raw.strip()
      if not raw:
        continue
      try:
        parsed = json.loads(raw)
      except json.JSONDecodeError:
        continue
      if isinstance(parsed, dict):
        rows.append(parsed)
  return rows[-limit:]
