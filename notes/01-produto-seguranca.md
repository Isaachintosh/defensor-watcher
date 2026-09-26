# Avaliação funcional e de segurança pessoal — Android-first

Data: 2026-09-25  
Base analisada: `README.md` do DEFCON WATCHER V0.1

## Resumo executivo

O conceito tem valor como **assistente pessoal de preparação, alerta e orientação**, mas o README mistura uma proposta viável com capacidades que um celular comum não garante. O MVP Android deve apoiar decisões humanas com alertas oficiais, check-ins, contexto local e instruções previamente validadas. Não deve se apresentar como radar, detector universal de ameaças, visão noturna ou sensor infravermelho, nem substituir autoridades, serviços de emergência ou julgamento humano.

Diretriz central: sob incerteza, perda de sinal ou conflito de fontes, declarar a limitação, preservar o último dado com horário e oferecer ações seguras controladas pelo usuário. Nunca elevar inferência do aparelho a ameaça confirmada.

## Evidências e limites

### Declarado no README

- Agente pessoal de segurança com cinco níveis: 5 (seguro) a 1 (emergência crítica).
- Sincronização com canais de emergência; orientação proativa, abrigo, vigilância e check-ins.
- Uso de sensores, Wi-Fi como “radar”, câmera como visão noturna/infravermelho, vibração por proximidade e tradução em tempo real.
- Ambição de cobrir qualquer tipo de emergência.

### Observado

- O repositório contém apenas um README curto; não há requisitos, arquitetura, protótipo, código, testes, modelo de ameaças, política de privacidade ou fontes de alerta definidas.
- Não há regra operacional de mudança de nível, autoridade da classificação, público, região, modo offline ou resposta a falso alerta.

### Inferido — requer validação humana

- O valor inicial provável é agregar alertas confiáveis, convertê-los em ações claras e acompanhar o estado do usuário.
- Android-first permite validar notificações, região/localização opcional, conteúdo offline e check-ins antes do iPhone.
- A escala própria só é útil com semântica explícita e sem parecer o sistema militar oficial DEFCON.

### Lacunas críticas

- País/cidade e órgãos oficiais do piloto.
- Incidentes incluídos e fontes: autenticidade, latência e cobertura.
- Responsável editorial pelos protocolos e ciclo de revisão.
- Público, acessibilidade, idiomas e pessoas vulneráveis.
- Política de localização, contatos, sensores, retenção e exclusão.
- Responsabilidade jurídica, termos e limites perante serviços de emergência.

## Posicionamento recomendado

**Promessa do MVP:** “Receba alertas confiáveis relevantes para sua área, entenda o que fazer e confirme sua situação a contatos escolhidos.”

O produto é apoio à consciência situacional, não detecção ou comando autônomo. Validar nome e marca; na interface, preferir “Nível de prontidão” e sempre mostrar o significado por extenso.

## Escopo MVP Android

### Incluído

1. Onboarding com região, idiomas, riscos, acessibilidade e consentimentos separados.
2. Uma ou poucas fontes oficiais documentadas; alerta mostra origem, horário, área, validade e referência.
3. Relevância geográfica por região manual e, com consentimento, localização do aparelho.
4. Nível derivado de regras transparentes e determinísticas; mudança sensível por regra/operador autorizado, nunca por IA livre.
5. Notificação com resumo, grau de confiança, instrução validada e detalhes.
6. Cartões por incidente: fato, ação imediata, o que evitar, quando buscar ajuda e números oficiais locais.
7. Check-in manual “Estou bem / Preciso de ajuda” para contatos escolhidos, com prévia e confirmação.
8. Modo offline: protocolos essenciais e último alerta, com horário e aviso de desatualização.
9. Histórico local de alertas/mudanças, apagável e exportável.
10. Alto contraste, leitor de tela, linguagem simples e sinais sonoro, visual e tátil.

### Fora do MVP

- Wi-Fi como radar de pessoas/ameaças ou medidor de proximidade física.
- “Visão noturna” ou infravermelho sem hardware dedicado e validação.
- Detecção universal de perigo por câmera/sensores; escuta contínua; reconhecimento facial; vigilância de terceiros.
- Acionamento automático de autoridades/contatos sem confirmação humana e integração formal testada.
- Rotas “seguras” em tempo real sem dados oficiais.
- Diagnóstico médico, aconselhamento policial ou garantia de proteção.
- Tradução como única fonte de instrução crítica; futura tradução deve manter original e indicar automação.

## DEFCON 5 → 1: modelo operacional

Os níveis representam prontidão naquele contexto, não certeza absoluta. O app não dirá “está seguro”, mas “nenhum alerta ativo recebido para esta área até [hora]”.

| Nível | Significado | Gatilho mínimo | Comportamento | Gate humano |
|---|---|---|---|---|
| 5 — Rotina | Sem alerta relevante recebido | Fontes operacionais, sem evento aplicável | Estado discreto, última sincronização e plano pessoal | Usuário mantém região/preferências |
| 4 — Atenção | Situação possível ou preventiva | Aviso oficial baixo ou evento ainda não confirmado para a área | Notificação proporcional; preparar e acompanhar | Usuário reconhece; operador valida exceções |
| 3 — Preparação | Impacto plausível | Alerta oficial aplicável ou fonte confiável + regra geográfica | Checklist, bateria, contatos e abrigo | Usuário confirma plano; conteúdo aprovado |
| 2 — Ação | Risco alto/imediato | Ordem/alerta oficial urgente aplicável | Tela prioritária, ação curta, ajuda e check-in | Ação externa requer confirmação |
| 1 — Crítico | Perigo extremo ou SOS manual | Ordem oficial máxima aplicável ou pedido explícito | Interface mínima, instrução urgente e atalhos | Usuário escolhe chamada/envio; automação só em fase futura autorizada |

Regras obrigatórias:

- Mudança mostra motivo, fonte, área, horário e validade.
- Expiração reduz nível apenas por regra; falta de internet nunca reduz automaticamente.
- Sensor local isolado nunca eleva a 2 ou 1.
- SOS manual é pedido do usuário, não confirmação externa.
- Histerese e deduplicação evitam alternância e fadiga.

## Jornadas prioritárias

### Configuração segura

Usuário escolhe região/riscos; entende cada permissão; mantém localização contínua desligada por padrão; cadastra contatos e testa mensagem com confirmação; baixa protocolos. Resultado: valor sem permissões excessivas.

### Recebimento de alerta

Fonte autenticada publica; regras verificam área/severidade/validade; notificação mostra nível, fato e primeira ação; detalhe separa informação oficial de recomendação; usuário reconhece, abre protocolo ou informa não estar na área.

### Check-in

Usuário escolhe estado; vê destinatários, texto e localização; confirma/edita; recebe sucesso, falha ou pendência, com nova tentativa/canal alternativo. Nada é enviado silenciosamente.

### Perda de conexão

App sinaliza ausência de sincronização, mantém último alerta com horário e aviso, mostra protocolos offline e reprocessa ao reconectar. Nunca converte falta de dados em tranquilidade.

### Alerta incorreto

Usuário vê fonte/área, informa não aplicabilidade ou problema sem apagar registro original; orientação permanece conservadora até validação.

## Falhas perigosas e controles

| Falha | Dano | Controle mínimo |
|---|---|---|
| Falso negativo/atraso | Usuário não age | Não prometer segurança; última sincronização/cobertura; monitorar latência |
| Falso positivo | Pânico, deslocamento arriscado, fadiga | Fonte autenticada, geofiltro, deduplicação, correção rastreável |
| Nível opaco | Confiança indevida | Fonte/motivo visíveis, regras versionadas e auditoria |
| Rebaixar por falta de dados | Falsa segurança | Estado “desatualizado/indisponível”; silêncio não é segurança |
| Instrução inadequada | Aumenta exposição | Protocolos locais revisados; impedir geração livre crítica |
| Localização imprecisa | Alerta/rota errados | Mostrar área, permitir correção; não prometer rota segura |
| SOS/localização involuntários | Exposição e risco | Prévia, confirmação, permissões mínimas, destinatários explícitos |
| Conta/contato comprometido | Stalking e exposição | Minimização, criptografia, autenticação forte e revisão de sessões |
| Sensor tratado como prova | Pânico/conduta perigosa | Retirar radar/IR; sensor não confirma ameaça nem escala sozinho |
| Tradução errada | Ação crítica errada | Original disponível, aviso, glossário e textos essenciais localizados |
| Notificação não percebida | Ação perdida | Canais Android, sinais multimodais, teste e orientação sobre bateria |
| Serviço indisponível | Perda do apoio | Offline, cache com validade, monitoramento e recuperação |
| Agressor acessa aparelho | Revela contatos/localização | Proteção local, notificações discretas e desenho com especialista |

## Privacidade, segurança e governança

- Região manual funciona sem GPS contínuo; coletar apenas o necessário.
- Consentimentos separados para localização, notificações, contatos, câmera, microfone e compartilhamento.
- Preferir números inseridos pelo usuário a ler a agenda inteira.
- Criptografia em trânsito/repouso; segredos fora do app; logs sem localização precisa/conteúdo sensível.
- Retenção curta e explícita; exclusão acessível.
- Modelar ameaças: stalking, abuso doméstico, tomada de conta, fonte falsificada, replay, backend comprometido e abuso de notificações.
- Autenticar alertas e impedir replay; tratar relógio/expiração.
- Conteúdo crítico aprovado/versionado por humano; registrar mudanças.
- Kill switch para fonte/regra defeituosa, com comunicação aos usuários.
- IA pode resumir/traduzir, mas não decidir nível nem criar sozinha instrução crítica; fallback determinístico.

## Critérios de aceitação

### Alertas e níveis

- Alerta oficial válido para a região mostra nível, fonte, área, emissão, expiração e primeira ação, mesmo após reinício.
- Alerta fora da região não gera notificação crítica e a decisão fica auditável.
- Fonte indisponível/sincronização vencida gera aviso; o app não afirma nível 5 como prova de segurança.
- Duplicatas não causam tempestade; sensor isolado não promove a 1/2.

### Check-in e ajuda

- Antes do envio, mostrar destinatário, texto e inclusão de localização; exigir confirmação.
- Diferenciar sucesso, falha e pendência, oferecendo nova tentativa ou instrução manual.
- Atalho de emergência distingue abrir discador de contato efetivamente concluído.

### Offline e confiabilidade

- Protocolos essenciais funcionam em modo avião com versão/data.
- Último alerta permanece com horário e aviso de desatualização.
- Reinício, atualização e economia de bateria não apagam silenciosamente estado crítico.
- Telemetria mede disponibilidade/latência sem localização precisa desnecessária.

### Privacidade e segurança

- Negar localização, contatos, câmera ou microfone mantém o uso básico por região manual.
- Permissões são contextuais, claras e revogáveis.
- Dados sensíveis não aparecem em logs, backups indevidos ou tela bloqueada sem escolha.
- Usuário apaga histórico/conta e recebe explicação sobre retenção legal.
- Testes cobrem adulteração, replay e expiração; fonte não autenticada nunca aparece como oficial.

### Usabilidade e acessibilidade

- Em teste moderado, usuário identifica nível, fonte e próxima ação sem ajuda.
- Ação crítica funciona com leitor de tela e não depende só de cor, som ou vibração.
- Textos distinguem fato, recomendação e incerteza.

## Gate humano antes da implementação

Registrar decisão sobre:

1. Localidade e categorias do piloto.
2. Fontes oficiais e contratos técnicos.
3. Matriz severidade → nível → ação, aprovada por responsável de segurança/conteúdo.
4. Política de localização, retenção e compartilhamento.
5. Promessa pública e limites.
6. Condições de nível 1 e comportamento dos atalhos.
7. Testes de campo controlados, sem simular emergência real para terceiros.

## Sequência estratégica

1. **Descoberta:** uma localidade e dois incidentes; usuários/profissionais; fontes e limites.
2. **Especificação:** taxonomia, matriz de níveis, protocolos, ameaças e política de dados.
3. **Protótipo:** validar compreensão de alerta, offline e check-in sem backend real.
4. **Piloto técnico:** uma fonte oficial; testar atraso, duplicidade, expiração, indisponibilidade e localização imprecisa.
5. **Piloto humano:** grupo pequeno consentido; exercícios sempre marcados como teste.
6. **Go/no-go:** ampliar só após metas de confiabilidade, compreensão, acessibilidade e privacidade.

## Métricas iniciais

- Latência fonte → notificação e proporção dentro do objetivo.
- Alertas duplicados, incorretamente aplicados e expirados ainda visíveis.
- Usuários que identificam corretamente fonte, nível e próxima ação.
- Sucesso, falha e tempo do check-in.
- Disponibilidade das fontes e idade dos dados.
- Incidentes de privacidade/permissões indevidas — tolerância zero para lançamento.
- Fadiga: notificações ignoradas/desativadas.

## Conclusão

O MVP deve provar **confiabilidade da fonte, clareza da orientação e controle do usuário sobre dados e ações**. Sensores experimentais não são fundação segura e ficam fora do caminho crítico. O próximo artefato decisivo é uma matriz validada de incidentes, fontes, níveis e ações para uma localidade específica.
