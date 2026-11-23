/**
 * Throughput-driven neighbour selection: one node's local rule.
 *
 * The rule sees only what a node can measure itself: the work that actually
 * moved over each of its links, and the peers it has heard of. It never reads
 * another peer's bandwidth or compute capacity.
 *
 *   1. Below `targetConnections`, connect to a candidate (repair), preferring
 *      peers that are themselves short of links. A peer that is already full
 *      tends to drop the newcomer again, so repeated repairs wait longer, up to
 *      `maxRepairIntervalMs`.
 *   2. Otherwise keep one spare slot (up to `maxConnections`) for a trial link
 *      to a candidate.
 *   3. When every link is at least `trialMs` old and there are more than
 *      `targetConnections`, compare the work this node moves now with what it
 *      moved before the new link appeared. If the total grew by at least
 *      `minGainShare`, keep the links that carried the most work (a newcomer
 *      must beat an established link by `replaceMargin`). Otherwise drop the
 *      newcomer: a link that only takes work from another link is not a gain.
 *   4. A trial this node started that does not earn its place doubles the wait
 *      before the next one, up to `maxExploreIntervalMs`; one that does halves
 *      it. Gains made by taking a neighbour's supply are soon taken back, so a
 *      full reset on every success would keep a supply-limited network
 *      rewiring for nothing.
 *
 * The module is pure: no timers, sockets or globals. A caller (the simulator in
 * peercompute/experiments/conjecture, or a network runtime) supplies
 * measurements and applies the returned actions.
 */

export const THROUGHPUT_TOPOLOGY_PROFILES = Object.freeze([
  'batch-throughput',
  'low-latency',
  'lan-first',
  'capability-weighted'
]);

const LAN_ICE_PATHS = new Set(['lan-host', 'direct-ws', 'direct-tcp']);
const RELAY_ICE_PATHS = new Set(['turn-relay', 'circuit-relay']);

function isLanAddressString(addr) {
  if (typeof addr !== 'string' || !addr) return false;
  if (addr.includes('/p2p-circuit')) return false;
  return (
    /\/ip4\/(?:10\.|127\.|169\.254\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.|100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.)/.test(addr)
    || /\/ip6\/(?:fe80:|fc|fd|::1\b)/i.test(addr)
    || /\/dns[46]?\/[^/]+(?:\.local|\.lan|\.ts\.net)\b/i.test(addr)
  );
}

function capabilityTierScore(capabilities) {
  if (!capabilities || typeof capabilities !== 'object') return 0;
  let score = 0;
  const gpuTier = String(capabilities.gpuTier || capabilities.gpu?.tier || '').toLowerCase();
  if (gpuTier === 'high' || gpuTier === 'discrete') score += 1.2;
  else if (gpuTier === 'mid' || gpuTier === 'medium' || gpuTier === 'integrated') score += 0.7;
  else if (gpuTier === 'low') score += 0.3;
  if (capabilities.webgpu === true || capabilities.gpu?.available === true) score += 0.35;
  const cores = Number(capabilities.cores ?? capabilities.cpu?.cores);
  if (Number.isFinite(cores) && cores > 0) {
    score += Math.min(0.6, Math.log2(cores + 1) * 0.15);
  }
  const gpuGflops = Number(capabilities.bench?.gpuGflops ?? capabilities.gpuGflops);
  if (Number.isFinite(gpuGflops) && gpuGflops > 0) {
    score += Math.min(1.0, Math.log10(gpuGflops + 1) * 0.25);
  }
  return Math.min(2.5, score);
}

/**
 * Build goal-conditioned link and candidate scorers for decideThroughputTopology.
 * Invariant: scoreLink(link) always returns 0 when link.flow <= 0 so idle
 * detection and minGainShare checks never mistake an idle link for progress.
 */
export function createThroughputProfileScorers(profile = 'batch-throughput', getPeerInfo = null, options = {}) {
  const normalized = String(profile || 'batch-throughput').trim().toLowerCase();
  if (normalized === 'batch-throughput' || !THROUGHPUT_TOPOLOGY_PROFILES.includes(normalized)) {
    return { profile: 'batch-throughput', scoreLink: null, scoreCandidate: null };
  }
  const infoOf = typeof getPeerInfo === 'function' ? getPeerInfo : () => null;
  const rttScaleMs = Number.isFinite(options.rttScaleMs) && options.rttScaleMs > 0 ? options.rttScaleMs : 50;
  const lanWeight = Number.isFinite(options.lanWeight) && options.lanWeight > 0 ? options.lanWeight : 1.6;
  const relayPenalty = Number.isFinite(options.relayPenalty) && options.relayPenalty > 0 ? options.relayPenalty : 0.55;
  const localHostGroupId = typeof options.localHostGroupId === 'string' && options.localHostGroupId
    ? options.localHostGroupId
    : null;

  const rttOf = (info) => {
    const raw = info?.candidatePairRttMs ?? info?.rttMs;
    return Number.isFinite(raw) && raw >= 0 ? raw : null;
  };
  const isLanPeer = (info) => {
    if (!info) return false;
    if (LAN_ICE_PATHS.has(info.icePath)) return true;
    if (localHostGroupId && info.hostGroupId && info.hostGroupId === localHostGroupId) return true;
    if (Array.isArray(info.multiaddrs) && info.multiaddrs.some(isLanAddressString)) return true;
    return false;
  };

  if (normalized === 'low-latency') {
    return {
      profile: normalized,
      scoreLink: (link) => {
        const flow = Number.isFinite(link?.flow) ? link.flow : 0;
        if (flow <= 0) return 0;
        const rtt = rttOf(infoOf(link.peerId));
        const factor = rtt !== null ? 1 / (1 + rtt / rttScaleMs) : 0.5;
        return flow * factor;
      },
      scoreCandidate: (peerId) => {
        const info = infoOf(peerId);
        const rtt = rttOf(info);
        const rttScore = rtt !== null ? 1 / (1 + rtt / rttScaleMs) : 0.25;
        return rttScore + (isLanPeer(info) ? 0.2 : 0);
      }
    };
  }

  if (normalized === 'lan-first') {
    return {
      profile: normalized,
      scoreLink: (link) => {
        const flow = Number.isFinite(link?.flow) ? link.flow : 0;
        if (flow <= 0) return 0;
        const info = infoOf(link.peerId);
        let multiplier = 1.0;
        if (isLanPeer(info)) multiplier = lanWeight;
        else if (RELAY_ICE_PATHS.has(info?.icePath)) multiplier = relayPenalty;
        const rtt = rttOf(info);
        const rttFactor = rtt !== null ? 1 / (1 + rtt / (rttScaleMs * 4)) : 0.9;
        return flow * multiplier * rttFactor;
      },
      scoreCandidate: (peerId) => {
        const info = infoOf(peerId);
        let score = 0;
        if (isLanPeer(info)) score += 2.0;
        else if (RELAY_ICE_PATHS.has(info?.icePath)) score -= 0.5;
        const rtt = rttOf(info);
        if (rtt !== null) score += 1 / (1 + rtt / rttScaleMs);
        return score;
      }
    };
  }

  // capability-weighted
  return {
    profile: 'capability-weighted',
    scoreLink: (link) => {
      const flow = Number.isFinite(link?.flow) ? link.flow : 0;
      if (flow <= 0) return 0;
      const info = infoOf(link.peerId);
      const cap = capabilityTierScore(info?.capabilities);
      return flow * (1 + 0.15 * cap);
    },
    scoreCandidate: (peerId) => {
      const info = infoOf(peerId);
      const cap = capabilityTierScore(info?.capabilities);
      const rtt = rttOf(info);
      const rttBonus = rtt !== null ? 0.2 / (1 + rtt / rttScaleMs) : 0;
      return cap + rttBonus;
    }
  };
}

export const THROUGHPUT_TOPOLOGY_DEFAULTS = Object.freeze({
  targetConnections: 4,
  maxConnections: 5,
  trialMs: 6000,
  exploreIntervalMs: 3000,
  maxExploreIntervalMs: 300000,
  maxRepairIntervalMs: 15000, // a node short of links must keep trying: real connection attempts often fail
  retryCooldownMs: 20000,
  maxCooldownMultiplier: 1,
  referralShare: 0.5,
  replaceMargin: 0.1,
  minGainShare: 0.05,
  flowTauMs: 4000,
  debiasNewcomerFlow: false,
  candidateScoreBandRatio: 0.15,
  candidateExploreShare: 0.15,
  // Multipliers applied to the wait between trials.
  failFactor: 2,
  successFactor: 0.5
});

/** Per-node memory carried between decisions. */
export function createThroughputTopologyState() {
  return { lastExploreAt: Number.NEGATIVE_INFINITY, exploreDelayMs: null, trialPeerId: null,
    lastRepairAt: Number.NEGATIVE_INFINITY, repairDelayMs: 0, established: new Set(), cooldown: new Map(),
    failCounts: new Map(), baselines: new Map(), wasIdle: false };
}

function pick(list, random) {
  return list.length ? list[Math.min(list.length - 1, Math.floor(random() * list.length))] : null;
}

function pickCandidate(list, random, scoreCandidate, { bandRatio = 0.15, exploreShare = 0.15 } = {}) {
  if (!list.length) return null;
  if (typeof scoreCandidate !== 'function') return pick(list, random);
  // In larger networks (>= 6 candidates), reserve a small exploratory share so
  // biased profiles (e.g. lan-first, capability-weighted) still discover bridges
  // and never get trapped in a single local cluster or stampede one peer.
  if (list.length >= 6 && exploreShare > 0 && random() < exploreShare) {
    return pick(list, random);
  }
  const scored = list.map((peerId) => {
    const raw = Number(scoreCandidate(peerId));
    return { peerId, score: Number.isFinite(raw) ? raw : 0 };
  });
  let bestScore = Number.NEGATIVE_INFINITY;
  for (const item of scored) {
    if (item.score > bestScore) bestScore = item.score;
  }
  const tolerance = Math.max(1e-9, Math.abs(bestScore) * Math.max(0, bandRatio));
  const topBand = scored
    .filter((item) => item.score >= bestScore - tolerance)
    .map((item) => item.peerId);
  return pick(topBand.length ? topBand : list, random);
}

/**
 * @param {object} input
 * @param {number} input.now milliseconds on the caller's clock
 * @param {{peerId: string, flow: number, since: number}[]} input.links current
 *   links with the measured work rate over each and the time it was opened
 * @param {string[]} input.candidates known peers this node could connect to
 * @param {string[]} [input.referrals] candidates suggested by a neighbour
 * @param {string[]} [input.available] candidates advertising fewer links than
 *   their own target
 * @param {object} input.state from createThroughputTopologyState()
 * @param {() => number} [input.random] uniform [0, 1)
 * @param {object} [input.config] overrides for THROUGHPUT_TOPOLOGY_DEFAULTS
 * @returns {{connect: string|null, drop: string[]}}
 */
export function decideThroughputTopology({ now, links = [], candidates = [], referrals = [], available = [], state,
  random = Math.random, config = {} } = {}) {
  if (!state) throw new TypeError('decideThroughputTopology requires a state object');
  const options = { ...THROUGHPUT_TOPOLOGY_DEFAULTS, ...config };
  const target = Math.max(1, options.targetConnections);
  const max = Math.max(target, options.maxConnections);
  const base = options.exploreIntervalMs;
  const scaled = (factor) => Math.min(options.maxExploreIntervalMs, Math.max(base, factor * (state.exploreDelayMs ?? base)));
  const scoreLink = typeof options.scoreLink === 'function' ? options.scoreLink : null;
  const scoreCandidate = typeof options.scoreCandidate === 'function' ? options.scoreCandidate : null;
  const flowTauMs = Number.isFinite(options.flowTauMs) && options.flowTauMs > 0 ? options.flowTauMs : 4000;
  const debiasNewcomer = options.debiasNewcomerFlow === true;
  if (!state.failCounts) state.failCounts = new Map();
  const metricFor = (link) => {
    let baseFlow = Number.isFinite(link.flow) ? link.flow : 0;
    // Correct zero-initialized EWMA cold-start bias for young trial links so a
    // fast newcomer is not unfairly rejected before its EWMA warms up.
    if (debiasNewcomer && baseFlow > 0 && !state.established.has(link.peerId) && Number.isFinite(link.since)) {
      const age = Math.max(500, now - link.since);
      if (age < 3 * flowTauMs) {
        const bias = Math.max(0.4, 1 - Math.exp(-age / flowTauMs));
        baseFlow = baseFlow / bias;
      }
    }
    if (!scoreLink) return baseFlow;
    const scored = Number(scoreLink({ ...link, flow: baseFlow }));
    return Number.isFinite(scored) ? scored : baseFlow;
  };
  const setCooldown = (peerId) => {
    const fails = (state.failCounts.get(peerId) || 0) + 1;
    state.failCounts.set(peerId, fails);
    const cap = Number.isFinite(options.maxCooldownMultiplier) ? Math.max(1, options.maxCooldownMultiplier) : 8;
    const mult = Math.min(cap, 2 ** Math.min(fails - 1, 4));
    state.cooldown.set(peerId, now + options.retryCooldownMs * mult);
  };
  const linked = new Set(links.map((link) => link.peerId));
  for (const peerId of state.established) if (!linked.has(peerId)) state.established.delete(peerId);
  for (const [peerId, until] of state.cooldown) if (until <= now) state.cooldown.delete(peerId);

  // Remember what this node moved just before each new link appeared.
  const scoredLinks = links.map((link) => ({ ...link, effectiveFlow: metricFor(link) }));
  const total = scoredLinks.reduce((sum, link) => sum + link.effectiveFlow, 0);
  const rawTotal = links.reduce((sum, link) => sum + (Number.isFinite(link.flow) ? link.flow : 0), 0);
  const baselineTotal = scoreLink ? total : rawTotal;
  // Wake out of idle exponential backoff immediately when a new workload begins
  // carrying non-zero flow, instead of sleeping up to maxExploreIntervalMs.
  if (rawTotal > 1e-9 && state.wasIdle) {
    state.wasIdle = false;
    if (state.exploreDelayMs !== null && state.exploreDelayMs > base) {
      state.exploreDelayMs = base;
      if (Number.isFinite(state.lastExploreAt) && now - state.lastExploreAt < base) {
        state.lastExploreAt = now - base;
      }
    }
  } else if (links.length > 0 && rawTotal <= 1e-9) {
    state.wasIdle = true;
  }

  for (const peerId of state.baselines.keys()) if (!linked.has(peerId)) state.baselines.delete(peerId);
  for (const link of scoredLinks) {
    if (!state.established.has(link.peerId) && !state.baselines.has(link.peerId)) {
      const linkBaseline = scoreLink ? link.effectiveFlow : (Number.isFinite(link.flow) ? link.flow : 0);
      state.baselines.set(link.peerId, baselineTotal - linkBaseline);
    }
  }

  const drop = [];
  const trialing = scoredLinks.some((link) => now - link.since < options.trialMs);
  if (!trialing) {
    if (scoredLinks.length > target) {
      const before = Math.min(baselineTotal, ...scoredLinks.filter((link) => !state.established.has(link.peerId))
        .map((link) => state.baselines.get(link.peerId)));
      const improved = baselineTotal - before > Math.max(options.minGainShare * before, 1e-9);
      // Without a gain every established link outranks every newcomer. With
      // one, a newcomer still has to beat an established link by the margin.
      const ranked = scoredLinks.map((link) => ({ ...link,
        score: state.established.has(link.peerId) ? link.effectiveFlow
          : improved ? link.effectiveFlow / (1 + options.replaceMargin) : Number.NEGATIVE_INFINITY }))
        .sort((a, b) => (b.score - a.score) || (a.since - b.since) || String(a.peerId).localeCompare(String(b.peerId)));
      for (const loser of ranked.slice(target)) {
        drop.push(loser.peerId);
        setCooldown(loser.peerId);
      }
    }
    if (state.trialPeerId !== null) {
      // The trial failed if its link was refused, closed by the peer or dropped here.
      const kept = linked.has(state.trialPeerId) && !drop.includes(state.trialPeerId);
      state.exploreDelayMs = scaled(kept ? options.successFactor : options.failFactor);
      if (kept) state.failCounts.delete(state.trialPeerId);
      else setCooldown(state.trialPeerId);
      state.trialPeerId = null;
    }
    const dropped = new Set(drop);
    for (const link of scoredLinks) if (!dropped.has(link.peerId)) state.established.add(link.peerId);
    state.baselines.clear();
  }

  const remaining = scoredLinks.length - drop.length;
  if (remaining >= target) state.repairDelayMs = 0;
  const short = remaining < target;
  const repairing = short && now - state.lastRepairAt >= state.repairDelayMs;
  const skipIdle = options.skipIdleExplore === true && rawTotal <= 1e-9;
  const exploring = !short && !trialing && !skipIdle && state.trialPeerId === null && remaining < max
    && now - state.lastExploreAt >= (state.exploreDelayMs ?? base);
  let connect = null;
  if (repairing || exploring) {
    const open = (peerId) => !linked.has(peerId) && (repairing || !state.cooldown.has(peerId));
    const referred = referrals.filter(open);
    const known = candidates.filter(open);
    const candOpts = { bandRatio: options.candidateScoreBandRatio, exploreShare: options.candidateExploreShare };
    connect = (repairing ? pickCandidate(available.filter(open), random, scoreCandidate, candOpts) : null)
      ?? (referred.length && random() < options.referralShare ? pickCandidate(referred, random, scoreCandidate, candOpts) : null)
      ?? pickCandidate(known, random, scoreCandidate, candOpts) ?? pickCandidate(referred, random, scoreCandidate, candOpts);
    if (connect && exploring) { state.lastExploreAt = now; state.trialPeerId = connect; }
    if (connect && repairing) {
      state.lastRepairAt = now;
      state.repairDelayMs = Math.min(options.maxRepairIntervalMs, Math.max(base, 2 * state.repairDelayMs));
    }
  }
  return { connect, drop };
}
