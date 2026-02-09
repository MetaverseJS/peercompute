from __future__ import annotations

import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import threading
from typing import Any

from .config import ConfigError, load_scenario_config, load_topology_config
from .dashboard import create_dashboard_server
from .harness import ChaosHarness
from .matrix import MatrixError, evaluate_gates, load_matrix_config, write_matrix_summary
from .metrics import MetricsStore
from .scenario import ScenarioRunner
from .topology import ChaosTopology, TopologyError


def default_run_id() -> str:
  now = datetime.now(timezone.utc)
  return now.strftime('%Y%m%dT%H%M%SZ')


def repo_root() -> Path:
  return Path(__file__).resolve().parents[3]


def parse_args() -> argparse.Namespace:
  root = repo_root()
  parser = argparse.ArgumentParser(description='PeerCompute network chaos-lab runner')

  parser.add_argument(
    '--topology',
    default=str(root / 'net-chaos-lab' / 'configs' / 'topology.default.yaml'),
    help='Path to topology yaml/json config',
  )
  parser.add_argument(
    '--scenario',
    default=str(root / 'net-chaos-lab' / 'configs' / 'scenarios' / 'default-chaos.yaml'),
    help='Path to scenario yaml/json config',
  )
  parser.add_argument('--mode', default='auto', choices=['auto', 'containernet', 'dry-run'])
  parser.add_argument('--agents', type=int, default=0, help='Override number of browser agents (1-50)')

  parser.add_argument('--run-id', default='', help='Override run id')
  parser.add_argument(
    '--artifacts-root',
    default=str(root / 'net-chaos-lab' / 'artifacts'),
    help='Root directory for artifacts/run outputs',
  )

  parser.add_argument('--demo-command', default='', help='Optional command to start a demo server')
  parser.add_argument('--demo-cwd', default='', help='Working directory for demo command')

  parser.add_argument('--url', default='', help='Probe URL override')
  parser.add_argument('--min-peers', type=int, default=0, help='Minimum peers required for probe pass')
  parser.add_argument('--wait-ms', type=int, default=0, help='Probe wait timeout override in ms')
  parser.add_argument('--probe-agents', type=int, default=0, help='How many agents to probe per cycle')
  parser.add_argument('--probe-parallelism', type=int, default=4)
  parser.add_argument('--probe-each-stage', action='store_true')
  parser.add_argument('--skip-probes', action='store_true')
  parser.add_argument('--media', action='store_true', help='Enable audio/video loopback probe')

  parser.add_argument('--skip-scenario', action='store_true')
  parser.add_argument('--time-scale', type=float, default=1.0, help='Scenario timing multiplier')

  parser.add_argument('--dashboard', dest='dashboard', action='store_true', default=True)
  parser.add_argument('--no-dashboard', dest='dashboard', action='store_false')
  parser.add_argument('--dashboard-host', default='127.0.0.1')
  parser.add_argument('--dashboard-port', type=int, default=8866)
  parser.add_argument('--matrix', default='', help='Path to matrix config to execute multiple scenario runs')
  parser.add_argument('--matrix-stop-on-fail', action='store_true', help='Stop matrix execution after first failed run/gate')

  return parser.parse_args()


def _namespace_with_updates(base: argparse.Namespace, updates: dict[str, Any]) -> argparse.Namespace:
  payload = vars(base).copy()
  payload.update(updates)
  return argparse.Namespace(**payload)


def _coerce_bool(value: Any, fallback: bool = False) -> bool:
  if isinstance(value, bool):
    return value
  if value is None:
    return fallback
  text = str(value).strip().lower()
  if text in {'1', 'true', 'yes', 'on'}:
    return True
  if text in {'0', 'false', 'no', 'off'}:
    return False
  return fallback


def _write_topology_state(
  path: Path,
  run_id: str,
  topology: ChaosTopology,
  latest_stage: dict[str, Any] | None = None,
) -> None:
  payload = {
    'run_id': run_id,
    'updated_at': datetime.now(timezone.utc).isoformat(),
    'topology': topology.get_state_snapshot(),
    'latest_stage': latest_stage or None,
  }
  path.write_text(json.dumps(payload, ensure_ascii=True, indent=2), encoding='utf-8')


def run_single(args: argparse.Namespace) -> tuple[int, dict[str, Any], Path]:
  root = repo_root()
  run_id = str(args.run_id or '').strip() or default_run_id()
  artifacts_root = Path(args.artifacts_root).expanduser().resolve()
  run_dir = artifacts_root / run_id
  run_dir.mkdir(parents=True, exist_ok=True)
  topology_state_path = run_dir / 'chaos-topology.json'

  metrics = MetricsStore(artifacts_dir=run_dir, run_id=run_id)
  metrics.record(
    'run_started',
    {
      'run_id': run_id,
      'topology_config': str(args.topology),
      'scenario_config': str(args.scenario),
      'mode': args.mode,
    },
  )
  metrics.build_summary()

  try:
    topology_loaded = load_topology_config(args.topology)
    scenario_loaded = load_scenario_config(args.scenario)
  except ConfigError as exc:
    metrics.record('run_failed', {'error': f'config: {exc}'})
    summary = metrics.build_summary()
    print(f'[chaos-lab] config error: {exc}')
    print('[chaos-lab] summary:')
    print(json.dumps(summary, indent=2))
    print(f'[chaos-lab] artifacts: {run_dir}')
    return 2, summary, run_dir

  topology_cfg = dict(topology_loaded.data)
  if args.agents:
    topology_cfg.setdefault('agents', {})
    topology_cfg['agents']['count'] = max(1, min(50, int(args.agents)))

  topology = ChaosTopology(
    config=topology_cfg,
    repo_root=root,
    artifacts_dir=run_dir,
    mode=args.mode,
    logger=print,
  )
  harness = ChaosHarness(
    repo_root=root,
    topology=topology,
    metrics=metrics,
    artifacts_dir=run_dir,
    logger=print,
  )

  latest_stage: dict[str, Any] | None = None
  dashboard_server = None
  dashboard_thread: threading.Thread | None = None
  if args.dashboard:
    try:
      dashboard_server = create_dashboard_server(
        host=args.dashboard_host,
        port=int(args.dashboard_port),
        summary_path=metrics.paths.summary_json,
        events_path=metrics.paths.events_jsonl,
        static_dir=root / 'net-chaos-lab' / 'dashboard',
        topology_path=topology_state_path,
      )
      print(f'[dashboard] listening on http://{args.dashboard_host}:{int(args.dashboard_port)}')
      dashboard_thread = threading.Thread(
        target=dashboard_server.serve_forever,
        daemon=True,
        name='chaoslab-dashboard',
      )
      dashboard_thread.start()
    except OSError as exc:
      print(f'[chaos-lab] dashboard unavailable: {exc}')
      metrics.record('dashboard_start_failed', {'error': str(exc)})

  harness_cfg = topology_cfg.get('harness', {})
  probe_url = str(args.url or harness_cfg.get('default_url') or 'https://demos.peercompute.test/netviz/')
  min_peers = int(args.min_peers or harness_cfg.get('min_expected_peers') or 2)
  wait_ms = int(args.wait_ms or harness_cfg.get('probe_duration_ms') or 30000)
  probe_agents = int(args.probe_agents or 0)
  probe_parallelism = max(1, int(args.probe_parallelism or 4))

  def run_probe_checkpoint(label: str) -> list[dict[str, Any]]:
    results = harness.run_probe_cycle(
      url=probe_url,
      min_peers=min_peers,
      wait_ms=wait_ms,
      mode=str(harness_cfg.get('default_demo') or 'netviz'),
      media=bool(args.media),
      limit_agents=probe_agents,
      parallelism=probe_parallelism,
    )
    metrics.record('probe_checkpoint', {'label': label, 'results': len(results)})
    metrics.build_summary()
    return results

  exit_code = 0
  summary: dict[str, Any] = {}
  try:
    topology.start()
    _write_topology_state(topology_state_path, run_id, topology, latest_stage=None)
    metrics.record(
      'topology_started',
      {
        'actual_mode': topology.actual_mode,
        'agent_count': len(topology.list_agents()),
        'service_count': len(topology.list_services()),
      },
    )

    if args.demo_command:
      demo_cwd = Path(args.demo_cwd).expanduser().resolve() if args.demo_cwd else root
      harness.start_demo(args.demo_command, cwd=demo_cwd)

    if not args.skip_probes:
      run_probe_checkpoint('initial')

    if not args.skip_scenario:
      def stage_callback(outcome: dict[str, Any]) -> None:
        nonlocal latest_stage
        latest_stage = dict(outcome)
        _write_topology_state(topology_state_path, run_id, topology, latest_stage=latest_stage)
        if args.skip_probes:
          return
        if not args.probe_each_stage:
          return
        phase = str(outcome.get('phase') or 'stage')
        index = int(outcome.get('stage_index') or 0)
        run_probe_checkpoint(f'{phase}-{index}')

      runner = ScenarioRunner(
        topology=topology,
        metrics=metrics,
        logger=print,
        time_scale=float(args.time_scale),
        on_stage_result=stage_callback,
      )
      runner.run(scenario_loaded.data)

    if not args.skip_probes:
      run_probe_checkpoint('final')

  except (TopologyError, RuntimeError, ValueError) as exc:
    exit_code = 1
    metrics.record('run_failed', {'error': str(exc)})
    print(f'[chaos-lab] failure: {exc}')
  except KeyboardInterrupt:
    exit_code = 130
    metrics.record('run_interrupted', {'reason': 'keyboard-interrupt'})
    print('[chaos-lab] interrupted')
  finally:
    try:
      _write_topology_state(topology_state_path, run_id, topology, latest_stage=latest_stage)
    except Exception:
      pass
    harness.stop_demo()
    topology.stop()
    if dashboard_server is not None:
      try:
        dashboard_server.shutdown()
      except Exception:
        pass
      try:
        dashboard_server.server_close()
      except Exception:
        pass
      if dashboard_thread is not None:
        dashboard_thread.join(timeout=2.0)
    summary = metrics.build_summary()
    print('[chaos-lab] summary:')
    print(json.dumps(summary, indent=2))
    print(f'[chaos-lab] artifacts: {run_dir}')

  return exit_code, summary, run_dir


def _matrix_value(
  run_spec: Any,
  defaults: dict[str, Any],
  key: str,
  fallback: Any,
) -> Any:
  if key in run_spec.overrides:
    return run_spec.overrides[key]
  if key in defaults:
    return defaults[key]
  return fallback


def run_matrix(args: argparse.Namespace) -> int:
  root = repo_root()
  matrix_path = str(args.matrix or '').strip()
  if not matrix_path:
    print('[chaos-lab] matrix error: missing --matrix path')
    return 2

  try:
    matrix_cfg = load_matrix_config(matrix_path, root)
  except MatrixError as exc:
    print(f'[chaos-lab] matrix config error: {exc}')
    return 2

  matrix_run_id = str(args.run_id or '').strip() or default_run_id()
  artifacts_root = Path(args.artifacts_root).expanduser().resolve()
  matrix_dir = artifacts_root / matrix_run_id
  runs_root = matrix_dir / 'runs'
  runs_root.mkdir(parents=True, exist_ok=True)

  print(
    f'[chaos-lab] matrix start: {matrix_cfg.name} '
    f'({len(matrix_cfg.runs)} runs) config={matrix_cfg.path}'
  )

  results: list[dict[str, Any]] = []
  overall_exit = 0

  for index, run_spec in enumerate(matrix_cfg.runs):
    child_run_id = f'{matrix_run_id}-{run_spec.id}'
    defaults = matrix_cfg.defaults
    updates: dict[str, Any] = {
      'run_id': child_run_id,
      'artifacts_root': str(runs_root),
      'scenario': run_spec.scenario,
      'topology': run_spec.topology or _matrix_value(run_spec, defaults, 'topology', args.topology),
      'mode': str(_matrix_value(run_spec, defaults, 'mode', args.mode)),
      'agents': int(_matrix_value(run_spec, defaults, 'agents', args.agents)),
      'demo_command': str(_matrix_value(run_spec, defaults, 'demo_command', args.demo_command)),
      'demo_cwd': str(_matrix_value(run_spec, defaults, 'demo_cwd', args.demo_cwd)),
      'url': str(_matrix_value(run_spec, defaults, 'url', args.url)),
      'min_peers': int(_matrix_value(run_spec, defaults, 'min_peers', args.min_peers)),
      'wait_ms': int(_matrix_value(run_spec, defaults, 'wait_ms', args.wait_ms)),
      'probe_agents': int(_matrix_value(run_spec, defaults, 'probe_agents', args.probe_agents)),
      'probe_parallelism': int(
        _matrix_value(run_spec, defaults, 'probe_parallelism', args.probe_parallelism)
      ),
      'probe_each_stage': _coerce_bool(
        _matrix_value(run_spec, defaults, 'probe_each_stage', args.probe_each_stage),
        fallback=bool(args.probe_each_stage),
      ),
      'skip_probes': _coerce_bool(
        _matrix_value(run_spec, defaults, 'skip_probes', args.skip_probes),
        fallback=bool(args.skip_probes),
      ),
      'media': _coerce_bool(
        _matrix_value(run_spec, defaults, 'media', args.media),
        fallback=bool(args.media),
      ),
      'skip_scenario': _coerce_bool(
        _matrix_value(run_spec, defaults, 'skip_scenario', args.skip_scenario),
        fallback=bool(args.skip_scenario),
      ),
      'time_scale': float(_matrix_value(run_spec, defaults, 'time_scale', args.time_scale)),
      'dashboard': _coerce_bool(
        _matrix_value(run_spec, defaults, 'dashboard', args.dashboard),
        fallback=bool(args.dashboard),
      ),
    }
    child_args = _namespace_with_updates(args, updates)

    print(
      f'[chaos-lab] matrix run {index + 1}/{len(matrix_cfg.runs)}: '
      f'{run_spec.id} scenario={child_args.scenario}'
    )
    exit_code, summary, run_dir = run_single(child_args)
    gates_ok, gate_results = evaluate_gates(summary, run_spec.gates)
    run_ok = exit_code == 0 and gates_ok
    if not run_ok:
      overall_exit = 1

    if gate_results:
      gate_passed = sum(1 for gate in gate_results if gate.get('passed'))
      print(
        f'[chaos-lab] matrix gates for {run_spec.id}: '
        f'{gate_passed}/{len(gate_results)} passed'
      )
      for gate in gate_results:
        status = 'PASS' if gate.get('passed') else 'FAIL'
        required = 'required' if gate.get('required') else 'optional'
        metric = gate.get('metric')
        actual = gate.get('actual')
        op = gate.get('op')
        expected = gate.get('expected')
        reason = str(gate.get('reason') or '').strip()
        reason_text = f' ({reason})' if reason else ''
        print(
          f'[chaos-lab]  - {status} [{required}] '
          f'{metric} {op} {expected} actual={actual}{reason_text}'
        )

    results.append({
      'id': run_spec.id,
      'run_id': child_run_id,
      'scenario': child_args.scenario,
      'topology': child_args.topology,
      'exit_code': exit_code,
      'gates_passed': gates_ok,
      'run_passed': run_ok,
      'gates': gate_results,
      'summary': summary,
      'artifacts_dir': str(run_dir),
      'summary_path': str(run_dir / 'metrics-summary.json'),
      'events_path': str(run_dir / 'metrics-events.jsonl'),
    })

    if args.matrix_stop_on_fail and not run_ok:
      print(f'[chaos-lab] matrix stop-on-fail triggered by run: {run_spec.id}')
      break

  passed_runs = sum(1 for result in results if result.get('run_passed'))
  matrix_summary = {
    'matrix_name': matrix_cfg.name,
    'matrix_config': str(matrix_cfg.path),
    'matrix_run_id': matrix_run_id,
    'run_total': len(results),
    'run_passed': passed_runs,
    'run_failed': len(results) - passed_runs,
    'all_passed': passed_runs == len(results) and len(results) == len(matrix_cfg.runs),
    'results': results,
  }
  summary_path = matrix_dir / 'matrix-summary.json'
  write_matrix_summary(summary_path, matrix_summary)

  print('[chaos-lab] matrix summary:')
  print(json.dumps({
    'matrix_name': matrix_cfg.name,
    'matrix_run_id': matrix_run_id,
    'run_total': matrix_summary['run_total'],
    'run_passed': matrix_summary['run_passed'],
    'run_failed': matrix_summary['run_failed'],
    'all_passed': matrix_summary['all_passed'],
    'summary_path': str(summary_path),
  }, indent=2))

  return overall_exit


def run() -> int:
  args = parse_args()
  if str(args.matrix or '').strip():
    return run_matrix(args)
  exit_code, _, _ = run_single(args)
  return exit_code


def main() -> None:
  raise SystemExit(run())


if __name__ == '__main__':
  main()
