import { getDataSource } from './dataSources.js';
const weatherWorkerUrl = new URL('./weatherWorker.js', import.meta.url);

/**
 * WeatherManager scaffolds dataset selection and loading.
 * For now it returns stubbed sample layers shaped like the expected output
 * while preserving the fetch/URL-building flow so real decoding can be slotted in.
 */
export class WeatherManager {
  constructor({ onStatus } = {}) {
    this.onStatus = onStatus || (() => {});
    this.current = null;
    this.worker = null;
  }

  /**
   * Load a dataset by id. Returns a structured object with layers array.
   * Real GRIB/NetCDF decoding can be slotted into fetchAndDecode().
   */
  async load(id, options = {}) {
    const src = getDataSource(id);
    if (!src) {
      throw new Error(`Unknown source ${id}`);
    }
    this.onStatus(`loading ${src.title}`);
    const result = await this.fetchAndDecode(src, options);
    this.current = { src, result };
    this.onStatus(`loaded ${src.title}`);
    return { src, result };
  }

  async fetchAndDecode(src, options) {
    // Build a URL (optionally filter) to show the planned access pattern.
    const now = options.time || new Date();
    const YYYY = now.getUTCFullYear().toString();
    const MM = String(now.getUTCMonth() + 1).padStart(2, '0');
    const DD = String(now.getUTCDate()).padStart(2, '0');
    const HH = String(now.getUTCHours()).padStart(2, '0');
    let url = src.urlPattern.replace('{YYYYMMDD}', `${YYYY}${MM}${DD}`).replace('{HH}', HH);

    if (src.id === 'rap-130-pressure') {
      // Use NOMADS filter to request a small NetCDF subset (CONUS box) to keep payloads light.
      const dir = encodeURIComponent(`/rap.${YYYY}${MM}${DD}`);
      const file = `rap.t${HH}z.awp130pgrbf00.grib2`;
      const params = [
        `file=${file}`,
        'lev_1000_mb=on',
        'lev_850_mb=on',
        'lev_700_mb=on',
        'lev_500_mb=on',
        'var_UGRD=on',
        'var_VGRD=on',
        'var_HGT=on',
        'leftlon=220',
        'rightlon=310',
        'toplat=60',
        'bottomlat=10',
        'dir=' + dir,
        'format=netcdf'
      ].join('&');
      url = `https://nomads.ncep.noaa.gov/cgi-bin/filter_rap.pl?${params}`;
    }

    if (src.id === 'rap-130-pressure') {
      return this.decodeWithWorker(url, src);
    }

    // Surface-only sources remain stubbed for now.
    return this.stubSurface(url, src);
  }

  stubSurface(url, src) {
    const stubLevels = [0];
    const stubGrid = {
      bounds: { west: -125, south: 25, east: -66, north: 49 },
      resolutionKm: src.resolution,
      levels: stubLevels.map((level) => ({
        level,
        u: 10 + Math.random() * 5,
        v: 5 + Math.random() * 5,
        hgt: 0
      }))
    };
    return { urlPlanned: url, grid: stubGrid, note: 'Surface stub placeholder.' };
  }

  ensureWorker() {
    if (!this.worker) {
      this.worker = new Worker(weatherWorkerUrl, { type: 'module' });
    }
    return this.worker;
  }

  decodeWithWorker(url, src) {
    const worker = this.ensureWorker();
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('weather decode timeout')), 20000);
      const handler = (evt) => {
        const data = evt.data;
        if (data?.error) {
          clearTimeout(timeout);
          worker.removeEventListener('message', handler);
          reject(new Error(data.error));
        } else if (data?.ok) {
          clearTimeout(timeout);
          worker.removeEventListener('message', handler);
          resolve({
            urlUsed: url,
            grid: {
              lon: data.lon,
              lat: data.lat,
              levels: data.levels,
              meta: data.meta
            },
            note: 'Live RAP subset via NOMADS filter (netcdf)'
          });
        }
      };
      worker.addEventListener('message', handler);
      worker.postMessage({ url, levels: [1000, 850, 700, 500] });
    });
  }
}
