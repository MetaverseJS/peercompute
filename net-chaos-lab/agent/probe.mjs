#!/usr/bin/env node
import { loadPlaywright } from './playwright-loader.mjs';
import { resolveSimulationProfile, runSimulationProfile } from './player-behavior-harness.mjs';

const parseArgs = (argv) => {
  const out = new Map();
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      out.set(key, true);
      continue;
    }
    out.set(key, next);
    i += 1;
  }
  return out;
};

const waitFor = async (fn, timeoutMs, intervalMs = 200) => {
  const start = Date.now();
  let lastError = null;
  while (Date.now() - start <= timeoutMs) {
    try {
      const result = await fn();
      if (result) return result;
    } catch (err) {
      lastError = err;
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  if (lastError) throw lastError;
  return null;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const incrementCount = (target, key) => {
  if (!key) return;
  target[key] = Number(target[key] || 0) + 1;
};

const DIRECT_CANDIDATE_TYPES = new Set(['host', 'srflx', 'prflx']);
const ACTIVE_RTC_PAIR_STATES = new Set(['succeeded', 'in-progress']);

const normalizeCandidateType = (value) => {
  if (!value || typeof value !== 'string') return '';
  return value.trim().toLowerCase();
};

const hasDirectRtcPair = (rtcDiagnostics) => {
  if (!rtcDiagnostics || !Array.isArray(rtcDiagnostics.pairs)) return false;
  for (const pair of rtcDiagnostics.pairs) {
    if (!pair || typeof pair !== 'object') continue;
    const state = normalizeCandidateType(pair.selectedPairState || '');
    if (state && !ACTIVE_RTC_PAIR_STATES.has(state)) continue;

    const localType = normalizeCandidateType(pair?.localCandidate?.type);
    const remoteType = normalizeCandidateType(pair?.remoteCandidate?.type);
    if (!DIRECT_CANDIDATE_TYPES.has(localType)) continue;
    if (!DIRECT_CANDIDATE_TYPES.has(remoteType)) continue;
    if (localType === 'relay' || remoteType === 'relay') continue;

    const bytesSent = Number(pair.bytesSent || 0);
    const bytesReceived = Number(pair.bytesReceived || 0);
    if (state === 'succeeded' || bytesSent > 0 || bytesReceived > 0) {
      return true;
    }
  }
  return false;
};

const installRtcDiagnostics = async (context) => {
  await context.addInitScript(() => {
    const NativePc = window.RTCPeerConnection;
    if (!NativePc || window.__CHAOSLAB_RTC__) return;

    const peers = [];
    const toPlain = (candidate) => {
      if (!candidate) return null;
      return {
        id: candidate.id || null,
        type: candidate.candidateType || null,
        protocol: candidate.protocol || null,
        address: candidate.address || null,
        port: candidate.port || null
      };
    };

    class TrackedPc extends NativePc {
      constructor(...args) {
        super(...args);
        this.__pcDiagId = peers.length + 1;
        peers.push(this);
      }
    }

    window.RTCPeerConnection = TrackedPc;
    window.__CHAOSLAB_RTC__ = {
      async collect() {
        const summaries = [];
        for (const pc of peers) {
          let selectedPair = null;
          let local = null;
          let remote = null;
          try {
            const stats = await pc.getStats();
            for (const report of stats.values()) {
              if (report.type === 'transport' && report.selectedCandidatePairId) {
                selectedPair = stats.get(report.selectedCandidatePairId) || null;
                break;
              }
            }
            if (!selectedPair) {
              for (const report of stats.values()) {
                if (report.type === 'candidate-pair' && report.nominated && report.state === 'succeeded') {
                  selectedPair = report;
                  break;
                }
              }
            }
            if (selectedPair) {
              local = stats.get(selectedPair.localCandidateId) || null;
              remote = stats.get(selectedPair.remoteCandidateId) || null;
            }
          } catch (_) {
            // Ignore stats errors for closed/transient peer connections.
          }
          summaries.push({
            id: pc.__pcDiagId || null,
            connectionState: pc.connectionState,
            iceConnectionState: pc.iceConnectionState,
            selectedPairState: selectedPair?.state || null,
            localCandidate: toPlain(local),
            remoteCandidate: toPlain(remote),
            bytesSent: Number.isFinite(selectedPair?.bytesSent) ? selectedPair.bytesSent : null,
            bytesReceived: Number.isFinite(selectedPair?.bytesReceived) ? selectedPair.bytesReceived : null
          });
        }
        return summaries;
      }
    };
  });
};

const collectRtcDiagnostics = async (page) => {
  const pairs = await page.evaluate(async () => {
    if (!window.__CHAOSLAB_RTC__?.collect) return [];
    return window.__CHAOSLAB_RTC__.collect();
  });

  const localCandidateTypes = {};
  const remoteCandidateTypes = {};
  const selectedPairStates = {};

  for (const pair of Array.isArray(pairs) ? pairs : []) {
    incrementCount(localCandidateTypes, pair?.localCandidate?.type || 'unknown');
    incrementCount(remoteCandidateTypes, pair?.remoteCandidate?.type || 'unknown');
    incrementCount(selectedPairStates, pair?.selectedPairState || 'none');
  }

  return {
    peerConnectionCount: Array.isArray(pairs) ? pairs.length : 0,
    localCandidateTypes,
    remoteCandidateTypes,
    selectedPairStates,
    pairs: Array.isArray(pairs) ? pairs : []
  };
};

const collectNetvizDiagnostics = async (page) => {
  return page.evaluate(() => {
    const status = window.__NETVIZ__?.getStatus?.() || null;
    if (!status) return null;

    const peers = Array.isArray(status.peers) ? status.peers : [];
    const addrs = Array.isArray(status.announceAddrs)
      ? status.announceAddrs
      : (Array.isArray(status.addrs) ? status.addrs : []);
    const connections = Array.isArray(status.connections) ? status.connections : [];

    const peerViaCounts = {};
    let directPeerCount = 0;
    let relayPeerCount = 0;
    let webrtcPeerCount = 0;

    for (const peer of peers) {
      const via = peer?.via || 'unknown';
      peerViaCounts[via] = Number(peerViaCounts[via] || 0) + 1;
      if (via === 'relay') relayPeerCount += 1;
      if (via === 'webrtc') webrtcPeerCount += 1;
      if (via && via !== 'relay' && via !== 'presence') directPeerCount += 1;
    }

    const announcedDirectWebrtcAddrs = addrs.filter((addr) => (
      typeof addr === 'string' && addr.includes('/webrtc')
    ));
    const announcedRelayWebrtcAddrs = addrs.filter((addr) => (
      typeof addr === 'string' && addr.includes('/p2p-circuit') && addr.includes('/webrtc')
    ));

    const connectionAddrCounts = {
      directWebrtc: 0,
      relayWebrtc: 0,
      relayAny: 0,
      directOther: 0,
      unknown: 0
    };

    for (const conn of connections) {
      const addr = conn?.remoteAddr || '';
      if (!addr) {
        connectionAddrCounts.unknown += 1;
        continue;
      }
      const isRelay = addr.includes('/p2p-circuit');
      const isWebrtc = addr.includes('/webrtc');
      if (isRelay) connectionAddrCounts.relayAny += 1;
      if (isWebrtc && isRelay) {
        connectionAddrCounts.relayWebrtc += 1;
      } else if (isWebrtc && !isRelay) {
        connectionAddrCounts.directWebrtc += 1;
      } else if (!isRelay) {
        connectionAddrCounts.directOther += 1;
      }
    }

    return {
      connectionState: status.connectionState || null,
      localPeerId: status.localPeerId || null,
      relayRetentionDebug: status.relayRetentionDebug || null,
      telemetry: status.telemetry || null,
      peerViaCounts,
      directPeerCount,
      relayPeerCount,
      webrtcPeerCount,
      announcedAddrs: addrs,
      announcedDirectWebrtcAddrs,
      announcedRelayWebrtcAddrs,
      connectionAddrCounts,
      hasDirectAnnounce: announcedDirectWebrtcAddrs.length > 0,
      hasDirectConnection: connectionAddrCounts.directWebrtc > 0,
      hasRelayWebrtcConnection: connectionAddrCounts.relayWebrtc > 0
    };
  });
};

const collectPeercomputeDiagnostics = async (page) => {
  return page.evaluate(() => {
    const registryKey = '__PEERCOMPUTE_KERNELS__';
    const lastKernelKey = '__PEERCOMPUTE_LAST_KERNEL__';
    const normalizeAddr = (value) => {
      if (!value) return '';
      if (typeof value === 'string') return value;
      if (typeof value?.toString === 'function') {
        try {
          return String(value.toString());
        } catch (_) {
          return '';
        }
      }
      return '';
    };

    const classifyAddr = (addr) => {
      if (!addr || typeof addr !== 'string') return 'unknown';
      const isRelay = addr.includes('/p2p-circuit');
      const isWebrtc = addr.includes('/webrtc');
      if (isRelay && isWebrtc) return 'relay-webrtc';
      if (isRelay) return 'relay';
      if (isWebrtc) return 'direct-webrtc';
      return 'direct';
    };

    const readConnectionAddrCounts = (networkManager) => {
      const counts = {
        directWebrtc: 0,
        relayWebrtc: 0,
        relayAny: 0,
        directOther: 0,
        unknown: 0
      };
      if (!networkManager?.libp2p?.getConnections) {
        return counts;
      }

      let list = [];
      try {
        const raw = networkManager.libp2p.getConnections();
        if (Array.isArray(raw)) {
          list = raw;
        } else if (raw && typeof raw.values === 'function') {
          const merged = [];
          for (const value of raw.values()) {
            if (Array.isArray(value)) {
              merged.push(...value);
            } else if (value) {
              merged.push(value);
            }
          }
          list = merged;
        }
      } catch (_) {
        return counts;
      }

      for (const conn of list) {
        const addr = normalizeAddr(conn?.remoteAddr || conn?.remoteMultiaddr || '');
        if (!addr) {
          counts.unknown += 1;
          continue;
        }
        const kind = classifyAddr(addr);
        if (kind === 'relay-webrtc') {
          counts.relayAny += 1;
          counts.relayWebrtc += 1;
        } else if (kind === 'relay') {
          counts.relayAny += 1;
        } else if (kind === 'direct-webrtc') {
          counts.directWebrtc += 1;
        } else if (kind === 'direct') {
          counts.directOther += 1;
        } else {
          counts.unknown += 1;
        }
      }

      return counts;
    };

    const readAnnounceAddrs = (networkManager) => {
      let values = [];
      try {
        if (typeof networkManager?._getAnnounceAddrs === 'function') {
          values = networkManager._getAnnounceAddrs() || [];
        } else if (typeof networkManager?.libp2p?.getMultiaddrs === 'function') {
          values = networkManager.libp2p.getMultiaddrs() || [];
        }
      } catch (_) {
        values = [];
      }
      if (!Array.isArray(values)) return [];
      return values
        .map((value) => normalizeAddr(value))
        .filter((value) => typeof value === 'string' && value.length > 0);
    };

    const readPeercomputeSnapshot = (kernel, sourceLabel) => {
      if (!kernel || typeof kernel.getStatus !== 'function') return null;
      let status = null;
      try {
        status = kernel.getStatus() || null;
      } catch (_) {
        status = null;
      }
      if (!status || typeof status !== 'object') return null;

      const network = status.network && typeof status.network === 'object'
        ? status.network
        : {};
      const localPeerId = String(network.peerId || '').trim();

      let networkManager = null;
      try {
        if (typeof kernel.getNetworkManager === 'function') {
          networkManager = kernel.getNetworkManager() || null;
        }
      } catch (_) {
        networkManager = null;
      }

      let telemetry = null;
      try {
        telemetry = networkManager?.getTelemetrySnapshot?.() || null;
      } catch (_) {
        telemetry = null;
      }

      const peers = Array.isArray(telemetry?.peers) ? telemetry.peers : [];
      const peerIds = [];
      let directPeerCount = 0;
      let relayPeerCount = 0;
      let webrtcPeerCount = 0;
      for (const peer of peers) {
        const peerId = String(peer?.peerId || '').trim();
        if (peerId) peerIds.push(peerId);
        const via = String(peer?.via || '').trim().toLowerCase();
        if (!via) continue;
        if (via === 'relay') relayPeerCount += 1;
        if (via.includes('webrtc')) webrtcPeerCount += 1;
        if (via !== 'relay' && via !== 'presence') directPeerCount += 1;
      }

      const connectionAddrCounts = readConnectionAddrCounts(networkManager);
      const announceAddrs = readAnnounceAddrs(networkManager);
      const announcedDirectWebrtcAddrs = announceAddrs.filter((addr) => (
        typeof addr === 'string' && addr.includes('/webrtc') && !addr.includes('/p2p-circuit')
      ));
      const announcedRelayWebrtcAddrs = announceAddrs.filter((addr) => (
        typeof addr === 'string' && addr.includes('/webrtc') && addr.includes('/p2p-circuit')
      ));

      const peerCount = Number(
        network.peerCount
        ?? telemetry?.peerCount
        ?? peers.length
        ?? 0
      ) || 0;
      const isConnected = Boolean(network.isConnected ?? telemetry?.isConnected ?? (peerCount > 0));
      const connectionState = isConnected ? 'connected' : 'disconnected';
      const connections = Number(network.connections ?? telemetry?.connections ?? 0) || 0;

      return {
        source: sourceLabel,
        localPeerId,
        peerCount,
        isConnected,
        connectionState,
        connections,
        directPeerCount,
        relayPeerCount,
        webrtcPeerCount,
        peerIds: Array.from(new Set(peerIds)).sort(),
        announceAddrs,
        announcedDirectWebrtcAddrs,
        announcedRelayWebrtcAddrs,
        connectionAddrCounts,
        hasDirectAnnounce: announcedDirectWebrtcAddrs.length > 0,
        hasDirectConnection: (
          connectionAddrCounts.directWebrtc > 0
          || connectionAddrCounts.directOther > 0
          || directPeerCount > 0
        ),
        hasRelayWebrtcConnection: connectionAddrCounts.relayWebrtc > 0
      };
    };

    const seen = new Set();
    const kernels = [];
    const addKernel = (value, label) => {
      if (!value || typeof value !== 'object') return;
      if (typeof value.getStatus !== 'function') return;
      if (seen.has(value)) return;
      seen.add(value);
      kernels.push({ kernel: value, label });
    };

    const globalAny = window;
    const registry = globalAny[registryKey];
    if (Array.isArray(registry)) {
      registry.forEach((entry, idx) => addKernel(entry, `registry:${idx}`));
    }
    addKernel(globalAny[lastKernelKey], 'last');
    addKernel(globalAny.node, 'window.node');
    addKernel(globalAny.roomDirectoryNode, 'window.roomDirectoryNode');
    addKernel(globalAny.__cubechat?.network?.node, 'cubechat.network.node');
    addKernel(globalAny.__cubechat?.roomDirectory?.node, 'cubechat.roomDirectory.node');
    addKernel(globalAny.game?.node, 'window.game.node');
    addKernel(globalAny.app?.node, 'window.app.node');

    if (kernels.length === 0) {
      const keys = Object.keys(globalAny).slice(0, 320);
      for (const key of keys) {
        let value = null;
        try {
          value = globalAny[key];
        } catch (_) {
          continue;
        }
        if (!value || typeof value !== 'object') continue;
        addKernel(value, `window.${key}`);
        if (value.node && typeof value.node === 'object') {
          addKernel(value.node, `window.${key}.node`);
        }
      }
    }

    const snapshots = kernels
      .map((entry) => readPeercomputeSnapshot(entry.kernel, entry.label))
      .filter(Boolean);
    if (!snapshots.length) return null;

    snapshots.sort((left, right) => {
      if (Boolean(left.isConnected) !== Boolean(right.isConnected)) {
        return Number(right.isConnected) - Number(left.isConnected);
      }
      if ((right.peerCount || 0) !== (left.peerCount || 0)) {
        return (right.peerCount || 0) - (left.peerCount || 0);
      }
      return (right.connections || 0) - (left.connections || 0);
    });

    const best = snapshots[0];
    return {
      ...best,
      candidateCount: snapshots.length,
      candidates: snapshots.map((snapshot) => ({
        source: snapshot.source,
        localPeerId: snapshot.localPeerId,
        peerCount: snapshot.peerCount,
        connectionState: snapshot.connectionState
      }))
    };
  });
};

const collectPeercomputeSnapshot = async (page) => {
  const diagnostics = await collectPeercomputeDiagnostics(page);
  if (!diagnostics) return null;
  return {
    peerCount: Number(diagnostics.peerCount || 0),
    peerSetKey: Array.isArray(diagnostics.peerIds)
      ? diagnostics.peerIds.slice().sort().join('|')
      : '',
    hasDirectConnection: Boolean(diagnostics.hasDirectConnection),
    hasRelayWebrtcConnection: Boolean(diagnostics.hasRelayWebrtcConnection)
  };
};

const collectNetvizSnapshot = async (page) => {
  return page.evaluate(async () => {
    const status = window.__NETVIZ__?.getStatus?.() || null;
    if (!status) return null;

    const peers = Array.isArray(status.peers) ? status.peers : [];
    const connections = Array.isArray(status.connections) ? status.connections : [];
    const peerSet = peers
      .map((peer) => `${peer?.id || peer?.peerId || 'unknown'}:${peer?.via || 'unknown'}`)
      .sort();

    let hasDirectConnection = false;
    let hasRelayWebrtcConnection = false;
    for (const conn of connections) {
      const addr = conn?.remoteAddr || '';
      if (!addr || typeof addr !== 'string') continue;
      const isRelay = addr.includes('/p2p-circuit');
      const isWebrtc = addr.includes('/webrtc');
      if (isWebrtc && !isRelay) hasDirectConnection = true;
      if (isWebrtc && isRelay) hasRelayWebrtcConnection = true;
    }

    // Fallback for cases where libp2p connection addrs stay relay-scoped even
    // when WebRTC candidate selection shows direct host/srflx/prflx paths.
    if (window.__CHAOSLAB_RTC__?.collect) {
      try {
        const pairs = await window.__CHAOSLAB_RTC__.collect();
        const activeStates = new Set(['succeeded', 'in-progress']);
        const directTypes = new Set(['host', 'srflx', 'prflx']);
        for (const pair of Array.isArray(pairs) ? pairs : []) {
          const state = String(pair?.selectedPairState || '').trim().toLowerCase();
          if (state && !activeStates.has(state)) continue;
          const localType = String(pair?.localCandidate?.type || '').trim().toLowerCase();
          const remoteType = String(pair?.remoteCandidate?.type || '').trim().toLowerCase();
          const bytesSent = Number(pair?.bytesSent || 0);
          const bytesReceived = Number(pair?.bytesReceived || 0);
          if (!(state === 'succeeded' || bytesSent > 0 || bytesReceived > 0)) continue;

          if (directTypes.has(localType) && directTypes.has(remoteType)) {
            hasDirectConnection = true;
          }
          if (localType === 'relay' || remoteType === 'relay') {
            hasRelayWebrtcConnection = true;
          }
        }
      } catch (_) {
        // Ignore transient RTC stats errors while sampling.
      }
    }

    return {
      peerCount: peers.length,
      peerSetKey: peerSet.join('|'),
      hasDirectConnection,
      hasRelayWebrtcConnection
    };
  });
};

const collectNetvizStability = async (page, durationMs, intervalMs = 500) => {
  const windowMs = Math.max(1000, Math.floor(durationMs));
  const interval = Math.max(200, Math.floor(intervalMs));
  const deadline = Date.now() + windowMs;
  const samples = [];

  while (Date.now() <= deadline) {
    try {
      const snapshot = await collectNetvizSnapshot(page);
      if (snapshot) samples.push(snapshot);
    } catch (_) {
      // Ignore transient read errors.
    }

    const now = Date.now();
    if (now + interval > deadline) break;
    await sleep(interval);
  }

  if (!samples.length) {
    return {
      sampleCount: 0,
      sampleWindowMs: windowMs,
      peerSetChangeCount: 0,
      directConnectionFlipCount: 0,
      relayConnectionFlipCount: 0,
      directConnectionSampleRate: 0,
      relayConnectionSampleRate: 0,
      avgPeerCount: 0,
      minPeerCount: 0,
      maxPeerCount: 0
    };
  }

  let peerSetChangeCount = 0;
  let directConnectionFlipCount = 0;
  let relayConnectionFlipCount = 0;
  let directConnectionSampleCount = 0;
  let relayConnectionSampleCount = 0;
  let peerCountTotal = 0;
  let minPeerCount = Number.POSITIVE_INFINITY;
  let maxPeerCount = 0;

  let prevPeerSet = null;
  let prevDirect = null;
  let prevRelay = null;
  for (const sample of samples) {
    const peerSetKey = sample.peerSetKey || '';
    const hasDirectConnection = Boolean(sample.hasDirectConnection);
    const hasRelayWebrtcConnection = Boolean(sample.hasRelayWebrtcConnection);
    const peerCount = Number(sample.peerCount || 0);

    if (prevPeerSet !== null && peerSetKey !== prevPeerSet) peerSetChangeCount += 1;
    if (prevDirect !== null && hasDirectConnection !== prevDirect) directConnectionFlipCount += 1;
    if (prevRelay !== null && hasRelayWebrtcConnection !== prevRelay) relayConnectionFlipCount += 1;

    prevPeerSet = peerSetKey;
    prevDirect = hasDirectConnection;
    prevRelay = hasRelayWebrtcConnection;

    if (hasDirectConnection) directConnectionSampleCount += 1;
    if (hasRelayWebrtcConnection) relayConnectionSampleCount += 1;
    peerCountTotal += peerCount;
    minPeerCount = Math.min(minPeerCount, peerCount);
    maxPeerCount = Math.max(maxPeerCount, peerCount);
  }

  return {
    sampleCount: samples.length,
    sampleWindowMs: windowMs,
    peerSetChangeCount,
    directConnectionFlipCount,
    relayConnectionFlipCount,
    directConnectionSampleRate: directConnectionSampleCount / samples.length,
    relayConnectionSampleRate: relayConnectionSampleCount / samples.length,
    avgPeerCount: peerCountTotal / samples.length,
    minPeerCount: Number.isFinite(minPeerCount) ? minPeerCount : 0,
    maxPeerCount
  };
};

const collectPeercomputeStability = async (page, durationMs, intervalMs = 500) => {
  const windowMs = Math.max(1000, Math.floor(durationMs));
  const interval = Math.max(200, Math.floor(intervalMs));
  const deadline = Date.now() + windowMs;
  const samples = [];

  while (Date.now() <= deadline) {
    try {
      const snapshot = await collectPeercomputeSnapshot(page);
      if (snapshot) samples.push(snapshot);
    } catch (_) {
      // Ignore transient read errors.
    }

    const now = Date.now();
    if (now + interval > deadline) break;
    await sleep(interval);
  }

  if (!samples.length) {
    return {
      sampleCount: 0,
      sampleWindowMs: windowMs,
      peerSetChangeCount: 0,
      directConnectionFlipCount: 0,
      relayConnectionFlipCount: 0,
      directConnectionSampleRate: 0,
      relayConnectionSampleRate: 0,
      avgPeerCount: 0,
      minPeerCount: 0,
      maxPeerCount: 0
    };
  }

  let peerSetChangeCount = 0;
  let directConnectionFlipCount = 0;
  let relayConnectionFlipCount = 0;
  let directConnectionSampleCount = 0;
  let relayConnectionSampleCount = 0;
  let peerCountTotal = 0;
  let minPeerCount = Number.POSITIVE_INFINITY;
  let maxPeerCount = 0;

  let prevPeerSet = null;
  let prevDirect = null;
  let prevRelay = null;
  for (const sample of samples) {
    const peerSetKey = sample.peerSetKey || '';
    const hasDirectConnection = Boolean(sample.hasDirectConnection);
    const hasRelayWebrtcConnection = Boolean(sample.hasRelayWebrtcConnection);
    const peerCount = Number(sample.peerCount || 0);

    if (prevPeerSet !== null && peerSetKey !== prevPeerSet) peerSetChangeCount += 1;
    if (prevDirect !== null && hasDirectConnection !== prevDirect) directConnectionFlipCount += 1;
    if (prevRelay !== null && hasRelayWebrtcConnection !== prevRelay) relayConnectionFlipCount += 1;

    prevPeerSet = peerSetKey;
    prevDirect = hasDirectConnection;
    prevRelay = hasRelayWebrtcConnection;

    if (hasDirectConnection) directConnectionSampleCount += 1;
    if (hasRelayWebrtcConnection) relayConnectionSampleCount += 1;
    peerCountTotal += peerCount;
    minPeerCount = Math.min(minPeerCount, peerCount);
    maxPeerCount = Math.max(maxPeerCount, peerCount);
  }

  return {
    sampleCount: samples.length,
    sampleWindowMs: windowMs,
    peerSetChangeCount,
    directConnectionFlipCount,
    relayConnectionFlipCount,
    directConnectionSampleRate: directConnectionSampleCount / samples.length,
    relayConnectionSampleRate: relayConnectionSampleCount / samples.length,
    avgPeerCount: peerCountTotal / samples.length,
    minPeerCount: Number.isFinite(minPeerCount) ? minPeerCount : 0,
    maxPeerCount
  };
};

const runMediaLoopback = async (page, timeoutMs) => {
  return page.evaluate(async ({ timeoutMs: localTimeout }) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    const pc1 = new RTCPeerConnection();
    const pc2 = new RTCPeerConnection();

    stream.getTracks().forEach((track) => pc1.addTrack(track, stream));

    const gotTrack = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('media track timeout')), localTimeout);
      pc2.ontrack = (event) => {
        clearTimeout(timer);
        resolve({ tracks: event.streams?.[0]?.getTracks?.().length || 0 });
      };
    });

    pc1.onicecandidate = (event) => {
      if (event.candidate) pc2.addIceCandidate(event.candidate).catch(() => {});
    };
    pc2.onicecandidate = (event) => {
      if (event.candidate) pc1.addIceCandidate(event.candidate).catch(() => {});
    };

    const offer = await pc1.createOffer();
    await pc1.setLocalDescription(offer);
    await pc2.setRemoteDescription(offer);
    const answer = await pc2.createAnswer();
    await pc2.setLocalDescription(answer);
    await pc1.setRemoteDescription(answer);

    const outcome = await gotTrack;

    stream.getTracks().forEach((track) => track.stop());
    pc1.close();
    pc2.close();

    return outcome;
  }, { timeoutMs });
};

const main = async () => {
  const args = parseArgs(process.argv.slice(2));
  const url = String(args.get('url') || 'https://demos.peercompute.test/netviz/');
  const waitMs = Number(args.get('waitMs') || args.get('wait') || 30000);
  const minPeers = Number(args.get('minPeers') || 1);
  const mode = String(args.get('mode') || 'netviz').trim().toLowerCase();
  const media = args.get('media') === 'true' || args.get('media') === true;
  const simulateProfileArg = String(args.get('simulateProfile') || '').trim();
  const simulateMs = Number(args.get('simulateMs') || 0);
  const simulateProfile = resolveSimulationProfile(simulateProfileArg, url);
  const stabilityMs = Number(
    args.get('stabilityMs') || Math.max(1500, Math.min(6000, Math.floor(waitMs * 0.25)))
  );

  const launchArgs = ['--ignore-certificate-errors'];
  launchArgs.push('--disable-features=WebRtcHideLocalIpsWithMdns');
  if (media) {
    launchArgs.push('--use-fake-device-for-media-stream');
    launchArgs.push('--use-fake-ui-for-media-stream');
  }

  const startedAt = Date.now();
  const result = {
    ok: false,
    mode,
    url,
    mediaRequested: media,
    connected: false,
    peerCount: 0,
    convergenceMs: null,
    mediaOk: false,
    error: null,
    startedAt,
    diagnostics: {
      netviz: null,
      rtc: null
    },
    directPeerCount: 0,
    relayPeerCount: 0,
    webrtcPeerCount: 0,
    announcedDirectWebrtcAddrsCount: 0,
    announcedRelayWebrtcAddrsCount: 0,
    hasDirectAnnounce: false,
    hasDirectConnection: false,
    hasRelayWebrtcConnection: false,
    stabilitySampleCount: 0,
    stabilitySampleWindowMs: 0,
    peerSetChangeCount: 0,
    directConnectionFlipCount: 0,
    relayConnectionFlipCount: 0,
    directConnectionSampleRate: 0,
    relayConnectionSampleRate: 0,
    stabilityAvgPeerCount: 0,
    stabilityMinPeerCount: 0,
    stabilityMaxPeerCount: 0
  };

  let browser;
  let chromium;
  let playwrightModule = null;
  try {
    const playwrightRuntime = await loadPlaywright();
    chromium = playwrightRuntime.module.chromium;
    playwrightModule = playwrightRuntime.resolvedSpecifier;
    browser = await chromium.launch({ headless: true, args: launchArgs });
    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    await installRtcDiagnostics(context);
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    if (simulateProfile && simulateProfile !== 'none') {
      try {
        result.diagnostics.simulation = await runSimulationProfile(
          page,
          simulateProfile,
          Number.isFinite(simulateMs) ? Math.max(0, Math.floor(simulateMs)) : 0
        );
      } catch (err) {
        result.diagnostics.simulation = {
          profile: simulateProfile,
          applied: false,
          error: err?.message || String(err)
        };
      }
    }

    const applyPeerMetrics = (diag) => {
      if (!diag || typeof diag !== 'object') return;
      result.directPeerCount = Number(diag.directPeerCount || 0);
      result.relayPeerCount = Number(diag.relayPeerCount || 0);
      result.webrtcPeerCount = Number(diag.webrtcPeerCount || 0);
      result.announcedDirectWebrtcAddrsCount = Number(
        (diag.announcedDirectWebrtcAddrs || []).length || 0
      );
      result.announcedRelayWebrtcAddrsCount = Number(
        (diag.announcedRelayWebrtcAddrs || []).length || 0
      );
      result.hasDirectAnnounce = Boolean(diag.hasDirectAnnounce);
      result.hasDirectConnection = Boolean(diag.hasDirectConnection);
      result.hasRelayWebrtcConnection = Boolean(diag.hasRelayWebrtcConnection);
    };

    if (mode === 'netviz') {
      const converged = await waitFor(async () => {
        return page.evaluate((expectedPeers) => {
          const status = window.__NETVIZ__?.getStatus?.() || null;
          if (!status?.telemetry) return null;
          const peerCount = Number(status.telemetry.peerCount || 0);
          const local = Boolean(status.localPeerId);
          if (!local) return null;
          if (peerCount < expectedPeers) return null;
          return {
            localPeerId: status.localPeerId,
            peerCount,
            connectionState: status.connectionState || null,
            relayDebug: status.relayRetentionDebug || null
          };
        }, minPeers);
      }, waitMs, 250);

      if (converged) {
        result.connected = true;
        result.peerCount = converged.peerCount;
        result.convergenceMs = Date.now() - startedAt;
      }
    } else if (mode === 'peercompute') {
      const converged = await waitFor(async () => {
        const diagnostics = await collectPeercomputeDiagnostics(page);
        if (!diagnostics) return null;
        if (!diagnostics.localPeerId) return null;
        if (!diagnostics.isConnected) return null;
        if (Number(diagnostics.peerCount || 0) < minPeers) return null;
        return diagnostics;
      }, waitMs, 250);

      if (converged) {
        result.connected = true;
        result.peerCount = Number(converged.peerCount || 0);
        result.convergenceMs = Date.now() - startedAt;
        result.diagnostics.peercompute = converged;
        applyPeerMetrics(converged);
      }
    } else {
      await page.waitForTimeout(waitMs);
      result.connected = true;
      result.convergenceMs = Date.now() - startedAt;
    }

    if (media) {
      try {
        const mediaResult = await runMediaLoopback(page, Math.max(5000, waitMs / 2));
        result.mediaOk = Boolean(mediaResult && mediaResult.tracks > 0);
      } catch (err) {
        result.mediaOk = false;
        result.error = result.error || `media: ${err?.message || err}`;
      }
    }

    if (mode === 'netviz') {
      try {
        const netvizDiagnostics = await collectNetvizDiagnostics(page);
        if (netvizDiagnostics) {
          result.diagnostics.netviz = netvizDiagnostics;
          applyPeerMetrics(netvizDiagnostics);
        }
      } catch (err) {
        result.error = result.error || `netviz-diagnostics: ${err?.message || err}`;
      }
    } else if (mode === 'peercompute') {
      try {
        const peercomputeDiagnostics = await collectPeercomputeDiagnostics(page);
        if (peercomputeDiagnostics) {
          result.diagnostics.peercompute = peercomputeDiagnostics;
          if (!result.connected && peercomputeDiagnostics.isConnected) {
            result.connected = Number(peercomputeDiagnostics.peerCount || 0) >= minPeers;
            if (result.connected && !Number.isFinite(result.convergenceMs)) {
              result.convergenceMs = Date.now() - startedAt;
            }
          }
          if (!result.peerCount) {
            result.peerCount = Number(peercomputeDiagnostics.peerCount || 0);
          }
          applyPeerMetrics(peercomputeDiagnostics);
        }
      } catch (err) {
        result.error = result.error || `peercompute-diagnostics: ${err?.message || err}`;
      }
    }

    if ((mode === 'netviz' || mode === 'peercompute') && result.connected) {
      try {
        const stability = mode === 'netviz'
          ? await collectNetvizStability(page, stabilityMs, 500)
          : await collectPeercomputeStability(page, stabilityMs, 500);
        result.diagnostics.stability = stability;
        result.stabilitySampleCount = Number(stability.sampleCount || 0);
        result.stabilitySampleWindowMs = Number(stability.sampleWindowMs || 0);
        result.peerSetChangeCount = Number(stability.peerSetChangeCount || 0);
        result.directConnectionFlipCount = Number(stability.directConnectionFlipCount || 0);
        result.relayConnectionFlipCount = Number(stability.relayConnectionFlipCount || 0);
        result.directConnectionSampleRate = Number(stability.directConnectionSampleRate || 0);
        result.relayConnectionSampleRate = Number(stability.relayConnectionSampleRate || 0);
        result.stabilityAvgPeerCount = Number(stability.avgPeerCount || 0);
        result.stabilityMinPeerCount = Number(stability.minPeerCount || 0);
        result.stabilityMaxPeerCount = Number(stability.maxPeerCount || 0);
      } catch (err) {
        result.error = result.error || `stability-diagnostics: ${err?.message || err}`;
      }
    }

    try {
      result.diagnostics.rtc = await collectRtcDiagnostics(page);
      if (hasDirectRtcPair(result.diagnostics.rtc)) {
        result.hasDirectConnection = true;
        if (result.diagnostics.netviz && typeof result.diagnostics.netviz === 'object') {
          result.diagnostics.netviz.hasDirectConnection = true;
          result.diagnostics.netviz.hasDirectConnectionInferredFromRtc = true;
        }
      }
    } catch (err) {
      result.error = result.error || `rtc-diagnostics: ${err?.message || err}`;
    }
    if (playwrightModule) {
      result.diagnostics.playwrightModule = playwrightModule;
    }

    result.ok = result.connected && (!media || result.mediaOk);
    await context.close();
  } catch (err) {
    result.error = err?.message || String(err);
    result.ok = false;
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }

  process.stdout.write(`${JSON.stringify(result)}\n`);
  process.exitCode = result.ok ? 0 : 1;
};

main().catch((err) => {
  process.stderr.write(`${err?.stack || err}\n`);
  process.exit(1);
});
