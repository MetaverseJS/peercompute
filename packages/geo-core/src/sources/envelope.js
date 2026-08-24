export function createSourceEnvelope({
  source,
  status,
  fetchedAt,
  staleAt = null,
  data = null,
  notes = [],
  synthetic = false,
  operationalUse = false,
  schemaVersion = '1.0',
  ...extra
}) {
  if (!source?.id || !source?.name) throw new TypeError('Source envelope requires source.id and source.name.');
  if (typeof status !== 'string' || !status) throw new TypeError('Source envelope requires a status.');
  const fetched = new Date(fetchedAt);
  if (Number.isNaN(fetched.getTime())) throw new TypeError('Source envelope fetchedAt must be an ISO date.');
  if (staleAt !== null && Number.isNaN(new Date(staleAt).getTime())) {
    throw new TypeError('Source envelope staleAt must be null or an ISO date.');
  }
  return Object.freeze({
    schemaVersion,
    source: Object.freeze({ ...source }),
    status,
    synthetic: Boolean(synthetic),
    operationalUse: Boolean(operationalUse),
    fetchedAt: fetched.toISOString(),
    staleAt: staleAt === null ? null : new Date(staleAt).toISOString(),
    notes: Object.freeze([...notes].map(String)),
    ...extra,
    data
  });
}
