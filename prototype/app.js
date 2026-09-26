const events = [
  {
    id: "evt-conflict-01", category: "conflict", short: "Conflito", severity: "critical",
    time: "14:18", title: "Confronto armado afeta corredor logístico", area: "Corredor Norte · zona demonstrativa",
    source: "Dataset estruturado + autoridade local", sourceClass: "multi-source",
    summary: "Evento sintético para testar o fluxo de conflito. Há impacto potencial em deslocamentos e logística; nenhuma ocorrência real é representada.",
    impact: "Rotas pelo corredor devem ser verificadas antes de deslocamento. O mockup prioriza mobilidade e disponibilidade de infraestrutura, não apenas o evento em si.",
    action: "Revisar rota e protocolo de abrigo", freshness: "14 min", contested: true,
    confidence: "Claims de ator e dano permanecem separados até corroboration.",
    x: "64%", y: "35%"
  },
  {
    id: "evt-unrest-01", category: "unrest", short: "Unrest", severity: "warning",
    time: "13:54", title: "Protestos e bloqueios alteram mobilidade", area: "Centro Cívico · zona demonstrativa",
    source: "ACLED-like feed + trânsito local", sourceClass: "structured + operational",
    summary: "Evento sintético de protesto e bloqueio viário usado para demonstrar combinação de conflito/unrest com fontes de transporte.",
    impact: "Pode aumentar tempo de deslocamento e reduzir acesso a vias principais.",
    action: "Abrir alternativas de rota", freshness: "38 min", contested: false,
    confidence: "Geometria simulada; sem inferência sobre participantes.",
    x: "47%", y: "52%"
  },
  {
    id: "evt-infra-01", category: "infrastructure", short: "Energia", severity: "warning",
    time: "13:40", title: "Falha regional de energia em investigação", area: "Subestação Leste · zona demonstrativa",
    source: "Utility status", sourceClass: "operational",
    summary: "Evento sintético de interrupção elétrica com dependências possíveis em telecomunicações e mobilidade.",
    impact: "Protocolos offline e bateria passam a ter prioridade maior; serviços dependentes podem degradar.",
    action: "Ver preparação de energia e comunicação", freshness: "52 min", contested: false,
    confidence: "Estado demonstrativo; sem utility real conectada.",
    x: "70%", y: "57%"
  },
  {
    id: "evt-weather-01", category: "weather", short: "Chuva", severity: "watch",
    time: "12:58", title: "Alerta hidrológico em acompanhamento", area: "Vale Sul · zona demonstrativa",
    source: "CAP / hub meteorológico", sourceClass: "official alert",
    summary: "Exemplo meteorológico mantido como uma entre várias camadas, não como eixo principal do produto.",
    impact: "Possível impacto em vias baixas e drenagem. Sem mudança automática de nível sem aplicabilidade territorial.",
    action: "Abrir protocolo de alagamento", freshness: "1 h", contested: false,
    confidence: "Evento sintético.",
    x: "39%", y: "70%"
  },
  {
    id: "evt-seismic-01", category: "seismic", short: "Sismo", severity: "watch",
    time: "11:46", title: "Atividade sísmica moderada registrada", area: "Zona costeira · demonstração",
    source: "Seismic feed", sourceClass: "scientific",
    summary: "Evento sintético para representar ingestão de feeds científicos como USGS/GeoNet.",
    impact: "Sem ação imediata no cenário demonstrativo; apenas acompanhamento.",
    action: "Ver detalhes e protocolo sísmico", freshness: "2 h", contested: false,
    confidence: "Medição simulada; magnitude e coordenadas não representam evento real.",
    x: "28%", y: "44%"
  },
  {
    id: "evt-fire-01", category: "fire", short: "Fogo", severity: "watch",
    time: "10:22", title: "Foco de calor detectado por satélite", area: "Setor Oeste · demonstração",
    source: "Satellite fire feed", sourceClass: "remote sensing",
    summary: "Evento sintético inspirado em feeds de detecção de fogo por satélite.",
    impact: "Pode exigir confirmação por fonte operacional antes de qualquer orientação local.",
    action: "Acompanhar evolução", freshness: "4 h", contested: false,
    confidence: "Detecção remota é sinal, não confirmação de impacto local.",
    x: "18%", y: "62%"
  },
  {
    id: "evt-sensor-01", category: "sensor", short: "Sensor", severity: "experimental",
    time: "14:30", title: "Mudança de rádio detectada no laboratório", area: "Dispositivo local · demonstração",
    source: "Sensor local", sourceClass: "experimental",
    summary: "Mudança sintética de sinal local. O sistema não interpreta isso como pessoa, invasão, identidade ou ameaça.",
    impact: "Nenhuma alteração automática de readiness. O dado existe apenas como observação experimental.",
    action: "Abrir sessão do sensor", freshness: "2 min", contested: false, experimental: true,
    confidence: "Qualidade do sinal: estável. Causa: desconhecida.",
    x: "55%", y: "74%"
  }
];


const mySituation = {
  state: "PREPARAÇÃO",
  whatChanged: "Cenário sintético BSX-001: chuva severa, conectividade intermitente e uma opção de mobilidade indisponível.",
  impact: "Seu plano depende de comunicação e deslocamento; o protótipo mantém alternativas e marca dados vencidos explicitamente.",
  guidance: "Consulte somente orientação vinculada a fonte/protocolo e mantenha o plano offline acessível.",
  plan: "Ponto de encontro e contatos essenciais disponíveis no pacote local.",
  provenance: "DEMO / dados sintéticos",
  lastSync: "14:32",
  informationAge: "2 min",
  offlinePack: "disponível"
};

const layers = [
  { id: "conflict", label: "Conflito", count: 1 },
  { id: "unrest", label: "Unrest", count: 1 },
  { id: "infrastructure", label: "Infra", count: 1 },
  { id: "weather", label: "Weather", count: 1 },
  { id: "seismic", label: "Sísmico", count: 1 },
  { id: "fire", label: "Fogo", count: 1 },
  { id: "sensor", label: "Sensores", count: 1 }
];

const categoryMeta = {
  conflict: { label: "Conflito armado", css: "var(--conflict)" },
  unrest: { label: "Protesto / unrest", css: "var(--unrest)" },
  infrastructure: { label: "Infraestrutura", css: "var(--infra)" },
  weather: { label: "Hazard meteorológico", css: "var(--hazard)" },
  seismic: { label: "Atividade sísmica", css: "var(--hazard)" },
  fire: { label: "Incêndio / calor", css: "var(--hazard)" },
  sensor: { label: "Sensor local", css: "var(--sensor)" }
};

const protocols = [
  ["Conflito próximo", "Abrigo, mobilidade, comunicação e check-in em cenário de violência próxima.", "v0.3 · demo"],
  ["Evacuação / curfew", "Como interpretar instruções oficiais, preparar saída e confirmar destino.", "v0.2 · demo"],
  ["Falha de energia", "Prioridades de bateria, iluminação, refrigeração essencial e comunicação.", "v0.4 · demo"],
  ["Comunicação degradada", "Rotas offline, check-in manual e redução de dependência de rede.", "v0.3 · demo"],
  ["Alagamento", "Evitar travessias, reconhecer rotas inseguras e preparar deslocamento.", "v0.5 · demo"],
  ["Sismo", "Proteção durante o evento, checagem pós-evento e riscos secundários.", "v0.2 · demo"]
];

const sources = [
  ["ACLED", "Conflito, protestos, violência política", "dataset especializado", "quando integrado", "adapter planejado"],
  ["UCDP Candidate / GED", "Conflito armado georreferenciado", "dataset acadêmico", "release mensal", "adapter planejado"],
  ["GDELT", "Eventos e contexto de mídia", "signal/context", "streaming", "adapter planejado"],
  ["WorldMonitor", "Conflict, unrest, infra, health, hazards", "aggregator/MCP", "depende do endpoint", "skill integrada"],
  ["CAP / WMO registry", "Alertas oficiais por autoridade", "autoridade/hub", "depende do emissor", "registry"],
  ["GDACS / FIRMS / seismic", "Hazards naturais", "scientific/operational", "depende da fonte", "registry"],
  ["Sensor local", "Observação no dispositivo", "experimental", "tempo local", "laboratório"]
];

const coverage = [
  ["Conflito / unrest", "ativo"],
  ["Infraestrutura", "ativo"],
  ["Hazards naturais", "ativo"],
  ["Sensores locais", "lab"],
  ["Saúde / ambiente", "standby"]
];

const conversations = [
  { me: true, text: "Preciso encontrar uma rota segura até a estação.", meta: "PT · transcrição simulada" },
  { me: false, text: "Мне нужно найти безопасный маршрут до станции.", meta: "RU · tradução local simulada" },
  { me: false, text: "Понимаю. Избегайте перекрытого центра и следуйте по восточному маршруту.", meta: "RU · resposta simulada" },
  { me: true, text: "Entendi. Evite o centro bloqueado e siga pela rota leste.", meta: "PT · tradução local simulada" }
];

const routeButtons = [...document.querySelectorAll("[data-route]")];
const views = [...document.querySelectorAll(".route-view")];
const layerStrip = document.querySelector("#layerStrip");
const mapMarkers = document.querySelector("#mapMarkers");
const microTimeline = document.querySelector("#microTimeline");
const eventDetail = document.querySelector("#eventDetail");
const panelEmpty = document.querySelector("#panelEmpty");
const eventFeed = document.querySelector("#eventFeed");
const coverageList = document.querySelector("#coverageList");
const protocolGrid = document.querySelector("#protocolGrid");
const sourceTable = document.querySelector("#sourceTable");
const sensorLayout = document.querySelector("#sensorLayout");
const conversation = document.querySelector("#conversation");
const mobileSheet = document.querySelector("#mobileSheet");
const mobileEventDetail = document.querySelector("#mobileEventDetail");
const commandBackdrop = document.querySelector("#commandBackdrop");
const commandInput = document.querySelector("#commandInput");
const commandResults = document.querySelector("#commandResults");
const mySituationSummary = document.querySelector("#mySituationSummary");

let activeLayers = new Set(layers.map(x => x.id));
let selectedEvent = null;
let currentRoute = "overview";

function icon(id) {
  return '<svg aria-hidden="true"><use href="#' + id + '"></use></svg>';
}

function go(route) {
  currentRoute = route;
  views.forEach(v => v.classList.toggle("is-active", v.dataset.view === route));
  routeButtons.forEach(b => b.classList.toggle("is-active", b.dataset.route === route));
  if (route !== "overview") closeMobileSheet();
  document.querySelector(".workspace")?.scrollTo?.(0, 0);
}

routeButtons.forEach(button => button.addEventListener("click", () => go(button.dataset.route)));

function renderLayers() {
  layerStrip.innerHTML = layers.map(layer => {
    const active = activeLayers.has(layer.id);
    return '<button class="layer-chip ' + (active ? "is-active" : "") + '" data-layer="' + layer.id + '" aria-pressed="' + active + '">' +
      '<i></i><strong>' + layer.label + '</strong><span>' + layer.count + '</span></button>';
  }).join("");
  layerStrip.querySelectorAll("[data-layer]").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.layer;
      activeLayers.has(id) ? activeLayers.delete(id) : activeLayers.add(id);
      renderLayers();
      renderMarkers();
      renderFeed();
    });
  });
}

function renderMarkers() {
  const visible = events.filter(event => activeLayers.has(event.category));
  mapMarkers.innerHTML = visible.map(event => {
    const selected = selectedEvent?.id === event.id;
    return '<button class="event-marker ' + (selected ? "is-selected" : "") + '" data-event-id="' + event.id +
      '" data-category="' + event.category + '" data-short="' + event.short +
      '" style="--x:' + event.x + ';--y:' + event.y + '" aria-label="' + event.title + '"></button>';
  }).join("");
  mapMarkers.querySelectorAll("[data-event-id]").forEach(button => button.addEventListener("click", () => selectEvent(button.dataset.eventId)));
}

function renderTimeline() {
  microTimeline.innerHTML = events.slice(0, 5).map(event =>
    '<button class="timeline-row" data-event-id="' + event.id + '" style="width:100%;border-left:0;border-right:0;background:transparent;text-align:left;color:inherit">' +
    '<time>' + event.time + '</time><i style="background:' + categoryMeta[event.category].css + '"></i><div><strong>' +
    event.title + '</strong><span>' + event.area + '</span></div></button>'
  ).join("");
  microTimeline.querySelectorAll("[data-event-id]").forEach(button => button.addEventListener("click", () => selectEvent(button.dataset.eventId)));
}

function detailMarkup(event, mobile = false) {
  const meta = categoryMeta[event.category];
  const state = event.experimental
    ? '<span class="state-pill experimental">Experimental</span>'
    : event.contested
      ? '<span class="state-pill contested">Claims em divergência</span>'
      : '<span class="state-pill">Corroborado no mock</span>';

  return '<div style="--event-color:' + meta.css + '">' +
    (!mobile ? '<div class="detail-close-row"><span class="detail-type"><i></i>' + meta.label + '</span><button class="icon-button" data-close-detail aria-label="Fechar detalhe">' + icon("i-close") + '</button></div>' :
      '<div class="detail-close-row"><span class="detail-type"><i></i>' + meta.label + '</span></div>') +
    '<h2 class="detail-title">' + event.title + '</h2>' +
    '<div class="detail-meta"><span>' + event.time + '</span><span>' + event.area + '</span><span>frescor ' + event.freshness + '</span></div>' +
    '<p class="detail-summary">' + event.summary + '</p>' +
    '<div class="detail-block"><h3>O que muda para você</h3><p>' + event.impact + '</p></div>' +
    '<div class="detail-block"><h3>Origem e estado</h3><div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:9px"><span class="source-pill">' + event.source + '</span>' + state + '</div><p>' + event.confidence + '</p></div>' +
    '<div class="detail-block"><h3>Próxima ação</h3><p><strong>' + event.action + '</strong></p></div>' +
    '<div class="detail-actions"><button class="primary-button" data-action="protocol">Abrir protocolo</button><button class="secondary-button" data-action="checkin">Preparar check-in</button></div>' +
    '</div>';
}

function bindDetailActions(container) {
  container.querySelector("[data-close-detail]")?.addEventListener("click", clearSelection);
  container.querySelector("[data-action='protocol']")?.addEventListener("click", () => { closeMobileSheet(); go("protocols"); });
  container.querySelector("[data-action='checkin']")?.addEventListener("click", () => alert("Mockup: abriria a prévia de check-in. Nada foi enviado."));
}

function selectEvent(id) {
  selectedEvent = events.find(event => event.id === id) || null;
  renderMarkers();
  if (!selectedEvent) return;
  const isMobile = matchMedia("(max-width: 780px)").matches;
  if (isMobile) {
    mobileEventDetail.innerHTML = detailMarkup(selectedEvent, true);
    mobileSheet.hidden = false;
    bindDetailActions(mobileEventDetail);
  } else {
    panelEmpty.hidden = true;
    eventDetail.hidden = false;
    eventDetail.innerHTML = detailMarkup(selectedEvent);
    bindDetailActions(eventDetail);
  }
}

function clearSelection() {
  selectedEvent = null;
  renderMarkers();
  eventDetail.hidden = true;
  eventDetail.innerHTML = "";
  panelEmpty.hidden = false;
}

function closeMobileSheet() {
  mobileSheet.hidden = true;
}
mobileSheet.querySelector(".sheet-scrim")?.addEventListener("click", closeMobileSheet);
mobileSheet.querySelector(".sheet-close")?.addEventListener("click", closeMobileSheet);

function renderFeed() {
  const visible = events.filter(event => activeLayers.has(event.category));
  eventFeed.innerHTML = visible.map(event => {
    const meta = categoryMeta[event.category];
    return '<button class="feed-row" data-event-id="' + event.id + '" style="--event-color:' + meta.css + '">' +
      '<time class="feed-time">' + event.time + '</time><i class="feed-dot"></i><div class="feed-copy"><strong>' + event.title +
      '</strong><p>' + event.area + ' · ' + event.action + '</p></div><div class="feed-source">' + meta.label + '<br>' + event.freshness + '</div></button>';
  }).join("");
  eventFeed.querySelectorAll("[data-event-id]").forEach(button => button.addEventListener("click", () => {
    const id = button.dataset.eventId;
    go("overview");
    requestAnimationFrame(() => selectEvent(id));
  }));
}

function renderCoverage() {
  coverageList.innerHTML = coverage.map(([label, status]) =>
    '<div class="coverage-item"><span>' + label + '</span><strong>' + status + '</strong></div>'
  ).join("");
}

function renderProtocols() {
  protocolGrid.innerHTML = protocols.map(([title, text, version]) =>
    '<article class="protocol-card"><small>PROTOCOLO</small><h3>' + title + '</h3><p>' + text + '</p><footer><span>' + version + '</span><button class="text-button">Abrir ' + icon("i-chevron") + '</button></footer></article>'
  ).join("");
}

function renderSources() {
  sourceTable.innerHTML = sources.map(row =>
    '<tr><td><strong>' + row[0] + '</strong></td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td><td class="source-status">' + row[4] + '</td></tr>'
  ).join("");
}

function renderSensors() {
  sensorLayout.innerHTML =
    '<article class="sensor-primary"><p class="eyebrow">BACKEND ATIVO · DEMO</p><h2>Wi-Fi sensing companion</h2><p>ESP32-S3/C6 ou outro backend compatível publica um SensorEvent normalizado. O mockup mostra qualidade do sinal, não probabilidade de ameaça.</p>' +
    '<div class="radar-field"><span class="radar-blip"></span></div><div class="sensor-stat-row"><div class="sensor-stat"><strong>Estável</strong><span>qualidade</span></div><div class="sensor-stat"><strong>18 ms</strong><span>janela</span></div><div class="sensor-stat"><strong>Local</strong><span>processamento</span></div></div></article>' +
    '<div class="sensor-stack"><article><p class="eyebrow">RADAR DEDICADO</p><h3>60 GHz / A121</h3><p>Backend alternativo para presença e distância. Mesmo contrato de evento, calibração separada.</p><span class="state-pill">disponível no lab</span></article>' +
    '<article><p class="eyebrow">ANDROID</p><h3>UWB / Wi-Fi RTT</h3><p>Ranging de dispositivos compatíveis. Não equivale a detectar pessoas através de paredes.</p><span class="state-pill">capability-based</span></article>' +
    '<article><p class="eyebrow">POLICY</p><h3>Nunca promove sozinho</h3><p>Sensor experimental não eleva automaticamente níveis críticos nem executa ações externas.</p><span class="state-pill experimental">gate obrigatório</span></article></div>';
}

function renderConversation() {
  conversation.innerHTML = conversations.map(message =>
    '<div class="message ' + (message.me ? "me" : "") + '"><div class="bubble">' + message.text + '</div><small>' + message.meta + '</small></div>'
  ).join("");
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("defensor-theme", theme);
  document.querySelectorAll("[data-theme-choice]").forEach(button => button.classList.toggle("is-active", button.dataset.themeChoice === theme));
}
const savedTheme = localStorage.getItem("defensor-theme") || "system";
applyTheme(savedTheme);

function cycleTheme() {
  const current = document.documentElement.dataset.theme;
  applyTheme(current === "system" ? "dark" : current === "dark" ? "light" : "system");
}
document.querySelector("#themeToggle")?.addEventListener("click", cycleTheme);
document.querySelector("#themeToggleRail")?.addEventListener("click", cycleTheme);
document.querySelectorAll("[data-theme-choice]").forEach(button => button.addEventListener("click", () => applyTheme(button.dataset.themeChoice)));

const commands = [
  ...events.map(event => ({ type: "event", title: event.title, subtitle: event.area, key: event.time, eventId: event.id, icon: "i-map" })),
  { type: "route", title: "Abrir Situação", subtitle: "Mapa multicamadas", key: "G M", route: "overview", icon: "i-map" },
  { type: "route", title: "Abrir Feed", subtitle: "Linha temporal de eventos", key: "G F", route: "feed", icon: "i-stream" },
  { type: "route", title: "Abrir Protocolos", subtitle: "Orientações offline", key: "G P", route: "protocols", icon: "i-protocol" },
  { type: "route", title: "Abrir Sensores", subtitle: "Capability router", key: "G S", route: "sensors", icon: "i-sensor" },
  { type: "route", title: "Abrir Intérprete", subtitle: "Tradução bilateral offline", key: "G I", route: "interpreter", icon: "i-language" },
  { type: "route", title: "Abrir Fontes", subtitle: "Source registry", key: "G R", route: "sources", icon: "i-sources" },
  ...layers.map(layer => ({ type: "filter", title: "Filtrar: " + layer.label, subtitle: "Mostrar somente esta camada", key: "layer", layer: layer.id, icon: "i-filter" }))
];

function openCommandPalette(prefill = "") {
  commandBackdrop.hidden = false;
  commandInput.value = prefill;
  renderCommandResults();
  setTimeout(() => commandInput.focus(), 0);
}
function closeCommandPalette() { commandBackdrop.hidden = true; }
function renderCommandResults() {
  const query = commandInput.value.trim().toLowerCase();
  const matches = commands.filter(command =>
    !query || (command.title + " " + command.subtitle).toLowerCase().includes(query)
  ).slice(0, 10);
  commandResults.innerHTML = matches.map((command, index) =>
    '<button class="command-result ' + (index === 0 ? "is-highlighted" : "") + '" data-command-index="' + commands.indexOf(command) + '">' +
    icon(command.icon) + '<div><strong>' + command.title + '</strong><span>' + command.subtitle + '</span></div><em>' + command.key + '</em></button>'
  ).join("") || '<div style="padding:20px;color:var(--ink-3);font-size:12px">Nenhum resultado.</div>';
  commandResults.querySelectorAll("[data-command-index]").forEach(button => button.addEventListener("click", () => runCommand(commands[Number(button.dataset.commandIndex)])));
}
function runCommand(command) {
  closeCommandPalette();
  if (command.type === "route") go(command.route);
  if (command.type === "event") { go("overview"); requestAnimationFrame(() => selectEvent(command.eventId)); }
  if (command.type === "filter") {
    activeLayers = new Set([command.layer]);
    renderLayers(); renderMarkers(); renderFeed(); go("overview");
  }
}
document.querySelector("#commandTrigger")?.addEventListener("click", () => openCommandPalette());
document.querySelector("#feedFilterButton")?.addEventListener("click", () => openCommandPalette("Filtrar:"));
commandInput.addEventListener("input", renderCommandResults);
commandBackdrop.addEventListener("click", event => { if (event.target === commandBackdrop) closeCommandPalette(); });

document.addEventListener("keydown", event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault(); openCommandPalette();
  }
  if (event.key === "Escape") { closeCommandPalette(); closeMobileSheet(); }
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
    event.preventDefault(); openCommandPalette();
  }
});

const talkButton = document.querySelector("#talkButton");
function startTalking() { talkButton.classList.add("is-listening"); talkButton.querySelector("strong").textContent = "Ouvindo…"; }
function stopTalking() { talkButton.classList.remove("is-listening"); talkButton.querySelector("strong").textContent = "Segure para falar"; }
talkButton?.addEventListener("pointerdown", startTalking);
talkButton?.addEventListener("pointerup", stopTalking);
talkButton?.addEventListener("pointercancel", stopTalking);
talkButton?.addEventListener("pointerleave", stopTalking);

window.addEventListener("resize", () => {
  if (!matchMedia("(max-width: 780px)").matches) closeMobileSheet();
});


function renderMySituation() {
  if (!mySituationSummary) return;
  mySituationSummary.innerHTML =
    '<div class="summary-kicker"><span class="pulse"></span> ' + mySituation.state + '</div>' +
    '<p><strong>O que mudou:</strong> ' + mySituation.whatChanged + '</p>' +
    '<p><strong>Como isso me afeta:</strong> ' + mySituation.impact + '</p>' +
    '<p><strong>O que fazer:</strong> ' + mySituation.guidance + '</p>' +
    '<p><strong>Meu plano:</strong> ' + mySituation.plan + '</p>' +
    '<p style="font-size:11px"><strong>Origem:</strong> ' + mySituation.provenance +
    ' · sync ' + mySituation.lastSync + ' · idade ' + mySituation.informationAge +
    ' · offline ' + mySituation.offlinePack + '</p>' +
    '<button class="text-button" data-route="feed">Abrir evidências e eventos ' + icon("i-arrow") + '</button>';
  mySituationSummary.querySelector("[data-route='feed']")?.addEventListener("click", () => go("feed"));
}

renderMySituation();
renderLayers();
renderMarkers();
renderTimeline();
renderFeed();
renderCoverage();
renderProtocols();
renderSources();
renderSensors();
renderConversation();
