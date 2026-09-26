# DEFENSOR WATCHER — Stack Canon

**Date:** 2026-09-26  
**Status:** living canonical map for maintainers, Codex/Cursor and project agents.

This document separates **CURRENT**, **EXPERIMENTAL**, **PLANNED** and **UNKNOWN**. Chat intent does not become current implementation until a repository artifact and its evidence gate exist.

## Repository topology

### DEFENSOR — CURRENT
- Repo: `Isaachintosh/defensor-watcher` (public).
- Active branch: `research/app-first-landscape-2026-09-25`.
- Current artifacts: research corpus, domain contracts, static prototype, test fixtures, GitHub Actions Pages workflow.
- Product core: situation-driven `MySituation`, `CivilImpactAssessment`, provenance, readiness and offline contracts.

### OdooCast agent-company stack — CURRENT / EXPERIMENTAL CERTIFICATION
- Repo: `Isaachintosh/openclaw-frellmapi-stack-agents` (private).
- Role: development/orchestration harness; **not** an end-user runtime dependency of DEFENSOR.
- Main-branch runtime presently documents:
  - Claw3D;
  - OpenClaw Gateway;
  - FreeLLMAPI;
  - `meu-cerebro/` Cérebro INEVITA submodule;
  - Cérebro peer;
  - Arquivologista.
- Stack canon still requires runtime smoke before certification claims.

### Cérebro INEVITA — CURRENT canonical upstream
- Repo: `gabrielzucco/cerebro-inevita`.
- Canonical entrypoints:
  - `COMECE-AQUI.md`
  - `AGENTS.md`
  - `CLAUDE.md`
  - `skills/_CATALOGO.md`
  - `.agents/skills/<skill>/SKILL.md`
- OdooCast `.gitmodules` maps `meu-cerebro/` directly to this upstream.

### DEFENSOR Cérebro overlay — EXPERIMENTAL
- Repo: `Isaachintosh/openclaw-frellmapi-stack-agents`.
- Branch: `feature/defensor-cerebro-skills-2026-09-25`.
- PR #9: DEFENSOR emergency/sensing skill overlay.
- Overlay path: `cerebro-skills/`.
- Rule: extend externally; do not silently fork the canonical brain.

### Hermes migration — PLANNED / NOT MATERIALIZED
No Hermes implementation was found in the inspected stack repository. Treat migration intent as planning until code/contracts/smoke evidence exist.

## Product architecture

```text
authoritative / scientific / operational sources
                    |
                    v
             Source Registry
                    |
                    v
Source -> Observation -> EventCandidate -> Event
                                    |
                   +----------------+---------------+
                   v                                v
        CivilImpactAssessment              ProvenanceRecord
                   |                                |
                   +---------------+----------------+
                                   v
                              GuidanceSet
                                   |
                                   v
                              MySituation
                     /             |             \
                    v              v              v
                 mobile UX    offline pack    notifications
```

Conceptual engines:
- StrategicWarningEngine
- CivilianReadinessEngine
- Civilian Evacuation Orchestrator

Safety invariants:
- `EVENT_SEVERITY != PERSONAL_IMPACT`
- `STALE != SAFE`
- `UNKNOWN != NORMAL`
- `OFFLINE != NO_EVENT`
- `NO_GUIDANCE_WITHOUT_PROVENANCE`

## Evidence classes

Keep distinct:
- official authority;
- scientific/operational;
- curated/verified;
- media/OSINT;
- community;
- experimental local sensor.

Community/sensor evidence never silently becomes authoritative.

## Offline contract

The versioned ReadinessPack carries:
- geographic scope;
- map metadata;
- reviewed protocols;
- household plan;
- meeting points;
- essential contacts;
- language pack;
- cached events + provenance;
- last successful sync;
- explicit information age.

Core access must not require a remote LLM.

## AI role

Models may retrieve, explain, translate, summarize and select typed tools under policy. They do not independently create authoritative orders, event existence, severity, cancellation, safe-route claims or “you are safe” conclusions.

## Development harness vs product runtime

```text
DEVELOPMENT HARNESS
Human -> Scrum/PO -> Tech Lead -> specialists -> QA/evidence -> GitHub

PRODUCT RUNTIME
Sources -> deterministic domain core -> offline/mobile surfaces
```

The end-user app must remain operable without the 37-agent development stack.

## GitHub delivery surfaces

- Issues: canonical work items.
- Project: https://github.com/users/Isaachintosh/projects/6/views/1
- PR #1: current app-first research/architecture branch.
- Pages recovery: issue #13.
- `AGENTS.md`: harness contract.
- `notes/23-scrum-project-schema.md`: sprint/project schema.

## Status semantics

- **CURRENT** — observed in inspected repo.
- **EXPERIMENTAL** — implemented/branched but validation remains.
- **PLANNED** — intended without verified implementation.
- **UNKNOWN** — evidence missing/insufficient.

Never upgrade status by plausibility.

## Companion canon

- `docs/01-MEU-CEREBRO-INTEGRATION.md`
- `docs/02-AGENT-HARNESS.md`
- `docs/03-SOURCE-CORPUS.md`
- `docs/04-LIVE-WORKSTREAMS.md`
- `registry/cognitive-stack.v1.json`
- `registry/research-source-manifest.v1.json`
