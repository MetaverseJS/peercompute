const affectedVersion = '4.3.2';
const affectedModels = new Set(['qwen3_5', 'qwen3_5_text']);
const installed = new WeakMap();
const methodName = '_get_text_only_rope_index';

function positionResult(result, batch, length) {
  const [positions, deltas] = result ?? [];
  if (positions?.type !== 'int64' || deltas?.type !== 'int64'
      || positions.dims?.length !== 3 || positions.dims[0] !== 3
      || positions.dims[1] !== batch || positions.dims[2] !== length
      || deltas.dims?.length !== 2 || deltas.dims[0] !== batch || deltas.dims[1] !== 1
      || positions.data?.length !== 3 * batch * length || deltas.data?.length !== batch) {
    throw new Error('Unsupported Qwen text position result');
  }
  return { positions, deltas };
}

/** Instance-local compatibility for the pinned Transformers.js text-only RoPE
 * sign error. Vision position calculation does not call this method. The Python
 * reference uses max(position) + 1 - sequence_length; 4.3.2 instead adds length,
 * placing continuation tokens at 3L rather than L for an unpadded prompt.
 * https://github.com/huggingface/transformers/blob/main/src/transformers/models/qwen3_5/modeling_qwen3_5.py
 */
export function installQwenTextRopeCompatibility(model, library) {
  if (library?.env?.version !== affectedVersion || !affectedModels.has(model?.config?.model_type)) return false;
  if (installed.has(model)) {
    if (model[methodName] !== installed.get(model)) throw new Error('Qwen text position compatibility was replaced');
    return true;
  }
  const original = model[methodName];
  if (typeof original !== 'function' || typeof library.Tensor !== 'function') {
    throw new Error('Qwen text position compatibility is unavailable');
  }

  // Inspect actual runtime behavior, not minified function text. A repaired
  // 4.3.2 build is left alone; an unknown implementation is never blindly offset.
  const ids = new library.Tensor('int64', [10n, 11n], [1, 2]);
  const mask = new library.Tensor('int64', [1n, 1n], [1, 2]);
  let probe;
  try {
    probe = original.call(model, ids, mask);
    const { positions, deltas } = positionResult(probe, 1, 2);
    if ([...positions.data].some((value, index) => value !== BigInt(index % 2))) {
      throw new Error('Unsupported Qwen text position calculation');
    }
    if (deltas.data[0] === 0n) return false;
    if (deltas.data[0] !== 4n) throw new Error('Unsupported Qwen text position offset');
  } finally {
    for (const tensor of new Set([ids, mask, ...(Array.isArray(probe) ? probe : [])])) tensor?.dispose?.();
  }

  function correctedTextRope(inputIds, attentionMask) {
    const result = original.call(this, inputIds, attentionMask);
    if (!attentionMask) return result;
    try {
      const [batch, length] = attentionMask.dims ?? [];
      if (attentionMask.dims?.length !== 2 || !Number.isSafeInteger(batch) || batch < 1
          || !Number.isSafeInteger(length) || length < 1) throw new Error('Invalid Qwen text position dimensions');
      const { positions, deltas } = positionResult(result, batch, length);
      // Check every row before mutating the newly returned CPU delta tensor.
      // Padded positions use the upstream mask semantics, including their max;
      // replacing this with a count of mask bits changes one-token padded rows.
      for (let row = 0; row < batch; row++) {
        let maximum = positions.data[row * length];
        for (let column = 1; column < length; column++) {
          const value = positions.data[row * length + column];
          if (value > maximum) maximum = value;
        }
        if (deltas.data[row] !== maximum + 1n + BigInt(length)) {
          throw new Error('Qwen text position behavior changed');
        }
      }
      const correction = 2n * BigInt(length);
      for (let row = 0; row < batch; row++) deltas.data[row] -= correction;
      return result;
    } catch (error) {
      for (const tensor of new Set(Array.isArray(result) ? result : [])) tensor?.dispose?.();
      throw error;
    }
  }
  Object.defineProperty(model, methodName, { value: correctedTextRope, configurable: true, writable: true });
  installed.set(model, correctedTextRope);
  return true;
}
