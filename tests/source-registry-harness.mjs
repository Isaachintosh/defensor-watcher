import assert from "node:assert/strict";
import { validateSourceDescriptor, preserveEvidenceClass, evaluateSourceHealth, silenceMeansSafe } from "../src/core/source-registry.mjs";

const source = {
  id: "fixture-source",
  name: "Fixture Source",
  evidence_class: "AUTHORITATIVE",
  jurisdiction: "FIXTURE",
  domains: ["weather"],
  transport: ["API"],
  documentation: ["fixture://source"],
  implementation_status: "TEST",
  health_policy: { outage_state: "SOURCE_DEGRADED", silence_means_safe: false },
  freshness_policy: { source_timestamp_required: true }
};

assert.equal(validateSourceDescriptor(source).valid, true);
assert.equal(preserveEvidenceClass("AUTHORITATIVE"), "AUTHORITATIVE");
assert.throws(() => preserveEvidenceClass("MEDIA_OSINT", "AUTHORITATIVE"), /MUTATION_FORBIDDEN/);
assert.equal(silenceMeansSafe(), false);

const now = new Date("2026-09-26T12:00:00.000Z");
assert.equal(evaluateSourceHealth(source, {
  last_success_at: "2026-09-26T11:59:30.000Z",
  max_silence_ms: 60000
}, now), "HEALTHY");

assert.equal(evaluateSourceHealth(source, {
  last_success_at: "2026-09-26T11:00:00.000Z",
  max_silence_ms: 60000
}, now), "SOURCE_DEGRADED");

console.log("PASS source registry adapter invariants");
