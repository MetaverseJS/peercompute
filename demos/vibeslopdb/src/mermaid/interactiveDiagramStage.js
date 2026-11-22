import { compileExotuiErDiagram, nativeFrameToHtml } from './exotuiMermaidRenderer.js';
import { sanitizeMermaidId, schemaToMermaidEr } from './schemaToMermaid.js';

function parseTranslate(transformStr = '') {
  const match = /translate\(\s*([-+0-9.eE]+)(?:[\s,]+([-+0-9.eE]+))?\s*\)/.exec(String(transformStr || ''));
  if (!match) return { x: 0, y: 0 };
  return {
    x: Number.parseFloat(match[1]) || 0,
    y: Number.parseFloat(match[2] ?? '0') || 0
  };
}

function setTranslate(el, x, y, extraSuffix = '') {
  const suffix = extraSuffix ? ` ${extraSuffix}` : '';
  el.setAttribute('transform', `translate(${x.toFixed(2)}, ${y.toFixed(2)})${suffix}`);
}

function stripTranslate(transformStr = '') {
  return String(transformStr || '')
    .replace(/translate\(\s*[-+0-9.eE]+(?:[\s,]+[-+0-9.eE]+)?\s*\)/g, '')
    .trim();
}

function extractPathEndpoints(d = '') {
  const nums = [];
  const tokenRe = /([MmLlHhVvCcSsQqTtAaZz])|([-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)/g;
  let cmd = '';
  let cx = 0;
  let cy = 0;
  let first = null;
  let last = null;
  let m;
  const readNum = () => {
    const nxt = tokenRe.exec(d);
    return nxt && nxt[2] !== undefined ? Number.parseFloat(nxt[2]) : Number.NaN;
  };
  // Simpler robust SVG path endpoint parser via SVGGeometryElement when in DOM
  while ((m = tokenRe.exec(d)) !== null) {
    if (m[1]) {
      cmd = m[1];
      continue;
    }
    const v = Number.parseFloat(m[2]);
    if (!Number.isFinite(v)) continue;
    nums.push({ cmd, v });
  }
  if (nums.length >= 2) {
    first = { x: nums[0].v, y: nums[1].v };
    last = { x: nums[nums.length - 2].v, y: nums[nums.length - 1].v };
  }
  void cx; void cy; void readNum;
  return { first, last };
}

function measurePathEndpoints(pathEl) {
  try {
    if (typeof pathEl.getTotalLength === 'function' && typeof pathEl.getPointAtLength === 'function') {
      const len = pathEl.getTotalLength();
      if (Number.isFinite(len) && len > 0) {
        const p0 = pathEl.getPointAtLength(0);
        const p1 = pathEl.getPointAtLength(len);
        const pm = pathEl.getPointAtLength(len * 0.5);
        return {
          start: { x: p0.x, y: p0.y },
          end: { x: p1.x, y: p1.y },
          mid: { x: pm.x, y: pm.y }
        };
      }
    }
  } catch {
    // Fallback to d-string parse
  }
  const parsed = extractPathEndpoints(pathEl.getAttribute('d') || '');
  if (!parsed.first || !parsed.last) return null;
  return {
    start: parsed.first,
    end: parsed.last,
    mid: {
      x: (parsed.first.x + parsed.last.x) * 0.5,
      y: (parsed.first.y + parsed.last.y) * 0.5
    }
  };
}

function distToBox(pt, box) {
  const dx = Math.max(box.x - pt.x, 0, pt.x - (box.x + box.w));
  const dy = Math.max(box.y - pt.y, 0, pt.y - (box.y + box.h));
  return Math.hypot(dx, dy);
}

function anchorOnBoxEdge(box, toward) {
  const cx = box.x + box.w * 0.5;
  const cy = box.y + box.h * 0.5;
  const dx = toward.x - cx;
  const dy = toward.y - cy;
  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
    return { x: cx, y: cy, nx: 1, ny: 0 };
  }
  const hw = Math.max(1, box.w * 0.5);
  const hh = Math.max(1, box.h * 0.5);
  const tx = Math.abs(dx) > 1e-4 ? hw / Math.abs(dx) : Infinity;
  const ty = Math.abs(dy) > 1e-4 ? hh / Math.abs(dy) : Infinity;
  if (tx < ty) {
    const sx = Math.sign(dx);
    return { x: cx + sx * hw, y: cy + dy * tx, nx: sx, ny: 0 };
  }
  const sy = Math.sign(dy);
  return { x: cx + dx * ty, y: cy + sy * hh, nx: 0, ny: sy };
}

function buildRoutedEdgePath(fromBox, toBox, {
  isSelfLoop = false,
  parallelIndex = 0,
  parallelCount = 1,
  canonicalForward = true
} = {}) {
  if (isSelfLoop) {
    // Self-referential foreign key loop on the left edge (matching Mermaid's marker tangents!)
    const k = Math.max(0, parallelIndex);
    const x = fromBox.x;
    const padY = Math.min(fromBox.h * 0.25, 22 + k * 8);
    const y1 = fromBox.y + padY;
    const y2 = Math.max(y1 + 36, fromBox.y + fromBox.h - padY);
    const loop = 54 + k * 38;
    const d = `M ${x.toFixed(1)} ${y1.toFixed(1)} C ${(x - loop).toFixed(1)} ${y1.toFixed(1)}, ${(x - loop).toFixed(1)} ${y2.toFixed(1)}, ${x.toFixed(1)} ${y2.toFixed(1)}`;
    const curveMidX = x - loop * 0.75;
    const midY = (y1 + y2) * 0.5;
    return {
      d,
      mid: { x: curveMidX - 18, y: midY },
      extent: { minX: x - loop - 44, minY: y1 - 16, maxX: x + 16, maxY: y2 + 16 }
    };
  }
  const fromCenter = { x: fromBox.x + fromBox.w * 0.5, y: fromBox.y + fromBox.h * 0.5 };
  const toCenter = { x: toBox.x + toBox.w * 0.5, y: toBox.y + toBox.h * 0.5 };
  const p0 = anchorOnBoxEdge(fromBox, toCenter);
  const p1 = anchorOnBoxEdge(toBox, fromCenter);

  // Fan out parallel edges between the same pair of tables so none collapse underneath each other
  const slot = parallelCount > 1 ? (parallelIndex - (parallelCount - 1) * 0.5) : 0;
  let s0x = p0.x;
  let s0y = p0.y;
  let s1x = p1.x;
  let s1y = p1.y;
  let perpX = 0;
  let perpY = 0;

  if (slot !== 0) {
    const dir = canonicalForward ? 1 : -1;
    const vx = (toCenter.x - fromCenter.x) * dir;
    const vy = (toCenter.y - fromCenter.y) * dir;
    const vlen = Math.hypot(vx, vy) || 1;
    perpX = -vy / vlen;
    perpY = vx / vlen;

    const shiftEdge = (anchor, box) => {
      const tx = Math.abs(anchor.nx) > 0.5 ? 0 : 1;
      const ty = Math.abs(anchor.ny) > 0.5 ? 0 : 1;
      const maxSpan = (tx ? box.w : box.h) * 0.34;
      const dot = tx * perpX + ty * perpY;
      const sign = dot < 0 ? -1 : 1;
      const delta = Math.max(-maxSpan, Math.min(maxSpan, slot * 34 * sign));
      return {
        x: anchor.x + tx * delta,
        y: anchor.y + ty * delta
      };
    };
    const shifted0 = shiftEdge(p0, fromBox);
    const shifted1 = shiftEdge(p1, toBox);
    s0x = shifted0.x;
    s0y = shifted0.y;
    s1x = shifted1.x;
    s1y = shifted1.y;
  }

  const dist = Math.hypot(s1x - s0x, s1y - s0y);
  const pull = Math.max(28, Math.min(110, dist * 0.35));
  const bend = slot * 28;
  const c1x = s0x + p0.nx * pull + perpX * bend;
  const c1y = s0y + p0.ny * pull + perpY * bend;
  const c2x = s1x + p1.nx * pull + perpX * bend;
  const c2y = s1y + p1.ny * pull + perpY * bend;
  const d = `M ${s0x.toFixed(1)} ${s0y.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${s1x.toFixed(1)} ${s1y.toFixed(1)}`;
  // Cubic Bezier midpoint at t=0.5
  const mid = {
    x: 0.125 * s0x + 0.375 * c1x + 0.375 * c2x + 0.125 * s1x,
    y: 0.125 * s0y + 0.375 * c1y + 0.375 * c2y + 0.125 * s1y
  };
  return { d, mid };
}

/**
 * Interactive Mermaid ER Stage:
 *  - Compiles live schema via ExoTUI MermaidStandardRenderer (mermaid@12.1.0)
 *  - Supports Interactive SVG, ExoTUI Native ASCII Cell Raster, and Raw Mermaid Source
 *  - Stretch goal: Drag any ER entity box to reorganize the schema with real-time
 *    connected edge re-routing & persistent drag offsets across live SQL updates!
 *  - Click any entity to inspect/query/alter/drop straight from the diagram.
 */
export function createInteractiveDiagramStage({
  container,
  onSelectEntityQuery,
  onExecuteSql,
  onStatus,
  onOffsetsChange
} = {}) {
  const root = document.createElement('div');
  root.className = 'vs-diagram-stage';

  const toolbar = document.createElement('div');
  toolbar.className = 'vs-diagram-toolbar';
  toolbar.innerHTML = `
    <div class="vs-btn-group" role="tablist" aria-label="Schema View Mode">
      <button type="button" class="vs-btn vs-mode-btn is-active" data-mode="svg" title="Interactive draggable Mermaid ER SVG">SVG</button>
      <button type="button" class="vs-btn vs-mode-btn" data-mode="cells" title="ExoTUI renderMermaidNativeFrame terminal cell raster">ASCII Cells</button>
      <button type="button" class="vs-btn vs-mode-btn" data-mode="source" title="Raw Mermaid erDiagram source">Source</button>
    </div>
    <div class="vs-btn-group">
      <button type="button" class="vs-btn" data-action="zoom-out" title="Zoom out">-</button>
      <button type="button" class="vs-btn" data-action="fit" title="Fit diagram">Fit</button>
      <button type="button" class="vs-btn" data-action="zoom-in" title="Zoom in">+</button>
      <button type="button" class="vs-btn" data-action="reset-layout" title="Reset dragged entity positions">Reset Pos</button>
    </div>
    <span class="vs-diagram-hint">Drag entities to rearrange · Click entity for SQL actions</span>
  `;

  const entityActionBar = document.createElement('div');
  entityActionBar.className = 'vs-entity-bar';
  entityActionBar.hidden = true;
  entityActionBar.innerHTML = `
    <span class="vs-entity-bar-label"></span>
    <button type="button" class="vs-btn vs-btn-accent" data-entity-act="select">SELECT *</button>
    <button type="button" class="vs-btn" data-entity-act="add-col">+ Column</button>
    <button type="button" class="vs-btn" data-entity-act="rename">Rename</button>
    <button type="button" class="vs-btn vs-btn-danger" data-entity-act="drop">DROP TABLE</button>
    <button type="button" class="vs-btn" data-entity-act="clear" title="Dismiss selection">×</button>
  `;

  const viewport = document.createElement('div');
  viewport.className = 'vs-diagram-viewport';

  const svgPanLayer = document.createElement('div');
  svgPanLayer.className = 'vs-diagram-pan-layer';
  viewport.append(svgPanLayer);

  const cellsView = document.createElement('pre');
  cellsView.className = 'vs-diagram-cells';
  cellsView.hidden = true;

  const sourceView = document.createElement('pre');
  sourceView.className = 'vs-diagram-source';
  sourceView.hidden = true;

  const statusLine = document.createElement('div');
  statusLine.className = 'vs-diagram-status';
  statusLine.textContent = 'Ready — waiting for schema…';

  root.append(toolbar, entityActionBar, viewport, cellsView, sourceView, statusLine);
  container.append(root);

  let mode = 'svg';
  let currentSchema = null;
  let currentDiff = null;
  let currentTheme = null;
  let currentMermaidSource = '';
  let renderSeq = 0;
  let selectedTable = null;

  // Persistent per-table drag offsets (in SVG coordinate space!)
  const customOffsets = new Map();

  // Pan & zoom state for SVG viewport
  const viewState = { scale: 1, tx: 16, ty: 16 };
  let activeSvg = null;
  let entityMap = new Map(); // tableName -> EntityRecord
  let edgeList = [];

  function applyViewportTransform() {
    svgPanLayer.style.transform = `translate(${viewState.tx.toFixed(1)}px, ${viewState.ty.toFixed(1)}px) scale(${viewState.scale.toFixed(3)})`;
  }

  function fitToViewport() {
    if (!activeSvg) return;
    const vw = viewport.clientWidth || 500;
    const vh = viewport.clientHeight || 360;
    const vb = activeSvg.viewBox?.baseVal;
    const sw = (vb && vb.width > 0) ? vb.width : (activeSvg.getBBox?.().width || 600);
    const sh = (vb && vb.height > 0) ? vb.height : (activeSvg.getBBox?.().height || 400);
    const pad = 28;
    const scale = Math.max(0.25, Math.min(1.6, Math.min((vw - pad) / sw, (vh - pad) / sh)));
    viewState.scale = scale;
    viewState.tx = Math.max(12, (vw - sw * scale) * 0.5);
    viewState.ty = Math.max(12, (vh - sh * scale) * 0.5);
    applyViewportTransform();
  }

  function updateEntityBar() {
    if (!selectedTable || !currentSchema?.tables?.some((t) => t.name === selectedTable)) {
      selectedTable = null;
      entityActionBar.hidden = true;
      for (const rec of entityMap.values()) rec.el.classList.remove('vs-entity-selected');
      return;
    }
    const tbl = currentSchema.tables.find((t) => t.name === selectedTable);
    entityActionBar.hidden = false;
    entityActionBar.querySelector('.vs-entity-bar-label').textContent =
      `TABLE "${tbl.name}" (${tbl.rowCount} rows · ${tbl.columns.length} cols)`;
    for (const [name, rec] of entityMap.entries()) {
      rec.el.classList.toggle('vs-entity-selected', name === selectedTable);
    }
  }

  function getEntityCurrentBox(rec) {
    const off = customOffsets.get(rec.tableName) || { dx: 0, dy: 0 };
    return {
      x: rec.baseBox.x + off.dx,
      y: rec.baseBox.y + off.dy,
      w: rec.baseBox.w,
      h: rec.baseBox.h
    };
  }

  function expandSvgViewBoxIfNeeded({ compensatePan = false } = {}) {
    if (!activeSvg || entityMap.size === 0) return;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const rec of entityMap.values()) {
      const box = getEntityCurrentBox(rec);
      minX = Math.min(minX, box.x - 110);
      minY = Math.min(minY, box.y - 48);
      maxX = Math.max(maxX, box.x + box.w + 64);
      maxY = Math.max(maxY, box.y + box.h + 48);
    }
    if (!Number.isFinite(minX)) return;
    const vb = activeSvg.viewBox?.baseVal;
    const hasVb = Boolean(vb && vb.width > 0 && vb.height > 0);
    const oldMinX = hasVb ? vb.x : minX;
    const oldMinY = hasVb ? vb.y : minY;
    const curMinX = hasVb ? Math.min(vb.x, minX) : minX;
    const curMinY = hasVb ? Math.min(vb.y, minY) : minY;
    const curMaxX = hasVb ? Math.max(vb.x + vb.width, maxX) : maxX;
    const curMaxY = hasVb ? Math.max(vb.y + vb.height, maxY) : maxY;
    const w = Math.max(200, curMaxX - curMinX);
    const h = Math.max(160, curMaxY - curMinY);
    activeSvg.setAttribute('viewBox', `${curMinX.toFixed(1)} ${curMinY.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`);
    activeSvg.setAttribute('width', `${Math.ceil(w)}`);
    activeSvg.setAttribute('height', `${Math.ceil(h)}`);
    if (compensatePan && hasVb && (curMinX !== oldMinX || curMinY !== oldMinY)) {
      viewState.tx += (curMinX - oldMinX) * viewState.scale;
      viewState.ty += (curMinY - oldMinY) * viewState.scale;
      applyViewportTransform();
    }
  }

  function updateConnectedEdges(movedTableName = null) {
    for (const edge of edgeList) {
      if (movedTableName && edge.from.tableName !== movedTableName && edge.to.tableName !== movedTableName) {
        continue;
      }
      const fromBox = getEntityCurrentBox(edge.from);
      const toBox = getEntityCurrentBox(edge.to);
      const isSelfLoop = edge.from.tableName === edge.to.tableName;
      const routed = buildRoutedEdgePath(fromBox, toBox, {
        isSelfLoop,
        parallelIndex: edge.parallelIndex || 0,
        parallelCount: edge.parallelCount || 1,
        canonicalForward: edge.canonicalForward !== false
      });
      edge.pathEl.setAttribute('d', routed.d);
      if (edge.labelEl) {
        setTranslate(
          edge.labelEl,
          routed.mid.x,
          routed.mid.y,
          edge.labelExtraTransform
        );
      }
    }
  }

  function applyAllCustomOffsets() {
    const movedTables = [];
    for (const [tableName, rec] of entityMap.entries()) {
      const off = customOffsets.get(tableName);
      if (off && (off.dx !== 0 || off.dy !== 0)) {
        setTranslate(rec.el, rec.baseTranslate.x + off.dx, rec.baseTranslate.y + off.dy, rec.extraTransform);
        movedTables.push(tableName);
      }
    }
    if (movedTables.length > 0) {
      for (const tbl of movedTables) updateConnectedEdges(tbl);
      expandSvgViewBoxIfNeeded({ compensatePan: false });
    }
  }

  /**
   * Discovers Mermaid 12.1.0 ER entity `<g>` groups, relationship `<path>` edges,
   * and edge label groups inside the compiled SVG, then wires pointer drag + click.
   */
  function wireInteractiveSvg(svg, schema, diff) {
    activeSvg = svg;
    entityMap = new Map();
    edgeList = [];

    // Ensure explicit pixel dimensions so pan/zoom works predictably
    const vb = svg.viewBox?.baseVal;
    if (vb && vb.width > 0 && vb.height > 0) {
      svg.setAttribute('width', String(Math.ceil(vb.width)));
      svg.setAttribute('height', String(Math.ceil(vb.height)));
      svg.style.maxWidth = 'none';
    }

    const tables = Array.isArray(schema?.tables) ? schema.tables : [];
    const idToTable = new Map();
    const usedIds = new Set();
    for (const tbl of tables) {
      let candidate = sanitizeMermaidId(tbl.name, 'table');
      let suffix = 2;
      while (usedIds.has(candidate)) {
        candidate = `${sanitizeMermaidId(tbl.name, 'table')}_${suffix++}`;
      }
      usedIds.add(candidate);
      idToTable.set(candidate.toLowerCase(), tbl.name);
      idToTable.set(tbl.name.toLowerCase(), tbl.name);
    }

    // Mermaid 12.1.0 + ExoTUI renders ER entities as:
    //   <g class="node default" id="exotui-mermaid-standard-2-entity-audit_logs-0" transform="translate(...)">
    const candidateGroups = Array.from(svg.querySelectorAll('g.node, g[id*="-entity-"], g[id^="entity-"], g[data-id]'));
    const addedSet = new Set(diff?.addedTables || []);
    const alteredSet = new Set(diff?.alteredTables || []);

    for (const group of candidateGroups) {
      const rawId = group.getAttribute('id') || '';
      const dataId = group.getAttribute('data-id') || '';
      const matchedTable = matchGroupToTable(rawId, dataId, group.textContent || '', idToTable, tables);
      if (!matchedTable || entityMap.has(matchedTable)) continue;

      const rawTransform = group.getAttribute('transform') || '';
      const baseTranslate = parseTranslate(rawTransform);
      const extraTransform = stripTranslate(rawTransform);

      // Measure entity box in SVG root coordinates via CTM relative to SVG
      const bbox = measureGroupInSvgCoords(svg, group, baseTranslate);
      if (!bbox || bbox.w <= 0 || bbox.h <= 0) continue;

      group.classList.add('vs-er-entity');
      group.dataset.tableName = matchedTable;
      group.style.cursor = 'grab';

      if (addedSet.has(matchedTable)) group.classList.add('vs-entity-added');
      else if (alteredSet.has(matchedTable)) group.classList.add('vs-entity-altered');

      const record = {
        tableName: matchedTable,
        el: group,
        baseTranslate,
        extraTransform,
        baseBox: bbox
      };
      entityMap.set(matchedTable, record);
      bindEntityPointerDrag(svg, record);
    }

    // Discover relationship edge <path> elements and pair them deterministically
    // using Mermaid 12.1.0's semantic IDs ("...id_entity-<FROM>-n_entity-<TO>-m_k")
    // with geometric endpoint matching as fallback.
    const entityRecords = Array.from(entityMap.values());
    if (entityRecords.length > 0) {
      const edgePaths = Array.from(
        svg.querySelectorAll('path.relationshipLine, path.er.relationshipLine, g.edgePaths path, path.flowchart-link')
      );
      const edgeLabelGroups = Array.from(
        svg.querySelectorAll('g.edgeLabel, g.relationshipLabelBox, text.relationshipLabel')
      );
      const labelCoords = edgeLabelGroups.map((el) => {
        const rawT = el.getAttribute('transform') || '';
        const baseT = parseTranslate(rawT);
        const extraT = stripTranslate(rawT);
        const box = measureGroupInSvgCoords(svg, el, baseT);
        const innerDataId = el.querySelector?.('[data-id]')?.getAttribute('data-id') || el.getAttribute('data-id') || '';
        return {
          el,
          baseT,
          extraT,
          dataId: innerDataId,
          center: box ? { x: box.x + box.w * 0.5, y: box.y + box.h * 0.5 } : baseT,
          claimed: false
        };
      });

      for (const pathEl of edgePaths) {
        const endpoints = measurePathEndpoints(pathEl);
        if (!endpoints) continue;

        const pathId = pathEl.getAttribute('id') || '';
        let bestFrom = null;
        let bestTo = null;
        const semanticEdge = /id_entity-(.+?)-\d+_entity-(.+?)-\d+_\d+$/.exec(pathId);
        if (semanticEdge) {
          const fromTbl = idToTable.get(semanticEdge[1].toLowerCase());
          const toTbl = idToTable.get(semanticEdge[2].toLowerCase());
          if (fromTbl && toTbl && entityMap.has(fromTbl) && entityMap.has(toTbl)) {
            bestFrom = entityMap.get(fromTbl);
            bestTo = entityMap.get(toTbl);
          }
        }

        if (!bestFrom || !bestTo) {
          let bestFromDist = Infinity;
          let bestToDist = Infinity;
          for (const rec of entityRecords) {
            const d0 = distToBox(endpoints.start, rec.baseBox);
            if (d0 < bestFromDist) {
              bestFromDist = d0;
              bestFrom = rec;
            }
            const d1 = distToBox(endpoints.end, rec.baseBox);
            if (d1 < bestToDist) {
              bestToDist = d1;
              bestTo = rec;
            }
          }
        }
        if (!bestFrom || !bestTo) continue;

        // Match edge label by exact Mermaid data-id first, else nearest midpoint
        let matchedLabel = null;
        if (semanticEdge) {
          const exactKey = semanticEdge[0];
          matchedLabel = labelCoords.find((lbl) => !lbl.claimed && lbl.dataId === exactKey) || null;
        }
        if (!matchedLabel) {
          let bestLabelDist = 140;
          for (const lbl of labelCoords) {
            if (lbl.claimed) continue;
            const d = Math.hypot(lbl.center.x - endpoints.mid.x, lbl.center.y - endpoints.mid.y);
            if (d < bestLabelDist) {
              bestLabelDist = d;
              matchedLabel = lbl;
            }
          }
        }
        if (matchedLabel) matchedLabel.claimed = true;

        edgeList.push({
          pathEl,
          from: bestFrom,
          to: bestTo,
          initialMid: endpoints.mid,
          labelEl: matchedLabel?.el || null,
          labelBaseTranslate: matchedLabel?.baseT || { x: 0, y: 0 },
          labelExtraTransform: matchedLabel?.extraT || '',
          parallelIndex: 0,
          parallelCount: 1,
          canonicalForward: bestFrom.tableName <= bestTo.tableName
        });
      }

      // Assign parallel edge slots for multiple FKs sharing the same table pair (or self-loop table)
      const pairGroups = new Map();
      for (const edge of edgeList) {
        const pairKey = [edge.from.tableName, edge.to.tableName].sort().join('\0');
        let group = pairGroups.get(pairKey);
        if (!group) {
          group = [];
          pairGroups.set(pairKey, group);
        }
        group.push(edge);
      }
      for (const group of pairGroups.values()) {
        group.forEach((edge, idx) => {
          edge.parallelIndex = idx;
          edge.parallelCount = group.length;
        });
      }
    }

    // Re-apply any custom user drag offsets persisted across live SQL updates!
    applyAllCustomOffsets();
    updateEntityBar();
  }

  function bindEntityPointerDrag(svg, rec) {
    let dragging = false;
    let moved = false;
    let startClientX = 0;
    let startClientY = 0;
    let startDx = 0;
    let startDy = 0;

    rec.el.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      event.stopPropagation();
      event.preventDefault();
      dragging = true;
      moved = false;
      startClientX = event.clientX;
      startClientY = event.clientY;
      const existing = customOffsets.get(rec.tableName) || { dx: 0, dy: 0 };
      startDx = existing.dx;
      startDy = existing.dy;
      rec.el.classList.add('vs-entity-dragging');
      rec.el.style.cursor = 'grabbing';
      try {
        rec.el.setPointerCapture(event.pointerId);
      } catch {
        // Ignore synthetic events without active pointerId
      }
    });

    const onMove = (event) => {
      if (!dragging) return;
      event.stopPropagation();
      const screenDx = event.clientX - startClientX;
      const screenDy = event.clientY - startClientY;
      if (Math.hypot(screenDx, screenDy) > 3) moved = true;
      const svgDx = screenDx / Math.max(0.1, viewState.scale);
      const svgDy = screenDy / Math.max(0.1, viewState.scale);
      const nextDx = startDx + svgDx;
      const nextDy = startDy + svgDy;
      customOffsets.set(rec.tableName, { dx: nextDx, dy: nextDy });
      setTranslate(
        rec.el,
        rec.baseTranslate.x + nextDx,
        rec.baseTranslate.y + nextDy,
        rec.extraTransform
      );
      updateConnectedEdges(rec.tableName);
    };

    const onUp = (event) => {
      if (!dragging) return;
      event.stopPropagation();
      dragging = false;
      rec.el.classList.remove('vs-entity-dragging');
      rec.el.style.cursor = 'grab';
      try {
        rec.el.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore
      }
      if (moved) {
        expandSvgViewBoxIfNeeded({ compensatePan: true });
        const off = customOffsets.get(rec.tableName);
        statusLine.textContent = `Moved "${rec.tableName}" (${Math.round(off.dx)}, ${Math.round(off.dy)}) · layout pinned across SQL updates`;
        onStatus?.(statusLine.textContent);
        onOffsetsChange?.(Object.fromEntries(customOffsets.entries()));
      } else {
        selectedTable = selectedTable === rec.tableName ? null : rec.tableName;
        updateEntityBar();
      }
    };

    rec.el.addEventListener('pointermove', onMove);
    rec.el.addEventListener('pointerup', onUp);
    rec.el.addEventListener('pointercancel', onUp);
  }

  // Background pan + wheel zoom on viewport
  let panning = false;
  let panStartX = 0;
  let panStartY = 0;
  let panOrigTx = 0;
  let panOrigTy = 0;

  viewport.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || mode !== 'svg') return;
    if (event.target.closest('.vs-er-entity')) return;
    panning = true;
    panStartX = event.clientX;
    panStartY = event.clientY;
    panOrigTx = viewState.tx;
    panOrigTy = viewState.ty;
    viewport.classList.add('is-panning');
  });

  window.addEventListener('pointermove', (event) => {
    if (!panning) return;
    viewState.tx = panOrigTx + (event.clientX - panStartX);
    viewState.ty = panOrigTy + (event.clientY - panStartY);
    applyViewportTransform();
  });

  window.addEventListener('pointerup', () => {
    if (!panning) return;
    panning = false;
    viewport.classList.remove('is-panning');
  });

  viewport.addEventListener('wheel', (event) => {
    if (mode !== 'svg') return;
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.12 : 0.89;
    viewState.scale = Math.max(0.25, Math.min(3.0, viewState.scale * factor));
    applyViewportTransform();
  }, { passive: false });

  // Toolbar actions
  toolbar.addEventListener('click', (event) => {
    const modeBtn = event.target.closest('.vs-mode-btn');
    if (modeBtn) {
      setMode(modeBtn.dataset.mode);
      return;
    }
    const actionBtn = event.target.closest('[data-action]');
    if (!actionBtn) return;
    const action = actionBtn.dataset.action;
    if (action === 'zoom-in') {
      viewState.scale = Math.min(3.0, viewState.scale * 1.18);
      applyViewportTransform();
    } else if (action === 'zoom-out') {
      viewState.scale = Math.max(0.25, viewState.scale * 0.85);
      applyViewportTransform();
    } else if (action === 'fit') {
      fitToViewport();
    } else if (action === 'reset-layout') {
      customOffsets.clear();
      onOffsetsChange?.({});
      if (currentSchema) void render({ schema: currentSchema, diff: currentDiff, theme: currentTheme, autoFit: true });
    }
  });

  // Direct visual schema action bar
  entityActionBar.addEventListener('click', async (event) => {
    const btn = event.target.closest('[data-entity-act]');
    if (!btn || !selectedTable) return;
    const act = btn.dataset.entityAct;
    const tbl = selectedTable;
    if (act === 'clear') {
      selectedTable = null;
      updateEntityBar();
      return;
    }
    if (act === 'select') {
      onSelectEntityQuery?.(`SELECT * FROM "${tbl}" LIMIT 50;`, tbl);
      return;
    }
    if (act === 'add-col') {
      const colName = window.prompt(`Add column to "${tbl}" (name):`, 'chaos_note');
      if (!colName || !colName.trim()) return;
      const colType = window.prompt(`SQL type for "${colName.trim()}":`, 'TEXT') || 'TEXT';
      const safeCol = colName.trim().replace(/"/g, '');
      const safeType = colType.trim().replace(/[;]/g, '') || 'TEXT';
      await onExecuteSql?.(`ALTER TABLE "${tbl}" ADD COLUMN "${safeCol}" ${safeType};`, 'DIAGRAM-EDIT');
      return;
    }
    if (act === 'rename') {
      const nextName = window.prompt(`Rename table "${tbl}" to:`, `${tbl}_v2`);
      if (!nextName || !nextName.trim()) return;
      const safeNext = nextName.trim().replace(/"/g, '');
      selectedTable = safeNext;
      await onExecuteSql?.(`ALTER TABLE "${tbl}" RENAME TO "${safeNext}";`, 'DIAGRAM-EDIT');
      return;
    }
    if (act === 'drop') {
      const dialect = currentSchema?.dialect || 'sqlite';
      const dropSql = dialect === 'postgres'
        ? `DROP TABLE "${tbl}" CASCADE;`
        : `DROP TABLE "${tbl}";`;
      selectedTable = null;
      await onExecuteSql?.(dropSql, 'DIAGRAM-EDIT');
    }
  });

  function setMode(nextMode) {
    mode = nextMode;
    for (const btn of toolbar.querySelectorAll('.vs-mode-btn')) {
      btn.classList.toggle('is-active', btn.dataset.mode === mode);
    }
    viewport.hidden = mode !== 'svg';
    cellsView.hidden = mode !== 'cells';
    sourceView.hidden = mode !== 'source';
    if (mode === 'cells' && currentSchema) {
      void render({ schema: currentSchema, diff: currentDiff, theme: currentTheme, autoFit: false });
    }
  }

  async function render({ schema, diff = null, theme = currentTheme, autoFit = false } = {}) {
    currentSchema = schema;
    currentDiff = diff;
    currentTheme = theme;
    const seq = ++renderSeq;
    const source = schemaToMermaidEr(schema, { includeRowCounts: true });
    currentMermaidSource = source;
    sourceView.textContent = source;

    const includeNativeCells = mode === 'cells';
    statusLine.textContent = `Compiling Mermaid 12.1.0 (${schema?.tables?.length ?? 0} tables, ${schema?.relations?.length ?? 0} FKs)…`;

    try {
      const width = Math.max(480, viewport.clientWidth || 720);
      const compiled = await compileExotuiErDiagram({
        source,
        theme,
        containerWidth: width,
        includeNativeCells
      });
      if (seq !== renderSeq) return;

      svgPanLayer.innerHTML = compiled.diagram.svg;
      const svg = svgPanLayer.querySelector('svg');
      if (svg) {
        wireInteractiveSvg(svg, schema, diff);
        if (autoFit || viewState.scale === 1 && viewState.tx === 16 && viewState.ty === 16) {
          fitToViewport();
        } else {
          applyViewportTransform();
        }
      }

      if (includeNativeCells) {
        if (compiled.nativeFrame) {
          cellsView.innerHTML = nativeFrameToHtml(compiled.nativeFrame);
        } else {
          cellsView.textContent = compiled.diagnostics.join('\n') || '(No native cell frame available)';
        }
      }

      const pinnedCount = [...customOffsets.keys()].filter((k) => entityMap.has(k)).length;
      statusLine.textContent =
        `ExoTUI Mermaid ${compiled.diagram.version} · ${entityMap.size} entities · ${edgeList.length} edges`
        + (pinnedCount ? ` · ${pinnedCount} custom-positioned` : '');
    } catch (error) {
      if (seq !== renderSeq) return;
      statusLine.textContent = `Mermaid render error: ${error?.message || error}`;
      svgPanLayer.innerHTML = `<pre class="vs-error-box">${String(error?.message || error)}</pre>`;
    }
  }

  return {
    element: root,
    render,
    setMode,
    fitToViewport,
    getMermaidSource: () => currentMermaidSource,
    getCustomOffsets: () => Object.fromEntries(customOffsets.entries()),
    setCustomOffsets(offsetsObj) {
      customOffsets.clear();
      if (offsetsObj && typeof offsetsObj === 'object') {
        for (const [k, v] of Object.entries(offsetsObj)) {
          if (v && Number.isFinite(v.dx) && Number.isFinite(v.dy)) {
            customOffsets.set(k, { dx: v.dx, dy: v.dy });
          }
        }
      }
      applyAllCustomOffsets();
    },
    getEntityNames: () => Array.from(entityMap.keys()),
    getEdgeCount: () => edgeList.length,
    getMode: () => mode,
    dispose() {
      root.remove();
    }
  };
}

function matchGroupToTable(rawId, dataId, textContent, idToTable, tables) {
  if (dataId && idToTable.has(dataId.toLowerCase())) {
    return idToTable.get(dataId.toLowerCase());
  }
  // Mermaid 12.1.0 + ExoTUI ER entity IDs look like:
  //   "exotui-mermaid-standard-2-entity-audit_logs-0" or "entity-users-0"
  const entityMatch = /(?:^|-)entity-(.+?)-\d+$/.exec(rawId);
  if (entityMatch) {
    const candidate = entityMatch[1].toLowerCase();
    if (idToTable.has(candidate)) return idToTable.get(candidate);
  }
  const stripped = rawId.replace(/^.*entity-/, '').replace(/-\d+$/, '').toLowerCase();
  if (stripped && idToTable.has(stripped)) {
    return idToTable.get(stripped);
  }
  // Match by header label text (e.g. "users (4)")
  const normalizedText = textContent.trim().toLowerCase();
  for (const tbl of tables) {
    if (normalizedText.startsWith(`${tbl.name.toLowerCase()} (`) || normalizedText === tbl.name.toLowerCase()) {
      return tbl.name;
    }
  }
  return null;
}

function measureGroupInSvgCoords(svg, el, fallbackTranslate) {
  try {
    const localBox = el.getBBox();
    const elCtm = el.getCTM?.();
    const svgCtm = svg.getCTM?.();
    if (elCtm && svgCtm && typeof svgCtm.inverse === 'function') {
      const m = svgCtm.inverse().multiply(elCtm);
      const pt = svg.createSVGPoint();
      pt.x = localBox.x;
      pt.y = localBox.y;
      const p0 = pt.matrixTransform(m);
      pt.x = localBox.x + localBox.width;
      pt.y = localBox.y + localBox.height;
      const p1 = pt.matrixTransform(m);
      return {
        x: Math.min(p0.x, p1.x),
        y: Math.min(p0.y, p1.y),
        w: Math.abs(p1.x - p0.x),
        h: Math.abs(p1.y - p0.y)
      };
    }
    return {
      x: localBox.x + fallbackTranslate.x,
      y: localBox.y + fallbackTranslate.y,
      w: localBox.width,
      h: localBox.height
    };
  } catch {
    return null;
  }
}
