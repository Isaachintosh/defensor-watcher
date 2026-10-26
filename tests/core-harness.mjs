import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

import { buildMySituation } from "../src/core/civil-impact-engine.mjs";
import { evaluateEvidence } from "../src/core/provenance.mjs";
import { selectProtocols, guidanceFromProtocol } from "../src/core/protocol-selector.mjs";
import { validateReadinessPack } from "../src/core/offline-readiness-pack.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const load = rel => JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log("PASS", name);
  } catch (error) {
    console.error("FAIL", name);
    throw error;
  }
}

function impact(result, eventId, dimension) {
  return result.assessments.find(a => a.event_id === eventId)?.impacts?.[dimension];
}

const scenario = load("testdata/scenarios/bsx-001.v1.json");
const profileA = load("testdata/profiles/bsx-profile-a.json");
const profileB = load("testdata/profiles/bsx-profile-b.json");
const now = new Date(scenario.clock.now);

const resultA = buildMySituation({
  events: scenario.events,
  profile: profileA,
  guidance: [],
  sync: scenario.sync,
  now
});
const resultB = buildMySituation({
  events: scenario.events,
  profile: profileB,
  guidance: [],
  sync: scenario.sync,
  now
});

test("same event yields different personal mobility impact", () => {
  assert.equal(impact(resultA, "bsx-mobility-001", "mobility"), "BLOCKED");
  assert.equal(impact(resultB, "bsx-mobility-001", "mobility"), "WATCH");
});

test("BSX profile A reaches PREPARATION without inventing ACTION", () => {
  assert.equal(resultA.situation_state, "PREPARATION");
});

test("BSX profile B remains situation-driven", () => {
  assert.equal(resultB.situation_state, "PREPARATION");
  assert.equal(impact(resultB, "bsx-comms-001", "communications"), "WATCH");
});

test("empty evidence never becomes NORMAL", () => {
  const empty = buildMySituation({
    events: [], profile: profileA, guidance: [],
    sync: { positive_current_baseline: false }, now
  });
  assert.equal(empty.situation_state, "UNKNOWN");
});

test("stale evidence remains explicit", () => {
  const stale = evaluateEvidence({
    source_id: "fixture-stale",
    original_timestamp: "2026-09-26T09:00:00.000Z",
    max_age_ms: 60000
  }, now);
  assert.equal(stale.freshness_state, "STALE");
});

test("conflicting evidence remains CONFLICTING", () => {
  const conflicting = evaluateEvidence({
    source_id: "fixture-a",
    conflicting_sources: ["fixture-b"],
    original_timestamp: scenario.clock.now,
    max_age_ms: 60000
  }, now);
  assert.equal(conflicting.provenance_state, "CONFLICTING");
});

test("expired protocol is not selected", () => {
  const selected = selectProtocols({
    protocols: [{
      protocol_id: "expired",
      status: "ACTIVE",
      authority: "FIXTURE_AUTHORITY",
      jurisdiction: "BSX_FIXTURE",
      source_reference: "fixture://protocol/expired",
      applicable_event_types: ["MOBILITY_DISRUPTION"],
      applicable_conditions: ["ANY"],
      valid_until: "2026-09-25T00:00:00.000Z",
      action: "fixture",
      original_text: "fixture"
    }],
    event: scenario.events[0],
    jurisdiction: "BSX_FIXTURE",
    now
  });
  assert.equal(selected.length, 0);
});

test("guidance without provenance is rejected", () => {
  assert.throws(
    () => guidanceFromProtocol({ protocol_id: "bad", authority: "FIXTURE_AUTHORITY" }),
    /NO_GUIDANCE_WITHOUT_PROVENANCE/
  );
});

test("experimental sensor signal alone cannot produce ACTION", () => {
  const sensor = {
    id: "sensor-only",
    type: "EXPERIMENTAL_SIGNAL",
    geography: ["São Vicente"],
    effects: [{ dimension: "information_access", state: "WATCH", dependency_tags: [] }],
    provenance: {
      source_id: "local-sensor",
      evidence_class: "EXPERIMENTAL",
      original_timestamp: scenario.clock.now,
      max_age_ms: 60000,
      original_reference: "fixture://sensor"
    }
  };
  const result = buildMySituation({
    events: [sensor], profile: profileA, guidance: [],
    sync: { positive_current_baseline: false }, now
  });
  assert.notEqual(result.situation_state, "ACTION");
});

test("offline pack remains readable while freshness can become STALE", () => {
  const basePack = {
    version: "1",
    generated_at: "2026-09-26T11:59:00.000Z",
    max_age_ms: 120000,
    geographic_scope: ["São Vicente"],
    last_successful_sync: "2026-09-26T11:59:00.000Z",
    map_bundle: {},
    protocol_bundle: [],
    family_plan: {},
    meeting_points: [],
    essential_contacts: [],
    language_pack: ["pt-BR"],
    cached_events: [],
    provenance_bundle: [],
    core_requires_remote_llm: false
  };
  const current = validateReadinessPack(basePack, now);
  assert.equal(current.valid_structure, true);
  assert.equal(current.usable_offline, true);
  assert.equal(current.freshness, "CURRENT");

  const stale = validateReadinessPack(
    { ...basePack, generated_at: "2026-09-26T09:00:00.000Z" }, now
  );
  assert.equal(stale.usable_offline, true);
  assert.equal(stale.freshness, "STALE");
});

console.log(`\nDEFENSOR core harness: ${passed} tests passed.`);
