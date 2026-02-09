from __future__ import annotations

import json
from pathlib import Path
import tempfile
import unittest

from chaoslab.config import load_scenario_config, load_topology_config
from chaoslab.matrix import evaluate_gates, load_matrix_config
from chaoslab.metrics import MetricsStore
from chaoslab.scenario import ScenarioRunner
from chaoslab.topology import AgentRecord, ChaosTopology, ServiceRecord, TopologyError


class FakeTopology:
  def __init__(self):
    self.calls = []

  def set_link_profile(self, link_id: str, bw_mbit: float, delay_ms: float, loss_pct: float):
    self.calls.append(('bandwidth_shift', link_id, bw_mbit, delay_ms, loss_pct))
    return {'ok': True}

  def apply_partition(self, segments, action: str):
    self.calls.append(('partition', tuple(segments), action))
    return {'ok': True}

  def set_ip_mode(self, mode: str):
    self.calls.append(('ip_mode', mode))
    return {'mode': mode}

  def churn_agents(self, action: str, count: int = 1):
    self.calls.append(('agent_churn', action, count))
    return {'action': action, 'count': count}


class ChaosLabTests(unittest.TestCase):
  def test_switch_dpid_formatter(self):
    self.assertEqual(ChaosTopology._format_switch_dpid(1), '0000000000000001')
    self.assertEqual(ChaosTopology._format_switch_dpid(26), '000000000000001a')
    with self.assertRaises(TopologyError):
      ChaosTopology._format_switch_dpid(0)

  def test_planned_docker_node_names(self):
    services = [
      ServiceRecord(name='svc_dns', host='dns.peercompute.test', ipv4='10.0.0.2', ipv6=None),
      ServiceRecord(name='svc_relay', host='relay.peercompute.test', ipv4='10.0.0.3', ipv6=None),
    ]
    agents = [
      AgentRecord(name='agent-01', segment_id='lan_a', ipv4='10.0.1.2', ipv6=None),
      AgentRecord(name='agent-02', segment_id='lan_a', ipv4='10.0.1.3', ipv6=None),
      AgentRecord(name='svc_dns', segment_id='lan_a', ipv4='10.0.1.4', ipv6=None),
    ]
    names = ChaosTopology._planned_docker_node_names(services, agents)
    self.assertEqual(names, ['agent-01', 'agent-02', 'svc_dns', 'svc_relay'])

  def test_topology_state_snapshot_reflects_runtime_changes(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      config = {
        'network': {'name': 'test-lab', 'core_switch': 'core'},
        'agents': {'count': 2},
        'segments': [
          {
            'id': 'lan_a',
            'ipv4_subnet': '10.1.0.0/24',
            'ipv6_subnet': 'fd00:1::/64',
            'gateway4': '10.1.0.1',
            'gateway6': 'fd00:1::1',
            'nat': {'enabled': True, 'type': 'symmetric'},
          },
        ],
      }
      topology = ChaosTopology(
        config=config,
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='dry-run',
        logger=lambda *_: None,
      )
      topology.start()
      topology.apply_partition(['lan_a'], 'isolate')
      topology.set_ip_mode('ipv4-only')
      snapshot = topology.get_state_snapshot()
      topology.stop()

      self.assertEqual(snapshot['name'], 'test-lab')
      self.assertEqual(snapshot['actual_mode'], 'dry-run')
      self.assertEqual(snapshot['ip_mode'], 'ipv4-only')
      self.assertEqual(snapshot['segment_total'], 1)
      self.assertEqual(snapshot['partitioned_segments'], ['lan_a'])
      self.assertEqual(snapshot['agent_total'], 2)
      self.assertEqual(snapshot['agent_online'], 2)
      self.assertEqual(snapshot['services'][0]['host'], 'dns.peercompute.test')
      self.assertTrue(snapshot['segments'][0]['partitioned'])

  def test_load_topology_applies_defaults(self):
    with tempfile.TemporaryDirectory() as tmp:
      path = Path(tmp) / 'topology.yaml'
      path.write_text(
        'segments:\n'
        '  - id: lan_a\n'
        '    ipv4_subnet: 10.1.0.0/24\n'
        '    ipv6_subnet: fd00:1::/64\n',
        encoding='utf-8',
      )
      loaded = load_topology_config(path)
      self.assertEqual(loaded.data['agents']['count'], 10)
      self.assertEqual(loaded.data['network']['core_switch'], 'core')
      self.assertEqual(len(loaded.data['segments']), 1)

  def test_metrics_summary_accepts_camel_case_probe_payload(self):
    with tempfile.TemporaryDirectory() as tmp:
      store = MetricsStore(artifacts_dir=Path(tmp), run_id='test-run')
      store.record('probe_result', {
        'ok': True,
        'mediaOk': True,
        'convergenceMs': 1250,
        'hasDirectAnnounce': True,
        'hasDirectConnection': True,
        'hasRelayWebrtcConnection': False,
        'directPeerCount': 3,
        'relayPeerCount': 1,
        'announcedDirectWebrtcAddrsCount': 2,
        'stabilitySampleCount': 4,
        'peerSetChangeCount': 1,
        'directConnectionFlipCount': 0,
        'relayConnectionFlipCount': 1,
        'directConnectionSampleRate': 0.75,
        'relayConnectionSampleRate': 0.25,
        'stabilityAvgPeerCount': 2.5,
        'diagnostics': {
          'rtc': {
            'localCandidateTypes': {'host': 1},
            'remoteCandidateTypes': {'srflx': 1},
          },
        },
      })
      store.record('probe_result', {
        'ok': False,
        'mediaOk': False,
        'convergenceMs': 2500,
        'hasDirectAnnounce': False,
        'hasDirectConnection': False,
        'hasRelayWebrtcConnection': True,
        'directPeerCount': 0,
        'relayPeerCount': 2,
        'announcedDirectWebrtcAddrsCount': 0,
        'stabilitySampleCount': 4,
        'peerSetChangeCount': 3,
        'directConnectionFlipCount': 2,
        'relayConnectionFlipCount': 2,
        'directConnectionSampleRate': 0.25,
        'relayConnectionSampleRate': 0.75,
        'stabilityAvgPeerCount': 1.5,
        'diagnostics': {
          'rtc': {
            'localCandidateTypes': {'host': 1, 'srflx': 1},
            'remoteCandidateTypes': {'relay': 1},
          },
        },
      })
      summary = store.build_summary()
      self.assertEqual(summary['probe_total'], 2)
      self.assertAlmostEqual(summary['connection_success_rate'], 0.5)
      self.assertAlmostEqual(summary['media_success_rate'], 0.5)
      self.assertGreater(summary['convergence_p95_ms'], 0)
      self.assertAlmostEqual(summary['direct_announce_rate'], 0.5)
      self.assertAlmostEqual(summary['direct_connection_rate'], 0.5)
      self.assertAlmostEqual(summary['relay_webrtc_connection_rate'], 0.5)
      self.assertAlmostEqual(summary['avg_direct_peer_count'], 1.5)
      self.assertAlmostEqual(summary['avg_relay_peer_count'], 1.5)
      self.assertAlmostEqual(summary['avg_announced_direct_webrtc_addrs'], 1.0)
      self.assertEqual(summary['stability_probe_count'], 2)
      self.assertAlmostEqual(summary['avg_stability_sample_count'], 4.0)
      self.assertAlmostEqual(summary['avg_peer_set_change_count'], 2.0)
      self.assertAlmostEqual(summary['avg_direct_connection_flip_count'], 1.0)
      self.assertAlmostEqual(summary['avg_relay_connection_flip_count'], 1.5)
      self.assertAlmostEqual(summary['avg_direct_connection_sample_rate'], 0.5)
      self.assertAlmostEqual(summary['avg_relay_connection_sample_rate'], 0.5)
      self.assertAlmostEqual(summary['avg_stability_peer_count'], 2.0)
      self.assertEqual(summary['rtc_probe_count'], 2)
      self.assertAlmostEqual(summary['rtc_host_only_local_rate'], 0.5)
      self.assertEqual(summary['rtc_local_candidate_types']['host'], 2)
      self.assertEqual(summary['rtc_remote_candidate_types']['srflx'], 1)

  def test_scenario_runner_builds_revert_stages(self):
    topology = FakeTopology()
    with tempfile.TemporaryDirectory() as tmp:
      metrics = MetricsStore(artifacts_dir=Path(tmp), run_id='scenario-run')
      runner = ScenarioRunner(
        topology=topology,
        metrics=metrics,
        sleep_fn=lambda _: None,
        monotonic_fn=lambda: 0.0,
        time_scale=0.0,
      )

      scenario = {
        'settle_seconds': 0,
        'stages': [
          {
            'at_seconds': 1,
            'type': 'partition',
            'segments': ['lan_a'],
            'action': 'isolate',
            'duration_seconds': 3,
          },
          {
            'at_seconds': 2,
            'type': 'ip_mode',
            'mode': 'ipv6-only',
            'duration_seconds': 2,
          },
        ],
      }

      results = runner.run(scenario)
      self.assertEqual(len(results), 4)
      self.assertIn(('partition', ('lan_a',), 'isolate'), topology.calls)
      self.assertIn(('partition', ('lan_a',), 'heal'), topology.calls)
      self.assertIn(('ip_mode', 'ipv6-only'), topology.calls)
      self.assertIn(('ip_mode', 'dual-stack'), topology.calls)

  def test_load_matrix_config_resolves_paths(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = root / 'topology.yaml'
      scenario = root / 'scenario.yaml'
      matrix = root / 'matrix.yaml'

      topology.write_text('segments: []\n', encoding='utf-8')
      scenario.write_text('name: s\nstages: []\n', encoding='utf-8')
      matrix.write_text(
        'name: test-matrix\n'
        'defaults:\n'
        '  mode: dry-run\n'
        '  topology: topology.yaml\n'
        'runs:\n'
        '  - id: first\n'
        '    scenario: scenario.yaml\n'
        '    gates:\n'
        '      - metric: probe_total\n'
        '        op: ">="\n'
        '        value: 1\n',
        encoding='utf-8',
      )

      loaded = load_matrix_config(matrix, root)
      self.assertEqual(loaded.name, 'test-matrix')
      self.assertEqual(len(loaded.runs), 1)
      self.assertEqual(loaded.defaults['mode'], 'dry-run')
      self.assertTrue(loaded.defaults['topology'].endswith('topology.yaml'))
      self.assertEqual(loaded.runs[0].id, 'first')
      self.assertEqual(loaded.runs[0].scenario, str(scenario.resolve()))

  def test_evaluate_gates_handles_required_and_optional(self):
    summary = {
      'probe_total': 3,
      'connection_success_rate': 0.75,
    }
    gates = [
      {'metric': 'probe_total', 'op': '>=', 'value': 2, 'required': True},
      {'metric': 'connection_success_rate', 'op': '>=', 'value': 0.90, 'required': False},
      {'metric': 'direct_connection_rate', 'op': '>=', 'value': 0.40, 'required': True},
    ]
    ok, details = evaluate_gates(summary, gates)
    self.assertFalse(ok)
    self.assertEqual(len(details), 3)
    self.assertTrue(details[0]['passed'])
    self.assertFalse(details[1]['passed'])
    self.assertFalse(details[2]['passed'])
    self.assertIn('not numeric', details[2]['reason'])


if __name__ == '__main__':
  unittest.main()
