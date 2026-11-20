import { TopologyController } from '../../src/peercompute/networkManager/TopologyController.js';

/** Small undirected graph with a per-node connection limit. */
export function createGraph(count, maxConnections) {
  const peers = Array.from({ length: count }, () => new Set());
  return {
    peers,
    has: (i, j) => peers[i].has(j),
    degree: (i) => peers[i].size,
    canLink: (i, j) => i !== j && !peers[i].has(j) && peers[i].size < maxConnections && peers[j].size < maxConnections,
    link(i, j) { peers[i].add(j); peers[j].add(i); },
    pairs() {
      const out = [];
      peers.forEach((set, i) => set.forEach((j) => { if (i < j) out.push([i, j]); }));
      return out;
    }
  };
}

// The same string hash TopologyController uses for its long-range choice.
function hashString(value) {
  let hash = 0;
  const text = String(value);
  for (let i = 0; i < text.length; i += 1) { hash = (hash << 5) - hash + text.charCodeAt(i); hash |= 0; }
  return Math.abs(hash);
}

/**
 * The library's current behaviour: each node asks TopologyController for its
 * nearest peers by position, then adds one hash-chosen long-range link.
 */
export function spatialTopology(scenario, alive) {
  const { nodes, targetConnections, maxConnections } = scenario;
  const graph = createGraph(nodes.length, maxConnections);
  const live = nodes.filter((node) => alive[node.index]);
  const controllers = new Map(live.map((node) => [node.index, new TopologyController({
    peerId: node.id, metric: node.position, topologyType: 'distributed',
    targetConnections, maxConnections: targetConnections, connectionRadius: 1e9, longRangeCount: 0
  })]));
  const byId = new Map(nodes.map((node) => [node.id, node.index]));
  for (let round = 0; round < 3; round += 1) {
    for (const node of live) {
      const peers = live.filter((peer) => peer !== node).map((peer) => ({ peerId: peer.id, metric: peer.position,
        metricInitialized: true, targetConnections, activeConnections: graph.degree(peer.index) }));
      for (const peerId of controllers.get(node.index).computeDesiredPeers({ peers, now: 0 })) {
        const j = byId.get(peerId);
        if (graph.canLink(node.index, j)) graph.link(node.index, j);
      }
    }
  }
  for (const node of live) {
    const options = live.filter((peer) => graph.canLink(node.index, peer.index))
      .sort((a, b) => hashString(`${node.id}:${a.id}`) - hashString(`${node.id}:${b.id}`));
    if (options.length) graph.link(node.index, options[0].index);
  }
  return graph.pairs();
}

/** Every node links to random peers until it reaches its target. */
export function randomTopology(scenario, alive, random) {
  const { nodes, targetConnections, maxConnections } = scenario;
  const graph = createGraph(nodes.length, maxConnections);
  const live = nodes.filter((node) => alive[node.index]).map((node) => node.index);
  const order = live.slice().sort(() => random() - 0.5);
  for (const i of order) {
    while (graph.degree(i) < targetConnections) {
      const options = live.filter((j) => graph.canLink(i, j));
      if (!options.length) break;
      graph.link(i, options[Math.floor(random() * options.length)]);
    }
  }
  return graph.pairs();
}

/**
 * A centralized planner that knows every capacity. It grows a tree from the
 * source, each time attaching the node that adds the most usable compute over
 * its best available link, then spends spare connections on the widest unused
 * pairs. This is a greedy heuristic, not an optimum.
 */
export function greedyTopology(scenario, alive) {
  const { nodes, source, capacity, task, targetConnections, maxConnections } = scenario;
  const graph = createGraph(nodes.length, maxConnections);
  const perTask = Math.max(task.inMb, task.outMb);
  const live = nodes.filter((node) => alive[node.index]).map((node) => node.index);
  const reach = new Map([[source, Number.POSITIVE_INFINITY]]);
  while (reach.size < live.length) {
    let best = null;
    for (const [u, upstream] of reach) {
      for (const v of live) {
        if (reach.has(v) || !graph.canLink(u, v)) continue;
        const path = Math.min(upstream, capacity(u, v));
        const gain = Math.min(nodes[v].compute, path / perTask);
        if (!best || gain > best.gain || (gain === best.gain && path > best.path)) best = { u, v, gain, path };
      }
    }
    if (!best) break;
    graph.link(best.u, best.v);
    reach.set(best.v, best.path);
  }
  const spare = [];
  for (const i of live) for (const j of live) if (i < j && !graph.has(i, j)) spare.push([capacity(i, j), i, j]);
  spare.sort((a, b) => b[0] - a[0]);
  for (const [, i, j] of spare) {
    if (graph.degree(i) < targetConnections && graph.degree(j) < targetConnections && graph.canLink(i, j)) graph.link(i, j);
  }
  return graph.pairs();
}
