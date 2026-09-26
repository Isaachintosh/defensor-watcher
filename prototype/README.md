# DEFENSOR — SPA mockup

Mockup navegável do command center do DEFENSOR WATCHER.

## Rodar

Não há build step nem dependências.

```bash
cd prototype
python3 -m http.server 8080
```

Abra `http://localhost:8080`.

## O que foi implementado

- SPA com rotas internas:
  - Situação;
  - Feed;
  - Protocolos;
  - Sensores;
  - Intérprete;
  - Fontes;
  - Configurações.
- mapa/canvas como superfície primária;
- eventos sintéticos para conflito, unrest, infraestrutura, weather, sísmico, fogo e sensor;
- filtros multicamadas;
- painel contextual de proveniência/impacto/ação;
- command palette por `Ctrl/⌘+K` ou `/`;
- desktop rail + mobile bottom navigation;
- detalhe desktop + mobile bottom sheet;
- tema `system`, `light` e `dark`;
- preferências visuais em `localStorage`;
- reduced-motion;
- sem dependências externas.

## Regra dos dados

Todos os eventos do mockup são sintéticos. A UI referencia classes de fonte reais apenas para testar arquitetura de informação; nenhum endpoint externo é chamado.

## Direção visual

O mockup evita o padrão de dashboard genérico de IA:

- mapa dominante em vez de card soup;
- cores semânticas pequenas;
- superfícies neutras;
- hierarquia tipográfica compacta;
- rail/sidebar menos proeminente que o conteúdo;
- painéis contextuais, não janelas permanentes;
- light/dark desenhados por tokens semânticos;
- desktop e mobile com composição diferente.

Referências de processo e qualidade:

- Linear 2026 UI refresh — redução de ruído, consistência de headers/navigation e maior foco no conteúdo.
- Apple HIG — semantic color, dark mode, contraste e adaptação.
- Impeccable — skill de frontend design/anti-slop.
- Vercel Web Interface Guidelines — auditoria de UI.
- Windy/Flighty/Raycast — referências de categoria para mapa, live-state e command-driven interaction, sem copiar seus layouts.
