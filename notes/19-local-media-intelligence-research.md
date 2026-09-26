# Local Media Intelligence — pesquisa ampla de APIs, SDKs, libs e repositórios — 2026-09-25

## Objetivo

Adicionar ao DEFENSOR uma camada de notícias locais e regionais baseada na localização do usuário, sem confundir imprensa com alerta oficial.

A camada deve:

- descobrir veículos que realmente cobrem a área;
- ingerir notícias diretamente desses veículos quando possível;
- usar agregadores globais como cobertura complementar;
- separar localidade do publisher da localidade do fato;
- geolocalizar artigos;
- deduplicar republicações e wire copies;
- clusterizar múltiplas reportagens sobre o mesmo evento;
- preservar claims conflitantes;
- cruzar imprensa com fontes oficiais/operacionais;
- funcionar com cache regional offline.

---

## Resultado executivo

Não existe uma única API global perfeita para "todos os jornais locais da posição atual", mas já existe tecnologia suficiente para montar isso sem reinventar o ecossistema.

A arquitetura recomendada é federada:

```text
OS LOCATION
    |
    v
Geo Context Resolver
GeoNames / admin hierarchy / H3 / IBGE where available
    |
    +-----------------------------+
    |                             |
    v                             v
LOCAL MEDIA REGISTRY        NEWS DISCOVERY
country registries          NewsCatcher
Media Cloud                 Event Registry
direct publishers           GDELT
                            Google News geo fallback
    |                             |
    +--------------+--------------+
                   v
             INGESTION BUS
 RSS / Atom / News Sitemap / API / crawler
                   |
                   v
          ARTICLE NORMALIZATION
                   |
       +-----------+------------+
       |                        |
       v                        v
 GEO RESOLUTION             DEDUP
 publisher vs event         URL/hash/MinHash
 geography                  syndication
       |                        |
       +-----------+------------+
                   v
             EVENT CLUSTER
                   |
        official corroboration
                   |
                   v
             MediaSignal
                   |
                   v
          Situational Watch
```

---

# 1. A melhor descoberta para o Brasil: Atlas da Notícia

## API oficial

O Atlas da Notícia mantém uma API REST voltada justamente a mapear veículos produtores de notícias, especialmente jornalismo local.

Documentação:
https://api.atlas.jor.br/docs

Base:
https://api.atlas.jor.br/api/v1

A API suporta autenticação JWT e também expõe um `dummy-jwt` para consultas públicas específicas.

### Dados úteis para o DEFENSOR

O endpoint analítico lista atributos como:

- id;
- nome_veiculo;
- media_source_id;
- segmento;
- city_id;
- cidade;
- cod_mun_ibge;
- state_id;
- estado;
- region_id;
- regiao;
- endereço;
- periodicidade;
- outros metadados.

Também existe:

`GET /media/online`

e uma rota pública:

`GET /media/verified`

que retorna veículos verificados, com município, estado, região, código municipal, data de atualização e critérios.

### Termos

A API é aberta e gratuita e permite aplicações inclusive comerciais, seguindo regras de uso responsável/rate limit. Há restrições específicas para os e-mails disponíveis nos dados.

Referências:
- https://atlas.jor.br/api/documentacao-da-api/
- https://atlas.jor.br/api/regras-de-uso-da-api-do-atlas-da-noticia/

## Uso no DEFENSOR

```text
lat/lon
  |
reverse geocode / IBGE municipality
  |
Atlas da Notícia
  |
local outlets
  |
feed discovery
  |
RSS / sitemap / direct crawl
```

Isso é muito melhor que inferir "jornais locais" por nome de domínio.

---

# 2. Media Cloud — diretório global open-source

Media Cloud é particularmente valioso para o Source Registry.

Docs:
https://www.mediacloud.org/documentation/

Python client:
https://github.com/mediacloud/api-client

## Directory

O Directory representa news publishers como Sources e mantém collections geográficas.

A documentação afirma suporte a:
- global news;
- hyperlocal news;
- well-read blogs;
- print-native;
- digital-native;
- audio/video broadcast.

Metadados importantes:
- homepage;
- domain;
- label;
- pub_country;
- pub_state;
- media_type;
- primary language;
- stories/week;
- first story;
- feeds.

A plataforma associa Sources a RSS e Google News Sitemap e ingere esses feeds continuamente.

Um detalhe especialmente relevante: Media Cloud suporta "child sources" usando `url_search_string`.

Exemplo documentado:
- `globo.com` como parent;
- G1 Amapá como child com pattern `g1.globo.com/ap/amapa/*`.

Isso encaixa diretamente em publishers nacionais que mantêm seções regionais.

## API client

O pacote Python `mediacloud` permite:
- Search API;
- Directory API;
- listar sources de uma collection;
- pesquisar stories por source/collection.

Uso proposto:
`MediaCloudDirectoryAdapter`.

---

# 3. NewsCatcher Local News API — melhor integração comercial encontrada

Docs:
https://www.newscatcherapi.com/docs/local-news-api/

A Local News API é explicitamente construída para cidade/região.

## GeoNames

O serviço resolve localidades usando GeoNames e fornece:
- GeoNames ID;
- country;
- admin1;
- admin2;
- admin3/admin4;
- coordinates;
- localization score;
- confidence score;
- feature class/code;
- detection methods.

Pode filtrar diretamente por latitude/longitude bounds.

## Detection methods

A API distingue maneiras de inferir localidade:
- dedicated_source;
- local_section;
- regional_source;
- standard format;
- proximity mention;
- AI extracted.

Esse desenho resolve uma questão central do DEFENSOR: distinguir um veículo dedicado à cidade de um artigo que apenas menciona a cidade.

## Capabilities

Também oferece:
- summaries;
- entities;
- translation;
- deduplication;
- clustering;
- near-real-time ingestion;
- local/hyperlocal publishers.

Uso:
- benchmark comercial;
- possível provider principal em países sem registry local forte;
- fonte de ground truth para avaliar nosso próprio localizer/dedup.

---

# 4. Event Registry / NewsAPI.ai

Docs:
https://newsapi.ai/documentation

Python SDK:
https://github.com/EventRegistry/event-registry-python

## Duas geometrias diferentes

Essa API possui exatamente a distinção que o DEFENSOR precisa:

- `sourceLocationUri`: localidade do publisher;
- `locationUri`: localidade mencionada no dateline/conteúdo.

Também possui:
- source search;
- location autosuggest;
- article/event clustering;
- event streams;
- breaking events;
- multilingual queries;
- duplicate lists;
- event location metadata.

Uso:
`EventRegistryAdapter`.

É comercial; o SDK é open source, mas os termos da API variam por plano.

---

# 5. GDELT — camada global free/broad signal

GDELT continua valioso porque monitora cobertura jornalística mundial em múltiplos idiomas.

### GEO 2.0

Permite mapear localidades mencionadas em cobertura de imprensa.

https://blog.gdeltproject.org/gdelt-geo-2-0-api-debuts/

### DOC 2.0

Full-text news search.

https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/

### Clients

- https://github.com/RBozydar/py-gdelt
- https://github.com/alex9smith/gdelt-doc-api

`py-gdelt` é particularmente interessante:
- async-first;
- Pydantic;
- REST APIs + GDELT datasets;
- GEO/DOC/GKG/Event support;
- BigQuery fallback.

Uso:
- broad discovery;
- media corroboration;
- international fallback;
- historical analysis;
- conflict/news context.

Não deve ser a única fonte de local news porque localização mencionada e identidade de publisher local não são equivalentes.

---

# 6. Google News RSS geo/search — fallback oportunístico

Google News expõe feeds RSS que podem ser consultados por localidade e search terms.

Encontramos também um MCP open-source:

https://github.com/moltrus/google-news-mcp

Ele implementa:
- top headlines;
- category feed;
- search;
- `get_geo_feed(location)`;
- decoding de Google News URLs;
- cache;
- multilingual settings.

O repository não tinha um LICENSE file na raiz durante a auditoria, portanto deve ser usado como referência técnica até que licensing seja esclarecido.

O feed Google News é útil como discovery/fallback, mas o DEFENSOR não deve depender dele como contrato de produção primário porque a superfície RSS não oferece o mesmo contrato estruturado e controlado de um provider dedicado.

---

# 7. NewsData.io

NewsData oferece `region` para:
- city;
- district;
- county;
- state;
- country;
- continent.

Também permite múltiplas regiões.

O `country` identifica principalmente o país do publisher; `region` identifica a área relacionada ao artigo.

Documentação/referência:
https://newsdata.io/blog/latest-news-endpoint/
https://newsdata.io/blog/exploring-region-parameter-of-newsdata-io/

O region filter é recurso de planos superiores/corporate conforme documentação atual.

Uso:
provider secundário / benchmark.

---

# 8. Mediastack e Currents

## Mediastack

https://mediastack.com/

Agrega milhares de fontes e permite filtro por país/source/category/language.

É melhor para country-level discovery do que para city-level geolocation.

Uso:
fallback nacional, não provider principal de local media.

## Currents

https://currentsapi.services/

Declara cobertura global/regional e geolocation metadata.

Uso:
benchmark complementar; validar precisão/cidade em spike antes de produção.

---

# 9. Direct Publisher Ingestion

O Source Registry deve tentar chegar diretamente ao publisher sempre que possível.

Ordem:

```text
RSS/Atom
   |
News Sitemap
   |
publisher API
   |
RSSHub
   |
controlled crawler
```

Isso reduz dependência de agregadores e melhora frescor.

---

# 10. RSS/Atom

### feedparser

Repo:
https://github.com/kurtmckee/feedparser

Python parser maduro para RSS/Atom.

Uso:
`DirectRssAdapter`.

### RSSHub

Repo:
https://github.com/DIYgod/RSSHub

Características:
- open source;
- enorme catálogo de routes;
- milhares de instances;
- pode transformar vários sites sem RSS em feeds consumíveis.

Licença:
AGPL-3.0.

Uso recomendado:
deploy separado/service boundary ou integração respeitando a licença.

### RSSHub Radar

Pode ajudar a descobrir automaticamente RSS/RSSHub routes em sites.

---

# 11. Google News Sitemap / XML Sitemap

Muitos publishers mantêm:
- `news-sitemap.xml`;
- sitemap index;
- Google News sitemap.

Media Cloud usa justamente RSS + sitemap como base de ingestão.

## Parsers

### Ultimate Sitemap Parser

https://github.com/GateNLP/ultimate-sitemap-parser

Suporta sitemap XML, index e vários formatos.

A auditoria encontrou advisory recente para versões antigas (<= 1.8.0) envolvendo XML entity expansion. Se usado, pin de versão corrigida + parser hardening é obrigatório.

### Crawlee

O Crawlee Python possui sitemap parser/request loader e pode ser alternativa moderna.

Uso:
`NewsSitemapAdapter`.

---

# 12. Article extraction

Quando o publisher fornece apenas URL/feed incompleto:

## Trafilatura

https://github.com/adbar/trafilatura

Apache-2.0.
Boa opção para extração de texto principal + metadata.

## newspaper4k

https://github.com/AndyTheFactory/newspaper4k

MIT.
Fork moderno do Newspaper, com article extraction, language/content metadata.

## news-please

https://github.com/fhamborg/news-please

Crawler focado especificamente em news:
- root-site crawl;
- RSS;
- archived content;
- headline;
- lead;
- full text;
- author;
- publication date;
- language;
- integração com Common Crawl.

Uso:
research/backfill e publisher onboarding.

Para hot path de produção, preferir RSS/API + lightweight extraction.

---

# 13. Dedup e syndication detection

Notícias regionais frequentemente reproduzem:
- press releases;
- agências de notícias;
- textos idênticos entre portais;
- feeds espelhados.

Contar domínios sem dedup geraria falsa corroboration.

Pipeline sugerido:

```text
canonical URL
   |
normalized title
   |
content fingerprint
   |
RapidFuzz
   |
MinHash/LSH
   |
semantic similarity when needed
   |
syndication graph
```

## Libraries

### RapidFuzz

MIT.
String/fuzzy matching rápido.

Uso:
headline normalization, near-title duplicates.

### datasketch

MinHash/LSH em Python.

Uso:
near-duplicate article bodies/snippets.

### sentence-transformers

Semantic embeddings.

Uso:
clusterização quando dois publishers descrevem o mesmo fato com texto diferente.

### HDBSCAN / clustering

Uso:
clusterizar embeddings por janela temporal/região quando volume exigir.

---

# 14. Geolocation própria

Mesmo usando providers que fornecem geography, o DEFENSOR deve preservar um resolver próprio.

Pipeline:

```text
headline/body/entities
       |
NER / location candidates
       |
GeoNames/admin resolver
       |
disambiguation
       |
geometry/H3
```

## Libraries

- spaCy for NER;
- GeoNames dataset/API;
- geopy for geocoding adapters;
- H3/h3-py for spatial indexing.

O H3 facilita:
- artigos no mesmo território;
- user proximity;
- geofence/applicability;
- cluster cross-source.

---

# 15. Brasil: estratégia ideal

No Brasil o pipeline recomendado é:

```text
OS location
 |
IBGE municipality / H3
 |
Atlas da Notícia
 |
local verified/online outlets
 |
+----------------------+
|                      |
RSS/news sitemap       Media Cloud
|                      |
publisher articles     additional source discovery
|                      |
+----------+-----------+
           |
NewsCatcher / Event Registry optional
           |
GDELT broad corroboration
           |
MediaCluster
```

Isso permite descobrir veículos de Santos, São Vicente, Praia Grande etc. a partir do município, em vez de buscar "notícia São Vicente" genericamente.

---

# 16. International strategy

Para outros países:

```text
GeoNames/admin hierarchy
 |
country-specific registry?
 | yes -> use
 | no
 v
Media Cloud Directory
 |
NewsCatcher Local
 |
Event Registry sourceLocation
 |
direct publisher feeds
 |
GDELT / Google News fallback
```

O Source Registry deve permitir country plugins, assim como já fazemos para emergency feeds.

---

# 17. Data model

## LocalMediaSource

```yaml
source_id:
name:
domains:
media_type:
languages:
publisher_country:
publisher_state:
publisher_city:
admin_ids:
geonames_ids:
ibge_code:
coverage_area:
scope: hyperlocal | local | regional | national
registry_provenance:
verification_metadata:
ownership_group:
feeds:
  rss:
  atom:
  news_sitemap:
  api:
terms:
last_seen_at:
health:
```

## MediaReport

```yaml
report_id:
source_id:
url:
canonical_url:
title:
published_at:
indexed_at:
language:
article_locations:
primary_event_location:
h3_cells:
topics:
entities:
extraction_method:
content_fingerprint:
syndicated_from:
cluster_id:
freshness:
raw_ref:
```

## MediaCluster

```yaml
cluster_id:
canonical_topic:
geometry:
started_at:
updated_at:
reports:
distinct_publishers:
distinct_ownership_groups:
syndicated_reports:
official_refs:
claims:
contested:
state:
```

---

# 18. Triangulation semantics

Não usar um score mágico de "verdade".

Estados explícitos:

- `single_source`;
- `multi_source`;
- `independently_reported`;
- `official_corroboration`;
- `contested`;
- `stale`;
- `retracted_or_corrected`;
- `source_degraded`.

Exemplo:

```text
Portal A local reports explosion
Portal B republishes Portal A
Portal C independently reports explosion
Fire department posts incident

Result:
3 articles
2 independent editorial sources
1 syndicated copy
1 official corroboration
state = official_corroboration
```

Isso é muito mais informativo que "confidence 92%".

---

# 19. Integration with Readiness Engine

Local media pode:

- criar developing signal;
- iniciar polling de fontes oficiais;
- mostrar contexto no mapa;
- sugerir atenção a rota/área;
- aumentar prioridade de coleta;
- informar protocolo quando o fato também satisfaz regras de aplicabilidade.

Local media isolada não precisa ser descartada: ela aparece como informação local com provenance.

Ações automáticas críticas continuam passando pelo policy router e pelos critérios da capability.

---

# 20. Offline

O region pack pode incluir um snapshot:

```text
RegionPack
  maps
  routing
  protocols
  local_media_registry
  latest_media_clusters
  source_metadata
  last_sync_at
```

Quando offline:

- artigos/cache continuam legíveis;
- UI mostra `last_sync_at`;
- nenhum conteúdo cacheado é tratado como notícia atual;
- direct feeds voltam a sincronizar quando conexão retorna.

---

# 21. Recomendação de P0

## Open-first

Implementar:

1. Atlas da Notícia adapter — Brasil;
2. Media Cloud Directory adapter;
3. Direct RSS/Atom adapter using feedparser;
4. news-sitemap adapter;
5. Trafilatura extraction;
6. RapidFuzz + MinHash dedup;
7. H3 geography;
8. GDELT adapter as global corroboration.

## Parallel commercial benchmarks

Testar:
- NewsCatcher Local News API;
- NewsAPI.ai/Event Registry.

Critério:
quanto código próprio, latência e source-discovery work deixam de existir com o provider versus custo/licensing/vendor lock-in.

## Fallback

Google News geo RSS adapter como discovery best-effort, sem ser source-of-record.

---

# 22. Sprint impact

Adicionar à Sprint 2:

- Local Media Registry;
- Atlas da Notícia adapter;
- Media Cloud adapter;
- direct RSS/sitemap ingestion;
- publisher/event geography separation;
- first local-news markers.

Adicionar à Sprint 3:

- news dedup/syndication detection;
- MediaCluster;
- source triangulation;
- official corroboration link;
- developing/contested/corroborated UI;
- offline local news cache.

