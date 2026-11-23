import { buildSparklinePath } from './networkAnalysis.js';

const formatBps = (bps) => {
  const val = Number(bps) || 0;
  if (val >= 1024 * 1024) return `${(val / (1024 * 1024)).toFixed(1)} MB/s`;
  if (val >= 1024) return `${(val / 1024).toFixed(1)} KB/s`;
  return `${Math.round(val)} B/s`;
};

const shortId = (id) => {
  const s = String(id || '');
  if (s.length <= 12) return s;
  return `${s.slice(0, 6)}…${s.slice(-4)}`;
};

function renderSparklineRow(label, latestText, values, stroke = '#00ff6a') {
  const row = document.createElement('div');
  row.className = 'spark-row';
  const meta = document.createElement('div');
  meta.className = 'spark-label';
  meta.textContent = `${label}: ${latestText}`;
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 110 22');
  svg.setAttribute('width', '110');
  svg.setAttribute('height', '22');
  svg.setAttribute('class', 'spark-svg');
  const pathData = buildSparklinePath(values, 110, 22);
  if (pathData) {
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', stroke);
    path.setAttribute('stroke-width', '1.5');
    svg.appendChild(path);
  }
  row.append(meta, svg);
  return row;
}

/** Safe text-only rendering for remote metadata and graph diagnostics. */
export function renderObservedSummary({
  summaryElement,
  modelsElement,
  applicationSelect,
  subgroupSelect,
  diagnosticsElement,
  subgroupsElement,
  relayAuditElement,
  sparklinesElement
}, view, historySamples = [], { relayHealth = [], directUnicastCount = 0 } = {}) {
  if (applicationSelect) {
    const selected = applicationSelect.value;
    const values = ['', ...view.applications];
    if (selected && !values.includes(selected)) values.push(selected);
    if ([...applicationSelect.options].map((o) => o.value).join('\n') !== values.join('\n')) {
      applicationSelect.replaceChildren(...values.map((value) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value || 'All applications';
        return option;
      }));
      applicationSelect.value = selected;
    }
  }
  if (subgroupSelect && Array.isArray(view.subgroups)) {
    const selected = subgroupSelect.value;
    const entries = [{ value: '', label: `All subgroups (${view.subgroups.length})` },
      ...view.subgroups.map((sg) => ({
        value: sg.id,
        label: `${sg.label} (${sg.peerCount})`
      }))];
    if (selected && !entries.some((e) => e.value === selected)) {
      entries.push({ value: selected, label: selected });
    }
    const sig = entries.map((e) => `${e.value}=${e.label}`).join('\n');
    if (subgroupSelect.dataset.sig !== sig) {
      subgroupSelect.replaceChildren(...entries.map((entry) => {
        const option = document.createElement('option');
        option.value = entry.value;
        option.textContent = entry.label;
        return option;
      }));
      subgroupSelect.value = selected;
      subgroupSelect.dataset.sig = sig;
    }
  }

  const { summary, compute, diagnostics } = view;
  if (summaryElement) {
    summaryElement.textContent = [
      `${summary.active} reporting peers · ${summary.stale} stale · ${summary.sessionOnly} session only${summary.rootNodes ? ` · ${summary.rootNodes} root` : ''}`,
      `${compute.workerCount} workers · ${compute.activeTasks} active tasks · ${compute.queuedTasks} queued`,
      'Reachable reporting network instances; coverage is partial.',
      ...(summary.sessionOnly ? ['Older demo tabs need an updated build for full telemetry.'] : [])
    ].join('\n');
  }

  if (diagnosticsElement && diagnostics) {
    const resilience = diagnostics.nodeCount <= 1
      ? 'N/A (<=1 peer)'
      : diagnostics.wouldPartitionWithoutRelay
        ? `WARN: splits into ${diagnostics.componentCount} components without relay`
        : diagnostics.isPartitioned
          ? `PARTITIONED (${diagnostics.componentCount} components)`
          : 'RESILIENT (1 P2P component without relay)';
    const pathLine = [
      diagnostics.pathMix['lan-host'] ? `LAN:${diagnostics.pathMix['lan-host']}` : null,
      diagnostics.pathMix['nat-srflx'] || diagnostics.pathMix['nat-prflx']
        ? `NAT:${(diagnostics.pathMix['nat-srflx'] || 0) + (diagnostics.pathMix['nat-prflx'] || 0)}`
        : null,
      diagnostics.pathMix['webrtc-direct'] ? `WebRTC:${diagnostics.pathMix['webrtc-direct']}` : null,
      diagnostics.pathMix['relay-webrtc'] ? `RelayRTC:${diagnostics.pathMix['relay-webrtc']}` : null,
      diagnostics.pathMix['turn-relay'] ? `TURN:${diagnostics.pathMix['turn-relay']}` : null,
      diagnostics.pathMix['circuit-relay'] ? `Circuit:${diagnostics.pathMix['circuit-relay']}` : null
    ].filter(Boolean).join(' · ') || 'no P2P edges';
    const rttText = Number.isFinite(diagnostics.medianRttMs)
      ? `med ${diagnostics.medianRttMs}ms / p95 ${diagnostics.p95RttMs ?? '--'}ms`
      : '--';
    const lanReadinessLine = diagnostics.lanEdgeCount > 0 || diagnostics.turnEdgeCount > 0
      ? `LAN readiness: ${diagnostics.lanEdgeCount} LAN-host · ${diagnostics.directEdgeCount} direct · ${diagnostics.turnEdgeCount} TURN/circuit`
      : null;
    diagnosticsElement.textContent = [
      `Mesh: ${diagnostics.nodeCount} peers · ${diagnostics.p2pEdgeCount} P2P edges · avg deg ${diagnostics.avgDegree}`,
      `Relay-off check: ${resilience}`,
      `Bridges: ${diagnostics.bridgeEdgeKeys.length} · cuts: ${diagnostics.cutPeerIds.length} · isolated: ${diagnostics.isolatedPeers.length} · dupes: ${diagnostics.duplicateEdgeCount}`,
      `Paths (${diagnostics.directPct}% direct / ${diagnostics.lanPct}% LAN): ${pathLine}`,
      ...(lanReadinessLine ? [lanReadinessLine] : []),
      `RTT: ${rttText} · Flow: ${formatBps(diagnostics.totalRxBps + diagnostics.totalTxBps)}`,
      `WorkMesh: ${diagnostics.totalWorkRate} tasks/s (${diagnostics.workMeshEdgeCount} links) · resets ${diagnostics.totalStreamResets}`,
      `Churn: ${diagnostics.totalRewiresPerMin} rewires/min · ${diagnostics.totalDialFailures} dial fails${diagnostics.avgGossipMeshDegree !== null ? ` · gossip deg ${diagnostics.avgGossipMeshDegree}` : ''}`
    ].join('\n');
    diagnosticsElement.classList.toggle('diag-warn', Boolean(diagnostics.isPartitioned || diagnostics.wouldPartitionWithoutRelay));
  }

  if (subgroupsElement) {
    const groups = Array.isArray(view.subgroups) ? view.subgroups : [];
    subgroupsElement.textContent = groups.length
      ? groups.map((sg) => {
          const partFlag = sg.isPartitioned ? ` [SPLIT:${sg.componentCount}]` : '';
          const rtt = Number.isFinite(sg.medianRttMs) ? `${sg.medianRttMs}ms` : '--';
          const lanPart = sg.lanEdgeCount > 0 ? ` · ${sg.lanPct ?? 0}% LAN` : '';
          const churnPart = sg.totalRewiresPerMin > 0 ? ` · ${sg.totalRewiresPerMin} rw/m` : '';
          const appEntries = Object.entries(sg.appCounts || {}).sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0]));
          const appsPart = appEntries.length > 1
            ? ` · apps: ${appEntries.map(([name, count]) => `${name}×${count}`).join(', ')}`
            : '';
          return `${sg.label}${partFlag}\n  ${sg.peerCount} peers · ${sg.internalEdges} int / ${sg.crossEdges} x-edges · ${sg.directPct}% direct${lanPart} · ${sg.relayConnectedCount} on-relay · RTT ${rtt}${sg.totalWorkRate > 0 ? ` · ${sg.totalWorkRate} t/s` : ''}${churnPart}${appsPart}`;
        }).join('\n')
      : 'No subgroups detected yet.';
  }

  if (relayAuditElement) {
    const audit = diagnostics?.relayAudit;
    const lines = [];
    if (audit) {
      const reasonSummary = Object.entries(audit.keepReasonCounts || {})
        .sort((a, b) => b[1] - a[1])
        .map(([reason, count]) => `${reason}=${count}`)
        .join(', ');
      lines.push(`On-relay: ${audit.connectedPeers} · keepers: ${audit.keeperCount} · off-relay: ${audit.offRelayPeers}`);
      if (reasonSummary) lines.push(`Reasons: ${reasonSummary}`);
      for (const relay of audit.relays || []) {
        lines.push(
          `${shortId(relay.relayPeerId)}: ${relay.connectedPeers} peers (keep=${relay.keepers + relay.electedKeepers + relay.permanent}, hold=${relay.holding})`
        );
      }
    }
    if (Array.isArray(relayHealth) && relayHealth.length > 0) {
      lines.push(`Configured relays (${relayHealth.length}):`);
      for (const entry of relayHealth) {
        const tag = entry.isLan ? 'LAN' : 'WAN';
        const state = entry.ok === true ? 'ok' : (entry.ok === false ? `fail(${entry.failures || 1})` : 'pending');
        const rtt = Number.isFinite(entry.rttMs) ? ` ${Math.round(entry.rttMs)}ms` : '';
        lines.push(`  [${tag}] ${shortId(entry.peerId || entry.addr)} ${state}${rtt}`);
      }
    }
    if (directUnicastCount > 0) {
      lines.push(`Direct unicast streams: ${directUnicastCount}`);
    }
    relayAuditElement.textContent = lines.length ? lines.join('\n') : 'No relay telemetry yet.';
  }

  if (sparklinesElement && typeof document !== 'undefined') {
    const samples = Array.isArray(historySamples) ? historySamples : [];
    const last = samples[samples.length - 1] || null;
    if (!last) {
      sparklinesElement.textContent = 'Collecting rolling history...';
    } else {
      sparklinesElement.replaceChildren(
        renderSparklineRow('Peers', String(last.nodeCount), samples.map((s) => s.nodeCount), '#00ff6a'),
        renderSparklineRow('Direct %', `${last.directPct}%`, samples.map((s) => s.directPct), '#ffb13b'),
        renderSparklineRow('LAN %', `${last.lanPct}%`, samples.map((s) => s.lanPct), '#00ffd4'),
        renderSparklineRow('On-relay', String(last.relayConnected), samples.map((s) => s.relayConnected), '#caf6ff'),
        renderSparklineRow('Med RTT', Number.isFinite(last.medianRttMs) ? `${last.medianRttMs}ms` : '--', samples.map((s) => s.medianRttMs), '#ff4fb3'),
        renderSparklineRow('Work/s', String(last.workRate), samples.map((s) => s.workRate), '#facc15')
      );
    }
  }

  if (modelsElement) {
    const models = Array.isArray(view?.models) ? view.models : [];
    const modelText = models.length
      ? models.map((model) => `${model.name || model.manifestCid}\n${model.task || 'unknown'} · ${model.hostCount} hosting peer${model.hostCount === 1 ? '' : 's'} · ${model.busyCount} busy${model.busy ? ' (all busy)' : ''}`).join('\n\n')
      : 'No fresh reports advertise hosted models.';
    modelsElement.textContent = modelText + (summary?.modelsUnavailable
      ? `\n\nHosting status unavailable from ${summary.modelsUnavailable} reporting peer${summary.modelsUnavailable === 1 ? '' : 's'}; counts are partial.`
      : '');
  }
}
