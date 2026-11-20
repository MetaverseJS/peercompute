/**
 * Network scenarios for the conjecture experiment.
 *
 * Units: compute in tasks per second, capacity in megabytes per second, sizes
 * in megabytes. Every node has an access capacity shared by all of its links
 * (in each direction); a pair's link capacity is the smaller of the two access
 * capacities scaled by a path quality in (0, 1].
 */

export function createRng(seed) {
  let a = (seed >>> 0) || 1;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(random) {
  const u = Math.max(random(), 1e-12);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
}
const logNormal = (random, median, sigma) => median * Math.exp(sigma * gaussian(random));

export const TASK_REGIMES = Object.freeze({
  // Megabytes sent to a worker per task, and returned to the source per result.
  'compute-bound': { inMb: 0.02, outMb: 0.005 },
  balanced: { inMb: 0.2, outMb: 0.05 },
  'data-bound': { inMb: 1, outMb: 0.1 }
});

export const SCENARIOS = Object.freeze(['sites', 'decorrelated', 'far-compute', 'uniform']);

/**
 * sites         four LAN sites; links inside a site are good, links between
 *               sites are poor except between two gateway nodes per site.
 *               Positions follow the sites, so distance predicts link quality.
 * decorrelated  the same nodes, but path quality is unrelated to position.
 * far-compute   sites, with most compute in three nodes at a site the source
 *               is not in.
 * uniform       identical nodes and links (control: topology should not matter).
 */
export function makeScenario({ name = 'sites', seed = 1, nodes: count = 32, regime = 'balanced',
  targetConnections = 4, maxConnections = 5, provisionedSource = false } = {}) {
  if (!SCENARIOS.includes(name)) throw new RangeError(`Unknown scenario ${name}`);
  if (!TASK_REGIMES[regime]) throw new RangeError(`Unknown task regime ${regime}`);
  const random = createRng(seed * 7919 + SCENARIOS.indexOf(name) * 104729 + 17);
  const siteCount = 4;
  const centers = Array.from({ length: siteCount }, (_, s) => ({
    x: 100 * Math.cos((2 * Math.PI * s) / siteCount), y: 100 * Math.sin((2 * Math.PI * s) / siteCount) }));
  const nodes = Array.from({ length: count }, (_, i) => {
    const site = i % siteCount;
    const uniform = name === 'uniform';
    const position = name === 'decorrelated' || uniform
      ? { x: 200 * random() - 100, y: 200 * random() - 100, z: 0 }
      : { x: centers[site].x + 8 * gaussian(random), y: centers[site].y + 8 * gaussian(random), z: 0 };
    return {
      id: `n${String(i).padStart(2, '0')}`, index: i, site, position,
      gateway: Math.floor(i / siteCount) < 2,
      compute: uniform ? 4 : logNormal(random, 3, 1),
      access: uniform ? 20 : logNormal(random, 20, 0.8)
    };
  });
  const source = Math.floor(random() * count);
  // A job owner on a well-connected host (for example a root node) moves the
  // bottleneck from its own uplink into the network.
  if (provisionedSource) nodes[source].access = 160;
  if (name === 'far-compute') {
    const farSite = (nodes[source].site + 2) % siteCount;
    for (const node of nodes) node.compute = logNormal(random, 1, 0.5);
    nodes.filter((node) => node.site === farSite && !node.gateway).slice(0, 3)
      .forEach((node) => { node.compute = 40; });
  }
  const quality = new Float64Array(count * count);
  for (let i = 0; i < count; i += 1) {
    for (let j = i + 1; j < count; j += 1) {
      let q;
      if (name === 'uniform') q = 1;
      else if (name === 'decorrelated') q = Math.min(1, logNormal(random, 0.3, 1.2));
      else if (nodes[i].site === nodes[j].site) q = 1;
      else if (nodes[i].gateway && nodes[j].gateway) q = 0.8;
      else q = Math.min(1, logNormal(random, 0.12, 0.5));
      quality[i * count + j] = quality[j * count + i] = q;
    }
  }
  const capacity = (i, j) => Math.min(nodes[i].access, nodes[j].access) * quality[i * count + j];
  return { name, seed, regime, provisionedSource, nodes, source, capacity, task: TASK_REGIMES[regime], targetConnections, maxConnections };
}

/**
 * A ceiling on tasks per second that no topology can exceed. A remote node can
 * contribute at most its compute, its access capacity, and the combined
 * capacity of its best `maxConnections` possible links; together the remote
 * nodes cannot exceed the source's access capacity. The ceiling ignores
 * everything upstream of a node, so it is loose where bottlenecks sit in the
 * middle of the network: compare policies with each other first.
 */
export function throughputCeiling(scenario, alive = scenario.nodes.map(() => true)) {
  const { nodes, source, capacity, task, maxConnections } = scenario;
  const perTask = Math.max(task.inMb, task.outMb);
  let remote = 0;
  for (const node of nodes) {
    const i = node.index;
    if (i === source || !alive[i]) continue;
    const best = nodes.filter((peer) => peer.index !== i && alive[peer.index])
      .map((peer) => capacity(i, peer.index)).sort((a, b) => b - a).slice(0, maxConnections)
      .reduce((sum, value) => sum + value, 0);
    remote += Math.min(node.compute, node.access / perTask, best / perTask);
  }
  return nodes[source].compute + Math.min(remote, nodes[source].access / perTask);
}
