# Reavaliação técnica — Wi‑Fi sensing no Defcon Watcher

**Data:** 25 de setembro de 2026  
**Escopo:** auditar a nota 04 e separar prova científica, produto embarcado e o que uma aplicação Android comum, distribuída pela Play Store, realmente consegue fazer.

## Veredito executivo

A tese física da nota 04 é correta: Wi‑Fi pode ser usado como sensor e o IEEE 802.11bf-2025 já é um padrão ativo. Porém, a conclusão “smartphones e roteadores convencionais estão plenamente aptos a operar como radar” mistura quatro camadas que não são equivalentes:

1. demonstrações de laboratório com rádios/SDRs próprios;
2. CSI obtido por NIC, firmware ou driver específico;
3. BFI capturado passivamente por interface em modo monitor;
4. APIs públicas disponíveis a um app Android não privilegiado.

Para o **Defcon Watcher Android de curto prazo**, o resultado é **NO-GO para radar/silhueta/biometria usando apenas APIs públicas do telefone** e **GO para um protótipo de Wi‑Fi sensing com hardware companheiro controlado**, preferencialmente ESP32 com CSI, enquanto o app atua como interface, calibração, inferência/visualização e alerta. Wi‑Fi RTT é útil para distância do telefone a APs compatíveis, não substitui CSI/BFI nem comprova presença humana sem dispositivo.

## Matriz de alegações

| Alegação da nota 04 | Evidência primária atual | Veredito | Requisito real | Spike de validação |
|---|---|---|---|---|
| Wi‑Fi sensing existe e suporta arranjos bi/multiestáticos | [NIST, descrição do procedimento 802.11bf](https://www.nist.gov/publications/ieee-80211bf-enabling-widespread-adoption-wi-fi-sensing); [IEEE 802.11bf-2025](https://standards.ieee.org/ieee/802.11bf/11574/) | **Confirmada**, como tecnologia e padrão | Dispositivos/firmware que implementem as funções e exponham medições | Inventariar hardware 802.11bf realmente comprável e SDK/APIs disponíveis; conformidade no datasheet não basta |
| 802.11bf foi ratificado | IEEE registra aprovação em 28/05/2025 e publicação em 26/09/2025 como padrão ativo | **Confirmada** | Implementação no silício, firmware, SO e API de aplicação | Testar um produto anunciado como 802.11bf e exigir documentação de API/SDK |
| Um smartphone Android comum fornece CSI ao app | As APIs públicas Android documentam RSSI/scan, link stats e [Wi‑Fi RTT](https://developer.android.com/develop/connectivity/wifi/wifi-rtt), mas não uma API pública CSI/802.11bf; o [HAL Wi‑Fi](https://source.android.com/docs/core/connect/wifi-hal) é a fronteira de fabricante/sistema, não API de Play Store | **Não confirmada / falsa para o escopo atual** | Firmware/driver OEM, root, ROM customizada ou hardware externo | App mínimo enumera `FEATURE_WIFI_RTT`, mede RTT/RSSI e registra modelo/API; resultado esperado: nenhum CSI bruto |
| Wi‑Fi RTT permite “radar” humano | Android informa distância a AP/peer RTT, tipicamente 1–2 m, com hardware e permissões compatíveis | **Não**; é ranging do dispositivo, não sensing humano device-free | AP 802.11mc/az e telefone compatível; pessoa/telefone participa | Medir estabilidade de RTT em LOS/NLOS e demonstrar explicitamente que não entrega presença/silhueta |
| CSI pode ser extraído de hardware de consumo | [Nexmon CSI](https://github.com/seemoo-lab/nexmon_csi) demonstra alguns chips Broadcom com firmware modificado; [ESP-CSI](https://github.com/espressif/esp-csi) expõe CSI em ESP32 | **Confirmada, mas limitada a plataformas suportadas** | Chip/firmware/driver compatível; no caso Android, frequentemente root/ROM e modelos antigos específicos | Spike recomendado: 2× ESP32, taxa de pacotes fixa, dataset vazio/uma pessoa/movimento, métricas de falso positivo |
| BFI elimina hardware especializado e funciona com roteadores comuns | O paper [BFId, ACM CCS 2025](https://publikationen.bibliothek.kit.edu/1000185756) usa BFI padronizado e 197 participantes; não transforma uma API Android comum em sniffer | **Confirmada no modelo experimental/adversarial; extrapolação incorreta para app** | Tráfego/beamforming compatível e uma interface capaz de captura passiva/monitor mode; pipeline próprio | Reproduzir primeiro em Linux com NIC documentada e captura autorizada; só depois avaliar portar para hardware companion |
| Identificação “quase 100%” é geral | BFId relata alta acurácia em dataset controlado; é reidentificação supervisionada, não identificação universal, e amostras úteis diferem do total recrutado | **Parcial / não generalizável** | Enrolamento prévio, geometria e domínio de treinamento, captura de BFI e condições semelhantes | Teste leave-one-room/device/person-out; relatar FAR/FRR e degradação cross-domain, não só accuracy |
| Roteador/smartphone comum reconstrói silhuetas 3D através de parede | [RF-Pose, CVPR 2018](https://rfpose.csail.mit.edu/) usa sensor RF próprio e rede neural; o próprio paper descreve sinal ativo dedicado, não apenas APIs de Wi‑Fi de um celular. Passive Wi‑Fi through-wall foi demonstrado com SDR em [IEEE TAES 2021](https://ieeexplore.ieee.org/document/9393557) | **Pesquisa válida; descrição da nota é enganosa** | Array RF/SDR ou receptor especializado, sincronização, geometria e modelo treinado | Fora do MVP; se perseguido, bancada SDR separada e revisão regulatória/ética |
| Respiração/frequência cardíaca por CSI é robusta em infraestrutura comum | Literatura demonstra viabilidade em cenários controlados; sensibilidade depende de posição, movimento, multipath e taxa/qualidade do CSI | **Parcial; não é dispositivo médico nem promessa de emergência** | CSI de alta cadência, calibração, ambiente estável e validação clínica para qualquer claim de saúde | Somente pesquisa; medir respiração com ground truth e rejeitar claim cardíaco até validação independente |
| Qualcomm, Intel e MediaTek já tornam sensing nativo e amplamente utilizável | A página atual da Qualcomm lista 802.11bf em plataformas selecionadas, mas isso não prova disponibilidade em telefones, firmware habilitado ou API Android; a nota não apresenta fontes primárias equivalentes para Intel/MediaTek | **Insuficiente** | SKU exato + firmware + driver + API/SDK + produto comercial | Criar tabela por SKU com link primário, aparelho vendido, versão de firmware e método documentado de acesso |
| Mapeamento 3D de cobertura por apps prova radar humano | Heatmaps de RSSI/RTT são mapeamento de cobertura/localização e não CSI sensing | **Falsa equivalência** | RSSI/RTT e planta/posição | Manter como recurso diagnóstico separado, com nome “mapa de cobertura”, nunca “radar” |
| Criptografia de payload não impede inferência física/BFI | CSI/BFI descrevem o canal; proteger conteúdo não elimina toda a informação lateral | **Correta em princípio**, com ameaça dependente da capacidade de captura | Receptor apropriado, proximidade e tráfego/feedback útil | Threat model: atacante, distância, frames acessíveis, retenção e mitigação |

## Fragilidades específicas da nota 04

- Instagram, ScienceDaily, CNBC, Estadão, blogs comerciais e posts de consultoria não devem sustentar claims centrais quando existem padrão e papers originais.
- A referência Purple Hue alegava adoção ampla sem demonstrar SKUs, firmware, SO e API. Deve ser removida como prova de disponibilidade Android.
- A data/notícia da ScienceDaily não é necessária: a fonte correta da alegação é **BFId (ACM CCS 2025)**. Mesmo esse paper prova um ataque em montagem controlada, não um recurso pronto de app.
- “Roteadores propagam ondas constantes” é impreciso: sensing depende de transmissões/quadros e cadência suficientes; tráfego, power save, airtime e agendamento afetam observabilidade.
- “3D”, “alta fidelidade”, “identidade exata” e “plenamente viável” omitem generalização, calibração, múltiplas pessoas, pets, mudanças de ambiente e falsos alarmes.
- Padronização não implica retrocompatibilidade funcional de sensing nem exposição automática às aplicações. Um dispositivo legado pode continuar comunicando sem oferecer medições 802.11bf.

## Protótipo prático recomendado

### Arquitetura P0 — demonstrador honesto (2–3 semanas)

- **Sensor:** dois ESP32 suportados pelo ESP-CSI, um transmissor e um receptor fixos; opcionalmente um terceiro nó para diversidade espacial.
- **Android:** app recebe features/eventos por BLE ou LAN; mostra `sem movimento / movimento provável / sensor degradado`, qualidade do enlace e última calibração. Não mostrar silhueta, identidade ou “pessoa atrás da parede”.
- **Processamento inicial:** amplitude CSI, remoção de outliers, filtro passa-faixa, variância/janela e classificador simples. Começar com detecção binária; ML somente após baseline e dataset.
- **Dados:** processamento local por padrão; armazenar janelas somente com consentimento explícito; apagar bruto após extração quando possível.
- **Mockup:** incluir estado indisponível, perda de sensor, confiança, botão calibrar, modo teste e aviso “não substitui alerta oficial; ausência de detecção não significa segurança”.

### Critérios de saída do spike

Executar em pelo menos dois cômodos e três dias, com vazio, uma pessoa parada, andando, ventilador/cortina e pet/objeto móvel quando disponível. Separar treino e teste por sessão/dia. O protótipo só avança se:

- disponibilidade do sensor ≥ 95% durante sessões;
- latência p95 ≤ 2 s;
- sensibilidade de movimento humano ≥ 90% no cenário calibrado;
- falso alarme ≤ 1 por hora vazia;
- queda de desempenho cross-day e após mover móveis é medida e apresentada, não ocultada;
- todo alerta carrega confiança/qualidade e existe estado explícito de falha.

### Trilhas futuras

1. **App-only:** manter RSSI/RTT apenas para diagnóstico/localização do próprio aparelho; não chamar de sensing humano.
2. **BFI:** experimentar em Linux/NIC em modo monitor, em rede e ambiente autorizados; só migrar se houver caminho Android documentado sem root ou se assumir acessório dedicado.
3. **802.11bf:** acompanhar aparelhos/APs com suporte verificável e API de aplicação. Reavaliar quando houver telefone comercial + firmware + SDK/API acessível, não apenas chipset compatível.
4. **Through-wall/biometria:** pesquisa separada, fora do MVP de segurança pessoal, sujeita a consentimento, threat modeling e avaliação jurídica.

## Decisão de produto

Wi‑Fi sensing pode entrar no roadmap do Defcon Watcher, mas como **módulo experimental com hardware companion** e linguagem probabilística. Para o mockup Android inicial, representar o fluxo completo e os estados de erro usando dados simulados; em paralelo, o P0 com ESP32 valida se há sinal útil. Não condicionar recursos essenciais de emergência ao sensor, não inferir identidade e não comunicar “radar através de paredes” até que hardware, dataset e testes independentes sustentem especificamente essa promessa.

