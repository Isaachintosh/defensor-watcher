# Harness de agente offline, Gemini e intérprete — 2026-09-25

**Objetivo:** tornar o DEFENSOR WATCHER um agente de proteção utilizável com e sem conectividade, com o mesmo conjunto de capabilities exposto ao app, ao modelo local e a agentes autorizados do ecossistema Android/Chrome.

## 1. Arquitetura de agentes

```text
                              ONLINE
        +--------------------------------------------------+
        |                                                  |
        |  Gemini in Chrome <--- WebMCP --- Defensor Web   |
        |                                                  |
        |  Authorized agents <-- Remote MCP --> Backend    |
        +-------------------------+------------------------+
                                  |
                                  | synchronized event/profile state
                                  v
+-------------------------------------------------------------------+
|                         DEFENSOR ANDROID                           |
|                                                                   |
|  Android AppFunctions / Android MCP                               |
|            |                                                      |
|            +------> Gemini / system agents (where enabled)        |
|                                                                   |
|  DEFENSOR TOOL CORE                                               |
|     get_alerts()       get_protocol()       check_in()             |
|     start_interpreter() get_sensor_state()  sensing_session()      |
|             |                                                     |
|             +---------------------------+                         |
|                                         |                         |
|                      OFFLINE AGENT HARNESS                         |
|            deterministic policy + local RAG + local LLM           |
|                                         |                         |
|                     +-------------------+------------------+      |
|                     |                   |                  |      |
|                 Gemini Nano         LiteRT-LM          llama.cpp  |
|                    AICore            / Gemma             GGUF      |
+-------------------------------------------------------------------+
```

O estado operacional do Defensor permanece independente do runtime de modelo. Trocar o modelo mantém as mesmas tools, schemas, protocolos, testes e estados.

---

## 2. Defensor Tool Core

Tools propostas para a primeira versão:

```text
alerts.list_active(area?)
alerts.get(event_id)
readiness.current()
protocol.search(hazard, situation, language)
protocol.get(protocol_id, section?)
interpreter.start(mode, target_language?)
interpreter.stop()
checkin.prepare(status, contact_id, include_location)
checkin.send(confirmation_token)
device.capabilities()
sensor.session_start(sensor_type, profile_id)
sensor.session_stop(session_id)
sensor.read_state(session_id)
connectivity.status()
```

Cada tool possui:

- JSON/Kotlin schema;
- descrição operacional curta;
- inputs tipados;
- output tipado;
- error states;
- provenance;
- side-effect class;
- confirmação necessária quando houver ação externa;
- modo offline/online;
- eval corpus.

Adapters:

- `AndroidAppFunctionAdapter`
- `WebMcpAdapter`
- `AdkToolAdapter`
- `RemoteMcpAdapter`

---

## 3. Harness otimizado para protocolos de emergência

### Camadas

```text
EVENT/SENSOR INPUT
      |
      v
DETERMINISTIC FACT EXTRACTOR
      |
      v
PROTOCOL RETRIEVER
  metadata + FTS + vector
      |
      v
PROTOCOL CONTEXT PACK
  canonical steps
  locale/language
  source + version
  equipment/context
      |
      v
LOCAL LLM
  explanation / dialogue / intent parsing
      |
      v
STRUCTURED ACTION PROPOSAL
      |
      v
POLICY + TOOL ROUTER
      |
      v
USER-FACING ACTION
```

A força do modelo vem da combinação de:

- system instructions compactas;
- retrieval de protocolos versionados;
- few-shot examples por classe de emergência;
- structured output;
- tool schemas;
- baixa temperatura para tarefas determinísticas;
- chamadas menores encadeadas por código;
- evals pré-registrados.

As próprias recomendações de Prompt Design do Gemini Nano favorecem prompts curtos, exemplos, delimitadores, saída curta, baixa temperatura para tarefas determinísticas e decomposição de tarefas complexas em chamadas menores.

Fonte:
- https://developers.google.com/ml-kit/genai/prompt/android/prompt-design

### Structured output inicial

```kotlin
data class ProtectiveInference(
    val intent: UserIntent,
    val eventId: String?,
    val protocolId: String?,
    val protocolVersion: String?,
    val situationSummary: String,
    val proposedAction: ActionType,
    val toolCall: ToolCall?,
    val confidence: Float,
    val provenance: List<String>
)
```

O `PolicyRouter` valida o objeto antes de qualquer action tool.

---

## 4. Offline RAG

Protocol pack:

```text
protocols/
  flood/
  wildfire/
  earthquake/
  severe-weather/
  chemical/
  first-aid/
  evacuation/
  communication/
  translation-phrases/
```

Cada protocolo:

```text
id
version
jurisdiction
hazard
applicability
source
issued/reviewed
language
canonical_steps[]
critical_phrases[]
contraindications[]
embeddings[]
```

Storage:

- Room/SQLite para metadados;
- SQLite-Vector ou ObjectBox para vector search;
- FTS5 para busca lexical;
- MediaPipe Text Embedder ou embeddings pré-computados no release do pack.

O híbrido FTS + vector é especialmente útil para protocolos: nomes exatos como “monóxido de carbono”, “enchente súbita” e “hipotermia” convivem com linguagem natural do usuário.

---

## 5. Runtimes

### Gemini Nano

Use quando AICore/ML Kit informar disponibilidade.

Papel inicial:
- intent parsing;
- entity extraction;
- explicação;
- tradução curta;
- protocol Q&A;
- multimodal image context onde suportado.

Structured Output fornece objetos Kotlin.

### LiteRT-LM + Gemma

Use como runtime local principal nos aparelhos capazes de carregar o modelo escolhido.

Papel:
- agentic tool use;
- reasoning local;
- protocolos mais longos;
- fallback independente do AICore.

ADK Kotlin fornece a camada de agente.

### llama.cpp

Use como runtime experimental/compatibility layer para GGUF e benchmarking de modelos compactos.

A abstração `LocalModelRuntime` evita dependência de um único fornecedor.

---

## 6. Intérprete em tempo real

### Fluxo

```text
User/third-party speech
 -> VAD
 -> streaming STT
 -> detect language
 -> determine direction A->B
 -> translate
 -> emergency-context pass when applicable
 -> render text
 -> TTS
 -> next turn
```

### Engine selection

```text
STT:
  ML Kit Speech basic/advanced
  -> sherpa-onnx
  -> whisper.cpp

Language ID:
  ML Kit Language Identification
  -> MediaPipe Language Detector

Translation:
  ML Kit Translation
  -> local LLM for context-sensitive rewrite
  -> canonical phrasebook for protocol-specific phrases

TTS:
  Android TextToSpeech
  -> sherpa-onnx TTS
```

### Conversational state

```text
speaker A language
speaker B language
turn timestamps
partial transcript
final transcript
translated text
detected emergency entities
active protocol
canonical phrase match
```

O app pode operar como mediador bilateral: escuta uma fala, identifica idioma, traduz, apresenta/fala a tradução e inverte a direção no turno seguinte.

---

## 7. Chrome / Gemini synchronization

### Browser surface

O companion web expõe WebMCP tools:

```text
get_active_alerts
get_protocol
get_readiness
prepare_checkin
open_map
explain_event
```

WebMCP está em origin trial a partir do Chrome 149. O Google informou no I/O 2026 que Gemini in Chrome terá suporte às APIs WebMCP.

O mesmo web companion pode aproveitar APIs Built-in AI do Chrome desktop para Translator, Language Detector e Prompt quando disponíveis.

Fontes:
- https://developer.chrome.com/docs/ai/webmcp
- https://developer.chrome.com/blog/chrome-at-io26
- https://developer.chrome.com/docs/ai/built-in/overview
- https://developer.chrome.com/docs/ai/translator-api
- https://developer.chrome.com/docs/ai/language-detection

### Native Android surface

AppFunctions é o bridge nativo equivalente. A documentação Android descreve AppFunctions como Android MCP e cita explicitamente assistentes como Google Gemini.

Fontes:
- https://developer.android.com/ai/appfunctions
- https://developer.android.com/ai/intelligence-system

### State synchronization

```text
device-local canonical state
  event timeline
  local protocol pack version
  readiness state
  preferences/places
       |
       +--> encrypted sync account (opt-in)
       |
       +--> web companion
       |
       +--> remote MCP
```

Alertas e protocolos podem funcionar totalmente localmente. Sync adiciona continuidade cross-device.

---

## 8. Sensing integrado ao agente

O sensor entrega **eventos estruturados**, e não texto livre:

```json
{
  "source": "esp_wifi_sensing",
  "session_id": "...",
  "event": "motion",
  "state": "active",
  "confidence": 0.84,
  "trained_profile": "living-room-v1",
  "timestamp": "...",
  "quality": {
    "channels": 3,
    "signal": "good"
  }
}
```

O Tool Core pode expor isso ao agente via:

```text
sensor.read_state()
sensor.get_recent_events()
```

Assim Gemini Nano/Gemma recebe um contexto tipado e pode explicar o estado ou combinar o sinal com um protocolo, enquanto o módulo de sensing continua independente do modelo.

---

## 9. Test suite do harness

### Protocol adherence

Corpus por hazard com:

- pedido direto;
- pedido ambíguo;
- informação irrelevante;
- instruções conflitantes no texto;
- idiomas diferentes;
- perda de rede;
- evento atualizado/cancelado;
- sensor com baixa confiança;
- protocolo ausente;
- tool indisponível.

### Métricas

- schema validity;
- protocol retrieval hit@k;
- canonical-step preservation;
- unsupported-step rate;
- correct tool selection;
- unnecessary tool call rate;
- language identification;
- translation semantic preservation;
- end-to-end latency;
- battery/thermal budget;
- offline success rate.

### Cross-runtime eval

O mesmo corpus roda em:

- Gemini Nano;
- Gemma/LiteRT-LM;
- GGUF/llama.cpp;
- cloud model de referência.

O runtime passa a ser uma variável mensurável do sistema, enquanto a função do Defensor permanece estável.

---

## 10. Primeiro spike recomendado

```text
Android Compose shell
+ AppFunctions sample
+ ADK Kotlin
+ LiteRT-LM small local model
+ ML Kit Language ID
+ ML Kit Translation
+ sherpa-onnx or ML Kit Speech
+ Android TTS
+ Room
+ SQLite-Vector
+ 3 offline protocol packs
```

Demo:

1. desligar Wi-Fi/dados móveis;
2. abrir o intérprete;
3. interlocutor fala em idioma diferente;
4. app identifica idioma;
5. app transcreve/traduz/fala;
6. usuário pergunta uma questão de emergência;
7. agente recupera protocolo local;
8. retorna ação estruturada com fonte/versão;
9. tool `get_protocol` funciona igualmente pelo agente local;
10. ao retornar online, mesma capability fica exposta via AppFunctions/remote sync.

Esse spike valida a arquitetura de agente offline antes de depender de backend ou cloud model.
