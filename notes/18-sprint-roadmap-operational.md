# DEFENSOR WATCHER — Sprint Roadmap operacional

Data-base: 2026-09-25
Cadência baseline: 2 semanas por sprint.
Status: plano V1; capacidade numérica será preenchida após sizing da equipe.

## Release map

```text
R0 · Situational Core
S0  Foundation
S1  Map + Location + Offline
S2  Source Registry + Live Events
S3  Feed + Event Lifecycle + Readiness

R1 · Protective Companion
S4  Protocols + Offline RAG
S5  Check-in + P2P + Degraded Connectivity
S6  Offline Interpreter

R2 · Local Intelligence
S7  Gemini/AppFunctions/WebMCP + Tool Core
S8  Sensor Router + Wi-Fi/Radar Lab

R3 · Field Beta
S9  Hardening + Accessibility + Security + SRE
S10 Field Pilot + GTM + Release Candidate
```

---

## Sprint 0 — Foundation / contracts

### Goal
Transformar o mockup em componentes rastreáveis e contratos de domínio.

### Entregas
- Android project shell Kotlin/Compose;
- backend adapter shell;
- Defensor Tool Core interfaces;
- CanonicalEvent;
- LocationProvider;
- MapProvider;
- RouteProvider;
- OfflinePackManager;
- SensorEvent;
- ProtocolPack;
- Source Registry schema;
- feature flags;
- CI/test skeleton;
- ADR template.

### Mockup coberto
- navigation shell;
- themes;
- route/view structure;
- synthetic fixtures.

### Owners
- CEO: approve release outcomes;
- CTO: contracts/ADRs;
- CMO: personas/use cases;
- PO: capability inventory/backlog.

### Gate
Every visible mockup item has capability ID + epic + owner.

---

## Sprint 1 — Map, OS location and offline region

### Goal
Mostrar posição real em mapa real e continuar funcionando após perda de rede.

### Entregas
- Android FusedLocationProviderClient adapter;
- current/last location;
- coarse/fine permission states;
- MapLibre Native;
- PMTiles file from device storage;
- OfflinePackManager V1;
- H3/location cell;
- offline restart;
- map style light/dark;
- map center/follow-me;
- simulated provider for tests;
- first simple geofence/applicability test.

### Parallel spike
- Ferrostar + hosted Valhalla;
- HERE SDK offline region benchmark.

### Mockup operational
- Situation map;
- theme;
- current-location context;
- basic layers.

### Acceptance
- airplane mode after pack download: map opens and current GNSS-derived location can be displayed when OS provides a fix;
- app distinguishes fresh/stale location;
- coarse permission keeps core working;
- downloaded region survives process restart;
- no runtime dependency on remote tile server for downloaded area.

---

## Sprint 2 — Source Registry and real situational layers

### Goal
Substituir fixtures por eventos reais de pelo menos três domínios e ativar a descoberta/ingestão inicial de imprensa local.

### Adapters target
1. conflict/unrest: one structured source accessible under approved terms;
2. natural hazard: CAP/GDACS/USGS or equivalent;
3. infrastructure/operational source;
4. local media: Atlas da Notícia (Brazil), Media Cloud and one direct publisher RSS/sitemap path.

### Entregas
- ingestion workers;
- immutable raw payload;
- canonicalizer;
- source provenance;
- freshness;
- geometry/H3 indexing;
- event dedup;
- contested claims model;
- source health;
- LocalMediaSource registry;
- publisher geography separated from article/event geography;
- direct RSS/Atom/news-sitemap ingestion;
- local-news markers with provenance.

### Mockup operational
- layer chips;
- map markers;
- source registry screen.

### Gate
At least 3 real operational source families plus one local-media path visible in dev environment with source + timestamp + geometry.

---

## Sprint 3 — Event lifecycle, feed and Readiness Engine

### Goal
Fazer o mapa e feed representarem situação viva.

### Entregas
- event timeline;
- Alert/Update/Cancel semantics where source supports;
- conflict event update model;
- readiness policy V1;
- applicability;
- stale/degraded/unknown;
- event details;
- source conflict display;
- news dedup and syndication detection;
- MediaCluster with distinct independent publishers;
- official corroboration references for local-media clusters;
- developing / multi-source / contested / corroborated media states;
- notification pipeline;
- command search over events/sources/actions.

### Mockup operational
- feed;
- event contextual panel;
- readiness pill;
- situation summary;
- command palette.

### Gate
One end-to-end live event can enter, update, expire/cancel and persist offline; one local-media story cluster must deduplicate syndicated copies and preserve independent sources.

---

## Sprint 4 — Protocols + offline RAG

### Goal
Transformar Protocols em guidance consultável offline.

### Entregas
- versioned ProtocolPack;
- Room/SQLite;
- FTS;
- vector search candidate;
- 5-8 reviewed protocol packs;
- source/version display;
- Protocol Tool;
- structured action proposal;
- local-model interface with deterministic fallback.

### Mockup operational
- Protocols page;
- "open protocol" from event.

### Gate
User can resolve a protocol from natural-language query in airplane mode and see its source/version.

---

## Sprint 5 — Check-in, local coordination and connectivity degradation

### Goal
Operar comunicação pessoal mínima em evento real.

### Entregas
- check-in composer;
- explicit recipient/location preview;
- OS share/SMS bridge;
- Nearby Connections spike;
- queued check-in state;
- sent/delivered distinction where available;
- local status record;
- connectivity state;
- optional emergency contact profile.

### Mockup operational
- event "Prepare check-in" action;
- degraded/offline states.

### Gate
Check-in can be prepared offline and handed to an available channel when connectivity returns or local P2P is available.

---

## Sprint 6 — Offline Interpreter

### Goal
Entregar conversação bilateral no aparelho.

### Entregas
- VAD;
- STT runtime adapter;
- language ID;
- translation;
- TTS;
- bilateral turn state;
- emergency phrasebook;
- protocol handoff;
- model download manager;
- performance/battery benchmark.

### Reuse candidates
- sherpa-onnx;
- soniqo/speech-android;
- ML Kit Language ID/Translation;
- ML Kit speech on capable devices;
- whisper.cpp fallback.

### Mockup operational
- Interpreter page.

### Gate
Two-way demo in at least PT↔EN and PT↔one additional target language fully offline after model downloads.

---

## Sprint 7 — Local agent + Gemini/Chrome interoperability

### Goal
Expor as mesmas capabilities para agente local e ecossistemas Android/web.

### Entregas
- ADK/local runtime adapter;
- Gemini Nano/AICore capability probe;
- LiteRT-LM/Gemma path;
- structured outputs;
- AppFunctions tools;
- WebMCP companion tools;
- remote MCP adapter;
- permission/confirmation policy for side effects.

### Mockup operational
- command palette becomes Tool Core client;
- assistant actions reuse same schemas.

### Gate
Same `getActiveAlerts`, `getProtocol` and `startInterpreter` contracts callable from local agent and one external agent surface.

---

## Sprint 8 — Sensor Router / radar

### Goal
Transformar a tela Sensors em laboratório físico real.

### Entregas
- SensorCapabilityRouter;
- ESP32 esp_wifi_sensing adapter;
- BLE bridge;
- calibration flow;
- typed motion/presence SensorEvent;
- quality/confidence metadata;
- Acconeer or alternative radar spike;
- sensor session persistence;
- sensor UI live state.

### Mockup operational
- Sensors page;
- radar field;
- capability cards.

### Gate
One Wi-Fi sensing backend and one alternate sensing/radar backend produce normalized events in hardware test.

---

## Sprint 9 — Hardening

### Goal
Transformar capabilities em beta de campo.

### Entregas
- accessibility;
- 320px→tablet/desktop behavior;
- dark/light/system parity;
- crash reporting;
- adapter health;
- local database migrations;
- encryption/secret handling;
- threat model update;
- battery profiling;
- offline chaos tests;
- source outage simulation;
- background permission test matrix;
- device matrix;
- incident logging.

### Gate
Field-test checklist passes on target Android devices.

---

## Sprint 10 — Pilot / GTM / RC

### Goal
Colocar o sistema nas mãos de usuários piloto e medir comportamento real.

### CEO
- pilot go/no-go;
- portfolio gate for next release.

### CTO
- RC architecture sign-off;
- SLO/reliability scorecard;
- vendor/TCO decision for routing/maps.

### CMO
- segmented onboarding;
- trust/positioning test;
- pilot recruitment;
- activation funnel;
- release messaging tied to actual capability status.

### PO
- pilot scripts;
- issue triage;
- backlog reprioritization;
- release notes;
- evidence log.

### Gate
Pilot users complete:
- situational map;
- event inspection;
- protocol retrieval offline;
- check-in;
- interpreter;
- one sensor-lab flow where hardware is available.

---

# Capability → sprint matrix

| Mockup / capability | Sprint |
|---|---:|
| SPA/app navigation shell | S0 |
| light/dark/system | S0/S9 |
| map renderer | S1 |
| current location | S1 |
| offline map | S1 |
| geofencing/applicability | S1/S3 |
| conflict/unrest layers | S2 |
| infra layer | S2 |
| weather/natural hazards | S2 |
| source registry | S2 |
| local media registry + direct feeds | S2 |
| local media triangulation/clusters | S3 |
| event detail/provenance | S3 |
| feed/timeline | S3 |
| readiness | S3 |
| command/search | S3 |
| push/events | S3 |
| protocols | S4 |
| offline RAG | S4 |
| check-in | S5 |
| P2P/local comm | S5 |
| interpreter | S6 |
| local LLM | S7 |
| Gemini/AppFunctions | S7 |
| Chrome/WebMCP | S7 |
| Wi-Fi sensing | S8 |
| radar alternate backend | S8 |
| sensor UI | S8 |
| accessibility | S9 |
| field reliability | S9 |
| GTM/pilot | S10 |

# Cross-sprint metrics

## Product
- time-to-understand situation;
- action completion;
- protocol retrieval success;
- offline task completion;
- permission abandonment;
- pilot activation/retention.

## Technical
- ingest latency;
- event canonicalization correctness;
- source freshness;
- map cold start;
- offline restart success;
- location TTFF;
- route compute/reroute;
- push latency;
- local model latency/RAM/thermal;
- interpreter RTF;
- sensor false alarms/recall;
- crash-free sessions;
- battery/hour.

## Trust
- source identified correctly;
- stale/unknown understood;
- contested claims understood;
- experimental sensor distinguished from confirmed event;
- user can tell current online/offline state.

# Dependency spine

```text
S0 contracts
 |
 +--> S1 map/location/offline
 |      |
 |      +--> S2 spatial events
 |              |
 |              +--> S3 readiness/feed
 |                       |
 |                       +--> S4 protocols
 |                       |      |
 |                       |      +--> S6 interpreter
 |                       |             |
 |                       |             +--> S7 local agent
 |                       |
 |                       +--> S5 check-in
 |
 +--> S8 sensors (can run in parallel after S0)
 |
 +--> S9 hardening after R1/R2 converge
        |
        +--> S10 pilot
```
