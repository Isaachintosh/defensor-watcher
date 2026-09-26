# Reavaliação consolidada e plano inicial de desenvolvimento

Data: 2026-09-25  
Estado: **V1 — evidência técnica parcial; mockup navegável criado**

## Correção do parecer anterior

A nota 04 trouxe uma correção importante: **Wi‑Fi sensing é uma capacidade física real**. O padrão [IEEE 802.11bf-2025](https://standards.ieee.org/ieee/802.11bf/11574/) está ativo, aprovado em 28/05/2025 e publicado em 26/09/2025. O NIST documenta sensing WLAN biestático e multiestático, presença, movimento e outras aplicações.

O ponto que permanece não demonstrado é diferente: um aplicativo Android comum, instalável pela Play Store, não recebe automaticamente CSI/BFI bruto em todo smartphone e roteador. As APIs públicas Android documentadas expõem scan/RSSI e Wi‑Fi RTT, mas não foi encontrada API pública genérica para CSI/BFI/802.11bf.

Portanto, a decisão revisada é:

- **GO:** Wi‑Fi sensing no roadmap e na experiência do mockup.
- **GO experimental:** P0 com hardware companion compatível, inicialmente ESP32 CSI, e Android como interface, calibração e motor de visualização.
- **NO-GO temporário:** radar app-only universal, identificação, silhueta, biometria ou ameaça inferida por um telefone comum.
- **Regra de segurança:** sensing experimental nunca eleva sozinho os níveis críticos nem prova ausência de risco.

## Arquitetura de produto em duas superfícies

### Prontidão

Alertas oficiais, protocolos offline, explicação dos níveis e check-in manual. Esta é a superfície confiável e independente do sensor.

### Laboratório Wi‑Fi

Sessão explícita e visível para hardware homologado ou simulação. Estados possíveis:

- compatível;
- parcialmente compatível;
- indisponível;
- calibrando;
- mudança provável;
- inconclusivo;
- sensor degradado.

“Confiança” significa qualidade da medição/modelo, não probabilidade de ameaça.

## P0 técnico recomendado

```text
ESP32 transmissor -> canal Wi‑Fi controlado -> ESP32 receptor/CSI
                   -> features locais -> BLE ou LAN
                   -> Android -> calibração, estado, explicação e histórico local
```

Hipótese inicial: distinguir **ambiente vazio** de **movimento humano provável** em um único cômodo calibrado. Não tentar identidade, intenção, arma, posição 3D, sinais vitais ou funcionamento universal.

Dataset mínimo:

- pelo menos dois cômodos;
- três dias distintos;
- vazio, pessoa parada e andando;
- ventilador/cortina e alteração de móveis;
- pet ou objeto móvel quando disponível;
- treino e teste separados por dia/sessão.

Critérios preliminares do spike:

- disponibilidade ≥ 95% durante sessões;
- latência p95 ≤ 2 segundos;
- recall de movimento ≥ 90% no cenário calibrado;
- falso alarme ≤ 1 por hora vazia;
- degradação cross-day e após mudança do ambiente registrada;
- falha de hardware sempre vira estado “indisponível/inconclusivo”.

Esses critérios autorizam apenas continuar pesquisa, não um claim de segurança pública.

## Mockup entregue

Foi criado `prototype/index.html`, responsivo, interativo e sem dependências. Ele cobre:

- alerta inequivocamente fictício;
- explicação do nível;
- orientação offline;
- check-in com prévia e consentimento;
- configurações;
- laboratório Wi‑Fi separado e rotulado como experimento.

O HTML foi validado sintaticamente. Não foi possível executar QA visual automatizado porque nenhum navegador controlável/headless estava disponível no ambiente; a validação visual humana permanece pendente.

## Próximas etapas de desenvolvimento

1. Testar o mockup com 5–8 pessoas: 100% deve distinguir alerta oficial, exercício e sensing experimental.
2. Escolher território, fonte oficial e até duas categorias de emergência.
3. Congelar linguagem e taxonomia após o teste de compreensão.
4. Criar projeto Kotlin/Compose com fixtures locais e navegação equivalente ao mockup.
5. Implementar `CapabilityDiagnostic` falso cobrindo classes A–D e indisponível.
6. Montar bancada ESP32 CSI e executar protocolo P0 pré-registrado.
7. Conectar eventos reais ao app somente depois de reproduzir as métricas.
8. Manter alertas oficiais e laboratório Wi‑Fi em módulos e feature flags separados.

## Gate de avanço

O próximo gate só fecha quando houver duas provas independentes:

1. **Prova humana:** usuários entendem origem, frescor, incerteza e limites do sensing.
2. **Prova técnica:** a bancada reproduz movimento versus vazio com métricas e falhas visíveis.

Sem as duas, o laboratório continua como demonstração; o núcleo de prontidão pode avançar separadamente.

## Artefatos desta rodada

- `notes/04-atualização-wifi-sensor.md` — evidência trazida pelo proprietário.
- `notes/05-reavaliacao-wifi-sensing.md` — auditoria técnica das alegações.
- `notes/06-mockup-android.md` — contrato e gates do mockup.
- `notes/07-produto-ux-reavaliado.md` — UX, jornadas e critérios humanos.
- `prototype/index.html` — mockup navegável.
- `prototype/README.md` — instruções de uso.

## Fontes primárias decisivas

- [IEEE 802.11bf-2025](https://standards.ieee.org/ieee/802.11bf/11574/)
- [NIST — IEEE 802.11bf](https://www.nist.gov/publications/ieee-80211bf-enabling-widespread-adoption-wi-fi-sensing)
- [Android — Wi‑Fi scan](https://developer.android.com/develop/connectivity/wifi/wifi-scan)
- [Android — Wi‑Fi RTT](https://developer.android.com/develop/connectivity/wifi/wifi-rtt)
- [ESP-CSI](https://github.com/espressif/esp-csi)
- [Nexmon CSI](https://github.com/seemoo-lab/nexmon_csi)
