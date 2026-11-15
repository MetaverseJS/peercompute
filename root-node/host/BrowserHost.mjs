import { readFile, writeFile, rename } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { chromium } from 'playwright';
import { normalizeHostConfig, companionBootstrapAddresses } from './config.mjs';
import { acquireProfileLock } from './profileLock.mjs';
import { writeEvidenceDirectory } from './evidenceDirectory.mjs';
import { startHostServer } from './staticServer.mjs';

export async function deadline(promise, ms, label) {
  let timer;
  try {
    return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${label} timed out`)), ms); })]);
  } finally { clearTimeout(timer); }
}

export class BrowserHost {
  constructor(options = {}) {
    this.config = normalizeHostConfig(options);
    this.state = 'stopped';
    this.browserStatus = null;
    this.restarts = 0;
    this.stopping = false;
    this.lastError = null;
    this.pageErrors = [];
  }

  status() {
    return { state: this.state, origin: this.server?.origin, installationId: this.installation?.id,
      browser: this.browserStatus, companion: this.companion?.getStatus(),
      directoryError: this.directoryError ?? null, restarts: this.restarts, lastError: this.lastError, pageErrors: [...this.pageErrors] };
  }

  async start(options = {}) {
    if (this.starting) throw new Error('Host startup is already in progress');
    this.starting = this.startHost(options);
    try { return await this.starting; } finally { this.starting = null; }
  }

  async startHost({ rebuild = true } = {}) {
    if (this.state !== 'stopped') throw new Error('Host is already started');
    if (Number(process.versions.node.split('.')[0]) < 24) throw new Error('Node.js 24 or later is required');
    this.state = 'starting';
    this.stopping = false;
    this.restarts = 0;
    this.lastError = null;
    try {
      this.releaseLock = await acquireProfileLock(this.config.dataDir);
      const metadataPath = join(this.config.dataDir, 'installation.json');
      try { this.installation = JSON.parse(await readFile(metadataPath, 'utf8')); }
      catch (error) {
        if (error.code !== 'ENOENT') throw new Error('Invalid installation metadata; refusing to replace identity/origin');
        this.installation = { version: 1, id: randomUUID(), port: this.config.port };
      }
      if (this.installation.version !== 1 || typeof this.installation.id !== 'string' || !Number.isInteger(this.installation.port) || this.installation.port < 0 || this.installation.port > 65535) throw new Error('Invalid installation metadata');
      if (this.config.port !== 0 && this.installation.port !== this.config.port) throw new Error('Port differs from the persistent origin; use the original port or a separate dataDir');
      const bundleDir = join(this.config.dataDir, 'bundle');
      if (rebuild) { const { buildBrowserHost } = await import('./build.mjs'); await buildBrowserHost(bundleDir); }
      this.server = await startHostServer({ directory: bundleDir, port: this.installation.port, status: () => this.status() });
      this.installation.port = this.server.port;
      await writeFile(`${metadataPath}.tmp`, JSON.stringify(this.installation), { mode: 0o600 });
      await rename(`${metadataPath}.tmp`, metadataPath);
      if (this.config.companion.enabled) {
        const { createNativeCompanion } = await import('../../peercompute/src/host/native/NativeCompanion.js');
        const { enabled, connectHost, tls: tlsPaths, ...companionOptions } = this.config.companion;
        let tls;
        if (tlsPaths) tls = { cert: await readFile(tlsPaths.certPath), key: await readFile(tlsPaths.keyPath) };
        this.companion = createNativeCompanion({ ...companionOptions, tls, identityPath: join(this.config.dataDir, 'relay-identity.json') });
        await this.companion.start();
      }
      if (this.stopping) throw new Error('Host startup cancelled');
      await this.launchBrowser();
      if (this.stopping) throw new Error('Host startup cancelled');
      this.state = 'running';
      await this.publishDirectory();
      this.scheduleWatchdog();
      return this.status();
    } catch (error) {
      this.lastError = error.message;
      await this.cleanup();
      throw error;
    }
  }

  async launchBrowser() {
    const context = await chromium.launchPersistentContext(join(this.config.dataDir, 'chromium-profile'), {
      chromiumSandbox: true,
      executablePath: this.config.chromePath, headless: true,
      args: this.config.chromeArgs, timeout: this.config.startupTimeoutMs,
      viewport: { width: 900, height: 600 },
    });
    this.context = context;
    // Do not revive restored tabs that might instantiate a second kernel.
    const page = await context.newPage();
    for (const other of context.pages()) if (other !== page) await other.close();
    this.page = page;
    page.on('pageerror', error => { this.pageErrors.push(error.message.slice(0, 500)); this.pageErrors = this.pageErrors.slice(-10); });
    page.on('crash', () => { if (!this.stopping && this.state === 'running') void this.recoverBrowser('Browser page crashed'); });
    context.on('close', () => { if (!this.stopping && this.context === context && this.state === 'running') void this.recoverBrowser('Browser exited'); });
    await page.goto(this.server.origin, { waitUntil: 'load', timeout: this.config.startupTimeoutMs });
    await page.waitForFunction(() => Boolean(window.peercomputeRoot?.prepare), { timeout: this.config.startupTimeoutMs });
    const identity = await deadline(page.evaluate(id => window.peercomputeRoot.prepare({ installationId: id }), this.installation.id), this.config.startupTimeoutMs, 'Identity preparation');
    await this.companion?.setHostedPeerIds([identity.peerId]);
    const localRelays = this.companion ? companionBootstrapAddresses(this.companion.getStatus(), this.config.companion) : [];
    const bootstrapPeers = [...new Set([...localRelays, ...this.config.bootstrapPeers])];
    this.browserStatus = await deadline(page.evaluate(config => window.peercomputeRoot.start(config), {
      installationId: this.installation.id, bootstrapPeers,
      connectNetwork: this.config.connectNetwork, requireHardwareGpu: this.config.requireHardwareGpu,
      allowLocalDial: true,
    }), this.config.startupTimeoutMs, 'Client initialization');
  }

  async publishDirectory() {
    if (!this.config.directoryFile) return;
    try { await writeEvidenceDirectory(this.config.directoryFile, this.browserStatus); this.directoryError = null; }
    catch (error) { this.directoryError = error.code || 'ERR_DIRECTORY_WRITE'; }
  }

  scheduleWatchdog() {
    clearTimeout(this.watchdog);
    if (this.stopping || this.state !== 'running') return;
    this.watchdog = setTimeout(async () => {
      try {
        this.browserStatus = await deadline(this.page.evaluate(() => window.peercomputeRoot.status()), this.config.watchdogTimeoutMs, 'Browser health');
        if (this.browserStatus.phase !== 'ready') throw new Error(`Browser runtime is ${this.browserStatus.phase}`);
        await this.publishDirectory();
      } catch (error) { await this.recoverBrowser(error.message); }
      this.scheduleWatchdog();
    }, this.config.watchdogIntervalMs);
    this.watchdog.unref();
  }

  async recoverBrowser(reason) {
    if (this.stopping || this.recovery || this.state === 'failed') return this.recovery;
    this.recovery = (async () => {
      this.state = 'recovering';
      this.lastError = reason;
      clearTimeout(this.watchdog);
      const old = this.context;
      this.context = null;
      await old?.close().catch(() => {});
      while (!this.stopping && this.restarts < this.config.maxBrowserRestarts) {
        this.restarts++;
        try { await this.launchBrowser(); if (!this.stopping) { this.state = 'running'; this.scheduleWatchdog(); } return; }
        catch (error) {
          this.lastError = error.message;
          const failed = this.context; this.context = null;
          await failed?.close().catch(() => {});
        }
      }
      if (!this.stopping) this.state = 'failed';
    })();
    try { await this.recovery; } finally { this.recovery = null; }
  }

  async qualifyCompute() {
    if (this.state !== 'running') throw new Error('Browser host is not running');
    return deadline(this.page.evaluate(() => window.peercomputeRoot.qualifyCompute()), this.config.startupTimeoutMs, 'Managed GPU qualification');
  }

  async stop() {
    if (this.stopPromise) return this.stopPromise;
    this.stopping = true;
    clearTimeout(this.watchdog);
    this.stopPromise = (async () => {
      await this.starting?.catch(() => {});
      if (this.recovery) await this.recovery.catch(() => {});
      await this.cleanup();
    })();
    try { await this.stopPromise; } finally { this.stopPromise = null; }
  }

  async cleanup() {
      const errors = [];
      if (this.page && !this.page.isClosed()) {
        await deadline(this.page.evaluate(() => window.peercomputeRoot?.stop()), 5000, 'Client shutdown').catch(() => {});
      }
      const context = this.context; this.context = null;
      await context?.close().catch(error => { this.context = context; errors.push(error); });
      this.page = null;
      try { await this.companion?.stop(); this.companion = null; } catch (error) { errors.push(error); }
      try { await this.server?.stop(); this.server = null; } catch (error) { errors.push(error); }
      if (!errors.length) { await this.releaseLock?.(); this.releaseLock = null; this.state = 'stopped'; }
      else { this.state = 'failed'; throw new AggregateError(errors, 'Host cleanup failed; profile ownership retained'); }
  }
}
