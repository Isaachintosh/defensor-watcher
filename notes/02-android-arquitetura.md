# Arquitetura Android-first — avaliação de viabilidade

**Estado:** V1 · evidência parcial. O README declara a intenção; esta nota confronta-a com documentação oficial Android. Ainda não existem protótipo executável, dispositivo-alvo, teste de campo ou validação com usuário; não há base para V2/V3.

## Parecer executivo

O núcleo é viável como **assistente pessoal de preparação e resposta acionado pelo usuário**: alertas de fontes confiáveis, orientação clara, playbooks offline, localização compartilhável sob consentimento, bússola/lanterna, câmera em baixa luz e tradução pré-baixada.

Não é honesto prometer em um app comum da Play Store: vigilância invisível contínua; detecção genérica de “ameaças ao redor”; Wi‑Fi como radar de pessoas; visão noturna/térmica em qualquer aparelho; leitura universal de Cell Broadcast; sensores sensíveis continuamente em background; ou entrega instantânea garantida durante falha de aparelho/rede.

**Promessa V0 recomendada:** “Transformar alertas verificáveis e contexto local em orientação offline-first e acionável, sempre mostrando fonte, horário, confiança e limites.” A escala 5→1 deve ser **nível de atenção**, calculado e explicável, nunca certeza de perigo.

## Evidência e lacunas

Fonte de produto: `README.mdn`, incluindo “5 levels of threat”, canais de emergência, sensores, “wifi signal as an active/passive radar”, câmera noturna, vibração, infravermelho e tradução.

Fontes técnicas primárias:

- [Android Sensors Overview](https://developer.android.com/develop/sensors-and-location/sensors/sensors_overview)
- [Wi‑Fi scanning overview](https://developer.android.com/develop/connectivity/wifi/wifi-scan)
- [Permissões de Wi‑Fi próximo](https://developer.android.com/develop/connectivity/wifi/wifi-permissions)
- [Restrições para iniciar foreground services](https://developer.android.com/develop/background-work/services/fgs/restrictions-bg-start)
- [Localização em segundo plano](https://developer.android.com/develop/sensors-and-location/location/background)
- [Background location limits](https://developer.android.com/about/versions/oreo/background-location-limits)
- [Background work/WorkManager](https://developer.android.com/develop/background-work)
- [Full-screen intents no Android 14](https://developer.android.com/about/versions/14/behavior-changes-14)

Lacunas: país/autoridade inicial; feeds e licenças; cenário/persona primário; precisão, latência e falsos positivos aceitáveis; aparelhos/Android mínimos; modelo de ameaça; privacidade/retenção; operação editorial; exigências regulatórias e da Play Store.

## Capacidades reais por sensor/API

| Ideia | O que é possível | Limites práticos | Decisão |
|---|---|---|---|
| Nível 5→1 | Regras locais combinam severidade, região, recência e confirmação | Sem fontes/calibração o número é arbitrário; risco de falsa segurança | Manter como **nível de atenção**, com fatores, fonte, horário e confiança |
| Alertas oficiais | Consumir feeds/APIs por adaptador e entregar por push/cache | Não há API pública universal; Cell Broadcast é infraestrutura privilegiada/OEM/operadora | Spike por país; não prometer cobertura universal |
| Notificações urgentes | Canal de alta importância, som/vibração escolhidos pelo usuário | Permissão pode ser negada; no Android 14+ full-screen intent é restrito por padrão a chamadas/alarmes | Heads-up normal; nada de takeover da tela no MVP |
| Localização | Fused Location, geofence e compartilhamento explícito | Background recebe poucas atualizações/hora, exige disclosure/justificativa e pode exigir `ACCESS_BACKGROUND_LOCATION`; custa bateria | V0 somente em uso; background só após valor provado |
| Movimento/orientação | Acelerômetro, giroscópio, magnetômetro e rotação quando presentes | Inventário/qualidade variam; ruído impede inferir ameaça genérica | Bússola e gesto; queda somente com validação específica |
| Vibração/proximidade | Haptics e sensor de proximidade quando presente | Vibração comunica; não mede proximidade. Sensor costuma alcançar centímetros | Feedback discreto; retirar claim de detecção |
| Wi‑Fi “radar” | APs, RSSI e, em hardware/AP compatíveis, RTT | Scans: Android 9+ permite foreground até 4/2 min; apps background compartilham 1/30 min. Scan exige localização fina/serviço de localização. RSSI é instável e não identifica pessoas | Não usar no produto; spike apenas para documentar descarte |
| Câmera/baixa luz | CameraX/Camera2, ISO/exposição, flash/torch, análise local com tela ativa | Câmera comum não vê calor; IR depende de hardware/OEM. Background camera é restrita e requer serviço foreground iniciado visivelmente | Chamar “modo baixa luz”, não visão noturna/IR; fora do MVP |
| Infravermelho | Alguns aparelhos têm emissor via `ConsumerIrManager` | Emissor não é câmera IR nem sensor térmico; hardware raro | Fora do MVP |
| Microfone/tradução | Reconhecimento e tradução iniciados pelo usuário; pacote offline | Permissão while-in-use, indicador, privacidade e ruído; escuta contínua é inadequada | Tradução sob ação explícita; nada de escuta contínua |
| Offline | Room/DataStore, guias e último alerta cacheados, idiomas/mapas selecionados | Dado envelhece; GPS pode operar sem rede, mas alertas/mapas/geocoding podem não | Central; sempre exibir “última atualização” e estado offline |
| Background | WorkManager para sync persistente/adiável, FCM para push, FGS para sessão visível | WorkManager não é tempo real/daemon; FGS tem tipos, permissões, notificação e restrições | Arquitetar por eventos; nada de daemon permanente |
| SOS | Abrir discador e compartilhar texto/localização por ação do usuário | Chamadas/SMS automáticos são restritos e perigosos; rede pode falhar | Fluxo assistido com confirmação |

## Arquitetura recomendada

Princípios:

1. **Offline-first e explainable-first:** mostrar origem, timestamp, área, motivo do nível e o que não se sabe.
2. **Usuário inicia recursos sensíveis:** câmera, áudio e localização precisa vivem em sessão visível.
3. **Bruto separado de interpretação:** alerta normalizado é imutável; `Assessment` derivado é auditável e versionado.
4. **Fail-safe:** falta de dados vira “desconhecido/desatualizado”, nunca “seguro”.
5. **Manual antes de automação:** provar ingestão, triagem e orientação manual; automatizar depois.
6. **Permissões progressivas:** pedir no momento do recurso e oferecer degradação funcional.

```text
fontes oficiais -> backend de ingestão/verificação -> FCM
                         |
                         v
Android: sync/repository -> Room -> motor determinístico explicável
                                -> UI/notificação/playbook offline
                                -> ferramentas sob ação do usuário
```

- **Backend:** adaptador por fonte, normalização, deduplicação, proveniência/assinatura quando houver, expiração, auditoria e fan-out FCM. Não classificar tudo com LLM.
- **Domínio:** `Alert`, `Source`, `Area`, `Assessment`, `AssessmentFactor`, `Guidance`, `Acknowledgement`, `PermissionState`, `SyncStatus`.
- **Motor:** regras determinísticas versionadas. Saída inclui nível, confiança, fatores e validade. Futuro LLM pode resumir conteúdo já validado, nunca decidir sozinho nível/ação crítica.
- **Local:** Room para alertas/avaliações/guias/recibos; DataStore para preferências; Keystore para segredos. Sem histórico de localização por padrão.
- **Execução:** coroutines/Flow no foreground; WorkManager para sync/housekeeping; FCM para evento remoto; foreground service só durante sessão longa iniciada pelo usuário, com notificação persistente.
- **UI:** Compose/Material 3; estados explícitos de conexão, permissão e frescor; acessibilidade, texto grande, alto contraste e linguagem simples.

## Stack Android

- Kotlin, Android Studio, Gradle Kotlin DSL.
- `minSdk` inicial 26 ou 28, a confirmar pelo público; `targetSdk` exigido pela Play na publicação.
- Compose + Navigation; ViewModel + `StateFlow`.
- Módulos pragmáticos: `app`, `core:model`, `core:data`, `core:database`, `core:network`, `core:notifications`, `feature:alerts`, `feature:guidance`, `feature:tools`, `feature:settings`.
- Room, DataStore, WorkManager, Hilt, Retrofit/OkHttp ou Ktor, kotlinx.serialization.
- FCM; CameraX; ML Kit apenas para tradução/OCR acionados.
- JUnit/coroutines-test, Room in-memory, MockWebServer, Compose UI; Macrobenchmark após estabilizar fluxo.

## MVP: V0 manual antes de automação

Objetivo: provar que uma pessoa recebe um alerta verificável, entende e escolhe a ação correta em menos tempo e com menos confusão.

Inclui:

- uma região e uma fonte autorizada;
- importação manual/endpoint simples, sem pipeline universal;
- lista/detalhe com fonte, horário, validade e área;
- nível por regra explícita simples: severidade da fonte + proximidade aproximada + recência;
- “por que este nível?”;
- playbook offline curto, revisado por especialista humano;
- notificação normal de alta importância;
- localização só em uso e opcional, com região manual como fallback;
- check-in local e compartilhamento via Android Sharesheet;
- recibo local de entrega/abertura/ação, sem telemetria sensível padrão.

Fora da V0: câmera, microfone, Wi‑Fi, queda/ameaça automática, localização background, tradução contínua, IA classificadora, integração universal, chamada/SMS automático e iOS.

### Eval pré-registrado

- Métrica primária: participantes que identificam a ação correta em até 60 segundos num exercício controlado.
- Guardrails: zero instrução sem fonte/horário; zero “seguro” com dado vencido; zero permissão sensível prematura.
- Eventos locais: `alert_received`, `alert_opened`, `guidance_viewed`, `action_selected`, sem conteúdo pessoal.
- Avançar somente se não houver orientação contraditória e usuários distinguirem “oficial”, “inferido” e “desatualizado”.

## Roadmap

### V0 · protótipo manual

Uma fonte, uma região, regra simples, conteúdo revisado, sync, notificação e playbook offline. Teste de mesa + exercício com usuários.

### V1 · evidência de campo parcial

Duas/três fontes da região; deduplicação; FCM/cache/expiração; localização em uso; geofence só se provar valor; tradução offline acionada; bússola/lanterna/baixa luz opcionais; métricas de latência/frescor/falha sem trilha de localização.

### V2 · verificado/endurecido

Revisão externa de conteúdo e threat model; matriz real de aparelhos/OEM/Doze/permissões; outage/backend/FCM; pentest/privacy review/Data Safety; regras confirmadas/corrigidas por responsável humano e usuários.

## Spikes prioritários

1. **Fonte oficial real (bloqueador):** país/cidade, termos, schema, latência, histórico, expiração e outage. Saída: adaptador + 20 alertas reprocessáveis.
2. **Entrega/frescor:** medir fonte→backend→FCM→aparelho em Wi‑Fi, 4G, Doze e offline. Saída: distribuição de latência + UX de dado vencido.
3. **Motor explicável:** reprocessar cenários com regras versionadas. Saída: golden tests; todo nível aponta fatores.
4. **Permissões/OEM:** Android 10–atual, aparelhos representativos; negar/revogar/reiniciar. Saída: matriz de degradação.
5. **Offline 24h:** guias, último alerta e região manual. Saída: nenhuma tela morta e frescor inequívoco.
6. **Bateria:** baseline versus sync, geofence e sessão ativa. Background location só entra se valor superar custo/política.
7. **Baixa luz:** CameraX em três aparelhos/ambientes; kill criterion se ganho inconsistente.
8. **Wi‑Fi como spike de descarte:** medir RSSI parado, pessoas movendo e mudança de AP. Se falsos positivos/negativos impedirem uso de segurança — expectativa provável — registrar “não viável” e remover da promessa.

## Riscos

- **Falsa segurança:** nível 5 com dado vencido é pior que ausência; “desconhecido” deve ser primeira classe.
- **Fadiga:** deduplicação, silêncio e confirmação humana exigem política.
- **Conselho perigoso:** instruções variam por evento/local; precisam de fonte oficial, revisão e versão. IA não improvisa.
- **Privacidade/stalking:** localização contínua amplia risco; padrão local, efêmero e opt-in.
- **Infraestrutura:** FCM, internet, GPS, bateria e sensores falham em crises; fallback offline obrigatório.
- **Fragmentação:** sensores/OEM variam; detectar capabilities em runtime e degradar.
- **Marca:** “DEFCON” pode sugerir afiliação oficial e “Watcher” vigilância; revisar naming/risco jurídico.

## Decisão proposta

Construir primeiro **alertas verificáveis + orientação offline**, não “radar por sensores”:

```text
alerta real -> normalizar -> verificar/proveniência -> entregar
-> explicar nível -> orientar -> usuário confirma -> medir
```

O gate humano permanece sobre fontes, conteúdo, severidade e ampliação de permissões. Câmera, Wi‑Fi e sensores só entram depois como ferramentas acionadas e com hipótese/eval próprios. Até existir teste de campo com baseline, resultado e delta, a viabilidade permanece V1: promissora no núcleo de orientação, não provada no produto completo.
