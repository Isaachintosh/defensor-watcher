export const EVIDENCE_CLASSES = Object.freeze([
  "AUTHORITATIVE",
  "SCIENTIFIC_OPERATIONAL",
  "OPERATIONAL",
  "CURATED",
  "MEDIA_OSINT",
  "COMMUNITY",
  "EXPERIMENTAL"
]);

const REQUIRED = Object.freeze([
  "id","name","evidence_class","jurisdiction","domains",
  "transport","documentation","implementation_status",
  "health_policy","freshness_policy"
]);

export function validateSourceDescriptor(source = {}) {
  const missing = REQUIRED.filter(key => !(key in source));
  const errors = [];
  if (source.evidence_class && !EVIDENCE_CLASSES.includes(source.evidence_class)) {
    errors.push("UNKNOWN_EVIDENCE_CLASS");
  }
  if (!Array.isArray(source.domains)) errors.push("DOMAINS_MUST_BE_ARRAY");
  if (!Array.isArray(source.transport)) errors.push("TRANSPORT_MUST_BE_ARRAY");
  if (!Array.isArray(source.documentation)) errors.push("DOCUMENTATION_MUST_BE_ARRAY");

  return { valid: missing.length === 0 && errors.length === 0, missing, errors };
}

export function preserveEvidenceClass(upstreamClass, adapterClass = upstreamClass) {
  if (!upstreamClass) throw new Error("UPSTREAM_EVIDENCE_CLASS_REQUIRED");
  if (adapterClass !== upstreamClass) throw new Error("ADAPTER_EVIDENCE_CLASS_MUTATION_FORBIDDEN");
  return upstreamClass;
}

export function evaluateSourceHealth(source = {}, runtime = {}, now = new Date()) {
  if (runtime.explicit_status === "OUTAGE") return "SOURCE_DEGRADED";
  if (runtime.explicit_status === "UNKNOWN") return "UNKNOWN";

  const lastSuccess = runtime.last_success_at ? new Date(runtime.last_success_at) : null;
  const maxSilenceMs = Number(runtime.max_silence_ms);

  if (!lastSuccess || Number.isNaN(lastSuccess.getTime()) || !Number.isFinite(maxSilenceMs)) {
    return "UNKNOWN";
  }

  return now.getTime() - lastSuccess.getTime() <= maxSilenceMs
    ? "HEALTHY"
    : (source.health_policy?.outage_state || "SOURCE_DEGRADED");
}

export function silenceMeansSafe() {
  return false;
}
