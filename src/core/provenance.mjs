export const PROVENANCE_STATES = Object.freeze({
  AUTHORITATIVE: "AUTHORITATIVE",
  CORROBORATED: "CORROBORATED",
  SINGLE_SOURCE: "SINGLE_SOURCE",
  CONFLICTING: "CONFLICTING",
  UNKNOWN: "UNKNOWN",
});

export const FRESHNESS_STATES = Object.freeze({
  CURRENT: "CURRENT",
  STALE: "STALE",
  UNKNOWN: "UNKNOWN",
});

export function classifyProvenance(record = {}) {
  if ((record.conflicting_sources || []).length > 0) return PROVENANCE_STATES.CONFLICTING;
  if (record.evidence_class === "AUTHORITATIVE" && record.authority) return PROVENANCE_STATES.AUTHORITATIVE;
  if ((record.corroborating_sources || []).length > 0) return PROVENANCE_STATES.CORROBORATED;
  if (record.source_id || record.original_reference) return PROVENANCE_STATES.SINGLE_SOURCE;
  return PROVENANCE_STATES.UNKNOWN;
}

export function classifyFreshness(record = {}, now = new Date()) {
  const ts = record.original_timestamp || record.ingestion_timestamp;
  const maxAgeMs = Number(record.max_age_ms);
  if (!ts || !Number.isFinite(maxAgeMs) || maxAgeMs < 0) return FRESHNESS_STATES.UNKNOWN;
  const eventTime = new Date(ts);
  if (Number.isNaN(eventTime.getTime())) return FRESHNESS_STATES.UNKNOWN;
  return now.getTime() - eventTime.getTime() <= maxAgeMs
    ? FRESHNESS_STATES.CURRENT
    : FRESHNESS_STATES.STALE;
}

export function evaluateEvidence(record = {}, now = new Date()) {
  return {
    provenance_state: classifyProvenance(record),
    freshness_state: classifyFreshness(record, now),
  };
}
