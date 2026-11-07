import { boundedSceneContext } from '../../../shared/agents/DemoAgent.js';
import { normalizePublicAgent } from '../../../../peercompute/src/peercompute/agents/WorldAgentContracts.js';

const MAX_AGENTS = 64;
const BODY_HEIGHT = 3;
const finiteVector = (value) => value && ['x', 'y', 'z'].every((key) => Number.isFinite(value[key]));
const vector = (value) => [value.x, value.y, value.z];

/** Geodetic bodies only. Agent memory, execution and network authority belong to the shared host. */
export class EarthAgentLayer {
  constructor({ Cesium, viewer, onSelect = () => {}, getWorldContext = () => ({}), sampleHeight } = {}) {
    if (!Cesium || !viewer?.scene?.canvas || !viewer.dataSources) throw new TypeError('Earth agents require a Cesium viewer');
    Object.assign(this, { Cesium, viewer, onSelect, getWorldContext, sampleHeight });
    this.records = new Map();
    this.source = null;
    this.installation = null;
    this.error = null;
    this.disposed = false;
    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    this.handler.setInputAction(({ position }) => {
      if (this.disposed || !position) return;
      const picked = viewer.scene.pick(position);
      const entity = picked?.id ?? picked?.primitive?.id;
      for (const [key, record] of this.records) {
        if (record.entity !== entity) continue;
        Promise.resolve().then(() => this.onSelect(key)).catch((error) => {
          this.selectionError = String(error?.message ?? error).slice(0, 300);
        });
        break;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  normalizePosition(position) {
    if (!Array.isArray(position) || position.length !== 3 || !position.every(Number.isFinite)
        || Math.abs(position[0]) > 180 || Math.abs(position[1]) > 90
        || position[2] < -12_000 || position[2] > 100_000) {
      throw new TypeError('Earth agent position must be [longitude, latitude, height metres] within the Earth surface bounds');
    }
    return [...position];
  }

  #render() {
    if (!this.viewer.isDestroyed?.()) this.viewer.scene.requestRender();
  }

  #source() {
    if (this.disposed) throw new Error('Earth agent layer is closed');
    if (this.error) throw new Error(this.error);
    if (this.source) return this.source;
    const source = new this.Cesium.CustomDataSource('peercompute-earthgrid-agents');
    this.source = source;
    // Cesium installs data sources asynchronously. A close during installation must not leak it.
    this.installation = Promise.resolve(this.viewer.dataSources.add(source)).then(() => {
      if (this.disposed) this.viewer.dataSources.remove(source, true);
      else this.#render();
    }).catch((error) => {
      this.error = `Earth agent rendering unavailable: ${String(error?.message ?? error)}`;
      source.entities.removeAll();
      this.records.clear();
    });
    return source;
  }

  upsert(descriptor) {
    const position = this.normalizePosition(descriptor?.position);
    let publicBody;
    try { publicBody = normalizePublicAgent(descriptor); }
    catch (cause) { throw new TypeError('Invalid Earth agent appearance', { cause }); }
    if (typeof descriptor.key !== 'string' || !descriptor.key || descriptor.key.length > 512
        || (descriptor.caption !== undefined && (typeof descriptor.caption !== 'string' || descriptor.caption.length > 2048))) {
      throw new TypeError('Invalid Earth agent appearance');
    }
    if (!this.records.has(descriptor.key) && this.records.size >= MAX_AGENTS) throw new Error('Earth agent display limit reached');
    const source = this.#source(), C = this.Cesium;
    const center = C.Cartesian3.fromDegrees(position[0], position[1], position[2] + BODY_HEIGHT / 2);
    const color = C.Color.fromCssColorString(descriptor.color);
    const caption = (descriptor.caption ?? '').replace(/\s+/g, ' ').slice(0, 160);
    const text = `${descriptor.name} // ${descriptor.status.toUpperCase()}${caption ? `\n${caption}` : ''}`;
    let record = this.records.get(descriptor.key);
    if (!record) {
      const entity = source.entities.add({ id: `earth-agent:${descriptor.key}`, name: descriptor.name,
        position: center,
        orientation: C.Transforms.headingPitchRollQuaternion(center, new C.HeadingPitchRoll()),
        box: { dimensions: new C.Cartesian3(2, 2, BODY_HEIGHT), material: color, outline: true, outlineColor: C.Color.WHITE },
        point: { pixelSize: 12, color, outlineColor: C.Color.BLACK, outlineWidth: 2 },
        label: { text, font: '14px monospace', fillColor: C.Color.WHITE, showBackground: true,
          backgroundColor: C.Color.BLACK.withAlpha(0.85), pixelOffset: new C.Cartesian2(0, -24),
          verticalOrigin: C.VerticalOrigin.BOTTOM, disableDepthTestDistance: 100_000 }
      });
      record = { entity, descriptor: null };
      this.records.set(descriptor.key, record);
    } else {
      Object.assign(record.entity, { name: descriptor.name, position: center,
        orientation: C.Transforms.headingPitchRollQuaternion(center, new C.HeadingPitchRoll()) });
      record.entity.box.material = color;
      record.entity.point.color = color;
      record.entity.label.text = text;
    }
    record.descriptor = { ...publicBody, key: descriptor.key, local: descriptor.local === true, position };
    this.#render();
  }

  remove(key) {
    const record = this.records.get(key);
    if (!record) return false;
    this.source.entities.remove(record.entity);
    this.records.delete(key);
    this.#render();
    return true;
  }

  clear() {
    this.source?.entities.removeAll();
    this.records.clear();
    this.#render();
  }

  getSpawnPosition() {
    if (this.disposed) throw new Error('Earth agent layer is closed');
    const C = this.Cesium, { viewer } = this, canvas = viewer.scene.canvas;
    const ray = viewer.camera.getPickRay(new C.Cartesian2((canvas.clientWidth || canvas.width) / 2,
      (canvas.clientHeight || canvas.height) / 2));
    const hit = ray && viewer.scene.globe.pick(ray, viewer.scene);
    const location = hit ? C.Cartographic.fromCartesian(hit) : viewer.camera.positionCartographic;
    if (!location || !Number.isFinite(location.longitude) || !Number.isFinite(location.latitude)) {
      throw new Error('Choose a location on Earth before spawning an agent');
    }
    const longitude = C.Math.toDegrees(location.longitude), latitude = C.Math.toDegrees(location.latitude);
    let height = hit && Number.isFinite(location.height) ? location.height : undefined;
    if (height === undefined) {
      try { height = this.sampleHeight?.(longitude, latitude); } catch { /* Terrain not resident yet. */ }
      height ??= viewer.scene.globe.getHeight?.(new C.Cartographic(location.longitude, location.latitude));
    }
    // The zero fallback is explicit surface placement, never camera altitude.
    if (!Number.isFinite(height) || height < -12_000 || height > 100_000) height = 0;
    return this.normalizePosition([longitude, latitude, height]);
  }

  getContext(descriptor) {
    const position = this.normalizePosition(descriptor.position);
    return JSON.parse(boundedSceneContext({ world: 'EarthGrid', ...this.getWorldContext(),
      agent: { name: descriptor.name, longitude: position[0], latitude: position[1], heightMeters: position[2] } },
    { maximumBytes: 4096 }));
  }

  focus(key) {
    const record = this.records.get(key);
    if (!record || this.disposed) return false;
    const C = this.Cesium, [longitude, latitude, height] = record.descriptor.position;
    this.viewer.camera.flyToBoundingSphere(new C.BoundingSphere(
      C.Cartesian3.fromDegrees(longitude, latitude, height + BODY_HEIGHT / 2), 4), {
      duration: 0.8, offset: new C.HeadingPitchRange(0, -Math.PI / 6, 30)
    });
    this.#render();
    return true;
  }

  getAudioPose(key) {
    const record = this.records.get(key), camera = this.viewer.camera;
    if (!record || this.disposed || !finiteVector(camera.positionWC)
        || !finiteVector(camera.directionWC) || !finiteVector(camera.upWC)) return null;
    const [longitude, latitude, height] = record.descriptor.position;
    const source = this.Cesium.Cartesian3.fromDegrees(longitude, latitude, height + BODY_HEIGHT / 2);
    // All three positions use ECEF metres, translated together to avoid large audio coordinates.
    return { source: [source.x - camera.positionWC.x, source.y - camera.positionWC.y, source.z - camera.positionWC.z],
      listener: [0, 0, 0], forward: vector(camera.directionWC), up: vector(camera.upWC) };
  }

  getState() {
    return { count: this.records.size, dataSourcePresent: Boolean(this.source), error: this.error,
      selectionError: this.selectionError ?? null,
      bodies: [...this.records.values()].map(({ descriptor }) => ({ key: descriptor.key,
        position: [...descriptor.position], status: descriptor.status, local: descriptor.local === true })) };
  }

  async dispose() {
    if (this.disposal) return this.disposal;
    this.disposed = true;
    this.handler.destroy();
    this.clear();
    this.disposal = (async () => {
      await this.installation;
      if (this.source && !this.viewer.isDestroyed?.()) this.viewer.dataSources.remove(this.source, true);
      this.source = null;
      this.#render();
    })();
    return this.disposal;
  }
}
