# Redesign UX — situational awareness, conflito e command center

Data: 2026-09-25
Estado: mockup SPA atualizado; dados sintéticos.

## Correção de escopo

Meteorologia não é o centro do produto. O DEFENSOR trata weather como uma classe dentro de uma superfície de consciência situacional mais ampla.

Classes primárias:
- guerra e conflito armado;
- ataques, explosões, shelling, air raids e drone/missile events;
- protestos, riots e civil unrest;
- ordens de evacuação, curfew, fronteira e airspace;
- transporte e rotas marítimas;
- energia, telecom, internet e infraestrutura;
- terremoto, tsunami, vulcão, fogo, flood/storm/heat;
- saúde e ambiente;
- sensores locais;
- SOS/check-in manual.

## Fontes de conflito pesquisadas

### ACLED

API oficial para dados de political violence, protests, riots e conflict events. Deve ser adapter primário para eventos recentes quando termos/acesso forem compatíveis.

https://acleddata.com/api-documentation/getting-started

### UCDP

GED e Candidate Events. O Candidate é publicado mensalmente e fornece base global estruturada com no máximo aproximadamente um mês de atraso; é excelente baseline histórico/estruturado, não substituto de alerta operacional instantâneo.

https://ucdp.uu.se/downloads/

### GDELT

Event Database e news/context layer. Útil para sinais e descoberta, mas requer deduplicação, corroboration e separação entre reportagem e fato operacional.

https://www.gdeltproject.org/

### WorldMonitor

Já possui skills/adapters para conflict events, unrest, country risk e infrastructure. Deve ser usado como camada agregadora opcional, preservando a origem dos dados.

## Skill layer

No Cérebro foram adicionadas:
- defensor-conflict-intelligence;
- defensor-command-center-ux.

A primeira normaliza conflito/unrest e regras de proveniência. A segunda governa SPA, mapa, responsive design, light/dark, accessibility e anti-slop visual.

## Referências de UX atuais

### Linear

O refresh de março de 2026 buscou uma interface mais calma e consistente, com headers/navigation previsíveis e sidebars visualmente mais recuadas para o conteúdo principal dominar.

Aplicação no DEFENSOR:
- rail discreto;
- localização e ações previsíveis;
- mapa domina o viewport;
- painel de detalhe aparece apenas quando necessário.

### Apple HIG

Dark mode deve usar cores adaptativas e manter contraste; foreground/background não são simples inversões. Accent color deve ser usado com parcimônia.

Aplicação:
- tokens semânticos;
- temas light/dark independentes;
- cor reservada a estado, categoria e foco.

### Map-first / live-state products

Windy, Flighty e interfaces operacionais atuais mostram que mapas, timelines e estados vivos funcionam melhor quando o conteúdo principal permanece visível e os controles entram como overlays/panels pequenos.

Aplicação:
- mapa full workspace;
- layer chips;
- detail rail/bottom sheet;
- legenda compacta;
- feed temporal como segunda visualização, não home de cards.

### Command-driven products

Raycast/Linear popularizaram search/command access para usuários de desktop sem remover navegação tradicional.

Aplicação:
- Ctrl/Cmd+K e slash abrem command palette;
- navegação e filtro também permanecem clicáveis/touch.

## Estrutura do mockup

Desktop:

```
rail | topbar
     | ------------------------------------------------
     | map / situational canvas       | context panel
     |                                |
     | layer strip                    | event detail
     | markers                        | provenance
     | compact situation summary      | next action
```

Mobile:

```
compact topbar
--------------------
map / feed / content
floating layer chips
event markers
bottom sheet detail
--------------------
bottom navigation
```

## Design tokens

Semânticos, não hard-coded por componente:
- canvas;
- surface;
- surface-2/3;
- elevated;
- ink / ink-2 / ink-3;
- line;
- accent;
- success;
- caution;
- danger;
- conflict;
- unrest;
- infra;
- hazard;
- sensor;
- focus.

## Regras de representação de conflito

- fonte e timestamp sempre visíveis;
- ator/dano/vítimas entram como claim quando não corroborados;
- contested é estado explícito;
- um conflito no país não significa ameaça individual ao usuário;
- dataset especializado, autoridade operacional, mídia e OSINT aparecem em classes distintas;
- evento pode afetar readiness via proximidade, evacuação, infraestrutura, mobilidade ou ordem oficial, não apenas por existir.

## Critérios de UX

Em 10 segundos o usuário deve conseguir:
1. saber se o dado é demo/real;
2. identificar as classes de evento ativas;
3. localizar sinais relevantes;
4. abrir impacto/fonte/próxima ação;
5. distinguir evento oficial/estruturado/sensor experimental;
6. trocar entre mapa e feed.

No mobile:
- nenhum desktop espremido;
- detail vira bottom sheet;
- nav fica no polegar;
- filtros são horizontais;
- ações principais permanecem visíveis sem hover.

## Arquivos

- prototype/index.html
- prototype/styles.css
- prototype/app.js
- prototype/README.md
