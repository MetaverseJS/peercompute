import { clamp, deepFreeze } from './internal.js';

export async function pulseGamepad(gamepad, {
  intensity = 0.5,
  duration = 35,
  strongMagnitude = intensity,
  weakMagnitude = intensity,
} = {}) {
  const normalizedDuration = Math.max(0, Math.min(5000, Number(duration) || 0));
  const normalizedIntensity = clamp(intensity, 0, 1);
  const results = [];
  for (const actuator of Array.from(gamepad?.hapticActuators ?? [])) {
    if (typeof actuator?.pulse !== 'function') continue;
    try {
      const accepted = await actuator.pulse(normalizedIntensity, normalizedDuration);
      results.push({ api: 'pulse', ok: accepted !== false });
    } catch (error) {
      results.push({ api: 'pulse', ok: false, error: error?.name ?? 'Error' });
    }
  }
  if (results.length === 0 && typeof gamepad?.vibrationActuator?.playEffect === 'function') {
    try {
      const accepted = await gamepad.vibrationActuator.playEffect('dual-rumble', {
        duration: normalizedDuration,
        startDelay: 0,
        strongMagnitude: clamp(strongMagnitude, 0, 1),
        weakMagnitude: clamp(weakMagnitude, 0, 1),
      });
      results.push({ api: 'dual-rumble', ok: accepted !== false });
    } catch (error) {
      results.push({ api: 'dual-rumble', ok: false, error: error?.name ?? 'Error' });
    }
  }
  return deepFreeze({
    supported: results.length > 0,
    ok: results.some((result) => result.ok),
    duration: normalizedDuration,
    intensity: normalizedIntensity,
    results,
  });
}

export async function stopGamepadHaptics(gamepad) {
  const operations = [];
  for (const actuator of Array.from(gamepad?.hapticActuators ?? [])) {
    if (typeof actuator?.reset === 'function') operations.push(Promise.resolve().then(() => actuator.reset()));
  }
  if (typeof gamepad?.vibrationActuator?.reset === 'function') {
    operations.push(Promise.resolve().then(() => gamepad.vibrationActuator.reset()));
  }
  const results = await Promise.allSettled(operations);
  return deepFreeze({ supported: operations.length > 0, stopped: results.filter((entry) => entry.status === 'fulfilled').length });
}

export class XRHaptics {
  #registry;
  #disposed = false;

  constructor({ registry } = {}) {
    if (!registry?.getEntries) throw new TypeError('registry is required');
    this.#registry = registry;
  }

  async pulse({ handedness, role = 'controller', ...options } = {}) {
    if (this.#disposed) throw new Error('XRHaptics is disposed');
    const entries = this.#registry.getEntries({ handedness, role });
    const results = await Promise.all(entries.map(async (entry) => ({
      entryId: entry.id,
      result: await pulseGamepad(entry.inputSource.gamepad, options),
    })));
    return deepFreeze({
      matched: entries.length,
      pulsed: results.filter((entry) => entry.result.ok).length,
      results,
    });
  }

  async stopAll() {
    const results = await Promise.all(this.#registry.getEntries().map(async (entry) => ({
      entryId: entry.id,
      result: await stopGamepadHaptics(entry.inputSource.gamepad),
    })));
    return deepFreeze(results);
  }

  async dispose() {
    if (this.#disposed) return;
    await this.stopAll();
    this.#disposed = true;
  }
}
