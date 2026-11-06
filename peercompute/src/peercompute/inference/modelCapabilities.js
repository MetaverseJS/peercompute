/** Capabilities of the application-pinned engines, not execution endorsements
 * for every model using an architecture. Generic Hub packages stay candidates. */
const GiB = 1024 ** 3;
export const ONNX_CAPABILITY_LIMITS = Object.freeze({ maximumBytes: 8 * GiB,
  maximumFileBytes: 2 * GiB - 1, maximumConfigBytes: 1024 ** 2, contextTokens: 2048,
  legacyMaximumBytes: 1536 * 1024 ** 2 });
const dtypes = Object.freeze(['q4', 'q4f16', 'q8', 'fp16', 'fp32']);
const legacyText = ['qwen2', 'qwen3', 'llama'];
const extraText = ['phi', 'phi3', 'gemma', 'gemma2', 'gemma3_text', 'mistral', 'granite',
  'starcoder2', 'smollm3', 'olmo', 'olmo2', 'nemotron_h'];
const vision = ['idefics3', 'smolvlm', 'qwen3_5'];
const gguf = ['llama', 'qwen2', 'qwen3', 'qwen35', 'gemma', 'gemma2', 'gemma3', 'phi3',
  'phi2', 'granite', 'starcoder2', 'olmo', 'olmo2', 'stablelm', 'nemotron', 'smollm3'];
const registry = Object.freeze([
  ...[...legacyText, ...extraText, ...vision].map((architecture) => {
    const image = vision.includes(architecture);
    return Object.freeze({ runtime: 'transformers.js', runtimeVersion: '4.3.2', architecture,
      task: image ? 'image-text-to-text' : 'text-generation', qualification: 'candidate',
      modalities: Object.freeze(image ? ['text', 'image'] : ['text']),
      modules: Object.freeze(image ? ['embed_tokens', 'vision_encoder', 'decoder_model_merged'] : ['model']),
      dtypes: architecture === 'qwen3_5' ? Object.freeze(['q4']) : dtypes,
      requiresMemoryProfile: extraText.includes(architecture), contextTokens: 2048,
      maximumBytes: image ? (architecture === 'qwen3_5' ? 2 * GiB : ONNX_CAPABILITY_LIMITS.legacyMaximumBytes)
        : ONNX_CAPABILITY_LIMITS.maximumBytes,
      maximumFileBytes: ONNX_CAPABILITY_LIMITS.maximumFileBytes });
  }),
  ...gguf.map((architecture) => Object.freeze({ runtime: 'llama.cpp', runtimeVersion: '3.8.1',
    architecture, modelArchitecture: architecture === 'qwen35' ? 'qwen3_5' : architecture,
    task: 'text-generation', modalities: Object.freeze(['text']), qualification: 'candidate' })),
]);
export function getModelCapability(runtime, architecture) {
  return registry.find((entry) => entry.runtime === runtime && entry.architecture === architecture) ?? null;
}
export function listModelCapabilities(runtime) { return registry.filter((entry) => !runtime || entry.runtime === runtime); }
const suffix = (dtype) => dtype === 'fp32' ? '' : dtype === 'q8' ? '_quantized' : `_${dtype}`;
function dtypeValues(dtype) {
  const values = typeof dtype === 'string' ? [dtype]
    : dtype && typeof dtype === 'object' && !Array.isArray(dtype) ? Object.values(dtype) : [];
  if (!values.length || values.length > 16 || values.some((value) => !dtypes.includes(value))) throw new Error('Unsupported ONNX precision');
  return values;
}
function webgpuConfig(config) {
  const js = config?.['transformers.js_config'] ?? {};
  const devices = js.device_config ?? {};
  // session.js overlays only the selected device's own configuration.
  return Object.hasOwn(devices, 'webgpu') ? { ...js, ...devices.webgpu } : { ...js };
}
export function onnxRequiredFeatures(dtype, config = {}) {
  const values = dtypeValues(dtype), kv = webgpuConfig(config).kv_cache_dtype;
  const half = values.some((value) => ['fp16', 'q4f16'].includes(value)
    || (typeof kv === 'string' ? kv : kv?.[value]) === 'float16');
  return half ? ['shader-f16'] : [];
}
/** Exact external-data naming used by Transformers.js 4.3.2. */
export function onnxExternalDataFiles(config, architecture, module, dtype) {
  dtypeValues(dtype);
  if (typeof dtype !== 'string' || !/^[A-Za-z0-9_-]{1,100}$/.test(module)) throw new Error('Invalid ONNX module');
  const settings = architecture === 'qwen3_5' && dtype === 'q4' ? 1 : webgpuConfig(config).use_external_data_format;
  const full = `${module}${suffix(dtype)}.onnx`;
  const count = settings && typeof settings === 'object' ? settings[full] ?? settings[module] ?? 0 : settings ?? 0;
  if (!(typeof count === 'boolean' || (Number.isSafeInteger(count) && count >= 0 && count <= 32))) throw new Error('Unsupported external-data chunk configuration');
  return Array.from({ length: Number(count) }, (_, index) => `onnx/${full}_data${index ? `_${index}` : ''}`);
}
function integer(value, label, maximum = 1048576, minimum = 1) {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) throw new Error(`Invalid model memory dimension: ${label}`);
  return value;
}
/** Small, canonical geometry copied from the verified config. Float32 cache
 * reservations cover FP16 variants too; there is no peer-supplied byte budget. */
export function onnxMemoryProfile(config) {
  // The pinned loader forwards effective overrides to ORT session options.
  // Those dimensions are not represented by the config/cache geometry below.
  // Admit no nonempty override for new dynamic profiles until it is accounted
  // for explicitly. A WebGPU null/empty overlay can clear a shared override.
  const overrides = webgpuConfig(config).free_dimension_overrides;
  if (overrides && (typeof overrides !== 'object' || Array.isArray(overrides)
      || Object.keys(overrides).length)) throw new Error('Dynamic ONNX free_dimension_overrides are not admitted by this memory profile');
  const architecture = config?.model_type;
  const capability = getModelCapability('transformers.js', architecture);
  if (!capability) throw new Error('Unsupported model memory architecture');
  const c = capability.task === 'image-text-to-text' ? config.text_config ?? config : config;
  const types = c.layer_types ?? c.layers_block_type;
  const layers = integer(c.num_hidden_layers ?? types?.length, 'layers', 512);
  const hiddenSize = integer(c.hidden_size, 'hidden size', 65536);
  const heads = integer(c.num_attention_heads, 'attention heads', 1024);
  const kvHeads = integer(c.num_key_value_heads ?? heads, 'KV heads', 1024);
  const headDim = integer(c.head_dim ?? hiddenSize / heads, 'head dimension', 4096);
  const vocabulary = integer(c.vocab_size ?? config.vocab_size, 'vocabulary');
  if (types !== undefined && (!Array.isArray(types) || types.length !== layers
      || types.some((type) => !['attention', 'mamba', 'mlp', 'moe', 'full_attention', 'sliding_attention', 'linear_attention'].includes(type)))) {
    throw new Error('Invalid model memory layer types');
  }
  let attentionLayers = layers, recurrentLayers = 0, convChannels = 0, convKernel = 0, ssmHeads = 0, ssmHeadDim = 0, stateSize = 0;
  if (architecture === 'nemotron_h') {
    if (!types) throw new Error('Nemotron requires explicit recurrent layer types');
    attentionLayers = types.filter((type) => type === 'attention').length;
    recurrentLayers = types.filter((type) => type === 'mamba').length;
    if (types.some((type) => !['attention', 'mamba', 'mlp', 'moe'].includes(type))) throw new Error('Unsupported Nemotron layer type');
    ssmHeads = integer(c.mamba_num_heads, 'SSM heads', 1024);
    ssmHeadDim = integer(c.mamba_head_dim, 'SSM head dimension', 4096);
    stateSize = integer(c.ssm_state_size, 'SSM state size', 4096);
    const groups = integer(c.n_groups, 'SSM groups', 1024);
    convKernel = integer(c.conv_kernel, 'convolution kernel', 256);
    convChannels = integer(ssmHeads * ssmHeadDim + 2 * groups * stateSize, 'convolution channels');
  }
  return normalizeOnnxMemoryProfile({ schema: 'peercompute.onnx.memory.v1', architecture, layers,
    hiddenSize, heads, kvHeads, headDim, vocabulary, attentionLayers, recurrentLayers,
    convChannels, convKernel, ssmHeads, ssmHeadDim, stateSize });
}
export function normalizeOnnxMemoryProfile(profile) {
  const keys = ['schema', 'architecture', 'layers', 'hiddenSize', 'heads', 'kvHeads', 'headDim', 'vocabulary',
    'attentionLayers', 'recurrentLayers', 'convChannels', 'convKernel', 'ssmHeads', 'ssmHeadDim', 'stateSize'];
  if (!profile || profile.schema !== 'peercompute.onnx.memory.v1'
      || !getModelCapability('transformers.js', profile.architecture)
      || Object.keys(profile).some((key) => !keys.includes(key))) throw new Error('Invalid model memory profile');
  for (const key of keys.slice(2)) integer(profile[key], key, 1048576,
    ['attentionLayers', 'recurrentLayers', 'convChannels', 'convKernel', 'ssmHeads', 'ssmHeadDim', 'stateSize'].includes(key) ? 0 : 1);
  if (profile.layers > 512 || profile.attentionLayers + profile.recurrentLayers > profile.layers
      || profile.kvHeads > profile.heads || (profile.architecture !== 'nemotron_h' && profile.recurrentLayers)) throw new Error('Invalid model memory layer geometry');
  // Double-buffered K/V and recurrent states at the fixed admitted context.
  const cacheBytes = 2 * (2 * profile.attentionLayers * profile.kvHeads * profile.headDim * 2048 * 4
    + profile.recurrentLayers * (profile.ssmHeads * profile.ssmHeadDim * profile.stateSize
      + profile.convChannels * profile.convKernel) * 4);
  if (!Number.isSafeInteger(cacheBytes) || cacheBytes > 16 * GiB) throw new Error('Model cache/state exceeds its bounded memory envelope');
  return Object.fromEntries(keys.map((key) => [key, profile[key]]));
}
export function onnxCacheBytes(profile) {
  const p = normalizeOnnxMemoryProfile(profile);
  return 2 * (2 * p.attentionLayers * p.kvHeads * p.headDim * 2048 * 4
    + p.recurrentLayers * (p.ssmHeads * p.ssmHeadDim * p.stateSize + p.convChannels * p.convKernel) * 4);
}
/** A profile is advisory until compared with the actual CID-backed config. */
export function validateOnnxModelConfig(model, config) {
  if (config?.model_type !== model.architecture) throw new Error('Model config architecture does not match its admitted manifest');
  if (config.auto_map && Object.keys(config.auto_map).length) throw new Error('Custom model code is not admitted');
  if (model.memoryProfile && JSON.stringify(normalizeOnnxMemoryProfile(model.memoryProfile)) !== JSON.stringify(onnxMemoryProfile(config))) {
    throw new Error('Model memory profile differs from its verified config');
  }
  return onnxRequiredFeatures(model.dtype, config);
}
