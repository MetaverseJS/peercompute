const bytes = text => new TextEncoder().encode(text).length;
const errorText = error => String(error?.message || error).replaceAll('\0', '').slice(0, 240);

/** Turn an owner-only, separately validated task proposal into a durable goal.
 * No transcript text or generated speech can itself authorize a task. The
 * planner receives the untouched owner request, and the store remains the
 * source of truth for acceptance and subsequent physical progress. */
export async function admitWorldChatTask({ proposal, message, agentId, requesterId, signal,
  isOwner, getHead, assign } = {}) {
  if (!proposal) return null;
  signal?.throwIfAborted();
  if (isOwner?.() !== true) throw new Error('Only the resident owner can assign a task');
  if (typeof message !== 'string' || !message.trim() || message.includes('\0') || bytes(message) > 1024
      || proposal.objective !== message || !Number.isSafeInteger(proposal.residentRevision)) {
    throw new Error('Use at most 1024 UTF-8 bytes for a physical task; the request was not shortened');
  }
  const head = await getHead(agentId);
  signal?.throwIfAborted();
  if (isOwner() !== true || !head || head.revision !== proposal.residentRevision
      || head.status === 'paused' || head.recoveryRequired || head.activity?.unsaved) {
    throw new Error('The resident changed before the task could be accepted');
  }
  return assign({ agentId, objective: message, requesterId, expectedResidentRevision: proposal.residentRevision, signal });
}

export const chatTaskFailure = error => `\n[Task not started: ${errorText(error)}]`;
