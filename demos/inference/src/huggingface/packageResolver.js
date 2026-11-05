import { sha1 } from '@noble/hashes/legacy.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { modelResourcePolicy, MODEL_RUNTIME_VERSION } from '../../../../peercompute/src/peercompute/inference/modelManifest.js';
import { huggingFaceFileUrl, parseHuggingFaceRepository, plainDescription, validateHubPath, validateRevision } from './hubClient.js';

const MAX_VARIANTS = 32;
const TEXT_ARCHITECTURES = new Set(['qwen2', 'qwen3', 'llama']);
const VISION_ARCHITECTURES = new Set(['idefics3', 'smolvlm', 'qwen3_5']);
const DTYPES = ['q4', 'q4f16', 'q8', 'fp16', 'fp32'];
const SIDECARS = new Set(['config.json', 'tokenizer.json', 'tokenizer_config.json', 'added_tokens.json',
  'special_tokens_map.json', 'vocab.json', 'merges.txt', 'tokenizer.model', 'sentencepiece.bpe.model',
  'generation_config.json', 'preprocessor_config.json', 'processor_config.json', 'chat_template.json', 'chat_template.jinja']);
const suffix = (dtype) => dtype === 'fp32' ? '' : dtype === 'q8' ? '_quantized' : `_${dtype}`;
const encoder = new TextEncoder();

export function normalizeHubFile(raw) {
  const path = validateHubPath(raw.path ?? raw.rfilename);
  const size = raw.size;
  if (!Number.isSafeInteger(size) || size < 0) throw new Error(`Missing exact file size: ${path}`);
  if (raw.lfs) {
    const digest = raw.lfs.oid ?? raw.lfs.sha256;
    if (!/^[a-f0-9]{64}$/i.test(digest ?? '') || raw.lfs.size !== size) throw new Error(`Invalid LFS digest or size: ${path}`);
    return { path, size, sha256: digest.toLowerCase() };
  }
  const digest = raw.oid ?? raw.blobId;
  if (!/^[a-f0-9]{40}$/i.test(digest ?? '')) throw new Error(`Missing immutable Git file digest: ${path}`);
  return { path, size, gitBlobSha1: digest.toLowerCase() };
}

function totalBytes(files) {
  const size = files.reduce((sum, file) => sum + file.size, 0);
  if (!Number.isSafeInteger(size)) throw new Error('Selected package size exceeds integer bounds');
  return size;
}
function sidecar(path) { return SIDECARS.has(path) || /^(README(?:\.[A-Za-z]+)?|LICENSE(?:\.[A-Za-z0-9_-]+)?|NOTICE(?:\.[A-Za-z0-9_-]+)?)$/i.test(path); }
function fingerprint(files) { return files.map((file) => `${file.path}:${file.sha256 ?? file.gitBlobSha1}:${file.size}`).sort().join('|'); }
function idFor(repository, revision, variant) {
  return `hf-${bytesToHex(sha256(encoder.encode(`${repository}@${revision}:${variant}`))).slice(0, 24)}`;
}
function packageVariant(entry, { reason = null, dtype = entry.model?.dtype, key = entry.id } = {}) {
  const declaredUnavailable = entry.capabilities?.browserInference === false;
  return { key, id: entry.id, name: entry.name, repository: entry.repository, revision: entry.revision,
    dtype, task: entry.model?.task ?? 'text-generation', totalBytes: entry.totalBytes,
    model: entry.model, files: entry.files, license: entry.license, format: entry.provenance?.format ?? entry.format,
    loadable: !reason && !declaredUnavailable, reason: reason ?? (declaredUnavailable ? entry.capabilities.executionReason ?? 'No browser runtime is available for this package' : null),
    package: entry, status: entry.status ?? 'candidate' };
}

function licenseFor(info, repository, revision) {
  const name = typeof info.cardData?.license === 'string' ? info.cardData.license.slice(0, 100)
    : (info.tags ?? []).find((tag) => typeof tag === 'string' && tag.startsWith('license:'))?.slice(8, 108) ?? 'Unknown';
  return { spdx: name, sourceUrl: `${new URL(huggingFaceFileUrl(repository, revision, 'README.md')).origin}/${repository}/blob/${revision}/README.md`,
    notice: 'Publisher-reported license. Review the model card and license files; preserve applicable notices.',
    reviewRequired: true };
}

/** Mirrors Transformers.js 4.3.2 model-loader.js; no graph/weight download required. */
function externalFiles(config, architecture, name, dtype) {
  const js = config['transformers.js_config'] ?? {};
  const selected = { ...js, ...js.device_config?.webgpu };
  // The existing admitted Qwen3.5 worker explicitly overrides this with one chunk.
  const settings = architecture === 'qwen3_5' && dtype === 'q4' ? 1 : selected.use_external_data_format;
  const full = `${name}${suffix(dtype)}.onnx`;
  const value = settings && typeof settings === 'object' ? settings[full] ?? settings[name] ?? 0 : settings ?? 0;
  if (!(typeof value === 'boolean' || (Number.isSafeInteger(value) && value >= 0 && value <= 32))) {
    throw new Error('Unsupported external-data chunk configuration');
  }
  return Array.from({ length: Number(value) }, (_, index) => `onnx/${full}_data${index ? `_${index}` : ''}`);
}

function basePackage(repository, revision, description, license, files, model, variant) {
  return { id: idFor(repository, revision, variant), name: `${repository.split('/')[1]} (${variant})`,
    description, repository, revision, status: 'candidate', license, files, totalBytes: totalBytes(files),
    weightBytes: files.filter((file) => /\.onnx(?:_data(?:_\d+)?)?$|\.gguf$/i.test(file.path)).reduce((sum, file) => sum + file.size, 0),
    model, provenance: { repository, revision, format: model.runtime === 'llama.cpp' ? 'GGUF' : 'ONNX',
      modelCardUrl: `${HUGGING_FACE_ORIGIN}/${repository}/blob/${revision}/README.md`, source: 'huggingface-discovery' } };
}
const HUGGING_FACE_ORIGIN = 'https://huggingface.co';

export function resolveOnnxVariants({ repository, revision, description = '', license, files, config, gated = false }) {
  const byPath = new Map(files.map((file) => [file.path, file]));
  const architecture = config?.model_type;
  const isText = TEXT_ARCHITECTURES.has(architecture), isVision = VISION_ARCHITECTURES.has(architecture);
  const modules = isVision ? ['embed_tokens', 'vision_encoder', 'decoder_model_merged'] : ['model'];
  const metadata = files.filter((file) => sidecar(file.path));
  const variants = [];
  for (const dtype of DTYPES) {
    const required = modules.map((name) => `onnx/${name}${suffix(dtype)}.onnx`);
    // Expose incomplete variants when at least one module is present.
    if (!required.some((path) => byPath.has(path))) continue;
    let reason = null;
    if (!isText && !isVision) reason = `Architecture ${architecture || 'unknown'} has no admitted browser adapter`;
    if (config?.auto_map && Object.keys(config.auto_map).length) reason = 'This configuration declares custom model code; no custom code is executed';
    if (gated) reason = 'This repository requires Hugging Face access approval; anonymous import is unavailable';
    if (architecture === 'qwen3_5' && dtype !== 'q4') reason = 'The Qwen3.5 browser adapter currently admits only all-q4 modules';
    const extras = [];
    try { for (const name of modules) extras.push(...externalFiles(config ?? {}, architecture, name, dtype)); }
    catch (error) { reason ??= error.message; }
    const missing = [...required, ...extras, 'config.json', 'tokenizer.json', 'tokenizer_config.json'].filter((path) => !byPath.has(path));
    if (isVision && !byPath.has('preprocessor_config.json') && !byPath.has('processor_config.json')) missing.push('preprocessor_config.json or processor_config.json');
    if (missing.length) reason ??= `Incomplete package: missing ${missing.join(', ')}`;
    // A sidecar not requested by the pinned loader cannot silently be assumed to load.
    for (const path of required) {
      if (files.some((file) => file.path.startsWith(`${path}_data`) && !extras.includes(file.path))) {
        reason ??= 'External ONNX data is present but not fully declared for this variant in the runtime configuration';
      }
    }
    const selected = [...new Set([...metadata.map((file) => file.path), ...required, ...extras])]
      .filter((path) => byPath.has(path)).sort().map((path) => byPath.get(path));
    const custom = config?.['transformers.js_config'] ?? {};
    const webgpu = { ...custom, ...custom.device_config?.webgpu };
    const kvDtype = typeof webgpu.kv_cache_dtype === 'string' ? webgpu.kv_cache_dtype : webgpu.kv_cache_dtype?.[dtype];
    const features = ['fp16', 'q4f16'].includes(dtype) || kvDtype === 'float16' ? ['shader-f16'] : [];
    const model = { runtime: 'transformers.js', runtimeVersion: MODEL_RUNTIME_VERSION, architecture,
      task: isVision ? 'image-text-to-text' : 'text-generation', dtype: isVision ? Object.fromEntries(modules.map((name) => [name, dtype])) : dtype,
      modalities: isVision ? ['text', 'image'] : ['text'], requiredFeatures: features, repository, revision };
    const entry = basePackage(repository, revision, description, license, selected, model, dtype);
    if (entry.totalBytes > modelResourcePolicy(model).maxModelBytes) reason ??= 'Selected package exceeds this browser adapter’s admitted file budget';
    if (selected.length > 1024) reason ??= 'Selected package has too many files for the browser adapter';
    variants.push(packageVariant(entry, { reason, dtype }));
  }
  return variants;
}

async function readVerifiedText(client, repository, revision, file, signal, maxBytes = 256 * 1024) {
  if (file.size > maxBytes) throw new Error(`Metadata file is too large to inspect: ${file.path}`);
  const text = await client.readText(repository, revision, file.path, { signal, maxBytes });
  const bytes = encoder.encode(text);
  if (bytes.length !== file.size) throw new Error(`Metadata size changed: ${file.path}`);
  if (file.gitBlobSha1) {
    const digest = sha1.create().update(encoder.encode(`blob ${file.size}\0`)).update(bytes).digest();
    if (bytesToHex(digest) !== file.gitBlobSha1) throw new Error(`Metadata Git digest changed: ${file.path}`);
  }
  const digest = bytesToHex(sha256(bytes));
  if (file.sha256 && digest !== file.sha256) throw new Error(`Metadata SHA-256 changed: ${file.path}`);
  // Preserve original catalog identity for known packages; these augmented descriptors only affect new packages.
  file.sha256 = digest;
  return text;
}

export async function inspectHuggingFaceModel(input, { client, catalog = {}, signal, selectedVariant } = {}) {
  if (!client?.getModel || !client?.listFiles || !client?.readText) throw new Error('A Hugging Face metadata client is required');
  signal?.throwIfAborted();
  const parsed = parseHuggingFaceRepository(input), repository = parsed.repository;
  const info = await client.getModel(repository, { revision: parsed.revision, signal });
  const revision = validateRevision(info.sha);
  if (parsed.revision && revision !== parsed.revision) throw new Error('Hugging Face returned a different model revision');
  const license = licenseFor(info, repository, revision), warnings = [];
  if (info.warning) warnings.push(info.warning);
  let rawFiles;
  try { rawFiles = await client.listFiles(repository, revision, { signal }); }
  catch (error) {
    signal?.throwIfAborted();
    if (![401, 403].includes(error.status) && !info.gated && !info.private && !info.disabled) throw error;
    return { repository, revision, description: plainDescription(info.description ?? ''), license,
      url: `${HUGGING_FACE_ORIGIN}/${repository}/tree/${revision}`, gated: true,
      variants: [{ key: idFor(repository, revision, 'access-required'), id: idFor(repository, revision, 'access-required'),
        name: repository.split('/')[1], task: info.pipeline_tag ?? null, totalBytes: null, dtype: null,
        loadable: false, reason: 'This model requires access approval or authentication on Hugging Face; anonymous import is unavailable', package: null }] };
  }
  if (rawFiles.warning) warnings.push(rawFiles.warning);
  const files = rawFiles.map(normalizeHubFile), paths = new Set();
  for (const file of files) { if (paths.has(file.path)) throw new Error('Duplicate repository file path'); paths.add(file.path); }
  let description = plainDescription(info.description ?? info.cardData?.model_description ?? ''), config = null, configError;
  const readme = files.find((file) => file.path === 'README.md');
  if (readme && readme.size <= 128 * 1024) {
    try { description = plainDescription(await readVerifiedText(client, repository, revision, readme, signal, 128 * 1024)) || description; }
    catch (error) { signal?.throwIfAborted(); warnings.push(`Model card unavailable: ${error.message}`); }
  }
  const configFile = files.find((file) => file.path === 'config.json');
  if (configFile) {
    try {
      config = JSON.parse(await readVerifiedText(client, repository, revision, configFile, signal));
      if (!config || typeof config !== 'object' || Array.isArray(config)) throw new Error('Invalid model configuration');
    } catch (error) { signal?.throwIfAborted(); configError = error.message; }
  }
  const known = Object.values(catalog).filter((entry) => entry.repository === repository && entry.revision === revision);
  const accessRestricted = Boolean(info.gated || info.private || info.disabled);
  const variants = known.map((entry) => packageVariant(entry, { reason: accessRestricted
    ? 'This repository requires Hugging Face access approval; anonymous import is unavailable' : null }));
  const knownFiles = new Set(known.map((entry) => fingerprint(entry.files)));
  if (files.some((file) => file.path.endsWith('.onnx'))) {
    const onnx = resolveOnnxVariants({ repository, revision, description, license, files, config,
      gated: Boolean(info.gated || info.private || info.disabled) });
    for (const variant of onnx) {
      // Compare exact selected paths and immutable source digests, not model/repository names.
      const sameKnown = known.find((entry) => entry.model.runtime === 'transformers.js'
        && JSON.stringify(entry.model.dtype) === JSON.stringify(variant.model.dtype)
        && entry.files.every((file) => variant.files.some((candidate) => candidate.path === file.path && candidate.size === file.size
          && (file.sha256 ? file.sha256 === candidate.sha256 : file.gitBlobSha1 === candidate.gitBlobSha1)))
        && entry.files.length === variant.files.length);
      if (sameKnown || knownFiles.has(fingerprint(variant.files))) continue;
      if (configError) { variant.loadable = false; variant.reason = `Model configuration unavailable: ${configError}`; }
      variants.push(variant);
    }
  }
  const ggufs = files.filter((file) => /\.gguf$/i.test(file.path));
  if (ggufs.length) {
    const { inspectGgufHeader, resolveGgufHubProfile, GGUF_HUB_LIMITS } = await import('../../../../peercompute/src/peercompute/inference/gguf/hubAdmission.js');
    for (const file of ggufs.slice(0, MAX_VARIANTS)) {
      signal?.throwIfAborted();
      if (known.some((entry) => entry.files.some((item) => item.path === file.path && item.sha256 === file.sha256))) continue;
      const selected = [file, ...files.filter((item) => /^(README|LICENSE|NOTICE)(\.[A-Za-z0-9_-]+)?$/i.test(item.path))].sort((a,b) => a.path.localeCompare(b.path));
      let entry = basePackage(repository, revision, description, license, selected,
        { runtime: 'llama.cpp', task: 'text-generation', format: 'GGUF', dtype: 'unknown', modalities: ['text'], repository, revision }, file.path);
      let reason, requiresInspection = false;
      try {
        if (info.gated || info.private || info.disabled) throw new Error('This repository requires Hugging Face access approval; anonymous import is unavailable');
        if (/mmproj|vision|projector/i.test(file.path)) throw new Error('A vision projector is not a standalone text model');
        if (!file.sha256) throw new Error('GGUF requires an upstream whole-file SHA-256 digest');
        if (entry.totalBytes > GGUF_HUB_LIMITS.maximumBytes) throw new Error('Selected package exceeds the browser GGUF adapter’s 16 GiB file budget');
        if (/-\d{5}-of-\d{5}\.gguf$/i.test(file.path)) throw new Error('Split GGUF packages require complete shard admission and are not supported by this adapter');
        if (![entry.id, file.path].includes(selectedVariant ?? parsed.path)) {
          requiresInspection = true; reason = 'Select this variant to inspect its bounded GGUF header';
        } else {
          const header = await inspectGgufHeader({ size: file.size, signal,
            readRange: (offset, length, options) => client.readRange(repository, revision, file.path, offset, length, options) });
          const profile = resolveGgufHubProfile({ repository, revision, file, header });
          entry = basePackage(repository, revision, description, license, selected, profile.model, file.path);
        }
      } catch (error) {
        signal?.throwIfAborted(); reason = error.message;
      }
      const variant = packageVariant(entry, { reason });
      variant.filePath = file.path;
      if (requiresInspection) {
        variant.requiresInspection = true;
        variant.dtype = file.path.match(/(?:^|[._-])(Q\d(?:_[A-Z0-9]+)*|IQ\d(?:_[A-Z0-9]+)*|F16|F32|BF16)(?=\.|$)/i)?.[1]?.toLowerCase() ?? 'unknown';
        variant.precisionSource = 'filename';
      }
      variants.push(variant);
    }
    if (ggufs.length > MAX_VARIANTS) warnings.push(`Showing the first ${MAX_VARIANTS} GGUF files; this repository contains ${ggufs.length}.`);
  }
  if (!variants.length) {
    variants.push({ key: idFor(repository, revision, 'unsupported'), id: idFor(repository, revision, 'unsupported'),
      name: repository.split('/')[1], dtype: null, task: info.pipeline_tag ?? null, totalBytes: null, model: null, files: [],
      loadable: false, reason: info.gated ? 'This model requires access approval on Hugging Face' : 'No complete package for an admitted ONNX, standard GGUF, or catalog diffusion adapter was found', package: null });
  }
  return { repository, revision, description, license, url: `${HUGGING_FACE_ORIGIN}/${repository}/tree/${revision}`,
    variants, gated: accessRestricted, ...(warnings.length ? { warning: warnings.join(' ') } : {}), ...(info.cached || rawFiles.cached ? { cached: true } : {}) };
}
