import { evaluateEvidence } from "./provenance.mjs";

const RANK = Object.freeze({ UNAFFECTED: 0, WATCH: 1, DEGRADED: 2, BLOCKED: 3, UNKNOWN: 4 });
const DIMENSIONS = Object.freeze([
  "mobility","power","water","communications","health","shelter","supplies",
  "accessibility","household_separation","information_access"
]);

function overlaps(a = [], b = []) {
  const right = new Set(b);
  return a.some(value => right.has(value));
}

function areaRelevant(event, profile) {
  const eventAreas = event.geography || [];
  const configured = profile.configured_areas || [];
  if (!eventAreas.length || !configured.length) return null;
  return overlaps(eventAreas, configured);
}

function impactForDimension(effect, profile) {
  if (!effect) return "UNAFFECTED";
  const requiredTags = effect.dependency_tags || [];
  if (!requiredTags.length) return effect.state || "WATCH";

  const profileTags = profile.dependencies?.[effect.dimension] || [];
  if (overlaps(requiredTags, profileTags)) return effect.state || "WATCH";

  // Event can still matter locally even if it does not hit a declared dependency.
  return (effect.state === "BLOCKED" || effect.state === "DEGRADED") ? "WATCH" : (effect.state || "WATCH");
}

export function assessEventImpact(event, profile, now = new Date()) {
  const relevance = areaRelevant(event, profile);
  const evidence = evaluateEvidence(event.provenance || {}, now);

  const impacts = {};
  for (const dimension of DIMENSIONS) impacts[dimension] = "UNAFFECTED";

  if (relevance === false) {
    return { event_id: event.id, relevant: false, evidence, impacts };
  }
  if (relevance === null) {
    for (const dimension of DIMENSIONS) impacts[dimension] = "UNKNOWN";
    return { event_id: event.id, relevant: null, evidence, impacts };
  }

  for (const effect of event.effects || []) {
    if (!DIMENSIONS.includes(effect.dimension)) continue;
    impacts[effect.dimension] = impactForDimension(effect, profile);
  }

  return { event_id: event.id, relevant: true, evidence, impacts };
}

function maxImpact(assessments) {
  let state = "UNAFFECTED";
  for (const assessment of assessments) {
    for (const value of Object.values(assessment.impacts || {})) {
      if ((RANK[value] ?? -1) > (RANK[state] ?? -1) && value !== "UNKNOWN") state = value;
    }
  }
  return state;
}

function hasUncertainty(assessments) {
  return assessments.some(a =>
    a.relevant === null ||
    a.evidence.freshness_state !== "CURRENT" ||
    a.evidence.provenance_state === "CONFLICTING" ||
    a.evidence.provenance_state === "UNKNOWN" ||
    Object.values(a.impacts || {}).includes("UNKNOWN")
  );
}

export function buildMySituation({ events = [], profile = {}, guidance = [], sync = {}, now = new Date() }) {
  const assessments = events.map(event => assessEventImpact(event, profile, now));
  const relevant = assessments.filter(a => a.relevant !== false);
  const topImpact = maxImpact(relevant);
  const immediateGuidance = guidance.some(item => item.active && item.urgency === "IMMEDIATE");

  let situation_state = "UNKNOWN";
  if (immediateGuidance) situation_state = "ACTION";
  else if (topImpact === "BLOCKED" || topImpact === "DEGRADED") situation_state = "PREPARATION";
  else if (topImpact === "WATCH") situation_state = "ATTENTION";
  else if (relevant.length > 0 && !hasUncertainty(relevant) && sync.positive_current_baseline === true) situation_state = "NORMAL";

  return {
    computed_at: now.toISOString(),
    situation_state,
    assessments,
    top_personal_impact: topImpact,
    provenance: relevant.map(a => ({ event_id: a.event_id, ...a.evidence })),
    last_successful_sync: sync.last_successful_sync ?? null,
    information_age_ms: sync.information_age_ms ?? null,
    offline_pack_state: sync.offline_pack_state ?? "UNKNOWN",
  };
}
