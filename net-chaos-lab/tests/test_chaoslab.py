from __future__ import annotations

import json
import os
from pathlib import Path
import subprocess
import tempfile
import time
import unittest
from unittest import mock
from urllib.parse import parse_qs, urlparse

from chaoslab.config import load_scenario_config, load_topology_config
from chaoslab.harness import ChaosHarness
from chaoslab.main import _ensure_netviz_docs_bundle
from chaoslab.matrix import evaluate_gates, load_matrix_config
from chaoslab.metrics import MetricsStore
from chaoslab.scenario import ScenarioRunner
from chaoslab.topology import (
  AgentRecord,
  ChaosTopology,
  DEFAULT_CHAOSLAB_IMAGE,
  DEFAULT_CHAOSLAB_IMAGE_REV,
  ServiceRecord,
  TopologyError,
)


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


class FakeProbeTopology:
  def __init__(self):
    self.actual_mode = 'containernet'
    self.commands: list[list[str]] = []

  def run_command_in_agent(self, _agent_name: str, command: list[str], timeout_s: int = 180):
    del timeout_s
    self.commands.append(list(command))
    if command[:3] == ['bash', '-lc', 'test -f /workspace/net-chaos-lab/agent/probe.mjs']:
      return 0, '', ''
    if command[:2] == ['getent', 'hosts']:
      return 0, '10.40.254.10 demos.peercompute.test\n', ''
    if command[:2] == ['bash', '-lc'] and 'grep -F -- demos.peercompute.test /etc/hosts' in command[2]:
      return 0, '10.40.254.10 demos.peercompute.test\n', ''
    if command[:2] == ['bash', '-lc'] and 'head -n 6 /etc/resolv.conf' in command[2]:
      return 0, 'nameserver 10.40.254.2\n', ''
    if command[:2] == ['bash', '-lc'] and command[2] == 'command -v curl >/dev/null 2>&1':
      return 0, '', ''
    if command[:9] == [
      'curl',
      '-k',
      '-sS',
      '-o',
      '/dev/null',
      '-w',
      '%{http_code} %{remote_ip} %{remote_port}',
      '--max-time',
      '8',
    ]:
      return 0, '200 10.40.254.10 443', ''
    if command and command[0] == 'node':
      payload = {
        'ok': True,
        'mode': 'netviz',
        'url': 'https://demos.peercompute.test/netviz/',
        'connected': True,
        'peerCount': 2,
        'convergenceMs': 250,
        'mediaOk': False,
      }
      return 0, json.dumps(payload) + '\n', ''
    return 1, '', 'unsupported command'


class FakePreflightFallbackTopology(FakeProbeTopology):
  def get_service_host_map(self):
    return {'demos.peercompute.test': '10.40.254.10'}

  def run_command_in_agent(self, _agent_name: str, command: list[str], timeout_s: int = 180):
    del timeout_s
    self.commands.append(list(command))
    if command[:3] == ['bash', '-lc', 'test -f /workspace/net-chaos-lab/agent/probe.mjs']:
      return 0, '', ''
    if command[:2] == ['getent', 'hosts']:
      return 2, '', ''
    if command[:2] == ['bash', '-lc'] and 'grep -F -- demos.peercompute.test /etc/hosts' in command[2]:
      return 1, '', ''
    if command[:2] == ['bash', '-lc'] and 'head -n 6 /etc/resolv.conf' in command[2]:
      return 0, 'nameserver 10.40.254.2\n', ''
    if command[:2] == ['bash', '-lc'] and command[2] == 'command -v curl >/dev/null 2>&1':
      return 0, '', ''
    if command[:9] == [
      'curl',
      '-k',
      '-sS',
      '-o',
      '/dev/null',
      '-w',
      '%{http_code} %{remote_ip} %{remote_port}',
      '--max-time',
      '8',
    ]:
      url_index = 9
      if len(command) > 9 and command[9] in {'-4', '-6'}:
        url_index = 10
      url = str(command[url_index] if len(command) > url_index else '')
      if url.startswith('https://10.40.254.10/'):
        return 0, '200 10.40.254.10 443', ''
      return 6, '', ''
    if command and command[0] == 'node':
      payload = {
        'ok': True,
        'mode': 'netviz',
        'url': command[3] if len(command) > 3 else 'https://10.40.254.10/netviz/',
        'connected': True,
        'peerCount': 2,
        'convergenceMs': 350,
        'mediaOk': False,
      }
      return 0, json.dumps(payload) + '\n', ''
    return 1, '', 'unsupported command'


class FakeIpv6PreferredUrlTopology(FakeProbeTopology):
  def __init__(self):
    super().__init__()
    self.ip_mode = 'ipv6-only'

  def get_service_host_entries(self):
    return [
      ('demos.peercompute.test', '10.40.254.10'),
      ('demos.peercompute.test', 'fd42:40:254::10'),
    ]

  def run_command_in_agent(self, _agent_name: str, command: list[str], timeout_s: int = 180):
    del timeout_s
    self.commands.append(list(command))
    if command[:3] == ['bash', '-lc', 'test -f /workspace/net-chaos-lab/agent/probe.mjs']:
      return 0, '', ''
    if command[:2] == ['getent', 'hosts']:
      return 0, 'fd42:40:254::10 demos.peercompute.test\n', ''
    if command[:2] == ['bash', '-lc'] and 'grep -F -- demos.peercompute.test /etc/hosts' in command[2]:
      return 0, 'fd42:40:254::10 demos.peercompute.test\n', ''
    if command[:2] == ['bash', '-lc'] and 'head -n 6 /etc/resolv.conf' in command[2]:
      return 0, 'nameserver fd42:40:254::2\n', ''
    if command[:2] == ['bash', '-lc'] and command[2] == 'command -v curl >/dev/null 2>&1':
      return 0, '', ''
    if command[:10] == [
      'curl',
      '-k',
      '-sS',
      '-o',
      '/dev/null',
      '-w',
      '%{http_code} %{remote_ip} %{remote_port}',
      '--max-time',
      '8',
      '-6',
    ]:
      return 0, '200 fd42:40:254::10 443', ''
    if command and command[0] == 'node':
      payload = {
        'ok': True,
        'mode': 'netviz',
        'url': command[3] if len(command) > 3 else 'https://[fd42:40:254::10]/netviz/',
        'connected': True,
        'peerCount': 2,
        'convergenceMs': 240,
        'mediaOk': False,
      }
      return 0, json.dumps(payload) + '\n', ''
    return 1, '', 'unsupported command'


class FakeProbeFailureTopology(FakeProbeTopology):
  def run_command_in_agent(self, _agent_name: str, command: list[str], timeout_s: int = 180):
    del timeout_s
    self.commands.append(list(command))
    if command[:3] == ['bash', '-lc', 'test -f /workspace/net-chaos-lab/agent/probe.mjs']:
      return 0, '', ''
    if command[:2] == ['getent', 'hosts']:
      return 0, '10.40.254.10 demos.peercompute.test\n', ''
    if command[:2] == ['bash', '-lc'] and 'grep -F -- demos.peercompute.test /etc/hosts' in command[2]:
      return 0, '10.40.254.10 demos.peercompute.test\n', ''
    if command[:2] == ['bash', '-lc'] and 'head -n 6 /etc/resolv.conf' in command[2]:
      return 0, 'nameserver 10.40.254.2\n', ''
    if command[:2] == ['bash', '-lc'] and command[2] == 'command -v curl >/dev/null 2>&1':
      return 0, '', ''
    if command[:9] == [
      'curl',
      '-k',
      '-sS',
      '-o',
      '/dev/null',
      '-w',
      '%{http_code} %{remote_ip} %{remote_port}',
      '--max-time',
      '8',
    ]:
      return 0, '200 10.40.254.10 443', ''
    if command and command[0] == 'node':
      return 1, 'probe bootstrap failed: playwright chromium launch failed\n', ''
    return 1, '', 'unsupported command'


class FakeProbeNonZeroJsonTopology(FakeProbeTopology):
  def run_command_in_agent(self, _agent_name: str, command: list[str], timeout_s: int = 180):
    del timeout_s
    self.commands.append(list(command))
    if command[:3] == ['bash', '-lc', 'test -f /workspace/net-chaos-lab/agent/probe.mjs']:
      return 0, '', ''
    if command[:2] == ['getent', 'hosts']:
      return 0, '10.40.254.10 demos.peercompute.test\n', ''
    if command[:2] == ['bash', '-lc'] and 'grep -F -- demos.peercompute.test /etc/hosts' in command[2]:
      return 0, '10.40.254.10 demos.peercompute.test\n', ''
    if command[:2] == ['bash', '-lc'] and 'head -n 6 /etc/resolv.conf' in command[2]:
      return 0, 'nameserver 10.40.254.2\n', ''
    if command[:2] == ['bash', '-lc'] and command[2] == 'command -v curl >/dev/null 2>&1':
      return 0, '', ''
    if command[:9] == [
      'curl',
      '-k',
      '-sS',
      '-o',
      '/dev/null',
      '-w',
      '%{http_code} %{remote_ip} %{remote_port}',
      '--max-time',
      '8',
    ]:
      return 0, '200 10.40.254.10 443', ''
    if command and command[0] == 'node':
      payload = {
        'ok': False,
        'mode': 'netviz',
        'url': 'https://demos.peercompute.test/netviz/',
        'connected': False,
        'peerCount': 0,
        'convergenceMs': None,
        'mediaOk': False,
      }
      return 1, json.dumps(payload) + '\n', ''
    return 1, '', 'unsupported command'


class ChaosLabTests(unittest.TestCase):
  def test_harness_normalizes_netviz_probe_url_with_autoconnect_defaults(self):
    url = ChaosHarness._normalize_probe_url('netviz', 'https://demos.peercompute.test/netviz/')
    parsed = urlparse(url)
    params = parse_qs(parsed.query)
    self.assertEqual(parsed.scheme, 'https')
    self.assertEqual(parsed.netloc, 'demos.peercompute.test')
    self.assertEqual(parsed.path, '/netviz/')
    self.assertEqual(params.get('autoConnect'), ['1'])
    self.assertEqual(params.get('room'), ['telemetry'])
    self.assertEqual(params.get('topologyId'), ['netviz-topology'])
    self.assertEqual(params.get('topologyType'), ['distributed'])

  def test_harness_preserves_explicit_netviz_probe_url_query(self):
    url = ChaosHarness._normalize_probe_url(
      'netviz',
      'https://demos.peercompute.test/netviz/?autoConnect=0&room=custom&topologyId=foo&topologyType=star',
    )
    params = parse_qs(urlparse(url).query)
    self.assertEqual(params.get('autoConnect'), ['0'])
    self.assertEqual(params.get('room'), ['custom'])
    self.assertEqual(params.get('topologyId'), ['foo'])
    self.assertEqual(params.get('topologyType'), ['star'])

  def test_harness_does_not_normalize_non_netviz_probe_url(self):
    source = 'https://demos.peercompute.test/netviz/'
    self.assertEqual(ChaosHarness._normalize_probe_url('other', source), source)

  def test_ensure_node_network_tooling_noop_when_ip_exists(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = ChaosTopology(
        config={},
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='dry-run',
        logger=lambda *_: None,
      )
      calls: list[str] = []

      def fake_exec(_node, script):
        calls.append(script)
        self.assertEqual(script, 'command -v ip >/dev/null 2>&1')
        return 0, '', ''

      topology._exec_node_shell = fake_exec  # type: ignore[method-assign]
      topology._ensure_node_network_tooling(object(), 'agent-01')
      self.assertEqual(calls, ['command -v ip >/dev/null 2>&1'])

  def test_ensure_node_network_tooling_fails_when_ip_missing(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = ChaosTopology(
        config={},
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='dry-run',
        logger=lambda *_: None,
      )
      calls: list[str] = []
      check_cmd = 'command -v ip >/dev/null 2>&1'

      def fake_exec(_node, script):
        calls.append(script)
        self.assertEqual(script, check_cmd)
        return 1, '', ''

      topology._exec_node_shell = fake_exec  # type: ignore[method-assign]
      with self.assertRaises(TopologyError) as ctx:
        topology._ensure_node_network_tooling(object(), 'agent-01')
      self.assertIn('`ip` command is missing in agent-01', str(ctx.exception))
      self.assertEqual(calls, [check_cmd])

  def test_validate_agent_probe_runtime_passes_when_playwright_launches(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = ChaosTopology(
        config={},
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='dry-run',
        logger=lambda *_: None,
      )
      calls: list[str] = []

      def fake_exec(_node, script):
        calls.append(script)
        self.assertIn('cd /workspace || exit 44', script)
        self.assertIn('/workspace/net-chaos-lab/agent/runtime-check.mjs', script)
        return 0, '', ''

      topology._exec_node_shell = fake_exec  # type: ignore[method-assign]
      agent = AgentRecord(
        name='agent-01',
        segment_id='lan_a',
        ipv4='10.40.10.2',
        ipv6='fd42:40:10::2',
        node=object(),
      )
      topology._validate_agent_probe_runtime([agent])
      self.assertEqual(len(calls), 1)

  def test_validate_agent_probe_runtime_fails_with_rebuild_hint(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = ChaosTopology(
        config={},
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='dry-run',
        logger=lambda *_: None,
      )

      def fake_exec(_node, _script):
        return 43, 'playwright chromium launch failed: Executable does not exist\n', ''

      topology._exec_node_shell = fake_exec  # type: ignore[method-assign]
      agent = AgentRecord(
        name='agent-01',
        segment_id='lan_a',
        ipv4='10.40.10.2',
        ipv6='fd42:40:10::2',
        node=object(),
      )
      with self.assertRaises(TopologyError) as ctx:
        topology._validate_agent_probe_runtime([agent])
      self.assertIn('Agent probe runtime validation failed in agent-01', str(ctx.exception))
      self.assertIn('npm run chaos-lab:image:build', str(ctx.exception))
      self.assertIn('playwright chromium launch failed', str(ctx.exception))

  def test_required_container_images_include_agent_and_core_images(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = ChaosTopology(
        config={
          'agents': {
            'image': 'agent:image',
          },
          'core_services': {
            'dns': {'image': 'svc:dns'},
            'https': {'image': 'svc:https'},
            'relay': {'image': 'svc:relay'},
            'turn': {'image': 'svc:turn'},
          },
        },
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='dry-run',
        logger=lambda *_: None,
      )
      images = topology._required_container_images()
      self.assertEqual(
        images,
        ['agent:image', 'svc:dns', 'svc:https', 'svc:relay', 'svc:turn'],
      )

  def test_default_image_revision_mismatch_false_when_label_matches(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = ChaosTopology(
        config={},
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='dry-run',
        logger=lambda *_: None,
      )
      topology._docker_image_label = lambda _image, _label: DEFAULT_CHAOSLAB_IMAGE_REV  # type: ignore[method-assign]
      self.assertFalse(topology._default_image_revision_mismatch(DEFAULT_CHAOSLAB_IMAGE))

  def test_default_image_revision_mismatch_true_when_label_differs(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = ChaosTopology(
        config={},
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='dry-run',
        logger=lambda *_: None,
      )
      topology._docker_image_label = lambda _image, _label: 'old-rev'  # type: ignore[method-assign]
      self.assertTrue(topology._default_image_revision_mismatch(DEFAULT_CHAOSLAB_IMAGE))

  def test_node_data_interface_prefers_mininet_intf(self):
    class FakeNode:
      def intfNames(self):
        return ['lo', 'agent-01-eth0']

    self.assertEqual(ChaosTopology._node_data_interface(FakeNode()), 'agent-01-eth0')
    self.assertEqual(ChaosTopology._node_data_interface(None), 'eth0')

  def test_node_data_interface_prefers_named_mininet_intf_over_docker_eth0(self):
    class FakeNode:
      name = 'agent-01'

      def intfNames(self):
        return ['lo', 'eth0', 'agent-01-eth0']

    self.assertEqual(ChaosTopology._node_data_interface(FakeNode()), 'agent-01-eth0')

  def test_node_data_interface_prefers_non_eth0_when_only_linux_names_exist(self):
    class FakeNode:
      def intfNames(self):
        return ['lo', 'eth0', 'eth1']

    self.assertEqual(ChaosTopology._node_data_interface(FakeNode()), 'eth1')

  def test_node_runtime_interface_remaps_prefixed_name_to_eth_index(self):
    class FakeNode:
      name = 'agent-01'

      def intfNames(self):
        return ['lo', 'eth0', 'agent-01-eth1']

    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = ChaosTopology(
        config={},
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='dry-run',
        logger=lambda *_: None,
      )
      topology.actual_mode = 'containernet'

      def fake_exec(_node, script):
        if script == 'ip link show dev agent-01-eth1 >/dev/null 2>&1':
          return 1, '', ''
        if script == 'ip link show dev eth1 >/dev/null 2>&1':
          return 0, '', ''
        return 1, '', 'unexpected command'

      topology._exec_node_shell = fake_exec  # type: ignore[method-assign]
      resolved = topology._node_runtime_interface(FakeNode())
      self.assertEqual(resolved, 'eth1')

  def test_configure_agent_uses_data_interface(self):
    class FakeNode:
      def __init__(self):
        self.commands: list[str] = []

      def intfNames(self):
        return ['lo', 'agent-01-eth0']

      def cmd(self, command: str):
        self.commands.append(command)
        return ''

    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = ChaosTopology(
        config={
          'segments': [
            {
              'id': 'lan_a',
              'ipv4_subnet': '10.40.10.0/24',
              'ipv6_subnet': 'fd42:40:10::/64',
              'gateway4': '10.40.10.1',
              'gateway6': 'fd42:40:10::1',
            },
          ],
        },
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='dry-run',
        logger=lambda *_: None,
      )
      node = FakeNode()
      agent = AgentRecord(
        name='agent-01',
        segment_id='lan_a',
        ipv4='10.40.10.11',
        ipv6='fd42:40:10::11',
        node=node,
      )
      topology._configure_agent(agent)
      joined = '\n'.join(node.commands)
      self.assertIn('dev agent-01-eth0', joined)
      self.assertNotIn('ip route replace default via 10.40.10.1 dev eth0', joined)
      self.assertNotIn('ip -6 route replace default via fd42:40:10::1 dev eth0', joined)

  def test_validate_agent_routing_fails_when_route_stays_on_docker_eth0(self):
    class FakeNode:
      pass

    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = ChaosTopology(
        config={},
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='dry-run',
        logger=lambda *_: None,
      )
      topology.actual_mode = 'containernet'
      topology._services = {
        'https': ServiceRecord(
          name='svc_https',
          host='demos.peercompute.test',
          ipv4='10.40.254.10',
          ipv6='fd42:40:254::10',
          node=None,
        ),
      }
      agent = AgentRecord(
        name='agent-01',
        segment_id='lan_a',
        ipv4='10.40.10.11',
        ipv6=None,
        node=FakeNode(),
      )

      def fake_exec(_node, _script):
        return 0, '10.40.254.10 via 172.17.0.1 dev eth0 src 172.17.0.9 uid 0', ''

      topology._exec_node_shell = fake_exec  # type: ignore[method-assign]
      with self.assertRaises(TopologyError):
        topology._validate_agent_routing(agent, 'eth1')

  def test_validate_agent_routing_passes_with_expected_gateway_and_src(self):
    class FakeNode:
      pass

    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = ChaosTopology(
        config={
          'segments': [
            {
              'id': 'lan_a',
              'ipv4_subnet': '10.40.10.0/24',
              'ipv6_subnet': 'fd42:40:10::/64',
              'gateway4': '10.40.10.1',
              'gateway6': 'fd42:40:10::1',
            },
          ],
        },
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='dry-run',
        logger=lambda *_: None,
      )
      topology.actual_mode = 'containernet'
      topology._services = {
        'https': ServiceRecord(
          name='svc_https',
          host='demos.peercompute.test',
          ipv4='10.40.254.10',
          ipv6='fd42:40:254::10',
          node=None,
        ),
      }
      agent = AgentRecord(
        name='agent-01',
        segment_id='lan_a',
        ipv4='10.40.10.11',
        ipv6=None,
        node=FakeNode(),
      )

      def fake_exec(_node, script):
        if script.startswith('ip -4 addr show dev eth1'):
          return 0, 'inet 10.40.10.11/24 brd 10.40.10.255 scope global eth1', ''
        if script.startswith('ip route show default'):
          return 0, 'default via 10.40.10.1 dev eth1', ''
        if script.startswith('ip route get 10.40.254.10'):
          return 0, '10.40.254.10 via 10.40.10.1 dev eth1 src 10.40.10.11 uid 0', ''
        return 1, '', 'unexpected command'

      topology._exec_node_shell = fake_exec  # type: ignore[method-assign]
      topology._validate_agent_routing(agent, 'eth1')

  def test_seed_agent_hosts_accepts_explicit_agent_list(self):
    class FakeNode:
      def __init__(self):
        self.commands: list[str] = []

      def intfNames(self):
        return ['lo', 'agent-01-eth0']

      def cmd(self, command: str):
        self.commands.append(command)
        return '__CHAOSLAB_EXIT_CODE__:0\n'

    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = ChaosTopology(
        config={},
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='dry-run',
        logger=lambda *_: None,
      )
      topology._services = {
        'https': ServiceRecord(
          name='svc_https',
          host='demos.peercompute.test',
          ipv4='10.40.254.10',
          ipv6=None,
        ),
      }
      node = FakeNode()
      agent = AgentRecord(
        name='agent-01',
        segment_id='lan_a',
        ipv4='10.40.10.11',
        ipv6=None,
        node=node,
      )
      topology._seed_agent_hosts([agent])
      commands = '\n'.join(node.commands)
      self.assertIn('/etc/hosts', commands)
      self.assertIn('demos.peercompute.test', commands)

  def test_parse_shell_output_strips_terminal_noise(self):
    noisy = (
      '\u001b[?2004l\n'
      '10.40.254.10 demos.peercompute.test\n'
      '\u001b[?2004h\n'
      ' __CHAOSLAB_EXIT_CODE__:0 \n'
    )
    rc, stdout = ChaosTopology._parse_shell_output(noisy, default_rc=1)
    self.assertEqual(rc, 0)
    self.assertEqual(stdout, '10.40.254.10 demos.peercompute.test')

  def test_parse_shell_output_ignores_continuation_prompts(self):
    noisy = (
      '>\n'
      '>\n'
      '10.40.254.10 demos.peercompute.test\n'
      '__CHAOSLAB_EXIT_CODE__:0\n'
    )
    rc, stdout = ChaosTopology._parse_shell_output(noisy, default_rc=1)
    self.assertEqual(rc, 0)
    self.assertEqual(stdout, '10.40.254.10 demos.peercompute.test')

  def test_parse_shell_output_preserves_inline_text_before_exit_marker(self):
    noisy = '404__CHAOSLAB_EXIT_CODE__:0\n'
    rc, stdout = ChaosTopology._parse_shell_output(noisy, default_rc=1)
    self.assertEqual(rc, 0)
    self.assertEqual(stdout, '404')

  def test_switch_dpid_formatter(self):
    self.assertEqual(ChaosTopology._format_switch_dpid(1), '0000000000000001')
    self.assertEqual(ChaosTopology._format_switch_dpid(26), '000000000000001a')
    with self.assertRaises(TopologyError):
      ChaosTopology._format_switch_dpid(0)

  def test_stable_agent_mac_is_deterministic_and_unique(self):
    mac_a = ChaosTopology._stable_agent_mac(
      AgentRecord(name='agent-01', segment_id='lan_a', ipv4='10.1.0.2', ipv6='fd00:1::2'),
    )
    mac_b = ChaosTopology._stable_agent_mac(
      AgentRecord(name='agent-02', segment_id='lan_a', ipv4='10.1.0.3', ipv6='fd00:1::3'),
    )
    mac_c = ChaosTopology._stable_agent_mac(
      AgentRecord(name='agent-01', segment_id='lan_b', ipv4='10.2.0.2', ipv6='fd00:2::2'),
    )

    self.assertRegex(mac_a, r'^[0-9a-f]{2}(:[0-9a-f]{2}){5}$')
    self.assertTrue(mac_a.startswith('02:50:'))
    self.assertNotEqual(mac_a, mac_b)
    self.assertNotEqual(mac_a, mac_c)

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

  def test_ip_mode_scope_defaults_to_agents_only(self):
    class _Node:
      def __init__(self):
        self.commands: list[str] = []

      def cmd(self, command):
        self.commands.append(str(command))
        return ''

    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = ChaosTopology(
        config={'network': {}},
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='dry-run',
        logger=lambda *_: None,
      )
      agent_node = _Node()
      router_node = _Node()
      service_node = _Node()
      topology._agents = [
        AgentRecord(name='agent-01', segment_id='lan_a', ipv4=None, ipv6=None, node=agent_node),
      ]
      topology._segment_routers = {'lan_a': router_node}
      topology._services = {
        'https': ServiceRecord(
          name='svc_https',
          host='demos.peercompute.test',
          ipv4=None,
          ipv6=None,
          node=service_node,
        ),
      }
      topology.actual_mode = 'containernet'

      topology.set_ip_mode('ipv6-only')

      self.assertTrue(any('chaos-ipv6-only' in command for command in agent_node.commands))
      self.assertEqual(router_node.commands, [])
      self.assertEqual(service_node.commands, [])

  def test_ip_mode_scope_all_includes_routers_and_services(self):
    class _Node:
      def __init__(self):
        self.commands: list[str] = []

      def cmd(self, command):
        self.commands.append(str(command))
        return ''

    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = ChaosTopology(
        config={'network': {'ip_mode_scope': 'all'}},
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='dry-run',
        logger=lambda *_: None,
      )
      agent_node = _Node()
      router_node = _Node()
      service_node = _Node()
      topology._agents = [
        AgentRecord(name='agent-01', segment_id='lan_a', ipv4=None, ipv6=None, node=agent_node),
      ]
      topology._segment_routers = {'lan_a': router_node}
      topology._services = {
        'https': ServiceRecord(
          name='svc_https',
          host='demos.peercompute.test',
          ipv4=None,
          ipv6=None,
          node=service_node,
        ),
      }
      topology.actual_mode = 'containernet'

      topology.set_ip_mode('ipv6-only')

      self.assertTrue(any('chaos-ipv6-only' in command for command in agent_node.commands))
      self.assertTrue(any('chaos-ipv6-only' in command for command in router_node.commands))
      self.assertTrue(any('chaos-ipv6-only' in command for command in service_node.commands))

  def test_ip_mode_agents_scope_uses_route_family_toggles(self):
    class _Node:
      def __init__(self):
        self.commands: list[str] = []
        self.name = 'agent-01'

      def cmd(self, command):
        text = str(command)
        self.commands.append(text)
        if 'ip -6 route show default' in text:
          return f'default via fd00:1::1 dev eth0 metric 1024 pref medium\n{ChaosTopology._SHELL_EXIT_SENTINEL}0\n'
        if 'ip route show default' in text:
          return f'default via 10.1.0.1 dev eth0\n{ChaosTopology._SHELL_EXIT_SENTINEL}0\n'
        return f'{ChaosTopology._SHELL_EXIT_SENTINEL}0\n'

    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = ChaosTopology(
        config={
          'network': {'ip_mode_scope': 'agents'},
          'segments': [
            {
              'id': 'lan_a',
              'ipv4_subnet': '10.1.0.0/24',
              'ipv6_subnet': 'fd00:1::/64',
              'gateway4': '10.1.0.1',
              'gateway6': 'fd00:1::1',
              'nat': {'enabled': True},
            },
          ],
        },
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='dry-run',
        logger=lambda *_: None,
      )
      agent_node = _Node()
      topology._agents = [
        AgentRecord(name='agent-01', segment_id='lan_a', ipv4='10.1.0.2', ipv6='fd00:1::2', node=agent_node),
      ]
      topology.actual_mode = 'containernet'

      topology.set_ip_mode('ipv6-only')
      joined_ipv6_only = '\n'.join(agent_node.commands)
      self.assertIn('ip -6 route show default', joined_ipv6_only)
      self.assertIn('ip route del default', joined_ipv6_only)

      agent_node.commands.clear()
      topology.set_ip_mode('dual-stack')
      joined_dual = '\n'.join(agent_node.commands)
      self.assertIn('ip route show default', joined_dual)
      self.assertIn('ip -6 route show default', joined_dual)

  def test_ip_mode_switch_uses_firewall_rules_not_disable_ipv6_sysctl(self):
    class _Node:
      def __init__(self):
        self.commands: list[str] = []

      def cmd(self, command):
        self.commands.append(str(command))
        return ''

    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = ChaosTopology(
        config={'network': {}},
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='dry-run',
        logger=lambda *_: None,
      )
      node = _Node()

      topology._apply_ip_mode_to_node(node, 'ipv4-only')
      joined = '\n'.join(node.commands)
      self.assertIn('ip6tables -C OUTPUT', joined)
      self.assertIn('chaos-ipv4-only', joined)
      self.assertNotIn('disable_ipv6', joined)

      node.commands.clear()
      topology._apply_ip_mode_to_node(node, 'dual-stack')
      dual_joined = '\n'.join(node.commands)
      self.assertIn('iptables -D OUTPUT', dual_joined)
      self.assertIn('ip6tables -D OUTPUT', dual_joined)
      self.assertNotIn('-A OUTPUT', dual_joined)

  def test_configure_router_keeps_ipv6_routed_only_and_ipv4_masquerade(self):
    class _RouterNode:
      def __init__(self):
        self.commands: list[str] = []

      def cmd(self, command):
        self.commands.append(str(command))
        return ''

    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = ChaosTopology(
        config={
          'core_services': {
            'subnet_ipv4': '10.40.254.0/24',
            'subnet_ipv6': 'fd42:40:254::/64',
          },
        },
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='dry-run',
        logger=lambda *_: None,
      )
      segment = {
        'id': 'lan_a',
        'ipv4_subnet': '10.40.10.0/24',
        'ipv6_subnet': 'fd42:40:10::/64',
        'gateway4': '10.40.10.1',
        'gateway6': 'fd42:40:10::1',
        'nat': {
          'uplink_ipv4': '10.40.1.10/24',
          'uplink_ipv6': 'fd42:40:254::110/64',
        },
      }
      router = _RouterNode()

      topology._configure_router(router, segment)

      joined = '\n'.join(router.commands)
      self.assertIn(
        'iptables -t nat -C POSTROUTING -o nat_lan_a-wan -j MASQUERADE',
        joined,
      )
      self.assertIn(
        'ip6tables -t nat -D POSTROUTING -o nat_lan_a-wan -j MASQUERADE',
        joined,
      )
      self.assertNotIn(
        'ip6tables -t nat -C POSTROUTING -o nat_lan_a-wan -j MASQUERADE',
        joined,
      )

  def test_start_auto_fallback_restores_host_bridge_nf_policy(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = ChaosTopology(
        config={},
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='auto',
        logger=lambda *_: None,
      )
      calls: list[str] = []

      def _raise_containernet_start():
        raise RuntimeError('containernet unavailable')

      topology._start_containernet = _raise_containernet_start  # type: ignore[method-assign]
      topology._start_dry_run = lambda: None  # type: ignore[method-assign]
      topology._restore_host_forwarding_policy = lambda: calls.append('forward')  # type: ignore[method-assign]
      topology._restore_host_bridge_nf_policy = lambda: calls.append('bridge')  # type: ignore[method-assign]

      topology.start()

      self.assertIn('forward', calls)
      self.assertIn('bridge', calls)
      self.assertTrue(topology.started)

  def test_topology_core_network_derivation(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      config = {
        'core_services': {
          'subnet_ipv4': '10.40.254.0/24',
          'subnet_ipv6': 'fd42:40:254::/64',
        },
        'segments': [
          {
            'id': 'lan_a',
            'ipv4_subnet': '10.40.10.0/24',
            'ipv6_subnet': 'fd42:40:10::/64',
            'nat': {
              'uplink_ipv4': '10.40.1.10/24',
              'uplink_ipv6': 'fd42:40:1:10::1/64',
            },
          },
          {
            'id': 'lan_b',
            'ipv4_subnet': '10.40.20.0/24',
            'ipv6_subnet': 'fd42:40:20::/64',
            'nat': {
              'uplink_ipv4': '10.40.1.20/24',
              'uplink_ipv6': 'fd42:40:1:20::1/64',
            },
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
      services4, services6 = topology._core_service_networks()
      uplinks4, uplinks6 = topology._core_uplink_networks()

      self.assertEqual(str(services4), '10.40.254.0/24')
      self.assertEqual(str(services6), 'fd42:40:254::/64')
      self.assertEqual([str(network) for network in uplinks4], ['10.40.1.0/24'])
      self.assertEqual(
        [str(network) for network in uplinks6],
        ['fd42:40:1:10::/64', 'fd42:40:1:20::/64'],
      )

  def test_topology_core_segment_routes_derivation(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      config = {
        'segments': [
          {
            'id': 'lan_a',
            'ipv4_subnet': '10.40.10.0/24',
            'ipv6_subnet': 'fd42:40:10::/64',
            'nat': {
              'uplink_ipv4': '10.40.1.10/24',
              'uplink_ipv6': 'fd42:40:1:10::1/64',
            },
          },
          {
            'id': 'lan_b',
            'ipv4_subnet': '10.40.20.0/24',
            'ipv6_subnet': 'fd42:40:20::/64',
            'nat': {
              'uplink_ipv4': '10.40.1.20/24',
              'uplink_ipv6': 'fd42:40:1:20::1/64',
            },
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
      routes4, routes6 = topology._core_segment_routes()

      self.assertEqual(
        [(str(network), str(gateway)) for network, gateway in routes4],
        [('10.40.10.0/24', '10.40.1.10'), ('10.40.20.0/24', '10.40.1.20')],
      )
      self.assertEqual(
        [(str(network), str(gateway)) for network, gateway in routes6],
        [('fd42:40:10::/64', 'fd42:40:1:10::1'), ('fd42:40:20::/64', 'fd42:40:1:20::1')],
      )

  def test_configure_service_adds_segment_routes_via_uplink_gateways(self):
    class FakeNode:
      name = 'svc_https'

      def __init__(self):
        self.commands: list[str] = []

      def intfNames(self):
        return ['lo', 'eth0', 'svc_https-eth0']

      def cmd(self, command: str):
        self.commands.append(command)
        return ''

    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = ChaosTopology(
        config={
          'core_services': {
            'subnet_ipv4': '10.40.254.0/24',
            'subnet_ipv6': 'fd42:40:254::/64',
          },
          'segments': [
            {
              'id': 'lan_a',
              'ipv4_subnet': '10.40.10.0/24',
              'ipv6_subnet': 'fd42:40:10::/64',
              'nat': {
                'uplink_ipv4': '10.40.1.10/24',
                'uplink_ipv6': 'fd42:40:1:10::1/64',
              },
            },
          ],
        },
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='dry-run',
        logger=lambda *_: None,
      )

      node = FakeNode()
      record = ServiceRecord(
        name='svc_https',
        host='demos.peercompute.test',
        ipv4='10.40.254.10',
        ipv6='fd42:40:254::10',
        node=node,
      )
      topology._service_start_spec = lambda _record, _key: None

      topology._configure_service(record, 'https')
      joined = '\n'.join(node.commands)
      self.assertIn('dev svc_https-eth0', joined)
      self.assertIn('ip link set dev svc_https-eth0 up', joined)
      self.assertIn(
        'ip route replace 10.40.10.0/24 via 10.40.1.10 dev svc_https-eth0 onlink',
        joined,
      )
      self.assertIn(
        'ip -6 route replace fd42:40:10::/64 via fd42:40:1:10::1 dev svc_https-eth0 onlink',
        joined,
      )

  def test_https_service_spec_includes_host_and_ip_site_targets(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = ChaosTopology(
        config={},
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='dry-run',
        logger=lambda *_: None,
      )
      record = ServiceRecord(
        name='svc_https',
        host='demos.peercompute.test',
        ipv4='10.40.254.10',
        ipv6='fd42:40:254::10',
      )
      spec = topology._service_start_spec(record, 'https')
      self.assertIsNotNone(spec)
      command = str(spec.get('command'))
      self.assertIn('https://demos.peercompute.test, https://10.40.254.10, https://[fd42:40:254::10]', command)
      self.assertIn('openssl req -x509 -newkey rsa:2048', command)
      self.assertIn('tls /tmp/chaoslab-https.crt /tmp/chaoslab-https.key', command)
      ready_checks = spec.get('ready_checks')
      self.assertIsInstance(ready_checks, list)
      self.assertTrue(any('--resolve' in str(check) for check in ready_checks))
      self.assertTrue(any('https://10.40.254.10/netviz/' in str(check) for check in ready_checks))
      self.assertTrue(any('curl -6 -k -sS' in str(check) for check in ready_checks))
      self.assertTrue(any('https://[fd42:40:254::10]/netviz/' in str(check) for check in ready_checks))

  def test_relay_service_spec_writes_local_wss_relay_config(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = ChaosTopology(
        config={},
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='dry-run',
        logger=lambda *_: None,
      )
      record = ServiceRecord(
        name='svc_relay',
        host='relay.peercompute.test',
        ipv4='10.40.254.20',
        ipv6='fd42:40:254::20',
      )
      spec = topology._service_start_spec(record, 'relay')
      self.assertIsNotNone(spec)
      command = str(spec.get('command'))
      self.assertIn('RELAY_PUBLIC_PROTOCOL=wss', command)
      self.assertIn('RELAY_SSL_CERT=/tmp/chaoslab-relay.crt', command)
      self.assertIn('RELAY_SSL_KEY=/tmp/chaoslab-relay.key', command)
      self.assertIn('RELAY_WEBRTC_CONFIG=', command)
      self.assertIn('stun:turn.peercompute.test:3478', command)
      self.assertIn('turn:turn.peercompute.test:3478?transport=udp', command)
      self.assertIn('RELAY_CONFIG_FILE=/workspace/docs/netviz/relay-config.json', command)
      self.assertIn('RELAY_PUBLIC_HOST=relay.peercompute.test', command)
      self.assertIn('openssl req -x509 -newkey rsa:2048', command)
      ready_checks = spec.get('ready_checks')
      self.assertIsInstance(ready_checks, list)
      self.assertTrue(any('/wss/' in str(check) for check in ready_checks))
      self.assertTrue(any('relay.peercompute.test' in str(check) for check in ready_checks))
      self.assertTrue(any('turn.peercompute.test' in str(check) for check in ready_checks))
      self.assertTrue(any('"iceServers"' in str(check) for check in ready_checks))

  def test_relay_service_spec_uses_custom_turn_host_for_webrtc_config(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = ChaosTopology(
        config={
          'core_services': {
            'turn': {
              'host': 'turn-custom.peercompute.test',
            },
          },
        },
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='dry-run',
        logger=lambda *_: None,
      )
      record = ServiceRecord(
        name='svc_relay',
        host='relay.peercompute.test',
        ipv4='10.40.254.20',
        ipv6='fd42:40:254::20',
      )
      spec = topology._service_start_spec(record, 'relay')
      self.assertIsNotNone(spec)
      command = str(spec.get('command'))
      self.assertIn('stun:turn-custom.peercompute.test:3478', command)
      self.assertIn('turn:turn-custom.peercompute.test:3478?transport=tcp', command)

  def test_wait_for_service_health_honors_ready_checks(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = ChaosTopology(
        config={},
        repo_root=root,
        artifacts_dir=root / 'artifacts',
        mode='dry-run',
        logger=lambda *_: None,
      )
      topology._service_health_cfg = {
        'timeout_seconds': 2,
        'poll_interval_seconds': 0,
      }
      record = ServiceRecord(
        name='svc_https',
        host='demos.peercompute.test',
        ipv4='10.40.254.10',
        ipv6=None,
        node=object(),
      )
      spec = {
        'pid_file': '/tmp/https.pid',
        'log_file': '/tmp/https.log',
        'tcp_port': 443,
        'ready_checks': ['echo ready-check'],
      }

      scripted: list[tuple[int, str, str]] = [
        (0, '', ''),  # alive
        (0, '', ''),  # tcp 127.0.0.1
        (0, '', ''),  # tcp 10.40.254.10
        (1, 'tls not ready', ''),  # ready-check fails first loop
        (0, '', ''),  # alive (retry)
        (0, '', ''),  # tcp 127.0.0.1
        (0, '', ''),  # tcp 10.40.254.10
        (0, '', ''),  # ready-check succeeds
      ]
      seen_scripts: list[str] = []

      def fake_exec(_node, script: str):
        seen_scripts.append(script)
        if scripted:
          return scripted.pop(0)
        return 0, '', ''

      topology._exec_node_shell = fake_exec  # type: ignore[assignment]
      topology._wait_for_service_health(record, 'https', spec)
      self.assertTrue(any('echo ready-check' in script for script in seen_scripts))

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
      self.assertEqual(summary['preflight_probe_count'], 0)
      self.assertAlmostEqual(summary['preflight_success_rate'], 0.0)
      self.assertAlmostEqual(summary['infra_failure_rate'], 0.0)

  def test_metrics_summary_tracks_preflight_and_infra_failures(self):
    with tempfile.TemporaryDirectory() as tmp:
      store = MetricsStore(artifacts_dir=Path(tmp), run_id='preflight-run')
      store.record('probe_result', {
        'ok': False,
        'infra_failure': True,
        'network_preflight': {
          'ok': False,
          'dns_ok': False,
          'https_ok': False,
          'hosts_entry_ok': False,
        },
      })
      store.record('probe_result', {
        'ok': True,
        'infra_failure': False,
        'network_preflight': {
          'ok': True,
          'dns_ok': True,
          'https_ok': True,
          'hosts_entry_ok': True,
        },
      })
      summary = store.build_summary()
      self.assertEqual(summary['probe_total'], 2)
      self.assertEqual(summary['preflight_probe_count'], 2)
      self.assertAlmostEqual(summary['preflight_success_rate'], 0.5)
      self.assertAlmostEqual(summary['preflight_dns_success_rate'], 0.5)
      self.assertAlmostEqual(summary['preflight_https_success_rate'], 0.5)
      self.assertAlmostEqual(summary['preflight_hosts_entry_rate'], 0.5)
      self.assertAlmostEqual(summary['infra_failure_rate'], 0.5)

  def test_harness_uses_workspace_probe_script_for_containernet(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = FakeProbeTopology()
      metrics = MetricsStore(artifacts_dir=root / 'artifacts', run_id='harness-run')
      harness = ChaosHarness(
        repo_root=root,
        topology=topology,
        metrics=metrics,
        artifacts_dir=root / 'artifacts',
        logger=lambda *_: None,
      )

      result = harness._probe_one(
        agent_name='agent-01',
        url='https://demos.peercompute.test/netviz/',
        min_peers=1,
        wait_ms=1000,
        mode='netviz',
        media=False,
      )

      node_commands = [cmd for cmd in topology.commands if cmd and cmd[0] == 'node']
      self.assertTrue(node_commands)
      self.assertEqual(node_commands[0][1], '/workspace/net-chaos-lab/agent/probe.mjs')
      self.assertEqual(result['probe_execution'], 'agent')
      self.assertFalse(result['infra_failure'])
      self.assertEqual(result['peer_count'], 2)
      self.assertIsInstance(result.get('network_preflight'), dict)

  def test_harness_passes_simulation_args_to_probe(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = FakeProbeTopology()
      metrics = MetricsStore(artifacts_dir=root / 'artifacts', run_id='harness-sim-run')
      harness = ChaosHarness(
        repo_root=root,
        topology=topology,
        metrics=metrics,
        artifacts_dir=root / 'artifacts',
        logger=lambda *_: None,
      )

      result = harness._probe_one(
        agent_name='agent-01',
        url='https://demos.peercompute.test/cubechat/?e2e=1',
        min_peers=1,
        wait_ms=1000,
        mode='peercompute',
        media=False,
        simulate_profile='cubechat',
        simulate_ms=2400,
      )

      node_commands = [cmd for cmd in topology.commands if cmd and cmd[0] == 'node']
      self.assertTrue(node_commands)
      node_cmd = node_commands[0]
      self.assertIn('--simulateProfile', node_cmd)
      self.assertIn('cubechat', node_cmd)
      self.assertIn('--simulateMs', node_cmd)
      self.assertIn('2400', node_cmd)
      self.assertEqual(result['probe_execution'], 'agent')

  def test_harness_in_agent_failure_includes_diagnostic_tail(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = FakeProbeFailureTopology()
      metrics = MetricsStore(artifacts_dir=root / 'artifacts', run_id='harness-fail-run')
      harness = ChaosHarness(
        repo_root=root,
        topology=topology,
        metrics=metrics,
        artifacts_dir=root / 'artifacts',
        logger=lambda *_: None,
      )

      result = harness._probe_one(
        agent_name='agent-01',
        url='https://demos.peercompute.test/netviz/',
        min_peers=1,
        wait_ms=1000,
        mode='netviz',
        media=False,
      )

      self.assertFalse(result['ok'])
      self.assertTrue(result['infra_failure'])
      self.assertEqual(result['probe_execution'], 'agent')
      self.assertTrue(str(result['url']).startswith('https://demos.peercompute.test/netviz/?'))
      self.assertIn('in-agent probe failed (rc=1)', str(result.get('error')))
      self.assertIn('Diagnostic tail', str(result.get('error')))
      self.assertIn('playwright chromium launch failed', str(result.get('error')))

  def test_harness_nonzero_in_agent_probe_with_json_stays_functional_failure(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = FakeProbeNonZeroJsonTopology()
      metrics = MetricsStore(artifacts_dir=root / 'artifacts', run_id='harness-json-fail-run')
      harness = ChaosHarness(
        repo_root=root,
        topology=topology,
        metrics=metrics,
        artifacts_dir=root / 'artifacts',
        logger=lambda *_: None,
      )

      result = harness._probe_one(
        agent_name='agent-01',
        url='https://demos.peercompute.test/netviz/',
        min_peers=1,
        wait_ms=1000,
        mode='netviz',
        media=False,
      )

      self.assertFalse(result['ok'])
      self.assertFalse(result['infra_failure'])
      self.assertEqual(result['probe_execution'], 'agent')
      self.assertEqual(result['exit_code'], 1)
      self.assertEqual(result['peer_count'], 0)
      self.assertIsInstance(result.get('network_preflight'), dict)
      self.assertTrue(result['network_preflight'].get('ok'))
      self.assertIn('in-agent probe exited with rc=1', str(result.get('error')))

  def test_harness_uses_ip_fallback_url_when_preflight_dns_fails(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = FakePreflightFallbackTopology()
      metrics = MetricsStore(artifacts_dir=root / 'artifacts', run_id='fallback-run')
      harness = ChaosHarness(
        repo_root=root,
        topology=topology,
        metrics=metrics,
        artifacts_dir=root / 'artifacts',
        logger=lambda *_: None,
      )

      result = harness._probe_one(
        agent_name='agent-01',
        url='https://demos.peercompute.test/netviz/',
        min_peers=1,
        wait_ms=1000,
        mode='netviz',
        media=False,
      )

      node_commands = [cmd for cmd in topology.commands if cmd and cmd[0] == 'node']
      self.assertTrue(node_commands)
      self.assertTrue(node_commands[0][3].startswith('https://10.40.254.10/netviz/?'))
      fallback_query = parse_qs(urlparse(node_commands[0][3]).query)
      self.assertEqual(fallback_query.get('autoConnect'), ['1'])
      self.assertEqual(fallback_query.get('room'), ['telemetry'])
      self.assertEqual(fallback_query.get('topologyId'), ['netviz-topology'])
      self.assertTrue(result['ok'])
      self.assertTrue(str(result['url']).startswith('https://10.40.254.10/netviz/?'))
      self.assertTrue(result['infra_failure'])
      self.assertIsInstance(result.get('network_preflight'), dict)
      self.assertTrue(result['network_preflight'].get('fallback_https_ok'))

  def test_harness_prefers_ipv6_literal_url_in_ipv6_only_mode(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      topology = FakeIpv6PreferredUrlTopology()
      metrics = MetricsStore(artifacts_dir=root / 'artifacts', run_id='ipv6-preferred-run')
      harness = ChaosHarness(
        repo_root=root,
        topology=topology,
        metrics=metrics,
        artifacts_dir=root / 'artifacts',
        logger=lambda *_: None,
      )

      result = harness._probe_one(
        agent_name='agent-01',
        url='https://demos.peercompute.test/netviz/',
        min_peers=1,
        wait_ms=1000,
        mode='netviz',
        media=False,
      )

      node_commands = [cmd for cmd in topology.commands if cmd and cmd[0] == 'node']
      self.assertTrue(node_commands)
      self.assertTrue(node_commands[0][3].startswith('https://[fd42:40:254::10]/netviz/?'))
      self.assertTrue(str(result['url']).startswith('https://[fd42:40:254::10]/netviz/?'))
      self.assertIsInstance(result.get('network_preflight'), dict)
      self.assertEqual(result['network_preflight'].get('service_ip'), 'fd42:40:254::10')
      self.assertTrue(str(result['network_preflight'].get('preferred_url')).startswith('https://[fd42:40:254::10]/netviz/?'))
      self.assertFalse(result['infra_failure'])

  def test_harness_marks_https_preflight_timeout_as_hard_failure(self):
    self.assertTrue(ChaosHarness._is_preflight_hard_failure({
      'probe_script_ok': True,
      'error': 'https preflight failed (no HTTP status) (curl_rc=28, fallback_curl_rc=28)',
    }))

  def test_harness_keeps_dns_preflight_failure_soft_for_fallback(self):
    self.assertFalse(ChaosHarness._is_preflight_hard_failure({
      'probe_script_ok': True,
      'error': 'dns resolution failed for demos.peercompute.test (dns_rc=2, hosts_rc=1)',
    }))

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

  def test_ensure_netviz_docs_bundle_builds_when_stale(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      (root / 'demos/netviz/src').mkdir(parents=True, exist_ok=True)
      (root / 'demos/netviz/public').mkdir(parents=True, exist_ok=True)
      (root / 'docs/netviz/assets').mkdir(parents=True, exist_ok=True)
      (root / 'demos/netviz/index.html').write_text('<html></html>\n', encoding='utf-8')
      (root / 'demos/netviz/src/main.js').write_text('console.log("src");\n', encoding='utf-8')
      (root / 'demos/netviz/src/relayConfig.js').write_text('export {};\n', encoding='utf-8')
      (root / 'demos/netviz/src/visualizer.js').write_text('export {};\n', encoding='utf-8')
      (root / 'demos/netviz/public/relay-config.json').write_text('{}\n', encoding='utf-8')
      (root / 'demos/netviz/vite.config.js').write_text('export default {};\n', encoding='utf-8')
      (root / 'docs/netviz/index.html').write_text('<html>old</html>\n', encoding='utf-8')
      bundle = root / 'docs/netviz/assets/index-old.js'
      bundle.write_text('old bundle\n', encoding='utf-8')

      # Ensure source files are newer than docs bundle.
      src_file = root / 'demos/netviz/src/main.js'
      now = time.time()
      os.utime(src_file, (now, now))
      stale_time = now - 120.0
      os.utime(bundle, (stale_time, stale_time))

      fake_proc = subprocess.CompletedProcess(args=['npm'], returncode=0, stdout='ok', stderr='')
      logs: list[str] = []
      with mock.patch('chaoslab.main.subprocess.run', return_value=fake_proc) as run_mock:
        _ensure_netviz_docs_bundle(root, logger=logs.append)

      self.assertTrue(any('building NetViz docs bundle' in line for line in logs))
      self.assertTrue(run_mock.called)
      command = run_mock.call_args.args[0]
      self.assertEqual(command[:4], ['npm', '--prefix', str(root / 'demos' / 'netviz'), 'run'])
      self.assertEqual(command[4], 'build')

  def test_ensure_netviz_docs_bundle_skips_when_fresh(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = Path(tmp)
      (root / 'demos/netviz/src').mkdir(parents=True, exist_ok=True)
      (root / 'demos/netviz/public').mkdir(parents=True, exist_ok=True)
      (root / 'docs/netviz/assets').mkdir(parents=True, exist_ok=True)
      (root / 'demos/netviz/index.html').write_text('<html></html>\n', encoding='utf-8')
      (root / 'demos/netviz/src/main.js').write_text('console.log("src");\n', encoding='utf-8')
      (root / 'demos/netviz/src/relayConfig.js').write_text('export {};\n', encoding='utf-8')
      (root / 'demos/netviz/src/visualizer.js').write_text('export {};\n', encoding='utf-8')
      (root / 'demos/netviz/public/relay-config.json').write_text('{}\n', encoding='utf-8')
      (root / 'demos/netviz/vite.config.js').write_text('export default {};\n', encoding='utf-8')
      (root / 'docs/netviz/index.html').write_text('<html>fresh</html>\n', encoding='utf-8')
      bundle = root / 'docs/netviz/assets/index-fresh.js'
      bundle.write_text('fresh bundle\n', encoding='utf-8')

      # Ensure docs bundle is newer than sources.
      fresh_time = bundle.stat().st_mtime + 120.0
      os.utime(bundle, (fresh_time, fresh_time))

      logs: list[str] = []
      with mock.patch('chaoslab.main.subprocess.run') as run_mock:
        _ensure_netviz_docs_bundle(root, logger=logs.append)
      self.assertFalse(run_mock.called)
      self.assertTrue(any('NetViz docs bundle is up to date.' in line for line in logs))


if __name__ == '__main__':
  unittest.main()
