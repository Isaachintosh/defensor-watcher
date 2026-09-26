# Parecer consolidado e plano estratégico — DEFCON WATCHER

Data: 2026-09-25  
Estado de evidência: **V1 — evidência parcial**

## Decisão executiva

**GO condicionado** para um MVP Android de apoio à consciência situacional: alertas oficiais relevantes para a região, explicação clara, protocolos offline e check-in manual.

**NO-GO** para apresentar o produto como detector universal de ameaças, radar Wi-Fi, visão noturna/infravermelha garantida, vigilância contínua ou substituto de autoridades e serviços de emergência.

O repositório contém somente o `README.md`; portanto, ainda não existe produto funcional, arquitetura implementada, protótipo, fonte integrada ou teste. A nota representa diagnóstico e planejamento, não validação.

## Resultado do produto

Promessa recomendada:

> Receba alertas confiáveis relevantes para sua área, entenda o que fazer, acesse orientações offline e confirme sua situação a contatos escolhidos.

Princípios invioláveis:

1. Ausência de alerta não significa segurança.
2. Todo alerta mostra fonte, área, emissão, recebimento, validade e última sincronização.
3. O original oficial é preservado; explicação e tradução são camadas identificadas.
4. IA e sensores não elevam sozinhos um evento a crítico.
5. Ação externa — ligação, mensagem ou localização — exige controle explícito do usuário.
6. Permissão negada mantém uma experiência básica funcional.

## Corte do MVP Android

### Dentro

- Localidade manual e localização aproximada somente em uso, opcional.
- Um território piloto, uma ou duas categorias de incidente e uma fonte oficial documentada.
- Ingestão somente leitura com update, cancelamento, expiração, deduplicação e trilha de origem.
- Escala própria de **nível de prontidão 5→1**, explicável e reversível.
- Notificações opt-in proporcionais à severidade.
- Protocolos essenciais offline, versionados e revisados por especialista humano.
- Check-in manual com prévia de destinatário, texto e localização.
- Acessibilidade: leitor de tela, alto contraste e sinais redundantes.
- Histórico local apagável; telemetria operacional mínima, sem localização precisa.

### Fora

- Radar por Wi-Fi/RSSI, detecção de pessoas ou intenção.
- Infravermelho/térmico e “visão noturna” universal.
- Câmera, microfone ou localização contínua em segundo plano.
- Detecção genérica de perigo por sensores.
- Leitura universal de Cell Broadcast por app comum.
- Rotas declaradas seguras sem dados oficiais.
- Chamada/SMS automático e emissão própria de alertas críticos.
- Tradução automática como única representação de instrução vital.

## Arquitetura alvo

```text
Fonte oficial -> adaptador -> normalização imutável -> regras determinísticas
              -> armazenamento/auditoria -> push
              -> app Android offline-first -> confirmação/check-in do usuário
```

Stack recomendada para o primeiro corte:

- Kotlin + Jetpack Compose.
- Arquitetura modular com domínio puro, adapters por fonte e repositórios.
- Room para alertas/protocolos; DataStore para preferências.
- WorkManager para sincronização adiável; push para eventos — nunca daemon permanente.
- Android Keystore para chaves locais; componentes não exportados por padrão.
- Backend pequeno, isolando ingestão, regras, auditoria e entrega.
- Conteúdo crítico determinístico e versionado; IA fora do caminho crítico.

## Escala operacional

| Nível | Nome | Condição mínima | Resposta |
|---|---|---|---|
| 5 | Rotina | Nenhum alerta oficial aplicável conhecido; dados atuais | Mostrar estado e última sincronização, sem declarar “seguro” |
| 4 | Atenção | Aviso preventivo oficial ou evento de baixa severidade aplicável | Acompanhar e preparar |
| 3 | Preparação | Alerta oficial aplicável com impacto plausível | Checklist offline e plano pessoal |
| 2 | Ação | Alerta urgente oficial aplicável | Instrução curta, origem e check-in |
| 1 | Crítico | Alerta máximo oficial aplicável ou SOS manual | Interface mínima e atalhos confirmados pelo usuário |

Estado adicional obrigatório: **desconhecido/dados indisponíveis**. Perda de conexão nunca rebaixa automaticamente o nível.

## Plano de execução em seis gates

### Gate 0 — decisão de produto

Definir e registrar:

- território piloto;
- duas categorias de incidente no máximo;
- público e cenário primário;
- fontes oficiais e termos de uso;
- quem revisa protocolos e responde a incidentes;
- promessa pública e nome da escala.

Saída: `notes/05-product-brief.md` aprovado.

### Gate 1 — especificação e riscos

- Matriz incidente × severidade oficial × região × nível × ação.
- Modelo de dados e estados: ativo, atualizado, cancelado, expirado, teste, indisponível.
- Threat model detalhado e inventário de dados/permissões.
- Política de retenção, exclusão, privacidade e Data Safety.
- Critérios de aceitação e SLOs pré-registrados.

Saída: contrato funcional testável; nenhum código de sensor experimental.

### Gate 2 — protótipo de compreensão

Protótipo navegável, ainda sem backend real, para testar:

- compreensão de fonte, nível e próxima ação;
- estado offline/desatualizado;
- check-in com confirmação;
- leitor de tela e uso sem depender de cor/som.

Gate: usuários identificam corretamente fato, fonte, incerteza e ação sem ajuda.

### Gate 3 — spikes técnicos

1. Fonte oficial e tratamento de update/cancel/TTL.
2. Push versus polling sob Doze e economia de bateria.
3. Persistência após reboot e atualização.
4. Notificação em Android/fabricantes-alvo com permissão negada/revogação.
5. Geofiltro por município/região manual e localização aproximada em uso.
6. Pacote offline e atualização assinada.
7. Check-in via share sheet/discador, sem permissões restritas.
8. Testes de relógio errado, duplicação, replay e rede intermitente.

Gate: evidência reproduzível; falhas permanecem visíveis ao usuário.

### Gate 4 — implementação alfa

Construir somente o fluxo ponta a ponta da fonte escolhida. Incluir kill switch, auditoria, RBAC/MFA do painel, validação de schema, proteção contra replay e cancelamento prioritário.

Gate: suíte automatizada mais exercícios de falha; nenhuma conta única envia alerta em massa sem controle adicional.

### Gate 5 — piloto fechado

- Exercícios sempre identificados como teste.
- Revisão por especialista de emergência, acessibilidade, segurança mobile e privacidade.
- Medir latência, duplicação, aplicação geográfica, compreensão, check-in e bateria.
- Pentest e tabletop de fonte comprometida, alerta falso, atraso e cancelamento.

Gate: zero falsa garantia conhecida e plano operacional de correção testado.

### Gate 6 — beta regional

Liberar para grupo pequeno, com suporte, canal de incidentes e observabilidade sem PII. Ampliar território ou categorias apenas depois de métricas e revisão do gate anterior.

## Métricas e evals

- Latência fonte→ingestão→push→exibição, por percentis.
- Entrega, duplicação, expiração e cancelamento corretos.
- Falsos positivos geográficos e incidentes desatualizados exibidos.
- Percentual de usuários que identifica fonte, nível, validade e ação.
- Sucesso/falha/tempo do check-in.
- Consumo de bateria em aparelhos de entrada e fabricantes-alvo.
- Permissões desnecessárias, vazamentos ou divergência Data Safety: tolerância zero.
- Fadiga: alertas ignorados e canais desativados.

## Decisões que bloqueiam o início do código

1. Qual país, estado e município serão o piloto?
2. Quais dois tipos de emergência entram primeiro?
3. Qual fonte oficial possui acesso técnico e termos compatíveis?
4. O app apenas retransmite alertas ou pretende emitir conteúdo próprio?
5. Quem aprova as instruções e responde por correção/cancelamento?
6. Qual Android mínimo e quais aparelhos/fabricantes compõem a matriz de teste?
7. Qual dado pode sair do aparelho, por quanto tempo e com qual base/consentimento?

## Próximo passo único

Antes de iniciar o app, fechar o Gate 0 em uma sessão curta e produzir a primeira matriz de **incidente × fonte × nível × ação** para uma localidade real. Sem isso, arquitetura e UX parecerão completas, mas o núcleo do produto continuará arbitrário.

## Fontes principais

- [Android — Wi-Fi scanning overview](https://developer.android.com/develop/connectivity/wifi/wifi-scan)
- [Android — background location](https://developer.android.com/develop/sensors-and-location/location/background)
- [Android — foreground service restrictions](https://developer.android.com/develop/background-work/services/fgs/restrictions-bg-start)
- [Android — minimizar permissões](https://developer.android.com/privacy-and-security/minimize-permission-requests)
- [Google Play — User Data](https://support.google.com/googleplay/android-developer/answer/10144311)
- [Google Play — disclosure e consentimento](https://support.google.com/googleplay/android-developer/answer/11150561)
- [Anatel — Defesa Civil Alerta](https://www.gov.br/anatel/pt-br/dados/utilidade-publica/alertas-de-desastres/defesa-civil-alerta)
- [OASIS — Common Alerting Protocol 1.2](https://docs.oasis-open.org/emergency/cap/v1.2/CAP-v1.2.pdf)

## Notas especializadas

- `notes/01-produto-seguranca.md`
- `notes/02-android-arquitetura.md`
- `notes/03-riscos-privacidade-confiabilidade.md`
