# DEFCON WATCHER — riscos, privacidade, segurança e confiabilidade (Android)

**Status da avaliação:** conceito inicial, baseado no `README.md` da versão 0.1.  
**Escopo:** produto Android; segurança, privacidade, ética, confiabilidade operacional e critérios de liberação.  
**Limite:** esta análise é técnica e de produto; não substitui avaliação jurídica, regulatória ou de resposta a emergências.

## 1. Parecer executivo

**Decisão atual: NO-GO para divulgação pública como aplicativo de detecção de ameaças, “radar” pessoal ou orientador autônomo de emergência.** O conceito pode evoluir para **GO condicionado como assistente complementar de preparação e retransmissão fiel de alertas oficiais**, desde que o produto não invente ameaças, não substitua canais oficiais e não prometa capacidades que o telefone não possui.

O risco dominante não é apenas vazamento de dados. Em um app de emergência, uma mensagem errada, atrasada ou excessivamente confiante pode induzir fuga para área perigosa, permanência em local inseguro, pânico, distração ao dirigir ou atraso na chamada aos serviços de emergência. Portanto, disponibilidade, proveniência, incerteza e desenho de mensagens são requisitos de segurança de vida, não apenas UX.

Os itens “Wi‑Fi como radar”, “visão noturna”, “infravermelho pela câmera” e “vibração para proximidade” não devem aparecer como capacidades de detecção no produto ou na loja sem hardware específico, validação reproduzível e delimitação muito clara. A política do Google Play proíbe alegações enganosas e funcionalidades impossíveis, inclusive nos metadados da loja ([Deceptive behaviour](https://support.google.com/googleplay/android-developer/answer/9888077)).

## 2. Limites seguros do produto

### Pode fazer no primeiro produto

- Agregar e exibir alertas provenientes de fontes oficiais documentadas, preservando texto, horário, emissor, área, severidade e validade.
- Orientar preparação **antes** de emergências com checklists revisados por fontes competentes.
- Exibir contatos oficiais e abrir o discador, mapas ou sites oficiais por ação explícita do usuário.
- Permitir check-in manual e compartilhamento escolhido pelo usuário, com destinatário explícito.
- Manter um modo offline com conteúdo estático previamente revisado e data de revisão visível.
- Traduzir alertas como apoio, sempre mantendo o original acessível e marcando a tradução automática.

### Não deve fazer

- Declarar que detecta pessoas, armas, incêndio, gás, desabamento, invasão ou “ameaças ao redor” apenas com sinais Wi‑Fi ou sensores comuns do celular.
- Emitir alerta crítico a partir de uma inferência de IA não confirmada como se fosse fato.
- Recomendar rota, abrigo ou ação específica sem fonte, localidade, validade e contexto suficientes.
- Representar-se como Defesa Civil, autoridade pública ou aplicativo oficial.
- Ocultar câmera, microfone ou localização em segundo plano, ou tornar esses acessos condição para funções que não os necessitam.
- Rebaixar, substituir, silenciar ou contradizer um alerta oficial.

No Brasil, o **Defesa Civil Alerta** usa Cell Broadcast e entrega alertas para aparelhos compatíveis em áreas de risco; a Anatel informa que ele complementa outros meios, não deve ser substituído por este app ([visão geral](https://www.gov.br/anatel/pt-br/dados/utilidade-publica/alertas-de-desastres/defesa-civil-alerta), [perguntas e respostas](https://www.gov.br/anatel/pt-br/dados/utilidade-publica/alertas-de-desastres/perguntas-e-respostas)).

## 3. Modelo de ameaças

### Ativos críticos

- Integridade, autenticidade, atualidade e ordem dos alertas.
- Localização atual/histórica, identidade, contatos de confiança e estado de segurança do usuário.
- Capturas de câmera, áudio e dados de sensores.
- Tokens de push, credenciais, chaves de API e configuração das fontes.
- Reputação do emissor e trilha de auditoria de cada mensagem.
- Disponibilidade sob rede instável, bateria baixa, congestionamento e queda do backend.

### Atores e falhas relevantes

- Atacante remoto que compromete API, painel administrativo, fornecedor de push ou dependência.
- Fonte de dados comprometida, falsificada, desatualizada ou mal interpretada.
- Operador interno abusivo ou conta administrativa roubada.
- Aplicativo malicioso no aparelho tentando ler intents, arquivos, notificações ou tokens exportados.
- Pessoa próxima com acesso ao aparelho desbloqueado, inclusive em situação de violência doméstica.
- Tradução/IA que altera negação, local, tempo, intensidade ou instrução.
- Falhas não maliciosas: relógio incorreto, GPS impreciso, geofence errada, duplicação, cache obsoleto, perda de rede, economia de bateria e permissões revogadas.

### Fronteiras de confiança

1. Autoridade/fonte externa → serviço de ingestão.
2. Serviço de ingestão → normalização/tradução/classificação.
3. Backend → provedor de push → Android.
4. App → sensores, localização, armazenamento e compartilhamento externo.
5. Painel administrativo → emissão/correção/cancelamento.

### Cenários prioritários

| Cenário | Efeito | Controle mínimo |
|---|---|---|
| Alerta falso injetado | pânico, deslocamento perigoso | fontes permitidas; assinatura/autenticação; aprovação em dois passos para emissão própria; auditoria imutável; kill switch |
| Alerta verdadeiro atrasado ou não entregue | falsa sensação de segurança | nunca mostrar “tudo seguro” apenas por ausência de dados; TTL; estado “dados indisponíveis”; múltiplos canais; testes de entrega |
| Alerta cancelado continua em cache | ação indevida | suporte explícito a update/cancel; versão e identificador estável; expiração local |
| Geofence inclui/exclui área errada | orientação incorreta | margem de incerteza; mostrar área da fonte; localização aproximada por padrão; teste de fronteiras |
| IA traduz ou resume errado | instrução invertida | original sempre visível; tradução marcada; glossário controlado; não resumir instruções críticas automaticamente |
| Conta administrativa comprometida | envio em massa malicioso | MFA resistente a phishing; menor privilégio; segregação de função; limites; aprovação dupla; revogação imediata |
| Coleta contínua de localização/câmera | vigilância e risco físico | processamento local; opt-in específico; indicador persistente; retenção mínima; nenhuma captura secreta |
| App sugere estar “seguro” | usuário ignora sinais reais | nível “desconhecido” como padrão; linguagem de incerteza; lembrete de que o app não detecta todos os riscos |

## 4. Riscos de dano e controles

### Severidade crítica

- **Falso negativo:** nível 5/“seguro” quando não há dados ou sensores não detectam o perigo. Controle: ausência de alerta nunca equivale a segurança; usar “sem alerta oficial ativo conhecido” com horário da última atualização.
- **Falso positivo:** nível 1 dispara pânico ou abandono de local seguro. Controle: nível crítico apenas por fonte autenticada e regra determinística; inferências locais jamais promovem sozinhas um alerta crítico.
- **Orientação perigosa:** instrução genérica conflita com contexto local. Controle: retransmitir instrução oficial; se não houver, limitar-se a “consulte a autoridade/local seguro” e contatos oficiais.
- **Impersonação de autoridade:** UI, som ou texto parece alerta do sistema/Defesa Civil. Controle: identidade própria explícita; não imitar avisos do sistema; mostrar emissor e link de origem.

### Severidade alta

- Sobrecarga de alertas causa dessensibilização. Controle: deduplicação, agrupamento, severidade padronizada e testes de taxa.
- Tradução incorreta exclui pessoas vulneráveis. Controle: original + tradução, idiomas revisados para instruções recorrentes, acessibilidade e leitura simples.
- Monitoramento expõe vítimas a perseguidores ou abusadores. Controle: nenhum mapa público de check-ins; compartilhamento com prazo; tela de privacidade; exclusão rápida; autenticação local opcional.
- Consumo de bateria deixa aparelho indisponível. Controle: evitar varredura contínua; usar mecanismos de push; orçamento de energia e testes em aparelhos de entrada.

### Severidade média

- Escala 5→1 é confundida com DEFCON militar ou severidade oficial. Controle: renomear para escala própria, documentar significado e separar “severidade da fonte”, “proximidade” e “confiança”. Uma única cor/número não deve esconder essas dimensões.
- Recomendações não servem a crianças, idosos ou pessoas com deficiência. Controle: revisão de acessibilidade, linguagem e fluxos de assistência; não presumir mobilidade, audição ou visão.

## 5. Alegações sobre sensores: realidade e política

| Alegação do README | Avaliação | Decisão |
|---|---|---|
| “Wi‑Fi como radar ativo/passivo” | RSSI e varreduras de redes comuns não identificam de forma confiável natureza, posição ou intenção de uma ameaça. Radar real exige rádio/hardware e processamento específicos; não é uma capacidade genérica de todo Android. | **Remover do MVP e de marketing.** Apenas explorar em pesquisa separada, em hardware suportado, sem função de segurança de vida. |
| “Visão noturna pela câmera” | Câmera comum pode melhorar imagem em baixa luz, mas não enxerga no escuro total e varia por aparelho. | Chamar somente de “assistência de baixa luminosidade” quando testada; nunca “visão noturna” garantida. |
| “Infravermelho pela câmera” | Muitos módulos possuem filtro IR; comportamento varia e não equivale a câmera térmica. | **Não prometer.** Habilitar apenas para hardware externo/suportado e identificado. |
| “Vibração para proximidade” | Vibração é saída háptica, não sensor de distância. Sensores de proximidade têm curto alcance e finalidade limitada. | Usar vibração apenas para comunicar alertas; não para detectar ameaça. |
| “Qualquer sensor útil” | Coleta aberta e sem finalidade viola minimização e amplia ataque/surpresa. | Cada sensor precisa de hipótese, benefício, teste, consentimento e fallback próprios. |
| Tradução em tempo real | Pode ajudar, mas erros em emergência são materialmente perigosos. | Original sempre disponível; tradução identificada; testes de termos, números, negações e topônimos. |

## 6. Dados e permissões Android

Princípio: **nenhuma permissão sensível no primeiro lançamento**, salvo notificações quando o usuário ativa alertas. Pedir no contexto da função, aceitar recusa e oferecer degradação segura. O Android recomenda minimizar permissões, usar alternativas com menor fidelidade e respeitar recusas ([Android: minimizar permissões](https://developer.android.com/privacy-and-security/minimize-permission-requests), [checklist de segurança](https://developer.android.com/privacy-and-security/security-tips)).

| Capacidade | Permissão/dado possível | Política recomendada |
|---|---|---|
| Receber alertas | `POST_NOTIFICATIONS` em Android 13+; token de push | opt-in explicado; canais separados por severidade; nunca usar token para rastreamento/ads |
| Localizar alertas | começar com CEP/município manual; depois `ACCESS_COARSE_LOCATION` em uso | coarse por padrão; processar região no aparelho; não guardar histórico; localização precisa apenas se indispensável |
| Localização contínua | `ACCESS_BACKGROUND_LOCATION` | **fora do MVP**; só após demonstrar benefício central, disclosure destacado, opt-in separado e modo funcional sem ela. Android exige fluxo específico e continuidade mesmo quando recusada ([Android background location](https://developer.android.com/develop/sensors-and-location/location/permissions/background)) |
| Câmera | preferir intent do sistema; `CAMERA` apenas para experiência própria | apenas ação visível do usuário; on-device; não gravar/enviar por padrão; indicador e botão de parar |
| Microfone | `RECORD_AUDIO` | **não usar no MVP**; sem escuta ambiente ou segundo plano |
| Redes Wi‑Fi/dispositivos próximos | permissões variam por versão | **não usar para inferir ameaça**; sem inventário de redes; sem identificadores persistentes |
| Contatos/SMS/telefonia | `READ_CONTACTS`, SMS, call log são altamente restritos | não solicitar; usar seletor de contato, share sheet, `ACTION_DIAL` e APIs com escopo menor |
| Armazenamento | armazenamento interno/app-specific | não solicitar acesso a todos os arquivos; exportação via Storage Access Framework |
| Sensores físicos | leituras locais efêmeras | allowlist por feature; taxa limitada; sem upload bruto por padrão |

Para dados pessoais/sensíveis, o Google Play exige transparência, finalidade esperada, segurança, solicitação de runtime permission e política de privacidade; câmera, microfone e localização estão explicitamente no escopo ([User Data](https://support.google.com/googleplay/android-developer/answer/10144311), [disclosure e consentimento](https://support.google.com/googleplay/android-developer/answer/11150561)). Serviços em segundo plano também têm restrições atuais: câmera, microfone e localização “while-in-use” não podem ser tratados como vigilância silenciosa ([Android foreground-service restrictions](https://developer.android.com/develop/background-work/services/fgs/restrictions-bg-start)).

### Inventário mínimo de dados

- **Preferências locais:** região/idioma/canais; manter no dispositivo quando possível.
- **Token de push:** pseudônimo, rotacionável, separado de analytics e apagado ao desativar alertas.
- **Localização:** idealmente transformar localmente em regiões assinadas; não enviar coordenadas contínuas.
- **Check-in:** conteúdo e destinatários escolhidos pelo usuário; criptografia em trânsito; prazo de expiração curto; exclusão disponível.
- **Telemetria:** apenas métricas agregadas de entrega/erro, sem coordenada, áudio, imagem, SSID/BSSID ou texto pessoal.
- **Logs:** redigir tokens, coordenadas, contatos e payloads; retenção definida e curta; acesso auditado.

Antes de beta externo: inventário de SDKs, diagrama de fluxo de dados, tabela de retenção, política de privacidade dentro do app e URL pública, formulário Data Safety coerente e mecanismo de exclusão. Não usar SDK de anúncios em fluxos de emergência.

## 7. Política de alertas

1. **Proveniência visível:** todo alerta mostra emissor, fonte, hora de emissão, hora de recebimento, área, validade e link/identificador.
2. **Estados distintos:** `ativo`, `atualizado`, `cancelado`, `expirado`, `teste` e `dados indisponíveis`. “Sem alerta conhecido” nunca vira “seguro”.
3. **Severidade da fonte preservada:** não converter silenciosamente escalas oficiais para 5→1. Mostrar mapeamento explicável e reversível.
4. **Confiança separada:** fonte autenticada, ingestão íntegra e frescor são dimensões separadas de severidade.
5. **Conteúdo crítico não generativo:** IA pode auxiliar tradução/explicação, mas não cria instrução de proteção nem altera alerta oficial.
6. **Escalonamento conservador:** inferência de sensor ou relato comunitário aparece como “não verificado”, sem sirene crítica e sem instrução de evacuação.
7. **Correção rápida:** updates e cancelamentos têm prioridade igual ou maior que o alerta inicial; cache expira por TTL.
8. **Fallback:** em falha de rede, mostrar última sincronização e conteúdo offline; indicar que o canal oficial pode operar independentemente.
9. **Acessibilidade:** texto, som, vibração e contraste redundantes; suporte a leitor de tela; não depender só de cor.
10. **Testes claramente rotulados:** ambiente de simulação isolado; nunca enviar teste como evento real.

Como modelo de interoperabilidade, considerar o Common Alerting Protocol (CAP), formato aberto para alertas multirriscos, sem presumir que toda fonte pública ofereça API CAP ([OASIS CAP 1.2](https://docs.oasis-open.org/emergency/cap/v1.2/CAP-v1.2.pdf)).

## 8. Requisitos mínimos de segurança e confiabilidade

### Backend e cadeia de alertas

- TLS moderno; autenticação forte entre serviços; segredos em cofre; rotação e revogação.
- Allowlist de fontes e validação estrita de schema, tamanho, caracteres e timestamps.
- Assinatura/verificação dos registros críticos quando a fonte permitir; hash e trilha auditável de transformações.
- Idempotência, deduplicação, ordenação, TTL, update/cancel e proteção contra replay.
- Painel administrativo sem emissão direta por uma única conta: MFA resistente a phishing, RBAC, aprovação dupla e logs protegidos.
- Limites por emissor/região, circuit breaker e kill switch testado.
- Backups restauráveis e exercícios de recuperação; nenhuma dependência única sem comportamento degradado definido.
- Dependências fixadas, SBOM, análise de vulnerabilidades e atualização rápida de componentes críticos.

### Aplicativo Android

- Componentes não exportados por padrão; intents explícitas; `PendingIntent` imutável quando aplicável.
- Armazenamento interno; chaves no Android Keystore; nenhum segredo de servidor embutido no APK.
- Certificate pinning apenas com estratégia segura de rotação/fallback; caso contrário, confiar na plataforma com configuração de rede estrita.
- Bloqueio de backup para segredos/dados sensíveis; screenshots protegidos apenas em telas que realmente exigirem, avaliando impacto de acessibilidade.
- Build de release sem logs sensíveis; ofuscação não tratada como controle primário.
- Dependências/SDKs mínimos, auditados e sem coleta inesperada; Play Integrity pode ser sinal antifraude, nunca condição que impeça instrução vital.
- Exportar relatório local de diagnóstico sem dados pessoais por padrão.

### Verificação operacional

- SLOs por etapa: tempo fonte→ingestão→push→exibição, taxa de entrega e taxa de duplicação.
- Testes com rede offline/intermitente, bateria baixa, relógio errado, reboot, permissões negadas/revogadas e diversos fabricantes.
- Testes de tradução com números, unidades, endereços, topônimos, negações e instruções contraditórias.
- Chaos tests e tabletop exercises com alerta falso, atraso, duplicação, cancelamento, fonte comprometida e painel roubado.
- Canal de reporte de vulnerabilidade, resposta a incidentes, contatos 24/7 para desativação de fonte e post-mortem sem culpa.
- Beta regional fechado, com especialistas de emergência e acessibilidade, antes de qualquer promessa pública.

## 9. Critérios GO / NO-GO

### NO-GO imediato se qualquer item ocorrer

- Marketing ainda afirma “radar Wi‑Fi”, infravermelho, visão noturna garantida ou detecção genérica de ameaça.
- O nível 5 aparece como “seguro” quando dados estão ausentes, antigos ou falharam.
- IA ou sensor local pode emitir nível crítico sem fonte autenticada/confirmação humana definida.
- Não há provenance, validade, update/cancel, expiração e deduplicação.
- Localização contínua, câmera ou microfone funcionam em segundo plano sem necessidade demonstrada, opt-in e indicador.
- Uma única conta pode enviar alerta crítico em massa.
- Testes de falha mostram instrução obsoleta como atual ou escondem indisponibilidade.
- Política de privacidade/Data Safety não corresponde ao comportamento real de app e SDKs.
- Não existe kill switch, plano de incidente e meio rápido de corrigir/cancelar alerta.

### GO condicionado para MVP Android

- Escopo reduzido a alertas oficiais + preparação/check-in manual.
- Fontes documentadas, autenticadas quando tecnicamente possível e exibidas ao usuário.
- “Desconhecido/dados indisponíveis” é estado de primeira classe; ausência de alerta não é garantia.
- Sem permissão de câmera, microfone, contatos, SMS, call log ou localização em segundo plano no MVP.
- Localidade manual ou localização aproximada em uso, com modo funcional sem localização.
- Conteúdo crítico determinístico; original preservado; tradução claramente identificada.
- Controles administrativos, auditoria, TTL, cancelamento, deduplicação e kill switch implementados e testados.
- Revisão independente com Defesa Civil/especialista de gestão de riscos, segurança mobile, acessibilidade e privacidade antes do beta público.
- Testes fechados demonstram desempenho sob falhas e não encontram cenário conhecido de falsa garantia.

## 10. Plano recomendado em fases

1. **Fase 0 — reposicionar:** renomear a escala, remover promessas sensorais, escrever princípios de não substituição e definir fontes oficiais-alvo.
2. **Fase 1 — protótipo seguro:** conteúdo offline revisado, região manual, ingestão somente leitura, provenance, TTL/update/cancel e notificações opt-in.
3. **Fase 2 — validação fechada:** threat modeling detalhado, pentest, exercícios de falha, revisão de mensagens e acessibilidade, métricas sem PII.
4. **Fase 3 — beta regional:** uma ou poucas localidades/fontes, suporte operacional e canal de incidentes; nenhuma automação sensorial de risco.
5. **Fase 4 — recursos opcionais:** localização aproximada em uso, check-in temporário e tradução assistiva, cada qual com DPIA/LIA ou avaliação equivalente conforme contexto e revisão jurídica local.
6. **Pesquisa separada:** qualquer sensoriamento experimental vive fora do caminho crítico, com consentimento, aparelhos suportados, dataset/teste reproduzível e aviso de que não é detector de emergência.

## 11. Questões que precisam de dono antes da arquitetura

- Quais autoridades/fontes serão suportadas, por território, e sob quais termos de uso?
- Quem responde 24/7 por fonte comprometida, alerta errado ou pedido de correção?
- O app retransmite apenas ou também pretende emitir alertas próprios? A segunda opção muda radicalmente risco e governança.
- Qual população e cenário inicial: enchente, incêndio, defesa civil geral, segurança pessoal? “Qualquer emergência” não é um escopo verificável.
- Como serão revisadas instruções por localidade e acessibilidade?
- Qual é o prazo de retenção de cada dado, quem acessa e como o usuário exclui?
- Quais métricas comprovam benefício sem transformar vigilância em requisito?

---

**Conclusão:** o caminho defensável é construir um **companheiro de alertas oficiais e preparação**, não um detector universal de ameaças. A primeira obrigação do DEFCON WATCHER deve ser dizer com precisão o que sabe, de onde sabe, quão recente é — e, sobretudo, quando **não sabe**.
