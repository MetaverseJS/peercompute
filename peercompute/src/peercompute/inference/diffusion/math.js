// Fixed scheduler profiles for the two revision-pinned browser exports. These
// small latent transforms run on CPU; neural-network sessions require WebGPU.
export const LATENT_SIZE = 4 * 64 * 64;
export const SD_SIGMA = 14.6146;
export const LCM_TIMESTEPS = Object.freeze([999, 759, 499, 259]);

export function seededRandom(seed) {
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw new Error('Seed must be uint32');
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function gaussianLatents(random, scale = 1) {
  const output = new Float32Array(LATENT_SIZE);
  for (let i = 0; i < output.length; i += 2) {
    const radius = Math.sqrt(-2 * Math.log(Math.max(random(), Number.EPSILON))) * scale;
    const angle = 2 * Math.PI * random();
    output[i] = radius * Math.cos(angle); output[i + 1] = radius * Math.sin(angle);
  }
  return output;
}

function latent(value) {
  if (!(value instanceof Float32Array) || value.length !== LATENT_SIZE) throw new Error('Invalid diffusion latent tensor');
  for (const number of value) if (!Number.isFinite(number)) throw new Error('Nonfinite diffusion tensor');
  return value;
}

export function sdScaleInput(sample) {
  latent(sample);
  return sample.map((value) => value / Math.sqrt(SD_SIGMA ** 2 + 1));
}

export function sdStep(sample, noise) {
  latent(sample); latent(noise);
  return sample.map((value, index) => (value - SD_SIGMA * noise[index]) / 0.18215);
}

const alphas = (() => {
  const values = new Float64Array(1000); let product = 1;
  const start = Math.sqrt(0.00085), end = Math.sqrt(0.012);
  for (let i = 0; i < values.length; i++) {
    const beta = (start + (end - start) * i / (values.length - 1)) ** 2;
    product *= 1 - beta; values[i] = product;
  }
  return values;
})();

export function lcmStep(sample, noise, index, random) {
  latent(sample); latent(noise);
  if (!Number.isInteger(index) || index < 0 || index >= LCM_TIMESTEPS.length) throw new Error('Invalid LCM step');
  const timestep = LCM_TIMESTEPS[index], alpha = alphas[timestep];
  const scaled = timestep * 10;
  const skip = 0.25 / (scaled ** 2 + 0.25), out = scaled / Math.sqrt(scaled ** 2 + 0.25);
  const last = index === LCM_TIMESTEPS.length - 1;
  const nextAlpha = last ? 1 : alphas[LCM_TIMESTEPS[index + 1]];
  const freshNoise = last ? null : gaussianLatents(random);
  return sample.map((value, i) => {
    const original = (value - Math.sqrt(1 - alpha) * noise[i]) / Math.sqrt(alpha);
    const denoised = out * original + skip * value;
    return last ? denoised : Math.sqrt(nextAlpha) * denoised + Math.sqrt(1 - nextAlpha) * freshNoise[i];
  });
}

export function rgbaFromNchw(values, dims) {
  if (!(values instanceof Float32Array) || !Array.isArray(dims)
      || dims.length !== 4 || dims[0] !== 1 || dims[1] !== 3 || dims[2] !== 512 || dims[3] !== 512
      || values.length !== 3 * 512 * 512) throw new Error('Diffusion decoder must produce float32 [1,3,512,512]');
  const pixels = 512 * 512, data = new Uint8Array(pixels * 4);
  for (let i = 0; i < pixels; i++) {
    for (let channel = 0; channel < 3; channel++) {
      const value = values[channel * pixels + i];
      if (!Number.isFinite(value)) throw new Error('Diffusion decoder produced nonfinite pixels');
      data[i * 4 + channel] = Math.round(Math.min(1, Math.max(0, value / 2 + 0.5)) * 255);
    }
    data[i * 4 + 3] = 255;
  }
  return { width: 512, height: 512, channels: 4, data };
}
