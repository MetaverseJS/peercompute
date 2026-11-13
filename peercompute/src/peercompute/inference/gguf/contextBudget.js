import { throwIfAborted } from '../modelManifest.js';

export const GGUF_CONTEXT_BUDGET_ERROR = 'ERR_MODEL_CONTEXT_BUDGET';
// The pinned native server samples once even for max_tokens:0. Request exactly
// one token explicitly; its private result measures the template, not a reply.
export const GGUF_MEASUREMENT_TOKEN_BUDGET = 1;

function budgetError(inputTokens, contextTokens, reservedOutputTokens) {
  return Object.assign(new Error(`The model context holds ${contextTokens} tokens; instructions and the current prompt need ${inputTokens}, plus ${reservedOutputTokens} reserved for the reply. Shorten the current prompt or saved context, or request a shorter reply.`),
    { code: GGUF_CONTEXT_BUDGET_ERROR });
}

/** Only discard a previous user turn with its answers; never cut message text. */
export function dropOldestGgufTurn(messages) {
  const first = messages.findIndex((message) => message.role === 'user');
  const next = messages.findIndex((message, index) => index > first && message.role === 'user');
  if (first < 0 || next < 0
      || !messages.some((message, index) => index > first && index < next && message.role === 'assistant')) return null;
  return messages.filter((message, index) => index < first || index >= next || message.role === 'system');
}

/** Measure the actual native chat template on each bounded history projection. */
export async function fitGgufContext({ messages, contextTokens, reservedOutputTokens, measure, signal, onMeasured }) {
  if (!Number.isSafeInteger(contextTokens) || contextTokens < 1
      || !Number.isSafeInteger(reservedOutputTokens) || reservedOutputTokens < 1) {
    throw new Error('Invalid GGUF context budget');
  }
  let projected = messages.map((message) => ({ ...message }));
  let removedTurns = 0, measurementTokens = 0;
  const maximumAttempts = Math.max(1, messages.filter((message) => message.role === 'user').length);
  for (let preflightCalls = 1; preflightCalls <= maximumAttempts; preflightCalls += 1) {
    throwIfAborted(signal);
    const measured = await measure(projected);
    throwIfAborted(signal);
    if (!Number.isSafeInteger(measured.inputTokens) || measured.inputTokens < 0
        || !Number.isSafeInteger(measured.contextTokens) || measured.contextTokens < 1
        || measured.contextTokens > contextTokens || !Number.isSafeInteger(measured.probeOutputTokens)
        || measured.probeOutputTokens < 0 || measured.probeOutputTokens > GGUF_MEASUREMENT_TOKEN_BUDGET) {
      throw new Error('Invalid GGUF context measurement');
    }
    measurementTokens += measured.probeOutputTokens;
    const budget = { contextTokens: measured.contextTokens, inputTokens: measured.inputTokens,
      reservedOutputTokens, removedTurns, preflightCalls, measurementTokens,
      probeTokenBudget: GGUF_MEASUREMENT_TOKEN_BUDGET };
    const overflow = measured.inputTokens >= measured.contextTokens
      || measured.inputTokens + reservedOutputTokens > measured.contextTokens;
    onMeasured?.({ ...budget, probeOutputTokens: measured.probeOutputTokens, overflow });
    throwIfAborted(signal);
    if (!overflow) return { messages: projected, contextTruncated: removedTurns > 0, contextBudget: budget };
    const shorter = dropOldestGgufTurn(projected);
    if (!shorter) throw budgetError(measured.inputTokens, measured.contextTokens, reservedOutputTokens);
    projected = shorter; removedTurns += 1;
  }
  throw new Error('GGUF context fitting exceeded its bounded attempts');
}
