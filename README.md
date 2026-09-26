# DEFENSOR WATCHER

Personal situational-awareness and emergency-readiness companion for Android.

> **Research status — 2026-09-25:** V1, evidence-backed concept and navigable prototype. Not a production life-safety system.

## Product thesis

DEFENSOR WATCHER is being designed as a personal layer **on top of authoritative and scientific emergency information**.

The app should help a user answer five questions quickly:

1. **What happened?**
2. **Who is saying it?**
3. **Does it apply to my area?**
4. **How current is this information?**
5. **What should I do now?**

The product is not intended to replace Cell Broadcast, sirens, emergency numbers, civil-defense authorities, meteorological agencies or other official warning systems.

## Core experience

- authoritative/scientific alerts relevant to configured areas;
- explicit source, issue time, validity and last synchronization;
- correct handling of alert updates and cancellations;
- readiness state that never equates silence with safety;
- reviewed offline emergency guidance;
- manual check-in and user-controlled location sharing;
- accessibility and degraded/offline states as first-class product states;
- international source adapters over time.

## App-first architecture

```text
official/scientific sources
        |
        v
source adapters
        |
        v
immutable raw event + provenance
        |
        v
canonical event model
Alert / Update / Cancel
        |
        v
deterministic applicability + readiness rules
        |
        +---------> push delivery
        |
        +---------> offline package
                         |
                         v
                     Android app
```

OASIS Common Alerting Protocol (CAP) is the preferred canonical starting point when a source supports it.

For the first Brazilian technical spike, INMET's WIS2 publication of CAP weather alerts is a concrete candidate source.

## Readiness model

The project currently explores a 5 → 1 personal readiness scale, but the number must never hide the underlying evidence.

The UI should also expose:

- source/authority;
- official severity;
- certainty when supplied by the source;
- freshness/connectivity;
- whether the item is official, scientific, curated, community-provided or experimental.

A separate **unknown / stale / unavailable** state is mandatory.

## Reuse-first implementation

DEFENSOR WATCHER prioritizes existing SDKs, APIs, standards and libraries. Custom engineering is concentrated in orchestration, the readiness policy, the protocol harness, source/evidence modeling, UX and evals.

The current reusable stack includes Android AppFunctions / Android MCP, WebMCP, ADK Kotlin, Gemini Nano / ML Kit, LiteRT-LM / Gemma, llama.cpp, ML Kit speech/language/translation, sherpa-onnx, whisper.cpp, Espressif esp-csi / esp_wifi_sensing, Nordic BLE, Nearby Connections, CAP/WIS2 tooling, H3 and local vector stores.

See [SDK/API reuse catalog](notes/11-sdk-api-reuse-catalog-2026.md).

## Agent interoperability

The Defensor Tool Core exposes one typed capability contract through multiple adapters:

~~~text
Defensor Tool Core
   +--> Android AppFunctions / Android MCP --> Gemini/system agents
   +--> WebMCP ----------------------------> browser agents
   +--> ADK local tools -------------------> offline LLM
   +--> Remote MCP ------------------------> authorized remote agents
~~~

Initial tools include active alerts, readiness state, emergency protocols, interpreter sessions, check-in preparation, device capabilities and sensing sessions.

See [local agent, Gemini and interpreter harness](notes/12-local-agent-gemini-translation-harness.md).

## Offline protective agent

The on-device harness can select the strongest local runtime available on the device:

~~~text
Gemini Nano / AICore / ML Kit
        -> LiteRT-LM / Gemma
        -> llama.cpp / GGUF
        -> deterministic protocol engine
~~~

Versioned emergency protocols, local retrieval/RAG, structured outputs and typed tools form the stable contract around the model runtime.

## Real-time interpreter

~~~text
microphone
 -> VAD
 -> speech-to-text
 -> language identification
 -> translation
 -> protocol-aware local agent
 -> text-to-speech
~~~

Reusable engines under evaluation include ML Kit GenAI Speech Recognition, ML Kit Language Identification, ML Kit Translation, Android TextToSpeech, whisper.cpp and sherpa-onnx.

## Wi-Fi sensing

Wi-Fi sensing is a supported research and integration capability.

The open P0 uses Espressif esp-csi and esp_wifi_sensing, which already provide CSI acquisition plus motion/presence demos with local training and diagnostics. The Android app receives typed sensing events over BLE or LAN.

Commercial integration candidates include Cognitive Systems WiFi Motion, Aerial Technologies and Origin AI. acoAR is an emerging Android/iOS spatial-sensing SDK combining acoustic, IMU and a future Wi-Fi sensing path.

UWB, Wi-Fi RTT, Wi-Fi Aware, BLE and Nearby Connections complement this layer for ranging, companions and local connectivity.

## AI role

Local and connected models provide language understanding, protocol retrieval, explanation, translation, multimodal context, tool selection and conversational mediation. Critical event facts retain their source/provenance and the Tool Core validates structured actions before execution.

## Current artifacts

- [Consolidated assessment and execution plan](notes/00-parecer-consolidado-plano.md)
- [Risk, privacy and reliability assessment](notes/03-riscos-privacidade-confiabilidade.md)
- [Wi-Fi sensing reassessment](notes/05-reavaliacao-wifi-sensing.md)
- [Product and UX reassessment](notes/07-produto-ux-reavaliado.md)
- [Consolidated development reassessment](notes/08-reavaliacao-consolidada-desenvolvimento.md)
- [2026 international mobile-app landscape](notes/09-app-landscape-internacional-2026.md)
- [App-first architecture and validation plan](notes/10-app-first-architecture-validation.md)
- [SDK/API reuse catalog](notes/11-sdk-api-reuse-catalog-2026.md)
- [Local agent, Gemini and interpreter harness](notes/12-local-agent-gemini-translation-harness.md)
- [Deep radar + offline speech SDK scan](notes/13-deep-radar-speech-sdk-scan.md)
- [Global emergency APIs, OSS platforms and agent skills](notes/14-global-emergency-apis-oss-skills.md)
- [Conflict intelligence + command-center UX redesign](notes/15-conflict-intelligence-ui-redesign.md)
- [Executive/product skills operating model](notes/16-executive-product-skills-operating-model.md)
- [Map, geolocation and offline SDK research](notes/17-map-location-offline-sdk-research.md)
- [Operational sprint roadmap](notes/18-sprint-roadmap-operational.md)
- [Navigable prototype](prototype/index.html)

## Parallel engineering targets

### Emergency-data path

```text
official event
-> ingestion
-> canonicalization
-> geographic applicability
-> notification
-> offline persistence
-> Update
-> Cancel
-> recovery after network loss
```

That flow provides the first end-to-end emergency-data proof.

### Offline-agent path

~~~text
protocol pack -> local retrieval -> local LLM -> structured action -> Defensor tool
~~~

### Interpreter path

~~~text
speech -> STT -> language ID -> translation -> TTS
~~~

### Sensing path

~~~text
esp_wifi_sensing -> motion/presence event -> BLE/LAN -> Defensor Tool Core
~~~

These spikes advance independently and converge behind the same Tool Core.

## Safety invariant

**No data is not evidence of no danger.**

A missing, delayed or unavailable source must produce an explicit degraded/unknown state, never a “safe” conclusion.

## SPA situational-awareness mockup

The current interactive mockup is split into:

- `prototype/index.html`
- `prototype/styles.css`
- `prototype/app.js`

It is dependency-free and runs with any static HTTP server. The UI is conflict/unrest/infrastructure/hazard/sensor aware, responsive, and supports light/dark/system themes.
