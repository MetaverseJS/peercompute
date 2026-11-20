/**
 * WorkMesh: spreads a divisible job over directly linked peers.
 *
 * Every node keeps a queue of tasks and measures how fast it gets rid of them
 * (by running them or passing them on). Its waiting time is queue length over
 * that rate. On each tick a node gives work to a neighbour with a shorter
 * waiting time, enough to close half the gap; it runs tasks itself; and it
 * passes finished results toward the job's origin. Balancing time rather than
 * length keeps a slow node from holding work it cannot finish soon.
 *
 * Each node also measures, per link, the seconds a result takes to cross it, and
 * keeps a distance to each job's origin: the cheapest sum of those costs over
 * any path, learned from its neighbours' distances. Results go to a neighbour
 * that is nearer by that measure, and work moves only to a neighbour that is
 * farther, so tasks cannot circulate. Work stranded by a route change is
 * handed back to a nearer neighbour, across a gap of seconds only. Measuring cost rather than counting hops lets a strong peer be fed
 * through a fast two-link path instead of a slow direct link.
 *
 * No node knows the whole network: it sees only its neighbours' queues, rates
 * and distances. One batch at a time is in flight per link and direction, so a
 * slow link carries less work.
 *
 * This is the live counterpart of the flow model in
 * peercompute/experiments/conjecture/simulate.js. The module has no timers,
 * sockets or globals. The host supplies:
 *   send(peerId, message)        deliver a message to a linked peer
 *   execute(task, done)          run one task and call done(value) once
 *   onWork(peerId, units)        optional: tasks and results moved over a link
 * and calls linkUp/linkDown, receive(peerId, message) and tick(now).
 */

export const WORK_MESH_SCHEMA = 'peercompute.work-mesh.v1';

export const WORK_MESH_DEFAULTS = Object.freeze({
  headSeconds: 4, // waiting time a job's origin keeps on offer
  minHead: 8, // and the fewest tasks it offers, whatever its rate
  minRate: 0.5, // tasks per second assumed of a node that has not been measured
  rateTauMs: 2000,
  concurrency: 1,
  resultBuffer: 16, // finished results a node may hold before it stops computing
  workBatch: 8,
  resultBatch: 16,
  defaultLinkCost: 0.05, // seconds per task assumed of a link that has not carried a batch
  costWindow: 8, // recent batches whose fastest crossing defines a link's cost
  distanceHold: 0.2, // a node keeps its distance until the measured value moves by this share
  fartherMargin: 0.1, // and a neighbour must be this much farther to be given work
  handBackGapSeconds: 2, // waiting-time gap at which stranded work goes back toward the origin
  maxDistance: 30, // seconds; beyond this an origin counts as unreachable
  taskTimeoutMs: 60000, // the origin offers a task again if no result has come back
  forgetMs: 60000 // drop a job's leftovers once no neighbour has known a way to its origin for this long
});

export class WorkMesh {
  constructor({ nodeId, send, execute, onWork = null, clock = null, config = {} } = {}) {
    if (!nodeId || typeof send !== 'function' || typeof execute !== 'function') {
      throw new TypeError('WorkMesh requires nodeId, send and execute');
    }
    this.nodeId = String(nodeId);
    this.send = send;
    this.execute = execute;
    this.onWork = typeof onWork === 'function' ? onWork : null;
    this.clock = typeof clock === 'function' ? clock : () => Date.now();
    this.config = { ...WORK_MESH_DEFAULTS, ...config };
    this.queue = []; // { jobId, taskId, origin, payload }
    this.results = []; // { jobId, taskId, origin, value } waiting to travel home
    this.running = 0;
    this.links = new Map(); // peerId -> { queued, rate, cost, distances: Map, work: batch|null, results: batch|null }
    this.jobs = new Map(); // jobs this node originated
    this.origins = new Map(); // jobId -> origin nodeId, for every job seen
    this.distances = new Map(); // jobId -> seconds per task from this node to the origin, as advertised (held steady)
    this.liveDistances = new Map(); // jobId -> the same, recomputed every tick
    this.unreachableSince = new Map(); // jobId -> when its origin was last reachable
    this.counters = { executed: 0, forwarded: 0, handedBack: 0, returned: 0, reissued: 0, duplicates: 0 };
    this.rate = 0; // tasks per second this node runs or passes on, smoothed
    this.rateSample = null; // { at, drained }
    this.now = 0;
    this.destroyed = false;
  }

  /**
   * Offer a job to the mesh. `tasks` is an array of payloads; the promise
   * resolves with their results in the same order.
   */
  submitJob({ jobId, tasks, onResult = null } = {}) {
    if (this.destroyed) throw new Error('WorkMesh is destroyed');
    if (!jobId || !Array.isArray(tasks)) throw new TypeError('submitJob requires jobId and a tasks array');
    if (this.jobs.has(jobId)) throw new Error(`Job ${jobId} is already running`);
    let resolve;
    const done = new Promise((ok) => { resolve = ok; });
    this.jobs.set(jobId, {
      payloads: tasks, values: new Array(tasks.length), finished: new Uint8Array(tasks.length),
      remaining: tasks.length, next: 0, retry: [], issued: new Map(), onResult, resolve
    });
    this.origins.set(jobId, this.nodeId);
    this.distances.set(jobId, 0);
    this.liveDistances.set(jobId, 0);
    if (tasks.length === 0) this._finish(jobId);
    return done;
  }

  linkUp(peerId) {
    if (!this.links.has(peerId)) this.links.set(peerId, { queued: Number.POSITIVE_INFINITY, rate: 0, cost: this.config.defaultLinkCost, measured: false,
      distances: new Map(), work: null, results: null });
  }

  /** Anything in flight on a lost link may not have arrived: keep it here. */
  linkDown(peerId) {
    const link = this.links.get(peerId);
    if (!link) return;
    if (link.work) {
      for (const task of link.work) this.jobs.get(task.jobId)?.issued.delete(task.taskId);
      this.queue.push(...link.work);
    }
    if (link.results) this.results.push(...link.results);
    this.links.delete(peerId);
  }

  receive(peerId, message) {
    const link = this.links.get(peerId);
    if (this.destroyed || !link || !message || message.schema !== WORK_MESH_SCHEMA) return;
    switch (message.type) {
      case 'state':
        link.queued = Number.isFinite(message.queued) ? Math.max(0, message.queued) : Number.POSITIVE_INFINITY;
        link.rate = Number.isFinite(message.rate) ? Math.max(0, message.rate) : 0;
        link.distances = new Map();
        for (const [jobId, origin, distance] of Array.isArray(message.jobs) ? message.jobs : []) {
          if (!this.origins.has(jobId)) this.origins.set(jobId, origin);
          if (Number.isFinite(distance) && distance >= 0) link.distances.set(jobId, distance);
        }
        break;
      case 'work':
        for (const task of Array.isArray(message.tasks) ? message.tasks : []) {
          if (!this.origins.has(task.jobId)) this.origins.set(task.jobId, task.origin);
          this.queue.push(task);
        }
        this._moved(peerId, message.tasks?.length || 0);
        this.send(peerId, { schema: WORK_MESH_SCHEMA, type: 'work-ack' });
        this._pump();
        break;
      case 'work-ack':
        if (link.work) {
          this.counters.forwarded += link.work.length;
          if (link.work.handedBack) this.counters.handedBack += link.work.length;
          this._moved(peerId, link.work.length);
        }
        link.work = null;
        this._serve(peerId, link); // keep the link busy without waiting for a tick
        break;
      case 'results':
        for (const result of Array.isArray(message.results) ? message.results : []) this._accept(result);
        this._moved(peerId, message.results?.length || 0);
        this.send(peerId, { schema: WORK_MESH_SCHEMA, type: 'results-ack' });
        break;
      case 'results-ack':
        if (link.results) { this._crossed(link, link.results); this._moved(peerId, link.results.length); }
        link.results = null;
        this._serve(peerId, link);
        break;
      default:
    }
  }

  /** Advance the node: call a few times per second with a millisecond clock. */
  tick(now) {
    if (this.destroyed) return;
    this.now = now;
    this._measure(now);
    this._refill(now);
    this._updateDistances(now);
    this._pump();
    const held = this.queue.length + this.running;
    const jobs = [...this.distances].map(([jobId, distance]) => [jobId, this.origins.get(jobId), distance]);
    for (const [peerId, link] of this.links) {
      this._serve(peerId, link);
      this.send(peerId, { schema: WORK_MESH_SCHEMA, type: 'state', queued: held, rate: this.rate, jobs });
    }
  }

  /** Put results and work on a link that has nothing in flight in that direction. */
  _serve(peerId, link) {
    if (!link.results && this.results.length) {
      // Results travel only to a neighbour that is nearer their origin, and
      // only by a path about as cheap as the best one this node knows.
      const batch = [];
      const rest = [];
      for (const result of this.results) {
        // Compare against this tick's own best path, not the steadier value
        // this node advertises: otherwise, as measurements drift, no neighbour
        // may qualify and results would never leave.
        const mine = this.liveDistances.get(result.jobId) ?? Number.POSITIVE_INFINITY;
        const theirs = link.distances.get(result.jobId) ?? Number.POSITIVE_INFINITY;
        const homeward = theirs < mine && theirs + Math.max(link.cost, 1e-4) <= 1.25 * mine + 1e-9;
        (homeward && batch.length < this.config.resultBatch ? batch : rest).push(result);
      }
      if (batch.length) {
        this.results = rest;
        batch.sentAt = this.clock();
        link.results = batch;
        this.send(peerId, { schema: WORK_MESH_SCHEMA, type: 'results', results: batch });
      }
    }
    if (!link.work && this.queue.length) {
      // Close half the gap in waiting time; an idle neighbour gets at least one task.
      const mine = this.queue.length / Math.max(this.rate, this.config.minRate);
      const peerRate = Math.max(link.rate, this.config.minRate);
      const gap = mine - link.queued / peerRate;
      const share = Math.min(this.config.workBatch, this.queue.length,
        Math.max(Math.floor(gap * peerRate / 2), gap > 0 && link.queued === 0 && this.queue.length > 1 ? 1 : 0));
      if (share >= 1) {
        // Oldest first, for running and for handing on alike, so no task
        // waits behind this node's own executor for longer than the queue.
        const batch = [];
        const rest = [];
        let handedBack = false;
        for (const task of this.queue) {
          // Distances are measured with results, by the node that sends them,
          // so the only comparison both ends agree on is which is farther.
          const theirs = link.distances.get(task.jobId) ?? Number.POSITIVE_INFINITY;
          const here = this.distances.get(task.jobId) ?? 0;
          const farther = theirs > (1 + this.config.fartherMargin) * here;
          // A route change can leave a relay holding a queue sized for a rate
          // it no longer has. Across a gap of seconds it hands that work back
          // to a nearer neighbour, which can send it out another way.
          const back = !farther && theirs * (1 + this.config.fartherMargin) < here && gap >= this.config.handBackGapSeconds;
          if ((farther || back) && batch.length < share) { batch.push(task); if (back) handedBack = true; } else rest.push(task);
        }
        if (batch.length) {
          this.queue = rest;
          batch.sentAt = this.clock();
          batch.handedBack = handedBack;
          // The origin's clock for a task starts when the task leaves it; a
          // task still queued here is not missing.
          for (const task of batch) this.jobs.get(task.jobId)?.issued.set(task.taskId, this.now);
          link.work = batch;
          link.queued += batch.length;
          this.send(peerId, { schema: WORK_MESH_SCHEMA, type: 'work', tasks: [...batch] });
        }
      }
    }
  }

  snapshot() {
    return { nodeId: this.nodeId, queued: this.queue.length, running: this.running, results: this.results.length,
      links: this.links.size, jobs: this.jobs.size, counters: { ...this.counters } };
  }

  destroy() {
    this.destroyed = true;
    this.queue = []; this.results = []; this.links.clear();
  }

  /** Start tasks until this node is busy or holding too many results. */
  _pump() {
    while (!this.destroyed && this.running < this.config.concurrency && this.queue.length
        && this.results.length < this.config.resultBuffer) {
      const task = this.queue.shift();
      this.running += 1;
      let settled = false;
      this.execute(task, (value) => {
        if (settled || this.destroyed) return;
        settled = true;
        this.running -= 1;
        this.counters.executed += 1;
        this._accept({ jobId: task.jobId, taskId: task.taskId, origin: task.origin, value });
        this._pump(); // do not wait for the next tick
      });
    }
  }

  _measure(now) {
    // Work handed back is not progress: counting it would make this node look
    // faster and invite the same work straight back.
    const drained = this.counters.executed + this.counters.forwarded - this.counters.handedBack;
    if (this.rateSample && now > this.rateSample.at) {
      const elapsed = now - this.rateSample.at;
      this.rate += ((drained - this.rateSample.drained) * 1000 / elapsed - this.rate) * (1 - Math.exp(-elapsed / this.config.rateTauMs));
    }
    if (!this.rateSample || now > this.rateSample.at) this.rateSample = { at: now, drained };
  }

  _moved(peerId, units) {
    if (units > 0 && this.onWork) this.onWork(peerId, units);
  }

  /** The origin tops its queue up to `head` and re-offers tasks that went missing. */
  _refill(now) {
    for (const [jobId, job] of this.jobs) {
      for (const [taskId, issuedAt] of job.issued) {
        if (now - issuedAt < this.config.taskTimeoutMs) break; // insertion order is issue order
        job.issued.delete(taskId);
        if (!job.finished[taskId]) { job.retry.push(taskId); this.counters.reissued += 1; }
      }
      const head = Math.max(this.config.minHead, Math.ceil(this.config.headSeconds * this.rate));
      while (this.queue.length < head && (job.retry.length || job.next < job.payloads.length)) {
        const taskId = job.retry.length ? job.retry.shift() : job.next++;
        if (job.finished[taskId]) continue;
        this.queue.push({ jobId, taskId, origin: this.nodeId, payload: job.payloads[taskId] });
      }
    }
  }

  /**
   * Record the seconds per task of a batch that has just been acknowledged. A
   * link's cost is its fastest recent crossing: that reflects the link itself,
   * while an average would rise and fall with the load and make routes flap.
   */
  _crossed(link, batch) {
    const perTask = Math.max(0, this.clock() - batch.sentAt) / 1000 / Math.max(1, batch.length);
    link.recent = [...(link.recent || []), perTask].slice(-this.config.costWindow);
    link.cost = Math.min(...link.recent);
    link.measured = true;
  }

  _updateDistances(now) {
    for (const jobId of [...this.origins.keys()]) {
      if (this.jobs.has(jobId)) { this.distances.set(jobId, 0); this.liveDistances.set(jobId, 0); continue; }
      let best = Number.POSITIVE_INFINITY;
      for (const link of this.links.values()) {
        best = Math.min(best, (link.distances.get(jobId) ?? Number.POSITIVE_INFINITY) + Math.max(link.cost, 1e-4));
      }
      if (best <= this.config.maxDistance) {
        this.liveDistances.set(jobId, best);
        // Hold the current value against small changes so that two nodes about
        // equally far do not keep swapping places.
        const held = this.distances.get(jobId);
        if (held === undefined || Math.abs(best - held) > this.config.distanceHold * held) this.distances.set(jobId, best);
        this.unreachableSince.delete(jobId);
        continue;
      }
      this.distances.delete(jobId);
      this.liveDistances.delete(jobId);
      if (!this.unreachableSince.has(jobId)) this.unreachableSince.set(jobId, now);
      if (now - this.unreachableSince.get(jobId) < this.config.forgetMs) continue;
      // The job finished or its origin is gone: its leftovers would only clog this node.
      this.origins.delete(jobId);
      this.unreachableSince.delete(jobId);
      this.queue = this.queue.filter((task) => task.jobId !== jobId);
      this.results = this.results.filter((result) => result.jobId !== jobId);
    }
  }

  /** A result is either this node's own job (record it) or passes through. */
  _accept(result) {
    const job = this.jobs.get(result.jobId);
    if (!job) {
      // Finished work is kept even if this node has just lost its way to the
      // origin: links come and go. It is dropped only after `forgetMs`.
      if (!this.origins.has(result.jobId) && result.origin) this.origins.set(result.jobId, result.origin);
      if (this.origins.has(result.jobId)) this.results.push(result);
      return;
    }
    if (job.finished[result.taskId]) { this.counters.duplicates += 1; return; }
    job.finished[result.taskId] = 1;
    job.values[result.taskId] = result.value;
    job.issued.delete(result.taskId);
    job.remaining -= 1;
    this.counters.returned += 1;
    job.onResult?.(result.taskId, result.value);
    if (job.remaining === 0) this._finish(result.jobId);
  }

  _finish(jobId) {
    const job = this.jobs.get(jobId);
    this.jobs.delete(jobId);
    this.distances.delete(jobId);
    this.liveDistances.delete(jobId);
    this.origins.delete(jobId);
    // Tasks of a finished job still queued anywhere are harmless duplicates.
    this.queue = this.queue.filter((task) => task.jobId !== jobId);
    job.resolve(job.values);
  }
}
