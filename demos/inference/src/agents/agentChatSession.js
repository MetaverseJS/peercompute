import { agentIdentifier, normalizeAgentAttachment } from '../../../../peercompute/src/peercompute/agents/AgentContracts.js';
import { normalizeAgentTask } from '../../../../peercompute/src/peercompute/agents/AgentRouter.js';

const clone = (value) => structuredClone(value);
const fail = (code, message) => Object.assign(new Error(message), { code });
const busy = new Set(['queued', 'running', 'cancelling']);
const bytes = (value) => new TextEncoder().encode(value).byteLength;

function runnable(head) {
  if (!head) throw fail('ERR_AGENT_NOT_FOUND', 'This saved agent no longer exists.');
  if (head.activity?.unsaved) throw fail('ERR_AGENT_UNSAVED', 'Agent changes are not saved. Resume to retry saving before another task.');
  if (head.recoveryRequired) throw fail('ERR_AGENT_RECOVERY_REQUIRED', 'Resume to acknowledge this interrupted task; it will not replay.');
  if (head.status === 'paused') throw fail('ERR_AGENT_PAUSED', 'Resume this paused agent before sending a task.');
  if (busy.has(head.activity?.status) || head.status === 'running') throw fail('ERR_AGENT_BUSY', 'Wait for this agent task and its cleanup to finish.');
  if (!['local-only', 'network-assisted'].includes(head.policy?.inferenceMode)) throw new Error('Unknown agent inference policy');
  return head;
}

/** A private chat projection over the manager-owned AgentRuntime. This owns no
 * agent, model, execution lock or audio. The panel owns each turn's AbortSignal
 * and must await cancel before disposing the shared runtime.
 */
export function createAgentChatSession({ controller, onChange } = {}) {
  if (!controller?.list || !controller?.get || !controller?.events || !controller?.run
      || !controller?.cancel || !controller?.resume || !controller?.getAttachment) {
    throw new TypeError('Agent chat requires a persistent agent controller');
  }
  const lifetime = new AbortController();
  let closed = false, heads = [], refreshing, refreshAgain = false, generation = 0;
  function open() { if (closed) throw new Error('Agent chat session is closed'); }
  function observe(callback, ...values) {
    if (closed || typeof callback !== 'function') return;
    try { Promise.resolve(callback(...values)).catch(() => {}); } catch { /* Rendering cannot change persisted execution. */ }
  }
  function notify(detail) { observe(onChange, clone(heads), detail); }
  // AgentRuntime.get/getAttachment do not take a signal. Consume late settlement
  // without allowing it to update a disposed panel or a newly selected chat.
  function read(action, signal) {
    open();
    const combined = signal ? AbortSignal.any([signal, lifetime.signal]) : lifetime.signal;
    combined.throwIfAborted();
    return new Promise((resolve, reject) => {
      const abort = () => reject(combined.reason);
      combined.addEventListener('abort', abort, { once: true });
      Promise.resolve().then(() => { combined.throwIfAborted(); return action(combined); })
        .then((value) => { combined.throwIfAborted(); return clone(value); })
        .then(resolve, reject).finally(() => combined.removeEventListener('abort', abort));
    });
  }
  function refresh() {
    open();
    if (refreshing) return refreshing;
    refreshAgain = true;
    refreshing = (async () => {
      while (refreshAgain) {
        refreshAgain = false;
        const version = generation;
        const records = await read((signal) => controller.list({ limit: 100, signal }));
        if (!Array.isArray(records) || records.length > 100) throw new Error('Invalid saved-agent list');
        // A mutation/activity event invalidates any earlier in-flight snapshot.
        if (version !== generation) { refreshAgain = true; continue; }
        heads = records; notify();
      }
      return clone(heads);
    })().finally(() => { refreshing = null; });
    return refreshing;
  }
  const unsubscribe = controller.subscribe?.((event) => {
    if (closed || !['changed', 'removed', 'activity'].includes(event?.type)) return;
    generation++; refreshAgain = true;
    refresh().catch((error) => { if (!closed) notify({ error }); });
  });
  async function get(id, { signal } = {}) {
    agentIdentifier(id);
    const head = await read(() => controller.get(id), signal);
    if (head && head.agentId !== id) throw new Error('Saved agent identity does not match the requested chat');
    return head;
  }
  async function history(id, { signal } = {}) {
    agentIdentifier(id); const events = []; let after;
    for (let page = 0; page < 3; page++) {
      const items = await read((activeSignal) => controller.events(id, { limit: 100, after, signal: activeSignal }), signal);
      if (!Array.isArray(items) || items.length > 100) throw new Error('Invalid saved agent history');
      for (const event of items) {
        if (event.agentId !== undefined && event.agentId !== id) throw new Error('Saved history belongs to another agent');
        if (!Number.isSafeInteger(event.sequence) || event.sequence <= (after ?? 0)) throw new Error('Invalid agent history cursor');
        after = event.sequence;
        events.push(event);
      }
      if (items.length < 100) break;
    }
    // Older terminal error events omit conversationId. The matching request
    // still identifies their world channel; never project them into private chat.
    const worldOperations = new Set(events.filter((event) => event.conversationId !== undefined && event.operationId)
      .map((event) => event.operationId));
    return events.filter((event) => event.conversationId === undefined && !worldOperations.has(event.operationId));
  }
  async function attachment(id, attachmentId, { signal } = {}) {
    agentIdentifier(id); agentIdentifier(attachmentId);
    const image = await read(() => controller.getAttachment(id, attachmentId), signal);
    if (!image) return null; // Text-only exports deliberately omit image bytes.
    if (image.id !== attachmentId || (image.agentId !== undefined && image.agentId !== id)) throw new Error('Saved image belongs to another agent attachment');
    return normalizeAgentAttachment(image);
  }
  async function run(id, { task, prompt, image, maxNewTokens, seed, concise, signal, onToken, onProgress } = {}) {
    agentIdentifier(id); open(); signal?.throwIfAborted();
    // Explicit fields exclude caller-owned direct-chat history or world channels.
    // normalizeAgentTask copies pixels before the first asynchronous read.
    const input = normalizeAgentTask({ task, prompt, image, maxNewTokens, seed, concise });
    runnable(await get(id, { signal })); signal?.throwIfAborted();
    const outcome = await controller.run(id, { ...input, signal, onEvent(update) {
      if (closed || signal?.aborted || update?.agentId !== id) return;
      if (update.type === 'token' && typeof update.text === 'string') observe(onToken, update.text);
      else if (update.type === 'progress') observe(onProgress, clone(update.event));
    } });
    // The controller returns only after its terminal checkpoint. Do not turn a
    // successful committed result into cancellation because a later signal fired.
    const result = clone(outcome?.result);
    if (outcome?.agentId !== undefined && outcome.agentId !== id) throw new Error('Agent result belongs to another chat');
    if (!result || typeof result.text !== 'string' || bytes(result.text) > 65536) throw new Error('Invalid saved agent result');
    if (result.image != null) {
      if (input.task !== 'text-to-image') throw new Error('Unexpected image in agent text response');
      result.image = normalizeAgentTask({ task: 'image-text-to-text', prompt: 'Validate result', image: result.image }).image;
    } else if (input.task === 'text-to-image') throw new Error('Agent image generation returned no image');
    return { ...result, route: clone(outcome.route), agentId: id, requestId: outcome.requestId };
  }
  async function speechTarget(id, options) {
    const head = runnable(await get(id, options));
    return head.policy.inferenceMode === 'local-only' ? 'local-only' : 'mixed';
  }
  function cancel(id) { open(); agentIdentifier(id); return controller.cancel(id); }
  async function resume(id) {
    open(); agentIdentifier(id);
    const head = await controller.resume(id);
    if (!closed) await refresh();
    return clone(head);
  }
  function dispose() {
    if (closed) return;
    closed = true; generation++; refreshAgain = false;
    lifetime.abort(new DOMException('Agent chat session closed', 'AbortError'));
    unsubscribe?.(); heads = [];
  }
  return { refresh, list: () => clone(heads), get, history, attachment, run, speechTarget, cancel, resume, dispose };
}
