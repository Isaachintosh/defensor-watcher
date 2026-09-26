# DEFENSOR × meu-cerebro / Cérebro INEVITA

**Owner:** Rafael Monteiro  
**Architecture review:** Davi Nakamura  
**Harness:** Luna / Helena Prado  
**Reliability review:** Bruno Sato

## Canonical relationship

Canonical brain: `gabrielzucco/cerebro-inevita`.

The OdooCast stack `Isaachintosh/openclaw-frellmapi-stack-agents` registers:

```ini
[submodule "meu-cerebro"]
    path = meu-cerebro
    url = https://github.com/gabrielzucco/cerebro-inevita.git
```

Inside the company stack it is mounted as `/app/meu-cerebro`.

## Canonical recovery order

1. `COMECE-AQUI.md`
2. `AGENTS.md`
3. `CLAUDE.md`
4. `skills/_CATALOGO.md`
5. relevant `.agents/skills/<skill>/SKILL.md`
6. only then necessary method/protocol/system/context artifacts.

Skill != System: a skill is reusable judgment; a system is result + pipeline + judgment + measurement/feedback/version.

## Source-of-truth boundary

- Real sources remain in their own home.
- The brain points to, distills and retrieves relevant context.
- Do not create a second canonical copy of every source.
- Private context is not copied into public/shared artifacts.
- Preserve `DECLARED / OBSERVED / INFERRED / UNKNOWN`.

## DEFENSOR overlay

DEFENSOR-specific capabilities remain outside the canonical upstream, in company-stack PR #9, branch `feature/defensor-cerebro-skills-2026-09-25`, path `cerebro-skills/`.

Documented overlay skills:
1. defensor-reuse-scout
2. defensor-source-registry
3. defensor-situational-watch
4. defensor-sensor-capability
5. defensor-offline-interpreter
6. defensor-protocol-harness
7. worldmonitor-intelligence
8. defensor-conflict-intelligence
9. defensor-command-center-ux
10. defensor-ceo-product-strategy
11. defensor-cto-delivery-architecture
12. defensor-cmo-gtm
13. defensor-product-owner
14. defensor-map-location-offline
15. defensor-sprint-orchestrator
16. defensor-local-media-intelligence

The DEFENSOR repo additionally has `skills/defensor-scrum-master/SKILL.md`. Promotion of that skill into the external overlay requires its own review.

## Why there is no second meu-cerebro submodule in DEFENSOR

A second physical submodule would create another pin/version/update surface and ambiguity over authoritative brain version.

Current decision: **register and reference the canonical dependency here; keep the physical submodule owned by the company stack.**

If a future DEFENSOR build needs brain files locally, create an ADR and dependency task first.

## Cognitive contract applied to DEFENSOR

1. Selective retrieval, not full-brain injection.
2. Relevant specialist participation for cross-domain decisions.
3. Provenance and epistemic state preserved.
4. Corrections do not silently become durable rules.
5. Human gates stay explicit.
6. Large artifacts travel by reference, not retransmission.

See `registry/cognitive-stack.v1.json`.
