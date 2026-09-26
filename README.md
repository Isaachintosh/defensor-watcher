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

## Experimental sensing

Wi-Fi sensing is a real technical field and IEEE 802.11bf-2025 is an active WLAN-sensing standard.

That does **not** mean a normal Android application can universally turn every phone/router combination into a reliable radar.

The current research path keeps sensing in a separate laboratory:

```text
compatible Wi-Fi/CSI companion hardware
        -> local measurements/features
        -> BLE/LAN
        -> Android laboratory UI
```

The first acceptable experiment is deliberately narrow: distinguish a calibrated empty environment from probable movement. Experimental sensing must not independently create or promote a critical emergency state.

UWB, Wi-Fi RTT and ordinary Android sensors may later provide specific context/ranging capabilities on compatible hardware; they are not generic threat detectors.

## AI policy

AI may assist with:

- non-authoritative explanation;
- auxiliary translation with the original retained;
- searching reviewed offline protocols;
- simulations and preparedness;
- non-critical checklist personalization.

AI must not be the sole authority for:

- existence of a threat;
- official severity;
- geographic applicability;
- cancellation;
- evacuation orders;
- safe-route claims;
- declaring that the user is safe.

Critical state transitions should remain deterministic and auditable.

## Current artifacts

- [Consolidated assessment and execution plan](notes/00-parecer-consolidado-plano.md)
- [Risk, privacy and reliability assessment](notes/03-riscos-privacidade-confiabilidade.md)
- [Wi-Fi sensing reassessment](notes/05-reavaliacao-wifi-sensing.md)
- [Product and UX reassessment](notes/07-produto-ux-reavaliado.md)
- [Consolidated development reassessment](notes/08-reavaliacao-consolidada-desenvolvimento.md)
- [2026 international mobile-app landscape](notes/09-app-landscape-internacional-2026.md)
- [App-first architecture and validation plan](notes/10-app-first-architecture-validation.md)
- [Navigable prototype](prototype/index.html)

## Immediate engineering target

Before adding any real sensor, prove one real source end-to-end:

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

That flow is the first technical proof of the product.

## Safety invariant

**No data is not evidence of no danger.**

A missing, delayed or unavailable source must produce an explicit degraded/unknown state, never a “safe” conclusion.
