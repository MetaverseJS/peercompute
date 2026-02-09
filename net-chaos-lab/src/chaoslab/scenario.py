from __future__ import annotations

from dataclasses import dataclass
import time
from typing import Any, Callable


@dataclass
class TimelineStage:
  at_seconds: float
  phase: str
  source_index: int
  stage: dict[str, Any]


class ScenarioRunner:
  def __init__(
    self,
    topology: Any,
    metrics: Any,
    logger: Any = print,
    sleep_fn: Callable[[float], None] = time.sleep,
    monotonic_fn: Callable[[], float] = time.monotonic,
    time_scale: float = 1.0,
    on_stage_result: Callable[[dict[str, Any]], None] | None = None,
  ):
    self.topology = topology
    self.metrics = metrics
    self.logger = logger
    self.sleep_fn = sleep_fn
    self.monotonic_fn = monotonic_fn
    self.time_scale = max(0.0, float(time_scale))
    self.on_stage_result = on_stage_result

  def _log(self, message: str) -> None:
    self.logger(f'[scenario] {message}')

  def run(self, scenario_cfg: dict[str, Any]) -> list[dict[str, Any]]:
    stages = scenario_cfg.get('stages') or []
    if not isinstance(stages, list):
      raise ValueError('Scenario stages must be a list')

    timeline = self._build_timeline(stages)
    results: list[dict[str, Any]] = []

    started = self.monotonic_fn()
    for entry in timeline:
      now = self.monotonic_fn()
      elapsed = now - started
      target = max(0.0, float(entry.at_seconds))
      wait_seconds = max(0.0, target - elapsed)
      scaled_wait = wait_seconds * self.time_scale
      if scaled_wait > 0:
        self.sleep_fn(scaled_wait)

      outcome = self._execute_stage(entry)
      results.append(outcome)

      self.metrics.record('scenario_event', outcome)
      if self.on_stage_result is not None:
        self.on_stage_result(outcome)

    settle = float(scenario_cfg.get('settle_seconds') or 0)
    if settle > 0:
      self._log(f'Settling for {settle:.1f}s')
      self.sleep_fn(settle * self.time_scale)

    return results

  def _build_timeline(self, stages: list[dict[str, Any]]) -> list[TimelineStage]:
    timeline: list[TimelineStage] = []
    for index, raw in enumerate(stages):
      if not isinstance(raw, dict):
        continue
      at_seconds = float(raw.get('at_seconds') or 0)
      timeline.append(TimelineStage(at_seconds=at_seconds, phase='stage', source_index=index, stage=dict(raw)))

      revert = self._build_revert(raw)
      if revert is not None:
        duration = float(raw.get('duration_seconds') or 0)
        revert_at = at_seconds + max(0.0, duration)
        timeline.append(TimelineStage(at_seconds=revert_at, phase='revert', source_index=index, stage=revert))

    timeline.sort(key=lambda item: (item.at_seconds, 0 if item.phase == 'stage' else 1, item.source_index))
    return timeline

  def _build_revert(self, stage: dict[str, Any]) -> dict[str, Any] | None:
    stage_type = str(stage.get('type') or '').strip().lower()
    duration = float(stage.get('duration_seconds') or 0)
    if duration <= 0:
      return None

    if stage_type == 'partition' and str(stage.get('action') or '').strip().lower() == 'isolate':
      return {
        'type': 'partition',
        'segments': list(stage.get('segments') or []),
        'action': 'heal',
      }

    if stage_type == 'ip_mode':
      return {
        'type': 'ip_mode',
        'mode': 'dual-stack',
      }

    if stage_type == 'agent_churn' and str(stage.get('action') or '').strip().lower() == 'drop':
      return {
        'type': 'agent_churn',
        'action': 'restore',
      }

    return None

  def _execute_stage(self, entry: TimelineStage) -> dict[str, Any]:
    stage = entry.stage
    stage_type = str(stage.get('type') or '').strip().lower()

    if not stage_type:
      return {
        'phase': entry.phase,
        'stage_index': entry.source_index,
        'type': 'unknown',
        'ok': False,
        'error': 'missing stage type',
      }

    self._log(f"Applying {entry.phase} stage #{entry.source_index}: {stage_type}")
    payload: dict[str, Any] = {
      'phase': entry.phase,
      'stage_index': entry.source_index,
      'type': stage_type,
      'at_seconds': entry.at_seconds,
      'ok': True,
    }

    try:
      if stage_type == 'bandwidth_shift':
        result = self.topology.set_link_profile(
          link_id=str(stage.get('link') or ''),
          bw_mbit=float(stage.get('bw_mbit') or 100),
          delay_ms=float(stage.get('delay_ms') or 0),
          loss_pct=float(stage.get('loss_pct') or 0),
        )
      elif stage_type == 'partition':
        result = self.topology.apply_partition(
          segments=[str(value) for value in stage.get('segments') or []],
          action=str(stage.get('action') or 'isolate'),
        )
      elif stage_type == 'ip_mode':
        result = self.topology.set_ip_mode(str(stage.get('mode') or 'dual-stack'))
      elif stage_type == 'agent_churn':
        result = self.topology.churn_agents(
          action=str(stage.get('action') or 'drop'),
          count=int(stage.get('count') or 1),
        )
      else:
        result = {
          'warning': f'unsupported scenario stage type: {stage_type}',
        }

      payload['result'] = result
      return payload
    except Exception as exc:
      payload['ok'] = False
      payload['error'] = str(exc)
      return payload


__all__ = ['ScenarioRunner', 'TimelineStage']
