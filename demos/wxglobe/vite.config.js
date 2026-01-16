import { createRequire } from 'module';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureDevHttpsCert } from '../../scripts/https.mjs';
import fs from 'fs';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const peercomputeRoot = path.resolve(__dirname, '../../peercompute');
const cesiumPkg = path.dirname(require.resolve('cesium/package.json', { paths: [__dirname] }));
const cesiumBuild = path.resolve(cesiumPkg, 'Build/Cesium');

function resolveWeatherDataPath(candidates) {
  for (const candidate of candidates) {
    if (!candidate) continue;
    const fullPath = path.isAbsolute(candidate) ? candidate : path.resolve(__dirname, candidate);
    if (fs.existsSync(fullPath)) {
      return fs.realpathSync(fullPath);
    }
  }
  return null;
}

const weatherDataPath = resolveWeatherDataPath([
  process.env.WXGLOBE_WEATHER_PATH,
  process.env.WXDATA_PATH,
  'wxdata',
  '/media/cos/NO_LABEL/3drtma'
]);

const DEFAULT_WIND_LEVELS = [1000, 850, 700, 500, 300, 250, 200];

function parseLevelsParam(levelsParam) {
  if (!levelsParam) return DEFAULT_WIND_LEVELS;
  const parsed = levelsParam
    .split(',')
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value));
  return parsed.length ? parsed : DEFAULT_WIND_LEVELS;
}

function normalizePressureLevel(value) {
  if (!Number.isFinite(value)) return null;
  const normalized = value > 2000 ? value / 100 : value;
  return Math.round(normalized);
}

function findLatestGribFile(dirPath, model, variant) {
  if (!fs.existsSync(dirPath)) return null;
  const pattern = new RegExp(`^${model}\\.t\\d{2}z\\.${variant}\\.grib2$`);
  const files = fs.readdirSync(dirPath).filter((file) => pattern.test(file));
  if (!files.length) return null;
  let newest = files[0];
  let newestTime = fs.statSync(path.join(dirPath, newest)).mtimeMs;
  for (let i = 1; i < files.length; i += 1) {
    const candidate = files[i];
    const stat = fs.statSync(path.join(dirPath, candidate));
    if (stat.mtimeMs > newestTime) {
      newest = candidate;
      newestTime = stat.mtimeMs;
    }
  }
  return newest;
}

function decimateGrid(values, nx, ny, stride) {
  const step = Math.max(1, stride);
  const outNx = Math.max(2, Math.floor((nx - 1) / step) + 1);
  const outNy = Math.max(2, Math.floor((ny - 1) / step) + 1);
  const out = new Float32Array(outNx * outNy);
  for (let y = 0; y < outNy; y += 1) {
    const srcY = Math.min(y * step, ny - 1);
    const rowOffset = srcY * nx;
    for (let x = 0; x < outNx; x += 1) {
      const srcX = Math.min(x * step, nx - 1);
      out[y * outNx + x] = values[rowOffset + srcX];
    }
  }
  return { data: out, nx: outNx, ny: outNy };
}

export default defineConfig({
  base: './',
  server: {
    https: ensureDevHttpsCert(),
    fs: {
      allow: [__dirname, peercomputeRoot, ...(weatherDataPath ? [weatherDataPath] : [])]
    },
    middlewareMode: false
  },
  plugins: [
    {
      name: 'weather-data-server',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url.startsWith('/api/grib2')) {
            if (!weatherDataPath) {
              res.statusCode = 503;
              res.end('Weather data path not configured. Set WXGLOBE_WEATHER_PATH or create ./wxdata.');
              return;
            }

            try {
              const url = new URL(req.url, 'http://localhost');
              const region = (url.searchParams.get('region') || 'conus').toLowerCase();
              const model = url.searchParams.get('model') || 'rtma3d';
              const variant = url.searchParams.get('variant') || 'anl_prslev';
              const levels = parseLevelsParam(url.searchParams.get('levels'));
              const strideRaw = Number.parseInt(url.searchParams.get('stride') || '4', 10);
              const stride = Number.isFinite(strideRaw) ? Math.min(Math.max(strideRaw, 1), 20) : 4;
              const hourParam = url.searchParams.get('hour');
              const hour = hourParam ? hourParam.padStart(2, '0') : null;
              const fileParam = url.searchParams.get('file');

              if (fileParam && (fileParam.includes('/') || fileParam.includes('..'))) {
                res.statusCode = 400;
                res.end('Invalid file parameter');
                return;
              }

              const dirPath = path.join(weatherDataPath, region);
              let fileName = fileParam;
              if (!fileName && hour) {
                fileName = `${model}.t${hour}z.${variant}.grib2`;
              }
              if (!fileName) {
                fileName = findLatestGribFile(dirPath, model, variant);
              }

              if (!fileName) {
                res.statusCode = 404;
                res.end('No matching GRIB2 files found');
                return;
              }

              const filePath = path.join(dirPath, fileName);
              if (!fs.existsSync(filePath)) {
                res.statusCode = 404;
                res.end('GRIB2 file not found');
                return;
              }

              const gribModule = await import('grib-js');
              const grib = gribModule.default || gribModule;
              const fileBuffer = await fs.promises.readFile(filePath);
              const messages = await new Promise((resolve, reject) => {
                grib.readData(fileBuffer, (err, msgs) => {
                  if (err) reject(err);
                  else resolve(msgs);
                });
              });

              const converted = grib.convertData(messages);
              const byVariable = {};
              for (const msg of converted) {
                const varName = msg.header.parameterNumberName;
                const levelValue = normalizePressureLevel(msg.header.surface1Value);
                if (!varName || !Number.isFinite(levelValue)) continue;
                if (!byVariable[varName]) {
                  byVariable[varName] = {};
                }
                byVariable[varName][levelValue] = msg;
              }

              const levelsOut = [];
              const buffers = [];
              let floatOffset = 0;

              for (const level of levels) {
                const ugrdMsg = byVariable['U component of wind']?.[level];
                const vgrdMsg = byVariable['V component of wind']?.[level];
                const hgtMsg = byVariable['Geopotential height']?.[level];
                if (!ugrdMsg || !vgrdMsg) continue;
                if (!ugrdMsg.data?.values || !vgrdMsg.data?.values) continue;

                const nx = ugrdMsg.header.nx;
                const ny = ugrdMsg.header.ny;
                const uOut = decimateGrid(ugrdMsg.data.values, nx, ny, stride);
                const vOut = decimateGrid(vgrdMsg.data.values, nx, ny, stride);
                const hOut = hgtMsg?.data?.values
                  ? decimateGrid(hgtMsg.data.values, nx, ny, stride)
                  : null;

                levelsOut.push({
                  level,
                  nx: uOut.nx,
                  ny: uOut.ny,
                  lon: [ugrdMsg.header.lo1, ugrdMsg.header.lo2],
                  lat: [ugrdMsg.header.la1, ugrdMsg.header.la2],
                  u: { offset: floatOffset, length: uOut.data.length },
                  v: { offset: floatOffset + uOut.data.length, length: vOut.data.length },
                  hgt: hOut
                    ? { offset: floatOffset + uOut.data.length + vOut.data.length, length: hOut.data.length }
                    : null
                });

                buffers.push(uOut.data, vOut.data);
                floatOffset += uOut.data.length + vOut.data.length;
                if (hOut) {
                  buffers.push(hOut.data);
                  floatOffset += hOut.data.length;
                }
              }

              if (!levelsOut.length) {
                res.statusCode = 422;
                res.end('No wind levels found in GRIB2 file');
                return;
              }

              const header = {
                ok: true,
                meta: {
                  file: fileName,
                  region,
                  model,
                  variant,
                  stride,
                  levelsFound: levelsOut.map((lvl) => lvl.level)
                },
                levels: levelsOut
              };

              const headerBytes = Buffer.from(JSON.stringify(header));
              const padding = (4 - (headerBytes.length % 4)) % 4;
              const headerLength = Buffer.alloc(4);
              headerLength.writeUInt32LE(headerBytes.length, 0);

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/octet-stream');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.write(headerLength);
              res.write(headerBytes);
              if (padding) {
                res.write(Buffer.alloc(padding));
              }
              for (const chunk of buffers) {
                res.write(Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength));
              }
              res.end();
              return;
            } catch (err) {
              console.error('[wxglobe] GRIB2 parse failed', err);
              res.statusCode = 500;
              res.end('Failed to parse GRIB2');
              return;
            }
          }

          if (req.url.startsWith('/weather-data/')) {
            if (!weatherDataPath) {
              res.statusCode = 503;
              res.end('Weather data path not configured. Set WXGLOBE_WEATHER_PATH or create ./wxdata.');
              return;
            }
            const relative = decodeURIComponent(req.url.replace('/weather-data/', ''));
            const filePath = path.join(weatherDataPath, relative);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              const stat = fs.statSync(filePath);
              res.setHeader('Content-Length', stat.size);
              res.setHeader('Content-Type', 'application/octet-stream');
              res.setHeader('Access-Control-Allow-Origin', '*');
              const stream = fs.createReadStream(filePath);
              stream.pipe(res);
            } else {
              res.statusCode = 404;
              res.end('Not found');
            }
          } else {
            next();
          }
        });
      }
    },
    viteStaticCopy({
      targets: [
        { src: path.join(cesiumBuild, 'Workers'), dest: 'cesium' },
        { src: path.join(cesiumBuild, 'ThirdParty'), dest: 'cesium' },
        { src: path.join(cesiumBuild, 'Assets'), dest: 'cesium' },
        { src: path.join(cesiumBuild, 'Widgets'), dest: 'cesium' }
      ]
    })
  ],
  resolve: {
    alias: {
      '@peercompute': path.resolve(peercomputeRoot, 'src/peercompute/index.js')
    }
  },
  define: {
    CESIUM_BASE_URL: JSON.stringify('/cesium')
  },
  build: {
    chunkSizeWarningLimit: 2000
  }
});
