import { createRng } from './model.js';
import { spatialTopology, randomTopology, greedyTopology } from './topologies.js';
import { WorkMesh } from '../../src/peercompute/workMesh/WorkMesh.js';
import { createThroughputTopologyState, decideThroughputTopology } from '../../src/peercompute/networkManager/ThroughputTopologyPolicy.js';

export const MESH_POLICIES = Object.freeze(['spatial', 'random', 'greedy', 'adaptive']);

const TICK_MS = 100; // how often each node's WorkMesh runs
const DECIDE_MS = 1000; // how often each node reconsiders its links
const CONTROL_MS = 10; // delivery time of a message that carries no payload
const LINK_SETUP_MS = 2000;
const FLOW_TAU_MS = 4000; // the smoothing NetworkManager applies to per-peer work

/** Min-heap of [time, order, fn]. */
class Agenda {
  constructor() { this.items = []; this.order = 0; }
  push(time, fn) {
    const items = this.items;
    let i = items.push([time, this.order++, fn]) - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (items[parent][0] < items[i][0] || (items[parent][0] === items[i][0] && items[parent][1] < items[i][1])) break;
      [items[parent], items[i]] = [items[i], items[parent]];
      i = parent;
    }
  }
  pop() {
    const items = this.items;
    const top = items[0];
    const last = items.pop();
    if (items.length) {
      items[0] = last;
      for (let i = 0; ;) {
        const left = 2 * i + 1, right = left + 1;
        let least = i;
        const before = (a, b) => items[a][0] < items[b][0] || (items[a][0] === items[b][0] && items[a][1] < items[b][1]);
        if (left < items.length && before(left, least)) least = left;
        if (right < items.length && before(right, least)) least = right;
        if (least === i) break;
        [items[least], items[i]] = [items[i], items[least]];
        i = least;
      }
    }
    return top;
  }
}

/**
 * The same scenarios as simulate.js, but run with the real WorkMesh scheduler
 * and the real topology rule exchanging discrete tasks and messages on a
 * virtual clock. A payload takes its size divided by the link capacity to
 * cross a link, and every node's access capacity is shared by its links.
 */
export function runMesh({ scenario, policy, durationS = 600, seed = 1, policyConfig = {}, realism = null } = {}) {
  // `realism` replaces the ideal link behaviour with what the browser runs
  // measured: { setupMs: [min, max], resetsPerNodeMinute, decideMs, windowS }.
  const setupRange = realism?.setupMs ?? [LINK_SETUP_MS, LINK_SETUP_MS];
  const decideMs = realism?.decideMs ?? DECIDE_MS;
  if (!MESH_POLICIES.includes(policy)) throw new RangeError(`Unknown policy ${policy}`);
  const { nodes, source, capacity, task } = scenario;
  const count = nodes.length;
  const random = createRng(seed * 2654435761 + MESH_POLICIES.indexOf(policy) * 97 + 11);
  const config = { targetConnections: scenario.targetConnections, maxConnections: scenario.maxConnections, ...policyConfig };
  const agenda = new Agenda();
  let now = 0;
  const index = new Map(nodes.map((node) => [node.id, node.index]));
  const peers = Array.from({ length: count }, () => new Map()); // neighbour -> { generation, readyAt, free: [a->b, b->a], since }
  const egressFree = new Float64Array(count), ingressFree = new Float64Array(count);
  const work = Array.from({ length: count }, () => new Map()); // neighbour id -> { total, sampled, rate, at }
  let generation = 0, linkChanges = 0;

  const megabytes = (message) => (message.type === 'work' ? message.tasks.length * task.inMb
    : message.type === 'results' ? message.results.length * task.outMb : 0);
  const send = (from, toId, message) => {
    const to = index.get(toId);
    const link = peers[from].get(to);
    if (!link) return;
    const size = megabytes(message);
    const start = Math.max(now, link.readyAt);
    let arrive = start + CONTROL_MS;
    if (size > 0) {
      const direction = from < to ? 0 : 1;
      const onLink = Math.max(start, link.free[direction]) + 1000 * size / Math.max(link.capacity, 1e-9);
      link.free[direction] = onLink;
      egressFree[from] = Math.max(start, egressFree[from]) + 1000 * size / nodes[from].access;
      ingressFree[to] = Math.max(start, ingressFree[to]) + 1000 * size / nodes[to].access;
      arrive = Math.max(onLink, egressFree[from], ingressFree[to]) + CONTROL_MS;
    }
    const sent = link.generation;
    agenda.push(arrive, () => { if (peers[from].get(to)?.generation === sent) meshes[to].receive(nodes[from].id, message); });
  };
  const meshes = nodes.map((node) => new WorkMesh({
    nodeId: node.id,
    clock: () => now,
    send: (peerId, message) => send(node.index, peerId, message),
    execute: (item, done) => agenda.push(now + 1000 / node.compute, () => done(item.payload)),
    onWork: (peerId, units) => {
      const entry = work[node.index].get(peerId) || { total: 0, sampled: 0, rate: 0, at: now };
      entry.total += units;
      work[node.index].set(peerId, entry);
    }
  }));
  const addLink = (i, j) => {
    if (i === j || peers[i].has(j) || peers[i].size >= config.maxConnections || peers[j].size >= config.maxConnections) return false;
    const setup = setupRange[0] + random() * (setupRange[1] - setupRange[0]);
    const link = { generation: generation += 1, capacity: capacity(i, j), readyAt: now + (now > 0 ? setup : 0), free: [0, 0], since: now };
    peers[i].set(j, link); peers[j].set(i, link);
    meshes[i].linkUp(nodes[j].id); meshes[j].linkUp(nodes[i].id);
    return true;
  };
  const removeLink = (i, j) => {
    if (!peers[i].delete(j)) return;
    peers[j].delete(i);
    meshes[i].linkDown(nodes[j].id); meshes[j].linkDown(nodes[i].id);
  };

  const alive = nodes.map(() => true);
  const pairs = policy === 'spatial' ? spatialTopology(scenario, alive)
    : policy === 'greedy' ? greedyTopology(scenario, alive)
      // A given graph seed reproduces the random graph a browser run was pinned to.
      : randomTopology(scenario, alive, realism?.randomGraphSeed ? createRng(realism.randomGraphSeed) : random);
  for (const [i, j] of pairs) addLink(i, j);

  const rate = (i, peerId) => work[i].get(peerId)?.rate || 0;
  const state = nodes.map(() => createThroughputTopologyState());
  const decide = (i) => {
    for (const entry of work[i].values()) {
      const elapsed = now - entry.at;
      if (elapsed <= 0) continue;
      entry.rate += ((entry.total - entry.sampled) * 1000 / elapsed - entry.rate) * (1 - Math.exp(-elapsed / FLOW_TAU_MS));
      entry.sampled = entry.total; entry.at = now;
    }
    const links = [...peers[i]].map(([j, link]) => ({ peerId: nodes[j].id, flow: rate(i, nodes[j].id), since: link.since }));
    const others = nodes.filter((node) => node.index !== i && !peers[i].has(node.index));
    const strongest = links.slice().sort((a, b) => b.flow - a.flow)[0];
    const decision = decideThroughputTopology({
      now, links, state: state[i], random, config,
      candidates: others.map((node) => node.id),
      available: others.filter((node) => peers[node.index].size < config.targetConnections).map((node) => node.id),
      referrals: strongest ? [...peers[index.get(strongest.peerId)].keys()].filter((j) => j !== i && !peers[i].has(j)).map((j) => nodes[j].id) : []
    });
    for (const peerId of decision.drop) { removeLink(i, index.get(peerId)); linkChanges += 1; }
    if (decision.connect && addLink(i, index.get(decision.connect))) linkChanges += 1;
  };

  // A job far larger than the run can finish.
  meshes[source].submitJob({ jobId: 'job', tasks: Array.from({ length: Math.ceil(400 * durationS) }, (_, n) => n) });
  for (let i = 0; i < count; i += 1) {
    const offset = Math.floor(random() * TICK_MS);
    const tick = () => { meshes[i].tick(now); agenda.push(now + TICK_MS, tick); };
    agenda.push(offset, tick);
    if (policy === 'adaptive') {
      const reconsider = () => { decide(i); agenda.push(now + decideMs, reconsider); };
      agenda.push(Math.floor(random() * decideMs), reconsider);
    }
  }
  if (realism?.resetsPerNodeMinute > 0) {
    // A stream reset: the link survives but whatever was in flight on it is
    // taken back, as when the library closes a duplicate connection.
    const meanGapMs = 60000 / (realism.resetsPerNodeMinute * count);
    const reset = () => {
      const i = Math.floor(random() * count);
      const neighbours = [...peers[i].keys()];
      if (neighbours.length) {
        const j = neighbours[Math.floor(random() * neighbours.length)];
        const link = peers[i].get(j);
        link.generation = generation += 1; // messages in flight are lost
        meshes[i].linkDown(nodes[j].id); meshes[i].linkUp(nodes[j].id);
        meshes[j].linkDown(nodes[i].id); meshes[j].linkUp(nodes[i].id);
      }
      agenda.push(now - meanGapMs * Math.log(Math.max(random(), 1e-12)), reset);
    };
    agenda.push(meanGapMs, reset);
  }
  const samples = [];
  const sample = () => { samples.push({ t: now / 1000, returned: meshes[source].counters.returned, linkChanges }); agenda.push(now + 1000, sample); };
  agenda.push(0, sample);

  const end = durationS * 1000;
  while (agenda.items.length && agenda.items[0][0] <= end) {
    const [time, , fn] = agenda.pop();
    now = time;
    fn();
  }

  const windowS = realism?.windowS ?? Math.min(120, Math.floor(durationS / 3));
  const between = (fromS, toS) => {
    const first = samples.find((entry) => entry.t >= fromS), last = samples.filter((entry) => entry.t <= toS).pop();
    return { rate: (last.returned - first.returned) / (last.t - first.t), changes: last.linkChanges - first.linkChanges };
  };
  const steady = between(durationS - windowS, durationS);
  let settleS = null;
  for (let s = 0; s + 10 <= durationS; s += 1) if (between(s, s + 10).rate >= 0.9 * steady.rate) { settleS = s; break; }
  return {
    policy, scenario: scenario.name, regime: scenario.regime, seed,
    throughput: steady.rate,
    settleS,
    linkChangesPerNodeMinute: steady.changes / count / (windowS / 60),
    duplicates: meshes[source].counters.duplicates,
    reissued: meshes[source].counters.reissued,
    executedBySource: meshes[source].counters.executed
  };
}
