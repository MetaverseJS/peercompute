from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import json
from typing import Any


class ConfigError(RuntimeError):
  pass


@dataclass
class LoadedConfig:
  path: Path
  data: dict[str, Any]


def _load_yaml(path: Path) -> dict[str, Any]:
  try:
    import yaml  # type: ignore
  except ModuleNotFoundError as exc:
    raise ConfigError(
      f'YAML config requested but PyYAML is missing ({path}). Install net-chaos-lab/requirements.txt.'
    ) from exc

  with path.open('r', encoding='utf-8') as handle:
    payload = yaml.safe_load(handle) or {}
  if not isinstance(payload, dict):
    raise ConfigError(f'Config file must parse to an object: {path}')
  return payload


def _load_json(path: Path) -> dict[str, Any]:
  with path.open('r', encoding='utf-8') as handle:
    payload = json.load(handle)
  if not isinstance(payload, dict):
    raise ConfigError(f'Config file must parse to an object: {path}')
  return payload


def load_structured_config(path_like: str | Path) -> LoadedConfig:
  path = Path(path_like).expanduser().resolve()
  if not path.exists():
    raise ConfigError(f'Config not found: {path}')

  suffix = path.suffix.lower()
  if suffix in {'.yaml', '.yml'}:
    data = _load_yaml(path)
  elif suffix == '.json':
    data = _load_json(path)
  else:
    try:
      data = _load_yaml(path)
    except ConfigError:
      data = _load_json(path)

  return LoadedConfig(path=path, data=data)


def _deep_merge(base: dict[str, Any], override: dict[str, Any]) -> dict[str, Any]:
  merged: dict[str, Any] = dict(base)
  for key, value in override.items():
    if isinstance(value, dict) and isinstance(merged.get(key), dict):
      merged[key] = _deep_merge(merged[key], value)
    else:
      merged[key] = value
  return merged


def load_topology_config(path_like: str | Path) -> LoadedConfig:
  loaded = load_structured_config(path_like)
  defaults: dict[str, Any] = {
    'network': {
      'name': 'peercompute-chaos-lab',
      'dual_stack': True,
      'core_switch': 'core',
    },
    'agents': {
      'count': 10,
      'image': 'peercompute/net-chaos-lab-node:latest',
      'command': 'sleep infinity',
      'media_enabled': False,
    },
    'segments': [],
    'links': {
      'defaults': {
        'bw_mbit': 100,
        'delay_ms': 5,
        'loss_pct': 0,
      },
      'overrides': [],
    },
    'harness': {
      'default_demo': 'netviz',
      'default_url': 'https://demos.peercompute.test/netviz/',
      'min_expected_peers': 2,
      'probe_duration_ms': 30000,
    },
  }
  merged = _deep_merge(defaults, loaded.data)

  segments = merged.get('segments')
  if not isinstance(segments, list) or not segments:
    raise ConfigError('Topology config requires at least one segment in `segments`')

  agent_count = int(merged.get('agents', {}).get('count', 0))
  if agent_count < 1:
    raise ConfigError('Topology config requires agents.count >= 1')

  return LoadedConfig(path=loaded.path, data=merged)


def load_scenario_config(path_like: str | Path) -> LoadedConfig:
  loaded = load_structured_config(path_like)
  defaults: dict[str, Any] = {
    'name': 'default-chaos',
    'settle_seconds': 10,
    'stages': [],
  }
  merged = _deep_merge(defaults, loaded.data)
  stages = merged.get('stages', [])
  if not isinstance(stages, list):
    raise ConfigError('Scenario config `stages` must be an array')

  normalized: list[dict[str, Any]] = []
  for index, stage in enumerate(stages):
    if not isinstance(stage, dict):
      raise ConfigError(f'Stage #{index} is not an object')
    if 'type' not in stage:
      raise ConfigError(f'Stage #{index} missing required `type`')
    stage = dict(stage)
    stage.setdefault('at_seconds', 0)
    stage['at_seconds'] = float(stage.get('at_seconds', 0))
    normalized.append(stage)

  normalized.sort(key=lambda item: float(item.get('at_seconds', 0)))
  merged['stages'] = normalized
  return LoadedConfig(path=loaded.path, data=merged)
