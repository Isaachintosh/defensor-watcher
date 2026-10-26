# Panorama internacional de apps e tese de produto — 2026-09-25

**Estado de evidência:** V1 — evidência externa forte para o mercado e arquitetura; nenhuma validação de usuário ou operação do DEFENSOR WATCHER ainda.

## Pergunta

Existe espaço real para um aplicativo móvel que funcione como uma camada pessoal de consciência situacional, aviso antecipado, orientação protetiva e coordenação do usuário, ou esse produto já está resolvido por apps nacionais e privados?

## Resposta curta

Existe mercado comprovado e existe espaço, mas **não** para “mais um app de alertas”.

O espaço defensável está na combinação ainda fragmentada de:

1. agregação internacional de fontes oficiais/científicas;
2. proveniência e atualização/cancelamento preservados;
3. aplicabilidade pessoal por local/região sem declarar segurança por silêncio;
4. orientação curta e offline;
5. estado explícito de dados vencidos/desconhecidos;
6. check-in/coordenação com contatos escolhidos;
7. experiência consistente para viajante e múltiplos países;
8. sensores experimentais separados do caminho crítico.

O aplicativo deve ser uma **camada pessoal sobre sistemas oficiais**, não um substituto de Cell Broadcast, sirenes, 112/190/192/193/199, autoridades ou sistemas nacionais.

---

## Comparáveis atuais

### Rússia — «МЧС России»

O aplicativo oficial do Ministério de Situações de Emergência já demonstra boa parte do núcleo de produto:

- push de informação importante e emergencial;
- mensagens para múltiplas regiões;
- associação regional por geolocalização;
- recomendações e памятки com sequência de ações;
- primeira ajuda;
- coordenadas atuais;
- atalho para 112;
- SMS com coordenadas;
- em algumas regiões, alertas de ameaça de drones e mísseis.

Em junho de 2026, o próprio МЧС explicou que push pode ficar indisponível sob restrições temporárias de internet móvel. O app foi colocado em lista de serviços acessíveis, mas isso não garante push; por isso o órgão integrou a distribuição com canais regionais РСЧС no mensageiro MAX.

**Lacuna observada:** não foi encontrada evidência oficial de cálculo contínuo de risco individual, roteamento pessoal adaptativo, coordenação familiar completa ou sensing do aparelho como camada integrada de ameaça.

Fontes:
- https://78.mchs.gov.ru/deyatelnost/press-centr/novosti/5784346
- https://34.mchs.gov.ru/deyatelnost/press-centr/vse_novosti/5774060
- https://mchs.gov.ru/deyatelnost/press-centr/novosti/5777310
- https://02.mchs.gov.ru/deyatelnost/press-centr/novosti/5785783

### Israel — Home Front Command

O app oficial fornece:

- alertas e instruções em tempo real;
- filtragem pela localização atual e áreas de interesse;
- atualizações de emergência;
- contato com Home Front Command;
- hebraico, árabe, russo e inglês;
- histórico/linha temporal de eventos em versões recentes.

É uma referência forte de integração entre **alerta + ação**, porém opera dentro de um ecossistema nacional com autoridade e infraestrutura próprias.

Fontes:
- https://play.google.com/store/apps/details?id=com.alert.meserhadash
- https://apps.apple.com/us/app/israel-home-front-command/id1542010719

### Coreia do Sul — Emergency Ready

O Ministry of the Interior and Safety documenta em 2026:

- alertas em 22 idiomas;
- tufões, terremotos, neve e outros riscos;
- guias de resposta a desastres naturais e sociais;
- 2.689 instalações entre abrigos/evacuação e atendimento médico;
- uso de localização e notificações.

**Diferencial relevante:** solução nacional fortemente pensada também para estrangeiros.

Fonte:
- https://www.mois.go.kr/eng/bbs/type002/commonSelectBoardArticle.do?bbsId=BBSMSTR_000000000022&nttId=126882

### Alemanha — NINA

A Warn-App NINA integra o sistema federal MoWaS e permite:

- avisos de proteção civil;
- alertas meteorológicos e de inundação;
- locais assinados;
- alertas para a localização atual;
- instruções de proteção;
- processamento de localização no dispositivo segundo o BBK.

É uma boa referência de **privacy by design**: o BBK declara que a localização usada para o recurso de posição atual é processada no aparelho e não enviada ao órgão.

Fontes:
- https://www.bbk.bund.de/DE/Warnung-Vorsorge/Warn-App-NINA/warn-app-nina_node.html
- https://www.bbk.bund.de/DE/Warnung-Vorsorge/Warn-App-NINA/Funktion-Inhalt/funktion-inhalt_node.html

### Japão — NERV Disaster Prevention

É um dos comparáveis mais próximos da experiência “antecipar e tornar acionável”:

- terremotos, tsunamis, vulcões;
- deslizamentos, inundações e meteorologia severa;
- J-Alert;
- informação adaptada à localização;
- estimativa de intensidade sísmica local;
- countdown em tempo real para chegada de tremor;
- mapas/radar/rios e atualização contínua.

Ele mostra que “tempo até impacto” pode ser um recurso excelente **quando o fenômeno e a infraestrutura científica realmente permitem estimá-lo**. Não deve virar metáfora universal para qualquer ameaça.

Fonte:
- https://nerv.app/download.html

### Estados Unidos — FEMA e American Red Cross Emergency

FEMA:
- NWS + IPAWS;
- até cinco localidades;
- preparação;
- orientação durante emergências;
- abrigos;
- recuperação;
- acessibilidade.

Red Cross Emergency:
- alertas oficiais NWS;
- mapas meteorológicos;
- abrigos e serviços;
- guias e checklists;
- múltiplas localidades;
- acessibilidade.

Fontes:
- https://www.fema.gov/about/news-multimedia/mobile-products
- https://www.redcross.org/get-help/how-to-prepare-for-emergencies/mobile-apps.html

### Pacific Disaster Center — Disaster Alert / DisasterAWARE

É o concorrente mais relevante para a tese global:

- cobertura mundial;
- múltiplos tipos de risco;
- informação quase em tempo real;
- Smart Alerts;
- alertas relacionados à posição atual;
- estimativas/modelos de impacto.

Isso reduz a novidade de “um app global de hazards”. O DEFENSOR precisa competir em **ação pessoal, proveniência, continuidade offline e coordenação**, não apenas em mapa global.

Fontes:
- https://www.pdc.org/disasteraware/
- https://www.pdc.org/help/smartalert/
- https://play.google.com/store/apps/details?id=disasterAlert.PDC

### Watch Duty

Produto privado/não governamental importante porque demonstra outra arquitetura:

- incêndios e enchentes;
- mapas em tempo real;
- fontes oficiais + câmeras + rádio + satélite;
- repórteres humanos verificam a informação;
- evacuação e abrigos;
- ground truth comunitário.

Lição: crowdsourcing pode melhorar consciência situacional, mas precisa ser uma **classe de evidência distinta**, não misturada silenciosamente com fonte oficial.

Fontes:
- https://www.watchduty.org/
- https://www.watchduty.org/how-it-works/overview

### MyShake e LastQuake

MyShake mostra que o telefone pode participar de uma rede de sensing quando a tarefa física é bem delimitada:

- acelerômetro do smartphone;
- classificação de movimento compatível com terremoto;
- rede de citizen science;
- ShakeAlert para early warning em CA/OR/WA.

LastQuake combina terremotos, localização e um mecanismo de Safety Check que pode enviar SMS a familiares.

Fontes:
- https://myshake.berkeley.edu/
- https://myshake.berkeley.edu/FAQ_en.html
- https://www.emsc-csem.org/lastquake/information_channels/lastquake_app/

### Ucrânia — Air Alert

É uma referência de produto extremamente simples e focado:

- operador regional envia o estado do alerta;
- app retransmite início e encerramento para áreas escolhidas;
- pode tocar de forma destacada com configuração adequada;
- sem login e, segundo a página governamental, sem coleta de geolocalização para o fluxo principal.

Fontes:
- https://loda.gov.ua/en/useful-info/129927
- https://play.google.com/store/apps/details?id=com.ukrainealarm

---

## O que já está resolvido no mercado

Não são diferenciais por si só:

- push de emergência;
- localização atual;
- monitorar múltiplas áreas;
- guias de preparação;
- abrigos;
- mapas;
- alertas por severidade;
- check-in básico;
- tradução/múltiplos idiomas;
- avisos de terremoto com countdown;
- mapas globais de hazards;
- integração com fontes oficiais;
- sensor do telefone em um domínio físico específico.

## Lacuna que permanece plausível

A hipótese de produto mais forte é:

> **Uma camada móvel internacional, offline-first e source-aware que transforma sinais oficiais/científicos de diferentes países em uma situação pessoal compreensível, preserva exatamente a origem e o estado do alerta, orienta a próxima ação e ajuda o usuário a coordenar sua segurança — sem fingir ser a autoridade emissora.**

Componentes que, na pesquisa atual, continuam fragmentados:

- fonte oficial original + tradução/explicação claramente separadas;
- Alert/Update/Cancel tratados como um mesmo evento vivo;
- “dados desconhecidos/vencidos” como estado de primeira classe;
- experiência cross-border consistente;
- orientação offline versionada;
- múltiplos entes queridos/locais sem criar vigilância;
- check-in e plano pessoal;
- source trust explícito;
- sensor/hardware experimental separado de alerta oficial;
- explicação de “por que isso é relevante para mim”.

Essa é uma tese. Ainda precisa ser validada com usuários e integrações reais.

---

## Direção de posicionamento

Evitar:

> “Radar universal de ameaças no seu celular.”

Preferir:

> **“Seu companheiro pessoal de consciência situacional e prontidão: recebe sinais confiáveis, explica o que mudou, mantém orientação disponível offline e ajuda você a agir.”**

O termo “early warning” deve ser usado somente quando a fonte fornece realmente antecipação. Para evento já ocorrido ou alerta emitido sem horizonte preditivo, usar “alerta”, “aviso” ou “situação”.

---

## Decisão desta rodada

**GO para aprofundar o app-first.**

**GO experimental separado** para sensing.

**NO-GO** para qualquer promessa de universal threat detection, leitura de Cell Broadcast por app comum, “ambiente seguro” por ausência de alertas, rota segura inventada ou decisão crítica produzida por LLM.

Próxima prova necessária: integrar uma fonte estruturada real e executar Alert → Update → Cancel → offline → retorno da rede sem perder proveniência.
