# Pesquisa de mapas, geolocalização e operação offline — 2026-09-25

## Objetivo

O mapa inicial do DEFENSOR deve:

- obter posição pelos serviços nativos do sistema operacional;
- funcionar com localização aproximada ou precisa;
- representar eventos geográficos multi-hazard;
- continuar exibindo mapa e última situação sem internet;
- suportar geofencing/applicability;
- evoluir para routing/navigation offline;
- trocar fornecedor sem alterar Readiness Engine ou Event Model.

## Arquitetura

```text
OS LOCATION
 Android FLP / iOS Core Location / Browser Geolocation
              |
              v
       LocationProvider
              |
              +-------------------+
              |                   |
              v                   v
          MAP RENDERER       APPLICABILITY
          MapLibre           H3 / polygons
              |
              v
        OFFLINE MAP PACK
     PMTiles / vendor region
              |
              v
         RouteProvider
 Ferrostar / HERE / Mapbox / Valhalla
```

Position, renderer, routing, geocoding e alert applicability ficam em contratos independentes.

## Localização do sistema operacional

### Android — Google Play Services Location

`FusedLocationProviderClient` é a API principal de localização fusionada.

Capabilities:
- `getCurrentLocation`;
- `getLastLocation`;
- `requestLocationUpdates`;
- coarse/fine granularity;
- background updates mediante modelo de permissão/foreground adequado.

`GeofencingClient` é a API dedicada para geofences.

Fontes:
- https://developers.google.com/android/reference/com/google/android/gms/location/FusedLocationProviderClient
- https://developers.google.com/android/reference/com/google/android/gms/location/GeofencingClient

Adapter:
`AndroidFusedLocationProvider`.

### iOS — Core Location

Core Location combina GPS, Wi-Fi, Bluetooth, cellular, magnetometer e barometer.

Capabilities:
- `CLLocationUpdate` / live updates;
- `CLMonitor` para condition/geofence monitoring;
- standard/significant-change workflows;
- background session onde aplicável.

Fontes:
- https://developer.apple.com/documentation/corelocation
- https://developer.apple.com/documentation/corelocation/clmonitor-2r51v

Adapter:
`AppleCoreLocationProvider`.

### Web

O companion SPA usa Browser Geolocation API atrás do mesmo conceito de provider.

Ferrostar já fornece `BrowserLocationProvider` para o web.

Fonte:
https://stadiamaps.github.io/ferrostar/

## Renderer open-source recomendado

### MapLibre Native

MapLibre Native é cross-platform e suporta Android/iOS.

Fonte:
https://maplibre.org/projects/native/

A partir de MapLibre Android 11.7, PMTiles pode ser usado como tile source, inclusive por arquivo local:

`pmtiles://file://...`

A documentação também registra que PMTiles source não usa o mecanismo de offline-pack download/cache do MapLibre; portanto o Defensor deve ter um `OfflinePackManager` responsável pelo arquivo.

Fonte:
https://maplibre.org/maplibre-native/android/examples/data/PMTiles/

### Web offline

`makinacorpus/maplibre-offline-pmtiles`:
- download PMTiles;
- storage em OPFS;
- custom protocol `offline-pmtiles://`;
- vector/raster support;
- storage quota management.

Fonte:
https://github.com/makinacorpus/maplibre-offline-pmtiles

## Routing/navigation

### Ferrostar — candidato open-source principal

Ferrostar é um SDK moderno de navigation:
- Rust core;
- Android/Kotlin;
- iOS/Swift;
- Web Components;
- reusable UI;
- MapLibre integration;
- route providers substituíveis;
- custom/local route provider;
- optional Google Play Services fused-location module no Android.

Fonte:
https://stadiamaps.github.io/ferrostar/

A integração MapLibre Navigation também possui módulo opcional `navigation-location-gms-android` para Fused Location.

Fonte:
https://github.com/maplibre/maplibre-navigation-android

### Valhalla

Routing engine open source:
- OSM;
- hierarchical tiles;
- regional extracts;
- runtime costing;
- arquitetura pensada para small footprint/offline portable devices;
- C++ cross-compilation.

Fonte:
https://github.com/valhalla/valhalla

Uso:
- online/self-hosted no primeiro release;
- on-device/offline avaliado em spike posterior via custom route provider.

### HERE SDK Navigate — benchmark comercial forte para offline

HERE oferece:
- persistent offline regions;
- MapDownloader/MapUpdater;
- OfflineSearchEngine;
- OfflineRoutingEngine;
- offline turn-by-turn guidance;
- global offline switch/radio-silent mode.

Fontes:
- https://docs.here.com/here-sdk/docs/android-offline-maps
- https://docs.here.com/here-sdk/docs/android-offline-maps-routing

Esse é o candidato com menor esforço se o licensing/TCO for aceitável.

### Mapbox Navigation — benchmark comercial alternativo

Mapbox oferece:
- predictive caching;
- TileStore;
- offline regions;
- offline routing;
- turn-by-turn;
- reroute sem conectividade dentro de região previamente baixada.

Fonte:
https://docs.mapbox.com/android/navigation/guides/advanced/offline/

### Organic Maps / CoMaps

Organic Maps e CoMaps já provam:
- full offline map;
- offline search;
- walking/cycling/driving navigation;
- OSM;
- Android/iOS.

Organic Maps mantém APIs Android/iOS para deep-link/two-way interaction com o app instalado. A API é excelente fallback externo, não renderer embutido.

Fontes:
- https://github.com/organicmaps/api-android
- https://github.com/organicmaps/api-ios
- https://github.com/comaps/comaps

## Opções de stack

### Stack A — open/reuse-first

```text
Android FLP / iOS Core Location
        |
     MapLibre
        |
local PMTiles
        |
Ferrostar
        |
hosted Valhalla first
        |
local route provider later
```

Vantagens:
- source-open;
- vendor independence;
- shared abstractions;
- forte aderência ao DEFENSOR;
- offline map imediatamente possível.

### Stack B — HERE first

```text
OS location
   |
HERE SDK Navigate
   |
MapDownloader + OfflineRouting/Search/Navigation
```

Vantagens:
- offline completo rapidamente;
- search/routing/navigation integrados;
- menor integração inicial.

Decisão depende de licensing/TCO e controle desejado.

### Stack C — Mapbox first

```text
OS location
   |
Mapbox Maps + Navigation
   |
TileStore / offline regions
```

Vantagens:
- SDK maduro;
- predictive caching;
- offline routing/rerouting;
- boa DX.

Decisão depende de licensing/TCO/vendor dependency.

## Recomendação de spike

Implementar o primeiro mapa com contratos neutros e testar:

1. Android Fused Location;
2. MapLibre Native;
3. arquivo PMTiles local;
4. H3/polygon applicability;
5. restart totalmente offline;
6. geofence simples;
7. Ferrostar + hosted Valhalla;
8. benchmark paralelo HERE offline.

## Métricas

- time-to-first-location;
- accuracy/granularity;
- cold map render;
- offline restart;
- size per region;
- download resume;
- checksum validation;
- route compute latency;
- reroute latency;
- battery over 1h;
- background wakeups;
- permission refusal path;
- stale-location behavior.

## Package contract

```text
OfflineRegionPackage
  regionId
  geometry
  mapVersion
  mapData
  routeGraph?
  searchIndex?
  protocolPackIds[]
  sourceDate
  downloadedAt
  expiresAt?
  checksum
  signature?
  sizeBytes
  state
```

## P0 technical decision

Começar com:

- Android Fused Location Provider;
- MapLibre Native;
- local PMTiles;
- H3;
- Ferrostar interface.

Em paralelo, medir HERE SDK como benchmark de integração offline completa.

Isso entrega independência arquitetural desde o primeiro sprint e mantém uma rota comercial pronta caso reduza tempo de desenvolvimento de forma significativa.
