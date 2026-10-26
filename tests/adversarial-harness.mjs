import assert from "node:assert/strict";
import { applyEventMessage } from "../src/core/event-lifecycle.mjs";
import { resolveLocationContext } from "../src/core/location-context.mjs";
import { evaluateSourceHealth } from "../src/core/source-registry.mjs";
import { serializeReadinessPack, restoreReadinessPack } from "../src/core/offline-store.mjs";

const now = new Date("2026-09-26T12:00:00.000Z");

// UPDATE / CANCEL lifecycle
let state = applyEventMessage(null, {
  logical_event_id: "evt-1",
  message_type: "ALERT",
  sequence: 1,
  payload: { level: "watch" },
  source_reference: "fixture://evt/1"
});
assert.equal(state.status, "ACTIVE");

state = applyEventMessage(state, {
  logical_event_id: "evt-1",
  message_type: "UPDATE",
  sequence: 2,
  payload: { level: "warning" },
  source_reference: "fixture://evt/2"
});
assert.equal(state.payload.level, "warning");

state = applyEventMessage(state, {
  logical_event_id: "evt-1",
  message_type: "CANCEL",
  sequence: 3,
  source_reference: "fixture://evt/3"
});
assert.equal(state.status, "CANCELLED");

const late = applyEventMessage(state, {
  logical_event_id: "evt-1",
  message_type: "UPDATE",
  sequence: 2,
  payload: { level: "critical" }
});
assert.equal(late.status, "CANCELLED");
assert.equal(late.last_transition, "IGNORED_STALE_MESSAGE");

// GPS loss keeps configured-area context
const location = resolveLocationContext({
  gps: { available: false },
  configured_areas: ["São Vicente","Santos"]
});
assert.equal(location.state, "PARTIAL");
assert.equal(location.source, "CONFIGURED_AREAS");

// Explicit source outage is degradation, not safety
const source = { health_policy: { outage_state: "SOURCE_DEGRADED" } };
assert.equal(evaluateSourceHealth(source, { explicit_status: "OUTAGE" }, now), "SOURCE_DEGRADED");

// Offline restart preserves readable household plan while freshness is explicit
const pack = {
  version: "1",
  generated_at: "2026-09-26T09:00:00.000Z",
  max_age_ms: 60000,
  geographic_scope: ["São Vicente"],
  last_successful_sync: "2026-09-26T09:00:00.000Z",
  map_bundle: {},
  protocol_bundle: [],
  family_plan: { separated_household_plan: "MP-B" },
  meeting_points: ["MP-A","MP-B"],
  essential_contacts: ["fixture-contact"],
  language_pack: ["pt-BR"],
  cached_events: [],
  provenance_bundle: [],
  core_requires_remote_llm: false
};
const serialized = serializeReadinessPack(pack, new Date("2026-09-26T09:01:00.000Z"));
const restored = restoreReadinessPack(serialized, now);
assert.equal(restored.restored, true);
assert.equal(restored.validation.freshness, "STALE");
assert.equal(restored.pack.family_plan.separated_household_plan, "MP-B");

console.log("PASS adversarial lifecycle/location/outage/restart invariants");
