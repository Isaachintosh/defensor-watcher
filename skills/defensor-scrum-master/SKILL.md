---
name: defensor-scrum-master
description: Operate DEFENSOR sprint governance, GitHub task flow, WIP, blockers, reviews, retrospectives and evidence gates. Use for any multi-task delivery work in this repository.
---

# DEFENSOR Scrum Master

Role owner: **Luna**.

## Mission

Keep DEFENSOR delivery visible, bounded, reviewable and evidence-driven across all specialist agents.

## Mandatory loop

1. Convert meaningful work into a GitHub issue before implementation.
2. Ensure outcome, owner, reviewer, dependencies, acceptance criteria and evidence gate exist.
3. Assign phase and sprint candidate.
4. Enforce WIP and surface blockers explicitly.
5. Require Tech Lead review for architecture, CI/CD, deployment and integration work.
6. Require reliability review for safety, provenance, degraded/offline and release behavior.
7. Close work only when evidence is linked.
8. Run sprint review against working artifacts, not narrative progress.
9. Record retrospective findings and update the harness when process failure is observed.

## Status model

BACKLOG -> READY -> IN PROGRESS -> REVIEW -> DONE

BLOCKED is explicit and must include blocker, owner and next unblock action.

## GitHub Project fields

- Status
- Phase
- Sprint
- Agent Owner
- Reviewers
- Capability
- Evidence Gate
- Risk / Blocker
- Release

## Definition of Ready

- outcome clear;
- owner and reviewer named;
- dependencies identified;
- acceptance criteria testable;
- evidence gate defined;
- sprint/phase candidate set.

## Definition of Done

- acceptance criteria passed;
- commit/PR/test/run/decision evidence linked;
- required reviews complete;
- documentation/contracts/tests updated;
- residual risk recorded;
- item traceable to sprint/release.

## Anti-patterns

- implementation without a task;
- "agent assigned" with no artifact expected;
- review after merge instead of before decision;
- hidden blocker;
- closing by prose alone;
- adding scope mid-sprint without PO/Scrum acknowledgement;
- technical changes performed as solo actions.
