// Registry of available weather data sources on NOMADS (rtma/rap/etc).
// Each entry describes coverage and URL templates; decoding/fetching is pluggable per source.

export const DATA_SOURCES = [
  {
    id: 'rap-130-pressure',
    title: 'RAP 13 km pressure levels (UGRD/VGRD/HGT)',
    dimension: '3D',
    region: 'CONUS',
    resolution: '13 km',
    cadence: 'hourly',
    vertical: 'Pressure levels (1000–100 hPa)',
    variables: ['UGRD', 'VGRD', 'HGT', 'ORO'],
    notes: 'Best choice on NOMADS for multi-altitude winds; includes heights + terrain.',
    urlPattern: 'https://nomads.ncep.noaa.gov/pub/data/nccf/com/rap/prod/rap.{YYYYMMDD}/rap.t{HH}z.awp130pgrbf00.grib2',
    example: 'https://nomads.ncep.noaa.gov/pub/data/nccf/com/rap/prod/rap.20260112/rap.t21z.awp130pgrbf00.grib2'
  },
  {
    id: 'rtma2p5-surface',
    title: 'RTMA 2.5 km surface (CONUS)',
    dimension: 'surface',
    region: 'CONUS',
    resolution: '2.5 km',
    cadence: 'hourly',
    vertical: 'Surface',
    variables: ['UGRD', 'VGRD', 'TMP', 'PRMSL', 'APCP'],
    notes: 'Surface-only analysis; good for near-ground winds/pressure. No vertical levels.',
    urlPattern: 'https://nomads.ncep.noaa.gov/pub/data/nccf/com/rtma/prod/rtma2p5.{YYYYMMDD}/rqirtma.{YYYYMMDDHH}.grb2',
    example: 'https://nomads.ncep.noaa.gov/pub/data/nccf/com/rtma/prod/rtma2p5.20260112/rqirtma.2026011221.grb2'
  },
  {
    id: 'hirtma-surface',
    title: 'RTMA Hawaii surface',
    dimension: 'surface',
    region: 'Hawaii',
    resolution: '2.5 km',
    cadence: 'hourly',
    vertical: 'Surface',
    variables: ['UGRD', 'VGRD', 'TMP', 'PRMSL', 'APCP'],
    notes: 'Surface-only Hawaii RTMA.',
    urlPattern: 'https://nomads.ncep.noaa.gov/pub/data/nccf/com/rtma/prod/hirtma.{YYYYMMDD}/hirtma.t{HH}z.2dvaranl_ndfd.grb2',
    example: 'https://nomads.ncep.noaa.gov/pub/data/nccf/com/rtma/prod/hirtma.20260112/hirtma.t00z.2dvaranl_ndfd.grb2'
  },
  {
    id: 'prrtma-surface',
    title: 'RTMA Puerto Rico surface',
    dimension: 'surface',
    region: 'Puerto Rico',
    resolution: '2.5 km',
    cadence: 'hourly',
    vertical: 'Surface',
    variables: ['UGRD', 'VGRD', 'TMP', 'PRMSL', 'APCP'],
    notes: 'Surface-only PR RTMA.',
    urlPattern: 'https://nomads.ncep.noaa.gov/pub/data/nccf/com/rtma/prod/prrtma.{YYYYMMDD}/prrtma.t{HH}z.2dvaranl_ndfd.grb2',
    example: 'https://nomads.ncep.noaa.gov/pub/data/nccf/com/rtma/prod/prrtma.20260112/prrtma.t00z.2dvaranl_ndfd.grb2'
  },
  {
    id: 'gurtma-surface',
    title: 'RTMA Guam surface',
    dimension: 'surface',
    region: 'Guam',
    resolution: '2.5 km',
    cadence: 'hourly',
    vertical: 'Surface',
    variables: ['UGRD', 'VGRD', 'TMP', 'PRMSL', 'APCP'],
    notes: 'Surface-only Guam RTMA.',
    urlPattern: 'https://nomads.ncep.noaa.gov/pub/data/nccf/com/rtma/prod/gurtma.{YYYYMMDD}/gurtma.t{HH}z.2dvaranl_ndfd.grb2',
    example: 'https://nomads.ncep.noaa.gov/pub/data/nccf/com/rtma/prod/gurtma.20260112/gurtma.t00z.2dvaranl_ndfd.grb2'
  }
];

export function listDataSources() {
  return DATA_SOURCES;
}

export function getDataSource(id) {
  return DATA_SOURCES.find((s) => s.id === id);
}

export function getDefaultDataSource() {
  return getDataSource('rtma2p5-surface') || DATA_SOURCES[0];
}
