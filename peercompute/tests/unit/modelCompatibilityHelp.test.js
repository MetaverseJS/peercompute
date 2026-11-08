import test from 'node:test';
import assert from 'node:assert/strict';
import { detectModelHelpEnvironment, buildModelCompatibilityHelp } from '../../../demos/inference/src/ui/modelCompatibilityHelp.js';

const source = (code, reason = 'Compatibility reason', status = 'unavailable') => ({ name: 'Example model', localAvailability: { status, code, reason } });
const f16 = source('gpu_feature_unavailable', 'Required FP16 GPU math (shader-f16) is unavailable in this browser');
const linuxChrome = { browser: 'chrome', os: 'linux' };
const help = (value, environment = linuxChrome) => buildModelCompatibilityHelp(value, { environment });

test('detects desktop browsers from UA and client hints without invoking Brave APIs', () => {
  const ua = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/157.0.0.0 Safari/537.36';
  for (const [browser, navigator] of [
    ['chrome', { userAgent: ua }],
    ['chromium', { userAgent: ua.replace('Chrome/', 'Chromium/') }],
    ['edge', { userAgent: `${ua} Edg/157.0.0.0` }],
    ['brave', { userAgent: ua, brave: { isBrave() { throw new Error('Must not call browser APIs'); } } }],
    ['firefox', { userAgent: 'Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0' }],
    ['chrome', { userAgentData: { platform: 'Linux', brands: [{ brand: 'Chromium' }, { brand: 'Google Chrome' }] } }],
    ['chromium', { userAgentData: { platform: 'Linux', brands: [{ brand: 'Chromium' }] } }],
    ['edge', { userAgent: ua, userAgentData: { platform: 'Linux', brands: [{ brand: 'Chromium' }, { brand: 'Microsoft Edge' }] } }],
    ['brave', { userAgentData: { platform: 'Linux', brands: [{ brand: 'Brave' }] } }],
  ]) assert.deepEqual(detectModelHelpEnvironment(navigator), { browser, os: 'linux' });
});

test('detects iOS browser wrappers, desktop-mode iPad, Android, macOS and Windows', () => {
  const cases = [
    [{ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) CriOS/150.0 Mobile Safari/604.1' }, 'chrome', 'ios'],
    [{ userAgent: 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) FxiOS/140.0 Mobile Safari/605.1' }, 'firefox', 'ios'],
    [{ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) EdgiOS/140.0 Mobile Safari/605.1' }, 'edge', 'ios'],
    [{ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) Version/18.0 Safari/605.1', platform: 'MacIntel', maxTouchPoints: 5 }, 'safari', 'ios'],
    [{ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) Version/18.0 Safari/605.1', platform: 'MacIntel', maxTouchPoints: 0 }, 'safari', 'macos'],
    [{ userAgent: 'Mozilla/5.0 (Linux; Android 15) Chrome/157.0 Mobile Safari/537.36', platform: 'Linux armv8l' }, 'chrome', 'android'],
    [{ userAgent: 'Mozilla/5.0 (Windows NT 10.0) Chrome/157.0 Safari/537.36', userAgentData: { platform: 'Windows' } }, 'chrome', 'windows'],
  ];
  for (const [navigator, browser, os] of cases) assert.deepEqual(detectModelHelpEnvironment(navigator), { browser, os });
  for (const navigator of [null, {}, { userAgent: 4, platform: {} }, { userAgent: 'ExampleBot' }])
    assert.deepEqual(detectModelHelpEnvironment(navigator), { browser: 'other', os: 'other' });
  assert.equal(detectModelHelpEnvironment({ userAgent: 'Chrome/157.0 Safari/537.36 OPR/112.0' }).browser, 'other');
});

test('only the researched Linux Chromium family gets fixed conditional launch commands', () => {
  const commands = {
    chrome: 'google-chrome --enable-dawn-features=vulkan_enable_f16_on_nvidia',
    chromium: 'chromium --enable-dawn-features=vulkan_enable_f16_on_nvidia',
    edge: 'microsoft-edge --enable-dawn-features=vulkan_enable_f16_on_nvidia',
    brave: 'brave-browser --enable-dawn-features=vulkan_enable_f16_on_nvidia',
  };
  for (const browser of ['chrome', 'chromium', 'edge', 'brave', 'firefox', 'safari', 'other']) {
    for (const os of ['linux', 'windows', 'macos', 'android', 'ios', 'other']) {
      const result = help(f16, { browser, os });
      assert.equal(result.command, os === 'linux' ? commands[browser] ?? null : null, `${browser}/${os}`);
      assert.equal(result.openConfig, false);
      if (result.command) {
        assert.match(result.steps[0], /^Try the launch command below first/);
        assert.match(result.steps[2], /^If the feature is still missing, update/);
        assert.match(result.paragraphs.join(' '), /If this Linux machine uses an NVIDIA GPU.*Vulkan/);
        assert.match(result.paragraphs.join(' '), /incorrect results or instability/);
        assert.match(result.steps.join(' '), /fully exit.*background processes/);
        assert.match(result.steps.join(' '), /usual browser profile/);
        assert.match(result.steps.join(' '), /original PeerCompute site address/);
        assert.match(result.steps.join(' '), browser === 'edge' ? /edge:\/\/version/ : /chrome:\/\/version/);
        assert.match(result.steps.join(' '), /launch normally without the switch/);
      }
    }
  }
});

test('the f16 recipe needs both the exact policy code and the specific missing feature', () => {
  for (const entry of [source('gpu_feature_unavailable', 'texture-compression-bc is missing'), source('webgpu_unavailable', 'shader-f16'), source('runtime_unsupported', 'shader-f16'), source('gpu_feature_unavailable', 'shader-f16', 'checking')]) {
    const result = help(entry);
    assert.equal(result.command, null);
    assert.doesNotMatch(result.steps.join(' '), /enable-dawn-features/);
  }
});

test('memory budgets lead to Config and never claim that budget equals detected capacity', () => {
  for (const code of ['cpu_budget_exceeded', 'gpu_budget_exceeded']) {
    const result = help(source(code));
    assert.equal(result.openConfig, true);
    assert.equal(result.command, null);
    assert.match(result.paragraphs.join(' '), /not a measurement of free RAM or GPU memory/);
    assert.match(result.steps.join(' '), /shared compute pool/i);
  }
});

test('isolation, WebAssembly and runtime failures give distinct remedies without flags', () => {
  for (const code of ['gguf_crossOriginIsolated_unavailable', 'gguf_sharedArrayBuffer_unavailable']) {
    const result = help(source(code));
    assert.equal(result.command, null);
    assert.match(result.steps.join(' '), /Cross-Origin-Opener-Policy: same-origin/);
    assert.match(result.steps.join(' '), /Cross-Origin-Embedder-Policy: require-corp/);
    assert.match(result.paragraphs.join(' '), /HTTPS alone does not/);
  }
  for (const code of ['gguf_jspi_unavailable', 'gguf_memory64_unavailable']) {
    const result = help(source(code), { browser: 'firefox', os: 'linux' });
    assert.equal(result.command, null);
    assert.match(result.steps.join(' '), /available ONNX model or a peer-hosted model/);
    assert.doesNotMatch(result.paragraphs.join(' '), /Firefox cannot|GGUF cannot/);
  }
  for (const code of ['runtime_unsupported', 'catalog_unsupported', 'model_invalid', 'package_too_large', 'file_too_large']) {
    const result = help(source(code));
    assert.equal(result.command, null);
    assert.equal(result.openConfig, false);
    assert.match(result.paragraphs.join(' '), /launch switch will not fix/);
  }
});

test('checking, incomplete probes, unverified metadata and memory fit remain honest', () => {
  assert.match(help(source('device_checking')).steps.join(' '), /Wait for the check/);
  assert.match(help(source('device_probe_unknown')).paragraphs.join(' '), /not confirmation.*unsupported/);
  assert.match(help(source('model_metadata_unverified')).steps.join(' '), /manifest.*verified before downloading/);
  assert.match(help(source('memory_fit_unverified')).paragraphs.join(' '), /does not guarantee.*fit/);
  for (const entry of [undefined, {}, source('future_code'), source('memory_fit_unverified', 'Supported features', 'unknown')]) {
    const result = help(entry);
    assert.equal(result.command, null);
    assert.equal(result.openConfig, false);
    assert(result.paragraphs.length && result.steps.length);
  }
});

test('untrusted model strings and manual environment input cannot alter executable commands or links', () => {
  const entry = Object.freeze({ name: '$(touch /tmp/unsafe)\n<script>alert(1)</script>\u202e'.repeat(1000), localAvailability: Object.freeze({ code: 'gpu_feature_unavailable', reason: 'shader-f16 `curl evil`\n\u0000'.repeat(1000) }) });
  const result = help(entry);
  assert.equal(result.command, 'google-chrome --enable-dawn-features=vulkan_enable_f16_on_nvidia');
  assert(result.name.length <= 180 && result.reason.length <= 500);
  assert.doesNotMatch(result.name + result.reason, /[\u0000-\u001f\u202a-\u202e]/);
  assert.deepEqual(result.links.map((link) => link.url), [
    'https://www.chromium.org/developers/how-tos/run-chromium-with-flags/',
    'https://github.com/google/dawn/commit/8f96ae09bbaac54d52ca6f8aff8606ffdbe9de3f',
  ]);
  for (const environment of [null, {}, { browser: 'chrome; echo unsafe', os: 'linux' }, { browser: '__proto__', os: 'linux' }, { browser: 'chrome', os: 'linux\nunsafe' }]) assert.equal(help(entry, environment).command, null);
  const edge = help(entry, { browser: 'edge', os: 'linux' });
  assert.equal(edge.command, 'microsoft-edge --enable-dawn-features=vulkan_enable_f16_on_nvidia');
  assert.equal(edge.environmentLabel, 'Microsoft Edge on Linux');
});
