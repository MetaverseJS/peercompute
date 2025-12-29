import { sampleDataTextureRGBA } from './utils.js';

const DEFAULT_MAX_WIND = 60;

function decodeWind(value, maxWind) {
    return ((value / 255) - 0.5) * 2 * maxWind;
}

export function decodeWindFieldFromAuxTexture(auxTexture, gridW, gridH, options = {}) {
    const img = auxTexture?.image;
    const data = img?.data;
    const w = img?.width ?? 0;
    const h = img?.height ?? 0;
    const maxWind = Number.isFinite(options.maxWind) ? options.maxWind : DEFAULT_MAX_WIND;
    const scale = Number.isFinite(options.scale) ? options.scale : 1;
    if (!data || !w || !h || !gridW || !gridH) return null;

    const cellCount = gridW * gridH;
    const field = options.out && options.out.length >= cellCount * 2
        ? options.out
        : new Float32Array(cellCount * 2);

    if (w === gridW && h === gridH) {
        for (let i = 0; i < cellCount; i++) {
            const idx = i * 4;
            field[i * 2] = decodeWind(data[idx + 2] ?? 0, maxWind) * scale;
            field[i * 2 + 1] = decodeWind(data[idx + 3] ?? 0, maxWind) * scale;
        }
        return field;
    }

    for (let y = 0; y < gridH; y++) {
        const v = (y + 0.5) / gridH;
        for (let x = 0; x < gridW; x++) {
            const u = (x + 0.5) / gridW;
            const px = sampleDataTextureRGBA(auxTexture, u, v);
            const i = (y * gridW + x) * 2;
            field[i] = decodeWind(px.b ?? 0, maxWind) * scale;
            field[i + 1] = decodeWind(px.a ?? 0, maxWind) * scale;
        }
    }

    return field;
}
