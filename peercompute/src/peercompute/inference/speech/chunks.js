// Preserve every spoken character while respecting the pinned TTS sentence cap.
// A shared policy keeps world and console speech segmentation identical.
export function speechChunks(text, limit = 256) {
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 256) throw new RangeError('Invalid speech chunk limit');
  const chunks = [];
  for (const sentence of String(text).match(/[^.!?]+[.!?]*\s*|[.!?]+/gu) ?? []) {
    const characters = Array.from(sentence.trim());
    while (characters.length) {
      let count = Math.min(limit, characters.length);
      if (count < characters.length) {
        const space = characters.slice(0, count).lastIndexOf(' ');
        if (space > limit / 2) count = space;
      }
      const chunk = characters.splice(0, count).join('').trim();
      if (chunk) chunks.push(chunk);
    }
  }
  return chunks;
}
