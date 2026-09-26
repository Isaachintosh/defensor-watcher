# DEFENSOR research/source corpus

**Owner:** Rafael Monteiro  
**Policy review:** Sofia Arantes / Eleanor Ward  
**Reliability:** Bruno Sato

## Audited baseline

Snapshot taken from the core research/architecture notes on 2026-09-26:

- **193 unique URLs**
- **53 GitHub URLs**
- **49 distinct GitHub repositories**
- **140 non-GitHub URLs**

Inclusion means a source materially informed research, reuse, benchmarking or validation. It does **not** mean production dependency or SLA.

Detailed research remains in `notes/00-...21-...`. The machine-readable summary is `registry/research-source-manifest.v1.json`.

## Emergency authorities / standards

WMO alerting ecosystem; OASIS CAP 1.2; INMET/WIS2; CEMADEN; Defesa Civil; FEMA IPAWS; MeteoAlarm; Taiwan NCDR; JMA; GeoNet; GDACS; USGS; NASA EONET/FIRMS; ReliefWeb.

## Conflict / geopolitical / OSINT

ACLED; UCDP; GDELT; WorldMonitor; operational/local sources.

## Local media

Atlas da Notícia; Media Cloud; NewsCatcher research; Event Registry; RSS/Atom/news-sitemap; RSSHub; feedparser; Trafilatura; newspaper4k; news-please.

## Mapping / offline

MapLibre; PMTiles tooling; H3; Valhalla; Organic Maps / CoMaps; OS geolocation APIs.

## Local AI / speech

Android AI surfaces; ADK Kotlin; LiteRT-LM/Gemma research; llama.cpp; whisper.cpp; sherpa-onnx; Vosk; ML Kit speech/language/translation.

## Sensors / RF

Espressif CSI/sensing; Nexmon CSI; PicoScenes; CSIKit; RuView; Android Wi-Fi RTT/UWB; dedicated radar candidates.

## Emergency/community open source

KDE FOSS Public Alert Server; Sahana Eden; Sahana SAMBRO; Ushahidi; disaster-assistant references.

## Agent/product patterns

WorldMonitor Agent Skills; C-level skill bundles; Product Manager skill packs; BMAD/sprint-planning patterns.

## Source policy

1. Prefer authority/upstream documentation.
2. Preserve original authority through aggregators.
3. Keep official/scientific/media/community/experimental classes distinct.
4. Research reference != production dependency.
5. Check license/terms/auth before adoption.
6. Unknown fields remain unknown.
7. Safety-relevant claims carry provenance and freshness.
