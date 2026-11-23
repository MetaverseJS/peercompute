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

export const THROUGHPUT_TOPOLOGY_DEFAULTS = Object.freeze({
  targetConnections: 4,
  maxConnections: 5,
  trialMs: 6000,
  exploreIntervalMs: 3000,
  maxExploreIntervalMs: 300000,
  maxRepairIntervalMs: 15000, // a node short of links must keep trying: real connection attempts often fail
  retryCooldownMs: 20000,
  referralShare: 0.5,
  replaceMargin: 0.1,
  minGainShare: 0.05,
  // Multipliers applied to the wait between trials.
  failFactor: 2,
  successFactor: 0.5
});

/** Per-node memory carried between decisions. */
export function createThroughputTopologyState() {
  return { lastExploreAt: Number.NEGATIVE_INFINITY, exploreDelayMs: null, trialPeerId: null,
    lastRepairAt: Number.NEGATIVE_INFINITY, repairDelayMs: 0, established: new Set(), cooldown: new Map(),
    baselines: new Map(), wasIdle: false };
}

function pick(list, random) {
  return list.length ? list[Math.min(list.length - 1, Math.floor(random() * list.length))] : null;
}

function pickCandidate(list, random, scoreCandidate) {
  if (!list.length) return null;
  if (typeof scoreCandidate !== 'function') return pick(list, random);
  let bestScore = Number.NEGATIVE_INFINITY;
  let tied = [];
  for (const peerId of list) {
    const raw = Number(scoreCandidate(peerId));
    const score = Number.isFinite(raw) ? raw : 0;
    if (score > bestScore + 1e-9) {
      bestScore = score;
      tied = [peerId];
    } else if (Math.abs(score - bestScore) <= 1e-9) {
      tied.push(peerId);
    }
  }
  return pick(tied.length ? tied : list, random);
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
  const metricFor = (link) => {
    if (!scoreLink) return Number.isFinite(link.flow) ? link.flow : 0;
    const scored = Number(scoreLink(link));
    return Number.isFinite(scored) ? scored : (Number.isFinite(link.flow) ? link.flow : 0);
  };
  const linked = new Set(links.map((link) => link.peerId));
  for (const peerId of state.established) if (!linked.has(peerId)) state.established.delete(peerId);
  for (const [peerId, until] of state.cooldown) if (until <= now) state.cooldown.delete(peerId);

  // Remember what this node moved just before each new link appeared.
  const scoredLinks = links.map((link) => ({ ...link, effectiveFlow: metricFor(link) }));
  const total = scoredLinks.reduce((sum, link) => sum + link.effectiveFlow, 0);
  const rawTotal = links.reduce((sum, link) => sum + (Number.isFinite(link.flow) ? link.flow : 0), 0);
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
      state.baselines.set(link.peerId, total - link.effectiveFlow);
    }
  }

  const drop = [];
  const trialing = scoredLinks.some((link) => now - link.since < options.trialMs);
  if (!trialing) {
    if (scoredLinks.length > target) {
      const before = Math.min(total, ...scoredLinks.filter((link) => !state.established.has(link.peerId))
        .map((link) => state.baselines.get(link.peerId)));
      const improved = total - before > Math.max(options.minGainShare * before, 1e-9);
      // Without a gain every established link outranks every newcomer. With
      // one, a newcomer still has to beat an established link by the margin.
      const ranked = scoredLinks.map((link) => ({ ...link,
        score: state.established.has(link.peerId) ? link.effectiveFlow
          : improved ? link.effectiveFlow / (1 + options.replaceMargin) : Number.NEGATIVE_INFINITY }))
        .sort((a, b) => (b.score - a.score) || (a.since - b.since) || String(a.peerId).localeCompare(String(b.peerId)));
      for (const loser of ranked.slice(target)) {
        drop.push(loser.peerId);
        state.cooldown.set(loser.peerId, now + options.retryCooldownMs);
      }
    }
    if (state.trialPeerId !== null) {
      // The trial failed if its link was refused, closed by the peer or dropped here.
      const kept = linked.has(state.trialPeerId) && !drop.includes(state.trialPeerId);
      state.exploreDelayMs = scaled(kept ? options.successFactor : options.failFactor);
      if (!kept) state.cooldown.set(state.trialPeerId, now + options.retryCooldownMs);
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
    connect = (repairing ? pickCandidate(available.filter(open), random, scoreCandidate) : null)
      ?? (referred.length && random() < options.referralShare ? pickCandidate(referred, random, scoreCandidate) : null)
      ?? pickCandidate(known, random, scoreCandidate) ?? pickCandidate(referred, random, scoreCandidate);
    if (connect && exploring) { state.lastExploreAt = now; state.trialPeerId = connect; }
    if (connect && repairing) {
      state.lastRepairAt = now;
      state.repairDelayMs = Math.min(options.maxRepairIntervalMs, Math.max(base, 2 * state.repairDelayMs));
    }
  }
  return { connect, drop };
}
