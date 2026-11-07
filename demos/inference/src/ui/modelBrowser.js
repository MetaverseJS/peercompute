import './modelBrowser.css';
import { blocksLocal, compatibilityFor, filterBrowserModels, knownBytes, matchingPeerTargets,
  modelBytes, modelPrecision, modelTask, needsInspection, repositoryQuery, safeModelUrl } from './modelBrowserData.js';
import { createConversionDiscovery } from './modelBrowserConversions.js';

const node = (tag, text, className) => {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = String(text);
  if (className) element.className = className;
  return element;
};
const button = (text) => { const element = node('button', text); element.type = 'button'; return element; };
const originLabel = (source) => ({ stored: 'Stored on this device', peers: 'Peer files', hub: 'Hugging Face search', catalog: 'Catalog' })[source.browserOrigin]
  ?? (source.source === 'stored' ? 'Stored on this device' : source.source === 'peers' ? 'Peer files' : 'Catalog');
const badge = (source) => needsInspection(source) ? 'Needs inspection'
  : source.loadable === false && !source.inferenceOnly ? 'Unsupported'
  : source.browserOrigin === 'hub' || source.inferenceOnly || ['stored', 'peers'].includes(source.source) ? 'Candidate' : 'Catalog';
const message = (error) => String(error?.message ?? error ?? 'Request failed').slice(0, 1000);

/** Metadata-only model browsing. The owner handles every explicit load and its cancellation. */
export function createModelBrowser({ container, getSources = () => [], getTargets = () => [],
  searchModels, inspectModel, findConversions, getCompatibility, onLoad, onUsePeer, onSetup } = {}) {
  if (!container?.append) throw new TypeError('A model browser container is required');
  const element = node('dialog', undefined, 'pc-model-browser');
  element.id = `model-browser-dialog-${crypto.randomUUID()}`;
  const title = node('h2', 'Browse models'); title.id = `model-browser-${crypto.randomUUID()}`;
  element.setAttribute('aria-labelledby', title.id);
  const header = node('div', undefined, 'pc-browser-header'), done = button('Done'); header.append(title, done);
  const controls = node('div', undefined, 'pc-browser-controls');
  const searchLabel = node('label', 'Search names, descriptions or a Hugging Face URL', 'pc-browser-search');
  const search = node('input'); search.type = 'search'; search.maxLength = 256; search.autofocus = true;
  search.placeholder = 'Name, description or huggingface.co/owner/model'; search.setAttribute('aria-label', 'Search models');
  searchLabel.append(search); controls.append(searchLabel);
  const filterGroup = node('details', undefined, 'pc-browser-filters');
  const filterSummary = node('summary', 'Filters and sorting');
  const filterFields = node('div', undefined, 'pc-browser-filter-fields'); filterGroup.append(filterSummary, filterFields); controls.append(filterGroup);
  const mobile = matchMedia('(max-width:650px)');
  const resizeFilters = () => { filterGroup.open = !mobile.matches; };
  resizeFilters(); mobile.addEventListener('change', resizeFilters);
  const selects = {};
  function select(name, label, options) {
    const input = node('select'); input.setAttribute('aria-label', label);
    const wrapper = node('label', label);
    for (const [value, text] of options) { const option = node('option', text); option.value = value; input.append(option); }
    wrapper.append(input); filterFields.append(wrapper); selects[name] = input;
    return input;
  }
  select('source', 'Source', [['all', 'All sources'], ['catalog', 'Catalog'], ['stored', 'Stored on this device'], ['peers', 'Peer files'], ['hub', 'Hugging Face search']]);
  select('task', 'Task', [['all', 'All tasks'], ['text-generation', 'Text and code'], ['image-text-to-text', 'Image understanding'], ['text-to-image', 'Image generation'], ['automatic-speech-recognition', 'Speech recognition'], ['text-to-speech', 'Speech synthesis']]);
  select('size', 'Package size', [['all', 'Any size'], [String(500 * 1024 ** 2), 'Up to 500 MiB'], [String(1024 ** 3), 'Up to 1 GiB'],
    [String(4 * 1024 ** 3), 'Up to 4 GiB'], [String(8 * 1024 ** 3), 'Up to 8 GiB'], ['large', '8 GiB and larger'], ['unknown', 'Unknown size']]);
  select('precision', 'Precision', [['all', 'All precisions']]);
  select('compatibility', 'Compatibility', [['all', 'All models'], ['eligible', 'Usable locally or via peers'], ['setup', 'Needs local setup / unsupported']]);
  select('sort', 'Sort models', [['smallest', 'Package size: smallest first'], ['largest', 'Package size: largest first'], ['name', 'Name']]);
  const summary = node('p', '', 'pc-browser-summary');
  const status = node('p', '', 'pc-browser-status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
  const content = node('div', undefined, 'pc-browser-content');
  const results = node('ul', undefined, 'pc-browser-results'); results.setAttribute('aria-label', 'Model results');
  const details = node('section', undefined, 'pc-browser-details'); details.setAttribute('aria-label', 'Model details');
  content.append(results, details);
  const more = button('More Hugging Face results'); more.className = 'pc-browser-more'; more.hidden = true;
  element.append(header, controls, summary, status, content, more); container.append(element);

  let disposed = false, busy = false, actionPending = false, desiredKey = null, visibleKey = null;
  let searchTimer, searchController, inspectController, searchSequence = 0, inspectSequence = 0;
  let hubItems = [], nextCursor = null, searchWarning = '', searchPending = false, inspecting = null;
  let searchIncomplete = false, resumeAppend = false;
  let inspectionError = '', callbackError = '', returnFocus, detailSignature, precisionSignature;
  let stickySelectionKey = null;
  const inspected = new Map(), variants = new Map();
  const conversions = createConversionDiscovery({ findConversions, onChange: () => render() });

  function sources() { return (getSources() ?? []).filter((source) => source && typeof source.key === 'string'); }
  function targets() { return (getTargets() ?? []).filter(Boolean); }
  function allRows() {
    const local = sources();
    const hosts = targets();
    for (const target of hosts) {
      if (target.local || target.available !== true || local.some((source) => matchingPeerTargets(source, [target]).length)) continue;
      local.push({ ...target, source: 'peers', inferenceOnly: true, loadable: false,
        manifestCid: target.manifestCid ?? target.key?.replace(/^peer:/, ''),
        reason: 'Files not advertised; use peer inference.' });
    }
    const remote = hubItems.map((item) => ({ ...item, key: item.browserKey ?? `hub:${item.repository}`, browserOrigin: 'hub', browserSummary: true }));
    for (const row of remote) {
      const detail = inspected.get(row.inspectReference ?? row.repository), variant = selectedVariant(detail);
      if (variant) {
        const alternatives = detail.variants.map((item) => variantSource(row, detail, item));
        Object.assign(row, variantSource(row, detail, variant), { browserVariants: alternatives });
      } else if (detail) {
        Object.assign(row, { browserSummary: false, loadable: false, revision: detail.revision,
          description: detail.description ?? row.description, license: detail.license,
          reason: 'No supported package variants were found in this repository.' });
      }
    }
    return [...local, ...remote].map((source) => ({ ...source, browserPeerAvailable: matchingPeerTargets(source, hosts).length > 0 }));
  }
  function selectedVariant(detail) {
    if (!detail?.variants?.length) return null;
    const sorted = [...detail.variants].sort((a, b) => (knownBytes(a.totalBytes) ? a.totalBytes : Infinity)
      - (knownBytes(b.totalBytes) ? b.totalBytes : Infinity) || String(a.name ?? a.key).localeCompare(String(b.name ?? b.key)));
    return sorted.find((variant) => (variant.key ?? variant.id) === variants.get(detail.browserReference ?? detail.repository)) ?? sorted[0];
  }
  function variantSource(row, detail, variant) {
    const entry = variant.package ?? {};
    return { ...entry, ...row, ...variant, key: row.key, browserOrigin: 'hub', browserSummary: false,
      name: variant.name ?? row.name ?? row.repository, repository: detail.repository, revision: detail.revision,
      description: detail.description ?? row.description, license: variant.license ?? detail.license ?? entry.license ?? row.license, package: variant.package,
      loadable: variant.loadable === true && Boolean(variant.package), model: variant.model ?? entry.model,
      task: variant.task ?? entry.model?.task, dtype: variant.dtype ?? entry.model?.dtype,
      localAvailability: variant.localAvailability ?? entry.localAvailability };
  }
  function filters() { return { query: search.value, ...Object.fromEntries(Object.entries(selects).map(([key, input]) => [key, input.value])) }; }
  function availability(source) { return compatibilityFor(source.package ?? source, getCompatibility); }
  function isLoadable(source) { return source && !source.browserSummary && source.loadable !== false
    && !source.requiresInspection && (source.browserOrigin !== 'hub' || Boolean(source.package)) && !blocksLocal(availability(source)); }
  function matchesSelectedPackage(source) {
    return filterBrowserModels([{ ...source, browserVariants: [] }], filters(), availability, { includeUninspected: true }).length > 0;
  }
  function conversionReference(source) {
    const repository = source?.repository ?? source?.model?.repository;
    const detail = inspected.get(source?.inspectReference ?? repository);
    return safeModelUrl(repository) && /^[a-f0-9]{40}$/i.test(detail?.revision ?? '')
      ? `${safeModelUrl(repository)}/tree/${detail.revision}` : null;
  }
  function updatePrecision(rows) {
    const selected = selects.precision.value;
    const values = new Set(rows.flatMap((row) => [row, ...(row.browserVariants ?? [])]).map(modelPrecision)
      .filter((value) => value && value !== 'unknown'));
    if (selected !== 'all') values.add(selected);
    const signature = [...values].sort().join('\n');
    if (signature === precisionSignature) return;
    precisionSignature = signature;
    const options = [node('option', 'All precisions')]; options[0].value = 'all';
    for (const value of [...values].sort()) { const option = node('option', value); option.value = value; options.push(option); }
    selects.precision.replaceChildren(...options); selects.precision.value = selected;
  }
  function render({ revealSelected = false } = {}) {
    if (disposed) return;
    const rows = allRows(); updatePrecision(rows);
    const matching = filterBrowserModels(rows, filters(), (source) => availability(source), { includeUninspected: true });
    const pending = matching.filter((source) => source.browserFilterPending);
    const filtered = [...matching.filter((source) => !source.browserFilterPending), ...pending];
    const hiddenSelection = stickySelectionKey === desiredKey && !filtered.some((source) => source.key === desiredKey)
      ? rows.find((source) => source.key === desiredKey) : null;
    visibleKey = hiddenSelection || filtered.some((source) => source.key === desiredKey) ? desiredKey : filtered[0]?.key ?? null;
    const focused = document.activeElement?.closest?.('[data-model-key]')?.dataset.modelKey;
    const scrollTop = results.scrollTop;
    results.replaceChildren();
    for (const source of filtered) {
      if (source === pending[0]) results.append(node('li', 'Needs inspection — package filters are not yet verified', 'pc-browser-candidates'));
      const item = node('li'), choice = button(''); choice.className = 'pc-browser-result'; choice.dataset.modelKey = source.key;
      choice.setAttribute('aria-pressed', String(source.key === visibleKey));
      choice.append(node('strong', source.name ?? source.repository ?? source.modelId),
        node('small', source.repository ?? source.model?.repository ?? source.modelId ?? ''),
        node('small', `${originLabel(source)} · ${modelBytes(source.totalBytes)}${knownBytes(source.totalBytes) ? ' package' : ''} · ${modelPrecision(source) || 'Precision unknown'}`),
        node('small', `${badge(source)} · ${source.browserSummary ? 'Inspect variants' : modelTask(source)}`));
      if (source.browserMatchingVariant) choice.append(node('small', `Matching variant: ${source.browserMatchingVariant}`));
      choice.disabled = busy || actionPending;
      choice.onclick = () => { desiredKey = source.key; stickySelectionKey = null; inspectionError = ''; callbackError = ''; render({ revealSelected: true });
        const reference = source.inspectReference ?? source.repository;
        if (source.browserOrigin === 'hub' && !inspected.has(reference)) void inspect(reference); };
      item.append(choice); results.append(item);
    }
    if (!filtered.length) results.append(node('li', 'No matching models. Clear a filter or try another search.', 'pc-browser-empty'));
    results.scrollTop = scrollTop;
    if (focused) [...results.querySelectorAll('[data-model-key]')].find((item) => item.dataset.modelKey === focused)?.focus({ preventScroll: true });
    summary.textContent = `${filtered.length} model${filtered.length === 1 ? '' : 's'}${pending.length ? ` · ${pending.length} need inspection` : ''} · Package bytes are download size, not RAM or GPU memory.`;
    const activeFilters = Object.entries(selects).filter(([key, input]) => key !== 'sort' && input.value !== 'all').length;
    filterSummary.textContent = `Filters and sorting${activeFilters ? ` (${activeFilters} active)` : ''}`;
    status.textContent = callbackError || inspectionError || (inspecting ? `Inspecting ${inspecting}…` : '')
      || (searchPending ? 'Searching Hugging Face metadata…' : searchWarning)
      || (!search.value.trim() && selects.source.value === 'all' ? 'Search by name or description, or choose Hugging Face search in Source to browse the Hub.' : '');
    more.hidden = !nextCursor; more.disabled = busy || actionPending || searchPending;
    for (const input of [search, ...Object.values(selects)]) input.disabled = busy || actionPending;
    renderDetails(hiddenSelection ? { ...hiddenSelection, browserHiddenByFilters: true } : filtered.find((source) => source.key === visibleKey));
    if (revealSelected && element.open) {
      const selected = results.querySelector('[aria-pressed="true"]');
      if (selected) {
        // Reveal only inside the results scroller; do not move the modal, page or focus.
        const row = selected.getBoundingClientRect(), list = results.getBoundingClientRect();
        if (row.top < list.top) results.scrollTop += row.top - list.top;
        else if (row.bottom > list.bottom) results.scrollTop += Math.min(row.top - list.top, row.bottom - list.bottom);
      }
    }
  }
  function renderDetails(source) {
    const repository = source?.repository ?? source?.model?.repository;
    const signature = JSON.stringify({ source, compatibility: source ? availability(source) : null,
      targets: source ? matchingPeerTargets(source, targets()) : [], conversions: conversions.get(conversionReference(source)),
      selectedMatches: source ? matchesSelectedPackage(source) : false, busy, actionPending, inspecting });
    if (signature === detailSignature) return;
    detailSignature = signature;
    const focusedControl = details.contains(document.activeElement) ? document.activeElement.dataset.browserControl : null;
    details.replaceChildren();
    if (!source) { details.append(node('p', 'Choose a model to see its package, compatibility and available peers.', 'pc-browser-note')); return; }
    const body = node('div'); details.append(body);
    body.append(node('span', badge(source), 'pc-browser-badge'), node('h3', source.name ?? source.repository));
    if (source.description) body.append(node('p', String(source.description).slice(0, 4000), 'pc-browser-note'));
    if (source.browserMatchingVariant) body.append(node('p', `Matching variant: ${source.browserMatchingVariant}. Your selected variant is unchanged; choose a matching package below.`, 'pc-browser-note'));
    if (source.browserFilterPending) body.append(node('p', 'Needs inspection: size, precision and compatibility filters cannot be confirmed until the package is inspected.', 'pc-browser-warning'));
    if (source.browserHiddenByFilters || !matchesSelectedPackage(source)) {
      body.append(node('p', 'The selected package does not match your current filters. Change the filters or choose a matching variant before loading.', 'pc-browser-warning'));
      const reveal = button('Show selected package'); reveal.disabled = busy || actionPending;
      reveal.title = 'Clear package filters and show this Hugging Face selection; keep the search text.';
      reveal.onclick = () => {
        if (busy || actionPending) return;
        for (const name of ['task', 'size', 'precision', 'compatibility']) selects[name].value = 'all';
        if (!['all', 'hub'].includes(selects.source.value)) selects.source.value = 'hub';
        render({ revealSelected: true });
      };
      body.append(reveal);
    }
    const reference = source.inspectReference ?? repository;
    const href = safeModelUrl(repository);
    if (href) { const link = node('a', repository); link.href = href; link.target = '_blank'; link.rel = 'noopener noreferrer'; body.append(link); }
    const detail = inspected.get(reference);
    if (source.browserConversion) renderLineage(body, source.browserConversion);
    if (source.browserOrigin === 'hub' && detail?.variants?.length) {
      const label = node('label', 'Package variant', 'pc-browser-variants'), input = node('select'); input.setAttribute('aria-label', 'Package variant');
      for (const variant of detail.variants) {
        const option = node('option', `${variant.name ?? variant.id ?? variant.key} · ${variant.dtype ?? 'Precision unknown'} · ${modelBytes(variant.totalBytes)}${variant.requiresInspection ? ' · Needs inspection' : variant.loadable === false ? ' · Unsupported' : ''}`);
        option.value = variant.key ?? variant.id; input.append(option);
      }
      input.value = selectedVariant(detail)?.key ?? selectedVariant(detail)?.id;
      input.disabled = busy || actionPending;
      input.onchange = () => {
        const key = input.value; variants.set(reference, key); render({ revealSelected: true });
        if (detail.variants.find((variant) => (variant.key ?? variant.id) === key)?.requiresInspection) void inspect(reference, key);
      };
      label.append(input); body.append(label);
    }
    const facts = node('dl', undefined, 'pc-browser-facts');
    const addFact = (name, value) => facts.append(node('dt', name), node('dd', value));
    addFact('Task', source.browserSummary && !source.task ? 'Inspect to determine' : modelTask(source));
    addFact('Package', modelBytes(source.totalBytes));
    addFact('Precision', modelPrecision(source) || 'Unknown');
    addFact('License', typeof source.license === 'string' ? source.license : source.license?.spdx ?? source.license?.join?.(', ') ?? 'Not supplied');
    addFact('Revision', source.revision ?? source.model?.revision ?? 'Not inspected');
    const compat = availability(source);
    addFact('Estimated RAM', modelBytes(compat.cpuBytes > 0 ? compat.cpuBytes : undefined));
    addFact('Estimated GPU memory', modelBytes(compat.gpuBytes > 0 ? compat.gpuBytes : undefined)); body.append(facts);
    if (typeof source.license?.notice === 'string') body.append(node('p', source.license.notice.slice(0, 1000), 'pc-browser-note'));
    body.append(node('p', source.browserSummary ? 'Search metadata is not a verified runnable package. Inspect its variants before loading.'
      : source.loadable === false ? source.reason || 'This package is not supported by the current runtimes.'
        : compat.reason || (compat.status === 'available' ? 'Required device features are available.' : 'Memory fit is unverified; this browser cannot report free GPU memory.'),
    blocksLocal(compat) || source.loadable === false ? 'pc-browser-warning' : 'pc-browser-note'));
    body.append(node('p', badge(source) === 'Catalog' ? 'Catalog provenance does not guarantee model quality or performance on this device.'
      : 'Candidate packages have not necessarily been tested on this device. Review the model card and license.', 'pc-browser-note'));
    if (detail && findConversions && conversionReference(source)) renderConversions(body, source, repository);
    const actions = node('div', undefined, 'pc-browser-actions');
    if (source.browserSummary || source.requiresInspection) {
      const inspectButton = button(source.requiresInspection ? 'Inspect selected variant' : 'Inspect variants');
      inspectButton.disabled = busy || actionPending || inspecting === reference || !inspectModel;
      inspectButton.onclick = () => { desiredKey = source.key;
        const variant = selectedVariant(detail); void inspect(reference, source.requiresInspection ? variant?.key ?? variant?.id : undefined);
      }; actions.append(inspectButton);
    }
    const load = button('Load'); load.disabled = busy || actionPending || !isLoadable(source) || !matchesSelectedPackage(source) || !onLoad;
    load.onclick = () => {
      const current = allRows().find((row) => row.key === source.key);
      if (busy || actionPending || !isLoadable(current) || !matchesSelectedPackage(current)) { render(); return; }
      void act(() => onLoad(current.package ?? current));
    }; actions.append(load);
    const providers = matchingPeerTargets(source, targets());
    for (const target of providers) {
      const use = button(`Use peer${target.busy ? ' (busy)' : ''}`); use.disabled = busy || actionPending || !onUsePeer;
      use.title = `${target.providerCount ?? 1} online provider${target.providerCount === 1 ? '' : 's'}; uses the peer without downloading model weights.`;
      use.onclick = () => {
        const current = matchingPeerTargets(source, targets()).find((item) => item.key === target.key);
        if (!busy && !actionPending && current) void act(() => onUsePeer(current.key)); else render();
      }; actions.append(use);
    }
    if (!source.browserSummary && blocksLocal(compat) && onSetup) {
      const setup = button('Setup help'); setup.disabled = busy || actionPending;
      setup.onclick = () => void act(() => onSetup(source.package ?? source)); actions.append(setup);
    }
    if (providers.length) body.append(node('p', 'Peer inference stays available even when this device cannot load the model. The selected peer receives your prompt.', 'pc-browser-note'));
    details.append(actions);
    if (focusedControl) {
      const replacement = [...details.querySelectorAll('[data-browser-control]')].find((item) => item.dataset.browserControl === focusedControl);
      if (replacement) replacement.focus({ preventScroll: true });
      else if (focusedControl === 'conversion-search') details.querySelector('[data-conversion-repository]')?.focus({ preventScroll: true });
    }
  }
  function renderLineage(body, lineage) {
    body.append(node('p', `Publisher-declared source: ${lineage.sourceRepository}. Relationship: ${lineage.relationship}. This does not prove equivalent weights or the same source revision.`, 'pc-browser-note'));
    const back = button('Back to source model'); back.disabled = busy || actionPending;
    back.onclick = () => {
      if (busy || actionPending || !allRows().some((row) => row.key === lineage.sourceKey)) return;
      desiredKey = lineage.sourceKey; stickySelectionKey = desiredKey; render({ revealSelected: true });
    };
    body.append(back);
  }
  function renderConversions(body, source, repository) {
    const reference = conversionReference(source), state = conversions.get(reference);
    const section = node('section', undefined, 'pc-browser-conversions');
    section.setAttribute('aria-label', 'Related browser packages');
    section.append(node('h4', 'Related browser packages'));
    const feedback = node('p', '', 'pc-browser-note'); feedback.setAttribute('role', 'status');
    feedback.textContent = state?.status === 'pending' ? 'Finding publisher-declared conversions…'
      : state?.status === 'error' ? `Conversion search unavailable: ${state.error}`
      : state?.status === 'cancelled' ? 'Conversion search cancelled. You can retry.'
      : state?.status === 'complete' ? [state.items.length ? 'Candidates need package inspection before loading.' : 'No publisher-declared ONNX or GGUF relatives were found.', state.warning,
        state.cached ? 'Showing cached conversion metadata.' : ''].filter(Boolean).join(' ')
      : 'Find ONNX or GGUF packages whose publisher identifies this source model.';
    section.append(feedback);
    if (state?.status !== 'complete') {
      const discover = button(state?.status === 'pending' ? 'Cancel conversion search' : 'Find browser conversions');
      discover.dataset.browserControl = 'conversion-search';
      discover.disabled = busy || actionPending;
      discover.onclick = () => {
        if (busy || actionPending) return;
        stickySelectionKey = source.key;
        if (state?.status === 'pending') conversions.cancel(); else void conversions.find(reference);
      };
      section.append(discover);
    }
    for (const candidate of state?.items ?? []) {
      const choice = button(''); choice.className = 'pc-browser-conversion'; choice.dataset.conversionRepository = candidate.repository;
      choice.dataset.browserControl = `conversion:${candidate.repository}`;
      choice.append(node('strong', candidate.name), node('small', candidate.repository),
        node('small', `${candidate.formats.join(' / ')} · ${candidate.relationship} · Candidate · Needs inspection`),
        node('small', `Publisher-declared source: ${candidate.sourceRepository}`));
      choice.disabled = busy || actionPending;
      choice.onclick = () => {
        if (busy || actionPending) return;
        const key = `hub:${candidate.repository}@${candidate.revision}`;
        const item = { repository: candidate.repository, name: candidate.name, description: candidate.description,
          task: candidate.task, browserKey: key, inspectReference: candidate.reference,
          browserConversion: { sourceKey: source.key, sourceRepository: repository, relationship: candidate.relationship } };
        hubItems = [...hubItems.filter((entry) => (entry.browserKey ?? `hub:${entry.repository}`) !== key), item];
        desiredKey = key; stickySelectionKey = key; inspectionError = ''; callbackError = '';
        render({ revealSelected: true });
        if (!inspected.has(candidate.reference)) void inspect(candidate.reference);
      };
      section.append(choice);
    }
    body.append(section);
  }
  async function act(callback) {
    if (disposed || busy || actionPending) return;
    actionPending = true; element.close(); render();
    try { await callback(); }
    catch (error) { if (!disposed) callbackError = message(error); }
    finally { actionPending = false; render(); }
  }
  async function inspect(reference, selectedVariant) {
    const parsed = repositoryQuery(reference), repository = parsed.repository ?? reference;
    if (disposed || busy || !inspectModel || !safeModelUrl(repository)) return;
    stickySelectionKey = desiredKey;
    const priorRevision = selectedVariant ? inspected.get(reference)?.revision : null;
    const expectedRevision = parsed.revision ?? priorRevision;
    const requestReference = selectedVariant && /^[a-f0-9]{40}$/i.test(priorRevision ?? '')
      ? `${safeModelUrl(repository)}/tree/${priorRevision}` : reference;
    inspectController?.abort(); const controller = new AbortController(); inspectController = controller;
    const sequence = ++inspectSequence, selectionAtStart = desiredKey;
    inspecting = reference; inspectionError = ''; render();
    try {
      const result = await inspectModel(requestReference, { selectedVariant, signal: controller.signal });
      if (disposed || controller.signal.aborted || sequence !== inspectSequence) return;
      if (!result || result.repository !== repository || !Array.isArray(result.variants)) throw new Error('Invalid model inspection response');
      if (expectedRevision && result.revision !== expectedRevision) throw new Error('Inspection returned a different model revision');
      inspected.set(reference, { ...result, browserReference: reference });
      if (!result.variants.length) inspectionError = 'No supported package variants were found in this repository.';
    } catch (error) { if (!disposed && !controller.signal.aborted && sequence === inspectSequence) inspectionError = `Inspection failed: ${message(error)}`; }
    finally { if (sequence === inspectSequence) {
      inspecting = null; inspectController = null;
      render({ revealSelected: desiredKey === selectionAtStart });
    } }
  }
  function stopRequests() {
    clearTimeout(searchTimer); searchController?.abort(); inspectController?.abort();
    conversions.cancel();
    ++searchSequence; ++inspectSequence; searchController = null; inspectController = null;
    searchPending = false; inspecting = null;
  }
  async function runSearch(append = false) {
    clearTimeout(searchTimer);
    if (disposed || busy || !element.open) return;
    const query = repositoryQuery(search.value);
    if (query.error) { searchIncomplete = false; searchWarning = query.error; render(); return; }
    if (!canSearch()) return;
    searchController?.abort(); const controller = new AbortController(); searchController = controller;
    searchIncomplete = true; resumeAppend = append;
    const sequence = ++searchSequence; searchPending = true; searchWarning = ''; render();
    try {
      const result = await searchModels({ query: query.query, task: selects.task.value === 'all' ? undefined : selects.task.value,
        cursor: append ? nextCursor : undefined, signal: controller.signal });
      if (disposed || controller.signal.aborted || sequence !== searchSequence) return;
      if (!result || !Array.isArray(result.items)) throw new Error('Invalid search response');
      let incoming = result.items.filter((item) => item && safeModelUrl(item.repository));
      if (query.repository) {
        const direct = incoming.find((item) => item.repository === query.repository);
        incoming = incoming.filter((item) => item.repository !== query.repository);
        incoming.unshift({ ...direct, repository: query.repository, name: direct?.name ?? query.repository,
          inspectReference: query.reference, browserKey: `hub:${query.repository}${query.revision ? '@' + query.revision : ''}` });
      }
      hubItems = [...new Map([...(append ? hubItems : []), ...incoming].map((item) => [item.repository, item])).values()].slice(0, 200);
      nextCursor = hubItems.length < 200 ? result.nextCursor ?? null : null;
      searchWarning = [result.warning, result.cached ? 'Showing cached Hugging Face results.' : ''].filter(Boolean).join(' ');
    } catch (error) {
      if (!disposed && !controller.signal.aborted && sequence === searchSequence) searchWarning = `Hugging Face search unavailable: ${message(error)}. Catalog, stored models and peer files remain available.`;
    } finally { if (sequence === searchSequence) { searchIncomplete = false; searchPending = false; searchController = null; render(); } }
  }
  function canSearch() {
    return Boolean(searchModels && ['all', 'hub'].includes(selects.source.value)
      && (search.value.trim() || selects.source.value === 'hub'));
  }
  function changedSearch() {
    stopRequests(); hubItems = []; nextCursor = null; searchWarning = ''; inspectionError = ''; callbackError = '';
    stickySelectionKey = null;
    searchIncomplete = canSearch(); resumeAppend = false;
    render(); if (searchIncomplete) searchTimer = setTimeout(() => void runSearch(), 350);
  }
  search.addEventListener('input', changedSearch);
  search.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); void runSearch(); } });
  for (const [key, input] of Object.entries(selects)) input.addEventListener('change', () => {
    if (key === 'task' || key === 'source') changedSearch(); else render();
  });
  more.onclick = () => void runSearch(true);
  done.onclick = () => element.close();
  element.addEventListener('close', () => { stopRequests(); if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true }); });
  element.addEventListener('keydown', (event) => {
    // Search inputs normally consume Escape to clear their value. Here it dismisses
    // the modal, consistently with every other focused control, and aborts metadata.
    if (event.key === 'Escape') { event.preventDefault(); element.close(); return; }
    if (event.key !== 'Tab') return;
    const focusable = [...element.querySelectorAll('button,input,select,a[href],summary')].filter((item) => !item.disabled && item.getClientRects().length);
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
  return {
    element,
    open({ selectedKey } = {}) {
      if (disposed) return;
      if (selectedKey !== undefined) { desiredKey = selectedKey; if (stickySelectionKey !== selectedKey) stickySelectionKey = null; }
      render();
      if (!element.open) {
        returnFocus = document.activeElement; element.showModal(); search.focus();
        if (searchIncomplete) void runSearch(resumeAppend);
      }
    },
    refresh: render,
    setBusy(value) {
      const wasBusy = busy;
      busy = Boolean(value); if (busy) stopRequests(); render();
      if (wasBusy && !busy && element.open && searchIncomplete && !searchController) void runSearch(resumeAppend);
    },
    dispose() { if (disposed) return; disposed = true; stopRequests(); mobile.removeEventListener('change', resizeFilters);
      if (element.open) element.close(); element.remove(); inspected.clear(); variants.clear(); conversions.dispose(); },
  };
}
