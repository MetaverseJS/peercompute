import './ResidentInspectorPanel.css';
import { createResidentNavigationInspector } from './ResidentNavigationInspector.js';
import { createResidentGoalControls } from './ResidentGoalControls.js';
import { normalizeStandingSocialGoal } from '../../../peercompute/src/peercompute/agents/WorldAgentContracts.js';

let sequence = 0;
const encoder = new TextEncoder();
const text = (value, maximum = 600) => typeof value === 'string' ? value.replaceAll('\0', '').slice(0, maximum) : '';
const errorText = error => text(error?.message ?? String(error));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const date = value => Number.isSafeInteger(value) && value >= 0 ? new Date(value).toLocaleString() : 'Time unavailable';
const node = (tag, content, className) => {
  const element = document.createElement(tag);
  if (content !== undefined) element.textContent = content;
  if (className) element.className = className;
  return element;
};
const button = label => { const element = node('button', label); element.type = 'button'; return element; };
const paragraph = content => node('p', content, 'pc-resident-inspector__note');
const primitive = value => typeof value === 'string' ? text(value) : typeof value === 'boolean' ? String(value)
  : typeof value === 'number' && Number.isFinite(value) ? String(value) : '';
const runtimeText = value => typeof value === 'string' ? text(value) : [value?.status, value?.reason].map(item => text(item)).filter(Boolean).join(' · ');
const routeText = route => typeof route === 'string' ? text(route) : [route?.modelLabel ?? route?.modelName ?? route?.modelId ?? route?.modelCid ?? route?.manifestCid,
  route?.kind ?? route?.provider, route?.peerId].map(value => text(value, 240)).filter(Boolean).join(' · ');
const validText = (value, maximum, required = false) => typeof value === 'string' && (!required || !!value.trim())
  && !value.includes('\0') && encoder.encode(value).length <= maximum;
const booleans = ['localOnly', 'shared', 'respondToWorldChat', 'initiateConversations', 'autonomous',
  'allowCloning', 'shareMemories', 'sharePrivateMemories', 'selfModifiable'];
const moves = [['self-directed', 'Self directed'], ['stationary', 'Stay here'], ['follow', 'Follow me (learned motor)'], ['roam', 'Roam (scripted)']];

/** A presentation-only resident inspector. The host owns authorization, CAS,
 * private data projection, model execution and storage. Reads never start work.
 * Peer views intentionally ignore all owner-only fields, even if supplied. */
export function createResidentInspectorPanel({ onRead, onEdit, onMind, onAssignGoal, onPauseGoal, onResumeGoal,
  onCancelGoal, onResume, onAppearance, onRemove, onClone, container = document.body } = {}) {
  if (typeof onRead !== 'function') throw new TypeError('Resident inspector requires onRead');
  const dialog = node('dialog', undefined, 'pc-resident-inspector');
  const prefix = `pc-resident-inspector-${++sequence}`, header = node('header', undefined, 'pc-resident-inspector__header');
  const heading = node('h2', 'Resident'); heading.id = `${prefix}-title`; dialog.setAttribute('aria-labelledby', heading.id);
  const done = button('Done'); header.append(heading, done);
  const tabs = node('div', undefined, 'pc-resident-inspector__tabs'); tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', 'Resident details');
  const body = node('div', undefined, 'pc-resident-inspector__body');
  const status = paragraph(''); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
  const problem = node('p', '', 'pc-resident-inspector__problem'); problem.hidden = true;
  const tabMap = new Map(), panels = new Map();
  for (const [id, label] of [['overview', 'Overview'], ['profile', 'Profile'], ['goals', 'Goals & memory'], ['activity', 'Activity']]) {
    const tab = button(label), panel = node('section'); tab.id = `${prefix}-${id}-tab`; panel.id = `${prefix}-${id}`;
    tab.setAttribute('role', 'tab'); tab.setAttribute('aria-controls', panel.id);
    panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-labelledby', tab.id); panel.tabIndex = 0;
    tabs.append(tab); panels.set(id, panel); tabMap.set(id, tab);
  }
  body.append(status, problem, ...panels.values()); dialog.append(header, tabs, body); container.append(dialog);
  const overview = panels.get('overview'), metadata = paragraph(''), overviewValues = node('dl'), runtimeValues = node('dl');
  const runtimeSection = node('section'), actions = node('div', undefined, 'pc-resident-inspector__actions');
  runtimeSection.append(node('h3', 'Current activity'), runtimeValues);
  const navigation = createResidentNavigationInspector();
  const routing = node('section'), routingSummary = paragraph(''), candidates = node('ul');
  routing.append(node('h3', 'Model routing'), routingSummary, candidates);
  const refreshButton = button('Refresh');
  const removeConfirmation = node('div', undefined, 'pc-resident-inspector__confirmation'); removeConfirmation.hidden = true;
  const confirmRemove = button('Remove body'), keepBody = button('Keep body');
  removeConfirmation.append(paragraph('Remove this body from the world? Its saved identity and conversation history remain.'), confirmRemove, keepBody);
  overview.append(metadata, overviewValues, actions, removeConfirmation, runtimeSection, navigation.element, routing, refreshButton);

  const profilePanel = panels.get('profile'), profileNotice = paragraph(''), profileForm = node('form');
  const fields = new Map(), groups = new Map();
  for (const [id, label] of [['identity', 'Identity and appearance'], ['behavior', 'Behavior and routing'], ['sharing', 'Sharing and cloning'], ['standing', 'Standing social goal']]) {
    const group = node('details'); group.open = id === 'identity'; group.append(node('summary', label));
    const content = node('div', undefined, 'pc-resident-inspector__fields'); group.append(content); groups.set(id, content); profileForm.append(group);
  }
  function field(id, label, { group = 'identity', multiline = false, choices, checkbox = false, maximum } = {}) {
    const wrapper = node('label', checkbox ? undefined : label, checkbox ? 'pc-resident-inspector__check' : 'pc-resident-inspector__field');
    const control = node(choices ? 'select' : multiline ? 'textarea' : 'input'); control.setAttribute('aria-label', label);
    if (checkbox) { control.type = 'checkbox'; wrapper.append(control, document.createTextNode(label)); }
    else { if (multiline) control.rows = 3; else if (!choices) control.type = 'text'; wrapper.append(control); }
    if (choices) for (const [value, name] of choices) { const option = node('option', name); option.value = value; control.append(option); }
    if (maximum) control.maxLength = maximum;
    groups.get(group).append(wrapper); fields.set(id, control);
    control.addEventListener(checkbox || choices ? 'change' : 'input', () => changed(id));
    return control;
  }
  field('name', 'Resident name', { maximum: 240 });
  field('instructions', 'Identity and instructions', { multiline: true, maximum: 16384 });
  field('goals', 'Goals (one per line)', { multiline: true, maximum: 65536 });
  field('summary', 'Persistent context summary', { multiline: true, maximum: 24576 });
  field('appearancePrompt', 'Physical appearance', { multiline: true, maximum: 2048 });
  field('movement', 'Movement', { group: 'behavior', choices: moves });
  groups.get('behavior').append(paragraph('Self directed leaves movement to the resident’s decisions. It stays still until it chooses an action.'));
  for (const [id, label] of [['localOnly', 'Use only models on this device'], ['respondToWorldChat', 'Respond to world chat'],
    ['initiateConversations', 'Initiate conversations'], ['autonomous', 'Reflect and pursue goals automatically'],
    ['selfModifiable', 'Let resident update its personality, goals and appearance']]) field(id, label, { group: 'behavior', checkbox: true });
  groups.get('behavior').append(paragraph('With local-only off, selected context may be sent to a peer inference host. Automatic activity still respects owner pauses.'));
  for (const [id, label] of [['shared', 'Let peers talk to this resident'], ['allowCloning', 'Allow other players to clone this resident'],
    ['shareMemories', 'Share resident history'], ['sharePrivateMemories', 'Include private conversations']]) field(id, label, { group: 'sharing', checkbox: true });
  groups.get('sharing').append(paragraph('Shared history includes public world experiences. If private conversations are included, other players who clone this resident can read them.'));
  field('standingEnabled', 'Enable standing social goal', { group: 'standing', checkbox: true });
  field('standingObjective', 'Standing social objective', { group: 'standing', multiline: true, maximum: 2048 });
  field('standingTarget', 'Standing social audience', { group: 'standing', choices: [['owner', 'Me (this resident’s owner)'], ['new-players', 'New players nearby']] });
  const profileFeedback = paragraph(''), profileActions = node('div', undefined, 'pc-resident-inspector__actions');
  const save = button('Save changes'); save.type = 'submit'; const discard = button('Discard draft');
  profileActions.append(save, discard); profileForm.append(profileFeedback, profileActions); profilePanel.append(profileNotice, profileForm);

  const goalPanel = panels.get('goals'), goalNotice = paragraph(''), goalSlot = node('div'), memorySummary = paragraph('');
  const mind = button('Open Mind');
  goalPanel.append(goalNotice, goalSlot, node('h3', 'Remembered people and places'), memorySummary, mind);
  const activityPanel = panels.get('activity'), activityNotice = paragraph(''), activityToolbar = node('div', undefined, 'pc-resident-inspector__actions');
  const filter = node('select'); filter.setAttribute('aria-label', 'Activity source');
  activityToolbar.append(node('label', 'Show activity'), filter); activityToolbar.firstChild.append(filter);
  const activityList = node('ol', undefined, 'pc-resident-inspector__activity'); activityList.setAttribute('aria-label', 'Recent resident activity');
  activityPanel.append(activityNotice, activityToolbar, activityList);

  let key = '', snapshot = null, disposed = false, epoch = 0, readVersion = 0, controller, timer, focusTarget, reading, pending = '';
  let selectedTab = 'overview', baseProfile = null, draftRevision = null, dirty = new Set(), needsRead = false, profileError = '';
  let goalControls = null, goalKey = '', lastActivity = '', activities = [], readFailed = false;
  const active = () => !disposed && !!key && dialog.open && !controller?.signal.aborted;
  const current = token => active() && token === epoch;
  const owned = () => snapshot?.local === true;
  const allowed = permission => !!snapshot && snapshot.permissions?.[permission] === true && (permission === 'clone' || owned());
  function notice(message, failed = false) { status.textContent = message; status.dataset.error = String(failed); }
  function chooseTab(id, focus = false) {
    selectedTab = tabMap.has(id) ? id : 'overview';
    for (const [name, tab] of tabMap) { const chosen = name === selectedTab; tab.setAttribute('aria-selected', String(chosen)); tab.tabIndex = chosen ? 0 : -1; panels.get(name).hidden = !chosen; }
    if (focus) tabMap.get(selectedTab).focus();
  }
  for (const [id, tab] of tabMap) {
    tab.onclick = () => chooseTab(id);
    tab.onkeydown = event => {
      const ids = [...tabMap.keys()], index = ids.indexOf(id);
      const next = event.key === 'ArrowRight' ? (index + 1) % ids.length : event.key === 'ArrowLeft' ? (index + ids.length - 1) % ids.length
        : event.key === 'Home' ? 0 : event.key === 'End' ? ids.length - 1 : -1;
      if (next < 0) return; event.preventDefault(); chooseTab(ids[next], true);
    };
  }
  function values(element, entries) {
    element.replaceChildren(...entries.filter(([, value]) => value !== '').flatMap(([label, value]) => [node('dt', label), node('dd', value)]));
  }
  function cleanProfile(value) {
    const result = { name: text(value?.name, 240), instructions: text(value?.instructions, 16384), summary: text(value?.summary, 24576),
      goals: Array.isArray(value?.goals) ? value.goals.slice(0, 16).map(item => text(item, 4096)) : [],
      appearancePrompt: text(value?.appearancePrompt, 2048), movement: moves.some(([id]) => id === value?.movement) ? value.movement : 'self-directed',
      standingGoal: value?.standingGoal ? { id: text(value.standingGoal.id, 80), enabled: value.standingGoal.enabled === true,
        objective: text(value.standingGoal.objective, 2048), target: value.standingGoal.target === 'new-players' ? 'new-players' : 'owner' } : undefined };
    for (const id of booleans) result[id] = value?.[id] === true;
    return result;
  }
  function loadProfile(value, revision) {
    baseProfile = cleanProfile(value); draftRevision = revision; dirty.clear(); profileError = '';
    const presented = { ...baseProfile, goals: baseProfile.goals.join('\n'), standingEnabled: baseProfile.standingGoal?.enabled ?? false,
      standingObjective: baseProfile.standingGoal?.objective ?? '', standingTarget: baseProfile.standingGoal?.target ?? 'owner' };
    for (const [id, control] of fields) {
      if (control.type === 'checkbox') control.checked = presented[id] === true;
      else if (control.value !== (presented[id] ?? '')) control.value = presented[id] ?? '';
    }
  }
  function formValue(id) {
    if (id === 'standingGoal') return normalizeStandingSocialGoal({ id: baseProfile?.standingGoal?.id || 'social-goal-v1',
      enabled: fields.get('standingEnabled').checked, objective: fields.get('standingObjective').value, target: fields.get('standingTarget').value });
    const control = fields.get(id);
    if (id === 'goals') return control.value.split('\n').map(value => value.trim()).filter(Boolean);
    return control.type === 'checkbox' ? control.checked : ['name', 'appearancePrompt'].includes(id) ? control.value.trim() : control.value;
  }
  function changed(id) {
    if (!baseProfile || !allowed('edit')) return;
    const name = id.startsWith('standing') ? 'standingGoal' : id;
    try { if (same(formValue(name), baseProfile[name])) dirty.delete(name); else dirty.add(name); }
    catch { dirty.add(name); }
    // Revoking a prerequisite must never leave the UI promising private-history sharing.
    if (['shared', 'allowCloning', 'shareMemories'].includes(id) && !fields.get(id).checked && fields.get('sharePrivateMemories').checked) {
      fields.get('sharePrivateMemories').checked = false; changed('sharePrivateMemories');
    }
    profileError = ''; updateLocks();
  }
  function validation() {
    for (const [id, maximum, required] of [['name', 240, true], ['instructions', 16384], ['summary', 24576], ['appearancePrompt', 2048]]) {
      const ok = validText(formValue(id), maximum, required); fields.get(id).setAttribute('aria-invalid', String(!ok));
      if (!ok) return `${id === 'name' ? 'Enter a name using' : `Shorten ${id === 'summary' ? 'context summary' : id}`} at most ${maximum} UTF-8 bytes.`;
    }
    const goals = formValue('goals');
    if (goals.length > 16 || goals.some(value => !validText(value, 4096))) return 'Use at most 16 goals, each at most 4096 UTF-8 bytes.';
    try { if (dirty.has('standingGoal') || baseProfile?.standingGoal) formValue('standingGoal'); }
    catch { return 'An enabled standing goal needs an objective of at most 2048 UTF-8 bytes.'; }
    return '';
  }
  function updateLocks() {
    const blocked = pending !== '' || needsRead;
    refreshButton.disabled = !!reading || !!pending;
    for (const control of actions.querySelectorAll('button')) control.disabled = blocked;
    confirmRemove.disabled = keepBody.disabled = blocked;
    for (const control of fields.values()) control.disabled = blocked || !allowed('edit');
    fields.get('sharePrivateMemories').disabled ||= !fields.get('shared').checked || !fields.get('allowCloning').checked || !fields.get('shareMemories').checked;
    const invalid = baseProfile ? validation() : '';
    save.disabled = blocked || !allowed('edit') || !dirty.size || !!invalid || typeof onEdit !== 'function';
    save.textContent = pending === 'edit' ? 'Saving…' : 'Save changes';
    discard.disabled = blocked || !dirty.size;
    profileFeedback.textContent = profileError || invalid || (dirty.size && snapshot?.revision !== draftRevision
      ? 'This resident changed while you were editing. Save checks the original revision; discard the draft to use the latest profile.'
      : dirty.size ? 'Unsaved changes.' : '');
    mind.disabled = !allowed('memory') || typeof onMind !== 'function';
    goalControls?.setEnabled(!blocked && allowed('goals'));
  }
  async function invoke(kind, permission, callback, payload = {}, { write = true } = {}) {
    if (!active() || !allowed(permission) || typeof callback !== 'function' || (write && (pending || needsRead))) return;
    const token = epoch, requestKey = key, signal = controller.signal;
    if (write) { pending = kind; readVersion++; updateLocks(); }
    try {
      const result = await callback({ ...payload, key: requestKey, signal });
      if (!current(token)) return result;
      if (write) {
        if (kind === 'remove') { close(); return result; }
        if (kind === 'edit') { dirty.clear(); profileError = ''; baseProfile = null; }
        removeConfirmation.hidden = true; needsRead = true; notice(kind === 'edit' ? 'Resident saved.' : 'Request completed.');
      }
      return result;
    } catch (error) {
      if (current(token)) { if (kind === 'edit') profileError = errorText(error); notice(errorText(error), true); }
      throw error;
    } finally {
      if (current(token) && write) {
        pending = ''; updateLocks();
        if (needsRead) { await reading; if (current(token)) await refresh(); }
      }
    }
  }
  function fire(promise) { void promise.catch(() => {}); }
  const ownerActions = [['resume', 'Resume', onResume], ['appearance', 'Generate appearance', onAppearance], ['remove', 'Remove body', onRemove], ['clone', 'Clone to this device', onClone]];
  const actionButtons = new Map();
  for (const [permission, label, callback] of ownerActions) {
    const control = button(label); actionButtons.set(permission, control); actions.append(control);
    control.onclick = () => {
      if (control.disabled || !allowed(permission)) return;
      if (permission === 'remove') { removeConfirmation.hidden = false; confirmRemove.focus(); }
      else fire(invoke(permission, permission, callback));
    };
  }
  confirmRemove.onclick = () => fire(invoke('remove', 'remove', onRemove));
  keepBody.onclick = () => { removeConfirmation.hidden = true; actionButtons.get('remove').focus(); };
  mind.onclick = () => fire(invoke('mind', 'memory', onMind, { returnFocus: mind }, { write: false }));
  profileForm.onsubmit = event => {
    event.preventDefault(); if (save.disabled || validation()) return;
    const patch = {}; for (const id of dirty) patch[id] = formValue(id);
    fire(invoke('edit', 'edit', onEdit, { expectedRevision: draftRevision, patch }));
  };
  discard.onclick = () => { if (owned() && snapshot.profile && !pending) { loadProfile(snapshot.profile, snapshot.revision); updateLocks(); } };
  const activityDetailKeys = ['reason', 'requestId', 'task', 'modelLabel', 'modelId', 'modelCid', 'peerId', 'phase', 'elapsedMs', 'waitMs',
    'promptChars', 'replyChars', 'inputDigest', 'outputDigest', 'repeated', 'duplicateOf', 'inputTokens', 'outputTokens', 'contextTokens', 'delivery',
    'contextLength', 'maxNewTokens', 'requiredTokens', 'contextBytes', 'messageCount', 'outputChars', 'attempt', 'nextAt', 'pauseCause',
    'committed', 'outputStarted', 'queueDepth', 'durationMs'];
  const detailLabels = { contextLength: 'Context capacity', maxNewTokens: 'Output token allowance', requiredTokens: 'Required tokens',
    contextBytes: 'Context bytes', messageCount: 'Messages', outputChars: 'Output characters', attempt: 'Attempt', nextAt: 'Next attempt',
    pauseCause: 'Pause cause', committed: 'Request committed', outputStarted: 'Output started', queueDepth: 'Queue depth', durationMs: 'Duration (ms)' };
  function renderActivity() {
    const selected = filter.value || 'all', digest = JSON.stringify([selected, activities]); if (digest === lastActivity) return; lastActivity = digest;
    const openIds = new Set([...activityList.querySelectorAll('details[open]')].map(element => element.dataset.eventId));
    const sources = [...new Set(activities.map(entry => text(entry.source, 80)).filter(Boolean))].sort();
    const expected = ['all', ...sources];
    if (!same([...filter.options].map(option => option.value), expected)) {
      filter.replaceChildren(...expected.map(value => { const option = node('option', value === 'all' ? 'All sources' : value); option.value = value; return option; }));
    }
    filter.value = expected.includes(selected) ? selected : 'all';
    const visible = activities.filter(event => filter.value === 'all' || event.source === filter.value);
    activityList.replaceChildren();
    for (const event of visible) {
      const item = node('li'), title = node('p');
      const state = [...new Set([text(event.stage, 80), text(event.status, 80)].filter(Boolean))].join(' · ');
      title.append(node('time', date(event.when)), document.createTextNode(` · ${text(event.source, 80)}${state ? ` · ${state}` : ''}`));
      item.append(title, node('p', text(event.message, 1000) || 'No additional message.'));
      item.dataset.severity = ['error', 'warning'].includes(event.severity) ? event.severity : 'info';
      const details = node('details'); details.dataset.eventId = text(event.id, 160); details.open = openIds.has(details.dataset.eventId);
      details.append(node('summary', 'Diagnostic details'));
      const list = node('dl'); values(list, [['Status', text(event.status, 80)], ['Code', text(event.code, 100) || text(event.errorCode, 100)],
        ['Operation', text(event.operationId, 160)], ['Message', text(event.messageId, 160)], ['Route', routeText(event.route)],
        ...activityDetailKeys.map(name => [detailLabels[name] ?? name, primitive(event.details?.[name])])]);
      if (list.children.length) { details.append(list); item.append(details); }
      activityList.append(item);
    }
    if (!visible.length) activityList.append(node('li', 'No activity recorded in this view yet.'));
  }
  filter.onchange = renderActivity;
  function render() {
    const local = owned(); heading.textContent = `Resident · ${text(snapshot.name, 240) || 'Resident'}`; heading.title = heading.textContent;
    metadata.textContent = local ? 'Hosted on this device. Changes require current owner authority.' : 'Hosted by a peer. Only public resident information is available here.';
    const position = Array.isArray(snapshot.position) && snapshot.position.length === 3 && snapshot.position.every(Number.isFinite)
      ? snapshot.position.map(number => number.toFixed(1)).join(', ') : '';
    values(overviewValues, [['Status', text(snapshot.status, 80) || 'Unavailable'], ['Host', text(snapshot.ownerPeerId, 160)],
      ['World', text(snapshot.worldId, 240)], ['Position (latest observation)', position]]);
    runtimeSection.hidden = navigation.element.hidden = routing.hidden = !local;
    const runtime = local ? snapshot.runtime : null;
    values(runtimeValues, [['Runtime', runtimeText(runtime?.status)], ['Activity', runtimeText(runtime?.activity)],
      ['Pause cause', runtimeText(runtime?.pauseCause)], ['World chat', runtimeText(runtime?.worldChat)], ['Reflection', runtimeText(runtime?.ooda)],
      ['Social', runtimeText(runtime?.social)], ['Standing goal', runtimeText(runtime?.standing)], ['Profile update', runtimeText(runtime?.profile)], ['Appearance', runtimeText(runtime?.appearance)]]);
    problem.textContent = local ? runtimeText(runtime?.error) || '' : ''; problem.hidden = !problem.textContent;
    navigation.setName(snapshot.name); navigation.setStatus(local ? snapshot.navigation : null);
    for (const [permission, , callback] of ownerActions) actionButtons.get(permission).hidden = !allowed(permission) || typeof callback !== 'function';
    actionButtons.get('resume').textContent = runtime?.recoveryRequired ? 'Acknowledge and resume' : 'Resume';
    if (!allowed('remove')) removeConfirmation.hidden = true;
    profileForm.hidden = !local || !snapshot.profile;
    profileNotice.textContent = !local ? 'The owner’s identity instructions, goals and settings are private. Clone this resident if its owner has enabled cloning.'
      : !snapshot.profile ? 'The profile is unavailable.' : !allowed('edit') ? 'This profile is read-only until this host has edit authority.' : 'Edit this resident without replacing its identity or remembered history.';
    if (local && snapshot.profile) {
      if (!dirty.size && !pending) loadProfile(snapshot.profile, snapshot.revision);
    } else { baseProfile = null; dirty.clear(); draftRevision = null; profileError = ''; for (const control of fields.values()) { control.value = ''; if (control.type === 'checkbox') control.checked = false; } }
    if (local && allowed('goals')) {
      if (goalKey !== key) {
        goalControls?.dispose(); goalKey = key;
        const action = (kind, callback) => input => invoke(kind, 'goals', callback, input);
        goalControls = createResidentGoalControls({ key, name: snapshot.name, onAssignGoal: onAssignGoal && action('assign-goal', onAssignGoal),
          onPauseGoal: onPauseGoal && action('pause-goal', onPauseGoal), onResumeGoal: onResumeGoal && action('resume-goal', onResumeGoal),
          onCancelGoal: onCancelGoal && action('cancel-goal', onCancelGoal) });
        goalControls.element.open = true; goalSlot.append(goalControls.element);
      }
      goalControls.setName(snapshot.name); goalControls.setStatus(snapshot.objective ?? null);
    } else { goalControls?.dispose(); goalControls = null; goalKey = ''; }
    goalNotice.textContent = !local ? 'Private goals and remembered history are available only to this resident’s host.'
      : allowed('goals') ? 'Tasks use physical receipts to distinguish intended actions from completed movement.' : 'The world task controller is not available here.';
    const counts = local ? snapshot.memorySummary : null;
    memorySummary.textContent = !local ? 'Private history is not fetched from peers.'
      : !allowed('memory') ? 'Persistent memory of people and places is not available here.'
      : counts ? ['places', 'people', 'total', 'episodes'].filter(id => Number.isSafeInteger(counts[id]) && counts[id] >= 0)
        .map(id => `${counts[id]} ${id === 'total' ? 'knowledge entries' : id}`).join(' · ') : 'Memory counts are unavailable.';
    mind.hidden = !allowed('memory') || typeof onMind !== 'function';
    const routes = local ? snapshot.routing : null;
    routingSummary.textContent = routes ? `${text(routes.mode, 80) || 'Routing policy unavailable'} · Last model: ${text(routes.lastModelLabel, 240) || routeText(routes.lastRoute) || 'Unavailable'}` : 'Model route unavailable.';
    candidates.replaceChildren();
    for (const candidate of (Array.isArray(routes?.candidates) ? routes.candidates : []).slice(0, 24)) {
      candidates.append(node('li', routeText(candidate) || text(candidate?.name, 240) || 'Available model (name unavailable)'));
    }
    if (!candidates.children.length) candidates.append(node('li', 'No available model route reported.'));
    activityNotice.textContent = local ? 'Recent diagnostic events on this host. These records describe routing and decisions; they are not a conversation transcript.' : 'Private activity and model routes are available only to the host.';
    activityToolbar.hidden = activityList.hidden = !local;
    activities = local && Array.isArray(snapshot.activity) ? snapshot.activity.slice(-100).filter(value => value && typeof value === 'object').reverse() : [];
    renderActivity(); updateLocks();
  }
  async function refresh() {
    if (!active() || pending) return;
    if (reading) return reading;
    const token = epoch, requestVersion = readVersion, requestKey = key, signal = controller.signal;
    const task = (async () => {
      try {
        const result = await Promise.resolve().then(() => onRead({ key: requestKey, signal }));
        if (!current(token) || requestVersion !== readVersion) return;
        if (!result || result.key !== requestKey || typeof result.local !== 'boolean') throw new Error('Resident details could not be read.');
        snapshot = result; needsRead = false;
        if (readFailed) { readFailed = false; notice(''); }
        render();
      } catch (error) { if (current(token) && requestVersion === readVersion) { readFailed = true; notice(errorText(error), true); } }
      finally { if (current(token)) { reading = null; updateLocks(); } }
    })();
    reading = task; updateLocks(); return task;
  }
  function reset() {
    epoch++; clearInterval(timer); timer = null; controller?.abort(); controller = null; reading = null; pending = '';
    key = ''; snapshot = null; baseProfile = null; draftRevision = null; dirty.clear(); needsRead = false; profileError = ''; readFailed = false;
    goalControls?.dispose(); goalControls = null; goalKey = ''; activities = []; lastActivity = ''; activityList.replaceChildren();
    problem.hidden = true; notice(''); removeConfirmation.hidden = true;
    for (const control of fields.values()) { control.value = ''; if (control.type === 'checkbox') control.checked = false; }
  }
  function close() {
    if (disposed) return;
    const restore = focusTarget; focusTarget = null; reset(); if (dialog.open) dialog.close();
    if (restore?.isConnected && !restore.disabled) restore.focus();
  }
  done.onclick = close; refreshButton.onclick = () => { void refresh(); };
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('close', () => { if (!dialog.open && key) close(); });
  for (const event of ['keydown', 'keyup', 'keypress']) dialog.addEventListener(event, value => value.stopPropagation());
  chooseTab('overview');
  return {
    element: dialog, get selectedKey() { return key; },
    open({ key: nextKey, name, returnFocus, tab = 'overview' } = {}) {
      if (disposed || !text(nextKey, 300)) return;
      if (active() && key === nextKey) { chooseTab(tab); done.focus(); return; }
      const restore = returnFocus ?? (dialog.contains(document.activeElement) ? focusTarget : document.activeElement);
      reset(); key = nextKey; controller = new AbortController(); focusTarget = restore;
      heading.textContent = `Resident · ${text(name, 240) || 'Resident'}`; heading.title = heading.textContent; chooseTab(tab);
      metadata.textContent = 'Reading resident details…'; overviewValues.replaceChildren(); runtimeValues.replaceChildren(); actions.querySelectorAll('button').forEach(control => { control.hidden = true; });
      runtimeSection.hidden = navigation.element.hidden = routing.hidden = profileForm.hidden = mind.hidden = true;
      profileNotice.textContent = goalNotice.textContent = memorySummary.textContent = activityNotice.textContent = '';
      activityToolbar.hidden = activityList.hidden = true;
      if (!dialog.open) dialog.showModal(); done.focus(); void refresh();
      timer = setInterval(() => { if (active()) void refresh(); }, 2000);
    },
    refresh, close,
    dispose() { if (disposed) return; focusTarget = null; reset(); disposed = true; navigation.dispose(); if (dialog.open) dialog.close(); dialog.remove(); },
  };
}
