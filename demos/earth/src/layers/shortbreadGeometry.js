export {
  loadShortbreadGeometryLayer,
  planShortbreadGeometry,
  selectShortbreadGeometryTiles,
  ShortbreadGeometryLayer,
  SHORTBREAD_GEOMETRY_LIMITS,
  SHORTBREAD_GEOMETRY_DETAIL_MINIMUM_ZOOM,
  SHORTBREAD_GEOMETRY_Z_INDEX,
} from '@peercompute/geo-core';

function integerOrNull(value) {
  return Number.isInteger(value) && value >= 0 ? value : null;
}

export function shortbreadGeometryPresentation(telemetry) {
  const loaded = Number.isInteger(telemetry?.loaded) && telemetry.loaded >= 0
    ? telemetry.loaded
    : 0;
  const failed = Number.isInteger(telemetry?.failed) && telemetry.failed >= 0
    ? telemetry.failed
    : 0;
  const missingDesiredTileCount = Number.isInteger(telemetry?.missingDesiredTileCount)
    && telemetry.missingDesiredTileCount >= 0
    ? telemetry.missingDesiredTileCount
    : 0;
  const terminalFailure = telemetry?.settledTerminalFailure === true
    || telemetry?.currentRevisionRenderFailed === true;
  const geometryPresented = !terminalFailure
    && telemetry?.gpuSubmittedFrame === true
    && telemetry?.gpuPresentedFrame === true
    && telemetry?.renderReady === true;
  const settledEmpty = !terminalFailure
    && telemetry?.settledEmpty === true
    && missingDesiredTileCount === 0;
  const geometrySettled = geometryPresented || settledEmpty;
  const status = terminalFailure
    ? 'unavailable'
    : loaded === 0
      ? 'connecting'
      : geometrySettled
        ? failed > 0 ? 'degraded' : 'live'
        : 'rendering';

  return Object.freeze({
    status,
    terminalFailure,
    geometryPresented,
    settledEmpty,
    geometrySettled,
    qualifiedRevision: geometrySettled
      ? integerOrNull(telemetry?.readiness?.revision)
      : null,
    presentedRevision: geometryPresented
      ? integerOrNull(telemetry?.readiness?.presentedRevision)
      : null,
  });
}
