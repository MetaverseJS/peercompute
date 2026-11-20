/**
 * Throughput-driven neighbour selection: one node's local rule.
 *
 * The rule sees only what a node can measure itself: the work that actually
 * moved over each of its links, and the peers it has heard of. It never reads
 * another peer's bandwidth or compute capacity.
 *
 *   1. Below `targetConnections`, connect to a candidate (repair).
 *   2. Otherwise keep one spare slot (up to `maxConnections`) for a trial link
 *      to a candidate, started at most every `exploreIntervalMs`.
 *   3. When every link is at least `trialMs` old, keep the `targetConnections`
 *      links that carried the most work and drop the rest. A newcomer must beat
 *      an established link by `replaceMargin` to displace it.
 *   4. Each trial that fails doubles the wait before the next one, up to
 *      `maxExploreIntervalMs`; a trial that earns its place resets the wait.
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
  maxExploreIntervalMs: 48000,
  retryCooldownMs: 20000,
  referralShare: 0.5,
  replaceMargin: 0.1
});

/** Per-node memory carried between decisions. */
export function createThroughputTopologyState() {
  return { lastExploreAt: Number.NEGATIVE_INFINITY, exploreDelayMs: null, established: new Set(), cooldown: new Map() };
}

function pick(list, random) {
  return list.length ? list[Math.min(list.length - 1, Math.floor(random() * list.length))] : null;
}

/**
 * @param {object} input
 * @param {number} input.now milliseconds on the caller's clock
 * @param {{peerId: string, flow: number, since: number}[]} input.links current
 *   links with the measured work rate over each and the time it was opened
 * @param {string[]} input.candidates known peers this node could connect to
 * @param {string[]} [input.referrals] candidates suggested by a neighbour
 * @param {object} input.state from createThroughputTopologyState()
 * @param {() => number} [input.random] uniform [0, 1)
 * @param {object} [input.config] overrides for THROUGHPUT_TOPOLOGY_DEFAULTS
 * @returns {{connect: string|null, drop: string[]}}
 */
export function decideThroughputTopology({ now, links = [], candidates = [], referrals = [], state,
  random = Math.random, config = {} } = {}) {
  if (!state) throw new TypeError('decideThroughputTopology requires a state object');
  const options = { ...THROUGHPUT_TOPOLOGY_DEFAULTS, ...config };
  const target = Math.max(1, options.targetConnections);
  const max = Math.max(target, options.maxConnections);
  const linked = new Set(links.map((link) => link.peerId));
  for (const peerId of state.established) if (!linked.has(peerId)) state.established.delete(peerId);
  for (const [peerId, until] of state.cooldown) if (until <= now) state.cooldown.delete(peerId);

  const drop = [];
  const trialing = links.some((link) => now - link.since < options.trialMs);
  if (!trialing) {
    if (links.length > target) {
      // A newcomer's flow is discounted so that noise alone cannot displace a
      // link that is already carrying work.
      const ranked = links.map((link) => ({ ...link,
        score: state.established.has(link.peerId) ? link.flow : link.flow / (1 + options.replaceMargin) }))
        .sort((a, b) => (b.score - a.score) || (a.since - b.since) || String(a.peerId).localeCompare(String(b.peerId)));
      for (const loser of ranked.slice(target)) {
        drop.push(loser.peerId);
        state.cooldown.set(loser.peerId, now + options.retryCooldownMs);
      }
      const newcomers = ranked.filter((link) => !state.established.has(link.peerId));
      if (newcomers.length) {
        const kept = newcomers.some((link) => !drop.includes(link.peerId));
        state.exploreDelayMs = kept ? options.exploreIntervalMs
          : Math.min(options.maxExploreIntervalMs, 2 * (state.exploreDelayMs ?? options.exploreIntervalMs));
      }
    }
    const dropped = new Set(drop);
    for (const link of links) if (!dropped.has(link.peerId)) state.established.add(link.peerId);
  }

  const remaining = links.length - drop.length;
  const repairing = remaining < target;
  const exploring = !repairing && !trialing && remaining < max
    && now - state.lastExploreAt >= (state.exploreDelayMs ?? options.exploreIntervalMs);
  let connect = null;
  if (repairing || exploring) {
    const open = (peerId) => !linked.has(peerId) && (repairing || !state.cooldown.has(peerId));
    const referred = referrals.filter(open);
    const known = candidates.filter(open);
    connect = (referred.length && random() < options.referralShare ? pick(referred, random) : null)
      ?? pick(known, random) ?? pick(referred, random);
    if (connect && exploring) state.lastExploreAt = now;
  }
  return { connect, drop };
}
