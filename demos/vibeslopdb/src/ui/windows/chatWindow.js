import { CHAOS_PROMPT_PRESETS } from '../../ai/sqlExtractor.js';

/**
 * Primary YOLO DBA Chat ExoWebTUI window:
 *  - Wired directly to the CubeChat -> Inference style PeerCompute bridge
 *  - Shows honest live model status (Local/Peer LLM vs No-Model Chaos Gremlin Fallback)
 *  - One-click [Models] opens PeerCompute's modal model loader & peer network manager
 *  - YOLO Auto-Exec toggle immediately fires extracted SQL at the active database
 */
export function createChatWindow({
  container,
  sessionManager,
  aiBridge,
  initialYoloMode = true,
  onYoloChange,
  onOpenModels,
  onSendToQuery,
  onShowQueryResult
} = {}) {
  const root = document.createElement('div');
  root.className = 'vs-chat-win';

  const topbar = document.createElement('div');
  topbar.className = 'vs-chat-topbar';

  const routeBadge = document.createElement('span');
  routeBadge.className = 'vs-route-badge is-fallback';
  routeBadge.textContent = 'FALLBACK: Chaos Gremlin';

  const targetSelect = document.createElement('select');
  targetSelect.className = 'vs-select';
  targetSelect.setAttribute('aria-label', 'Inference Target');
  targetSelect.innerHTML = `
    <option value="mixed">Auto (Mixed)</option>
    <option value="peers">Peers Only</option>
    <option value="local-only">Local Only</option>
  `;

  const peersBtn = document.createElement('button');
  peersBtn.type = 'button';
  peersBtn.className = 'vs-btn';
  peersBtn.textContent = '🌐 Peers';
  peersBtn.title = 'Connect to PeerCompute network to discover peer-hosted LLMs';

  const yoloLabel = document.createElement('label');
  yoloLabel.className = 'vs-check-label';
  yoloLabel.title = 'When enabled, extracted SQL executes immediately against the live database';
  const yoloCheck = document.createElement('input');
  yoloCheck.type = 'checkbox';
  yoloCheck.checked = Boolean(initialYoloMode);
  yoloCheck.addEventListener('change', () => onYoloChange?.(yoloCheck.checked));
  yoloLabel.append(yoloCheck, document.createTextNode(' YOLO'));

  const modelsBtn = document.createElement('button');
  modelsBtn.type = 'button';
  modelsBtn.className = 'vs-btn vs-btn-accent';
  modelsBtn.textContent = '⚙ Models';
  modelsBtn.title = 'Open PeerCompute CubeChat-style Model Loader & Peer Network modal';

  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'vs-btn';
  clearBtn.textContent = 'Clear';

  topbar.append(routeBadge, targetSelect, peersBtn, yoloLabel, modelsBtn, clearBtn);

  const presetsBar = document.createElement('div');
  presetsBar.className = 'vs-presets-bar';
  for (const preset of CHAOS_PROMPT_PRESETS) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'vs-chip';
    chip.textContent = preset.label;
    chip.title = preset.prompt;
    chip.dataset.presetId = preset.id;
    chip.addEventListener('click', () => {
      void sendPrompt(preset.prompt);
    });
    presetsBar.append(chip);
  }

  const transcript = document.createElement('div');
  transcript.className = 'vs-chat-transcript';
  transcript.setAttribute('role', 'log');
  transcript.setAttribute('aria-live', 'polite');

  const composer = document.createElement('form');
  composer.className = 'vs-chat-composer';

  const input = document.createElement('textarea');
  input.className = 'vs-chat-input';
  input.rows = 2;
  input.placeholder = 'Tell the YOLO DBA what to do to prod… (or paste raw SQL; Enter to send)';
  input.setAttribute('aria-label', 'Command for YOLO DBA');

  const actions = document.createElement('div');
  actions.className = 'vs-chat-actions';

  const sendBtn = document.createElement('button');
  sendBtn.type = 'button';
  sendBtn.type = 'submit';
  sendBtn.className = 'vs-btn vs-btn-accent';
  sendBtn.textContent = 'Send ↵';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'vs-btn vs-btn-danger';
  cancelBtn.textContent = 'Stop';
  cancelBtn.hidden = true;

  actions.append(sendBtn, cancelBtn);
  composer.append(input, actions);

  root.append(topbar, presetsBar, transcript, composer);
  container.append(root);

  const history = [];
  let activeAbort = null;
  let busy = false;

  function appendSystemNote(text) {
    const el = document.createElement('div');
    el.className = 'vs-msg vs-msg-system';
    el.textContent = text;
    transcript.append(el);
    scrollBottom();
    return el;
  }

  function appendUserMsg(text) {
    const el = document.createElement('article');
    el.className = 'vs-msg vs-msg-user';
    const head = document.createElement('div');
    head.className = 'vs-msg-head';
    head.textContent = 'YOU';
    const body = document.createElement('div');
    body.className = 'vs-msg-body';
    body.textContent = text;
    el.append(head, body);
    transcript.append(el);
    scrollBottom();
    return el;
  }

  function createAssistantCard(sourceLabel) {
    const el = document.createElement('article');
    el.className = 'vs-msg vs-msg-assistant';
    const head = document.createElement('div');
    head.className = 'vs-msg-head';
    head.textContent = sourceLabel;
    const body = document.createElement('pre');
    body.className = 'vs-msg-body vs-msg-pre';
    body.textContent = '…';
    const sqlContainer = document.createElement('div');
    sqlContainer.className = 'vs-msg-sql-blocks';
    const receiptContainer = document.createElement('div');
    receiptContainer.className = 'vs-msg-receipts';
    el.append(head, body, sqlContainer, receiptContainer);
    transcript.append(el);
    scrollBottom();
    return { el, head, body, sqlContainer, receiptContainer };
  }

  function scrollBottom() {
    transcript.scrollTop = transcript.scrollHeight;
  }

  function refreshRouteBadge() {
    const info = aiBridge.getModelStatus();

    // Keep target dropdown synced with discovered PeerCompute local & peer models
    const desired = info.selectedTarget || 'mixed';
    const baseOpts = [
      { value: 'mixed', label: 'Auto (Mixed)' },
      { value: 'peers', label: 'Peers Only' },
      { value: 'local-only', label: 'Local Only' },
      ...(info.targets || []).map((t) => ({
        value: t.key,
        label: `${t.local ? 'Local' : 'Peer'} · ${t.name}${t.busy ? ' (busy)' : ''}`
      }))
    ];
    const sig = baseOpts.map((o) => `${o.value}:${o.label}`).join('|');
    if (targetSelect.dataset.sig !== sig) {
      targetSelect.dataset.sig = sig;
      targetSelect.replaceChildren();
      for (const optDef of baseOpts) {
        const opt = document.createElement('option');
        opt.value = optDef.value;
        opt.textContent = optDef.label;
        targetSelect.append(opt);
      }
    }
    targetSelect.value = baseOpts.some((o) => o.value === desired) ? desired : 'mixed';

    if (info.peerConnecting) {
      peersBtn.textContent = '🌐 Connecting…';
      peersBtn.disabled = true;
    } else if (info.networkConnected) {
      peersBtn.disabled = false;
      peersBtn.classList.add('is-active');
      peersBtn.textContent = `🌐 ${info.peerCount}p/${info.hostedModelCount}m`;
      peersBtn.title = `Connected to PeerCompute network (${info.peerCount} peers, ${info.hostedModelCount} hosted models). Click to refresh.`;
    } else {
      peersBtn.disabled = false;
      peersBtn.classList.remove('is-active');
      peersBtn.textContent = '🌐 Peers';
      peersBtn.title = info.peerError
        ? `PeerCompute network error: ${info.peerError}. Click to retry.`
        : 'Connect to PeerCompute network to discover peer-hosted LLMs';
    }

    if (info.hasReadyModel) {
      routeBadge.className = 'vs-route-badge is-live-llm';
      routeBadge.textContent = `LLM: ${info.activeLabel}`;
    } else if (info.peerError) {
      routeBadge.className = 'vs-route-badge is-fallback';
      routeBadge.textContent = `FALLBACK (net err: ${info.peerError.slice(0, 48)})`;
    } else if (info.networkConnected) {
      routeBadge.className = 'vs-route-badge is-fallback';
      routeBadge.textContent = `Peers online (${info.peerCount}) · waiting for model`;
    } else {
      routeBadge.className = 'vs-route-badge is-fallback';
      routeBadge.textContent = 'FALLBACK: Chaos Gremlin (🌐 Peers or ⚙ Models)';
    }
  }

  function setBusy(nextBusy) {
    busy = nextBusy;
    sendBtn.disabled = nextBusy;
    cancelBtn.hidden = !nextBusy;
    for (const chip of presetsBar.querySelectorAll('button')) {
      chip.disabled = nextBusy;
    }
  }

  async function executeExtractedSql(statements, receiptContainer, actor) {
    const joined = statements
      .map((s) => String(s || '').trim().replace(/;+$/, ''))
      .filter(Boolean)
      .join(';\n') + ';';
    const res = await sessionManager.executeSql(joined, { actor });
    const pill = document.createElement('div');
    pill.className = `vs-receipt ${res.ok ? 'is-ok' : 'is-err'}`;
    if (res.ok) {
      const diffParts = [];
      if (res.diff?.addedTables?.length) diffParts.push(`+${res.diff.addedTables.join(',')}`);
      if (res.diff?.alteredTables?.length) diffParts.push(`~${res.diff.alteredTables.join(',')}`);
      if (res.diff?.droppedTables?.length) diffParts.push(`-${res.diff.droppedTables.join(',')}`);
      const lastWithRows = [...(res.results || [])].reverse().find((r) => r.columns?.length);
      pill.textContent = `✓ EXECUTED ${res.results.length} stmt (${res.durationMs}ms)`
        + (lastWithRows ? ` · ${lastWithRows.rowCount} rows` : '')
        + (diffParts.length ? ` · ${diffParts.join(' ')}` : '');
      onShowQueryResult?.(res, joined);
    } else {
      pill.textContent = `✗ SQL ERROR: ${res.error}`;
      onShowQueryResult?.(res, joined);
    }
    receiptContainer.append(pill);
    scrollBottom();
    return res;
  }

  async function sendPrompt(promptText) {
    const clean = String(promptText ?? '').trim();
    if (!clean || busy) return;

    appendUserMsg(clean);
    history.push({ role: 'user', content: clean });
    if (history.length > 14) history.splice(0, history.length - 14);

    setBusy(true);
    activeAbort = new AbortController();
    const status = aiBridge.getModelStatus();
    const card = createAssistantCard(
      status.hasReadyModel ? `PEERCOMPUTE LLM · ${status.activeLabel}` : 'CHAOS GREMLIN (LOCAL HEURISTIC FALLBACK)'
    );

    try {
      const state = sessionManager.getState();
      const response = await aiBridge.askYoloDba({
        userPrompt: clean,
        history: history.slice(0, -1),
        schema: state.schema,
        recentLog: state.carnageLog,
        yoloMode: yoloCheck.checked,
        signal: activeAbort.signal,
        onToken: (fullText) => {
          card.body.textContent = fullText;
          scrollBottom();
        }
      });

      card.head.textContent = response.usedFallback
        ? 'CHAOS GREMLIN (LOCAL HEURISTIC FALLBACK — NOT A MODEL)'
        : `PEERCOMPUTE LLM · ${response.modelLabel || 'Loaded Model'}`
          + (response.continuationCount > 0 ? ` · extended +${response.continuationCount}` : '');
      card.body.textContent = response.text || '(empty response)';

      if (response.salvagedCount > 0 || response.droppedIncomplete > 0) {
        const warn = document.createElement('div');
        warn.className = 'vs-receipt';
        const parts = [];
        if (response.salvagedCount > 0) parts.push(`salvaged completed rows from ${response.salvagedCount} truncated INSERT`);
        if (response.droppedIncomplete > 0) parts.push(`skipped ${response.droppedIncomplete} incomplete trailing fragment`);
        warn.textContent = `⚠ Reply hit max length: ${parts.join('; ')}.`;
        card.receiptContainer.append(warn);
      }

      if (response.primedSchemaSummary) {
        const details = document.createElement('details');
        details.className = 'vs-primed-schema';
        const summary = document.createElement('summary');
        const tblCount = state.schema?.tables?.length ?? 0;
        summary.textContent = `Primed with live ${state.dialect} schema (${tblCount} table${tblCount === 1 ? '' : 's'})`;
        const pre = document.createElement('pre');
        pre.textContent = response.primedSchemaSummary;
        details.append(summary, pre);
        card.head.after(details);
      }

      history.push({ role: 'assistant', content: response.text });

      if (response.sqlStatements.length > 0) {
        const sqlText = response.sqlStatements.map((s) => (s.endsWith(';') ? s : `${s};`)).join('\n');
        const block = document.createElement('div');
        block.className = 'vs-sql-proposal';

        const pre = document.createElement('pre');
        pre.textContent = sqlText;

        const bar = document.createElement('div');
        bar.className = 'vs-sql-proposal-bar';

        const runNowBtn = document.createElement('button');
        runNowBtn.type = 'button';
        runNowBtn.className = 'vs-btn vs-btn-xs vs-btn-accent';
        runNowBtn.textContent = '▶ Run SQL';
        runNowBtn.addEventListener('click', () => {
          void executeExtractedSql(
            response.sqlStatements,
            card.receiptContainer,
            response.usedFallback ? 'CHAOS-BOT' : 'YOLO-LLM'
          );
        });

        const openQueryBtn = document.createElement('button');
        openQueryBtn.type = 'button';
        openQueryBtn.className = 'vs-btn vs-btn-xs';
        openQueryBtn.textContent = '→ Query Win';
        openQueryBtn.addEventListener('click', () => {
          onSendToQuery?.(sqlText);
        });

        bar.append(runNowBtn, openQueryBtn);
        block.append(pre, bar);
        card.sqlContainer.append(block);

        if (yoloCheck.checked) {
          await executeExtractedSql(
            response.sqlStatements,
            card.receiptContainer,
            response.usedFallback ? 'CHAOS-BOT' : 'YOLO-LLM'
          );
        }
      } else {
        const note = document.createElement('div');
        note.className = 'vs-receipt';
        note.textContent = 'No executable SQL block extracted from response.';
        card.receiptContainer.append(note);
      }
    } catch (error) {
      card.body.textContent = error?.name === 'AbortError'
        ? 'Cancelled.'
        : `Error: ${error?.message || error}`;
    } finally {
      activeAbort = null;
      setBusy(false);
      refreshRouteBadge();
      scrollBottom();
    }
  }

  composer.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = input.value;
    if (!text.trim()) return;
    input.value = '';
    void sendPrompt(text);
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      const text = input.value;
      if (!text.trim()) return;
      input.value = '';
      void sendPrompt(text);
    }
  });

  cancelBtn.addEventListener('click', () => {
    activeAbort?.abort();
  });

  targetSelect.addEventListener('change', () => {
    aiBridge.setSelectedTarget(targetSelect.value);
  });

  peersBtn.addEventListener('click', () => {
    const info = aiBridge.getModelStatus();
    if (info.networkConnected) {
      void aiBridge.refreshPeersNow();
    } else {
      void aiBridge.connectPeerNetwork();
    }
  });

  modelsBtn.addEventListener('click', () => {
    onOpenModels?.();
  });

  clearBtn.addEventListener('click', () => {
    history.length = 0;
    transcript.replaceChildren();
    appendSystemNote('Transcript cleared. Database state untouched.');
  });

  const unsubBridge = aiBridge.subscribe(() => {
    refreshRouteBadge();
  });

  appendSystemNote(
    'Welcome to VibeSlopDB! Click [⚙ Models] to load a local WebGPU LLM or connect PeerCompute peers — or fire Chaos Presets immediately using the labeled Chaos Gremlin fallback.'
  );
  refreshRouteBadge();

  return {
    element: root,
    sendPrompt,
    setYoloMode(enabled) {
      yoloCheck.checked = Boolean(enabled);
    },
    isYoloMode: () => yoloCheck.checked,
    refreshRouteBadge,
    dispose() {
      activeAbort?.abort();
      unsubBridge?.();
      root.remove();
    }
  };
}
