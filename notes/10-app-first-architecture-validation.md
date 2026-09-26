# Arquitetura app-first e plano de validação — 2026-09-25

**Estado:** proposta V1. Não é uma arquitetura validada em produção.

## 1. Contrato do produto

### Resultado

O usuário recebe um evento relevante, entende **o que aconteceu, quem disse, onde se aplica, quão atual é e o que fazer agora**, e continua com instruções essenciais mesmo com perda de rede.

### Não-sucesso

- parecer um app oficial quando não é;
- transformar ausência de dados em “seguro”;
- repetir push sem modelar update/cancelamento;
- usar IA para inventar severidade ou instrução;
- usar sensores genéricos como prova de ameaça;
- produzir uma “rota segura” sem evidência operacional.

### Setpoint inicial

Uma sessão é aceitável quando:

1. o alerta original pode ser recuperado e auditado;
2. geografia, validade e estado do evento estão corretos;
3. update/cancel é aplicado;
4. usuário identifica fonte, frescor e ação;
5. offline não esconde que os dados podem estar vencidos;
6. nenhuma inferência experimental promove o evento a crítico.

---

## 2. Arquitetura proposta

```text
FONTES
  CAP / WIS2 / APIs / feeds oficiais
  scientific authorities
  curated sources (classe separada)
          |
          v
INGESTION GATEWAY
  adapters -> schema validation -> raw immutable payload/hash
          |
          v
EVENT CANONICALIZER
  Alert / Update / Cancel
  source + sender + identifiers/references
  hazard/category
  urgency + severity + certainty
  onset + expires
  polygons/circles/admin areas
  official instruction + languages
          |
          v
APPLICABILITY ENGINE
  registered area OR optional current location
  deterministic intersection
  freshness / stale / unknown
          |
          v
READINESS POLICY
  deterministic rules
  never “safe by silence”
  sensor/crowd data cannot promote official critical state
          |
          +------------------+
          |                  |
          v                  v
PUSH DELIVERY          OFFLINE PACKAGE
FCM/APNs                protocols + last-known events
          |                  |
          +--------+---------+
                   v
ANDROID APP
  event timeline
  source/provenance
  action card
  offline/stale state
  check-in
  local plan
  optional sensing laboratory
```

## 3. CAP como modelo canônico inicial

OASIS CAP 1.2 já modela boa parte do domínio:

- `identifier`, `sender`, `sent`;
- `status`;
- `msgType = Alert | Update | Cancel | Ack | Error`;
- `references`;
- `urgency`;
- `severity`;
- `certainty`;
- `responseType` como prepare, shelter, evacuate, avoid, monitor etc.;
- `instruction`;
- múltiplos idiomas;
- áreas em polígonos/círculos/códigos.

Não force fontes não-CAP a fingirem campos que não possuem. O adapter registra `unknown`/ausente e preserva o original.

Fonte:
- https://docs.oasis-open.org/emergency/cap/v1.2/cs01/CAP-v1.2-cs01.html

---

## 4. Fonte piloto concreta: INMET WIS2/CAP

O INMET possui dataset de avisos em CAP publicado no WIS2:

- dataset `urn:wmo:md:br-inmet:alerts`;
- política WMO marcada como core;
- avisos meteorológicos públicos;
- portal de avisos inclui severidade, janela, riscos, instruções e municípios/áreas afetadas.

Isso torna o INMET um candidato tecnicamente melhor para primeiro adapter do que scraping de páginas.

Fontes:
- https://wis2bra.inmet.gov.br/oapi/collections/discovery-metadata/items/urn%3Awmo%3Amd%3Abr-inmet%3Aalerts?f=html
- https://avisos.inmet.gov.br/

**Gate antes de produção:** confirmar contrato de consumo, disponibilidade, latência, histórico, cancelamentos/updates e termos operacionais. “Está público” não significa automaticamente “tem SLA de app de segurança”.

---

## 5. Cell Broadcast não é uma API de app comum

No Android, a cadeia de Cell Broadcast é parte do sistema. O AOSP documenta:

- CellBroadcastService;
- CellBroadcastReceiver de sistema;
- permissões de assinatura/privilegiadas;
- `RECEIVE_EMERGENCY_BROADCAST` no allowlist do receiver privilegiado;
- acesso completo ao histórico limitado ao módulo;
- app SMS padrão recebe acesso específico ao histórico.

Portanto, o DEFENSOR não deve arquitetar o núcleo em torno de “capturar o Cell Broadcast recebido pelo telefone”.

Ele deve consumir **a fonte upstream/oficial quando disponível** e tratar Cell Broadcast como canal independente e redundante do sistema operacional.

Fontes:
- https://source.android.com/docs/core/ota/modular-system/cellbroadcast
- https://source.android.com/docs/core/permissions/perms-allowlist

---

## 6. Push não equivale a Cell Broadcast

FCM de alta prioridade tenta acordar o aparelho e entregar conteúdo urgente, mas:

- comportamento depende de plataforma e políticas;
- Doze e fabricantes importam;
- Do Not Disturb continua sob controle do usuário/sistema;
- abuso de high priority pode levar a downgrade;
- internet pode falhar exatamente durante uma emergência.

Portanto:

```text
source event timestamp
-> ingest timestamp
-> push accepted timestamp
-> device received timestamp
-> notification displayed timestamp
-> user opened/ack timestamp (quando consentido)
```

Esses tempos precisam ser medidos separadamente.

Fontes:
- https://firebase.google.com/docs/cloud-messaging/android-message-priority
- https://developer.android.com/develop/ui/compose/notifications

---

## 7. Localização

### Default recomendado

- localidade registrada manualmente;
- localização aproximada quando app está em uso;
- processamento geográfico local sempre que viável.

### Background location

Pode fazer sentido para “avise-me onde eu estiver”, mas é uma permissão sensível, sujeita à política da Play e a restrições do Android. Só entra após demonstrar benefício central e fallback funcional.

NINA demonstra um desenho útil: localização para avisos do local atual é processada no aparelho segundo o BBK.

Fontes:
- https://support.google.com/googleplay/android-developer/answer/9799150
- https://www.bbk.bund.de/DE/Warnung-Vorsorge/Warn-App-NINA/Einstellungen-Android/einstellungen-android.html

---

## 8. Sensing: classificação por maturidade

### Produção app-only

Pode contribuir com contexto do **aparelho**, não “ameaça ao redor”:

- acelerômetro/giroscópio;
- magnetômetro;
- luz;
- proximidade de curtíssimo alcance quando presente;
- barômetro quando presente;
- GNSS/localização;
- estado de rede/bateria.

A disponibilidade varia por dispositivo.

Fonte:
- https://developer.android.com/develop/sensors-and-location/sensors/sensors_overview

### Produção condicionada a hardware compatível

**Wi-Fi RTT / 802.11mc e 802.11az**

Serve para ranging contra APs compatíveis. Android 15+ adiciona suporte NTB 802.11az em hardware compatível.

Não é sensor genérico de presença/ameaça.

Fonte:
- https://developer.android.com/develop/connectivity/wifi/wifi-rtt

**UWB**

Android Jetpack UWB 1.0.0 ficou estável em maio de 2026. É excelente para ranging preciso entre dispositivos compatíveis e pode servir futuramente para anchors/companions.

Não detecta magicamente pessoas desconhecidas ao redor.

Fontes:
- https://developer.android.com/jetpack/androidx/releases/core-uwb
- https://developer.android.com/develop/connectivity/uwb

### Experimental — Wi-Fi sensing/CSI

Wi-Fi sensing é real.

O IEEE 802.11bf-2025 foi publicado em setembro de 2025 e padroniza melhorias para WLAN sensing.

ESP-CSI/Espressif já demonstra uso de CSI para inferir mudanças físicas e possui demos de movimento/presença.

O problema prático é o **acesso**: `WifiManager` público expõe scans/APs/RSSI e Wi-Fi RTT expõe ranging, mas isso não equivale a uma API universal de CSI/802.11bf em qualquer Android.

Consequência:

```text
ESP32/companion homologado
-> CSI/features
-> BLE/LAN
-> Android
```

continua sendo o P0 experimental mais realista.

Fontes:
- https://standards.ieee.org/ieee/802.11/11852/
- https://www.nist.gov/publications/ieee-80211bf-enabling-widespread-adoption-wi-fi-sensing
- https://github.com/espressif/esp-csi
- https://developer.android.com/develop/connectivity/wifi/wifi-scan

### Não credível como claim universal

- “infravermelho pela câmera”;
- “visão térmica” sem sensor térmico;
- identificar arma/intenção por RSSI;
- detectar todo invasor por Wi-Fi de qualquer smartphone;
- inferir “área segura” pela ausência de mudança;
- monitoramento invisível contínuo de câmera/microfone.

---

## 9. Classes de evidência

Para evitar colapsar tudo em “alerta”, cada evento derivado deve carregar uma classe:

### A — autoridade oficial
Defesa civil, meteorologia oficial, autoridade sísmica, autoridade de emergência.

### B — autoridade científica/operacional reconhecida
USGS/EMSC/PDC e equivalentes, conforme o evento e país.

### C — curadoria verificada
Ex.: modelo Watch Duty: fontes públicas + operador humano. Nunca se apresenta como A.

### D — comunidade
Relato/foto/ground truth do usuário. Informação auxiliar.

### E — sensor local experimental
Sinal físico medido pelo telefone/companion. Não equivale a “ameaça”.

**Regra inicial:** D/E não promovem sozinhos um evento para estado crítico.

---

## 10. A escala 5 → 1 precisa de duas dimensões visíveis

Um único número esconde conceitos diferentes.

Manter a escala de prontidão é possível, mas a UI deve mostrar separadamente:

1. **estado de prontidão pessoal**;
2. **severidade oficial**;
3. **certeza da fonte** quando fornecida;
4. **frescor/conectividade**;
5. **origem/classe de evidência**.

Exemplo:

```text
PRONTIDÃO 2 · AÇÃO
Chuva intensa · Grande Perigo
Fonte: INMET
Emitido 20:10 · válido até 23:59
Dados sincronizados há 42 s
Ação oficial: permaneça em local abrigado
```

Isso é melhor que “DEFCON 2” isolado.

---

## 11. IA dentro do produto

### Pode

- tradução auxiliar com original lado a lado;
- explicação simples de termos;
- busca conversacional em protocolos offline;
- personalização de checklist não crítico;
- resumo de histórico;
- exercícios/simulações;
- ajudar a preencher plano familiar.

### Não deve decidir sozinha

- se uma ameaça existe;
- severidade;
- área de aplicação;
- cancelamento;
- rota segura;
- ordem de evacuação;
- “você está seguro”.

A máquina de estado crítica deve ser determinística e auditável.

---

## 12. Experimentos pré-registrados

Seguindo o método do Cérebro INEVITA, critério vem antes do resultado.

### EXP-001 — semântica de evento

Hipótese: o pipeline reproduz corretamente sequência Alert → Update → Cancel sem manter evento cancelado como ativo.

Métrica:
- 100% do corpus de teste com estado final correto;
- zero perda do payload original;
- zero duplicação de evento lógico.

Guardrail:
- qualquer Cancel perdido bloqueia piloto.

### EXP-002 — perda de rede

Hipótese: o app continua útil sem fingir frescor.

Cenário:
- usuário recebe alerta;
- rede cai;
- validade passa;
- app reinicia;
- rede retorna;
- update/cancel chega.

Gate:
- UI sempre diferencia último estado conhecido de estado atual confirmado.

### EXP-003 — compreensão

Usuário recebe cartões:
- alerta oficial ativo;
- exercício;
- alerta cancelado;
- dado vencido;
- sensor experimental.

Gate inicial:
- >= 90% identifica fonte, estado e próxima ação em até 10 s;
- 100% distingue sensing experimental de confirmação de ameaça.

### EXP-004 — push

Medir em matriz real:
- Pixel;
- Samsung;
- Motorola/Xiaomi conforme público;
- rede boa/intermitente;
- bateria normal/economia;
- Doze;
- app fechado.

Não estabelecer SLO antes do baseline.

### EXP-005 — Wi-Fi sensing

Separado do produto de alerta.

Primeira hipótese:
> ambiente vazio vs movimento humano provável em um cômodo calibrado, com hardware companion conhecido.

Não testar identidade, intenção, arma, silhueta ou “ameaça”.

---

## 13. Roadmap recomendado

### P0 — fonte real, UI real, sem sensores

- adapter INMET CAP/WIS2;
- canonical event;
- Alert/Update/Cancel;
- área;
- histórico;
- offline;
- check-in simulado;
- push de laboratório.

### P1 — piloto Android

- Kotlin + Compose;
- Room/DataStore;
- backend mínimo de ingestão;
- FCM;
- localização registrada + foreground approximate;
- protocolos offline;
- acessibilidade;
- telemetria sem PII.

### P2 — segunda classe de hazard

Escolher uma fonte pública documentada, não “qualquer API que existir”.

Candidato natural: sismologia científica com feed estruturado.

### P3 — multi-country source registry

Cada adapter deve declarar:

- autoridade;
- território;
- hazard;
- URL/documentação;
- contrato/licença;
- auth;
- formato;
- suporte a update/cancel;
- geografia;
- idioma;
- latência observada;
- health check;
- comportamento de outage.

### P4 — household/travel mode

- lugares de interesse;
- contatos de confiança;
- check-in;
- planos offline;
- roaming de fontes por território.

### P5 — Defensor Sensor Lab

Hardware companion e sensing experimental em feature/module separado.

---

## 14. Decisão técnica

O projeto é tecnicamente plausível **como app de consciência situacional e prontidão conectado a fontes confiáveis**.

Ele fica tecnicamente fraco se o “sensor mágico” for o centro do pitch.

A arquitetura mais forte é:

> **official/scientific data first → deterministic applicability → actionable mobile UX → offline resilience → user coordination → experimental sensing as a separately validated subsystem.**

O próximo commit de código deve provar esse fluxo antes de adicionar um único sensor.
