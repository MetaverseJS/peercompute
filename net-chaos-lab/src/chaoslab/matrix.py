from __future__ import annotations

from dataclasses import dataclass
import json
from pathlib import Path
from typing import Any

from .config import ConfigError, load_structured_config
from .metrics import utc_now_iso


class MatrixError(RuntimeError):
  pass


@dataclass
class MatrixRunSpec:
  id: str
  scenario: str
  topology: str | None
  overrides: dict[str, Any]
  gates: list[dict[str, Any]]


@dataclass
class LoadedMatrixConfig:
  path: Path
  name: str
  defaults: dict[str, Any]
  runs: list[MatrixRunSpec]


_COMPARATORS = {
  '>': lambda actual, expected: actual > expected,
  '>=': lambda actual, expected: actual >= expected,
  '<': lambda actual, expected: actual < expected,
  '<=': lambda actual, expected: actual <= expected,
  '==': lambda actual, expected: actual == expected,
  '!=': lambda actual, expected: actual != expected,
}


def _resolve_existing_path(value: Any, config_dir: Path, repo_root: Path, label: str) -> str:
  text = str(value or '').strip()
  if not text:
    raise MatrixError(f'Matrix {label} path is required')

  candidate = Path(text).expanduser()
  if candidate.is_absolute() and candidate.exists():
    return str(candidate.resolve())

  from_config = (config_dir / candidate).resolve()
  if from_config.exists():
    return str(from_config)

  from_repo = (repo_root / candidate).resolve()
  if from_repo.exists():
    return str(from_repo)

  raise MatrixError(f'Matrix {label} path not found: {text}')


def _coerce_float(value: Any, fallback: float = 0.0) -> float:
  if isinstance(value, (int, float)):
    return float(value)
  try:
    return float(str(value).strip())
  except Exception:
    return float(fallback)


def _parse_float(value: Any, label: str) -> float:
  if isinstance(value, (int, float)):
    return float(value)
  text = str(value or '').strip()
  try:
    return float(text)
  except Exception as exc:
    raise MatrixError(f'{label} must be numeric: {value!r}') from exc


def load_matrix_config(path_like: str | Path, repo_root: Path) -> LoadedMatrixConfig:
  try:
    loaded = load_structured_config(path_like)
  except ConfigError as exc:
    raise MatrixError(str(exc)) from exc

  raw = loaded.data
  name = str(raw.get('name') or loaded.path.stem)
  defaults = raw.get('defaults') or {}
  if not isinstance(defaults, dict):
    raise MatrixError('Matrix config `defaults` must be an object')

  config_dir = loaded.path.parent
  normalized_defaults = dict(defaults)
  if normalized_defaults.get('topology'):
    normalized_defaults['topology'] = _resolve_existing_path(
      normalized_defaults.get('topology'),
      config_dir,
      repo_root,
      'defaults.topology',
    )
  if normalized_defaults.get('scenario'):
    normalized_defaults['scenario'] = _resolve_existing_path(
      normalized_defaults.get('scenario'),
      config_dir,
      repo_root,
      'defaults.scenario',
    )

  runs_raw = raw.get('runs')
  if not isinstance(runs_raw, list) or not runs_raw:
    raise MatrixError('Matrix config must define a non-empty `runs` array')

  seen_ids: set[str] = set()
  runs: list[MatrixRunSpec] = []
  for index, item in enumerate(runs_raw):
    if not isinstance(item, dict):
      raise MatrixError(f'Matrix run #{index} must be an object')

    run_id = str(item.get('id') or item.get('name') or f'run-{index + 1}').strip()
    if not run_id:
      raise MatrixError(f'Matrix run #{index} must provide a non-empty id')
    if run_id in seen_ids:
      raise MatrixError(f'Matrix run id must be unique: {run_id}')
    seen_ids.add(run_id)

    scenario_value = item.get('scenario') or normalized_defaults.get('scenario')
    scenario_path = _resolve_existing_path(
      scenario_value,
      config_dir,
      repo_root,
      f'runs[{index}].scenario',
    )

    topology_value = item.get('topology') or normalized_defaults.get('topology')
    topology_path: str | None = None
    if topology_value:
      topology_path = _resolve_existing_path(
        topology_value,
        config_dir,
        repo_root,
        f'runs[{index}].topology',
      )

    gates_value = item.get('gates', normalized_defaults.get('gates', []))
    if gates_value is None:
      gates_value = []
    if not isinstance(gates_value, list):
      raise MatrixError(f'Matrix run {run_id} has invalid gates list')

    normalized_gates: list[dict[str, Any]] = []
    for gate_index, gate in enumerate(gates_value):
      if not isinstance(gate, dict):
        raise MatrixError(f'Matrix gate #{gate_index} in run {run_id} must be an object')
      metric = str(gate.get('metric') or '').strip()
      if not metric:
        raise MatrixError(f'Matrix gate #{gate_index} in run {run_id} missing metric')
      op = str(gate.get('op') or '>=').strip()
      if op not in _COMPARATORS:
        raise MatrixError(
          f'Matrix gate #{gate_index} in run {run_id} uses unsupported operator: {op}'
        )
      if 'value' not in gate:
        raise MatrixError(f'Matrix gate #{gate_index} in run {run_id} missing value')
      normalized_gates.append({
        'metric': metric,
        'op': op,
        'value': _parse_float(gate.get('value'), f'Matrix gate #{gate_index} in run {run_id} value'),
        'required': bool(gate.get('required', True)),
        'description': str(gate.get('description') or ''),
      })

    overrides: dict[str, Any] = {}
    skip_keys = {'id', 'name', 'scenario', 'topology', 'gates'}
    for key, value in item.items():
      if key in skip_keys:
        continue
      overrides[key] = value

    runs.append(
      MatrixRunSpec(
        id=run_id,
        scenario=scenario_path,
        topology=topology_path,
        overrides=overrides,
        gates=normalized_gates,
      )
    )

  return LoadedMatrixConfig(
    path=loaded.path,
    name=name,
    defaults=normalized_defaults,
    runs=runs,
  )


def evaluate_gates(summary: dict[str, Any], gates: list[dict[str, Any]]) -> tuple[bool, list[dict[str, Any]]]:
  if not gates:
    return True, []

  all_required_passed = True
  results: list[dict[str, Any]] = []
  for gate in gates:
    metric = str(gate.get('metric') or '').strip()
    op = str(gate.get('op') or '>=').strip()
    expected = _coerce_float(gate.get('value'))
    required = bool(gate.get('required', True))
    description = str(gate.get('description') or '')

    actual_raw = summary.get(metric)
    actual_value: float | None = None
    passed = False
    reason = ''

    if not metric:
      reason = 'missing metric'
    elif op not in _COMPARATORS:
      reason = f'unsupported operator {op}'
    elif isinstance(actual_raw, (int, float)):
      actual_value = float(actual_raw)
      passed = bool(_COMPARATORS[op](actual_value, expected))
    else:
      reason = f'summary metric `{metric}` is not numeric'

    if required and not passed:
      all_required_passed = False

    results.append({
      'metric': metric,
      'op': op,
      'expected': expected,
      'actual': actual_value,
      'required': required,
      'passed': passed,
      'description': description,
      'reason': reason,
    })

  return all_required_passed, results


def write_matrix_summary(path: Path, payload: dict[str, Any]) -> None:
  path.parent.mkdir(parents=True, exist_ok=True)
  data = dict(payload)
  data['updated_at'] = utc_now_iso()
  with path.open('w', encoding='utf-8') as handle:
    json.dump(data, handle, indent=2)


__all__ = [
  'MatrixError',
  'MatrixRunSpec',
  'LoadedMatrixConfig',
  'evaluate_gates',
  'load_matrix_config',
  'write_matrix_summary',
]
