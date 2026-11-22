import { probeCapabilities } from '@peercompute';
import { createDemoAgentActions } from '@peercompute-shared/agents/DemoAgent.js';
import {
  buildYoloDbaSystemPrompt,
  buildPrimedUserMessage,
  extractSqlFromModelOutputDetailed,
  isTruncatedSqlOutput,
  stitchContinuation,
  generateChaosFallbackSql
} from './sqlExtractor.js';
import { buildSchemaContextSummary } from '../mermaid/schemaToMermaid.js';

// PeerCompute MODEL_POLICY.maxNewTokens is 1024 per generate() turn.
// Auto-continuing up to 2 extra rounds extends effective reply length up to ~3,072 tokens
// while staying 100% compatible with already-running peer hosts!
const MAX_NEW_TOKENS_PER_TURN = 1024;
const MAX_CONTINUATION_ROUNDS = 2;

function buildContinuationAssistantContext(fullText, maxChars = 2200) {
  const s = String(fullText || '');
  if (s.length <= maxChars) return s;
  // Keep the DDL / column header at the start + the exact cutoff tail so continuation stays column-accurate
  const head = s.slice(0, 650);
  const tail = s.slice(-(maxChars - 700));
  return `${head}\n-- ... (earlier rows omitted for context budget) ...\n${tail}`;
}

/**
 * CubeChat -> Inference style bridge for VibeSlopDB:
 *  - Probes PeerCompute hardware capabilities at startup (lightweight, zero model allocation)
 *  - Lazily boots PeerCompute's `createInferenceRuntime` + `mountInferencePanel` modal when
 *    the user opens [⚙ Models], borrowing the runtime via Proxy (exact CubeChat pattern!)
 *    so loaded local WebGPU or peer-hosted LLMs stay alive after closing the modal.
 *  - Routes YOLO DBA chat prompts to real PeerCompute inference when any text-generation
 *    target is ready, and falls back honestly to the labeled Chaos Gremlin heuristic otherwise.
 */
export function createPeerComputeAiBridge({ sessionManager, onCapabilitiesReady } = {}) {
  let capabilities = null;
  let runtime = null;
  let runtimeBootPromise = null;
  let panel = null;
  let modalHost = null;
  let openingModal = null;
  let closingModal = null;
  let disposed = false;
  let managementOnlyMode = true;
  let peerConnecting = false;
  let peerConnectPromise = null;
  let peerError = null;
  let peerRefreshTimer = null;
  let selectedTarget = 'mixed';
  const listeners = new Set();

  function notify() {
    const status = getModelStatus();
    for (const listener of listeners) {
      try {
        listener(status);
      } catch (err) {
        console.warn('[PeerComputeAiBridge] listener error:', err);
      }
    }
  }

  async function initCapabilities() {
    try {
      capabilities = await probeCapabilities({ runMicrobench: false });
    } catch (err) {
      capabilities = {
        tier: 'unknown',
        cpu: { logicalCores: navigator.hardwareConcurrency || 0 },
        gpu: { available: false, webgpu: false },
        error: String(err?.message || err)
      };
    }
    onCapabilitiesReady?.(capabilities);
    notify();
    return capabilities;
  }

  function listReadyTextTargets() {
    if (!runtime?.listInferenceTargets) return [];
    const targets = runtime.listInferenceTargets();
    const netConnected = Boolean(runtime.networkReady || runtime.getDiscoveryStatus?.()?.connected);
    return targets.filter((t) => {
      if (!t?.available) return false;
      const task = t.task || 'text-generation';
      const isText = task === 'text-generation' || task === 'image-text-to-text';
      return isText && (t.local || netConnected);
    });
  }

  function getModelStatus() {
    const readyTargets = listReadyTextTargets();
    const localTargets = readyTargets.filter((t) => t.local);
    const peerTargets = readyTargets.filter((t) => !t.local);
    const discovery = runtime?.getDiscoveryStatus?.() || {
      connected: Boolean(runtime?.networkReady),
      peerCount: 0,
      hostedModelCount: 0
    };
    const explicit = readyTargets.find((t) => t.key === selectedTarget);
    const primary = explicit
      || (selectedTarget === 'peers' ? peerTargets[0] : null)
      || (selectedTarget === 'local-only' ? localTargets[0] : null)
      || localTargets[0]
      || peerTargets[0]
      || null;
    return {
      runtimeLoaded: Boolean(runtime),
      modalOpen: Boolean(modalHost),
      networkConnected: Boolean(discovery.connected || runtime?.networkReady),
      peerConnecting,
      peerError,
      peerCount: Number(discovery.peerCount || 0),
      hostedModelCount: Number(discovery.hostedModelCount || peerTargets.length),
      selectedTarget,
      targets: readyTargets.map((t) => ({
        key: t.key,
        name: t.name,
        local: Boolean(t.local),
        busy: Boolean(t.busy)
      })),
      hasReadyModel: Boolean(primary),
      readyCount: readyTargets.length,
      activeLabel: primary ? `${primary.local ? 'Local' : 'Peer'} · ${primary.name}` : null,
      capabilities
    };
  }

  function startPeerPolling() {
    if (peerRefreshTimer || disposed) return;
    peerRefreshTimer = window.setInterval(() => {
      if (disposed || !runtime) return;
      if (runtime.networkReady || runtime.getDiscoveryStatus?.()?.connected) {
        void runtime.refreshPeers?.().then(() => notify()).catch(() => {});
      }
    }, 5000);
  }

  async function connectPeerNetwork() {
    if (disposed) return getModelStatus();
    if (peerConnectPromise) return peerConnectPromise;
    peerConnecting = true;
    peerError = null;
    notify();
    peerConnectPromise = (async () => {
      try {
        const activeRuntime = await ensureRuntime();
        if (disposed) return getModelStatus();
        if (!activeRuntime.networkReady && !activeRuntime.getDiscoveryStatus?.()?.connected) {
          await activeRuntime.connectBackend();
        }
        await activeRuntime.refreshPeers?.().catch(() => {});
        startPeerPolling();
        notify();
        // Fast follow-up discovery probes so newly-connected tabs pick up
        // advertised peer models within ~1.5-3.5s instead of waiting a full 5s tick.
        for (const delayMs of [1500, 3500]) {
          window.setTimeout(() => {
            if (disposed || !runtime || listReadyTextTargets().length > 0) return;
            void runtime.refreshPeers?.().then(() => notify()).catch(() => {});
          }, delayMs);
        }
        return getModelStatus();
      } catch (err) {
        peerError = String(err?.message || err);
        notify();
        return getModelStatus();
      } finally {
        peerConnecting = false;
        peerConnectPromise = null;
        notify();
      }
    })();
    return peerConnectPromise;
  }

  async function refreshPeersNow() {
    if (!runtime) return getModelStatus();
    await runtime.refreshPeers?.().catch(() => {});
    notify();
    return getModelStatus();
  }

  function setSelectedTarget(nextTarget) {
    selectedTarget = String(nextTarget || 'mixed');
    notify();
  }

  async function ensureRuntime() {
    if (runtime) return runtime;
    if (runtimeBootPromise) return runtimeBootPromise;
    runtimeBootPromise = (async () => {
      const { createInferenceRuntime } = await import('@peercompute-inference/runtime.js');
      const created = await createInferenceRuntime({
        storeName: 'vibeslopdb-models',
        residentModelSlots: 2,
        telemetryApplication: 'vibeslopdb'
      });
      if (disposed) {
        await created.dispose();
        throw new Error('Bridge disposed');
      }
      runtime = created;
      runtime.subscribeResidentModels?.(() => notify());
      notify();
      return runtime;
    })().finally(() => {
      runtimeBootPromise = null;
    });
    return runtimeBootPromise;
  }

  function buildDemoActions() {
    return createDemoAgentActions([
      {
        name: 'runSql',
        description: 'Execute SQL statements directly against the active VibeSlopDB database',
        validate: (args) => typeof args?.sql === 'string' && args.sql.trim().length > 0 && args.sql.length <= 2000,
        apply: async (args) => {
          const res = await sessionManager.executeSql(args.sql, { actor: 'PC-AGENT' });
          return res.ok ? `Executed (${res.durationMs}ms)` : `SQL error: ${res.error}`;
        }
      }
    ]);
  }

  async function closeModelsModal() {
    if (closingModal) return closingModal;
    closingModal = (async () => {
      if (openingModal) await openingModal.catch(() => {});
      const activePanel = panel;
      panel = null;
      if (activePanel) {
        await activePanel.dispose().catch((err) => {
          console.warn('[PeerComputeAiBridge] panel dispose warning:', err);
        });
      }
      if (modalHost?.tagName === 'DIALOG' && modalHost.open) modalHost.close();
      modalHost?.remove();
      modalHost = null;
      notify();
    })().finally(() => {
      closingModal = null;
    });
    return closingModal;
  }

  async function openModelsModal({ managementOnly = managementOnlyMode } = {}) {
    if (disposed) return null;
    if (modalHost && managementOnly === managementOnlyMode) return panel;
    if (modalHost && managementOnly !== managementOnlyMode) {
      await closeModelsModal();
    }
    if (openingModal) return openingModal;
    managementOnlyMode = managementOnly;

    openingModal = (async () => {
      // Follow CubeChat's exact `panelOwnsWindow` pattern:
      // In `managementOnly: true` mode, PeerCompute's `mountInferencePanel` owns
      // its own native top-layer `<dialog>` (with its own Done button wired to
      // `onRequestClose`). Mounting inside a clean `<div>` host prevents nested
      // `<dialog>` stacking conflicts!
      const hostEl = document.createElement(managementOnly ? 'div' : 'dialog');
      hostEl.className = managementOnly ? 'vs-models-host' : 'vs-models-dialog';
      hostEl.setAttribute('aria-label', 'PeerCompute Models & Inference');

      let body = hostEl;
      let bootBanner = null;

      if (managementOnly) {
        bootBanner = document.createElement('div');
        bootBanner.className = 'vs-models-booting';
        bootBanner.innerHTML = '<span>Initializing PeerCompute Model Library &amp; Peer Network…</span>';
        const cancelBootBtn = document.createElement('button');
        cancelBootBtn.type = 'button';
        cancelBootBtn.className = 'vs-btn vs-btn-warn';
        cancelBootBtn.textContent = 'Cancel';
        cancelBootBtn.addEventListener('click', () => {
          void closeModelsModal();
        });
        bootBanner.append(cancelBootBtn);
        hostEl.append(bootBanner);
        body = document.createElement('div');
        body.className = 'vs-models-panel-slot';
        hostEl.append(body);
        document.body.append(hostEl);
      } else {
        const inner = document.createElement('div');
        inner.className = 'vs-models-dialog-inner';
        const header = document.createElement('header');
        header.className = 'vs-models-dialog-header';
        const title = document.createElement('h2');
        title.className = 'vs-models-dialog-title';
        title.textContent = 'PEERCOMPUTE // FULL INFERENCE CONSOLE';
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'vs-btn vs-btn-warn';
        closeBtn.textContent = 'Done / Return to DB';
        closeBtn.addEventListener('click', () => {
          void closeModelsModal();
        });
        header.append(title, closeBtn);
        body = document.createElement('div');
        body.className = 'vs-models-dialog-body';
        body.innerHTML = '<div class="vs-empty-note">Initializing PeerCompute inference runtime…</div>';
        inner.append(header, body);
        hostEl.append(inner);
        hostEl.addEventListener('cancel', (event) => {
          event.preventDefault();
          void closeModelsModal();
        });
        document.body.append(hostEl);
        hostEl.showModal();
      }

      modalHost = hostEl;
      notify();

      try {
        const activeRuntime = await ensureRuntime();
        if (disposed || modalHost !== hostEl) return null;
        // CubeChat pattern: borrow the persistent runtime via Proxy so closing
        // the Models modal tears down only the UI panel while keeping loaded LLMs resident!
        const borrowedRuntime = new Proxy(activeRuntime, {
          get(target, key) {
            if (key === 'dispose') return async () => {};
            const value = Reflect.get(target, key);
            return typeof value === 'function' ? value.bind(target) : value;
          }
        });

        body.replaceChildren();
        const { mountInferencePanel } = await import('@peercompute-inference/agentPanel.js');
        if (disposed || modalHost !== hostEl) return null;

        panel = await mountInferencePanel({
          container: body,
          runtimeFactory: async () => borrowedRuntime,
          managementOnly,
          autoConnect: false,
          getContext: () => ({
            app: 'VibeSlopDB',
            engine: sessionManager.getState().engineId,
            dialect: sessionManager.getState().dialect,
            schema: buildSchemaContextSummary(
              sessionManager.getState().schema,
              sessionManager.getState().carnageLog
            ).slice(0, 3500)
          }),
          actions: buildDemoActions(),
          onRequestClose: () => {
            void closeModelsModal();
          },
          onClose: () => {
            panel = null;
            if (modalHost === hostEl) {
              if (hostEl.tagName === 'DIALOG' && hostEl.open) hostEl.close();
              hostEl.remove();
              modalHost = null;
            }
            notify();
          }
        });
        await panel.startupReady?.catch?.(() => {});
        bootBanner?.remove();
        notify();
        return panel;
      } catch (error) {
        bootBanner?.remove();
        body.innerHTML = `<pre class="vs-error-box">PeerCompute Model Panel failed to initialize:\n${String(error?.message || error)}</pre>`;
        return null;
      }
    })().finally(() => {
      openingModal = null;
    });

    return openingModal;
  }

  /**
   * Sends a user command to a loaded PeerCompute local/peer LLM if available,
   * or falls back cleanly and explicitly to the local Chaos Gremlin SQL generator.
   */
  async function askYoloDba({
    userPrompt,
    history = [],
    schema,
    recentLog = [],
    yoloMode = true,
    signal,
    onToken
  }) {
    // If peer connection is currently in progress (e.g. user sent a prompt right after
    // opening ?peers=1 or clicking Connect Peers), wait for it instead of silently
    // falling back to Chaos Gremlin!
    if (peerConnectPromise) {
      onToken?.('Connecting to PeerCompute network & discovering peer models…');
      await peerConnectPromise.catch(() => {});
      signal?.throwIfAborted?.();
    }

    // If connected to the PeerCompute network, refresh peers on demand when no target is cached yet.
    const isNetConnected = Boolean(runtime && (runtime.networkReady || runtime.getDiscoveryStatus?.()?.connected));
    if (isNetConnected && listReadyTextTargets().length === 0) {
      onToken?.('Checking PeerCompute peers for hosted models…');
      for (let attempt = 0; attempt < 3 && listReadyTextTargets().length === 0; attempt += 1) {
        await runtime.refreshPeers?.({ signal }).catch(() => {});
        notify();
        if (listReadyTextTargets().length > 0) break;
        if (attempt < 2) {
          await new Promise((resolve) => {
            const t = window.setTimeout(resolve, 1200);
            signal?.addEventListener('abort', () => { clearTimeout(t); resolve(); }, { once: true });
          });
          signal?.throwIfAborted?.();
        }
      }
    }

    const readyTargets = listReadyTextTargets();
    const targetKey = selectedTarget || 'mixed';
    const hasMatchingTarget = readyTargets.some((t) => {
      if (targetKey === 'mixed') return true;
      if (targetKey === 'peers') return !t.local;
      if (targetKey === 'local-only') return Boolean(t.local);
      return t.key === targetKey;
    });

    if (runtime && hasMatchingTarget) {
      onToken?.('');
      const dialect = schema?.dialect || 'sqlite';
      const schemaSummary = buildSchemaContextSummary(schema, recentLog);
      const systemPrompt = buildYoloDbaSystemPrompt({
        schemaSummary,
        dialect,
        yoloMode
      });
      const primedUserContent = buildPrimedUserMessage({
        userPrompt,
        schemaSummary,
        schema,
        dialect
      });
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-3).map((m) => ({ role: m.role, content: String(m.content || '').slice(0, 600) })),
        { role: 'user', content: primedUserContent }
      ];

      const runTurn = async (turnTarget, turnMessages, prefixText = '') => {
        let turnStreamed = '';
        const turnResult = await runtime.generate(turnTarget, {
          messages: turnMessages,
          maxNewTokens: MAX_NEW_TOKENS_PER_TURN,
          signal,
          onToken: (chunk) => {
            if (typeof chunk === 'string' && chunk.length > 0) {
              turnStreamed += chunk;
              onToken?.(prefixText ? stitchContinuation(prefixText, turnStreamed) : turnStreamed);
            }
          },
          onProgress: (ev) => {
            if (typeof ev?.text === 'string' && ev.text.length > turnStreamed.length) {
              turnStreamed = ev.text;
              onToken?.(prefixText ? stitchContinuation(prefixText, turnStreamed) : turnStreamed);
            } else if (typeof ev?.token === 'string') {
              turnStreamed += ev.token;
              onToken?.(prefixText ? stitchContinuation(prefixText, turnStreamed) : turnStreamed);
            } else if (typeof ev?.delta === 'string') {
              turnStreamed += ev.delta;
              onToken?.(prefixText ? stitchContinuation(prefixText, turnStreamed) : turnStreamed);
            }
          }
        });
        return {
          result: turnResult,
          text: String(turnResult?.text || turnStreamed || '')
        };
      };

      const firstTurn = await runTurn(targetKey, messages, '');
      const result = firstTurn.result;
      let accumulatedText = firstTurn.text;
      let lastFinishReason = result?.finishReason || '';
      let continuationCount = 0;

      const matched = readyTargets.find((t) => t.key === targetKey)
        || (targetKey === 'peers' ? readyTargets.find((t) => !t.local) : readyTargets.find((t) => t.local))
        || readyTargets[0];
      const pinnedTargetKey = result?.route?.targetKey || matched?.key || targetKey;

      // Seamlessly auto-continue whenever the model hits PeerCompute's 1024-token turn cap
      // mid-SQL so large schema/seed scripts complete cleanly without `incomplete input`!
      for (let round = 1; round <= MAX_CONTINUATION_ROUNDS; round += 1) {
        if (!isTruncatedSqlOutput(accumulatedText, lastFinishReason)) break;
        signal?.throwIfAborted?.();
        onToken?.(`${accumulatedText}\n-- [auto-continuing long SQL reply (${round}/${MAX_CONTINUATION_ROUNDS})…]`);
        const contMessages = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: primedUserContent },
          { role: 'assistant', content: buildContinuationAssistantContext(accumulatedText) },
          {
            role: 'user',
            content: 'Continue EXACTLY where you stopped to finish the incomplete SQL statement(s) and close the ```sql code block. Do not repeat earlier statements or rows.'
          }
        ];
        try {
          const nextTurn = await runTurn(pinnedTargetKey, contMessages, accumulatedText);
          if (!nextTurn.text.trim()) break;
          accumulatedText = stitchContinuation(accumulatedText, nextTurn.text);
          lastFinishReason = nextTurn.result?.finishReason || '';
          continuationCount += 1;
          onToken?.(accumulatedText);
        } catch (contErr) {
          if (contErr?.name === 'AbortError') throw contErr;
          console.warn('[PeerComputeAiBridge] Auto-continuation stopped:', contErr);
          break;
        }
      }

      const finalText = accumulatedText.trim();
      const extracted = extractSqlFromModelOutputDetailed(finalText);
      const viaPeer = Boolean(result?.route?.peerId || (matched && !matched.local));
      const baseName = result?.modelName || matched?.name || 'PeerCompute LLM';
      return {
        usedFallback: false,
        modelLabel: `${viaPeer ? 'Peer' : 'Local'} · ${baseName}`,
        route: result?.route || null,
        primedSchemaSummary: schemaSummary,
        text: finalText,
        sqlStatements: extracted.statements,
        continuationCount,
        salvagedCount: extracted.salvagedCount,
        droppedIncomplete: extracted.droppedIncomplete,
        finishReason: lastFinishReason
      };
    }

    // Honest, clearly labeled fallback when no local/peer LLM is loaded yet!
    const chaos = generateChaosFallbackSql(userPrompt, schema);
    const fenced = chaos.sql.length
      ? `${chaos.reply}\n\n\`\`\`sql\n${chaos.sql.join('\n')}\n\`\`\``
      : chaos.reply;
    onToken?.(fenced);
    return {
      usedFallback: true,
      modelLabel: 'Chaos Gremlin (Local Heuristic Fallback)',
      route: null,
      text: fenced,
      sqlStatements: chaos.sql
    };
  }

  return {
    initCapabilities,
    getRuntime: () => runtime,
    getCapabilities: () => capabilities,
    getModelStatus,
    connectPeerNetwork,
    refreshPeersNow,
    setSelectedTarget,
    openModelsModal,
    closeModelsModal,
    askYoloDba,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    async dispose() {
      disposed = true;
      if (peerRefreshTimer) {
        clearInterval(peerRefreshTimer);
        peerRefreshTimer = null;
      }
      listeners.clear();
      await closeModelsModal();
      if (runtime) {
        await runtime.dispose().catch(() => {});
        runtime = null;
      }
    }
  };
}
