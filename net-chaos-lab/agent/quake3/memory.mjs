const filterRecentEntries = (entries, nowMs) => (
  Array.isArray(entries)
    ? entries.filter((entry) => entry && entry.id && Number(entry.expiresAt || 0) > nowMs)
    : []
);

export const rememberRecentId = (
  entries,
  id,
  nowMs,
  { ttlMs = 6000, maxEntries = 8, meta = null } = {}
) => {
  if (!id) return filterRecentEntries(entries, nowMs);
  const next = filterRecentEntries(entries, nowMs).filter((entry) => entry.id !== id);
  next.push({
    id: String(id),
    touchedAt: nowMs,
    expiresAt: nowMs + Math.max(100, Number(ttlMs || 0)),
    meta
  });
  while (next.length > maxEntries) next.shift();
  return next;
};

export const recentPenaltyForId = (
  entries,
  id,
  nowMs,
  { maxPenalty = 8 } = {}
) => {
  if (!id) return 0;
  const recent = filterRecentEntries(entries, nowMs).find((entry) => entry.id === String(id));
  if (!recent) return 0;
  const ttl = Math.max(1, recent.expiresAt - recent.touchedAt);
  const remaining = Math.max(0, recent.expiresAt - nowMs);
  return (remaining / ttl) * maxPenalty;
};
