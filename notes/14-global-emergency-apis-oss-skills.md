# Global emergency APIs, open-source platforms e agent skills — 2026-09-25

## Resposta à pergunta "existe uma API central?"

Existe uma hierarquia de hubs e registries que reduz fortemente o número de integrações país-a-país.

## Camada global de autoridade/descoberta

### WMO Register of Alerting Authorities

https://alertingauthority.wmo.int/

Registro oficial por país de autoridades de alerta, categorias de risco e, quando publicado, CAP feed.

Exemplo Brasil:
- Issuing Organization: Secretaria Nacional de Defesa Civil;
- categorias incluem Geo, Met, Safety, Security, Rescue, Fire, Health, Env, Transport, Infra e CBRNE;
- CAP feed registrado: https://idapfile.mdr.gov.br/idap/api/rss/cap

### Alert-Hub / WMO Alert Hub

https://www.alert-hub.org/

Filtered Alert Hub agrega feeds CAP publicados por autoridades reconhecidas. A mesma lista é consumida/replicada por outras plataformas, incluindo GDACS e serviços GIS.

Uso Defensor: source discovery + possible aggregation upstream.

## Hubs regionais

### MeteoAlarm — Europa

https://api.meteoalarm.org/

Agrega warnings de 38 serviços meteorológicos/hidrológicos nacionais.

Interfaces:
- OGC API EDR;
- OpenAPI;
- MQTT real-time;
- Metadata API;
- Hub API;
- Atom feeds;
- CAP upstream;
- licença CC BY 4.0.

É um adapter regional de alto valor.

## Hubs nacionais/multiagência

### Brasil

WMO registry -> Secretaria Nacional de Defesa Civil CAP feed:
https://idapfile.mdr.gov.br/idap/api/rss/cap

INMET/WIS2 continua como fonte meteorológica estruturada complementar.

### Estados Unidos — FEMA IPAWS

https://www.fema.gov/emergency-managers/practitioners/integrated-public-alert-warning-system/technology-developers

IPAWS All-Hazards Information Feed é fonte CAP em tempo real para Internet-Based Services aprovados. Acesso requer conta/aprovação + MOA/PIN.

O FEMA também oferece IPAWS Archive via ArcGIS/OpenFEMA, com atraso deliberado para separar histórico de alertas ativos.

### Taiwan — NCDR Public Warning Platform

https://alerts.ncdr.nat.gov.tw/

Plataforma multiagência. Em 2026 exibe 39 organizações e 64 tipos de alerta. Possui API/integração e CAP-TWP; inclui fenômenos meteorológicos, terremoto, inundação, infraestrutura e outros.

Uso Defensor: referência de "API central nacional" real.

### Japão — JMA Disaster Prevention Information XML

https://www.jma.go.jp/

JMA distribui informação de prevenção em XML machine-readable; cobre warnings meteorológicos, terremotos, tsunami e outras categorias. Em 2026 a taxonomia/XML foi atualizada para o novo sistema de alertas.

### Nova Zelândia — GeoNet

https://api.geonet.org.nz/

APIs para:
- quakes;
- shaking intensity;
- Quake CAP;
- Quake CAP Feed;
- volcanic alert levels;
- network/sensors.

### Reino Unido — Met Office NSWWS

API/feed machine-readable para National Severe Weather Warning Service, com update/cancel/expire. Deve entrar no registry como adapter nacional.

## APIs globais complementares

### GDACS

https://www.gdacs.org/gdacsapi/swagger/index.html

OpenAPI global para desastres e eventos GDACS. Bom para multi-hazard situational awareness.

### NASA EONET

https://eonet.gsfc.nasa.gov/docs/v3

API v3 para natural events com filtro por source/category/status. Útil para storms, wildfires e outros eventos observados.

### NASA FIRMS

https://firms.modaps.eosdis.nasa.gov/web-services/

Active fire data por API, WFS e WMS; MODIS, VIIRS e Landsat. Há dados NRT/RT/URT dependendo do produto/região.

### USGS Earthquake

https://earthquake.usgs.gov/earthquakes/feed/

GeoJSON, QuakeML, catalog web services e feeds de terremotos.

### ReliefWeb

https://apidoc.reliefweb.int/

API humanitária com reports, disasters, countries e milhares de fontes curadas. Útil para contexto pós-evento e humanitarian intelligence.

## Estratégia do Source Registry

Ordem preferida:
1. hub global/regional confiável;
2. hub nacional multiagência;
3. autoridade oficial por hazard;
4. fonte científica;
5. agregador open source/operacional;
6. curadoria/comunidade como classe distinta.

Isso reduz adapters redundantes e preserva a autoridade originária.

## Projetos open source relevantes

### KDE FOSS Public Alert Server

https://github.com/KDE/foss-public-alert-server

É o projeto open source mais diretamente coincidente com o backend de alertas:
- agrega centenas de CAP feeds de autoridades;
- alertas worldwide;
- UnifiedPush;
- desenhado para permitir terceiros criarem clientes;
- tem motivação explícita de uso em viagens e clientes não proprietários.

Ação: auditar source registry/adapters e considerar integração/fork/library reuse.

### WorldMonitor

https://github.com/koala73/worldmonitor

Plataforma global de inteligência em tempo real com:
- MCP;
- REST/OpenAPI;
- SDKs Python/Ruby/Go/JS;
- CLI;
- 25 Agent Skills;
- natural disasters;
- earthquakes;
- health;
- infrastructure outages;
- country/security context;
- source attribution.

Endpoints:
- https://worldmonitor.app/mcp
- https://api.worldmonitor.app
- https://worldmonitor.app/openapi.yaml
- https://worldmonitor.app/.well-known/agent-skills/index.json

Ação: usar como camada situacional opcional e reaproveitar padrões de skill/harness.

### Sahana Eden

https://github.com/sahana/eden

Framework open source para Humanitarian and Emergency Management: pessoas desaparecidas, ajuda, voluntários, camps e coordenação.

### Sahana SAMBRO

https://github.com/sahana/SAMBRO

Alerting and Messaging Broker com foco em CAP/disaster management/early-warning.

### Ushahidi

https://github.com/ushahidi/platform

Backend AGPL para coleta, classificação, geolocalização e visualização de informação via SMS/RSS/email e outras fontes. Excelente referência para crowd/community evidence layer.

### Gemma 3n Disaster Assistant

https://github.com/rembertdesigns/gemma3n-disaster-assistant

Projeto MIT offline-first com Gemma 3n, emergency workflows e arquitetura de disaster assistant. Serve como referência de implementação/harness; claims de performance do próprio README precisam de validação independente.

### RuView

https://github.com/ruvnet/RuView

MIT, Wi-Fi CSI spatial sensing, ESP32 firmware, MQTT/WebSocket, tools e skills. Muito útil para o Sensor Lab.

### VoicePing offline speech translation

https://github.com/voiceping-ai/ios-android-offline-speech-translation

Código Android/iOS diretamente próximo do Interpreter.

### soniqo/speech-android

https://github.com/soniqo/speech-android

SDK Android local para STT/TTS/VAD/noise cancellation e agent loop.

### CSIKit

https://github.com/Gi-z/CSIKit

MIT Python CSI toolkit compatível com múltiplas famílias de hardware.

## GitLab relevante

### Alert-Hub Google CAP Library mirror

https://gitlab.com/alert-hub-org/google-cap-library

Apache-2.0. Parser/criador/validator CAP Java para 1.0/1.1/1.2, XML signature validation e profiles. Código antigo, mas útil como referência/test corpus.

### Android Vosk mirror/demo

https://gitlab.com/ddeeproton/android-vosk

Demo/fork Android para ASR offline.

### F-Droid offline translator metadata

https://gitlab.com/fdroid/fdroiddata/-/blob/master/metadata/dev.davidv.translator.yml

Aponta para DavidVentura/offline-translator, GPL-3.0-or-later, app Android offline de tradução/TTS/OCR. Útil para comparação e ideias de packaging.

## Skills e harness encontrados

### WorldMonitor Agent Skills

Catálogo público com 25 SKILL.md versionados:
https://github.com/koala73/worldmonitor/blob/main/docs/agent-skills.mdx

Relevantes:
- track-climate-hazards
- track-earthquakes
- monitor-health-alerts
- monitor-internet-outages
- check-country-risk
- check-forecast-signals
- track-conflict-events
- monitor-webcams

Cada skill inclui when-to-use, auth, REST example, response semantics e content-safety.

### RuView skills

O repo inclui skills operacionais, por exemplo ruvnet/RuView/plugins/ruview/skills/ruview-hardware-setup/SKILL.md para firmware/provisioning/CSI.

## Integração com Cérebro INEVITA

Foi criado um pack original de skills compatível com o contrato do Cérebro:
- defensor-reuse-scout
- defensor-source-registry
- defensor-situational-watch
- defensor-sensor-capability
- defensor-offline-interpreter
- defensor-protocol-harness
- worldmonitor-intelligence

As skills externas ficam em overlay separado do submódulo canônico do Cérebro; o bootstrap da stack recebe extra skill roots e copia a skill aprovada para os workspaces dos especialistas.

Isso permite ampliar o Cérebro sem criar um fork silencioso do upstream.
