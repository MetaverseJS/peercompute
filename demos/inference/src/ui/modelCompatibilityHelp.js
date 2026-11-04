const BROWSERS = Object.freeze({ chrome: 'Google Chrome', chromium: 'Chromium', edge: 'Microsoft Edge', brave: 'Brave', firefox: 'Firefox', safari: 'Safari', other: 'Other browser' });
const SYSTEMS = Object.freeze({ linux: 'Linux', windows: 'Windows', macos: 'macOS', android: 'Android', ios: 'iOS / iPadOS', other: 'Other operating system' });
const COMMANDS = Object.freeze({
  chrome: 'google-chrome --enable-dawn-features=vulkan_enable_f16_on_nvidia',
  chromium: 'chromium --enable-dawn-features=vulkan_enable_f16_on_nvidia',
  edge: 'microsoft-edge --enable-dawn-features=vulkan_enable_f16_on_nvidia',
  brave: 'brave-browser --enable-dawn-features=vulkan_enable_f16_on_nvidia',
});
const CHROMIUM_FLAGS = 'https://www.chromium.org/developers/how-tos/run-chromium-with-flags/';
const DAWN_F16 = 'https://github.com/google/dawn/commit/8f96ae09bbaac54d52ca6f8aff8606ffdbe9de3f';

function boundedText(value, maximum, fallback = '') {
  if (typeof value !== 'string') return fallback;
  return value.slice(0, maximum).replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, ' ').trim() || fallback;
}

function environmentValue(value, choices) {
  return typeof value === 'string' && Object.hasOwn(choices, value) ? value : 'other';
}

/** Best-effort hints only: callers may offer explicit browser/OS correction. */
export function detectModelHelpEnvironment(navigatorLike = globalThis.navigator) {
  const nav = navigatorLike ?? {};
  const ua = boundedText(nav.userAgent, 4096);
  const platform = boundedText(nav.userAgentData?.platform, 80) || boundedText(nav.platform, 80);
  const brands = Array.isArray(nav.userAgentData?.brands)
    ? nav.userAgentData.brands.slice(0, 16).map((item) => boundedText(item?.brand, 80)).join(' ') : '';
  let os = 'other';
  if (/iPhone|iPad|iPod|\biOS\b/i.test(`${platform} ${ua}`) || (/Mac/i.test(`${platform} ${ua}`) && nav.maxTouchPoints > 1)) os = 'ios';
  else if (/Android/i.test(`${platform} ${ua}`)) os = 'android';
  else if (/Windows|Win32|Win64/i.test(platform)) os = 'windows';
  else if (/macOS|Mac/i.test(platform)) os = 'macos';
  else if (/Linux/i.test(platform)) os = 'linux';
  else if (/Windows/i.test(ua)) os = 'windows';
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macos';
  else if (/Linux|X11/i.test(ua)) os = 'linux';

  let browser = 'other';
  if (/Brave/i.test(brands) || /Brave\//i.test(ua) || typeof nav.brave?.isBrave === 'function') browser = 'brave';
  else if (/Microsoft Edge/i.test(brands) || /(?:Edg|EdgA|EdgiOS|Edge)\//i.test(ua)) browser = 'edge';
  else if (/Firefox/i.test(brands) || /(?:Firefox|FxiOS)\//i.test(ua)) browser = 'firefox';
  else if (/OPR\/|Opera|SamsungBrowser\/|Vivaldi\/|Electron\//i.test(ua)) browser = 'other';
  else if (/Google Chrome/i.test(brands) || /CriOS\//i.test(ua)) browser = 'chrome';
  else if (/Chromium\//i.test(ua)) browser = 'chromium';
  else if (/Chrome\//i.test(ua)) browser = 'chrome';
  else if (/Chromium/i.test(brands)) browser = 'chromium';
  else if (/Safari\//i.test(ua) && /Version\//i.test(ua)) browser = 'safari';
  return { browser, os };
}

/** Plain presentation data. Never interpolate model, peer or URL data into commands. */
export function buildModelCompatibilityHelp(source, { environment = detectModelHelpEnvironment() } = {}) {
  const availability = source?.localAvailability ?? {};
  const code = boundedText(availability.code, 100);
  const browser = environmentValue(environment?.browser, BROWSERS);
  const os = environmentValue(environment?.os, SYSTEMS);
  const help = {
    name: boundedText(source?.name, 180, 'Selected model'),
    reason: boundedText(availability.reason, 500, 'Compatibility has not been fully verified.'),
    environmentLabel: `${BROWSERS[browser]} on ${SYSTEMS[os]}`,
    paragraphs: [], steps: [], command: null, commandLabel: '', links: [], openConfig: false,
  };
  if (availability.status === 'checking' || code === 'device_checking') {
    help.paragraphs.push('The browser capability check is still running. This does not mean the model is unsupported.');
    help.steps.push('Wait for the check to finish. If it remains pending, reload the page and check again.');
  } else if (code === 'cpu_budget_exceeded' || code === 'gpu_budget_exceeded') {
    help.openConfig = true;
    help.paragraphs.push('The model reservation exceeds a configured memory budget. This budget is an admission limit, not a measurement of free RAM or GPU memory.');
    help.steps.push('Open Config and review the RAM and GPU memory budgets. Raise or clear an optional limit only when appropriate for your device.', 'A shared compute pool may impose its own limit. Choose a smaller model or a peer-hosted model if that limit still applies.');
  } else if (code === 'gpu_feature_unavailable' && /\bshader-f16\b/i.test(help.reason)) {
    help.paragraphs.push('This browser does not expose the shader-f16 feature required by this model runtime. GPU memory capacity alone does not establish FP16 support.');
    if (os === 'linux' && Object.hasOwn(COMMANDS, browser)) {
      help.command = COMMANDS[browser];
      help.commandLabel = 'Optional Linux NVIDIA / Vulkan launch command';
      help.paragraphs.push('If this Linux machine uses an NVIDIA GPU with the Chromium Vulkan backend, the optional command below may expose FP16. It is specific to that backend and driver combination.', 'This switch overrides a driver-related restriction. Older drivers may produce incorrect results or instability; exposing the feature does not guarantee correct execution.');
      help.steps.push('Try the launch command below first. Save your work and fully exit this browser, including background processes, then run the command using your usual browser profile; do not clear site data or create a temporary profile.', `Open ${browser === 'edge' ? 'edge' : 'chrome'}://version and confirm the Command Line includes --enable-dawn-features=vulkan_enable_f16_on_nvidia. Then return to the original PeerCompute site address so its stored models remain available.`, 'If the feature is still missing, update the browser and supported graphics driver, then check this model again.', 'If results are unstable, fully exit and launch normally without the switch. Choose an available model or a peer-hosted model.');
    } else {
      help.paragraphs.push('There is no verified launch command here for this browser and operating system. Browser and driver support can vary.');
      help.steps.push('Update the browser and supported graphics driver, then check this model again.', 'Use a current compatible browser that exposes the required feature, or choose an available model or a peer-hosted model.');
    }
    help.links.push({ label: 'Chromium command-line instructions', url: CHROMIUM_FLAGS }, { label: 'Dawn NVIDIA FP16 driver restriction', url: DAWN_F16 });
  } else if (code === 'gpu_feature_unavailable') {
    help.paragraphs.push('The browser lacks a GPU feature required by this model. Support depends on the browser, GPU and driver.');
    help.steps.push('Update the browser and graphics driver, then recheck. Use an available model or a peer-hosted model if the feature remains unavailable.');
  } else if (code === 'webgpu_unavailable') {
    help.paragraphs.push('The browser did not provide a supported hardware WebGPU adapter. This check does not measure the GPU’s memory capacity.');
    help.steps.push('Use the HTTPS site in an up-to-date WebGPU-capable browser. Check hardware acceleration and supported graphics drivers.', 'Restart the browser and retry, or use a peer-hosted model.');
  } else if (code === 'gguf_crossOriginIsolated_unavailable' || code === 'gguf_sharedArrayBuffer_unavailable') {
    help.paragraphs.push('This GGUF runtime needs cross-origin isolation and SharedArrayBuffer. HTTPS alone does not enable isolation.');
    help.steps.push('Use the deployed HTTPS site. The site owner must send Cross-Origin-Opener-Policy: same-origin and Cross-Origin-Embedder-Policy: require-corp, with compatible headers on required resources.', 'Reload after the hosting configuration is corrected. Otherwise choose an available model or a peer-hosted model; do not disable browser security.');
  } else if (code === 'gguf_jspi_unavailable' || code === 'gguf_memory64_unavailable') {
    help.paragraphs.push('This GGUF runtime needs WebAssembly JSPI and shared memory64 support. The required capability was not detected in this browser.');
    help.steps.push('Update to a browser version that supports these runtime prerequisites and recheck.', 'If support is still missing, choose an available ONNX model or a peer-hosted model.');
  } else if (['runtime_unsupported', 'catalog_unsupported', 'model_invalid', 'package_too_large', 'file_too_large'].includes(code)) {
    help.paragraphs.push('The package or its runtime does not meet this application’s supported model layout or loader limits. A browser launch switch will not fix that mismatch.');
    help.steps.push('Choose an approved model package supported by the local runtime, or select a compatible peer-hosted model.');
  } else if (code === 'device_probe_unknown') {
    help.paragraphs.push('The capability check did not finish or could not verify all prerequisites. This is not confirmation that the device is unsupported.');
    help.steps.push('Retry the check by reloading the page. Keep the browser up to date, or choose a peer-hosted model.');
  } else if (code === 'model_metadata_unverified') {
    help.paragraphs.push('The advertised model still needs its package metadata verified before local loading. Its name alone does not establish compatibility.');
    help.steps.push('Inspect the model package and allow its manifest to be verified before downloading weights.');
  } else {
    help.paragraphs.push(code === 'memory_fit_unverified'
      ? 'Required browser features are supported, but free physical RAM and GPU memory are not reliably available to this check. A successful check does not guarantee that the model will fit.'
      : 'Compatibility depends on the model runtime, browser features and available memory. This check cannot guarantee successful loading.');
    help.steps.push('Choose a smaller available model or a peer-hosted model if local loading fails.');
  }
  return help;
}
