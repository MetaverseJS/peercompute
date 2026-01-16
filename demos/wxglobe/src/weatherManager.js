import { getDataSource } from './dataSources.js';

/**
 * WeatherManager scaffolds dataset selection and loading.
 * For now it returns stubbed sample layers shaped like the expected output
 * while preserving the fetch/URL-building flow so real decoding can be slotted in.
 */
export class WeatherManager {
  constructor({ onStatus } = {}) {
    this.onStatus = onStatus || (() => {});
    this.current = null;
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

    // Handle local GRIB2 files
    if (src.type === 'local-grib2') {
      return this.fetchLocalGrib2(url, src, options);
    }

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
      return this.stubSurface(url, src);
    }

    // Surface-only sources remain stubbed for now.
    return this.stubSurface(url, src);
  }

  async fetchLocalGrib2(url, src, options = {}) {
    const levels = options.requestedLevels || [1000, 850, 700, 500, 300, 250, 200];
    const stride = options.stride || 4;
    const local = this.parseLocalPattern(src);
    const endpoint = new URL('/api/grib2', window.location.origin);
    endpoint.searchParams.set('region', local.region);
    endpoint.searchParams.set('model', local.model);
    endpoint.searchParams.set('variant', local.variant);
    endpoint.searchParams.set('levels', levels.join(','));
    endpoint.searchParams.set('stride', String(stride));
    if (options.hour != null) {
      endpoint.searchParams.set('hour', String(options.hour).padStart(2, '0'));
    }

    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error(`fetch failed ${res.status}`);
    }
    const buffer = await res.arrayBuffer();
    return this.unpackWindResponse(buffer, endpoint.toString());
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

  parseLocalPattern(src) {
    const urlPattern = src.urlPattern || '';
    const match = urlPattern.match(/\/weather-data\/([^/]+)\/([^/]+)\.t\{HH\}z\.([^.]+)\.grib2$/);
    if (match) {
      return {
        region: match[1].toLowerCase(),
        model: match[2],
        variant: match[3]
      };
    }
    return {
      region: (src.region || 'conus').toLowerCase(),
      model: 'rtma3d',
      variant: 'anl_prslev'
    };
  }

  unpackWindResponse(buffer, urlUsed) {
    const view = new DataView(buffer);
    const headerLength = view.getUint32(0, true);
    const headerBytes = new Uint8Array(buffer, 4, headerLength);
    const header = JSON.parse(new TextDecoder().decode(headerBytes));
    if (!header?.ok) {
      throw new Error(header?.error || 'invalid wind payload');
    }
    const padding = (4 - (headerLength % 4)) % 4;
    const dataStart = 4 + headerLength + padding;
    const floats = new Float32Array(buffer, dataStart);
    const levels = header.levels.map((lvl) => ({
      level: lvl.level,
      nx: lvl.nx,
      ny: lvl.ny,
      lon: lvl.lon,
      lat: lvl.lat,
      u: floats.subarray(lvl.u.offset, lvl.u.offset + lvl.u.length),
      v: floats.subarray(lvl.v.offset, lvl.v.offset + lvl.v.length),
      hgt: lvl.hgt ? floats.subarray(lvl.hgt.offset, lvl.hgt.offset + lvl.hgt.length) : null
    }));

    return {
      urlUsed,
      grid: {
        levels,
        meta: header.meta
      },
      note: 'Local GRIB2 via Vite server'
    };
  }
}
