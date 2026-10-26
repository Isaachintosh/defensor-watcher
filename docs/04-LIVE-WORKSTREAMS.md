# DEFENSOR live workstreams

Updated: 2026-09-26. Issues remain canonical.

## Governance / delivery
- #12 Scrum harness + GitHub Project — **Luna** — active.
- #13 Pages recovery — **Davi / Bruno / Nina** — active; Pages source enabled, workflow still failing before useful deploy steps.
- #17 harness documentation — **DONE** — reviewed canonical docs.

## Cognitive / stack
- #14 meu-cerebro registration — **DONE** — canonical dependency + registry reviewed.
- #15 full stack canon — **DONE** — architecture canon reviewed.

## Evidence / sources
- #16 research/source corpus — **DONE** — full 193-URL provenance index reviewed.

## Product/domain
- #2 MySituation + CivilImpactEngine — Davi / Helena.
- #3 Source Registry — Rafael.
- #4 Provenance Layer — Bruno / Rafael.
- #5 ReadinessProfile — Helena / Nina.
- #6 Offline Readiness Pack — Luca / Caio.
- #7 Protocol Harness — Beatriz / Luca.
- #8 MySituation UX — Nina / Helena.
- #9 BSX-001 — Caio / Marina.
- #10 Sensor Gap Matrix — Ícaro / Davi.
- #11 Adversarial reliability — Bruno / Samira.

## Current engineering evidence

- DEFENSOR Core Harness: **GREEN**
- Latest validated run: https://github.com/Isaachintosh/defensor-watcher/actions/runs/36239020818
- Executable modules now cover:
  - CivilImpactEngine / MySituation
  - provenance + freshness
  - source-registry invariants and source health
  - protocol selection / provenance gate
  - offline pack validation + restart restore
  - event ALERT/UPDATE/CANCEL lifecycle
  - degraded location context
- Prototype explicitly separates event severity from personal impact.

## Current delivery status

- #2–#11: **REVIEW / implementation continues**
- #12: **OPEN** — Project board exists; field/item population remains.
- #13: **BLOCKED** — `github-pages` environment rejects the research branch.
- #14–#17: **DONE** — canonical stack/cognition/source/harness documentation reviewed and closed.

## Integration gates
1. Pages must become green before #13 closes.
2. Company-stack DEFENSOR overlay PR #9 remains experimental until runtime smoke passes.
3. End-user DEFENSOR does not depend on the 37-agent development runtime.
4. Hermes remains PLANNED until implemented/verified.
5. Structural work follows `AGENTS.md` no-solo rule.
