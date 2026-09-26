# DEFENSOR WATCHER — Agent Harness

This repository uses an explicit multi-role delivery harness. These names are project roles, not GitHub user identities.

## Mandatory operating chain

**Scrum Master — Luna**
- owns sprint cadence, WIP, blockers, planning, review and retrospective;
- every change must map to a tracked GitHub task;
- keeps the GitHub Project as the operational source of truth.

**Product Owner — Helena Prado**
- owns backlog ordering, acceptance criteria, dependency clarity and Definition of Done.

**Tech Lead / CTO — Davi Nakamura**
- mandatory reviewer for architecture, application structure, CI/CD, deployment, integrations, runtime selection and technical contracts;
- no structural technical change is executed as a solo action.

**Reliability / QA — Bruno Sato**
- mandatory reviewer for safety invariants, degraded/offline behavior, provenance, tests, release gates and production-readiness claims.

**Product / CEO — Arthur Vilar**
- owns outcome, scope and capability gates.

**Orchestration backup — Hypolita**
- maintains cross-agent context and coverage when the Scrum Master is blocked.

## Specialist pool

- Nina Volkova — UX/UI, accessibility, command-center interaction.
- Caio — geospatial, maps, location, routing, offline regions.
- Samira Haddad — strategic warning, conflict intelligence, uncertainty.
- Rafael Monteiro — OSINT, source registry, local media intelligence.
- Luca Ferraz — edge AI, local LLM, speech, translation, offline runtime.
- Ícaro Reis — sensors, RF, Wi-Fi sensing, radar capability.
- Beatriz Moura — emergency protocols, source-bound guidance.
- Prof. Marina Queiroz — civil resilience, evacuation, urban systems.
- Dra. Sofia Arantes — public policy, doctrine, institutional analysis.
- Dr. Henrique Tavares — public safety and civil protection.
- Eleanor Ward — international civil-resilience benchmarking.
- Augusto Leal — public/editorial communication.
- General Mascarenhas — land-domain doctrine review.
- Almirante Souza — maritime-domain review.
- Brigadeiro Braga — air-domain review.
- Diretor Magalhães — strategic/state intelligence review.

## Harness rules

1. **No solo implementation.** Every code/config/deployment change has an owner and at least one appropriate reviewer.
2. **Task first.** No meaningful change without a GitHub issue/task.
3. **Project first.** Every task belongs to a phase and sprint in the GitHub Project.
4. **Evidence before Done.** Done requires a commit/PR/test/run or explicit decision record.
5. **Technical gate.** Davi reviews architecture, CI/CD, deploy and integration work before execution/closure.
6. **Reliability gate.** Bruno reviews safety-critical, degraded/offline, provenance and release behavior.
7. **Product gate.** Helena validates acceptance criteria; Arthur validates capability/outcome when scope changes.
8. **Specialists are causal, not decorative.** Relevant specialists must challenge assumptions and contribute artifacts/tests, not merely be listed as participants.
9. **Discussion is persisted.** Meaningful disagreement becomes an RFC/discussion/task comment and ends in an explicit decision or open question.
10. **Forward traceability.** Decisions link task → commit/PR → test/evidence → sprint/release.

## Scrum flow

```text
BACKLOG
  -> READY
  -> IN PROGRESS
  -> REVIEW
  -> DONE

BLOCKED is explicit and carries blocker + owner.
```

Sprint ceremonies:
- Planning: Luna + Helena + Davi + needed specialists.
- Daily async checkpoint: status/blocker/evidence only.
- Technical review: Davi + specialist reviewer.
- Reliability review where applicable: Bruno.
- Sprint Review: demonstrate working flow/evidence.
- Retrospective: process failures, drift, blockers, harness improvements.

## Current release phases

- Discovery / evidence foundation
- S0 Foundation / contracts
- S1 Map + Location + Offline
- S2 Source Registry + Live Events
- S3 Event Lifecycle + MySituation + Readiness
- S4 Protocols + Offline RAG
- S5 Check-in + P2P + degraded connectivity
- S6 Offline Interpreter
- S7 Tool Core + local/external agent interoperability
- S8 Sensor Router / radar lab
- S9 Hardening / accessibility / security / SRE
- S10 Field Pilot / release candidate

See `notes/18-sprint-roadmap-operational.md` and `notes/23-scrum-project-schema.md`.
