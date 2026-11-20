import { createRng, throughputCeiling } from './model.js';
import { spatialTopology, randomTopology, greedyTopology } from './topologies.js';
import { createThroughputTopologyState, decideThroughputTopology } from '../../src/peercompute/networkManager/ThroughputTopologyPolicy.js';

export const POLICIES = Object.freeze(['spatial', 'random', 'greedy', 'adaptive', 'adaptive-spatial']);
// Control: the same probing and dropping cadence as `adaptive`, but ranking
// links by a random number instead of measured work. It separates the effect
// of the measurement from the effect of rewiring alone.
export const CONTROL_POLICIES = Object.freeze(['blind-rewire']);

const SOURCE_HEAD = 64; // tasks the source keeps offered to its neighbours
const RESULT_BUFFER = 16; // results a node may hold before it stops computing
const FLOW_TAU_S = 2; // averaging time of the per-link work-rate measurement
const LINK_SETUP_S = 2; // a new link carries nothing while it is being established

const initialPairs = (policy, scenario, alive, random) => (
  policy === 'spatial' || policy === 'adaptive-spatial' ? spatialTopology(scenario, alive)
    : policy === 'greedy' ? greedyTopology(scenario, alive)
      : randomTopology(scenario, alive, random));

/**
 * Fluid simulation of one source handing divisible work to a peer network.
 *
 * Work moves down the gradient of queued work (the source holds a fixed head),
 * every node computes at its own rate, and results return along the cheapest
 * path to the source. Each transfer is limited by the link capacity and by both
 * endpoints' access capacity. Throughput is the source's own computing plus the
 * lower of the rate it issues work and the rate results return to it.
 *
 * @param {object} options
 * @param {object} options.scenario from makeScenario()
 * @param {string} options.policy one of POLICIES
 * @param {number} [options.durationS]
 * @param {number} [options.dt] seconds per step
 * @param {{atS: number, fraction: number}} [options.loss] nodes that fail at once
 */
export function simulate({ scenario, policy, durationS = 300, dt = 0.05, seed = 1, loss = null, policyConfig = {}, trace = false } = {}) {
  if (!POLICIES.includes(policy) && !CONTROL_POLICIES.includes(policy)) throw new RangeError(`Unknown policy ${policy}`);
  const { nodes, source, capacity, task } = scenario;
  const count = nodes.length;
  const random = createRng(seed * 2654435761 + POLICIES.indexOf(policy) * 97 + 5);
  const blind = policy === 'blind-rewire';
  const adaptive = policy.startsWith('adaptive') || blind;
  const config = { trialMs: 6000, targetConnections: scenario.targetConnections, maxConnections: scenario.maxConnections, ...policyConfig };

  const alive = nodes.map(() => true);
  const work = new Float64Array(count);
  const results = new Float64Array(count);
  const potential = new Float64Array(count);
  const egress = new Float64Array(count);
  const ingress = new Float64Array(count);
  const peers = Array.from({ length: count }, () => new Map()); // neighbour index -> link
  let links = [];
  let linkChanges = 0, repairs = 0, probes = 0;
  const tally = {};
  const state = nodes.map(() => createThroughputTopologyState());
  const nextDecision = nodes.map(() => random());

  const addLink = (i, j, now) => {
    if (i === j || peers[i].has(j) || !alive[i] || !alive[j]) return false;
    if (peers[i].size >= config.maxConnections || peers[j].size >= config.maxConnections) return false;
    const link = { a: i, b: j, capacity: capacity(i, j), flow: 0, moved: 0, since: now, readyAt: now + LINK_SETUP_S * 1000 };
    peers[i].set(j, link); peers[j].set(i, link); links.push(link);
    return true;
  };
  const removeLink = (i, j) => {
    const link = peers[i].get(j);
    if (!link) return;
    peers[i].delete(j); peers[j].delete(i);
    links = links.filter((entry) => entry !== link);
  };
  const rebuild = (now) => {
    for (const set of peers) set.clear();
    links = [];
    for (const [i, j] of initialPairs(policy, scenario, alive, random)) addLink(i, j, now);
  };
  rebuild(-1e9);

  const move = (link, from, to, amount, megabytes) => {
    if (!(amount > 0)) return 0;
    const sent = Math.min(amount, link.budget[from === link.a ? 0 : 1] / megabytes, egress[from] / megabytes, ingress[to] / megabytes);
    if (!(sent > 0)) return 0;
    const bytes = sent * megabytes;
    link.budget[from === link.a ? 0 : 1] -= bytes; egress[from] -= bytes; ingress[to] -= bytes;
    link.moved += sent;
    return sent;
  };

  const steps = Math.round(durationS / dt);
  const perSecond = [];
  let completed = 0, secondStart = 0, lost = false;
  let issued = 0, returned = 0, discarded = 0; // work leaving the source, results reaching it, work on failed peers
  let bound = throughputCeiling(scenario, alive);
  let boundAfterLoss = null;

  for (let step = 0; step < steps; step += 1) {
    const t = step * dt;
    if (loss && !lost && t >= loss.atS) {
      lost = true;
      // The same peers fail under every policy, so runs can be compared pairwise.
      const failure = createRng(seed * 131 + 7);
      const victims = nodes.map((node) => node.index).filter((i) => i !== source)
        .map((i) => [failure(), i]).sort((x, y) => x[0] - y[0]).map(([, i]) => i)
        .slice(0, Math.round(loss.fraction * (count - 1)));
      for (const i of victims) {
        alive[i] = false; discarded += work[i] + results[i]; work[i] = 0; results[i] = 0;
        for (const j of [...peers[i].keys()]) removeLink(i, j);
      }
      boundAfterLoss = throughputCeiling(scenario, alive);
      // The spatial controller and a central planner both re-plan on loss.
      if (policy === 'spatial' || policy === 'greedy') rebuild(t * 1000);
    }

    // One distance-vector relaxation per step: seconds per result to the source.
    for (let i = 0; i < count; i += 1) {
      if (i === source) { potential[i] = 0; continue; }
      let best = 1e9;
      for (const [j, link] of peers[i]) if (t * 1000 >= link.readyAt) best = Math.min(best, potential[j] + task.outMb / Math.max(link.capacity, 1e-9));
      potential[i] = best;
    }
    for (let i = 0; i < count; i += 1) { egress[i] = ingress[i] = nodes[i].access * dt; }
    work[source] = SOURCE_HEAD;

    const offset = links.length ? step % links.length : 0;
    for (let n = 0; n < links.length; n += 1) {
      const link = links[step % 2 ? (offset + n) % links.length : (offset + links.length - 1 - n) % links.length];
      if (t * 1000 < link.readyAt) continue;
      link.budget = [link.capacity * dt, link.capacity * dt];
      const { a, b } = link;
      // Results travel only toward the source.
      const [down, up] = potential[a] > potential[b] ? [a, b] : [b, a];
      if (potential[down] > potential[up] && results[down] > 0) {
        const room = up === source ? Number.POSITIVE_INFINITY : RESULT_BUFFER - results[up];
        const sent = move(link, down, up, Math.min(results[down], room), task.outMb);
        results[down] -= sent;
        if (up === source) { completed += sent; returned += sent; } else results[up] += sent;
      }
      // Work moves from the fuller queue to the emptier one, never into the source.
      const [from, to] = work[a] > work[b] ? [a, b] : [b, a];
      if (to !== source) {
        const sent = move(link, from, to, (work[from] - work[to]) / 2, task.inMb);
        if (from !== source) work[from] -= sent; else issued += sent;
        work[to] += sent;
      }
    }

    for (let i = 0; i < count; i += 1) {
      if (!alive[i]) continue;
      if (i === source) { completed += nodes[i].compute * dt; continue; }
      if (results[i] >= RESULT_BUFFER) continue;
      const done = Math.min(work[i], nodes[i].compute * dt);
      work[i] -= done; results[i] += done;
    }
    for (const link of links) {
      link.flow += (link.moved / dt - link.flow) * (dt / FLOW_TAU_S);
      link.moved = 0;
    }

    // Topology decisions use each node's own measurements only.
    const repairing = policy === 'random' && lost;
    if (adaptive || repairing) {
      for (let i = 0; i < count; i += 1) {
        if (!alive[i] || t < nextDecision[i]) continue;
        nextDecision[i] = t + 1;
        const mine = [...peers[i]].map(([j, link]) => ({ peerId: nodes[j].id, index: j, flow: blind ? random() : link.flow, since: link.since }));
        const candidates = nodes.filter((node) => alive[node.index] && node.index !== i && !peers[i].has(node.index)).map((node) => node.id);
        const strongest = mine.slice().sort((x, y) => y.flow - x.flow)[0];
        const referrals = strongest ? [...peers[strongest.index].keys()].filter((j) => j !== i && !peers[i].has(j)).map((j) => nodes[j].id) : [];
        // Without the rule a node only replaces links it has lost.
        const available = nodes.filter((node) => alive[node.index] && node.index !== i && !peers[i].has(node.index)
          && peers[node.index].size < config.targetConnections).map((node) => node.id);
        const decision = decideThroughputTopology({ now: t * 1000, links: mine, candidates, referrals, available, state: state[i], random,
          config: repairing ? { ...config, maxConnections: config.targetConnections } : config });
        if (trace && t >= durationS - 120) {
          for (const peerId of decision.drop) {
            const dropped = mine.find((entry) => entry.peerId === peerId);
            const kind = t * 1000 - dropped.since < 2 * config.trialMs ? 'dropNew' : 'dropOld';
            tally[kind] = (tally[kind] ?? 0) + 1;
            if (dropped.flow < 0.01 * mine.reduce((sum, entry) => sum + entry.flow, 0)) tally.dropIdle = (tally.dropIdle ?? 0) + 1;
          }
          if (decision.connect) {
            const kind = mine.length - decision.drop.length < config.targetConnections ? 'repair' : 'probe';
            tally[kind] = (tally[kind] ?? 0) + 1;
          }
        }
        for (const peerId of decision.drop) { removeLink(i, Number(peerId.slice(1))); linkChanges += 1; }
        if (decision.connect) {
          const repair = mine.length - decision.drop.length < config.targetConnections;
          if (addLink(i, Number(decision.connect.slice(1)), t * 1000)) { linkChanges += 1; if (repair) repairs += 1; else probes += 1; }
        }
      }
    }

    if (t + dt - secondStart >= 1 - 1e-9) {
      perSecond.push({ t: secondStart, completed, issued, returned, linkChanges });
      secondStart += 1;
    }
  }

  const rate = (fromS, toS) => {
    const window = perSecond.filter((sample) => sample.t >= fromS && sample.t < toS);
    if (window.length < 2) return { mean: 0, changes: 0 };
    const first = window[0], last = window[window.length - 1];
    const per = (key) => (last[key] - first[key]) / (last.t - first.t);
    // Peers hold queued work, so results can briefly return faster than the
    // source issues work (or the reverse while queues fill). Count only what
    // both rates sustain, plus the source's own computing.
    return { mean: per('completed') - per('returned') + Math.min(per('issued'), per('returned')),
      changes: last.linkChanges - first.linkChanges };
  };
  /** First second from which a 10 s average stays at or above 90% of the settled rate. */
  const settleTime = (fromS, toS, settled) => {
    for (let s = fromS; s + 10 <= toS; s += 1) if (rate(s, s + 10).mean >= 0.9 * settled) return s - fromS;
    return null;
  };

  const endA = loss ? loss.atS : durationS;
  const windowS = Math.min(120, Math.floor(endA / 3));
  const steady = rate(endA - windowS, endA);
  const out = {
    policy, scenario: scenario.name, regime: scenario.regime, seed,
    throughput: steady.mean, ceiling: bound, fraction: steady.mean / bound,
    settleS: settleTime(0, endA, steady.mean),
    linkChangesPerNodeMinute: steady.changes / count / (windowS / 60),
    links: links.length, repairs, probes,
    // Work issued by the source must equal results returned, work still held
    // by peers and work lost on failed peers.
    conservationError: issued - returned - discarded
      - nodes.reduce((sum, node) => sum + (node.index === source ? 0 : work[node.index] + results[node.index]), 0),
    wholeRun: completed / durationS,
    ...(trace ? { trace: { ...tally, meanExploreDelayS: state.reduce((sum, entry) => sum + (entry.exploreDelayMs ?? 3000), 0) / count / 1000 } } : {})
  };
  if (loss) {
    const afterWindowS = Math.min(120, Math.floor((durationS - loss.atS) / 3));
    const after = rate(durationS - afterWindowS, durationS);
    out.afterLoss = { throughput: after.mean, ceiling: boundAfterLoss, fraction: after.mean / boundAfterLoss,
      settleS: settleTime(loss.atS, durationS, after.mean) };
  }
  return out;
}
