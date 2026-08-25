function compareCell(a, b) {
  return a.x - b.x || a.y - b.y || a.z - b.z;
}

function compareEntry(a, b) {
  const keyA = String(a.key);
  const keyB = String(b.key);
  return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
}

export class DeterministicSpatialHash {
  constructor({
    cellSize = 0.5,
    maxEntriesPerCell = 64,
    maxCells = 16_384,
    maxCandidatePairs = 65_536,
  } = {}) {
    if (!Number.isFinite(cellSize) || cellSize <= 0) {
      throw new RangeError('cellSize must be finite and positive');
    }
    for (const [label, value] of Object.entries({ maxEntriesPerCell, maxCells, maxCandidatePairs })) {
      if (!Number.isInteger(value) || value <= 0) {
        throw new RangeError(`${label} must be a positive integer`);
      }
    }
    this.cellSize = Math.fround(cellSize);
    this.maxEntriesPerCell = maxEntriesPerCell;
    this.maxCells = maxCells;
    this.maxCandidatePairs = maxCandidatePairs;
    this.clear();
  }

  clear() {
    this.cells = new Map();
    this.diagnostics = {
      cellCount: 0,
      insertedReferences: 0,
      overflowedCells: 0,
      overflowedReferences: 0,
      maximumOccupancy: 0,
      candidatePairs: 0,
      droppedCandidatePairs: 0,
      overflowed: false,
    };
  }

  #coordinate(value) {
    return Math.floor(value / this.cellSize);
  }

  #cell(x, y, z) {
    const key = `${x},${y},${z}`;
    let cell = this.cells.get(key);
    if (!cell) {
      if (this.cells.size >= this.maxCells) {
        throw new RangeError(`spatial hash exceeded maxCells (${this.maxCells})`);
      }
      cell = { key, x, y, z, entries: [] };
      this.cells.set(key, cell);
    }
    return cell;
  }

  build(entries) {
    this.clear();
    const ordered = [...entries].sort(compareEntry);
    for (const entry of ordered) {
      const radius = Math.max(0, entry.radius ?? 0);
      const samples = entry.sweptPositions
        ?? [entry.previousPosition ?? entry.position, entry.position];
      let minimumX = Infinity;
      let minimumY = Infinity;
      let minimumZ = Infinity;
      let maximumX = -Infinity;
      let maximumY = -Infinity;
      let maximumZ = -Infinity;
      for (const sample of samples) {
        minimumX = Math.min(minimumX, sample[0]);
        minimumY = Math.min(minimumY, sample[1]);
        minimumZ = Math.min(minimumZ, sample[2]);
        maximumX = Math.max(maximumX, sample[0]);
        maximumY = Math.max(maximumY, sample[1]);
        maximumZ = Math.max(maximumZ, sample[2]);
      }
      const minX = this.#coordinate(minimumX - radius);
      const minY = this.#coordinate(minimumY - radius);
      const minZ = this.#coordinate(minimumZ - radius);
      const maxX = this.#coordinate(maximumX + radius);
      const maxY = this.#coordinate(maximumY + radius);
      const maxZ = this.#coordinate(maximumZ + radius);
      for (let x = minX; x <= maxX; x += 1) {
        for (let y = minY; y <= maxY; y += 1) {
          for (let z = minZ; z <= maxZ; z += 1) {
            const cell = this.#cell(x, y, z);
            cell.entries.push(entry);
            this.diagnostics.insertedReferences += 1;
          }
        }
      }
    }

    for (const cell of this.cells.values()) {
      this.diagnostics.maximumOccupancy = Math.max(
        this.diagnostics.maximumOccupancy,
        cell.entries.length,
      );
      if (cell.entries.length > this.maxEntriesPerCell) {
        this.diagnostics.overflowedCells += 1;
        this.diagnostics.overflowedReferences += cell.entries.length - this.maxEntriesPerCell;
      }
    }
    this.diagnostics.cellCount = this.cells.size;
    this.diagnostics.overflowed = this.diagnostics.overflowedCells > 0;
    return this.diagnostics;
  }

  candidatePairs(pairFilter = null) {
    if (pairFilter !== null && typeof pairFilter !== 'function') {
      throw new TypeError('pairFilter must be a function or null');
    }
    const unique = new Map();
    const cells = [...this.cells.values()].sort(compareCell);
    for (const cell of cells) {
      const entries = cell.entries;
      for (let left = 0; left < entries.length; left += 1) {
        for (let right = left + 1; right < entries.length; right += 1) {
          const a = entries[left];
          const b = entries[right];
          if (a.bodyId === b.bodyId) continue;
          if (pairFilter && !pairFilter(a, b)) continue;
          const pairKey = String(a.key) < String(b.key)
            ? `${a.key}|${b.key}`
            : `${b.key}|${a.key}`;
          if (!unique.has(pairKey)) unique.set(pairKey, [a, b]);
        }
      }
    }
    const ordered = [...unique.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    this.diagnostics.candidatePairs = Math.min(ordered.length, this.maxCandidatePairs);
    this.diagnostics.droppedCandidatePairs = Math.max(0, ordered.length - this.maxCandidatePairs);
    this.diagnostics.overflowed ||= this.diagnostics.droppedCandidatePairs > 0;
    return ordered.slice(0, this.maxCandidatePairs).map(([, pair]) => pair);
  }

  getDiagnostics() {
    return { ...this.diagnostics };
  }
}
