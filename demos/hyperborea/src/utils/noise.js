export class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }

  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

export class SimplexNoise {
  constructor(seed) {
    const rng = new SeededRandom(seed);
    this.perm = [];
    for (let i = 0; i < 256; i++) this.perm[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rng.next() * (i + 1));
      [this.perm[i], this.perm[j]] = [this.perm[j], this.perm[i]];
    }
    this.perm = [...this.perm, ...this.perm];
  }

  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(t, a, b) {
    return a + t * (b - a);
  }

  grad(hash, x, y) {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
  }

  noise(x, y) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const dx = x - Math.floor(x);
    const dy = y - Math.floor(y);
    const u = this.fade(dx);
    const v = this.fade(dy);
    const a = this.perm[X] + Y;
    const b = this.perm[X + 1] + Y;
    return this.lerp(
      v,
      this.lerp(u, this.grad(this.perm[a], dx, dy), this.grad(this.perm[b], dx - 1, dy)),
      this.lerp(
        u,
        this.grad(this.perm[a + 1], dx, dy - 1),
        this.grad(this.perm[b + 1], dx - 1, dy - 1)
      )
    );
  }

  octave(x, y, octaves, persistence, scale) {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;
    for (let i = 0; i < octaves; i++) {
      total += this.noise(x * frequency / scale, y * frequency / scale) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= 2;
    }
    return total / maxValue;
  }
}
