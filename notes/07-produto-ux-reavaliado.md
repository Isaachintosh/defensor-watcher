# DEFCON WATCHER — produto e UX reavaliados para Wi-Fi sensing

Data: 2026-09-25  
Escopo: Android-first, produto, segurança pessoal e mockup.  
Evidência: o fenômeno físico é real; disponibilidade e desempenho no Android ainda não foram demonstrados pelo projeto.

## Decisão executiva

O parecer anterior deve ser corrigido: Wi-Fi sensing é fisicamente possível. Pesquisa demonstra presença, movimento, postura e sinais vitais em configurações instrumentadas. Isso não significa que qualquer app Android obtenha CSI/BFI bruto, opere com qualquer roteador ou detecte ameaças com confiabilidade.

- GO: núcleo de alertas oficiais, protocolos offline e check-in.
- GO experimental condicionado: módulo separado, iniciado pelo usuário, limitado inicialmente a presença/movimento em ambiente calibrado e hardware compatível.
- NO-GO: sensing como prova de intrusão, identidade, intenção ou arma; promoção isolada aos níveis 1–3; acionamento automático.
- NO-GO: prometer radar em qualquer celular/roteador. As APIs Android públicas documentadas oferecem scan/RSSI e RTT; não foi localizada API pública Android genérica para CSI/BFI bruto.

Separar o produto em Prontidão (fatos oficiais) e Laboratório Wi-Fi (sinais experimentais com incerteza).

## Correção da nota 04

A nota 04 acerta a física, mas mistura prova de laboratório, padrão IEEE, chipset e API Android. RTT mede distância a APs/peers compatíveis, não pessoas. Scan/RSSI sofre throttling, permissões e influência ambiental. Resultados através de paredes usam hardware, dados e treino específicos. Claims de identificação quase perfeita exigem validação independente. A fonte IEEE localizada ainda trata P802.11bf como projeto/emenda; ratificação e disponibilidade universal devem ser verificadas antes de marketing.

Formulação correta: a capacidade existe; disponibilidade e qualidade dependem de aparelho, SO, driver, roteador, ambiente e caso de uso.

## Escopo revisado

Núcleo obrigatório:

- home com nível, cobertura e última sincronização;
- alerta com fonte, área, emissão, validade, instrução e explicação;
- protocolos offline e check-in manual com prévia;
- estados de rede, permissão e dado vencido;
- região manual, sem localização contínua obrigatória.

Laboratório Wi-Fi:

- diagnóstico de compatibilidade e consentimento separado;
- sessão visível, iniciada pelo usuário, com botão Parar;
- calibração de ambiente vazio e movimento conhecido;
- saídas: sem mudança relevante, mudança detectada ou inconclusivo;
- confiança significa qualidade do sinal/modelo, nunca probabilidade de ameaça;
- log local apagável, sem SSID/BSSID em analytics;
- modo simulado em aparelho incompatível.

Fora do mockup: identidade, marcha, sinais vitais, silhueta, background secreto/contínuo, redes de terceiros, upload bruto e ações externas automáticas.

## Disponibilidade prática

| Classe | Condição | UX | Uso |
|---|---|---|---|
| A — Android público | scan/RSSI ou RTT | medição básica | diagnóstico/experimento |
| B — OEM/parceiro | SDK em modelos homologados | selo de compatibilidade | evento calibrado |
| C — hardware auxiliar | AP/receptor fornece CSI/BFI | pareamento/cobertura | evento experimental |
| D — root/pesquisa | driver/firmware modificado | fora da Play/MVP | bancada |
| Indisponível | capability/permissão/hardware ausente | núcleo continua | nenhuma medição |

Capability deve ser detectada em runtime. Android 9+ não basta. RTT requer telefone e AP compatíveis, app visível/serviço em primeiro plano, Wi-Fi/Localização ativos e permissão aplicável.

## Taxonomia

| Nível | Rótulo | Gatilho | Papel do Wi-Fi |
|---|---|---|---|
| 5 | Rotina | fontes operacionais; nenhum alerta aplicável conhecido | não confirma segurança |
| 4 | Atenção | aviso preventivo ou observação experimental reconhecida | observação, nunca fato |
| 3 | Preparação | alerta oficial aplicável | não promove sozinho |
| 2 | Ação | alerta oficial urgente | não promove sozinho |
| 1 | Crítico | alerta oficial máximo ou SOS manual | não promove sozinho |

Estados ortogonais obrigatórios: Desconhecido, Desatualizado, Experimental, Inconclusivo, Indisponível, Teste e Conflito. Eles não são níveis. Correto: “Nível 4 · observação experimental · sinal instável”. Proibido: “Nível 2 · invasor detectado”.

## Jornadas

1. Primeiro uso: região/idioma → limites → notificações → home. Wi-Fi/localização só no contexto; núcleo funciona sem ambos.
2. Alerta: evento/área/fonte/ação → fato, cálculo e orientação separados → protocolo/check-in → update/cancel com trilha.
3. Sensing: diagnóstico → consentimento → calibração → sessão → resultado. Mudança oferece detalhes, descartar ou check-in; nunca emergência automática.
4. Incompatível: mostrar motivo, não pedir permissão inútil, oferecer simulação, manter núcleo.
5. Inconclusivo: qualidade cai → recalibrar, encerrar ou check-in. Silêncio não implica ausência.
6. Check-in: escolher estado → revisar destinatário/texto/localização → confirmar → diferenciar compartilhado de entregue.

## Wireframes textuais

Home: Nível e descrição; fonte/cobertura; última atualização; Alertas, Protocolos e Check-in; cartão Laboratório Wi-Fi sempre rotulado EXPERIMENTAL.

Alerta: nível + ação; evento/área; fonte/emissão/validade; instrução oficial; Protocolo e Check-in; “Como calculamos”.

Diagnóstico: telefone, API, roteador, permissão e calibração; texto “mede mudanças de rádio; não identifica pessoas ou ameaças”; Limites e Começar.

Calibração: etapa 1/2, ambiente vazio, contador de 30 s, qualidade do sinal e Cancelar.

Sessão: faixa EXPERIMENTAL, qualidade e horário da calibração, “MUDANÇA DETECTADA — não sabemos a causa”, Descartar, Detalhes, Check-in e Parar.

Dados vencidos: idade da sincronização, último nível com horário e “isso não significa que o risco acabou”; Tentar e Protocolos offline.

## Regras e aceitação

- Evento + ação antes do número; nunca depender só de cor/som/vibração.
- Saída experimental sempre tem rótulo, causa desconhecida e horário.
- Não mostrar mapa de pessoas sem precisão demonstrada.
- Botões descrevem o efeito real; Parar sempre visível.
- ≥90% identificam em 10 s se a informação é oficial, experimental, simulada ou vencida.
- 100% distinguem mudança detectada de ameaça/pessoa confirmada; qualquer confusão bloqueia lançamento.
- ≥85% escolhem ação adequada em 60 s sem ajuda.
- Wi-Fi isolado jamais dispara nível 1–3 ou ação externa.
- Mostrar compatível, parcial, indisponível ou não verificado com motivo.
- Recusar permissões mantém o núcleo; Parar encerra a medição.
- Fora da faixa validada, retornar inconclusivo, nunca sem movimento.
- Medir sensibilidade, especificidade, falsos alarmes/h e intervalos por hardware/ambiente.
- Meta inicial de pesquisa: ≤1 falso alarme/h e recall ≥90% em cenário controlado pré-definido; falha mantém em bancada.
- Fluxos devem funcionar com TalkBack, texto 200%, retrato e contraste; nada só em áudio/háptica/cor.

## Plano de testes humanos

1. Compreensão (8–10): cartões oficial, vencido, exercício, sensing e incompatível. Gate: zero confusão sensing/ameaça.
2. Protótipo (12–15): enchente, perda de rede, sessão inconclusiva, mudança noturna e check-in. Medir tempo, erro, ansiedade e confiança.
3. Acessibilidade/estresse (6–8 por necessidade): TalkBack, texto 200%, ruído, pouca luz, uma mão, bateria baixa e rede intermitente.
4. Estudo técnico: consentimento e ground truth separado; variar aparelho, AP, cômodo, parede, distância, pessoas, pets, ventilador, portas e móveis; separar treino/teste.
5. Piloto doméstico fechado: só após etapa 4, matriz homologada, opt-in renovável, exclusão e suporte; sem notificações críticas no início.

Kill criteria: irreprodutibilidade, falsos alarmes acima do limite, root não distribuível, consumo inviável, dano/ansiedade ou privacidade sem mitigação.

## Desenvolvimento inicial

1. Tokens separados para severidade, frescor e experimentalidade.
2. Cinco telas Compose com dados locais e máquina de estados.
3. CapabilityDiagnostic falso cobrindo todos os estados; sem Wi-Fi real.
4. Telemetria de navegação/compreensão, sem identificadores de rede.
5. Rodar testes 1 e 2 e congelar linguagem aprovada.
6. Spike técnico A/B/C e matriz aparelhos/APs.
7. Conectar medição real só após capability, consentimento e thresholds pré-registrados.

Bloqueios: escolher presença, movimento ou queda; definir API/SDK/AP; ambiente e consentimento; território e alertas oficiais; retenção do bruto; nome da escala e risco da marca DEFCON.

## Fontes primárias

- https://developer.android.com/develop/connectivity/wifi/wifi-scan
- https://developer.android.com/develop/connectivity/wifi/wifi-rtt
- https://developer.android.com/develop/connectivity/overview
- https://mypr-nodejs.standards.ieee.org/mypr-file/par/8527/mypr
- https://www.media.mit.edu/projects/seeing-through-walls-computer-vision/overview/

## Parecer final

Wi-Fi sensing não é impossível, mas não passa diretamente de pesquisa possível a recurso de segurança disponível. O caminho defensável é um laboratório opcional, observável e incapaz de escalar emergência sozinho, ao lado do núcleo oficial. O primeiro sucesso do mockup é o usuário entender o que foi medido, inferido e permanece desconhecido.
