export function createOverpassFixture() {
  return {
    version: 0.6,
    generator: 'Overpass API fixture',
    osm3s: {
      timestamp_osm_base: '2026-08-23T20:00:00Z',
      copyright: 'The data included in this document is from www.openstreetmap.org.'
    },
    elements: [
      {
        type: 'way',
        id: 502,
        version: 2,
        timestamp: '2026-08-22T01:00:00Z',
        nodes: [51, 52, 53, 54, 51],
        geometry: [
          { lat: 0.014, lon: 0.014 },
          { lat: 0.014, lon: 0.016 },
          { lat: 0.016, lon: 0.016 },
          { lat: 0.016, lon: 0.014 },
          { lat: 0.014, lon: 0.014 }
        ],
        tags: { building: 'shed' }
      },
      {
        type: 'way',
        id: 200,
        version: 4,
        timestamp: '2026-08-23T19:30:00Z',
        nodes: [1, 2, 3],
        geometry: [
          { lat: 0, lon: 0 },
          { lat: 0.01, lon: 0 },
          { lat: 0.01, lon: 0.01 }
        ],
        tags: {
          surface: 'asphalt',
          name: 'Neon Avenue',
          maxspeed: '30 mph',
          lanes: '2',
          highway: 'residential'
        }
      },
      {
        type: 'relation',
        id: 700,
        version: 1,
        timestamp: '2026-08-23T19:45:00Z',
        members: [
          { type: 'way', ref: 200, role: 'from' },
          { type: 'node', ref: 1, role: 'via' },
          { type: 'way', ref: 200, role: 'to' }
        ],
        tags: { type: 'restriction', restriction: 'no_u_turn' }
      },
      {
        type: 'relation',
        id: 600,
        version: 7,
        timestamp: '2026-08-20T11:00:00Z',
        members: [
          {
            type: 'way',
            ref: 602,
            role: 'outer',
            geometry: [
              { lat: 0.01, lon: 0.03 },
              { lat: 0.01, lon: 0.02 },
              { lat: 0, lon: 0.02 }
            ]
          },
          {
            type: 'way',
            ref: 603,
            role: 'inner',
            geometry: [
              { lat: 0.003, lon: 0.023 },
              { lat: 0.003, lon: 0.027 },
              { lat: 0.007, lon: 0.027 },
              { lat: 0.007, lon: 0.023 },
              { lat: 0.003, lon: 0.023 }
            ]
          },
          {
            type: 'way',
            ref: 601,
            role: 'outer',
            geometry: [
              { lat: 0, lon: 0.02 },
              { lat: 0, lon: 0.03 },
              { lat: 0.01, lon: 0.03 }
            ]
          }
        ],
        tags: { type: 'multipolygon', building: 'commercial', height: '15' }
      },
      {
        type: 'way',
        id: 100,
        nodes: [6, 4, 7],
        geometry: [
          { lat: 0.01, lon: -0.01 },
          { lat: 0.01, lon: 0 },
          { lat: 0.01, lon: 0.01 }
        ],
        tags: { highway: 'secondary', oneway: 'no' }
      },
      {
        type: 'way',
        id: 500,
        nodes: [31, 32, 33, 34, 31],
        geometry: [
          { lat: 0.002, lon: 0.002 },
          { lat: 0.002, lon: 0.006 },
          { lat: 0.006, lon: 0.006 },
          { lat: 0.006, lon: 0.002 },
          { lat: 0.002, lon: 0.002 }
        ],
        tags: { building: 'yes', height: '40 ft' }
      },
      {
        type: 'way',
        id: 400,
        nodes: [10, 11],
        geometry: [
          { lat: 0.012, lon: 0 },
          { lat: 0.012, lon: 0.01 }
        ],
        tags: { highway: 'footway' }
      },
      {
        type: 'way',
        id: 601,
        nodes: [60, 61, 62],
        geometry: [
          { lat: 0, lon: 0.02 },
          { lat: 0, lon: 0.03 },
          { lat: 0.01, lon: 0.03 }
        ],
        tags: { building: 'commercial' }
      },
      {
        type: 'way',
        id: 602,
        nodes: [62, 63, 60],
        geometry: [
          { lat: 0.01, lon: 0.03 },
          { lat: 0.01, lon: 0.02 },
          { lat: 0, lon: 0.02 }
        ],
        tags: {}
      },
      {
        type: 'way',
        id: 603,
        nodes: [70, 71, 72, 73, 70],
        geometry: [
          { lat: 0.003, lon: 0.023 },
          { lat: 0.003, lon: 0.027 },
          { lat: 0.007, lon: 0.027 },
          { lat: 0.007, lon: 0.023 },
          { lat: 0.003, lon: 0.023 }
        ],
        tags: {}
      },
      {
        type: 'way',
        id: 300,
        nodes: [8, 9],
        geometry: [
          { lat: 0.02, lon: 0 },
          { lat: 0.02, lon: 0.01 }
        ],
        tags: { highway: 'service', oneway: '-1' }
      },
      {
        type: 'way',
        id: 501,
        nodes: [41, 42, 43, 44, 41],
        geometry: [
          { lat: 0.008, lon: 0.002 },
          { lat: 0.008, lon: 0.006 },
          { lat: 0.012, lon: 0.006 },
          { lat: 0.012, lon: 0.002 },
          { lat: 0.008, lon: 0.002 }
        ],
        tags: { building: 'apartments', 'building:levels': '4' }
      }
    ]
  };
}

export function responseForJson(value, options = {}) {
  return new Response(JSON.stringify(value), {
    status: options.status ?? 200,
    headers: {
      'content-type': options.contentType ?? 'application/json; charset=utf-8',
      ...(options.headers ?? {})
    }
  });
}
