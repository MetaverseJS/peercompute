import { worldKnowledgeStatus } from '../../../peercompute/src/peercompute/agents/WorldKnowledgeContracts.js';

const encoder = new TextEncoder();
export function knowledgeExcerpt(value, maximum) {
  let result = '';
  for (const character of String(value ?? '')) {
    if (encoder.encode(result + character).length > maximum) break;
    result += character;
  }
  return result;
}

/** A small prompt projection of retained evidence, never a current sensor or
 * an instruction. Historical people cannot become actionable world targets. */
export function projectWorldKnowledge(records, { observed, now = Date.now(), maximumBytes = 1000 } = {}) {
  const result = [];
  for (const record of records) {
    const present = record.currentParticipantId && observed?.participants?.some(item => item.id === record.currentParticipantId);
    const value = { kind: record.kind, name: knowledgeExcerpt(record.label, 120),
      note: knowledgeExcerpt(record.note, 180), confidence: record.confidence,
      status: worldKnowledgeStatus(record, now), lastSeenAt: record.lastSeenAt ?? null,
      // Place coordinates help speech refer to the saved point rather than guess
      // from an old conversation. The goal adapter still validates the exact
      // retained coordinates independently; these rounded values grant no motion.
      ...(record.kind === 'place' && record.position ? {
        position: record.position.map(value => Math.round(value * 1000) / 1000),
      } : {}),
      ...(record.kind === 'person' ? { currentlyObserved: !!present,
        ...(present ? { participantId: record.currentParticipantId } : {}) } : {}),
      ...(record.origin ? { inherited: true } : {}) };
    if (encoder.encode(JSON.stringify([...result, value])).length > maximumBytes) continue;
    result.push(value);
    if (result.length === 4) break;
  }
  return result;
}
