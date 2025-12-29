const FACE_NAMES = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
const FACE_COUNT = 6;

function normalizeVec3(x, y, z) {
    const len = Math.sqrt(x * x + y * y + z * z) || 1;
    return [x / len, y / len, z / len];
}

function writeVec3(out, x, y, z) {
    if (out && typeof out === 'object') {
        if (Array.isArray(out) || out instanceof Float32Array) {
            out[0] = x;
            out[1] = y;
            out[2] = z;
            return out;
        }
        out.x = x;
        out.y = y;
        out.z = z;
        return out;
    }
    return { x, y, z };
}

export const CUBE_FACE_NAMES = FACE_NAMES.slice();
export const CUBE_FACE_COUNT = FACE_COUNT;

// Map face + UV (0-1) to a normalized direction on the unit sphere.
export function faceUvToDirection(face, u, v, out) {
    const uu = (u * 2) - 1;
    const vv = (v * 2) - 1;
    let x = 0;
    let y = 0;
    let z = 0;
    switch (face) {
        case 0: // +X
            x = 1;
            y = vv;
            z = -uu;
            break;
        case 1: // -X
            x = -1;
            y = vv;
            z = uu;
            break;
        case 2: // +Y
            x = uu;
            y = 1;
            z = -vv;
            break;
        case 3: // -Y
            x = uu;
            y = -1;
            z = vv;
            break;
        case 4: // +Z
            x = uu;
            y = vv;
            z = 1;
            break;
        case 5: // -Z
            x = -uu;
            y = vv;
            z = -1;
            break;
        default:
            return writeVec3(out, 0, 0, 1);
    }
    const norm = normalizeVec3(x, y, z);
    return writeVec3(out, norm[0], norm[1], norm[2]);
}

// Map a direction vector to a cubed-sphere face + UV (0-1).
export function directionToFaceUv(x, y, z, out = {}) {
    const ax = Math.abs(x);
    const ay = Math.abs(y);
    const az = Math.abs(z);
    let face = 0;
    let u = 0.5;
    let v = 0.5;

    if (ax >= ay && ax >= az) {
        if (x >= 0) {
            face = 0;
            u = (-z / ax + 1) * 0.5;
            v = (y / ax + 1) * 0.5;
        } else {
            face = 1;
            u = (z / ax + 1) * 0.5;
            v = (y / ax + 1) * 0.5;
        }
    } else if (ay >= az) {
        if (y >= 0) {
            face = 2;
            u = (x / ay + 1) * 0.5;
            v = (-z / ay + 1) * 0.5;
        } else {
            face = 3;
            u = (x / ay + 1) * 0.5;
            v = (z / ay + 1) * 0.5;
        }
    } else {
        if (z >= 0) {
            face = 4;
            u = (x / az + 1) * 0.5;
            v = (y / az + 1) * 0.5;
        } else {
            face = 5;
            u = (-x / az + 1) * 0.5;
            v = (y / az + 1) * 0.5;
        }
    }

    out.face = face;
    out.u = u;
    out.v = v;
    return out;
}

export function createCubedSphereGrid(resolution, options = {}) {
    const res = Math.max(2, Math.floor(Number(resolution) || 2));
    const channels = Math.max(1, Math.floor(Number(options.channels) || 1));
    const faces = Array.from({ length: FACE_COUNT }, (_, index) => ({
        index,
        name: FACE_NAMES[index],
        resolution: res,
        channels,
        data: new Float32Array(res * res * channels)
    }));

    return {
        resolution: res,
        channels,
        faces
    };
}
