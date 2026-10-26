const REQUIRED = [
  "version","generated_at","geographic_scope","last_successful_sync","map_bundle",
  "protocol_bundle","family_plan","meeting_points","essential_contacts","language_pack",
  "cached_events","provenance_bundle"
];

export function validateReadinessPack(pack = {}, now = new Date()) {
  const missing = REQUIRED.filter(key => !(key in pack));
  const generatedAt = pack.generated_at ? new Date(pack.generated_at) : null;
  const maxAgeMs = Number(pack.max_age_ms);
  let freshness = "UNKNOWN";

  if (generatedAt && !Number.isNaN(generatedAt.getTime()) && Number.isFinite(maxAgeMs) && maxAgeMs >= 0) {
    freshness = now.getTime() - generatedAt.getTime() <= maxAgeMs ? "CURRENT" : "STALE";
  }

  return {
    valid_structure: missing.length === 0,
    missing,
    freshness,
    usable_offline: missing.length === 0 && pack.core_requires_remote_llm !== true,
  };
}
