/**
 * Run explicitly CPU/worker-only work in the foreground service's admitted
 * window. GPU-mixed work must not use this helper: its existing cooperative
 * command-duty boundary owns ordering instead.
 */
export async function withForegroundScope(options, phase, work) {
  options?.signal?.throwIfAborted();
  if (typeof work !== 'function') throw new TypeError('foreground scope work must be a function');
  if (typeof options?.withForeground !== 'function') return await work();
  return await options.withForeground(phase, work);
}
