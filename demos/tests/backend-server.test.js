const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const repoRoot = path.resolve(process.cwd());
const read = (rel) => fs.readFileSync(path.join(repoRoot, rel), 'utf8');
const turnserverDryRunPattern = /dry-run command: .*turnserver -c /;

function runScript(script, args = [], extraEnv = {}) {
  const result = spawnSync('bash', [script, ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      ...extraEnv
    }
  });
  return result;
}

function runBash(args, extraEnv = {}) {
  return spawnSync('bash', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      ...extraEnv
    }
  });
}

test('start-turn-prod dry-run renders managed coturn config from env overrides', (t) => {
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-turn-test-'));
  t.after(() => fs.rmSync(runtimeDir, { recursive: true, force: true }));
  const result = runScript('scripts/start-turn-prod.sh', ['--dry-run'], {
    PCSERVER_RUNTIME_DIR: runtimeDir,
    RELAY_TURN_HOST: 'turn.test.local',
    RELAY_TURN_PORT: '3479',
    RELAY_TURN_USERNAME: 'peeruser',
    RELAY_TURN_CREDENTIAL: 'peerpass',
    PCSERVER_TURN_REALM: 'turn.test.local',
    PCSERVER_TURN_EXTERNAL_IP: '203.0.113.10',
    PCSERVER_TURN_RELAY_IP: '10.0.0.10',
    PCSERVER_TURN_MIN_PORT: '50000',
    PCSERVER_TURN_MAX_PORT: '50010',
    PCSERVER_TURN_EXTRA_LINES: 'verbose\nmobility'
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, turnserverDryRunPattern);

  const generatedConfig = path.join(runtimeDir, 'peercompute-turnserver.conf');
  assert.ok(fs.existsSync(generatedConfig), 'generated turn config missing');

  const config = fs.readFileSync(generatedConfig, 'utf8');
  assert.match(config, /listening-port=3479/);
  assert.match(config, /user=peeruser:peerpass/);
  assert.match(config, /realm=turn\.test\.local/);
  assert.match(config, /external-ip=203\.0\.113\.10/);
  assert.match(config, /relay-ip=10\.0\.0\.10/);
  assert.match(config, /min-port=50000/);
  assert.match(config, /max-port=50010/);
  assert.match(config, /verbose/);
  assert.match(config, /mobility/);
});

test('start-turn-prod respects PCSERVER_ENABLE_TURN=0', () => {
  const result = runScript('scripts/start-turn-prod.sh', ['--dry-run'], {
    PCSERVER_ENABLE_TURN: '0'
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /\[turn\] disabled via PCSERVER_ENABLE_TURN/);
});

test('pcserver dry-run renders relay and turn by default', (t) => {
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pcserver-test-'));
  t.after(() => fs.rmSync(runtimeDir, { recursive: true, force: true }));
  const result = runScript('scripts/pcserver.sh', ['--dry-run'], {
    PCSERVER_RUNTIME_DIR: runtimeDir
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /would run: bash .*scripts\/start-relay-prod\.sh/);
  assert.match(result.stdout, turnserverDryRunPattern);
  const turnConfig = fs.readFileSync(
    path.join(runtimeDir, 'peercompute-turnserver.conf'),
    'utf8'
  );
  assert.doesNotMatch(
    turnConfig,
    /^external-ip=/m,
    'production defaults must not derive coturn external-ip from an unchecked literal'
  );
});

test('pcserver relay-only mode suppresses turn output', () => {
  const result = runScript('scripts/pcserver.sh', ['--dry-run', '--relay-only']);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /would run: bash .*scripts\/start-relay-prod\.sh/);
  assert.doesNotMatch(result.stdout, turnserverDryRunPattern);
});

test('pcserver turn-only mode suppresses relay output', (t) => {
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pcserver-turn-only-'));
  t.after(() => fs.rmSync(runtimeDir, { recursive: true, force: true }));
  const result = runScript('scripts/pcserver.sh', ['--dry-run', '--turn-only'], {
    PCSERVER_RUNTIME_DIR: runtimeDir
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.doesNotMatch(result.stdout, /would run: bash .*scripts\/start-relay-prod\.sh/);
  assert.match(result.stdout, turnserverDryRunPattern);
});

test('pcserver rejects disabling both relay and turn', () => {
  const result = runScript('scripts/pcserver.sh', ['--no-relay', '--no-turn']);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /\[pcserver\] nothing to start/);
});

test('backend scripts parse cleanly and relay systemd installer targets pcserver at multi-user target', () => {
  [
    'scripts/start-turn-prod.sh',
    'scripts/pcserver.sh',
    'scripts/install-prod-systemd-services.sh',
    'scripts/install-relay-systemd.sh',
    'scripts/install-coturn-systemd.sh',
    'scripts/dev-vpn-coturn.sh'
  ].forEach((script) => {
    const result = runBash(['-n', script]);
    assert.equal(result.status, 0, `${script} failed bash -n: ${result.stderr || result.stdout}`);
  });

  const relaySystemd = read('scripts/install-relay-systemd.sh');
  assert.match(relaySystemd, /Description=PeerCompute Backend Server/);
  assert.match(relaySystemd, /ExecStart=.*scripts\/pcserver\.sh/);
  assert.match(relaySystemd, /enable_relay="\$\{PCSERVER_ENABLE_RELAY:-1\}"/);
  assert.match(relaySystemd, /enable_turn="\$\{PCSERVER_ENABLE_TURN:-1\}"/);
  assert.match(relaySystemd, /Environment=PCSERVER_ENABLE_RELAY=\$enable_relay/);
  assert.match(relaySystemd, /Environment=PCSERVER_ENABLE_TURN=\$enable_turn/);
  assert.match(relaySystemd, /WantedBy=multi-user\.target/);

  const productionInstaller = read('scripts/install-prod-systemd-services.sh');
  assert.match(productionInstaller, /mode="\$\{BACKEND_INSTALL_MODE:-split\}"/);
  assert.match(productionInstaller, /PCSERVER_ENABLE_RELAY=1/);
  assert.match(productionInstaller, /PCSERVER_ENABLE_TURN=0/);
  assert.match(productionInstaller, /scripts\/install-coturn-systemd\.sh/);

  const coturnSystemd = read('scripts/install-coturn-systemd.sh');
  assert.match(coturnSystemd, /Description=PeerCompute Coturn Server/);
  assert.match(coturnSystemd, /ExecStart=.*turn_bin.*config_file/);
  assert.match(coturnSystemd, /WantedBy=multi-user\.target/);
});
