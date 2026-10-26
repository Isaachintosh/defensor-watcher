# GitHub Project / Scrum schema — DEFENSOR WATCHER

Date: 2026-09-26

## Governance

Scrum Master: **Luna**  
Product Owner: **Helena Prado**  
Tech Lead / CTO: **Davi Nakamura**  
Reliability: **Bruno Sato**

The GitHub Project is the operational board. Repository issues remain the canonical work items.

## Project fields

### Status
- Backlog
- Ready
- In Progress
- Review
- Blocked
- Done

### Phase
- Discovery
- Foundation
- Situational Core
- Protective Companion
- Local Intelligence
- Field Beta
- Release

### Sprint
- S0 Foundation
- S1 Map / Location / Offline
- S2 Sources / Live Events
- S3 Lifecycle / MySituation / Readiness
- S4 Protocols / Offline RAG
- S5 Check-in / P2P
- S6 Offline Interpreter
- S7 Tool Core / Agents
- S8 Sensors / Radar Lab
- S9 Hardening / SRE
- S10 Pilot / RC

### Other fields
- Agent Owner
- Reviewer(s)
- Capability
- Evidence Gate
- Risk / Blocker
- Release

## Initial issue mapping

| Issue | Phase | Sprint candidate | Owner | Reviewer |
|---|---|---|---|---|
| #2 MySituation + CivilImpactEngine | Situational Core | S3 | Davi / Helena | Samira / Nina |
| #3 Source Registry | Situational Core | S2 | Rafael | Davi / Sofia |
| #4 Provenance Layer | Foundation / Situational Core | S0/S2 | Bruno / Rafael | Samira |
| #5 ReadinessProfile | Situational Core | S3 | Helena | Nina / Bruno |
| #6 Offline Readiness Pack | Foundation | S1 | Luca / Caio | Bruno |
| #7 Protocol Harness | Protective Companion | S4 | Beatriz / Luca | Sofia |
| #8 MySituation UX | Situational Core | S3 | Nina / Helena | Davi / Bruno |
| #9 BSX-001 stress harness | Cross-sprint validation | S1/S3 | Caio / Marina | Bruno |
| #10 Sensor Gap Matrix | Local Intelligence | S8 | Ícaro | Davi / Bruno |
| #11 Adversarial reliability | Field Beta / cross-sprint | S9 + continuous | Bruno / Samira | Davi |
| #13 Pages recovery | Foundation / Delivery | S0 | Davi | Bruno / Nina |
| #12 Scrum harness | Governance | continuous | Luna | Helena / Davi |

## Required views

1. **Current Sprint** — Status grouped, filtered by current Sprint.
2. **Roadmap** — grouped by Phase and Sprint.
3. **Owners** — grouped by Agent Owner.
4. **Blocked** — Status=Blocked.
5. **Reliability / Safety** — provenance, offline, QA, security work.
6. **Release Evidence** — Done items with evidence links.

## Definition of Ready

A task must have:
- user/system outcome;
- owner;
- reviewer;
- acceptance criteria;
- dependencies;
- evidence gate;
- sprint candidate.

## Definition of Done

A task is Done only when:
- acceptance criteria pass;
- evidence exists;
- required reviewer signs off;
- docs/contracts/tests are updated;
- known residual risks are recorded;
- linked PR/commit/run is traceable.
