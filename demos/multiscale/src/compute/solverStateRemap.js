export const SOLVER_STATE_REMAP_SCHEMA = 'peercompute.multiscale.solver-state-remap.v0';

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function toArray(values = []) {
  return Array.from(values || [], (value) => finiteNumber(value));
}

function meanByComponent(values, components, component) {
  if (!values.length) return 0;
  let sum = 0;
  let count = 0;
  for (let i = component; i < values.length; i += components) {
    sum += finiteNumber(values[i]);
    count += 1;
  }
  return count > 0 ? sum / count : 0;
}

function finiteArrayFromField(state, field) {
  if (!state || !field) return [];
  const value = state[field];
  if (Array.isArray(value)) return toArray(value);
  if (Number.isFinite(Number(value))) return [Number(value)];
  return [];
}

function sumValues(values) {
  return values.reduce((sum, value) => sum + finiteNumber(value), 0);
}

function meanValues(values) {
  return values.length > 0 ? sumValues(values) / values.length : 0;
}

function fieldSum(state, field) {
  return sumValues(finiteArrayFromField(state, field));
}

function fieldMean(state, field) {
  return meanValues(finiteArrayFromField(state, field));
}

function weightedFieldSum(state, valueField, weightField) {
  const values = finiteArrayFromField(state, valueField);
  const weights = finiteArrayFromField(state, weightField);
  const count = Math.min(values.length, weights.length);
  let sum = 0;
  for (let i = 0; i < count; i += 1) {
    sum += values[i] * weights[i];
  }
  return sum;
}

function packedVectorEnergy(state, field, components = 3, scale = 0.5) {
  const values = finiteArrayFromField(state, field);
  let energy = 0;
  for (const value of values) {
    energy += finiteNumber(value) * finiteNumber(value);
  }
  return energy * finiteNumber(scale, 0.5);
}

function splitVectorEnergy(state, fields = [], scale = 0.5) {
  const arrays = fields.map((field) => finiteArrayFromField(state, field));
  const count = Math.min(...arrays.map((values) => values.length).filter((length) => length > 0));
  if (!Number.isFinite(count) || count <= 0) return 0;
  let energy = 0;
  for (let i = 0; i < count; i += 1) {
    for (const values of arrays) {
      energy += values[i] * values[i];
    }
  }
  return energy * finiteNumber(scale, 0.5);
}

function magnitude(components) {
  return Math.hypot(...components.map((value) => finiteNumber(value)));
}

function packedMomentumMagnitude(state, massField, velocityField, components = 3) {
  const masses = finiteArrayFromField(state, massField);
  const velocities = finiteArrayFromField(state, velocityField);
  const safeComponents = Math.max(1, Math.floor(Number(components) || 1));
  const records = Math.min(masses.length, Math.floor(velocities.length / safeComponents));
  const sums = new Array(safeComponents).fill(0);
  for (let record = 0; record < records; record += 1) {
    const mass = masses[record];
    const offset = record * safeComponents;
    for (let component = 0; component < safeComponents; component += 1) {
      sums[component] += mass * velocities[offset + component];
    }
  }
  return magnitude(sums);
}

function splitMomentumMagnitude(state, massField, velocityFields = []) {
  const masses = finiteArrayFromField(state, massField);
  const velocityArrays = velocityFields.map((field) => finiteArrayFromField(state, field));
  const count = Math.min(masses.length, ...velocityArrays.map((values) => values.length));
  if (!Number.isFinite(count) || count <= 0) return 0;
  const sums = new Array(velocityArrays.length).fill(0);
  for (let i = 0; i < count; i += 1) {
    const mass = masses[i];
    for (let component = 0; component < velocityArrays.length; component += 1) {
      sums[component] += mass * velocityArrays[component][i];
    }
  }
  return magnitude(sums);
}

function packedKineticEnergy(state, massField, velocityField, components = 3) {
  const masses = finiteArrayFromField(state, massField);
  const velocities = finiteArrayFromField(state, velocityField);
  const safeComponents = Math.max(1, Math.floor(Number(components) || 1));
  const records = Math.min(masses.length, Math.floor(velocities.length / safeComponents));
  let energy = 0;
  for (let record = 0; record < records; record += 1) {
    let speed2 = 0;
    const offset = record * safeComponents;
    for (let component = 0; component < safeComponents; component += 1) {
      speed2 += velocities[offset + component] * velocities[offset + component];
    }
    energy += 0.5 * masses[record] * speed2;
  }
  return energy;
}

function splitKineticEnergy(state, massField, velocityFields = []) {
  const masses = finiteArrayFromField(state, massField);
  const velocityArrays = velocityFields.map((field) => finiteArrayFromField(state, field));
  const count = Math.min(masses.length, ...velocityArrays.map((values) => values.length));
  if (!Number.isFinite(count) || count <= 0) return 0;
  let energy = 0;
  for (let i = 0; i < count; i += 1) {
    let speed2 = 0;
    for (const values of velocityArrays) {
      speed2 += values[i] * values[i];
    }
    energy += 0.5 * masses[i] * speed2;
  }
  return energy;
}

function countField(state, field) {
  return finiteArrayFromField(state, field).length;
}

function evaluateInvariant(state, spec = {}) {
  switch (spec.type) {
    case 'mean':
      return fieldMean(state, spec.field);
    case 'weighted-sum':
      return weightedFieldSum(state, spec.valueField, spec.weightField);
    case 'packed-vector-energy':
      return packedVectorEnergy(state, spec.field, spec.components, spec.scale);
    case 'split-vector-energy':
      return splitVectorEnergy(state, spec.fields, spec.scale);
    case 'packed-momentum':
      return packedMomentumMagnitude(state, spec.massField, spec.velocityField, spec.components);
    case 'split-momentum':
      return splitMomentumMagnitude(state, spec.massField, spec.velocityFields);
    case 'packed-kinetic':
      return packedKineticEnergy(state, spec.massField, spec.velocityField, spec.components);
    case 'split-kinetic':
      return splitKineticEnergy(state, spec.massField, spec.velocityFields);
    case 'count':
      return countField(state, spec.field);
    case 'sum':
    default:
      return fieldSum(state, spec.field);
  }
}

export function summarizeInvariantDelta(name, previousValue, nextValue, units = 'proxy') {
  const previous = finiteNumber(previousValue);
  const next = finiteNumber(nextValue);
  const delta = next - previous;
  const denominator = Math.max(Math.abs(previous), 1);
  return {
    name,
    units,
    previous,
    next,
    delta,
    relativeDelta: delta / denominator
  };
}

export function summarizeSolverInvariants(previous, next, specs = []) {
  if (!previous || !next) return [];
  return specs
    .map((spec) => summarizeInvariantDelta(
      spec.name || spec.field || spec.type || 'invariant',
      evaluateInvariant(previous, spec),
      evaluateInvariant(next, spec),
      spec.units || 'proxy'
    ))
    .filter((entry) => Number.isFinite(entry.previous) && Number.isFinite(entry.next));
}

export function carrySolverTimeline(previous, next) {
  if (!previous || !next) return next;
  if (Number.isFinite(previous.sequence)) {
    next.sequence = previous.sequence;
  }
  if (Number.isFinite(previous.elapsedTime)) {
    next.elapsedTime = previous.elapsedTime;
  }
  return next;
}

export function copyRecordPrefix(previousValues, nextValues, {
  components = 1,
  preserveMean = false
} = {}) {
  const source = toArray(previousValues);
  const target = toArray(nextValues);
  const safeComponents = Math.max(1, Math.floor(Number(components) || 1));
  const sourceRecords = Math.floor(source.length / safeComponents);
  const targetRecords = Math.floor(target.length / safeComponents);
  const copiedRecords = Math.min(sourceRecords, targetRecords);
  for (let record = 0; record < copiedRecords; record += 1) {
    const sourceOffset = record * safeComponents;
    const targetOffset = record * safeComponents;
    for (let component = 0; component < safeComponents; component += 1) {
      target[targetOffset + component] = source[sourceOffset + component];
    }
  }
  if (preserveMean && copiedRecords > 0) {
    for (let component = 0; component < safeComponents; component += 1) {
      const sourceMean = meanByComponent(source, safeComponents, component);
      const targetMean = meanByComponent(target, safeComponents, component);
      const correction = sourceMean - targetMean;
      for (let i = component; i < target.length; i += safeComponents) {
        target[i] = finiteNumber(target[i]) + correction;
      }
    }
  }
  return {
    values: target,
    sourceRecords,
    targetRecords,
    copiedRecords
  };
}

export function copyRecordFields(previous, next, fields = []) {
  if (!previous || !next) return [];
  const stats = [];
  for (const spec of fields) {
    const field = typeof spec === 'string' ? spec : spec.field;
    if (!field || !Array.isArray(previous[field]) || !Array.isArray(next[field])) continue;
    const result = copyRecordPrefix(previous[field], next[field], {
      components: spec.components || 1,
      preserveMean: spec.preserveMean === true
    });
    next[field] = result.values;
    stats.push({
      field,
      kind: 'record-prefix',
      components: spec.components || 1,
      sourceRecords: result.sourceRecords,
      targetRecords: result.targetRecords,
      copiedRecords: result.copiedRecords
    });
  }
  return stats;
}

function sampleGrid(values, width, height, components, x, y, component) {
  const safeWidth = Math.max(1, width);
  const safeHeight = Math.max(1, height);
  const x0 = Math.max(0, Math.min(safeWidth - 1, Math.floor(x)));
  const y0 = Math.max(0, Math.min(safeHeight - 1, Math.floor(y)));
  const x1 = Math.max(0, Math.min(safeWidth - 1, x0 + 1));
  const y1 = Math.max(0, Math.min(safeHeight - 1, y0 + 1));
  const tx = Math.max(0, Math.min(1, x - x0));
  const ty = Math.max(0, Math.min(1, y - y0));
  const idx = (sx, sy) => ((sy * safeWidth + sx) * components) + component;
  const a = finiteNumber(values[idx(x0, y0)]);
  const b = finiteNumber(values[idx(x1, y0)]);
  const c = finiteNumber(values[idx(x0, y1)]);
  const d = finiteNumber(values[idx(x1, y1)]);
  const top = a + (b - a) * tx;
  const bottom = c + (d - c) * tx;
  return top + (bottom - top) * ty;
}

export function remapGridValues(previousValues, nextValues, {
  sourceWidth,
  sourceHeight,
  targetWidth,
  targetHeight,
  components = 1,
  preserveMean = false
} = {}) {
  const source = toArray(previousValues);
  const target = toArray(nextValues);
  const safeComponents = Math.max(1, Math.floor(Number(components) || 1));
  const oldWidth = Math.max(1, Math.floor(Number(sourceWidth) || 1));
  const oldHeight = Math.max(1, Math.floor(Number(sourceHeight) || 1));
  const newWidth = Math.max(1, Math.floor(Number(targetWidth) || 1));
  const newHeight = Math.max(1, Math.floor(Number(targetHeight) || 1));
  if (source.length < oldWidth * oldHeight * safeComponents) {
    return {
      values: target,
      sourceCells: Math.floor(source.length / safeComponents),
      targetCells: Math.floor(target.length / safeComponents),
      remappedCells: 0
    };
  }
  const remapped = [...target];
  for (let y = 0; y < newHeight; y += 1) {
    const sourceY = newHeight === 1 ? 0 : y * (oldHeight - 1) / Math.max(1, newHeight - 1);
    for (let x = 0; x < newWidth; x += 1) {
      const sourceX = newWidth === 1 ? 0 : x * (oldWidth - 1) / Math.max(1, newWidth - 1);
      const cell = y * newWidth + x;
      for (let component = 0; component < safeComponents; component += 1) {
        remapped[cell * safeComponents + component] = sampleGrid(
          source,
          oldWidth,
          oldHeight,
          safeComponents,
          sourceX,
          sourceY,
          component
        );
      }
    }
  }
  if (preserveMean) {
    for (let component = 0; component < safeComponents; component += 1) {
      const sourceMean = meanByComponent(source, safeComponents, component);
      const targetMean = meanByComponent(remapped, safeComponents, component);
      const correction = sourceMean - targetMean;
      for (let i = component; i < remapped.length; i += safeComponents) {
        remapped[i] = finiteNumber(remapped[i]) + correction;
      }
    }
  }
  return {
    values: remapped,
    sourceCells: oldWidth * oldHeight,
    targetCells: newWidth * newHeight,
    remappedCells: newWidth * newHeight
  };
}

export function remapGridFields(previous, next, fields = [], {
  widthKey = 'width',
  heightKey = 'height'
} = {}) {
  if (!previous || !next) return [];
  const stats = [];
  for (const spec of fields) {
    const field = typeof spec === 'string' ? spec : spec.field;
    if (!field || !Array.isArray(previous[field]) || !Array.isArray(next[field])) continue;
    const result = remapGridValues(previous[field], next[field], {
      sourceWidth: previous[widthKey],
      sourceHeight: previous[heightKey],
      targetWidth: next[widthKey],
      targetHeight: next[heightKey],
      components: spec.components || 1,
      preserveMean: spec.preserveMean === true
    });
    next[field] = result.values;
    stats.push({
      field,
      kind: 'grid-resample',
      components: spec.components || 1,
      sourceCells: result.sourceCells,
      targetCells: result.targetCells,
      remappedCells: result.remappedCells
    });
  }
  return stats;
}

export function summarizeSolverRemap({
  solverKey,
  previous,
  next,
  fieldStats = [],
  invariantStats = []
}) {
  return {
    solverKey,
    previousSequence: Number.isFinite(previous?.sequence) ? previous.sequence : null,
    nextSequence: Number.isFinite(next?.sequence) ? next.sequence : null,
    previousElapsedTime: Number.isFinite(previous?.elapsedTime) ? previous.elapsedTime : null,
    nextElapsedTime: Number.isFinite(next?.elapsedTime) ? next.elapsedTime : null,
    fieldStats,
    invariantStats,
    remapped: fieldStats.some((entry) => (
      Number(entry.copiedRecords || 0) > 0 || Number(entry.remappedCells || 0) > 0
    ))
  };
}
