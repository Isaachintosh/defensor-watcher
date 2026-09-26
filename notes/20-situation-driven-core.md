# Situation-driven core — 2026-09-26

Status: architecture contract v0.1. Research/prototype branch; not a production life-safety claim.

## Decision

DEFENSOR is **situation-driven**.

The primary projection is `MySituation`, not a feed and not a standalone readiness score.

```text
Source
  -> Observation
  -> EventCandidate
  -> Event
  -> CivilImpactAssessment
  -> GuidanceSet
  -> MySituation
```

Three engines contribute to the projection:

```text
StrategicWarningEngine ----┐
CivilianReadinessEngine ---+--> MySituation --> UX
EvacuationOrchestrator ----┘
            ^
      ReadinessProfile
```

## Invariants

- `EVENT SEVERITY != PERSONAL IMPACT`.
- `STALE != SAFE`.
- `UNKNOWN != NORMAL`.
- `OFFLINE != NO EVENT`.
- No guidance without provenance/source binding.
- LLMs may explain, translate and retrieve reviewed material; they do not create authoritative emergency orders or critical state transitions.
- Community and experimental sensing remain separate evidence classes and cannot independently promote official critical state.

## MySituation minimum projection

- local situation state;
- what changed;
- personal civil impact;
- applicable sourced guidance;
- relevant local/household plan;
- provenance state;
- source timestamps;
- last successful sync;
- information age;
- offline-pack status.

## CivilImpact dimensions v0

- mobility;
- power;
- water;
- communications;
- health;
- shelter;
- supplies;
- accessibility;
- household separation;
- information access.

Each dimension is evaluated from known facts and explicit profile capabilities. Unknown inputs remain unknown.

## GitHub work packages

- #2 Situation-driven domain / CivilImpactEngine
- #3 Source Registry
- #4 Provenance Layer
- #5 ReadinessProfile
- #6 Offline Readiness Pack
- #7 Protocol Harness
- #8 MySituation UX
- #9 Baixada Santista BSX-001
- #10 Sensor Gap Matrix
- #11 Adversarial reliability suite
