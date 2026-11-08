export const OSM_ATTRIBUTION_HTML = '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>';

export const GEO_SOURCE_CATALOG = Object.freeze([
  Object.freeze({
    id: 'noaa-etopo2022',
    name: 'NOAA ETOPO 2022 60 arc-second surface elevation',
    agency: 'NOAA National Centers for Environmental Information',
    sourceUrl: 'https://www.ncei.noaa.gov/products/etopo-global-relief-model',
    access: 'public-no-key',
    cadence: 'static published model',
    coverage: 'global including poles and bathymetry',
    license: 'CC0 / public domain dedication',
    operationalUse: false
  }),
  Object.freeze({
    id: 'aws-terrarium',
    name: 'AWS Open Data Terrarium elevation tiles',
    agency: 'Mapzen terrain tiles hosted by Amazon Web Services',
    sourceUrl: 'https://registry.opendata.aws/terrain-tiles/',
    access: 'public-no-key',
    cadence: 'static composite',
    coverage: 'Web Mercator ±85.051°; mixed elevation sources',
    license: 'mixed source attribution; see registry',
    operationalUse: false
  }),
  Object.freeze({
    id: 'osm-shortbread',
    name: 'OpenStreetMap Shortbread vector tiles',
    agency: 'OpenStreetMap Foundation / OpenStreetMap contributors',
    sourceUrl: 'https://vector.openstreetmap.org/shortbread_v1/tilejson.json',
    documentationUrl: 'https://shortbread-tiles.org/schema/1.0/',
    access: 'public-no-key-policy-bound',
    cadence: 'provider-defined',
    coverage: 'global to advertised TileJSON maximum zoom',
    license: 'ODbL 1.0',
    attributionHtml: OSM_ATTRIBUTION_HTML,
    operationalUse: false
  }),
  Object.freeze({
    id: 'osm-local-region',
    name: 'Bounded OpenStreetMap local roads/buildings adapter',
    agency: 'OpenStreetMap contributors; normalized by PeerCompute',
    sourceUrl: null,
    access: 'configured backend',
    cadence: 'six-hour region cache with disclosed source timestamp',
    coverage: 'bounded non-wrapping request regions',
    license: 'ODbL 1.0 derived database',
    attributionHtml: OSM_ATTRIBUTION_HTML,
    operationalUse: false
  }),
  Object.freeze({
    id: 'noaa-nowcoast-radar',
    name: 'NOAA nowCOAST weather radar mosaics',
    agency: 'NOAA / National Weather Service',
    sourceUrl: 'https://nowcoast.noaa.gov/geoserver/observations/weather_radar/ows',
    documentationUrl: 'https://www.nauticalcharts.noaa.gov/learn/nowcoast.html',
    access: 'public-no-key WMS',
    cadence: 'about four minutes',
    coverage: 'published radar mosaic footprints',
    license: 'U.S. government source; attribution required',
    operationalUse: false
  }),
  Object.freeze({
    id: 'noaa-nowcoast-satellite',
    name: 'NOAA nowCOAST geostationary satellite imagery',
    agency: 'NOAA / NESDIS',
    sourceUrl: 'https://nowcoast.noaa.gov/geoserver/observations/satellite/ows',
    documentationUrl: 'https://www.nauticalcharts.noaa.gov/learn/nowcoast.html',
    access: 'public-no-key WMS',
    cadence: 'about five minutes',
    coverage: 'published GOES imagery footprints',
    license: 'U.S. government source; attribution required',
    operationalUse: false
  })
]);

export function sourceDescriptor(id) {
  const descriptor = GEO_SOURCE_CATALOG.find((entry) => entry.id === id);
  return descriptor ? { ...descriptor } : null;
}
