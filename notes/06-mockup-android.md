# Mockup Android-first — decisão e validação

Data: 2026-09-25  
Estado: protótipo navegável local; não é aplicativo Android compilado.

## Resultado

Foi criado em `prototype/index.html` um mockup responsivo e interativo, sem dependências, backend ou rede. Ele serve ao Gate 2: testar compreensão de nível, fonte, incerteza, próxima ação, estado de demonstração e controle do usuário no check-in.

## Fluxos implementados

- Início: nível 3, frescor e alerta inequivocamente marcado como exercício.
- Detalhe: ações curtas e explicação determinística do nível.
- Check-in: estado, localização aproximada opcional, prévia e confirmação; nada é enviado.
- Guia offline simulado e configurações básicas.
- Laboratório Wi-Fi separado do caminho crítico e marcado como experimento.

## Reavaliação do Wi-Fi sensing

A nota 04 está correta no princípio físico e ao afirmar que Wi-Fi sensing existe. Isso não demonstra, por si só, disponibilidade geral de CSI/BFI para um app Android comum nem desempenho de segurança em aparelhos, roteadores e ambientes arbitrários. Demonstrações acadêmicas com RF especializado, firmware/controladores específicos, múltiplas antenas ou infraestrutura calibrada não são equivalentes a uma API estável de smartphone distribuível pela Play Store.

Portanto, a decisão muda de “descartar” para **trilha experimental condicionada**, não para recurso do MVP. O laboratório deve começar por uma matriz de capacidade real: modelo do telefone, chipset, versão Android, API/driver disponível, roteador, número de links/antenas, taxa de amostragem e necessidade de root/firmware. RSSI de scans Android não substitui CSI.

## Gate técnico do experimento

Hipótese inicial limitada: detectar movimento binário em um único cômodo conhecido e calibrado, sem identificar pessoa, intenção ou ameaça.

Avança somente se houver, em teste cego e repetível:

1. hardware e acesso a CSI/BFI documentados sem contornar segurança da plataforma;
2. baseline vazio versus movimento, com ambientes/dias/pessoas separados entre treino e teste;
3. métricas pré-registradas de precisão, recall, falsos alarmes por hora, latência e bateria;
4. degradação explícita quando layout, aparelho ou roteador mudam;
5. consentimento de todos os ocupantes, processamento local e exclusão dos dados brutos;
6. nenhuma ligação automática entre sinal experimental e níveis críticos.

Critério inicial sugerido para uma prova de bancada, não para produto: recall >= 95%, falsos alarmes <= 1 por 24 h no cenário delimitado, latência p95 <= 3 s e resultado reproduzido em sessões independentes. Os limites devem ser revistos por especialista de fatores humanos antes de qualquer claim de segurança.

## Teste do mockup

Realizar cinco tarefas moderadas com 5–8 participantes por rodada:

1. identificar que o alerta é exercício;
2. dizer fonte, frescor, área e próxima ação;
3. explicar por que o nível é 3;
4. preparar um check-in sem enviá-lo por engano;
5. explicar o que a tela Wi-Fi faz e, principalmente, o que não faz.

Gate: 100% distingue exercício de alerta real; pelo menos 80% encontra a ação principal em até 30 segundos; 100% entende que Wi-Fi é experimental e não confirma ameaça. Falha crítica: qualquer usuário interpretar “nível 3” como certeza, “sem alerta” como segurança ou compatibilidade simulada como sensor ativo.

## Próxima implementação Android

Após fechar território/fonte/categorias, transportar o fluxo validado para Kotlin + Jetpack Compose. Primeiro vertical slice: modelos imutáveis de alerta e avaliação, fixtures locais, navegação Início→Detalhe→Check-in, semantics/accessibility e testes Compose. Não pedir permissões no primeiro launch. Integração oficial e laboratório Wi-Fi ficam em módulos separados e atrás de feature flags.
