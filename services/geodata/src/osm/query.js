import { formatOverpassBbox } from './bbox.js';

const OVERPASS_OUTPUT_LIMIT = 10_002;

export function buildOverpassQuery({ bbox, layers, timeoutSeconds }) {
  const overpassBbox = formatOverpassBbox(bbox);
  const selectors = [];

  if (layers.includes('roads')) {
    selectors.push(`way["highway"](${overpassBbox});`);
    // Preserve turn restrictions as explicit graph metadata. `out ... geom`
    // returns bounded member identities/geometry without a second recursive
    // query, and normalization only admits exact type=restriction relations.
    selectors.push(`relation["type"="restriction"](${overpassBbox});`);
  }
  if (layers.includes('buildings')) {
    selectors.push(`way["building"](${overpassBbox});`);
    selectors.push(`way["building:part"](${overpassBbox});`);
    selectors.push(`relation["building"](${overpassBbox});`);
    selectors.push(`relation["building:part"](${overpassBbox});`);
  }

  return [
    `[out:json][timeout:${timeoutSeconds}];`,
    '(',
    ...selectors.map((selector) => `  ${selector}`),
    ')->.selected;',
    '(.selected; way(r.selected););',
    `out meta geom qt ${OVERPASS_OUTPUT_LIMIT};`
  ].join('\n');
}

export function encodeOverpassQuery(query) {
  return new URLSearchParams({ data: query }).toString();
}

export { OVERPASS_OUTPUT_LIMIT };
