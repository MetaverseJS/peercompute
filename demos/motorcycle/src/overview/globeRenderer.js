import {
  EARTH_RADIUS_METERS,
  OVERVIEW_GLOBE_RADIUS,
  overviewCameraPose,
  wgs84ToOverviewCartesian,
} from './globeMath.js';

const RELIEF_EXAGGERATION = 24;
const ROAD_COLORS = Object.freeze({
  motorway: 0xffe74a,
  trunk: 0xff7a18,
  primary: 0x24eaff,
});

function disposeObject(root) {
  root?.traverse?.((object) => {
    object.geometry?.dispose?.();
    if (Array.isArray(object.material)) object.material.forEach((material) => material?.dispose?.());
    else object.material?.dispose?.();
  });
  root?.removeFromParent?.();
}

function createReliefGeometry(THREE, relief) {
  const { width, height, heights } = relief;
  const positions = new Float32Array(width * height * 3);
  const sourceHeights = new Float32Array(width * height);
  for (let row = 0; row < height; row += 1) {
    const latitude = 90 - row / (height - 1) * 180;
    for (let column = 0; column < width; column += 1) {
      const longitude = -180 + column / (width - 1) * 360;
      const index = row * width + column;
      const heightMeters = Number(heights[index]);
      const radius = OVERVIEW_GLOBE_RADIUS
        + heightMeters / EARTH_RADIUS_METERS * OVERVIEW_GLOBE_RADIUS * RELIEF_EXAGGERATION;
      const point = wgs84ToOverviewCartesian(longitude, latitude, radius);
      positions.set(point, index * 3);
      sourceHeights[index] = heightMeters;
    }
  }
  const triangleCount = (width - 1) * (height - 1) * 2;
  const indices = new Uint32Array(triangleCount * 3);
  let cursor = 0;
  for (let row = 0; row < height - 1; row += 1) {
    for (let column = 0; column < width - 1; column += 1) {
      const a = row * width + column;
      const b = a + 1;
      const c = a + width;
      const d = c + 1;
      indices.set([a, c, b, b, c, d], cursor);
      cursor += 6;
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('heightMeters', new THREE.BufferAttribute(sourceHeights, 1));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function createReliefMaterial(THREE) {
  return new THREE.ShaderMaterial({
    name: 'roadvector-overview-topographic-relief',
    uniforms: {
      lightDirection: { value: new THREE.Vector3(-0.35, 0.65, 0.68).normalize() },
    },
    vertexShader: `
      attribute float heightMeters;
      varying float vHeightMeters;
      varying vec3 vNormalView;
      void main() {
        vHeightMeters = heightMeters;
        vNormalView = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 lightDirection;
      varying float vHeightMeters;
      varying vec3 vNormalView;
      void main() {
        bool ocean = vHeightMeters < 0.0;
        float normalizedHeight = ocean
          ? clamp((-vHeightMeters) / 6500.0, 0.0, 1.0)
          : clamp(vHeightMeters / 5200.0, 0.0, 1.0);
        vec3 oceanBase = mix(vec3(0.0, 0.035, 0.055), vec3(0.0, 0.13, 0.19), 1.0 - normalizedHeight);
        vec3 landBase = mix(vec3(0.005, 0.075, 0.025), vec3(0.20, 0.48, 0.16), normalizedHeight);
        float spacing = ocean ? 1000.0 : 500.0;
        float contourPhase = abs(fract(abs(vHeightMeters) / spacing + 0.5) - 0.5) * 2.0;
        float contour = 1.0 - smoothstep(0.0, 0.11, contourPhase);
        float lighting = 0.42 + 0.58 * max(0.0, dot(normalize(vNormalView), normalize(lightDirection)));
        vec3 contourColor = ocean ? vec3(0.03, 0.45, 0.56) : vec3(0.20, 1.0, 0.42);
        vec3 color = mix(ocean ? oceanBase : landBase, contourColor, contour * 0.72);
        gl_FragColor = vec4(color * lighting, 1.0);
      }
    `,
  });
}

function createGraticule(THREE) {
  const positions = [];
  const radius = OVERVIEW_GLOBE_RADIUS + 0.018;
  const appendPolyline = (points) => {
    for (let index = 1; index < points.length; index += 1) {
      positions.push(...points[index - 1], ...points[index]);
    }
  };
  for (let latitude = -75; latitude <= 75; latitude += 15) {
    const points = [];
    for (let longitude = -180; longitude <= 180; longitude += 3) {
      points.push(wgs84ToOverviewCartesian(longitude, latitude, radius));
    }
    appendPolyline(points);
  }
  for (let longitude = -180; longitude < 180; longitude += 15) {
    const points = [];
    for (let latitude = -90; latitude <= 90; latitude += 3) {
      points.push(wgs84ToOverviewCartesian(longitude, latitude, radius));
    }
    appendPolyline(points);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.LineBasicMaterial({ color: 0x177943, transparent: true, opacity: 0.25 });
  const lines = new THREE.LineSegments(geometry, material);
  lines.name = 'roadvector-overview-graticule';
  return lines;
}

function createRoadGroup(THREE, roadWindow) {
  const root = new THREE.Group();
  root.name = 'roadvector-overview-major-roads';
  for (const category of Object.keys(ROAD_COLORS)) {
    const positions = [];
    for (const road of roadWindow.roads.filter((entry) => entry.category === category)) {
      for (let index = 1; index < road.coordinates.length; index += 1) {
        const from = road.coordinates[index - 1];
        const to = road.coordinates[index];
        positions.push(
          ...wgs84ToOverviewCartesian(from[0], from[1], OVERVIEW_GLOBE_RADIUS + 0.045),
          ...wgs84ToOverviewCartesian(to[0], to[1], OVERVIEW_GLOBE_RADIUS + 0.045),
        );
      }
    }
    if (positions.length === 0) continue;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const material = new THREE.LineBasicMaterial({ color: ROAD_COLORS[category], transparent: true, opacity: 0.95 });
    const lines = new THREE.LineSegments(geometry, material);
    lines.name = `roadvector-overview-road-${category}`;
    root.add(lines);
  }
  root.userData = {
    sourceId: roadWindow.sourceId,
    coverage: roadWindow.geometryCoverage,
    responseBytes: roadWindow.responseBytes,
  };
  return root;
}

export function createRoadvectorGlobeRenderer(THREE, { scene, camera } = {}) {
  if (!THREE?.Group || !scene?.add || !camera?.lookAt) throw new TypeError('RoadVector globe renderer requires Three.js, a scene, and a camera.');
  const root = new THREE.Group();
  root.name = 'roadvector-hemisphere-overview';
  const initialRelief = Object.freeze({ width: 65, height: 33, heights: new Float32Array(65 * 33) });
  let globe = new THREE.Mesh(createReliefGeometry(THREE, initialRelief), createReliefMaterial(THREE));
  globe.name = 'roadvector-overview-relief';
  root.add(globe, createGraticule(THREE));
  const locationRoot = new THREE.Group();
  locationRoot.name = 'roadvector-overview-location';
  const locationMarker = new THREE.Mesh(
    new THREE.SphereGeometry(0.105, 12, 8),
    new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }),
  );
  locationRoot.add(locationMarker);
  root.add(locationRoot);
  const peerRoot = new THREE.Group();
  peerRoot.name = 'roadvector-overview-live-players';
  root.add(peerRoot);
  scene.add(root);
  let roadRoot = null;
  let reliefStatus = null;
  let roadStatus = null;
  let peerCount = 0;

  function setLocation(location) {
    const point = wgs84ToOverviewCartesian(location.longitude, location.latitude, OVERVIEW_GLOBE_RADIUS + 0.12);
    locationRoot.position.fromArray(point);
    const pose = overviewCameraPose(location);
    camera.position.fromArray(pose.position);
    camera.up.fromArray(pose.up);
    camera.lookAt(...pose.target);
    camera.updateMatrixWorld(true);
  }

  function setRelief(relief) {
    const replacement = new THREE.Mesh(createReliefGeometry(THREE, relief), createReliefMaterial(THREE));
    replacement.name = globe.name;
    root.add(replacement);
    disposeObject(globe);
    globe = replacement;
    reliefStatus = {
      sourceId: relief.sourceId,
      width: relief.width,
      height: relief.height,
      bytes: relief.bytes,
      minimumHeightMeters: relief.minimumHeightMeters,
      maximumHeightMeters: relief.maximumHeightMeters,
      reliefExaggeration: RELIEF_EXAGGERATION,
    };
  }

  function setRoads(roadWindow) {
    disposeObject(roadRoot);
    roadRoot = createRoadGroup(THREE, roadWindow);
    root.add(roadRoot);
    roadStatus = {
      sourceId: roadWindow.sourceId,
      coverage: roadWindow.geometryCoverage,
      zoom: roadWindow.zoom,
      selectedTiles: roadWindow.tileWindow.selected,
      responseBytes: roadWindow.responseBytes,
      renderedRoads: roadWindow.renderedRoads,
      renderedVertices: roadWindow.renderedVertices,
    };
  }

  function setPeers(players) {
    for (const child of [...peerRoot.children]) disposeObject(child);
    for (const player of players) {
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.135, 12, 8),
        new THREE.MeshBasicMaterial({ color: 0xff334f, toneMapped: false }),
      );
      marker.name = `roadvector-live-player-${player.peerId}`;
      marker.position.fromArray(wgs84ToOverviewCartesian(
        player.longitude,
        player.latitude,
        OVERVIEW_GLOBE_RADIUS + 0.16,
      ));
      marker.userData = { kind: 'live-roadvector-player', peerId: player.peerId, colorPolicy: 'fixed-red' };
      peerRoot.add(marker);
    }
    peerCount = players.length;
  }

  function update(timeMs = 0) {
    const pulse = 0.88 + 0.18 * (0.5 + 0.5 * Math.sin(timeMs / 320));
    locationMarker.scale.setScalar(pulse);
    for (const marker of peerRoot.children) marker.scale.setScalar(pulse);
  }

  function getStatus() {
    return Object.freeze({
      schemaVersion: 'peercompute.roadvector.globe-renderer.telemetry.v1',
      worldUnits: 'overview-radius-units',
      globeRadius: OVERVIEW_GLOBE_RADIUS,
      hemisphereDiameterKilometers: 12_742,
      relief: reliefStatus ? { ...reliefStatus } : null,
      roads: roadStatus ? { ...roadStatus } : null,
      remotePlayerCount: peerCount,
      remotePlayerColor: '#ff334f',
      localScaleTransition: 'discrete',
    });
  }

  function dispose() {
    disposeObject(root);
  }

  return Object.freeze({ root, setLocation, setRelief, setRoads, setPeers, update, getStatus, dispose });
}
