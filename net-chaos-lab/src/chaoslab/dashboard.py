from __future__ import annotations

import argparse
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import traceback
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from .metrics import tail_events


class DashboardHandler(BaseHTTPRequestHandler):
  summary_path: Path
  events_path: Path
  static_dir: Path
  topology_path: Path | None = None

  def end_headers(self) -> None:
    self.send_header('Access-Control-Allow-Origin', '*')
    self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
    self.send_header('Access-Control-Allow-Headers', 'Content-Type')
    super().end_headers()

  def do_OPTIONS(self) -> None:  # noqa: N802
    self.send_response(HTTPStatus.NO_CONTENT)
    self.end_headers()

  def _write_json(self, payload: dict, status: int = HTTPStatus.OK) -> None:
    encoded = json.dumps(payload, ensure_ascii=True).encode('utf-8')
    self.send_response(status)
    self.send_header('Content-Type', 'application/json; charset=utf-8')
    self.send_header('Cache-Control', 'no-store')
    self.send_header('Content-Length', str(len(encoded)))
    self.end_headers()
    self.wfile.write(encoded)

  def _write_file(self, path: Path, content_type: str) -> None:
    if not path.exists():
      self.send_error(HTTPStatus.NOT_FOUND, 'File not found')
      return
    try:
      body = path.read_bytes()
    except OSError as exc:
      self.send_error(HTTPStatus.INTERNAL_SERVER_ERROR, f'Unable to read file: {exc}')
      return
    self.send_response(HTTPStatus.OK)
    self.send_header('Content-Type', content_type)
    self.send_header('Cache-Control', 'no-store')
    self.send_header('Content-Length', str(len(body)))
    self.end_headers()
    self.wfile.write(body)

  def do_GET(self) -> None:  # noqa: N802
    parsed = urlparse(self.path)
    try:
      if parsed.path in {'/', '/index.html'}:
        self._write_file(self.static_dir / 'index.html', 'text/html; charset=utf-8')
        return

      if parsed.path == '/api/summary':
        if self.summary_path.exists():
          try:
            payload = json.loads(self.summary_path.read_text(encoding='utf-8'))
            if isinstance(payload, dict):
              self._write_json(payload)
              return
          except json.JSONDecodeError:
            pass
        self._write_json({'run_id': None, 'updated_at': None})
        return

      if parsed.path == '/api/events':
        params = parse_qs(parsed.query)
        limit_raw = params.get('limit', ['50'])[0]
        try:
          limit = max(1, min(500, int(limit_raw)))
        except ValueError:
          limit = 50
        events = tail_events(self.events_path, limit=limit)
        self._write_json({'events': events})
        return

      if parsed.path == '/api/topology':
        path = self.topology_path
        if path is not None and path.exists():
          try:
            payload = json.loads(path.read_text(encoding='utf-8'))
            if isinstance(payload, dict):
              self._write_json(payload)
              return
          except json.JSONDecodeError:
            pass
        self._write_json({'run_id': None, 'updated_at': None, 'topology': None})
        return

      self.send_error(HTTPStatus.NOT_FOUND, 'Route not found')
    except Exception as exc:  # pragma: no cover - defensive HTTP fallback
      self.log_error('dashboard handler error: %s', exc)
      self.log_error('%s', traceback.format_exc())
      if parsed.path == '/api/events':
        self._write_json({'events': [], 'error': str(exc)})
        return
      if parsed.path == '/api/topology':
        self._write_json({'run_id': None, 'updated_at': None, 'topology': None, 'error': str(exc)})
        return
      if parsed.path.startswith('/api/'):
        self._write_json({'run_id': None, 'updated_at': None, 'error': str(exc)})
        return
      self.send_error(HTTPStatus.INTERNAL_SERVER_ERROR, f'Unhandled dashboard error: {exc}')


def create_dashboard_server(
  host: str,
  port: int,
  summary_path: Path,
  events_path: Path,
  static_dir: Path,
  topology_path: Path | None = None,
) -> ThreadingHTTPServer:
  handler = type(
    'BoundDashboardHandler',
    (DashboardHandler,),
    {
      'summary_path': summary_path,
      'events_path': events_path,
      'static_dir': static_dir,
      'topology_path': topology_path,
    }
  )
  return ThreadingHTTPServer((host, port), handler)


def serve_dashboard(
  host: str,
  port: int,
  summary_path: Path,
  events_path: Path,
  static_dir: Path,
  topology_path: Path | None = None,
) -> None:
  server = create_dashboard_server(
    host=host,
    port=port,
    summary_path=summary_path,
    events_path=events_path,
    static_dir=static_dir,
    topology_path=topology_path,
  )
  print(f'[dashboard] listening on http://{host}:{port}')
  server.serve_forever()


def parse_args() -> argparse.Namespace:
  parser = argparse.ArgumentParser(description='Serve chaos-lab metrics dashboard')
  parser.add_argument('--summary', required=True, help='Path to metrics-summary.json')
  parser.add_argument('--events', required=True, help='Path to metrics-events.jsonl')
  parser.add_argument('--topology', default='', help='Path to chaos-topology.json')
  parser.add_argument('--static-dir', required=True, help='Directory containing dashboard index.html')
  parser.add_argument('--host', default='127.0.0.1')
  parser.add_argument('--port', type=int, default=8866)
  return parser.parse_args()


def main() -> None:
  args = parse_args()
  serve_dashboard(
    host=args.host,
    port=args.port,
    summary_path=Path(args.summary).resolve(),
    events_path=Path(args.events).resolve(),
    topology_path=Path(args.topology).resolve() if args.topology else None,
    static_dir=Path(args.static_dir).resolve(),
  )


if __name__ == '__main__':
  main()
