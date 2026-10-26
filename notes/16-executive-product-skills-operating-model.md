# Skills executivas e operating model do DEFENSOR — 2026-09-25

## Objetivo

Transformar a pesquisa, o mockup e a arquitetura em ciclos de entrega coordenados por quatro lentes:

- CEO — direção, outcomes, portfolio e gates;
- CTO — arquitetura, reuse-first, risco técnico e delivery;
- CMO — mercado, posicionamento, activation/trust e launch;
- PO — backlog, stories, acceptance criteria, dependências e sprints.

## Skills upstream pesquisadas

### CEO / CTO / CMO

O repositório MIT `alirezarezvani/claude-skills` publica skills específicas de:
- CEO Advisor;
- CTO Advisor;
- CMO Advisor;
- CPO/boardroom/orchestration.

Padrões úteis absorvidos:
- CEO trabalha por direção, capital allocation e decision gates;
- CTO usa build-vs-buy, ADRs, technology evaluation e engineering metrics;
- CMO conecta positioning, growth model, budget e go-to-market;
- decisões cross-functional passam por owners claros e evidence review.

Fonte:
https://github.com/alirezarezvani/claude-skills

### Product / PO

`deanpeters/Product-Manager-Skills` publica:
- product-strategy-session;
- prioritization-advisor;
- roadmap-planning;
- epic/user-story decomposition e discovery workflows.

`a5c-ai/babysitter` contém um sprint-planning skill do BMAD Method com capacity/dependency planning.

Fontes:
- https://github.com/deanpeters/Product-Manager-Skills
- https://github.com/a5c-ai/babysitter

## Skills DEFENSOR criadas no Cérebro overlay

- `defensor-ceo-product-strategy`
- `defensor-cto-delivery-architecture`
- `defensor-cmo-gtm`
- `defensor-product-owner`
- `defensor-map-location-offline`

As skills externas ficam no overlay OdooCast e não alteram o submódulo canônico `meu-cerebro`.

## Mapeamento organizacional

O organograma atual possui CEO e CTO diretamente.

O papel de CMO é exercido operacionalmente pelo eixo:
- CGO — Growth, Receita e Go-to-Market;
- Manager Marketing;
- Estrategista de Marca;
- Growth & Analytics.

A skill `defensor-cmo-gtm` foi ligada a esses agentes.

O PO é exercido pelo eixo:
- Manager de Projetos;
- Especialista de Escopo/Requisitos;
- Especialista de Sprints/Capacidade;
- PMO;
- Riscos/Dependências.

A skill `defensor-product-owner` foi ligada a esse conjunto e ao Cérebro.

## Operating loop

```text
CEO
outcome / portfolio gate
        |
        v
PO ---------------- CMO
backlog              market/user evidence
        \           /
         \         /
          v       v
             CTO
 architecture / reuse / risk
              |
              v
          specialists
              |
              v
         sprint evidence
              |
              +----> review ----> CEO/PO decision
```

## Regras

1. Feature visível no mockup deve ter capability ID.
2. Capability deve possuir owner e evidence gate.
3. Spike técnico é separado de delivery.
4. SDK/API existente é avaliado antes de build interno.
5. Dependency desbloqueadora pode ter prioridade maior que uma feature visual.
6. Sprint review demonstra fluxo real, não screenshot.
7. CMO só publica claim de capability com status conhecido: prototype, lab, beta, production ou partner-dependent.
8. CEO decide continuidade por outcome/evidência.
9. PO mantém Definition of Ready e Definition of Done.
10. CTO mantém ADR e migration path para dependências relevantes.

## Review executivo por sprint

### CEO
- qual outcome avançou?
- qual hipótese foi confirmada ou enfraquecida?
- qual capability passa para próximo gate?

### CTO
- qual risco técnico foi removido?
- qual dependência/vendor foi validada?
- qual degraded/offline path foi provado?

### CMO
- qual benefício agora pode ser demonstrado de forma real?
- qual segmento/uso deve testar isso?
- que fricção/trust concern apareceu?

### PO
- quais stories concluíram DoD?
- quais dependências mudaram?
- qual vertical slice fica disponível no próximo sprint?
