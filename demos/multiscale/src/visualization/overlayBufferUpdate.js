export const MULTISCALE_OVERLAY_DATA_UPDATE_SCHEMA = 'peercompute.multiscale.overlay-data-update.v0';
export const MULTISCALE_OVERLAY_DATA_UPDATE_POLICY = 'partial-buffer-attribute-update-ranges-v0';

function finiteInteger(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.floor(number) : fallback;
}

function resetFamilyEntry(entry = {}) {
  entry.updateCount = 0;
  entry.partialUpdateCount = 0;
  entry.fullUploadCount = 0;
  entry.updatedComponentCount = 0;
  entry.fullUploadComponentCount = 0;
  entry.lastMode = 'none';
  entry.lastOffset = 0;
  entry.lastCount = 0;
  return entry;
}

export function resetOverlayDataUpdateLedger(ledger, { frame = 0 } = {}) {
  const target = ledger || {};
  target.schema = MULTISCALE_OVERLAY_DATA_UPDATE_SCHEMA;
  target.policy = MULTISCALE_OVERLAY_DATA_UPDATE_POLICY;
  target.frame = Math.max(0, finiteInteger(frame, 0));
  target.updateCallCount = 0;
  target.partialUpdateCount = 0;
  target.fullUploadCount = 0;
  target.skippedUpdateCount = 0;
  target.updatedComponentCount = 0;
  target.fullUploadComponentCount = 0;
  target.lastFamily = 'none';
  target.lastMode = 'none';
  target.lastOffset = 0;
  target.lastCount = 0;
  target.updatedFamilies = {};
  return target;
}

export function createOverlayDataUpdateLedger({ frame = 0 } = {}) {
  return resetOverlayDataUpdateLedger({}, { frame });
}

function recordLedgerUpdate(ledger, {
  family,
  mode,
  offset,
  count,
  fullCount,
  partial
}) {
  if (!ledger) return;
  const safeFamily = family || 'unknown';
  const safeCount = Math.max(0, finiteInteger(count, 0));
  const safeFullCount = Math.max(safeCount, finiteInteger(fullCount, safeCount));
  ledger.updateCallCount += 1;
  ledger.updatedComponentCount += safeCount;
  ledger.lastFamily = safeFamily;
  ledger.lastMode = mode;
  ledger.lastOffset = Math.max(0, finiteInteger(offset, 0));
  ledger.lastCount = safeCount;
  const entry = ledger.updatedFamilies[safeFamily] || resetFamilyEntry();
  entry.updateCount += 1;
  entry.updatedComponentCount += safeCount;
  entry.lastMode = mode;
  entry.lastOffset = ledger.lastOffset;
  entry.lastCount = safeCount;
  if (partial) {
    ledger.partialUpdateCount += 1;
    entry.partialUpdateCount += 1;
  } else {
    ledger.fullUploadCount += 1;
    ledger.fullUploadComponentCount += safeFullCount;
    entry.fullUploadCount += 1;
    entry.fullUploadComponentCount += safeFullCount;
  }
  ledger.updatedFamilies[safeFamily] = entry;
}

export function markOverlayAttributeUpdate(attribute, {
  offset = 0,
  count = 0,
  family = 'unknown',
  ledger = null,
  fullCount = null
} = {}) {
  if (!attribute) {
    if (ledger) ledger.skippedUpdateCount += 1;
    return {
      updated: false,
      mode: 'missing-attribute',
      offset: 0,
      count: 0
    };
  }

  const arrayLength = Number.isFinite(attribute.array?.length)
    ? Math.max(0, Math.floor(attribute.array.length))
    : null;
  const safeOffset = Math.max(0, finiteInteger(offset, 0));
  const requestedCount = Math.max(0, finiteInteger(count, 0));
  const safeCount = arrayLength == null
    ? requestedCount
    : Math.max(0, Math.min(requestedCount, arrayLength - safeOffset));

  if (safeCount <= 0) {
    if (ledger) ledger.skippedUpdateCount += 1;
    return {
      updated: false,
      mode: 'empty-range',
      offset: safeOffset,
      count: 0
    };
  }

  let mode = 'full-needs-update';
  let partial = false;
  if (typeof attribute.clearUpdateRanges === 'function' && typeof attribute.addUpdateRange === 'function') {
    attribute.clearUpdateRanges();
    attribute.addUpdateRange(safeOffset, safeCount);
    mode = 'partial-update-ranges';
    partial = true;
  } else if (attribute.updateRange && typeof attribute.updateRange === 'object') {
    attribute.updateRange.offset = safeOffset;
    attribute.updateRange.count = safeCount;
    mode = 'partial-update-range';
    partial = true;
  }
  attribute.needsUpdate = true;
  recordLedgerUpdate(ledger, {
    family,
    mode,
    offset: safeOffset,
    count: safeCount,
    fullCount: fullCount ?? arrayLength ?? safeCount,
    partial
  });
  return {
    updated: true,
    mode,
    offset: safeOffset,
    count: safeCount
  };
}

export function snapshotOverlayDataUpdateLedger(ledger) {
  if (!ledger || ledger.schema !== MULTISCALE_OVERLAY_DATA_UPDATE_SCHEMA) {
    return createOverlayDataUpdateLedger();
  }
  const families = {};
  for (const [family, entry] of Object.entries(ledger.updatedFamilies || {})) {
    families[family] = { ...entry };
  }
  return {
    schema: ledger.schema,
    policy: ledger.policy,
    frame: ledger.frame,
    updateCallCount: ledger.updateCallCount,
    partialUpdateCount: ledger.partialUpdateCount,
    fullUploadCount: ledger.fullUploadCount,
    skippedUpdateCount: ledger.skippedUpdateCount,
    updatedComponentCount: ledger.updatedComponentCount,
    fullUploadComponentCount: ledger.fullUploadComponentCount,
    lastFamily: ledger.lastFamily,
    lastMode: ledger.lastMode,
    lastOffset: ledger.lastOffset,
    lastCount: ledger.lastCount,
    updatedFamilies: families
  };
}
