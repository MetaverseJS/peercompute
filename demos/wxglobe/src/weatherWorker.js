import gribJs from 'grib-js';

self.onmessage = async (evt) => {
  const { url, type, requestedLevels } = evt.data || {};
  if (!url) {
    self.postMessage({ error: 'missing url' });
    return;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`fetch failed ${res.status}`);
    const buf = await res.arrayBuffer();

    // Parse GRIB2 data
    gribJs.readData(new DataView(buf), (err, messages) => {
      if (err) {
        self.postMessage({ error: err.message || String(err) });
        return;
      }

      console.log(`[weatherWorker] Parsed ${messages.length} GRIB2 messages`);

      // Convert to more usable format
      const converted = gribJs.convertData(messages);

      // Group by variable and pressure level
      const byVariable = {};
      for (const msg of converted) {
        const varName = msg.header.parameterNumberName;
        const level = msg.header.surface1Value;
        const levelType = msg.header.surface1TypeName;

        if (!byVariable[varName]) {
          byVariable[varName] = {};
        }
        if (!byVariable[varName][level]) {
          byVariable[varName][level] = msg;
        }
      }

      // Extract wind data (UGRD/VGRD) at requested pressure levels
      const targetLevels = requestedLevels || [1000, 850, 700, 500, 300];
      const levelsOut = [];

      for (const pressureLevel of targetLevels) {
        const ugrdMsg = byVariable['U component of wind']?.[pressureLevel];
        const vgrdMsg = byVariable['V component of wind']?.[pressureLevel];
        const hgtMsg = byVariable['Geopotential height']?.[pressureLevel];

        if (ugrdMsg && vgrdMsg) {
          const lon0 = ugrdMsg.data.lo1 ?? ugrdMsg.header.lo1;
          const lon1 = ugrdMsg.data.lo2 ?? ugrdMsg.header.lo2;
          const lat0 = ugrdMsg.data.la1 ?? ugrdMsg.header.la1;
          const lat1 = ugrdMsg.data.la2 ?? ugrdMsg.header.la2;
          levelsOut.push({
            level: pressureLevel,
            u: ugrdMsg.data.values,
            v: vgrdMsg.data.values,
            hgt: hgtMsg?.data.values || null,
            lon: lon0 != null && lon1 != null ? [lon0, lon1] : null,
            lat: lat0 != null && lat1 != null ? [lat0, lat1] : null,
            nx: ugrdMsg.header.nx,
            ny: ugrdMsg.header.ny
          });
        }
      }

      if (levelsOut.length === 0) {
        self.postMessage({ error: 'No wind data found at requested levels' });
        return;
      }

      self.postMessage({
        ok: true,
        meta: {
          messageCount: messages.length,
          url,
          levelsFound: levelsOut.map(l => l.level)
        },
        levels: levelsOut
      });
    });
  } catch (err) {
    self.postMessage({ error: err.message || String(err) });
  }
};
