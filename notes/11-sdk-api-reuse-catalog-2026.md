# Catálogo de SDKs, APIs e componentes reutilizáveis — 2026-09-25

**Objetivo:** maximizar reuso e reduzir implementação proprietária ao núcleo que diferencia o DEFENSOR WATCHER.

**Princípio de engenharia:** cada capability começa por uma busca por SDK/API/biblioteca existente. Código próprio entra como orquestração, adaptação, política de prontidão, UX, protocolo e integração entre peças.

## 1. Matriz executiva

| Capability | Componente primário | Alternativas | Papel no Defensor | Estado |
|---|---|---|---|---|
| Agente Android integrado ao sistema | Android AppFunctions / Android MCP | Remote MCP | expor tools do Defensor para Gemini/agentes | preview experimental 2026 |
| Agente web / Chrome | WebMCP | MCP remoto + extensão | expor tools do companion web para browser agents | origin trial Chrome 149 |
| LLM nativa em hardware compatível | Gemini Nano via ML Kit GenAI / AICore | ADK Kotlin ML Kit | inferência local sem rede | beta/alpha por API |
| LLM local empacotada | ADK Kotlin + LiteRT-LM + Gemma | MediaPipe LLM, llama.cpp | agente offline controlado pelo app | utilizável |
| Tool calling local | ADK Kotlin + LiteRT-LM | roteador próprio + Structured Output | harness de protocolos e tools | utilizável |
| Structured output | ML Kit GenAI Structured Output | JSON schema próprio | respostas tipadas e verificáveis | alpha |
| STT offline | ML Kit GenAI Speech Recognition | whisper.cpp, sherpa-onnx | reconhecimento de fala | utilizável conforme device/runtime |
| Identificação de idioma | ML Kit Language Identification | MediaPipe Language Detector | identificar idioma do interlocutor | estável |
| Tradução offline | ML Kit Translation | modelo local/LLM para casos especiais | tradução bilateral | estável |
| TTS offline | Android TextToSpeech | sherpa-onnx TTS | falar tradução/instrução | estável / open source |
| VAD/diarização/speaker | sherpa-onnx | processamento próprio | turn-taking e interlocutores | open source |
| Wi-Fi sensing P0 | Espressif esp-csi + esp_wifi_sensing | ESP RainMaker | movimento/presença via CSI | código oficial disponível |
| Wi-Fi sensing comercial | Cognitive Systems WiFi Motion | Aerial, Origin | produto/partner path | comercial/partner |
| Sensing espacial emergente | acoAR | — | acústica + IMU + futuro 802.11bf | SDK Q3 2026 / early access |
| BLE companion | Nordic Android BLE Library | Android BLE nativo | ESP32 e acessórios | produção |
| P2P offline | Google Nearby Connections | Wi-Fi Aware | telefone↔telefone sem internet | produção |
| CAP 1.2 backend | cap-tools | parser próprio mínimo | parse/serialize/normalize alertas | estável |
| WIS2 | WMO pywis-pubsub | MQTT manual | assinatura e download WIS2 | oficial WMO |
| CAP global | KDE FOSS Public Alert Server | adapters próprios | referência/agregação de centenas de feeds | open source |
| Terremotos | USGS FDSN + GeoJSON feeds | EMSC/GDACS | eventos sísmicos | API pública |
| Multi-hazard global | GDACS API | PDC comercial | terremoto/ciclone/enchente etc. | API pública |
| Incêndio satelital | NASA FIRMS API/WMS/WFS | fontes regionais | hotspots e perímetros | API pública |
| Índice geoespacial | Uber H3 | S2/geohash | matching região/usuário | open source |
| Mapas/navigation | MapLibre | provedores de tiles/route | UI cartográfica | open source |
| RAG local | SQLite-Vector | ObjectBox Vector | protocolos offline + busca semântica | produção/open source |
| Embeddings local | MediaPipe Text Embedder | modelo TFLite próprio | indexar protocolo local | disponível |
| Backend Python | FastAPI + Pydantic | Kotlin/Go | adapters, ingestão e API | produção |
| MCP backend | MCP Python SDK v2 | Java/TS SDKs | tools remotas/cross-platform | oficial |

---

## 2. Integração com Gemini, Android e Chrome

### Android AppFunctions / Android MCP

O Android AppFunctions permite que o aplicativo publique funções tipadas para o registro do sistema. Agentes privilegiados podem descobrir e executar essas funções.

Dependências atuais:

```gradle
implementation("androidx.appfunctions:appfunctions:1.0.0-alpha12")
ksp("androidx.appfunctions:appfunctions-compiler:1.0.0-alpha12")
```

Ferramentas iniciais candidatas:

- `getActiveAlerts(area?)`
- `getReadinessState()`
- `getEmergencyProtocol(hazard, language?)`
- `startInterpreter(sourceLanguage?, targetLanguage?)`
- `startCheckIn(contactId, includeLocation)`
- `getOfflineStatus()`
- `getSensorCapabilities()`
- `startWifiSensingSession(profileId)`
- `stopWifiSensingSession()`

Fontes:
- https://developer.android.com/ai/appfunctions
- https://developer.android.com/ai/appfunctions/add-appfunctions
- https://developer.android.com/jetpack/androidx/releases/appfunctions
- https://github.com/android/appfunctions

### WebMCP / Chrome companion

WebMCP permite que a superfície web do Defensor exponha tools estruturadas ao agente do navegador.

Componentes reutilizáveis:

```bash
npm install use-webmcp-tool
```

Outros recursos:

- `webmcp-types` para typings TypeScript;
- GoogleChromeLabs `webmcp-tools`: inspector, evals, studio/polyfill e demos;
- WebMCP origin trial a partir do Chrome 149.

O Google anunciou no I/O 2026 que Gemini in Chrome terá suporte a WebMCP. O companion web pode ser preparado agora com o contrato de tools já compatível.

Fontes:
- https://developer.chrome.com/docs/ai/webmcp
- https://developer.chrome.com/blog/chrome-at-io26
- https://github.com/GoogleChromeLabs/use-webmcp-tool
- https://github.com/GoogleChromeLabs/webmcp-tools

### Contrato único de capabilities

```text
                      +--> Android AppFunctions --> Gemini/system agents
                      |
DEFENSOR TOOL CORE ---+--> WebMCP -------------> browser agents
                      |
                      +--> ADK local tools -----> offline LLM
                      |
                      +--> Remote MCP ----------> authorized remote agents
```

A camada de negócio permanece uma só. Cada superfície implementa um adapter para o mesmo tool schema.

---

## 3. LLM offline

### Opção A — Gemini Nano / AICore / ML Kit

A GenAI Prompt API executa solicitações no Gemini Nano no aparelho.

Dependência documentada:

```gradle
implementation("com.google.mlkit:genai-prompt:1.0.0-beta4")
```

Recursos atuais úteis:

- texto;
- texto + imagem;
- system instructions;
- structured output;
- thinking mode em hardware/modelos compatíveis;
- short translation;
- extração de entidades.

O Structured Output API permite retornar objetos Kotlin diretamente e encaixa no harness de protocolos.

Fontes:
- https://developers.google.com/ml-kit/genai/prompt/android
- https://developers.google.com/ml-kit/genai/prompt/android/structured-output
- https://developers.google.com/ml-kit/release-notes

### Opção B — ADK Kotlin + LiteRT-LM + Gemma

O ADK Kotlin possui backend LiteRT-LM para modelos locais e tool/function calling. Isso fornece o caminho mais interessante para um agente local com tools reais.

O mesmo ADK também possui integração Android com ML Kit/Gemini Nano; a integração ML Kit atual funciona como geração/chat, enquanto o backend LiteRT-LM oferece tool calling.

Fontes:
- https://github.com/google/adk-kotlin
- https://github.com/google/adk-kotlin/blob/main/examples/android/README.md

### Opção C — MediaPipe LLM

MediaPipe LLM Inference roda modelos Gemma no Android/iOS e serve como runtime alternativo para modelos locais.

Fonte:
- https://ai.google.dev/gemma/docs/integrations/mobile

### Opção D — llama.cpp

`llama.cpp` suporta compilação Android/NDK e modelos GGUF. É o fallback de maior liberdade para experimentar modelos pequenos/quantizados.

Fonte:
- https://github.com/ggml-org/llama.cpp/blob/master/docs/android.md

### Estratégia de runtime

```text
Capability probe
   |
   +-- Gemini Nano available ----> ML Kit/AICore
   |
   +-- device supports target ----> LiteRT-LM/Gemma
   |
   +-- generic local model -------> llama.cpp/GGUF
   |
   +-- constrained mode ----------> deterministic protocol engine only
```

O harness escolhe o runtime disponível sem alterar o contrato das tools.

---

## 4. Interpretador de conversação offline

Pipeline reutilizando componentes existentes:

```text
microfone
 -> VAD / turn detection
 -> STT
 -> language identification
 -> translation
 -> protocol-aware local agent when context is safety-related
 -> TTS
 -> alto-falante
```

### STT

**ML Kit GenAI Speech Recognition**
- streaming de microfone/arquivo;
- modo Basic em ampla gama de Android API 31+;
- modo Advanced em aparelhos compatíveis.

Fonte:
- https://developers.google.com/ml-kit/genai/speech-recognition/android

**whisper.cpp**
- exemplo Android oficial;
- recomendação do projeto para modelos tiny/base em Android;
- inferência local.

Fonte:
- https://github.com/ggml-org/whisper.cpp/tree/master/examples/whisper.android

**sherpa-onnx**
- binários Android pré-compilados;
- STT;
- TTS;
- VAD;
- speaker identification;
- speaker diarization;
- audio tagging.

Fonte:
- https://k2-fsa.github.io/sherpa/onnx/android/build-sherpa-onnx.html

### Identificação de idioma

ML Kit Language Identification reconhece mais de 100 idiomas e retorna confidence scores.

Fonte:
- https://developers.google.com/ml-kit/language/identification/android

### Tradução

ML Kit Translation fornece tradução on-device para mais de 50 idiomas por modelos baixados no aparelho.

Fonte:
- https://developers.google.com/ml-kit/language/translation/android

### TTS

Primeira escolha: Android `TextToSpeech` e vozes offline instaladas.

Segunda escolha: sherpa-onnx TTS para controlar totalmente o runtime/modelos offline.

---

## 5. Wi-Fi sensing / radar

### P0 open-source — Espressif

O repositório oficial `espressif/esp-csi` já contém:

- captura CSI;
- sender/receiver;
- coleta CSI a partir de router;
- RainMaker integration;
- `console_test`;
- `wifi_sensing_demo`;
- componente `esp_wifi_sensing`;
- detecção de movimento;
- detecção de presença humana;
- treinamento/calibração local;
- monitor Web Serial pronto.

Isto permite iniciar o Sensor Lab a partir de código oficial existente.

Fonte:
- https://github.com/espressif/esp-csi

Arquitetura P0:

```text
ESP32 + router / ESP peer
 -> esp_wifi_sensing
 -> typed sensing events
 -> BLE / Wi-Fi LAN
 -> Defensor Android
```

### Produto comercial — Cognitive Systems WiFi Motion

A plataforma possui Core REST API e conceitos de:

- network/topology;
- events;
- motion data;
- sounding/CSI;
- radar;
- home insights;
- motion history;
- location;
- webhooks/alerts.

Integração requer relação/credenciais comerciais.

Fontes:
- https://docs.cognitivesystems.com/
- https://docs.cognitivesystems.com/assets/specs/api/core

### Produto comercial — Aerial Technologies

Aerial disponibiliza Wi-Fi Sensing integrado a plataformas Broadcom Wi-Fi 6/6E e Qualcomm Networking Pro, com API para serviços de segurança residencial, elder care e smart home.

Fonte:
- https://aerial.ai/resources-blog/aerial-available-on-broadcom-ap-and-mesh-solutions

### Produto comercial — Origin AI

Origin oferece modelos de deployment:

- router embedded;
- soft-AP;
- client-to-client;
- single-point sensing;
- Sensing Server;
- APIs/webhooks;
- aplicações Android/iOS que parceiros podem adaptar.

Fontes:
- https://www.originwirelessai.com/wifi-sensing/
- https://www.japan.originwirelessai.com/partner-with-us

### SDK emergente — acoAR

acoAR trabalha com fusão de:

- acústica;
- IMU;
- Wi-Fi/CSI/802.11bf;
- position stream;
- room events;
- presence events;
- confidence/uncertainty.

O site informa SDK iOS/Android em desenvolvimento com early access no Q3 2026.

Fonte:
- https://acoar.com/

### Estado revisado

**Wi-Fi sensing entra como capability GO por hardware/SDK suportado.**

Primeira implementação recomendada: Espressif, por custo, abertura do código e velocidade de experimento.

Trilha de produto/partnership: Cognitive Systems, Origin e Aerial.

Trilha smartphone-native emergente: acoAR + 802.11bf conforme suporte de hardware.

---

## 6. Comunicação local e companions

### Nordic Android BLE Library

Maven:

```gradle
implementation("no.nordicsemi.android:ble:2.11.0")
implementation("no.nordicsemi.android:ble-ktx:2.11.0")
```

Use para a integração ESP32/companion, conexão GATT e notificações.

Fonte:
- https://github.com/NordicSemiconductor/Android-BLE-Library

### Nearby Connections

API totalmente offline P2P que abstrai Bluetooth, BLE e Wi-Fi e oferece conexões criptografadas.

Aplicações no Defensor:

- check-in local entre aparelhos;
- troca de pequenos protocolos/estado;
- descoberta de companions;
- mesh oportunista de equipe/família em perda de internet.

Fonte:
- https://developers.google.com/nearby/connections/overview

### Wi-Fi Aware

Pode complementar Nearby em aparelhos compatíveis para descoberta e data paths locais sem infraestrutura.

Fonte:
- https://developer.android.com/develop/connectivity/wifi/wifi-aware

---

## 7. Alertas e dados externos

### CAP 1.2

Python:

```bash
pip install cap-tools
```

`cap-tools` oferece bindings tipados para CAP 1.2.

Fonte:
- https://pypi.org/project/cap-tools/

### WIS2

Python:

```bash
pip install pywis-pubsub
```

Projeto oficial WMO para MQTT pub/sub, download, filtros bbox e validação de WIS2 Notification Messages.

Fonte:
- https://github.com/World-Meteorological-Organization/pywis-pubsub

### FOSS Public Alert Server

Projeto KDE que já agrega centenas de feeds CAP mundialmente e fornece push via UnifiedPush.

É referência direta para source registry, feed discovery e arquitetura de agregação global.

Fonte:
- https://github.com/KDE/foss-public-alert-server

### USGS

Earthquake Catalog/FDSN + feeds GeoJSON em tempo real.

Fonte:
- https://earthquake.usgs.gov/fdsnws/event/1/

### GDACS

API multi-hazard pública com GeoJSON e dados geoespaciais.

Fonte:
- https://www.gdacs.org/gdacsapi/swagger/index.html

### NASA FIRMS

API/WFS/WMS para hotspots de incêndio e dados MODIS/VIIRS/Landsat.

Fonte:
- https://firms.modaps.eosdis.nasa.gov/api/

---

## 8. Geospatial

### H3

Bindings Java/Android:

```gradle
implementation("com.uber:h3:4.4.0")
```

Uso proposto:

- indexar localização do usuário;
- indexar polígonos de alerta;
- busca rápida de candidatos;
- deduplicação/agrupamento espacial;
- cálculo de proximidade por resolução.

Fontes:
- https://github.com/uber/h3
- https://github.com/uber/h3-java

### MapLibre

Use MapLibre para mapa/rendering e manter a camada de visualização desacoplada do fornecedor de tiles/directions.

Fonte:
- https://maplibre.org/

---

## 9. Protocolos offline / RAG

### SQLite-Vector

Android:

```gradle
implementation("ai.sqlite:vector:1.0.0")
```

Python:

```bash
pip install sqliteai-vector
```

Uso:

- protocolos versionados;
- chunks de instruções;
- embeddings locais;
- busca vetorial;
- histórico e metadados em SQLite.

Fontes:
- https://github.com/sqliteai/sqlite-vector
- https://github.com/sqliteai/sqlite-vector/releases

### ObjectBox Vector

Alternativa Android/JVM com banco local + vector search.

Fonte:
- https://github.com/objectbox/objectbox-java

### MediaPipe Text Embedder

Produz embeddings on-device a partir de modelo TFLite.

Fonte:
- https://ai.google.dev/edge/api/mediapipe/python/mp/tasks/text/TextEmbedder

---

## 10. Backend e MCP

### FastAPI

Servidor Python tipado/OpenAPI para source adapters e serviços operacionais.

```bash
pip install "fastapi[standard]"
```

Fonte:
- https://github.com/fastapi/fastapi

### MCP Python SDK v2

```bash
pip install "mcp[cli]"
```

SDK oficial atual para servidores/clientes MCP via stdio, Streamable HTTP e SSE.

Fonte:
- https://github.com/modelcontextprotocol/python-sdk

### Pacotes Python recomendados no workspace

```text
fastapi[standard]     API/adapters
pydantic              contratos tipados
mcp[cli]              remote MCP
cap-tools             CAP 1.2
pywis-pubsub          WIS2/MQTT
shapely               operações geométricas
pyproj                CRS/projeções
h3                    indexação espacial
httpx                 clientes HTTP async
tenacity              retry/backoff
orjson                 JSON rápido
sqliteai-vector       RAG local/backend
pytest                 testes
hypothesis             property-based tests do canonicalizer
```

A lista é uma proposta de baseline; versões ficam pinadas em lockfile depois dos spikes.

---

## 11. Ordem de aquisição/reuso

1. **Adotar diretamente:** CAP/WIS2, FastAPI/Pydantic, H3, Nordic BLE, Nearby, ML Kit Language ID/Translation, Room/SQLite.
2. **Integrar e encapsular:** Gemini Nano, ADK Kotlin/LiteRT-LM, sherpa-onnx/whisper.cpp, MapLibre, SQLite-Vector.
3. **Experimentar com código oficial:** Espressif esp-csi / esp_wifi_sensing.
4. **Abrir conversa comercial:** Cognitive Systems, Origin, Aerial.
5. **Acompanhar early access:** acoAR e maturação 802.11bf.
6. **Construir internamente:** readiness policy, source/evidence model, protocol harness, cross-runtime tool contract, UX, evals e integração.

Esse recorte concentra código próprio exatamente na parte que representa o produto DEFENSOR.
