import { NetCDFReader } from 'netcdfjs';

// Heuristics to find variable names in NOMADS RAP NetCDF subset
function findVar(reader, patterns) {
  const vars = reader.variables.map((v) => v.name.toLowerCase());
  for (const pat of patterns) {
    const idx = vars.findIndex((v) => v.includes(pat));
    if (idx !== -1) return reader.variables[idx].name;
  }
  return null;
}

function sampleField(data, nx, ny, stride) {
  const samples = [];
  for (let j = 0; j < ny; j += stride) {
    for (let i = 0; i < nx; i += stride) {
      samples.push(data[j * nx + i]);
    }
  }
  return samples;
}

self.onmessage = async (evt) => {
  const { url, levels } = evt.data || {};
  if (!url) {
    self.postMessage({ error: 'missing url' });
    return;
  }
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`fetch failed ${res.status}`);
    const buf = await res.arrayBuffer();
    const reader = new NetCDFReader(new DataView(buf));

    const lonName = findVar(reader, ['lon']);
    const latName = findVar(reader, ['lat']);
    const levName = findVar(reader, ['isbl', 'lv', 'lev']);
    const ugrdName = findVar(reader, ['ugrd']);
    const vgrdName = findVar(reader, ['vgrd']);
    const hgtName = findVar(reader, ['hgt']);

    if (!lonName || !latName || !levName || !ugrdName || !vgrdName || !hgtName) {
      throw new Error('missing expected variables in NetCDF');
    }

    const lon = reader.getDataVariable(lonName);
    const lat = reader.getDataVariable(latName);
    const lev = reader.getDataVariable(levName);
    const ugrd = reader.getDataVariable(ugrdName);
    const vgrd = reader.getDataVariable(vgrdName);
    const hgt = reader.getDataVariable(hgtName);

    // Expect ugrd/vgrd/hgt dimensions [level, lat, lon]
    const nx = lon.length;
    const ny = lat.length;
    const nlev = lev.length;

    // Reduce to a manageable sample count
    const targetSamples = 2500;
    const stride = Math.max(1, Math.ceil(Math.sqrt((nx * ny) / targetSamples)));

    const levelsOut = [];
    for (let li = 0; li < nlev; li++) {
      const offset = li * nx * ny;
      const uSlice = ugrd.subarray(offset, offset + nx * ny);
      const vSlice = vgrd.subarray(offset, offset + nx * ny);
      const hSlice = hgt.subarray(offset, offset + nx * ny);
      levelsOut.push({
        level: lev[li],
        u: sampleField(uSlice, nx, ny, stride),
        v: sampleField(vSlice, nx, ny, stride),
        hgt: sampleField(hSlice, nx, ny, stride)
      });
    }

    self.postMessage({
      ok: true,
      meta: { nx, ny, nlev, stride, url },
      lon: sampleField(lon, nx, 1, stride),
      lat: sampleField(lat, 1, ny, stride),
      levels: levelsOut
    });
  } catch (err) {
    self.postMessage({ error: err.message || String(err) });
  }
};
