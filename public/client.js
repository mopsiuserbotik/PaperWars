const BUILDING_DEFS = {
  hq: { name: "Штаб", icon: "🏛", cost: "100💰" },
  village: { name: "Деревня", icon: "🏘", cost: "5💰" },
  city: { name: "Город", icon: "🏢", cost: "12💰" },
  barracks: { name: "Казармы", icon: "🏚", cost: "8💰" },
  mine: { name: "Шахта", icon: "⛏", cost: "10💰" },
  minePlus: { name: "Шахта+", icon: "⛏+", cost: "35💰" },
  farm: { name: "Ферма", icon: "🌾", cost: "5💰" },
  port: { name: "Порт", icon: "🏗", cost: "15💰" },
  bridge: { name: "Мост", icon: "🟫", cost: "20💰" },
  factory: { name: "Завод", icon: "🏭", cost: "30💰" },
  ammoDepot: { name: "Склад", icon: "📦", cost: "5💰 · +50💣" },
  bunker: { name: "Бункер", icon: "🧱", cost: "22💰 8⚙️" },
  hospital: { name: "Больница", icon: "🏥", cost: "13💰" },
  tck: { name: "ТЦК", icon: "📋", cost: "24💰 · мобилизация" },
  counterIntel: { name: "Контрразведка", icon: "🕵", cost: "120💰" },
  nuclearPlant: { name: "Ядерный завод", icon: "☢🏭", cost: "150💰" }
};

const UNIT_DEFS = {
  inf: { name: "Пехота", icon: "⚔️", cost: "1👤 2💰 · моб. 1💰" },
  rpg: { name: "Гранатометчик", icon: "🎯", cost: "1👤 6💰 1⚙️ 1💣" },
  tank: { name: "Танк", icon: "🚜", cost: "2👤 18💰 8⚙️" },
  rocket: { name: "Ракета", icon: "🚀", cost: "1👤 28💰 12⚙️ · 3с" },
  aa: { name: "ПВО", icon: "🛡", cost: "1👤 22💰 8⚙️ · 3с" },
  aaPlus: { name: "ПВО+", icon: "🛰", cost: "2👤 55💰 18⚙️ 4☢ · 3с" },
  ew: { name: "РЭБ", icon: "📡", cost: "10💰 2⚙️ · 3с" },
  mlrs: { name: "РСЗО", icon: "🚚", cost: "3👤 70💰 28⚙️" },
  drone: { name: "Дрон", icon: "🛸", cost: "16💰 4⚙️ 3💣" },
  saboteur: { name: "Диверсант", icon: "🕵", cost: "1👤 45💰 6⚙️ 4💣 · кд" },
  boat: { name: "Лодка", icon: "🚤", cost: "1👤 12💰 5⚙️" },
  cruiser: { name: "Крейсер", icon: "🚢", cost: "2👤 55💰 24⚙️ · у порта" },
  nuke: { name: "Ядерка", icon: "☢️", cost: "нужен ☢🏭 · 90💰 30⚙️ 20☢ 3👤" }
};

const RESOURCE_DEFS = [
  { key: "gold", label: "золото", icon: "💰" },
  { key: "iron", label: "железо", icon: "⚙️" },
  { key: "pop", label: "население", icon: "👤" },
  { key: "ammo", label: "боеприпасы", icon: "💣" },
  { key: "uranium", label: "уран", icon: "☢" }
];

const TERRAIN_NAMES = {
  land: "земля",
  water: "вода",
  gold: "золото",
  iron: "железо",
  uranium: "уран"
};

const BUILDING_MARKS = {
  hq: "Штаб",
  village: "Деревня",
  city: "Город",
  barracks: "Казармы",
  mine: "Шахта",
  minePlus: "Шахта+",
  farm: "Ферма",
  port: "Порт",
  bridge: "Мост",
  factory: "Завод",
  ammoDepot: "Склад",
  bunker: "Бункер",
  hospital: "Больница",
  tck: "ТЦК",
  counterIntel: "Контрразведка",
  nuclearPlant: "Ядерный завод"
};

const UNIT_MARKS = {
  inf: "Пехота",
  rpg: "Гранатометчик",
  tank: "Танк",
  rocket: "Ракета",
  aa: "ПВО",
  aaPlus: "ПВО+",
  ew: "РЭБ",
  mlrs: "РСЗО",
  drone: "Дрон",
  saboteur: "Диверсант",
  boat: "Лодка",
  cruiser: "Крейсер"
};
const MOVE_TOGGLE_LABELS = {
  rpg: "РПГ",
  tank: "Танк",
  mlrs: "РСЗО",
  ew: "РЭБ",
  cruiser: "Крейсер",
  drone: "Дрон",
  saboteur: "Диверсант"
};
const SCRAPPABLE_UNITS = ["tank", "rocket", "aa", "aaPlus", "ew", "mlrs", "drone", "boat", "cruiser"];
const DEV_CODE = "6686";

const IDEOLOGY_DEFS = {
  autocracy: { name: "Автократия", buff: "перезарядка оружия -10%" },
  communism: { name: "Коммунизм", buff: "население растет быстрее" },
  democracy: { name: "Демократия", buff: "добыча золота +10%" },
  fascism: { name: "Фашизм", buff: "перезарядка оружия -15%" },
  technocracy: { name: "Технократия", buff: "заводы и железные шахты эффективнее" },
  theocracy: { name: "Теократия", buff: "спецоперации заметно успешнее" },
  anarchism: { name: "Анархизм", buff: "грабеж и спецоперации успешнее", hidden: true }
};

const SPECIAL_OP_DEFS = {
  sabotageFactory: { name: "Саботаж завода", info: "остановить неприкрытый завод", chance: 0.58 },
  sabotageAirDefense: { name: "Саботаж ПВО", info: "выключить ПВО/ПВО+ на 30 секунд", chance: 0.6 },
  destroyBunker: { name: "Уничтожение бункера", info: "снести один бункер цели", chance: 0.54 },
  stealSupplies: { name: "Тихая кража", info: "забрать немного ресурсов", chance: 0.62 },
  partisanRaid: { name: "Партизанский рейд", info: "вывести из строя часть армии", chance: 0.52 },
  jamWeapons: { name: "Глушение оружия", info: "перезарядить оружие цели", chance: 0.55 },
  scout: { name: "Разведка", info: "получить данные о стране", chance: 0.78 },
  smuggleAmmo: { name: "Контрабанда", info: "добыть боеприпасы себе", chance: 0.64 },
  anarchistLoot: { name: "Грабеж", info: "Анархисты грабят врага или нейтрала", chance: 0.68, anarchistsOnly: true }
};

const RANDOM_EVENT_DEFS = {
  rain: "Дождь",
  drought: "Засуха",
  goldRush: "Золотая лихорадка",
  fog: "Густой туман",
  epidemic: "Эпидемия",
  looter: "Праздник мародера"
};

const LOBBY_BOT_DEFS = {
  farmers: { name: "Фермеры", info: "экономика и фермы" },
  anarchists: { name: "Анархисты", info: "агрессия и грабеж" },
  mechanics: { name: "Механики", info: "заводы и техника" },
  rivermen: { name: "Рыбаки", info: "порты и вода" }
};

const LOBBY_INCOME_DEFS = [
  ["farm", "Ферма", 1],
  ["port", "Порт", 1],
  ["village", "Деревня", 1],
  ["city", "Город", 1],
  ["barracks", "Казармы", 1],
  ["factory", "Завод", 1],
  ["mineGold", "Шахта золота", 1],
  ["mineIron", "Шахта железа", 1],
  ["mineUranium", "Шахта урана", 1],
  ["minePlusGold", "Шахта+ золота", 1]
];

const els = {
  lobby: document.querySelector("#lobby"),
  game: document.querySelector("#game"),
  joinForm: document.querySelector("#joinForm"),
  countryInput: document.querySelector("#countryInput"),
  colorPalette: document.querySelector("#colorPalette"),
  ideologyPanel: document.querySelector("#ideologyPanel"),
  lobbyModeButtons: document.querySelectorAll("[data-lobby-mode]"),
  lobbyCodeField: document.querySelector("#lobbyCodeField"),
  lobbyCodeInput: document.querySelector("#lobbyCodeInput"),
  lobbySettings: document.querySelector("#lobbySettings"),
  lobbySubmit: document.querySelector("#lobbySubmit"),
  lobbyNotice: document.querySelector("#lobbyNotice"),
  connectionStatus: document.querySelector("#connectionStatus"),
  lobbyMusic: document.querySelector("#lobbyMusic"),
  lobbyThemeButton: document.querySelector("#lobbyThemeButton"),
  map: document.querySelector("#map"),
  mapMovePad: document.querySelector("#mapMovePad"),
  mapTools: document.querySelector("#mapTools"),
  gameMusic: document.querySelector("#gameMusic"),
  statsButton: document.querySelector("#statsButton"),
  quickStatus: document.querySelector("#quickStatus"),
  eventBanner: document.querySelector("#eventBanner"),
  worldEventStatus: document.querySelector("#worldEventStatus"),
  controls: document.querySelector(".controls"),
  selectionBar: document.querySelector("#selectionBar"),
  tabContent: document.querySelector("#tabContent"),
  tabs: document.querySelectorAll(".tab[data-tab]"),
  toast: document.querySelector("#toast"),
  chatOpen: document.querySelector("#chatOpen"),
  chatDrawer: document.querySelector("#chatDrawer"),
  chatClose: document.querySelector("#chatClose"),
  chatLog: document.querySelector("#chatLog"),
  chatForm: document.querySelector("#chatForm"),
  chatInput: document.querySelector("#chatInput"),
  diplomacyPrompt: document.querySelector("#diplomacyPrompt"),
  modalLayer: document.querySelector("#modalLayer"),
  statsOverlay: document.querySelector("#statsOverlay"),
  statsClose: document.querySelector("#statsClose"),
  statsOverlayContent: document.querySelector("#statsOverlayContent"),
  themeButton: document.querySelector("#themeButton"),
  developerButton: document.querySelector("#developerButton"),
  endOverlay: document.querySelector("#endOverlay"),
  endTitle: document.querySelector("#endTitle"),
  endReason: document.querySelector("#endReason"),
  continueBotsButton: document.querySelector("#continueBotsButton"),
  restartButton: document.querySelector("#restartButton")
};

let socket;
let me = null;
let spectator = false;
let lobby = null;
let state = null;
let selectedColor = null;
let selectedIdeology = "democracy";
let lobbyMode = "create";
let lobbySettings = null;
let selected = null;
let pendingMoveSelection = null;
let activeTab = "troops";
let activeActionGroup = "troops";
let pending = null;
let moveInf = 0;
let moveRpg = true;
let moveTank = true;
let moveMlrs = true;
let moveEw = false;
let moveCruiser = true;
let moveDrone = false;
let moveSaboteur = false;
let explosions = [];
let nukeSmokes = [];
let impactSmokes = [];
let shotEffects = [];
let toastTimer = null;
let eventBannerTimer = null;
let centeredHome = false;
let cooldownEnds = {};
let hqRebuildEnds = {};
let serverClockOffset = 0;
let renderQueued = false;
let renderedMapKey = "";
let renderedControlsKey = "";
let renderedChatKey = "";
let renderedQuickStatusKey = "";
let renderedWorldEventKey = "";
let renderedStatsKey = "";
let renderedChatButtonKey = "";
let renderedDiplomacyPromptKey = "";
let renderedEndOverlayKey = "";
let mapDomKey = "";
let mapLayoutKey = "";
let mapCellNodes = [];
let mapEffectLayer = null;
let moveSelectionKey = null;
let reconnectTimer = null;
let reconnectAttempts = 0;
let heartbeatTimer = null;
let serverFull = false;
let musicPlaylist = ["/music/theme.mp3"];
let musicIndex = 0;
let audioCtx = null;
let sfxUnlocked = false;
let lastExplosionSfxAt = 0;
let pendingJoinPayload = null;
let lastChatId = null;
let mapBubbles = [];
let unreadChatCount = 0;
let statsOpen = false;
let lastDisconnectNotice = "";
let mapZoom = 1;
let modalSubmitHandler = null;
let devUnlocked = false;
const activePointers = new Map();
let pinchStartDistance = 0;
let pinchStartZoom = 1;

const MAX_CLIENT_BUFFERED_BYTES = 64 * 1024;
const MASTER_SFX_VOLUME = 0.52;
const LOW_POWER_DEVICE = (navigator.hardwareConcurrency || 4) <= 4;
const MAX_EXPLOSIONS_ON_MAP = LOW_POWER_DEVICE ? 18 : 32;
const MAX_IMPACT_SMOKES_ON_MAP = LOW_POWER_DEVICE ? 20 : 40;
const MAX_NUKE_SMOKES_ON_MAP = LOW_POWER_DEVICE ? 27 : 54;
const MAX_SHOTS_ON_MAP = LOW_POWER_DEVICE ? 8 : 12;
const NUKE_SMOKE_MS = 12000;
const IMPACT_SMOKE_MS = {
  rpg: 1400,
  tank: 1500,
  rocket: 2100,
  mlrs: 2400,
  cruiser: 2100,
  drone: 1800,
  misfire: 700,
  epidemic: 0,
  intercept: 900,
  aa: 1100,
  nuke: NUKE_SMOKE_MS
};
const EXPLOSION_MS = {
  rpg: 850,
  tank: 950,
  rocket: 1200,
  mlrs: 1350,
  cruiser: 1200,
  drone: 1000,
  misfire: 650,
  epidemic: 1500,
  intercept: 700,
  aa: 850,
  nuke: 2600
};
const SHOT_EFFECT_MS = 520;
const CLIENT_TOKEN = getClientToken();

const music = new Audio();
music.loop = false;
music.preload = "none";
music.volume = 0.34;

applyTheme(loadTheme());
connect();
bindUi();
loadMusicPlaylist();
registerServiceWorker();
setInterval(updateLivePanels, 1000);

function connect() {
  if (serverFull) return;
  clearTimeout(reconnectTimer);
  const proto = location.protocol === "https:" ? "wss" : "ws";
  const nextSocket = new WebSocket(`${proto}://${location.host}?client=${encodeURIComponent(CLIENT_TOKEN)}`);
  socket = nextSocket;

  nextSocket.addEventListener("open", () => {
    if (socket !== nextSocket) return;
    reconnectAttempts = 0;
    els.connectionStatus.textContent = "Подключено";
    startHeartbeat();
    if (pendingJoinPayload) {
      send(pendingJoinPayload, { priority: true });
    }
  });

  nextSocket.addEventListener("close", () => {
    if (socket !== nextSocket) return;
    stopHeartbeat();
    if (serverFull) return;
    els.connectionStatus.textContent = "Связь потеряна, переподключение...";
    scheduleReconnect();
  });

  nextSocket.addEventListener("error", () => {
    nextSocket.close();
  });

  nextSocket.addEventListener("message", (event) => {
    try {
      handleServerMessage(JSON.parse(event.data));
    } catch (error) {
      showToast("Сервер прислал битое сообщение.");
    }
  });
}

function scheduleReconnect() {
  if (serverFull) return;
  clearTimeout(reconnectTimer);
  const delay = Math.min(5_000, 800 * 2 ** reconnectAttempts) + Math.floor(Math.random() * 250);
  reconnectAttempts += 1;
  reconnectTimer = setTimeout(connect, delay);
}

function startHeartbeat() {
  stopHeartbeat();
  heartbeatTimer = setInterval(() => {
    send({ type: "ping", at: Date.now() }, { silent: true });
  }, 15_000);
}

function stopHeartbeat() {
  clearInterval(heartbeatTimer);
  heartbeatTimer = null;
}

function bindUi() {
  els.joinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!selectedColor) {
      showToast("Выбери цвет.");
      return;
    }
    const payload = {
      type: "join",
      mode: lobbyMode,
      country: els.countryInput.value,
      color: selectedColor,
      ideology: selectedIdeology
    };
    if (lobbyMode === "enter") {
      payload.code = (els.lobbyCodeInput?.value || "").trim();
      if (!/^[0-9]{4}$/.test(payload.code)) {
        showToast("Введи 4 цифры кода лобби.");
        return;
      }
    } else {
      lobbySettings = readLobbySettings();
      payload.settings = lobbySettings;
    }
    pendingJoinPayload = payload;
    if (send(pendingJoinPayload, { priority: true })) {
      showToast(lobbyMode === "create" ? "Лобби создано, ждем второго игрока." : "Код отправлен, запускаем матч.");
    }
  });

  els.lobbyModeButtons?.forEach((button) => {
    button.addEventListener("click", () => {
      lobbyMode = button.dataset.lobbyMode || "create";
      renderLobby();
    });
  });

  els.colorPalette.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-color]");
    if (!button || button.disabled) return;
    selectedColor = button.dataset.color;
    renderLobby();
  });

  els.colorPalette.addEventListener("change", (event) => {
    if (!event.target.matches("[data-rgb-color]")) return;
    selectedColor = event.target.value;
    renderLobby();
  });

  els.ideologyPanel?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-ideology]");
    if (!button) return;
    selectedIdeology = button.dataset.ideology;
    renderLobby();
  });

  els.lobbySettings?.addEventListener("input", () => {
    lobbySettings = readLobbySettings();
  });

  els.lobbySettings?.addEventListener("change", () => {
    lobbySettings = readLobbySettings();
  });

  els.map.addEventListener("click", (event) => {
    const cellButton = event.target.closest(".cell");
    if (!cellButton) return;
    handleCellTap(Number(cellButton.dataset.x), Number(cellButton.dataset.y));
  });

  els.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activeTab = tab.dataset.tab;
      pending = null;
      renderGame();
    });
  });

  els.themeButton?.addEventListener("click", () => {
    applyTheme(currentTheme() === "dark" ? "light" : "dark");
  });
  els.lobbyThemeButton?.addEventListener("click", () => {
    applyTheme(currentTheme() === "dark" ? "light" : "dark");
  });

  els.statsButton?.addEventListener("click", () => {
    statsOpen = !statsOpen;
    renderStatsOverlay();
  });

  els.statsClose?.addEventListener("click", () => {
    statsOpen = false;
    renderStatsOverlay();
  });

  els.developerButton.addEventListener("click", openDeveloperMenu);

  els.tabContent.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-command]");
    if (!button || button.disabled) return;
    handleCommand(button.dataset.command, button.dataset.kind, button.dataset);
  });

  els.mapMovePad?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-command]");
    if (!button || button.disabled) return;
    handleCommand(button.dataset.command, button.dataset.kind, button.dataset);
  });

  els.mapTools?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-map-tool]");
    if (!button) return;
    if (button.dataset.mapTool === "zoomIn") {
      setMapZoom(mapZoom + 0.18);
    } else if (button.dataset.mapTool === "zoomOut") {
      setMapZoom(mapZoom - 0.18);
    } else if (button.dataset.mapTool === "home") {
      centerHomeOnce(true);
    }
  });

  els.tabContent.addEventListener("change", (event) => {
    if (event.target.matches("[data-move-toggle='rpg']")) {
      moveRpg = event.target.checked;
      renderGame();
    }
    if (event.target.matches("[data-move-toggle='tank']")) {
      moveTank = event.target.checked;
      renderGame();
    }
    if (event.target.matches("[data-move-toggle='mlrs']")) {
      moveMlrs = event.target.checked;
      renderGame();
    }
    if (event.target.matches("[data-move-toggle='ew']")) {
      moveEw = event.target.checked;
      renderGame();
    }
    if (event.target.matches("[data-move-toggle='cruiser']")) {
      moveCruiser = event.target.checked;
      renderGame();
    }
    if (event.target.matches("[data-move-toggle='drone']")) {
      moveDrone = event.target.checked;
      renderGame();
    }
    if (event.target.matches("[data-move-toggle='saboteur']")) {
      moveSaboteur = event.target.checked;
      renderGame();
    }
  });

  els.chatOpen.addEventListener("click", () => toggleChat());

  els.chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = els.chatInput.value.trim();
    if (!text) return;
    send({ type: "chat", text }, { priority: true });
    els.chatInput.value = "";
  });

  els.chatClose.addEventListener("click", () => {
    closeChat();
  });

  els.diplomacyPrompt.addEventListener("click", (event) => {
    const resourceButton = event.target.closest("button[data-resource-response]");
    if (resourceButton) {
      send({
        type: "resources",
        action: resourceButton.dataset.resourceResponse,
        requestId: resourceButton.dataset.requestId
      }, { priority: true });
      return;
    }

    const button = event.target.closest("button[data-diplomacy-response]");
    if (!button) return;
    send({
      type: "diplomacy",
      action: button.dataset.diplomacyResponse,
      offerId: button.dataset.offerId,
      ultimatumId: button.dataset.ultimatumId
    }, { priority: true });
  });

  els.modalLayer.addEventListener("click", handleModalClick);
  els.modalLayer.addEventListener("change", handleModalChange);

  bindMapGestures();
  els.lobbyMusic?.addEventListener("click", toggleMusic);
  els.gameMusic?.addEventListener("click", toggleMusic);
  music.addEventListener("ended", playNextMusic);
  els.continueBotsButton?.addEventListener("click", () => send({ type: "continueBots" }, { priority: true }));
  els.restartButton.addEventListener("click", () => send({ type: "restart" }, { priority: true }));
  document.addEventListener("pointerdown", unlockSfxAudio, { passive: true });
  document.addEventListener("keydown", unlockSfxAudio);
}

function handleServerMessage(message) {
  if (message.type === "full") {
    serverFull = true;
    clearTimeout(reconnectTimer);
    stopHeartbeat();
    els.connectionStatus.textContent = message.message || "Сервер заполнен.";
    showToast(message.message || "Сервер заполнен.");
    try {
      socket?.close();
    } catch (error) {}
    return;
  }

  if (message.type === "hello") {
    me = message.playerId;
    spectator = message.spectator;
    if (message.music) {
      musicPlaylist = Array.isArray(message.music) && message.music.length ? message.music : [message.music].filter(Boolean);
    }
  }

  if (message.type === "lobby") {
    lobby = message;
    if (!lobbySettings || lobby.players?.[me]?.joined) {
      lobbySettings = normalizeLobbySettings(lobby.settings);
    }
    if (lobby.created && me !== lobby.hostId && !lobby.players?.[me]?.joined) {
      lobbyMode = "enter";
    } else if (lobby.hostId === me) {
      lobbyMode = "create";
    }
    if (me && lobby.players?.[me]?.joined) {
      pendingJoinPayload = null;
    }
    state = null;
    selected = null;
    pendingMoveSelection = null;
    pending = null;
    centeredHome = false;
    moveSelectionKey = null;
    resetMapDom(true);
    renderedControlsKey = "";
    renderedChatKey = "";
    renderedQuickStatusKey = "";
    renderedWorldEventKey = "";
    renderedStatsKey = "";
    renderedChatButtonKey = "";
    renderedDiplomacyPromptKey = "";
    renderedEndOverlayKey = "";
    mapBubbles = [];
    statsOpen = false;
    nukeSmokes = [];
    impactSmokes = [];
    shotEffects = [];
    hqRebuildEnds = {};
    unreadChatCount = 0;
    closeChat();
    els.lobby.classList.remove("hidden");
    els.game.classList.add("hidden");
    renderLobby();
  }

  if (message.type === "start") {
    pendingJoinPayload = null;
    selected = null;
    pendingMoveSelection = null;
    pending = null;
    centeredHome = false;
    moveSelectionKey = null;
    resetMapDom(true);
    renderedControlsKey = "";
    renderedChatKey = "";
    renderedQuickStatusKey = "";
    renderedWorldEventKey = "";
    renderedStatsKey = "";
    renderedChatButtonKey = "";
    renderedDiplomacyPromptKey = "";
    renderedEndOverlayKey = "";
    mapBubbles = [];
    statsOpen = false;
    nukeSmokes = [];
    impactSmokes = [];
    shotEffects = [];
    hqRebuildEnds = {};
    unreadChatCount = 0;
    closeChat();
    showToast("Матч начался.");
  }

  if (message.type === "state") {
    const previousMap = state?.map || null;
    const previousChat = state?.chat || [];
    state = {
      ...message.state,
      map: message.state.map || previousMap || [],
      chat: message.state.chat || previousChat
    };
    me = message.you || me;
    spectator = message.spectator;
    serverClockOffset = Date.now() - (state.serverTime || Date.now());
    applyPendingMoveSelection();
    rememberCooldowns();
    noticeDisconnectedOpponent();
    scheduleRenderGame();
  }

  if (message.type === "moveResult" && message.to) {
    if (!selected || (message.from && selected.x === message.from.x && selected.y === message.from.y)) {
      pendingMoveSelection = {
        from: message.from ? { x: message.from.x, y: message.from.y } : null,
        to: { x: message.to.x, y: message.to.y },
        at: Date.now()
      };
    }
  }

  if (message.type === "explosions") {
    const now = Date.now();
    explosions.push(...message.explosions.map((explosion) => ({
      ...explosion,
      at: now,
      until: now + (EXPLOSION_MS[explosion.kind] || 900)
    })));
    explosions = explosions.slice(-MAX_EXPLOSIONS_ON_MAP);
    for (const explosion of message.explosions) {
      const smokeMs = IMPACT_SMOKE_MS[explosion.kind] || 1300;
      if (explosion.kind === "nuke") {
        for (let y = explosion.y - 1; y <= explosion.y + 1; y += 1) {
          for (let x = explosion.x - 1; x <= explosion.x + 1; x += 1) {
            if (x >= 0 && y >= 0 && x < (state?.width || 34) && y < (state?.height || 24)) {
              nukeSmokes.push({ id: `${explosion.id}:${x}:${y}`, x, y, at: now, until: now + NUKE_SMOKE_MS });
            }
          }
        }
      } else if (explosion.kind !== "epidemic") {
        impactSmokes.push({ id: `${explosion.id}:smoke`, x: explosion.x, y: explosion.y, kind: explosion.kind, at: now, until: now + smokeMs });
      }
    }
    nukeSmokes = nukeSmokes.slice(-MAX_NUKE_SMOKES_ON_MAP);
    impactSmokes = impactSmokes.slice(-MAX_IMPACT_SMOKES_ON_MAP);
    playExplosionBatch(message.explosions);
    renderMap();
    const cleanupDelay = Math.max(...message.explosions.map((explosion) => (
      explosion.kind === "nuke"
        ? NUKE_SMOKE_MS
        : Math.max(EXPLOSION_MS[explosion.kind] || 900, IMPACT_SMOKE_MS[explosion.kind] || 1300)
    )), 900);
    setTimeout(() => {
      renderedMapKey = "";
      renderMap();
    }, cleanupDelay + 120);
  }

  if (message.type === "sfx") {
    if (message.name === "shot") addShotEffect(message);
    playSfx(message.name, message);
  }

  if (message.type === "chat") {
    if (state) {
      state.chat = message.chat;
      state.chatVersion = message.chatVersion ?? state.chatVersion;
      showChatEffect(message.entry);
      if (els.chatDrawer.classList.contains("hidden")) {
        unreadChatCount += 1;
      } else {
        unreadChatCount = 0;
      }
      renderPanels();
      renderChat();
      updateChatButton();
      renderDiplomacyPrompt();
    }
  }

  if (message.type === "error" || message.type === "info") {
    showToast(message.message);
  }
}

function addShotEffect(detail) {
  if (!Number.isFinite(Number(detail?.x)) || !Number.isFinite(Number(detail?.y))) return;
  const now = Date.now();
  shotEffects.push({
    id: `shot:${detail.at || now}:${detail.x}:${detail.y}:${detail.weapon || ""}:${Math.random().toString(16).slice(2)}`,
    x: Number(detail.x),
    y: Number(detail.y),
    weapon: detail.weapon || "tank",
    at: now,
    until: now + SHOT_EFFECT_MS
  });
  shotEffects = shotEffects.slice(-MAX_SHOTS_ON_MAP);
  refreshMapEffects(SHOT_EFFECT_MS);
}

function refreshMapEffects(duration) {
  renderedMapKey = "";
  renderMap();
  setTimeout(() => {
    renderedMapKey = "";
    renderMap();
  }, duration + 80);
}

function applyPendingMoveSelection() {
  if (!pendingMoveSelection || !state?.map) return;
  const { from, to, at } = pendingMoveSelection;
  if (from && selected && (selected.x !== from.x || selected.y !== from.y)) {
    pendingMoveSelection = null;
    return;
  }
  const target = getCell(to.x, to.y);
  const ownUnits = target?.units?.[me] || {};
  if (target && movablePower(ownUnits) > 0) {
    selected = { x: to.x, y: to.y };
    moveSelectionKey = null;
    renderedMapKey = "";
  } else if (Date.now() - at > 1200) {
    pendingMoveSelection = null;
    return;
  } else {
    return;
  }
  pendingMoveSelection = null;
}

function send(body, options = {}) {
  if (socket?.readyState === WebSocket.OPEN) {
    if (!options.silent && socket.bufferedAmount > MAX_CLIENT_BUFFERED_BYTES) {
      if (!options.priority) {
        showToast("Связь забита, команда не отправлена. Туннель опять изображает модем.");
        return false;
      }
      showToast("Команда отправлена, но канал забит. Возможна задержка.");
    }
    socket.send(JSON.stringify(body));
    return true;
  }
  if (!options.silent) {
    showToast("Связь потеряна, ждем переподключение.");
  }
  return false;
}

function getClientToken() {
  const key = "paperWarsClientToken";
  try {
    let token = localStorage.getItem(key);
    if (!token) {
      token = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      localStorage.setItem(key, token);
    }
    return token;
  } catch (error) {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

function renderLobby() {
  if (!lobby) return;
  const taken = new Set(Object.values(lobby.players).filter(Boolean).filter((player) => player.joined && player.color).map((player) => player.color));
  const myLobbyPlayer = lobby.players?.[me];

  if (!selectedColor) {
    const freeColor = lobby.colors.find((color) => !taken.has(color.id));
    selectedColor = freeColor?.id || "#6b7280";
  }
  if (myLobbyPlayer?.joined && myLobbyPlayer.color) {
    selectedColor = myLobbyPlayer.color;
  }

  els.colorPalette.innerHTML = "";
  for (const color of lobby.colors) {
    const mine = lobby.players[me]?.color === color.id;
    const disabled = taken.has(color.id) && !mine;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `color-choice ${selectedColor === color.id ? "is-selected" : ""}`;
    button.dataset.color = color.id;
    button.disabled = disabled;
    button.title = color.name;
    button.style.setProperty("--swatch", color.value);
    els.colorPalette.append(button);
  }
  const rgbValue = /^#[0-9a-fA-F]{6}$/.test(selectedColor)
    ? selectedColor
    : (lobby.colors.find((color) => color.id === selectedColor)?.value || "#6b7280");
  const rgb = document.createElement("label");
  rgb.className = "rgb-picker";
  rgb.innerHTML = `<span>RGB</span><input data-rgb-color type="color" value="${escapeHtml(rgbValue)}">`;
  els.colorPalette.append(rgb);

  if (!IDEOLOGY_DEFS[selectedIdeology]) selectedIdeology = "democracy";
  if (myLobbyPlayer?.joined && myLobbyPlayer.ideology) selectedIdeology = myLobbyPlayer.ideology;
  if (els.ideologyPanel) {
    els.ideologyPanel.innerHTML = `
      <div class="ideology-note">Подумай хорошо: выбор на всю игру.</div>
      <div class="ideology-grid">
        ${Object.entries(IDEOLOGY_DEFS).filter(([, ideology]) => !ideology.hidden).map(([id, ideology]) => `
          <button class="ideology-choice ${selectedIdeology === id ? "is-selected" : ""}" data-ideology="${id}" type="button">
            <strong>${escapeHtml(ideology.name)}</strong>
            <span class="ideology-buff">${escapeHtml(ideology.buff)}</span>
          </button>
        `).join("")}
      </div>
    `;
  }

  renderLobbyMode();
  renderLobbySettings();
  renderLobbyNotice();
}

function renderLobbyMode() {
  els.lobbyModeButtons?.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lobbyMode === lobbyMode);
  });
  els.lobbyCodeField?.classList.toggle("hidden", lobbyMode !== "enter");
  els.lobbySettings?.classList.toggle("hidden", lobbyMode !== "create");
  if (els.lobbySubmit) {
    els.lobbySubmit.textContent = lobbyMode === "enter"
      ? "Войти и начать"
      : (lobby?.created && lobby.hostId === me ? "Обновить лобби" : "Создать лобби");
  }
}

function renderLobbySettings() {
  if (!els.lobbySettings) return;
  const settings = currentLobbySettings();
  els.lobbySettings.innerHTML = `
    <div class="lobby-settings__section">
      <strong>Боты на карте</strong>
      <div class="lobby-checks">
        ${Object.entries(LOBBY_BOT_DEFS).map(([id, bot]) => `
          <label class="lobby-check">
            <input data-lobby-bot="${escapeHtml(id)}" type="checkbox" ${settings.bots[id] !== false ? "checked" : ""}>
            <span>${escapeHtml(bot.name)}</span>
            <em>${escapeHtml(bot.info)}</em>
          </label>
        `).join("")}
      </div>
    </div>
    <div class="lobby-settings__section">
      <strong>Правила</strong>
      <label class="lobby-check lobby-check--wide">
        <input data-random-events type="checkbox" ${settings.randomEvents !== false ? "checked" : ""}>
        <span>Случайные события</span>
        <em>дождь, засуха, туман и другие события по таймеру</em>
      </label>
    </div>
    <div class="lobby-settings__section">
      <strong>Коэффициенты дохода</strong>
      <div class="income-settings">
        ${LOBBY_INCOME_DEFS.map(([key, label, fallback]) => `
          <label class="income-setting">
            <span>${escapeHtml(label)}</span>
            <input data-income-key="${escapeHtml(key)}" type="number" min="0" max="5" step="0.1" value="${fmtLobbyNumber(settings.incomeMultipliers[key] ?? fallback)}">
          </label>
        `).join("")}
      </div>
    </div>
  `;
}

function renderLobbyNotice() {
  if (!els.lobbyNotice) return;
  const myPlayer = lobby.players?.[me];
  if (lobby.created && lobby.hostId === me && lobby.code) {
    els.lobbyNotice.innerHTML = `<strong>Код лобби: ${escapeHtml(lobby.code)}</strong><span>Передай этот код второму игроку. Матч стартует после входа.</span>`;
    return;
  }
  if (lobby.created && !myPlayer?.joined) {
    els.lobbyNotice.innerHTML = `<strong>Лобби уже создано</strong><span>Нажми «Войти» и введи код от создателя.</span>`;
    return;
  }
  if (myPlayer?.joined) {
    els.lobbyNotice.innerHTML = `<strong>Готово</strong><span>Ожидаем второго игрока.</span>`;
    return;
  }
  els.lobbyNotice.innerHTML = `<strong>Создай матч</strong><span>Настройки уже заполнены стандартными значениями.</span>`;
}

function currentLobbySettings() {
  if (!lobbySettings) lobbySettings = normalizeLobbySettings(lobby?.settings);
  return lobbySettings;
}

function normalizeLobbySettings(raw = {}) {
  raw = raw || {};
  const settings = {
    bots: {},
    randomEvents: raw.randomEvents !== false,
    incomeMultipliers: {}
  };
  for (const id of Object.keys(LOBBY_BOT_DEFS)) {
    settings.bots[id] = raw.bots?.[id] !== false;
  }
  for (const [key, , fallback] of LOBBY_INCOME_DEFS) {
    const value = Number(raw.incomeMultipliers?.[key]);
    settings.incomeMultipliers[key] = Number.isFinite(value) ? clamp(Math.round(value * 10) / 10, 0, 5) : fallback;
  }
  return settings;
}

function readLobbySettings() {
  const settings = normalizeLobbySettings(lobbySettings || lobby?.settings);
  els.lobbySettings?.querySelectorAll("[data-lobby-bot]").forEach((input) => {
    settings.bots[input.dataset.lobbyBot] = input.checked;
  });
  const randomEvents = els.lobbySettings?.querySelector("[data-random-events]");
  if (randomEvents) settings.randomEvents = randomEvents.checked;
  els.lobbySettings?.querySelectorAll("[data-income-key]").forEach((input) => {
    const value = Number(input.value);
    settings.incomeMultipliers[input.dataset.incomeKey] = Number.isFinite(value) ? clamp(Math.round(value * 10) / 10, 0, 5) : 1;
  });
  return settings;
}

function fmtLobbyNumber(value) {
  return Number.isInteger(value) ? String(value) : String(Number(value).toFixed(1));
}

function scheduleRenderGame() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    renderGame();
  });
}

function renderGame() {
  if (!state || state.status === "lobby") return;
  els.lobby.classList.add("hidden");
  els.game.classList.remove("hidden");
  renderMap();
  renderWorldEventStatus();
  renderPanels();
  renderMapMovePad();
  renderControls();
  renderStatsOverlay();
  renderChat();
  updateChatButton();
  renderDiplomacyPrompt();
  renderEndOverlay();
  centerHomeOnce();
}

function renderWorldEventStatus() {
  if (!els.worldEventStatus || !state) return;
  const event = state.activeEvent || state.pendingEvent;
  if (!event) {
    if (renderedWorldEventKey !== "hidden") {
      els.worldEventStatus.classList.add("hidden");
      els.worldEventStatus.innerHTML = "";
      renderedWorldEventKey = "hidden";
    }
    return;
  }
  const pendingEvent = Boolean(state.pendingEvent && !state.activeEvent);
  const targetAt = pendingEvent ? event.startsAt : event.endsAt;
  const seconds = targetAt ? Math.ceil((targetAt - serverNow()) / 1000) : (pendingEvent ? event.startsIn : event.endsIn);
  const nextKey = `${event.type}:${event.label}:${pendingEvent ? 1 : 0}:${Math.max(0, seconds || 0)}`;
  if (nextKey === renderedWorldEventKey) return;
  renderedWorldEventKey = nextKey;
  els.worldEventStatus.classList.remove("hidden");
  els.worldEventStatus.className = `world-event world-event--${event.type}${pendingEvent ? " is-warning" : ""}`;
  els.worldEventStatus.innerHTML = `
    <strong>${pendingEvent ? "Внимание приближается" : "Событие"}: ${escapeHtml(event.label)}</strong>
    <span>${Math.max(0, seconds || 0)}с</span>
  `;
}

function renderMap() {
  if (!state) return;
  const width = state.width || 34;
  const height = state.height || 24;
  updateMapLayout(width, height);

  const now = Date.now();
  explosions = explosions.filter((explosion) => explosion.until > now);
  nukeSmokes = nukeSmokes.filter((smoke) => smoke.until > now);
  impactSmokes = impactSmokes.filter((smoke) => smoke.until > now);
  shotEffects = shotEffects.filter((effect) => effect.until > now);
  mapBubbles = mapBubbles.filter((bubble) => bubble.until > now);
  els.map.classList.toggle("has-nuke-shock", explosions.some((explosion) => explosion.kind === "nuke"));
  const activeEvent = state.activeEvent?.type || "";
  for (const type of ["rain", "drought", "goldRush", "fog", "epidemic", "looter"]) {
    els.map.classList.toggle(`event-${type}`, activeEvent === type);
  }

  const renderKey = getMapRenderKey();
  if (renderKey === renderedMapKey) return;
  renderedMapKey = renderKey;
  ensureMapDom(width, height);

  const boomByCell = new Set(explosions.map((explosion) => `${explosion.x}:${explosion.y}`));
  const smokeByCell = new Set(nukeSmokes.map((smoke) => `${smoke.x}:${smoke.y}`));
  const highlights = getTargetHighlights();
  const fogActive = activeEvent === "fog" && !spectator;
  const visibleFogCells = fogActive ? fogVisibleCells() : null;

  let index = 0;
  for (const row of state.map) {
    for (const cell of row) {
      updateMapCell(mapCellNodes[index], cell, {
        now,
        visibleFogCells,
        boomByCell,
        smokeByCell,
        highlights
      });
      index += 1;
    }
  }
  renderEffectLayer(now, width, height);
}

function updateMapLayout(width, height) {
  const nextKey = `${width}:${height}:${mapZoom.toFixed(2)}`;
  if (nextKey === mapLayoutKey) return;
  mapLayoutKey = nextKey;
  els.map.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
  els.map.style.gridTemplateRows = `repeat(${height}, 1fr)`;
  els.map.style.aspectRatio = `${width} / ${height}`;
  els.map.style.setProperty("--map-zoom", mapZoom.toFixed(2));
}

function ensureMapDom(width, height) {
  const nextKey = `${width}:${height}`;
  const expected = width * height;
  if (mapDomKey === nextKey && mapCellNodes.length === expected && mapEffectLayer) return;

  mapDomKey = nextKey;
  mapCellNodes = [];
  mapEffectLayer = null;
  const fragment = document.createDocumentFragment();
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "cell";
      button.dataset.x = String(x);
      button.dataset.y = String(y);
      button.dataset.key = `${x}-${y}`;

      const building = document.createElement("span");
      building.className = "building";
      const construction = document.createElement("span");
      construction.className = "construction";
      const units = document.createElement("span");
      units.className = "units";
      button.append(building, construction, units);
      fragment.append(button);
      mapCellNodes.push({ button, building, construction, units, bubble: null, renderKey: "" });
    }
  }

  mapEffectLayer = document.createElement("div");
  mapEffectLayer.className = "map-effects";
  fragment.append(mapEffectLayer);
  els.map.replaceChildren(fragment);
}

function updateMapCell(entry, cell, context) {
  if (!entry || !cell) return;
  const { button, building, construction, units } = entry;
  const owner = cell.owner ? state.players[cell.owner] : null;
  const key = cellKey(cell);
  const visible = !context.visibleFogCells || context.visibleFogCells.has(key);
  const hasBoom = context.boomByCell.has(`${cell.x}:${cell.y}`);
  const hasSmoke = context.smokeByCell.has(`${cell.x}:${cell.y}`);
  const bubble = mapBubbleForCell(cell, context.now);
  const revealedSaboteur = visible && hasRevealedHostileSaboteur(cell);
  const className = [
    "cell",
    `terrain-${cell.terrain}`,
    cell.owner ? "is-owned" : "",
    bubble ? "has-bubble" : "",
    cell.building?.type === "bridge" ? "has-bridge" : "",
    cell.construction ? "has-construction" : "",
    revealedSaboteur ? "has-revealed-saboteur" : "",
    hasBoom ? "has-boom" : "",
    hasSmoke ? "has-nuke-smoke" : "",
    !visible ? "is-fogged" : "",
    context.highlights.move.has(key) ? "is-move-target" : "",
    context.highlights.attack.has(key) ? "is-attack-target" : "",
    selected?.x === cell.x && selected?.y === cell.y ? "is-selected" : "",
    pending && pending.x === cell.x && pending.y === cell.y ? "is-pending" : ""
  ].filter(Boolean).join(" ");
  const borderOwner = owner?.vassalOf ? state.players[owner.vassalOf] : owner;
  const ownerColor = owner?.colorValue || "";
  const borderColor = borderOwner?.colorValue || ownerColor;
  const edges = owner ? ownerEdges(cell) : null;
  const edgeKey = edges ? `${edges.n ? 1 : 0}${edges.e ? 1 : 0}${edges.s ? 1 : 0}${edges.w ? 1 : 0}` : "";
  const buildingText = visible ? buildingMark(cell) : "";
  const constructionText = visible ? constructionMark(cell) : "";
  const unitsText = visible ? compactUnitsText(cell) : "";
  const title = visible ? cellTooltip(cell) : "Густой туман";
  const bubbleKey = bubble ? `${bubble.id}:${bubble.text}` : "";
  const nextRenderKey = [className, ownerColor, borderColor, edgeKey, buildingText, constructionText, unitsText, title, bubbleKey].join("|");
  if (entry.renderKey === nextRenderKey) return;
  entry.renderKey = nextRenderKey;
  button.className = className;

  if (owner) {
    button.style.setProperty("--owner-color", ownerColor);
    button.style.setProperty("--border-color", borderColor);
    applyOwnerEdges(button, cell, edges);
  } else {
    clearOwnerStyles(button);
  }

  building.textContent = buildingText;
  if (construction) construction.textContent = constructionText;
  units.textContent = unitsText;
  button.title = title;

  if (bubble) {
    if (!entry.bubble) {
      entry.bubble = document.createElement("span");
      entry.bubble.className = "map-chat-bubble";
      button.append(entry.bubble);
    }
    entry.bubble.textContent = bubble.text;
  } else if (entry.bubble) {
    entry.bubble.remove();
    entry.bubble = null;
  }
}

function renderEffectLayer(now, width, height) {
  if (!mapEffectLayer) return;
  const fragment = document.createDocumentFragment();
  appendMapEffects(fragment, now, width, height);
  mapEffectLayer.replaceChildren(fragment);
}

function resetMapDom(clearDom = false) {
  renderedMapKey = "";
  mapDomKey = "";
  mapLayoutKey = "";
  mapCellNodes = [];
  mapEffectLayer = null;
  if (clearDom) els.map.replaceChildren();
}

function appendMapEffects(layer, now, width = state?.width || 34, height = state?.height || 24) {
  for (const smoke of nukeSmokes) {
    const node = document.createElement("span");
    node.className = "map-smoke map-smoke--nuke";
    setCellRect(node, smoke.x, smoke.y, width, height);
    setEffectTiming(node, smoke, NUKE_SMOKE_MS, now);
    layer.append(node);
  }

  for (const smoke of impactSmokes) {
    const node = document.createElement("span");
    node.className = `map-smoke map-smoke--impact map-smoke--${smoke.kind || "small"}`;
    setCellCenter(node, smoke.x, smoke.y, width, height, smokeScale(smoke.kind));
    setEffectTiming(node, smoke, IMPACT_SMOKE_MS[smoke.kind] || 1400, now);
    layer.append(node);
  }

  for (const explosion of explosions) {
    const node = document.createElement("span");
    node.className = `map-boom map-boom--${explosion.kind || "hit"}`;
    setCellCenter(node, explosion.x, explosion.y, width, height, explosionScale(explosion.kind));
    setEffectTiming(node, explosion, EXPLOSION_MS[explosion.kind] || 900, now);
    layer.append(node);
  }

  for (const shot of shotEffects) {
    const node = document.createElement("span");
    node.className = `shot-flash shot-flash--${shot.weapon || "tank"}`;
    setCellCenter(node, shot.x, shot.y, width, height, shot.weapon === "mlrs" || shot.weapon === "cruiser" ? 1.45 : 1.2);
    setEffectTiming(node, shot, SHOT_EFFECT_MS, now);
    layer.append(node);
  }
}

function setCellRect(node, x, y, width, height) {
  node.style.left = `${(x / width) * 100}%`;
  node.style.top = `${(y / height) * 100}%`;
  node.style.width = `${100 / width}%`;
  node.style.height = `${100 / height}%`;
}

function setCellCenter(node, x, y, width, height, scale = 1) {
  node.style.left = `${((x + 0.5) / width) * 100}%`;
  node.style.top = `${((y + 0.5) / height) * 100}%`;
  node.style.width = `${(100 / width) * scale}%`;
  node.style.height = `${(100 / height) * scale}%`;
}

function setEffectTiming(node, effect, duration, now) {
  const age = Math.max(0, now - (effect.at || now));
  node.style.setProperty("--effect-duration", `${duration}ms`);
  node.style.animationDelay = `-${Math.min(age, duration)}ms`;
}

function explosionScale(kind) {
  return { nuke: 11.5, rocket: 3.1, mlrs: 1.45, cruiser: 1.55, tank: 1.8, epidemic: 1.45, misfire: 1.2, aa: 1.5, intercept: 1.4 }[kind] || 1.6;
}

function smokeScale(kind) {
  return { rocket: 3.2, mlrs: 1.75, cruiser: 1.85, tank: 2.0, drone: 1.7, aa: 1.8, intercept: 1.8 }[kind] || 1.9;
}

function applyOwnerEdges(button, cell, edges = null) {
  const edgeSize = "3px";
  const resolvedEdges = edges || ownerEdges(cell);
  for (const [edge, active] of Object.entries(resolvedEdges)) {
    button.style.setProperty(`--edge-${edge}`, active ? edgeSize : "0px");
  }
}

function ownerEdges(cell) {
  return {
    n: ownerAt(cell.x, cell.y - 1) !== cell.owner,
    e: ownerAt(cell.x + 1, cell.y) !== cell.owner,
    s: ownerAt(cell.x, cell.y + 1) !== cell.owner,
    w: ownerAt(cell.x - 1, cell.y) !== cell.owner
  };
}

function clearOwnerStyles(button) {
  button.style.removeProperty("--owner-color");
  button.style.removeProperty("--border-color");
  button.style.setProperty("--edge-n", "0px");
  button.style.setProperty("--edge-e", "0px");
  button.style.setProperty("--edge-s", "0px");
  button.style.setProperty("--edge-w", "0px");
}

function ownerAt(x, y) {
  return state?.map?.[y]?.[x]?.owner || null;
}

function fogVisibleCells() {
  const visible = new Set();
  if (!state?.map || !me) return visible;
  for (const row of state.map) {
    for (const cell of row) {
      if (!controlsCell(cell)) continue;
      visible.add(cellKey(cell));
      for (const [x, y] of adjacentCoords(cell.x, cell.y)) {
        visible.add(`${x}:${y}`);
      }
    }
  }
  return visible;
}

function mapBubbleForCell(cell, now = Date.now()) {
  if (cell.building?.type !== "hq") return null;
  const playerId = cell.building.originalOwner || cell.building.owner || cell.owner;
  for (let i = mapBubbles.length - 1; i >= 0; i -= 1) {
    const bubble = mapBubbles[i];
    if (bubble.playerId === playerId && bubble.until > now) return bubble;
  }
  return null;
}

function getMapRenderKey() {
  const selectedKey = selected ? `${selected.x}:${selected.y}` : "";
  const pendingKey = pending ? `${pending.action}:${pending.x ?? ""}:${pending.y ?? ""}` : "";
  const actionKey = activeTab === "actions" || pending ? `${activeTab}:${moveInf}:${moveRpg ? 1 : 0}:${moveTank ? 1 : 0}:${moveMlrs ? 1 : 0}:${moveEw ? 1 : 0}:${moveCruiser ? 1 : 0}:${moveDrone ? 1 : 0}:${moveSaboteur ? 1 : 0}` : "";
  const explosionKey = explosions.map((explosion) => `${explosion.id}:${explosion.until}`).join("|");
  const smokeKey = nukeSmokes.map((smoke) => `${smoke.id}:${smoke.until}`).join("|");
  const impactSmokeKey = impactSmokes.map((smoke) => `${smoke.id}:${smoke.until}`).join("|");
  const shotEffectKey = shotEffects.map((effect) => `${effect.id}:${effect.until}`).join("|");
  const bubbleKey = mapBubbles.map((bubble) => `${bubble.id}:${bubble.until}`).join("|");
  const eventKey = `${state.activeEvent?.type || ""}:${state.pendingEvent?.type || ""}`;
  return [
    state.mapVersion ?? state.serverTime ?? 0,
    me || "",
    selectedKey,
    pendingKey,
    actionKey,
    explosionKey,
    smokeKey,
    impactSmokeKey,
    shotEffectKey,
    bubbleKey,
    eventKey
  ].join(";");
}

function getTargetHighlights() {
  const highlights = { move: new Set(), attack: new Set() };
  if (!state || spectator || state.status !== "running") return highlights;

  if (pending?.action === "move") {
    addMoveTargets(getCell(pending.x, pending.y), highlights.move);
  } else if (!pending) {
    const selectedCell = selected ? getCell(selected.x, selected.y) : null;
    if ((controlsCell(selectedCell) || (selectedCell?.terrain === "water" && hasOwnVessel(selectedCell)) || (selectedCell?.units?.[me]?.drone || 0) > 0 || (selectedCell?.units?.[me]?.saboteur || 0) > 0) && movablePower(selectedCell.units?.[me] || {}) > 0) {
      addMoveTargets(selectedCell, highlights.move);
    }
  }

  if (pending?.action === "rpg" || pending?.action === "tank" || pending?.action === "rocket" || pending?.action === "mlrs" || pending?.action === "cruiser") {
    addAttackTargets(getCell(pending.x, pending.y), pending.action, highlights.attack);
  }

  if (pending?.action === "nuke") {
    for (const row of state.map) {
      for (const cell of row) {
        highlights.attack.add(cellKey(cell));
      }
    }
  }

  return highlights;
}

function addMoveTargets(source, targets) {
  if (!source) return;
  const ownUnits = source.units?.[me] || {};
  if (!canMoveFromCell(source, ownUnits)) return;
  const request = moveRequest(source, ownUnits);
  if (request.power <= 0) return;
  if ((state.players[me]?.resources?.ammo || 0) < request.ammoCost) return;

  for (const [x, y] of adjacentCoords(source.x, source.y)) {
    const target = getCell(x, y);
    if (canMoveInto(target, source, request)) {
      targets.add(cellKey(target));
    }
  }
}

function canMoveFromCell(cell, ownUnits = cell?.units?.[me] || {}) {
  return Boolean(cell
    && (controlsCell(cell) || (cell.terrain === "water" && hasOwnVessel(cell)) || (ownUnits.drone || 0) > 0 || (ownUnits.saboteur || 0) > 0)
    && movablePower(ownUnits) > 0);
}

function addAttackTargets(source, action, targets) {
  if (!source) return;
  const units = source.units?.[me] || {};
  const sourceOk = action === "cruiser"
    ? source.terrain === "water" && (units.cruiser || 0) > 0
    : controlsCell(source);
  if (!sourceOk) return;
  const range = action === "tank" || action === "rpg" ? 1 : action === "rocket" ? 5 : action === "cruiser" ? 3 : 4;
  const unit = action === "tank" ? "tank" : action === "rpg" ? "rpg" : action === "rocket" ? "rocket" : action === "cruiser" ? "cruiser" : "mlrs";
  if ((units[unit] || 0) < 1) return;
  if (!cellWeaponCooldownReady(source, me, unit)) return;

  for (const row of state.map) {
    for (const cell of row) {
      const dist = action === "tank" || action === "rpg"
        ? Math.abs(source.x - cell.x) + Math.abs(source.y - cell.y)
        : distanceCells(source, cell);
      if (dist > 0 && dist <= range && (action !== "cruiser" || source.x === cell.x || source.y === cell.y)) {
        targets.add(cellKey(cell));
      }
    }
  }
}

function moveRequest(source, ownUnits) {
  const inf = defaultMoveInf(ownUnits);
  const tank = moveTank && (ownUnits.tank || 0) > 0;
  const mlrs = moveMlrs && (ownUnits.mlrs || 0) > 0;
  const cruiser = moveCruiser && source?.terrain === "water" && (ownUnits.cruiser || 0) > 0;
  const drone = moveDrone && (ownUnits.drone || 0) > 0 ? (ownUnits.drone || 0) : 0;
  const saboteur = moveSaboteur && (ownUnits.saboteur || 0) > 0 ? (ownUnits.saboteur || 0) : 0;
  const rpgBlockedByCovert = (drone || saboteur) && inf <= 0 && !tank && !mlrs && !cruiser;
  const rpg = moveRpg && !rpgBlockedByCovert ? Math.min(ownUnits.rpg || 0, 1) : 0;
  const ewEscort = inf + rpg + (tank ? 1 : 0) + (mlrs ? 1 : 0);
  const ew = moveEw && (ownUnits.ew || 0) > 0 && ewEscort > 0 ? 1 : 0;
  const boat = source?.terrain === "water" && (ownUnits.boat || 0) > 0;
  return {
    inf,
    rpg,
    tank,
    mlrs,
    ew,
    drone,
    saboteur,
    boat,
    cruiser,
    power: inf + rpg + (tank ? 1 : 0) + (mlrs ? 1 : 0) + ew + drone + saboteur + (boat ? 1 : 0) + (cruiser ? 1 : 0),
    ammoCost: inf + rpg + (tank ? 2 : 0) + (mlrs ? 2 : 0) + ew + drone + saboteur + (boat || cruiser ? 1 : 0)
  };
}

function canMoveInto(target, source, request) {
  if (!target) return false;
  const rawWater = target.terrain === "water" && target.building?.type !== "bridge";
  if (rawWater) {
    if (request.saboteur) return false;
    if (request.ew) return false;
    if (hasHostileCruiser(target) && (request.boat || request.cruiser || !request.drone)) return false;
    if (!request.drone && !request.boat && !request.cruiser && !hasOwnVessel(target)) return false;
  } else if (source?.terrain === "water" && hasOwnVessel(source) && !request.drone && !request.saboteur) {
    if (request.inf + request.rpg <= 0) return false;
    if (!isPassableCell(target)) return false;
  } else if (!isPassableCell(target)) {
    return false;
  }
  if (target.owner && target.owner !== me && relationStatus(target.owner) !== "war" && !controlsOwner(target.owner)) return false;
  const targetOwnUnits = target.units?.[me] || {};
  if (request.rpg && targetOwnUnits.rpg) return false;
  if (request.tank && targetOwnUnits.tank) return false;
  if (request.mlrs && targetOwnUnits.mlrs) return false;
  if (request.ew && targetOwnUnits.ew) return false;
  if (request.boat && targetOwnUnits.boat) return false;
  if (request.cruiser && targetOwnUnits.cruiser) return false;
  return true;
}

function renderPanels() {
  updateTopButtons();
  renderQuickStatus();
}

function renderQuickStatus() {
  if (!els.quickStatus || !state || !me) return;
  const player = state.players?.[me];
  if (!player || spectator) {
    els.quickStatus.classList.add("hidden");
    if (renderedQuickStatusKey !== "hidden") {
      els.quickStatus.innerHTML = "";
      renderedQuickStatusKey = "hidden";
    }
    return;
  }
  const res = player.resources || {};
  const cooldownHtml = selectedWeaponCooldowns(player.id);
  const nextKey = [
    res.gold || 0,
    res.iron || 0,
    res.pop || 0,
    res.ammo || 0,
    player.ammoCapacity || 20,
    res.uranium || 0,
    player.hqLost ? 1 : 0,
    hqStatusText(player),
    cooldownHtml
  ].join("|");
  if (nextKey === renderedQuickStatusKey) return;
  renderedQuickStatusKey = nextKey;
  els.quickStatus.classList.remove("hidden");
  els.quickStatus.innerHTML = `
    <div class="quick-status__resources">
      <span>💰${fmt(res.gold || 0)}</span>
      <span>⚙️${fmt(res.iron || 0)}</span>
      <span>👤${fmt(res.pop || 0)}</span>
      <span>💣${fmt(res.ammo || 0)}/${fmt(player.ammoCapacity || 20)}</span>
      <span>☢${fmt(res.uranium || 0)}</span>
    </div>
    <div class="quick-status__line ${player.hqLost ? "hq-bad" : ""}">★ ${hqStatusText(player)}</div>
    <div class="quick-status__cooldowns">${cooldownHtml}</div>
  `;
}

function hqStatusText(player) {
  if (player.hqDestroyed) return `HQ ${liveHqRebuild(player.id, player.hqRebuild)}s`;
  if (player.hqLost) return "HQ -";
  return "HQ +";
}

function selectedWeaponCooldowns(playerId) {
  const cell = selected ? getCell(selected.x, selected.y) : null;
  if (!cell || cell.owner !== playerId) {
    return "<div>орудия: по клеткам</div>";
  }

  const units = cell.units?.[playerId] || {};
  const rows = [];
  if (units.rpg) rows.push(`<div>РПГ ${liveCellCooldown(cell, playerId, "rpg")}s</div>`);
  if (units.tank) rows.push(`<div>танк ${liveCellCooldown(cell, playerId, "tank")}s</div>`);
  if (units.rocket) rows.push(`<div>ракета ${liveCellCooldown(cell, playerId, "rocket")}s</div>`);
  if (units.mlrs) rows.push(`<div>РСЗО ${liveCellCooldown(cell, playerId, "mlrs")}s</div>`);
  if (units.cruiser) rows.push(`<div>крейсер ${liveCellCooldown(cell, playerId, "cruiser")}s</div>`);
  return rows.join("") || "<div>орудий нет</div>";
}

function renderControls() {
  if (!state) return;
  els.tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.tab === activeTab));
  renderSelection();
  const controlsKey = getControlsRenderKey();
  if (controlsKey === renderedControlsKey) return;
  renderedControlsKey = controlsKey;

  if (state.status === "ended") {
    els.tabContent.innerHTML = `<div class="command-grid"><button class="command" data-command="restart" type="button">↻<span>новое лобби</span></button></div>`;
    return;
  }

  if (spectator) {
    els.tabContent.innerHTML = `<div class="selection-bar">Режим зрителя</div>`;
    return;
  }

  if (activeTab === "troops") renderTroopsTab();
  if (activeTab === "buildings") renderBuildingsTab();
  if (activeTab === "actions") renderActionsTab();
}

function getControlsRenderKey() {
  const cell = selected ? getCell(selected.x, selected.y) : null;
  const ownUnits = cell?.units?.[me] || {};
  const player = state?.players?.[me] || {};
  const resources = player.resources || {};
  const cooldowns = player.cooldowns || {};
  const vassals = myVassals().map((item) => item.id).join(",");
  const hasTck = hasOwnBuilding("tck") ? 1 : 0;
  const cellPart = cell
    ? [
        cell.x, cell.y, cell.owner || "", cell.terrain,
        cell.building?.type || "", cell.building?.owner || "",
        cell.construction ? `${cell.construction.type}:${cell.construction.kind}:${cell.construction.owner}:${cell.construction.remaining || 0}` : "",
        Object.entries(ownUnits).filter(([, value]) => value).map(([key, value]) => `${key}:${value}`).join(",")
      ].join(":")
    : "";
  return [
    state.status,
    spectator ? 1 : 0,
    activeTab,
    activeActionGroup,
    pending ? `${pending.action}:${pending.x ?? ""}:${pending.y ?? ""}` : "",
    cellPart,
    moveInf,
    moveRpg ? 1 : 0,
    moveTank ? 1 : 0,
    moveMlrs ? 1 : 0,
    moveEw ? 1 : 0,
    moveCruiser ? 1 : 0,
    moveDrone ? 1 : 0,
    moveSaboteur ? 1 : 0,
    player.vassalOf || "",
    player.mobilization ? 1 : 0,
    vassals,
    resources.gold || 0,
    resources.iron || 0,
    resources.pop || 0,
    resources.ammo || 0,
    resources.uranium || 0,
    cooldowns.nuke || 0,
    cooldowns.saboteur || 0,
    player.specialOpCooldown || 0,
    hasTck
  ].join("|");
}

function renderSelection() {
  const cell = selected ? getCell(selected.x, selected.y) : null;
  if (!cell) {
    els.selectionBar.textContent = pending ? pendingLabel() : "Выбери клетку";
    return;
  }
  const owner = state.players[cell.owner]?.country || "нейтр.";
  const building = cell.building ? ` · ${buildingIcon(cell)}` : "";
  const construction = cell.construction ? ` · стройка ${cell.construction.remaining || 0}с` : "";
  const own = formatUnits(cell.units[me] || {});
  const enemy = formatOtherUnits(cell);
  els.selectionBar.textContent = pending
    ? pendingLabel()
    : `${cell.x + 1}:${cell.y + 1} · ${TERRAIN_NAMES[cell.terrain]} · ${owner}${building}${construction}${own ? ` · ${own}` : ""}${enemy ? ` · чужие ${enemy}` : ""}`;
}

function renderMapMovePad() {
  if (!els.mapMovePad || !state) return;
  const cell = selected ? getCell(selected.x, selected.y) : null;
  const ownUnits = cell?.units?.[me] || {};
  if (cell) syncMoveOptions(cell, ownUnits);
  const canMove = state.status === "running" && !spectator && canMoveFromCell(cell, ownUnits);
  els.mapMovePad.classList.toggle("hidden", !canMove);
  if (!canMove) return;
  els.mapMovePad.querySelectorAll("button[data-command='moveDir']").forEach((button) => {
    button.disabled = Boolean(pendingMoveSelection);
  });
}

function renderTroopsTab() {
  const buttons = Object.entries(UNIT_DEFS).map(([kind, unit]) => {
    const command = kind === "nuke" ? "nuke" : "hire";
    return commandButton(command, kind, unit.name, unit.cost);
  }).join("");
  els.tabContent.innerHTML = `<div class="command-grid">${buttons}</div>`;
}

function renderBuildingsTab() {
  const buttons = Object.entries(BUILDING_DEFS).map(([kind, building]) => (
    commandButton("build", kind, `${building.icon} ${building.name}`, `${building.cost} · 3с`)
  )).join("");
  els.tabContent.innerHTML = `<div class="command-grid">${buttons}</div>`;
}

function renderActionsTab() {
  const cell = selected ? getCell(selected.x, selected.y) : null;
  const ownUnits = cell?.units?.[me] || {};
  syncMoveOptions(cell, ownUnits);
  const vassal = isMyCountryVassal();
  const hasVassals = myVassals().length > 0;
  const mobilizationOn = Boolean(state?.players?.[me]?.mobilization);
  const groupButtons = `
    <div class="action-groups">
      ${actionGroupButton("troops", "⚔ Войска")}
      ${actionGroupButton("diplomacy", "🤝 Дипломатия")}
      ${actionGroupButton("buildings", "🏗 Постройки")}
    </div>
  `;
  const actionContent = activeActionGroup === "diplomacy"
    ? actionsDiplomacyHtml({ vassal, hasVassals })
    : activeActionGroup === "buildings"
      ? actionsBuildingsHtml()
      : actionsTroopsHtml({ cell, ownUnits, mobilizationOn });
  els.tabContent.innerHTML = `
    <div class="action-strip action-strip--grouped">
      ${groupButtons}
      ${actionContent}
    </div>
  `;
}

function actionGroupButton(group, label) {
  return `<button class="action-group ${activeActionGroup === group ? "is-active" : ""}" data-command="actionGroup" data-kind="${group}" type="button">${label}</button>`;
}

function actionsTroopsHtml({ cell, ownUnits, mobilizationOn }) {
  const scrapButtons = scrapButtonsHtml(ownUnits);
  return `
    <div class="action-section">
      <div class="move-options">
        <div class="stepper">
          <button data-command="infMinus" type="button">−</button>
          <output>${moveInf}${unitIconHtml("inf")}</output>
          <button data-command="infPlus" type="button">+</button>
        </div>
        ${moveToggleHtml("rpg", moveRpg, (ownUnits.rpg || 0) > 0)}
        ${moveToggleHtml("tank", moveTank, (ownUnits.tank || 0) > 0)}
        ${moveToggleHtml("mlrs", moveMlrs, (ownUnits.mlrs || 0) > 0)}
        ${moveToggleHtml("ew", moveEw, (ownUnits.ew || 0) > 0 && ((ownUnits.inf || 0) > 0 || (ownUnits.rpg || 0) > 0 || (ownUnits.tank || 0) > 0 || (ownUnits.mlrs || 0) > 0))}
        ${moveToggleHtml("cruiser", moveCruiser, (ownUnits.cruiser || 0) > 0)}
        ${moveToggleHtml("drone", moveDrone, (ownUnits.drone || 0) > 0)}
        ${moveToggleHtml("saboteur", moveSaboteur, (ownUnits.saboteur || 0) > 0)}
      </div>
      <div class="command-grid">
        ${actionCommandButton("rpg", cell, ownUnits, `${unitIconHtml("rpg")} РПГ`, "рядом")}
        ${actionCommandButton("tank", cell, ownUnits, `${unitIconHtml("tank")} Танк`, "рядом")}
        ${actionCommandButton("rocket", cell, ownUnits, "🚀 Удар", "R5")}
        ${actionCommandButton("mlrs", cell, ownUnits, `${unitIconHtml("mlrs")} Залп`, "R4")}
        ${actionCommandButton("cruiser", cell, ownUnits, `${unitIconHtml("cruiser")} Залп`, "линия 3")}
        ${actionCommandButton("detonateDrone", cell, ownUnits, `${unitIconHtml("drone")} Детонация`, "эта клетка")}
        ${actionCommandButton("detonateSaboteur", cell, ownUnits, "🕵 Взрыв", "постройка")}
        ${hasOwnBuilding("tck") ? commandButton("mobilize", "", mobilizationOn ? "📋 Выкл. моб." : "📋 Мобилизация", mobilizationOn ? "включено" : "выключено") : ""}
        ${commandButton("cancel", "", "× Сброс", "цель")}
      </div>
      ${scrapButtons ? `<div class="command-grid">${scrapButtons}</div>` : ""}
    </div>
  `;
}

function moveToggleHtml(kind, checked, enabled, label = `${unitIconHtml(kind)} ${MOVE_TOGGLE_LABELS[kind] || UNIT_DEFS[kind]?.name || UNIT_MARKS[kind] || kind}`) {
  return `<label class="toggle ${enabled ? "" : "is-disabled"}"><input type="checkbox" data-move-toggle="${kind}" ${enabled && checked ? "checked" : ""} ${enabled ? "" : "disabled"}> ${label}</label>`;
}

function actionCommandButton(command, cell, ownUnits, label, cost) {
  return commandButton(command, "", label, cost, { disabled: !actionUnitAvailable(command, cell, ownUnits) });
}

function actionUnitAvailable(command, cell, ownUnits = {}) {
  if (!cell) return false;
  if (command === "cruiser") return cell.terrain === "water" && (ownUnits.cruiser || 0) > 0;
  if (command === "detonateDrone") return (ownUnits.drone || 0) > 0;
  if (command === "detonateSaboteur") return (ownUnits.saboteur || 0) > 0;
  const unit = command === "rpg" ? "rpg" : command === "tank" ? "tank" : command === "rocket" ? "rocket" : command === "mlrs" ? "mlrs" : "";
  return Boolean(unit && controlsCell(cell) && (ownUnits[unit] || 0) > 0);
}

function actionsDiplomacyHtml({ vassal, hasVassals }) {
  return `
    <div class="action-section">
      <div class="command-grid">
        ${vassal ? disabledCommandButton("🤝 Союз", "сюзерен") : commandButton("ally", "", "🤝 Союз", "страна")}
        ${vassal ? disabledCommandButton("⚑ Война", "сюзерен") : commandButton("war", "", "⚑ Война", "страна")}
        ${vassal ? disabledCommandButton("⚠ Ультиматум", "сюзерен") : commandButton("ultimatum", "", "⚠ Ультиматум", "вассалитет")}
        ${vassal ? disabledCommandButton("🕊 Освободить", "сюзерен") : (hasVassals ? commandButton("releaseVassal", "", "🕊 Освободить", "вассал") : "")}
        ${vassal ? disabledCommandButton("🎁 Передать", "сюзерен") : commandButton("transfer", "", "🎁 Передать", "страна")}
        ${vassal ? disabledCommandButton("🙏 Запросить", "сюзерен") : commandButton("requestResources", "", "🙏 Запросить", "страна")}
        ${vassal ? disabledCommandButton("🕶 Спецоперация", "сюзерен") : commandButton("specialOp", "", "🕶 Спецоперация", "страна")}
        ${commandButton("cancel", "", "× Сброс", "цель")}
      </div>
    </div>
  `;
}

function actionsBuildingsHtml() {
  return `
    <div class="action-section">
      <div class="command-grid">
        ${commandButton("demolish", "", "⌫ Снести", "постройка")}
      </div>
    </div>
  `;
}

function scrapButtonsHtml(units = {}) {
  return SCRAPPABLE_UNITS
    .filter((kind) => (units[kind] || 0) > 0)
    .map((kind) => commandButton("scrap", kind, `♻ ${unitIconHtml(kind)} Списать`, UNIT_DEFS[kind]?.name || kind))
    .join("");
}

function syncMoveOptions(cell, ownUnits = {}) {
  const key = cell ? `${cell.x}:${cell.y}` : "";
  if (key !== moveSelectionKey) {
    moveSelectionKey = key;
    moveInf = ownUnits.inf || 0;
    moveRpg = (ownUnits.rpg || 0) > 0;
    moveTank = (ownUnits.tank || 0) > 0;
    moveMlrs = (ownUnits.mlrs || 0) > 0;
    moveEw = (ownUnits.ew || 0) > 0 && ((ownUnits.inf || 0) > 0 || (ownUnits.rpg || 0) > 0 || (ownUnits.tank || 0) > 0 || (ownUnits.mlrs || 0) > 0);
    moveCruiser = (ownUnits.cruiser || 0) > 0;
    moveDrone = (ownUnits.drone || 0) > 0 && (ownUnits.inf || 0) <= 0 && (ownUnits.rpg || 0) <= 0 && !ownUnits.tank && !ownUnits.mlrs;
    moveSaboteur = (ownUnits.saboteur || 0) > 0 && (ownUnits.inf || 0) <= 0 && (ownUnits.rpg || 0) <= 0 && !ownUnits.tank && !ownUnits.mlrs && !ownUnits.drone;
    return;
  }

  moveInf = defaultMoveInf(ownUnits);
  if (!ownUnits.rpg) moveRpg = false;
  if (!ownUnits.tank) moveTank = false;
  if (!ownUnits.mlrs) moveMlrs = false;
  if (!ownUnits.ew || ((ownUnits.inf || 0) <= 0 && (ownUnits.rpg || 0) <= 0 && !ownUnits.tank && !ownUnits.mlrs)) moveEw = false;
  if (!ownUnits.cruiser) moveCruiser = false;
  if (!ownUnits.drone) moveDrone = false;
  if (!ownUnits.saboteur) moveSaboteur = false;
}

function renderStatsOverlay() {
  if (!els.statsOverlay || !els.statsOverlayContent) return;
  if (!statsOpen) {
    if (renderedStatsKey !== "closed") {
      els.statsOverlay.classList.add("hidden");
      els.statsButton?.classList.remove("is-active");
      els.statsButton?.setAttribute("aria-expanded", "false");
      renderedStatsKey = "closed";
    }
    return;
  }
  const nextKey = `${state?.version || 0}:${state?.mapVersion || 0}:${Math.floor(serverNow() / 1000)}`;
  if (nextKey === renderedStatsKey) return;
  renderedStatsKey = nextKey;
  els.statsOverlay.classList.remove("hidden");
  els.statsButton?.classList.add("is-active");
  els.statsButton?.setAttribute("aria-expanded", "true");
  els.statsOverlayContent.innerHTML = statsContentHtml();
}

function statsContentHtml() {
  const players = Object.values(state?.players || {}).filter(Boolean);
  const mine = state?.players?.[me];
  return `
    <div class="stats-tab">
      <div class="stats-grid">
        ${players.map((player) => countryStatsCard(player)).join("")}
      </div>
      <div class="special-stats">
        <div class="special-stats__head">
          <strong>Спецоперации</strong>
          <span>${mine ? liveCooldown(mine.id, "specialOp", mine.specialOpCooldown || 0) : 0}s</span>
        </div>
        <div class="special-op-list">
          ${specialOperationStatsHtml(mine)}
        </div>
      </div>
    </div>
  `;
}

function countryStatsCard(player) {
  const stats = player.stats || {};
  const ideology = IDEOLOGY_DEFS[player.ideology]?.name || player.ideology || "идеология";
  const relation = player.id === me ? "ты" : relationLabel(player.id);
  const scoutReport = state?.private?.scoutReports?.[player.id];
  const showResources = player.id === me || player.vassalOf === me;
  const resources = showResources ? resourcesLineHtml(player.resources || {}) : "";
  return `
    <article class="stats-card ${player.id === me ? "is-mine" : ""}">
      <div class="stats-card__title">
        <strong style="color:${escapeHtml(player.colorValue)}">${escapeHtml(player.country || player.id)}</strong>
        <span>${escapeHtml(relation)}</span>
      </div>
      <div class="stats-metrics">
        <div><b>Блоки</b><span>${fmt(stats.cells || 0)}</span></div>
        <div><b>Армия</b><span>${fmt(stats.power || 0)}</span></div>
        <div><b>Идеология</b><span>${escapeHtml(ideology)}</span></div>
        <div><b>Штаб</b><span class="${player.hqLost ? "hq-bad" : ""}">${hqStatusText(player)}</span></div>
      </div>
      ${resources ? `<div class="resource-breakdown">${resources}</div>` : ""}
      <div class="unit-breakdown">${statsUnitBreakdown(stats)}</div>
      ${scoutReport ? scoutReportHtml(scoutReport) : ""}
    </article>
  `;
}

function scoutReportHtml(report = {}) {
  const stats = report.stats || {};
  const resources = RESOURCE_DEFS
    .map((resource) => `${resource.icon}${fmt(report.resources?.[resource.key] || 0)}`)
    .join(" ");
  const ideology = IDEOLOGY_DEFS[report.ideology]?.name || report.ideology || "неизвестно";
  const time = report.at ? formatChatTime(report.at) : "";
  return `
    <div class="scout-report">
      <strong>Разведка${time ? ` · ${time}` : ""}</strong>
      <span>${escapeHtml(ideology)} · блоки ${fmt(stats.cells || 0)} · армия ${fmt(stats.power || 0)}</span>
      <span>${escapeHtml(resources)}</span>
    </div>
  `;
}

function resourcesLineHtml(resources = {}) {
  return RESOURCE_DEFS
    .map((resource) => `<span>${resource.icon}${fmt(resources[resource.key] || 0)}</span>`)
    .join("");
}

function statsUnitBreakdown(stats = {}) {
  const rows = [
    ["Пехота", stats.inf],
    ["Гранатометчики", stats.rpg],
    ["Танки", stats.tank],
    ["Ракеты", stats.rocket],
    ["ПВО", stats.aa],
    ["ПВО+", stats.aaPlus],
    ["РЭБ", stats.ew],
    ["РСЗО", stats.mlrs],
    ["Дроны", stats.drone],
    ["Диверсанты", stats.saboteur],
    ["Лодки", stats.boat],
    ["Крейсеры", stats.cruiser]
  ].filter(([, value]) => value > 0);
  return rows.length
    ? rows.map(([label, value]) => `<span>${escapeHtml(label)} ${fmt(value)}</span>`).join("")
    : "<span>войск нет</span>";
}

function specialOperationStatsHtml(player) {
  if (!player) return "<div class=\"special-op-row\"><span>нет данных</span></div>";
  return Object.entries(SPECIAL_OP_DEFS)
    .filter(([, operation]) => !operation.anarchistsOnly || player.id === "anarchists")
    .map(([id, operation]) => `
      <div class="special-op-row">
        <span>${escapeHtml(operation.name)}</span>
        <b>${Math.round(specialOperationChance(id, player) * 100)}%</b>
      </div>
    `).join("");
}

function specialOperationChance(id, player) {
  const operation = SPECIAL_OP_DEFS[id];
  if (!operation) return 0;
  const ideologyAdjust = { theocracy: 0.08, anarchism: 0.08 }[player?.ideology] || 0;
  return clamp((operation.chance || 0) + ideologyAdjust, 0.15, 0.9);
}

function commandButton(command, kind, label, cost, options = {}) {
  return `<button class="command" data-command="${command}" data-kind="${kind}" type="button" ${options.disabled ? "disabled" : ""}>${label}<span>${cost}</span></button>`;
}

function disabledCommandButton(label, reason) {
  return `<button class="command" type="button" disabled>${label}<span>${reason}</span></button>`;
}

function openResourceBundleModal({ title, submitLabel, targetSelect = false, onSubmit }) {
  if (targetSelect && !targetCountryOptionsHtml()) {
    showToast("Нет доступных стран.");
    return;
  }
  modalSubmitHandler = onSubmit;
  els.modalLayer.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true">
      <div class="modal-head">
        <strong>${escapeHtml(title)}</strong>
        <button data-modal-close type="button">×</button>
      </div>
      ${targetSelect ? countrySelectHtml() : ""}
      <div class="resource-editor">
        ${resourceRowsHtml()}
      </div>
      <button class="primary modal-submit" data-resource-submit type="button">${escapeHtml(submitLabel)}</button>
    </div>
  `;
  els.modalLayer.classList.remove("hidden");
}

function openCountrySelectModal({ title, submitLabel, onSubmit }) {
  if (!targetCountryOptionsHtml()) {
    showToast("Нет доступных стран.");
    return;
  }
  modalSubmitHandler = onSubmit;
  els.modalLayer.innerHTML = `
    <div class="modal-box modal-box--small" role="dialog" aria-modal="true">
      <div class="modal-head">
        <strong>${escapeHtml(title)}</strong>
        <button data-modal-close type="button">×</button>
      </div>
      ${countrySelectHtml()}
      <button class="primary modal-submit" data-country-submit type="button">${escapeHtml(submitLabel)}</button>
    </div>
  `;
  els.modalLayer.classList.remove("hidden");
}

function openVassalSelectModal() {
  const options = vassalOptionsHtml();
  if (!options) {
    showToast("У тебя нет вассалов.");
    return;
  }
  modalSubmitHandler = (targetId) => {
    send({
      type: "diplomacy",
      action: "releaseVassal",
      targetId
    }, { priority: true });
  };
  els.modalLayer.innerHTML = `
    <div class="modal-box modal-box--small" role="dialog" aria-modal="true">
      <div class="modal-head">
        <strong>Освободить вассала</strong>
        <button data-modal-close type="button">×</button>
      </div>
      <label class="field">
        <span>Вассал</span>
        <select data-country-target>${options}</select>
      </label>
      <button class="primary modal-submit" data-country-submit type="button">Освободить</button>
    </div>
  `;
  els.modalLayer.classList.remove("hidden");
}

function openSpecialOperationModal() {
  if (!targetCountryOptionsHtml()) {
    showToast("Нет доступных стран.");
    return;
  }
  modalSubmitHandler = (operation, targetId) => {
    if (!operation || !targetId) {
      showToast("Выбери операцию и страну.");
      return;
    }
    send({ type: "specialOp", operation, targetId }, { priority: true });
  };
  els.modalLayer.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true">
      <div class="modal-head">
        <strong>Спецоперация</strong>
        <button data-modal-close type="button">×</button>
      </div>
      ${countrySelectHtml()}
      <label class="field">
        <span>Операция</span>
        <select data-special-operation>
          ${Object.entries(SPECIAL_OP_DEFS).filter(([, operation]) => !operation.anarchistsOnly || me === "anarchists").map(([id, operation]) => `<option value="${escapeHtml(id)}">${escapeHtml(operation.name)} · ${escapeHtml(operation.info)}</option>`).join("")}
        </select>
      </label>
      <p class="modal-note">Результат через 30 секунд. Перезарядка спецопераций 300 секунд.</p>
      <button class="primary modal-submit" data-special-submit type="button">Начать</button>
    </div>
  `;
  els.modalLayer.classList.remove("hidden");
}

function countrySelectHtml() {
  return `
    <label class="field">
      <span>Страна</span>
      <select data-country-target>
        ${targetCountryOptionsHtml()}
      </select>
    </label>
  `;
}

function targetCountryOptionsHtml() {
  return Object.values(state?.players || {})
    .filter((player) => player && player.id !== me && !player.defeated)
    .map((player) => `<option value="${escapeHtml(player.id)}">${escapeHtml(player.country || player.id)} ${relationLabel(player.id)}</option>`)
    .join("");
}

function vassalOptionsHtml() {
  return myVassals()
    .map((player) => `<option value="${escapeHtml(player.id)}">${escapeHtml(player.country || player.id)}</option>`)
    .join("");
}

function resourceRowsHtml(values = {}) {
  return RESOURCE_DEFS.map((resource) => `
    <label class="resource-edit-row">
      <span>${resource.icon} ${resource.label}</span>
      <button data-resource-step="${resource.key}" data-delta="-1" type="button">−</button>
      <input data-resource-input="${resource.key}" inputmode="numeric" min="0" type="number" value="${Math.max(0, values[resource.key] || 0)}">
      <button data-resource-step="${resource.key}" data-delta="1" type="button">+</button>
    </label>
  `).join("");
}

function handleModalClick(event) {
  if (event.target === els.modalLayer || event.target.closest("[data-modal-close]")) {
    closeModal();
    return;
  }

  const step = event.target.closest("[data-resource-step]");
  if (step) {
    const input = els.modalLayer.querySelector(`[data-resource-input="${step.dataset.resourceStep}"]`);
    if (!input) return;
    const delta = Number(step.dataset.delta || 0);
    input.value = Math.max(0, Math.floor(Number(input.value || 0)) + delta);
    return;
  }

  if (event.target.closest("[data-resource-submit]")) {
    const resources = readModalResources();
    if (!resources) return;
    const targetId = els.modalLayer.querySelector("[data-country-target]")?.value;
    modalSubmitHandler?.(resources, targetId);
    closeModal();
    return;
  }

  if (event.target.closest("[data-country-submit]")) {
    const targetId = els.modalLayer.querySelector("[data-country-target]")?.value;
    if (!targetId) {
      showToast("Выбери страну.");
      return;
    }
    modalSubmitHandler?.(targetId);
    closeModal();
    return;
  }

  if (event.target.closest("[data-special-submit]")) {
    const targetId = els.modalLayer.querySelector("[data-country-target]")?.value;
    const operation = els.modalLayer.querySelector("[data-special-operation]")?.value;
    if (!targetId || !operation) {
      showToast("Выбери страну и операцию.");
      return;
    }
    modalSubmitHandler?.(operation, targetId);
    closeModal();
    return;
  }

  if (event.target.closest("[data-dev-unlock]")) {
    const code = els.modalLayer.querySelector("[data-dev-code]")?.value.trim();
    if (code !== DEV_CODE) {
      showToast("Неверный код.");
      return;
    }
    devUnlocked = true;
    openDeveloperResourceMenu();
    return;
  }

  if (event.target.closest("[data-dev-submit]")) {
    const targetId = els.modalLayer.querySelector("[data-dev-country]")?.value;
    const resources = readModalResourceState();
    if (!targetId) return;
    send({ type: "devResources", code: DEV_CODE, action: "setResources", targetId, resources }, { priority: true });
    closeModal();
    return;
  }

  const cheat = event.target.closest("[data-dev-cheat]");
  if (cheat) {
    const targetId = els.modalLayer.querySelector("[data-dev-country]")?.value;
    const eventType = els.modalLayer.querySelector("[data-dev-event]")?.value;
    send({ type: "devResources", code: DEV_CODE, action: cheat.dataset.devCheat, targetId, eventType }, { priority: true });
    if (cheat.dataset.devCheat === "maxResources" || cheat.dataset.devCheat === "maxAllResources") {
      for (const input of els.modalLayer.querySelectorAll("[data-resource-input]")) {
        input.value = 999;
      }
    }
  }
}

function handleModalChange(event) {
  if (event.target.matches("[data-dev-country]")) {
    openDeveloperResourceMenu(event.target.value);
  }
}

function readModalResources() {
  const resources = {};
  for (const input of els.modalLayer.querySelectorAll("[data-resource-input]")) {
    const amount = Math.max(0, Math.floor(Number(input.value || 0)));
    if (amount > 0) resources[input.dataset.resourceInput] = amount;
  }
  if (!Object.keys(resources).length) {
    showToast("Укажи хотя бы один ресурс.");
    return null;
  }
  return resources;
}

function readModalResourceState() {
  const resources = {};
  for (const input of els.modalLayer.querySelectorAll("[data-resource-input]")) {
    resources[input.dataset.resourceInput] = Math.max(0, Math.floor(Number(input.value || 0)));
  }
  return resources;
}

function closeModal() {
  modalSubmitHandler = null;
  els.modalLayer.classList.add("hidden");
  els.modalLayer.innerHTML = "";
}

function openDeveloperMenu() {
  if (devUnlocked) {
    openDeveloperResourceMenu();
    return;
  }
  els.modalLayer.innerHTML = `
    <div class="modal-box modal-box--small" role="dialog" aria-modal="true">
      <div class="modal-head">
        <strong>Для Разработчиков</strong>
        <button data-modal-close type="button">×</button>
      </div>
      <label class="field">
        <span>Код</span>
        <input data-dev-code maxlength="12" inputmode="numeric" autocomplete="off" type="password">
      </label>
      <button class="primary modal-submit" data-dev-unlock type="button">Открыть</button>
    </div>
  `;
  els.modalLayer.classList.remove("hidden");
}

function openDeveloperResourceMenu(selectedId = null) {
  if (!state?.players) {
    showToast("Матч еще не загружен.");
    return;
  }
  const players = Object.values(state.players).filter(Boolean);
  const activeId = selectedId && state.players[selectedId] ? selectedId : (players[0]?.id || "");
  const active = state.players[activeId];
  const options = players
    .map((player) => `<option value="${escapeHtml(player.id)}" ${player.id === activeId ? "selected" : ""}>${escapeHtml(player.country || player.id)}${player.defeated ? " (выбыла)" : ""}</option>`)
    .join("");
  els.modalLayer.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true">
      <div class="modal-head">
        <strong>Ресурсы стран</strong>
        <button data-modal-close type="button">×</button>
      </div>
      <label class="field">
        <span>Страна</span>
        <select data-dev-country>${options}</select>
      </label>
      <div class="resource-editor">
        ${resourceRowsHtml(active?.resources || {})}
      </div>
      <button class="primary modal-submit" data-dev-submit type="button">Применить ресурсы</button>
      <div class="dev-event">
        <label class="field">
          <span>Событие сейчас</span>
          <select data-dev-event>
            ${Object.entries(RANDOM_EVENT_DEFS).map(([id, label]) => `<option value="${escapeHtml(id)}">${escapeHtml(label)}</option>`).join("")}
          </select>
        </label>
        <button data-dev-cheat="triggerEvent" type="button">Запустить событие</button>
        <button data-dev-cheat="clearEvent" type="button">Снять событие</button>
      </div>
      <div class="dev-cheats">
        <button data-dev-cheat="clearCooldowns" type="button">Убрать перезарядки</button>
        <button data-dev-cheat="restoreCooldowns" type="button">Вернуть перезарядки</button>
        <button data-dev-cheat="maxResources" type="button">999 выбранной</button>
        <button data-dev-cheat="maxAllResources" type="button">999 всем</button>
        <button data-dev-cheat="toggleAlwaysMisfire" type="button">${active?.devAlwaysMisfire ? "Выключить осечки" : "Всегда осечки"}</button>
        <button data-dev-cheat="clearAlwaysMisfire" type="button">Снять осечки</button>
        <button data-dev-cheat="forceFactoryStrikes" type="button">Забастовки на заводах</button>
        <button data-dev-cheat="peaceAll" type="button">Нейтралитет всем</button>
      </div>
    </div>
  `;
  els.modalLayer.classList.remove("hidden");
}

function handleCommand(command, kind, data = {}) {
  if (command === "actionGroup") {
    activeActionGroup = ["troops", "diplomacy", "buildings"].includes(kind) ? kind : "troops";
    pending = null;
    renderGame();
    return;
  }
  if (command === "infMinus") {
    moveInf = Math.max(0, moveInf - 1);
    renderGame();
    return;
  }
  if (command === "infPlus") {
    const max = selected ? getCell(selected.x, selected.y)?.units?.[me]?.inf || 0 : 0;
    moveInf = Math.min(max, moveInf + 1);
    renderGame();
    return;
  }
  if (command === "cancel") {
    pending = null;
    renderGame();
    return;
  }
  if ((command === "move" || command === "moveDir") && pendingMoveSelection) {
    showToast("Войска еще двигаются, дождись обновления клетки.");
    return;
  }
  if (command === "restart") {
    send({ type: "restart" }, { priority: true });
    return;
  }
  if (command === "build") {
    const cell = requireSelected();
    if (!cell) return;
    if (kind === "bridge" && cell.terrain !== "water") {
      showToast("Мост ставится на воду. На берегу это 20 золота в музей странных решений.");
      return;
    }
    send({ type: "build", kind, x: cell.x, y: cell.y }, { priority: true });
    return;
  }
  if (command === "hire") {
    const cell = requireSelected();
    if (!cell) return;
    send({ type: "hire", kind, x: cell.x, y: cell.y }, { priority: true });
    return;
  }
  if (command === "nuke") {
    pending = { action: "nuke" };
    renderGame();
    return;
  }
  if (command === "demolish") {
    const cell = requireSelected();
    if (!cell) return;
    send({ type: "demolish", x: cell.x, y: cell.y }, { priority: true });
    return;
  }
  if (command === "scrap") {
    const cell = requireSelected();
    if (!cell) return;
    send({ type: "scrap", unit: kind, x: cell.x, y: cell.y }, { priority: true });
    return;
  }
  if (command === "detonateDrone") {
    const cell = requireSelected();
    if (!cell) return;
    send({ type: "action", action: "detonateDrone", x: cell.x, y: cell.y }, { priority: true });
    return;
  }
  if (command === "detonateSaboteur") {
    const cell = requireSelected();
    if (!cell) return;
    send({ type: "action", action: "detonateSaboteur", x: cell.x, y: cell.y }, { priority: true });
    return;
  }
  if (["ally", "war", "ultimatum", "releaseVassal", "transfer", "requestResources", "specialOp"].includes(command) && isMyCountryVassal()) {
    showToast("Внешние действия вассала идут через сюзерена.");
    return;
  }
  if (command === "mobilize") {
    send({ type: "action", action: "mobilize" }, { priority: true });
    return;
  }
  if (command === "ally" || command === "war") {
    openCountrySelectModal({
      title: command === "ally" ? "Предложить союз" : "Объявить войну",
      submitLabel: command === "ally" ? "Предложить" : "Объявить",
      onSubmit(targetId) {
        send({
          type: "diplomacy",
          action: command === "ally" ? "offerAlliance" : "declareWar",
          targetId
        }, { priority: true });
      }
    });
    return;
  }
  if (command === "ultimatum") {
    openCountrySelectModal({
      title: "Ультиматум",
      submitLabel: "Выдвинуть",
      onSubmit(targetId) {
        send({
          type: "diplomacy",
          action: "ultimatum",
          targetId
        }, { priority: true });
      }
    });
    return;
  }
  if (command === "releaseVassal") {
    openVassalSelectModal();
    return;
  }
  if (command === "transfer" || command === "requestResources") {
    const transfer = command === "transfer";
    openResourceBundleModal({
      title: transfer ? "Передать ресурсы" : "Запросить ресурсы",
      submitLabel: transfer ? "Передать" : "Запросить",
      targetSelect: true,
      onSubmit(resources, targetId) {
        if (!targetId) {
          showToast("Выбери страну.");
          return;
        }
        send({
          type: "resources",
          action: transfer ? "transfer" : "request",
          targetId,
          resources
        }, { priority: true });
      }
    });
    return;
  }
  if (command === "specialOp") {
    openSpecialOperationModal();
    return;
  }
  if (command === "moveDir") {
    const source = requireOwnSelected();
    if (!source) return;
    sendMove(source, source.x + Number(data.dx || 0), source.y + Number(data.dy || 0));
    return;
  }
  const source = command === "move" ? requireOwnSelected() : requireSelected();
  if (!source) return;
  if (["rpg", "tank", "rocket", "mlrs", "cruiser"].includes(command)) {
    const hasWeapon = (source.units?.[me]?.[command] || 0) > 0;
    const sourceOk = command === "cruiser"
      ? source.terrain === "water" && hasWeapon
      : controlsCell(source) && hasWeapon;
    if (!sourceOk) {
      showToast(`${weaponName(command)} должен быть на выбранной твоей клетке.`);
      return;
    }
    if (!cellWeaponCooldownReady(source, me, command)) {
      showToast(`${weaponName(command)} перезаряжается на этой клетке.`);
      return;
    }
  }
  pending = { action: command, x: source.x, y: source.y };
  renderGame();
}

function handleCellTap(x, y) {
  if (!state) return;

  if (pending) {
    if (pending.action === "nuke") {
      send({ type: "action", action: "nuke", tx: x, ty: y }, { priority: true });
    } else if (pending.action === "move") {
      sendMove(getCell(pending.x, pending.y), x, y);
    } else {
      send({ type: "action", action: pending.action, x: pending.x, y: pending.y, tx: x, ty: y }, { priority: true });
    }
    pending = null;
    renderGame();
    return;
  }

  selected = { x, y };
  pendingMoveSelection = null;
  const cell = getCell(x, y);
  moveSelectionKey = null;
  syncMoveOptions(cell, cell?.units?.[me] || {});
  renderGame();
}

function requireSelected() {
  if (!selected) {
    showToast("Сначала тапни клетку.");
    return null;
  }
  return getCell(selected.x, selected.y);
}

function requireOwnSelected() {
  const cell = requireSelected();
  if (!cell) return null;
  const ownUnits = cell.units?.[me] || {};
  if (!controlsCell(cell) && !(cell.terrain === "water" && hasOwnVessel(cell)) && (ownUnits.drone || 0) <= 0 && (ownUnits.saboteur || 0) <= 0) {
    showToast("Марш начинается только со своей клетки или своего корабля.");
    return null;
  }
  if (movablePower(ownUnits) <= 0) {
    showToast("На клетке нет подвижных войск.");
    return null;
  }
  return cell;
}

function sendMove(source, tx, ty) {
  if (!source) return;
  if (pendingMoveSelection) {
    showToast("Войска еще двигаются, дождись обновления клетки.");
    return;
  }
  const ownUnits = source.units?.[me] || {};
  const target = getCell(tx, ty);
  const request = moveRequest(source, ownUnits);
  const boatSails = source.terrain === "water" && target?.terrain === "water" && request.boat;
  const cruiserSails = source.terrain === "water" && target?.terrain === "water" && request.cruiser;
  const rawWaterTarget = target?.terrain === "water" && target?.building?.type !== "bridge";
  send({
    type: "action",
    action: "move",
    x: source.x,
    y: source.y,
    tx,
    ty,
    inf: request.inf,
    rpg: request.rpg,
    tank: moveTank && ownUnits.tank > 0,
    mlrs: moveMlrs && ownUnits.mlrs > 0,
    ew: rawWaterTarget ? 0 : request.ew,
    drone: moveDrone ? (ownUnits.drone || 0) : 0,
    saboteur: moveSaboteur ? (ownUnits.saboteur || 0) : 0,
    boat: boatSails && !cruiserSails,
    cruiser: cruiserSails
  }, { priority: true });
}

function pendingLabel() {
  if (!pending) return "";
  if (pending.action === "nuke") return "☢ выбери точку ядерного удара";
  const labels = { move: "марш", rpg: "выстрел из РПГ", tank: "танковый выстрел", rocket: "ракетный удар", mlrs: "залп РСЗО", cruiser: "залп крейсера" };
  return `${labels[pending.action]} · тапни цель`;
}

function showChatEffect(entry) {
  if (!entry?.id || entry.id === lastChatId) return;
  lastChatId = entry.id;
  if (entry.type === "system") {
    showEventBanner(entry.text);
    return;
  }
  if (entry.playerId) {
    addMapBubble(entry);
  }
}

function showEventBanner(text) {
  if (!els.eventBanner) return;
  clearTimeout(eventBannerTimer);
  els.eventBanner.textContent = text;
  els.eventBanner.classList.remove("hidden");
  eventBannerTimer = setTimeout(() => els.eventBanner.classList.add("hidden"), 2800);
}

function addMapBubble(entry) {
  const text = `${entry.name}: ${entry.text}`.slice(0, 84);
  mapBubbles.push({
    id: entry.id,
    playerId: entry.playerId,
    text,
    until: Date.now() + 3200
  });
  mapBubbles = mapBubbles.slice(-8);
  renderedMapKey = "";
  renderMap();
  setTimeout(() => {
    renderedMapKey = "";
    renderMap();
  }, 3300);
}

function toggleChat() {
  if (els.chatDrawer.classList.contains("hidden")) {
    openChat();
  } else {
    closeChat();
  }
}

function openChat() {
  unreadChatCount = 0;
  els.chatDrawer.classList.remove("hidden");
  renderChat();
  updateChatButton();
  setTimeout(() => els.chatInput?.focus(), 0);
}

function closeChat() {
  els.chatDrawer.classList.add("hidden");
  updateChatButton();
}

function updateChatButton() {
  if (!els.chatOpen) return;
  const unread = Math.min(unreadChatCount, 99);
  const drawerOpen = !els.chatDrawer.classList.contains("hidden");
  const nextKey = `${unread}:${drawerOpen ? 1 : 0}`;
  if (nextKey === renderedChatButtonKey) return;
  renderedChatButtonKey = nextKey;
  els.chatOpen.innerHTML = `
    <span>Чат</span>
    ${unread > 0 ? `<b>${unread}</b>` : ""}
  `;
  els.chatOpen.classList.toggle("has-unread", unread > 0);
  els.chatOpen.setAttribute("aria-expanded", String(drawerOpen));
}

function renderChat() {
  if (!state || els.chatDrawer.classList.contains("hidden")) return;
  const chat = (state.chat || []).slice(-40);
  const chatKey = chat.map((entry) => entry.id).join("|");
  if (chatKey === renderedChatKey) return;
  renderedChatKey = chatKey;
  els.chatLog.innerHTML = chat.map(chatEntryHtml).join("");
  els.chatLog.scrollTop = els.chatLog.scrollHeight;
}

function chatEntryHtml(entry) {
  const time = formatChatTime(entry.at || entry.time || entry.createdAt);
  if (entry.type === "system") {
    return `
      <div class="chat-entry chat-entry--system">
        <div class="chat-entry__meta"><strong>Событие</strong><span>${time}</span></div>
        <p>${escapeHtml(entry.text)}</p>
      </div>
    `;
  }
  return `
    <div class="chat-entry" style="--chat-color:${entry.color}">
      <div class="chat-entry__meta"><strong>${escapeHtml(entry.name)}</strong><span>${time}</span></div>
      <p>${escapeHtml(entry.text)}</p>
    </div>
  `;
}

function formatChatTime(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function renderDiplomacyPrompt() {
  if (!state || !me) return;
  const resourceRequest = (state.resourceRequests || []).find((item) => item.to === me);
  if (resourceRequest) {
    const nextKey = `resource:${resourceRequest.id}:${resourceRequest.from}:${JSON.stringify(resourceRequest.resources || {})}`;
    if (nextKey === renderedDiplomacyPromptKey) return;
    renderedDiplomacyPromptKey = nextKey;
    const from = state.players?.[resourceRequest.from];
    els.diplomacyPrompt.classList.remove("hidden");
    els.diplomacyPrompt.classList.remove("diplomacy-prompt--ultimatum");
    els.diplomacyPrompt.innerHTML = `
      <strong>${escapeHtml(from?.country || "Страна")} запрашивает у вас ${escapeHtml(formatResourceBundle(resourceRequest.resources))}</strong>
      <div>
        <button data-resource-response="acceptRequest" data-request-id="${escapeHtml(resourceRequest.id)}" type="button">Дать</button>
        <button data-resource-response="rejectRequest" data-request-id="${escapeHtml(resourceRequest.id)}" type="button">Отказаться</button>
      </div>
    `;
    return;
  }

  const ultimatum = (state.ultimatums || []).find((item) => item.to === me);
  if (ultimatum) {
    const nextKey = `ultimatum:${ultimatum.id}:${ultimatum.from}`;
    if (nextKey === renderedDiplomacyPromptKey) return;
    renderedDiplomacyPromptKey = nextKey;
    const from = state.players?.[ultimatum.from];
    els.diplomacyPrompt.classList.remove("hidden");
    els.diplomacyPrompt.classList.add("diplomacy-prompt--ultimatum");
    els.diplomacyPrompt.innerHTML = `
      <strong>${escapeHtml(from?.country || "Страна")} требует стать его вассалом. В случае отказа будет объявлена война.</strong>
      <div>
        <button data-diplomacy-response="acceptUltimatum" data-ultimatum-id="${escapeHtml(ultimatum.id)}" type="button">Принять</button>
        <button data-diplomacy-response="rejectUltimatum" data-ultimatum-id="${escapeHtml(ultimatum.id)}" type="button">Отказаться</button>
      </div>
    `;
    return;
  }

  const offer = (state.diplomacyOffers || []).find((item) => item.to === me);
  if (!offer) {
    if (renderedDiplomacyPromptKey !== "hidden") {
      els.diplomacyPrompt.classList.add("hidden");
      els.diplomacyPrompt.classList.remove("diplomacy-prompt--ultimatum");
      els.diplomacyPrompt.innerHTML = "";
      renderedDiplomacyPromptKey = "hidden";
    }
    return;
  }
  const nextKey = `offer:${offer.id}:${offer.from}`;
  if (nextKey === renderedDiplomacyPromptKey) return;
  renderedDiplomacyPromptKey = nextKey;
  const from = state.players?.[offer.from];
  els.diplomacyPrompt.classList.remove("hidden");
  els.diplomacyPrompt.classList.remove("diplomacy-prompt--ultimatum");
  els.diplomacyPrompt.innerHTML = `
    <strong>${escapeHtml(from?.country || "Страна")} предлагает союз</strong>
    <div>
      <button data-diplomacy-response="acceptAlliance" data-offer-id="${escapeHtml(offer.id)}" type="button">Принять</button>
      <button data-diplomacy-response="rejectAlliance" data-offer-id="${escapeHtml(offer.id)}" type="button">Отказаться</button>
    </div>
  `;
}

function formatResourceBundle(resources = {}) {
  return RESOURCE_DEFS
    .filter((resource) => resources[resource.key] > 0)
    .map((resource) => `${resources[resource.key]} ${resource.label}`)
    .join(", ");
}

function renderEndOverlay() {
  const ended = state?.ended;
  if (!ended) {
    if (renderedEndOverlayKey !== "hidden") {
      els.endOverlay.classList.add("hidden");
      renderedEndOverlayKey = "hidden";
    }
    return;
  }
  const canControlEnd = ended.winnerId === me;
  const nextKey = `${ended.winnerId || ""}:${ended.winner || ""}:${ended.reason || ""}:${canControlEnd ? 1 : 0}`;
  if (nextKey === renderedEndOverlayKey) return;
  renderedEndOverlayKey = nextKey;
  els.endOverlay.classList.remove("hidden");
  els.endTitle.textContent = `${ended.winner} победила`;
  els.endReason.textContent = ended.reason;
  if (els.continueBotsButton) {
    els.continueBotsButton.hidden = !canControlEnd;
  }
  if (els.restartButton) {
    els.restartButton.hidden = !canControlEnd;
  }
}

function getCell(x, y) {
  return state?.map?.[y]?.[x] || null;
}

function otherPlayerIds() {
  return Object.keys(state?.players || {}).filter((id) => id !== me && state.players[id]);
}

function relationKey(a, b) {
  return [a, b].sort().join(":");
}

function relationStatus(targetId) {
  if (!me || !targetId || me === targetId) return "self";
  if (controlsOwner(targetId) || state?.players?.[me]?.vassalOf === targetId) return "alliance";
  return state?.relations?.[relationKey(me, targetId)] || "neutral";
}

function controlsOwner(ownerId) {
  return Boolean(ownerId && (ownerId === me || state?.players?.[ownerId]?.vassalOf === me));
}

function controlsCell(cell) {
  return Boolean(cell && controlsOwner(cell.owner));
}

function isMyCountryVassal() {
  return Boolean(state?.players?.[me]?.vassalOf);
}

function myVassals() {
  return Object.values(state?.players || {})
    .filter((player) => player && player.vassalOf === me && !player.defeated);
}

function hasOwnBuilding(type) {
  if (!state?.map || !type) return false;
  return state.map.some((row) =>
    row.some((cell) => cell.building?.owner && controlsOwner(cell.building.owner) && cell.building.type === type)
  );
}

function relationLabel(targetId) {
  if (state?.players?.[targetId]?.vassalOf === me) return "(вассал)";
  if (state?.players?.[me]?.vassalOf === targetId) return "(сюзерен)";
  const relation = relationStatus(targetId);
  if (relation === "alliance") return "(в союзе)";
  if (relation === "war") return "(война)";
  return "(нейтр.)";
}

function formatOtherUnits(cell) {
  return otherPlayerIds()
    .map((id) => formatUnits(cell.units?.[id] || {}, !canRevealHostileSaboteur(cell, id)))
    .filter(Boolean)
    .join("");
}

function buildingMark(cell) {
  if (!cell.building) return "";
  const label = BUILDING_MARKS[cell.building.type] || "";
  if (cell.building.type === "hq") return `★ ${label}`;
  if (cell.building.type === "factory" && cell.building.strikeUntil && cell.building.strikeUntil > serverNow()) {
    return `${label} ✊`;
  }
  if (cell.building.type === "port" && cell.building.blockadedBy) {
    return `${label} ⛔`;
  }
  return label;
}

function constructionMark(cell) {
  return cell.construction ? "..." : "";
}

function buildingIcon(cell) {
  if (!cell.building) return "";
  if (cell.building.type === "hq") return "🏛";
  return BUILDING_DEFS[cell.building.type]?.icon || "";
}

function compactUnitsText(cell) {
  const mine = compactUnits(cell.units?.[me] || {});
  const enemy = compactOtherUnits(cell);
  if (mine && enemy) return `${mine}/${enemy}`;
  return mine || enemy;
}

function compactUnits(units, hideSaboteur = false) {
  const parts = [];
  if (units.inf) parts.push(`${UNIT_MARKS.inf} ${units.inf}`);
  if (units.rpg) parts.push(`${UNIT_MARKS.rpg} ${units.rpg}`);
  for (const key of ["tank", "rocket", "aa", "aaPlus", "ew", "mlrs", "drone", "saboteur", "boat", "cruiser"]) {
    if (hideSaboteur && key === "saboteur") continue;
    if (units[key]) parts.push(key === "drone" || key === "saboteur" ? `${UNIT_MARKS[key]} ${units[key]}` : UNIT_MARKS[key]);
  }
  return parts.join(" ");
}

function compactOtherUnits(cell) {
  return otherPlayerIds()
    .map((id) => compactUnits(cell.units?.[id] || {}, !canRevealHostileSaboteur(cell, id)))
    .filter(Boolean)
    .join("/");
}

function canRevealHostileSaboteur(cell, playerId) {
  return Boolean(cell && controlsCell(cell) && hasOwnBuilding("counterIntel") && relationStatus(playerId) === "war");
}

function hasRevealedHostileSaboteur(cell) {
  return otherPlayerIds().some((id) => canRevealHostileSaboteur(cell, id) && (cell.units?.[id]?.saboteur || 0) > 0);
}

function cellTooltip(cell) {
  const owner = state.players[cell.owner]?.country || "нейтр.";
  const building = cell.building ? ` ${buildingIcon(cell)}` : "";
  const construction = cell.construction ? ` | стройка ${cell.construction.remaining || 0}с` : "";
  const mine = formatUnits(cell.units?.[me] || {});
  const enemy = formatOtherUnits(cell);
  return `${cell.x + 1}:${cell.y + 1} ${TERRAIN_NAMES[cell.terrain]} ${owner}${building}${construction}${mine ? ` | ${mine}` : ""}${enemy ? ` | чужие ${enemy}` : ""}`;
}

function unitsText(cell) {
  const mine = formatUnits(cell.units?.[me] || {});
  const enemy = formatOtherUnits(cell);
  if (mine && enemy) return `${mine}|${enemy}`;
  return mine || enemy;
}

function defaultMoveInf(units) {
  const value = Number.isFinite(Number(moveInf)) ? Math.floor(Number(moveInf)) : (units.inf || 0);
  return clamp(value, 0, units.inf || 0);
}

function movablePower(units) {
  return (units.inf || 0) + (units.rpg || 0) + (units.tank || 0) + (units.mlrs || 0) + (units.drone || 0) + (units.saboteur || 0) + (units.boat || 0) + (units.cruiser || 0);
}

function hasOwnVessel(cell) {
  const units = cell?.units?.[me] || {};
  return (units.boat || 0) > 0 || (units.cruiser || 0) > 0;
}

function hasHostileCruiser(cell) {
  return otherPlayerIds().some((id) => relationStatus(id) === "war" && (cell?.units?.[id]?.cruiser || 0) > 0);
}

function adjacentCoords(x, y) {
  return [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1]
  ].filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < state.width && ny < state.height);
}

function isPassableCell(cell) {
  return cell.terrain !== "water" || cell.building?.type === "bridge";
}

function distanceCells(a, b) {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

function cellKey(cell) {
  return `${cell.x}:${cell.y}`;
}

function centerHomeOnce(force = false) {
  if ((!force && centeredHome) || !state || !me || state.status !== "running") return;
  centeredHome = true;
  requestAnimationFrame(() => {
    const wrap = els.map.parentElement;
    if (!wrap) return;
    const homeCell = findHomeCell();
    if (!homeCell) {
      wrap.scrollLeft = me === "p2" ? els.map.scrollWidth : 0;
      return;
    }
    const width = state.width || 34;
    const height = state.height || 24;
    const cellWidth = els.map.scrollWidth / width;
    const cellHeight = els.map.scrollHeight / height;
    const left = (homeCell.x + 0.5) * cellWidth - wrap.clientWidth / 2;
    const top = (homeCell.y + 0.5) * cellHeight - wrap.clientHeight / 2;
    wrap.scrollTo({
      left: clamp(left, 0, Math.max(0, els.map.scrollWidth - wrap.clientWidth)),
      top: clamp(top, 0, Math.max(0, els.map.scrollHeight - wrap.clientHeight)),
      behavior: force ? "smooth" : "auto"
    });
  });
}

function findHomeCell() {
  if (!state?.map || !me) return null;
  for (const row of state.map) {
    for (const cell of row) {
      const buildingOwner = cell.building?.originalOwner || cell.building?.owner;
      if (cell.building?.type === "hq" && controlsOwner(buildingOwner)) return cell;
    }
  }
  for (const row of state.map) {
    for (const cell of row) {
      if (controlsCell(cell)) return cell;
    }
  }
  return null;
}

function formatUnits(units, hideSaboteur = false) {
  const parts = [];
  if (units.inf) parts.push(`${units.inf}⚔️`);
  if (units.rpg) parts.push(`${units.rpg} РПГ`);
  if (units.tank) parts.push("🚜");
  if (units.rocket) parts.push("🚀");
  if (units.aa) parts.push("🛡");
  if (units.aaPlus) parts.push("🛰");
  if (units.ew) parts.push("📡");
  if (units.mlrs) parts.push("🚚");
  if (units.drone) parts.push(`${units.drone}🛸`);
  if (units.saboteur && !hideSaboteur) parts.push(`${units.saboteur}🕵`);
  if (units.boat) parts.push("🚤");
  if (units.cruiser) parts.push("🚢");
  return parts.join(" ");
}

function fmt(value) {
  return Number.isInteger(value) ? value : value.toFixed(1);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.remove("hidden");
  toastTimer = setTimeout(() => els.toast.classList.add("hidden"), 2200);
}

function loadTheme() {
  try {
    return localStorage.getItem("paperWarsTheme") || "light";
  } catch (error) {
    return "light";
  }
}

function currentTheme() {
  return document.documentElement.dataset.theme || "light";
}

function applyTheme(theme) {
  const normalized = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = normalized;
  if (els.themeButton) {
    els.themeButton.textContent = normalized === "dark" ? "☀" : "☾";
    els.themeButton.title = normalized === "dark" ? "Светлая тема" : "Темная тема";
  }
  if (els.lobbyThemeButton) {
    els.lobbyThemeButton.textContent = normalized === "dark" ? "☀" : "☾";
    els.lobbyThemeButton.title = normalized === "dark" ? "Светлая тема" : "Темная тема";
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = normalized === "dark" ? "#161719" : "#f7f3ea";
  try {
    localStorage.setItem("paperWarsTheme", normalized);
  } catch (error) {}
}

function bindMapGestures() {
  const wrap = els.map.parentElement;

  wrap.addEventListener("pointerdown", (event) => {
    activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (activePointers.size === 2) {
      // Block browser scroll while pinching
      wrap.style.touchAction = "none";
      const points = Array.from(activePointers.values());
      pinchStartDistance = pointerDistance(points[0], points[1]);
      pinchStartZoom = mapZoom;
    }
  }, { passive: true });

  wrap.addEventListener("pointermove", (event) => {
    if (!activePointers.has(event.pointerId)) return;
    activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (activePointers.size !== 2 || !pinchStartDistance) return;
    const points = Array.from(activePointers.values());
    const nextDistance = pointerDistance(points[0], points[1]);
    setMapZoom(pinchStartZoom * (nextDistance / pinchStartDistance));
  }, { passive: true });

  for (const type of ["pointerup", "pointercancel", "pointerleave"]) {
    wrap.addEventListener(type, (event) => {
      activePointers.delete(event.pointerId);
      if (activePointers.size < 2) {
        pinchStartDistance = 0;
        // Restore native scroll when back to 0 or 1 finger
        wrap.style.touchAction = "pan-x pan-y";
      }
    }, { passive: true });
  }

  wrap.addEventListener("wheel", (event) => {
    if (!event.ctrlKey) return;
    event.preventDefault();
    setMapZoom(mapZoom + (event.deltaY < 0 ? 0.12 : -0.12));
  }, { passive: false });
}

function pointerDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function setMapZoom(value) {
  const nextZoom = clamp(value, 0.72, 2.8);
  if (Math.abs(nextZoom - mapZoom) < 0.001) return;
  mapZoom = nextZoom;
  els.map.style.setProperty("--map-zoom", mapZoom.toFixed(2));
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

function noticeDisconnectedOpponent() {
  if (!state || !me || state.status !== "running") return;
  const offline = Object.values(state.players || {})
    .filter((player) => player && !player.isBot && player.id !== me && !player.connected)
    .map((player) => player.country)
    .join(", ");
  if (offline && offline !== lastDisconnectNotice) {
    lastDisconnectNotice = offline;
    showToast(`${offline} вышел из браузера, ожидается возвращение.`);
  }
  if (!offline) {
    lastDisconnectNotice = "";
  }
}

function rememberCooldowns() {
  if (!state?.players) return;
  const now = Date.now();
  for (const player of Object.values(state.players)) {
    if (!player) continue;
    cooldownEnds[player.id] = cooldownEnds[player.id] || {};
    for (const [key, seconds] of Object.entries(player.cooldowns || {})) {
      cooldownEnds[player.id][key] = now + Math.max(0, seconds || 0) * 1000;
    }
    cooldownEnds[player.id].specialOp = now + Math.max(0, player.specialOpCooldown || 0) * 1000;
    if (player.hqDestroyed && player.hqRebuild > 0) {
      hqRebuildEnds[player.id] = now + player.hqRebuild * 1000;
    } else {
      delete hqRebuildEnds[player.id];
    }
  }
}

function liveCooldown(playerId, key, fallback = 0) {
  const until = cooldownEnds[playerId]?.[key];
  if (!until) return fallback || 0;
  return Math.max(0, Math.ceil((until - Date.now()) / 1000));
}

function liveHqRebuild(playerId, fallback = 0) {
  const until = hqRebuildEnds[playerId];
  if (!until) return fallback || 0;
  return Math.max(0, Math.ceil((until - Date.now()) / 1000));
}

function liveCellCooldown(cell, playerId, weapon) {
  const until = cell?.cooldowns?.[playerId]?.[weapon] || 0;
  return Math.max(0, Math.ceil((until - serverNow()) / 1000));
}

function cellWeaponCooldownReady(cell, playerId, weapon) {
  return liveCellCooldown(cell, playerId, weapon) <= 0;
}

function serverNow() {
  return Date.now() - serverClockOffset;
}

function weaponName(weapon) {
  return { rpg: "Гранатометчик", tank: "Танк", rocket: "Ракета", mlrs: "РСЗО", cruiser: "Крейсер" }[weapon] || "Орудие";
}

function updateLivePanels() {
  if (!state || els.game.classList.contains("hidden")) return;
  renderWorldEventStatus();
  renderPanels();
  renderMapMovePad();
  if (activeTab === "actions" || pending) {
    renderSelection();
  }
  if (statsOpen) renderStatsOverlay();
}

function getSfxContext() {
  if (audioCtx) return audioCtx;
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) return null;
  audioCtx = new AudioContextCtor();
  return audioCtx;
}

function unlockSfxAudio() {
  const ctx = getSfxContext();
  if (!ctx) return;
  sfxUnlocked = true;
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
}

function playSfx(name, detail = {}) {
  const ctx = getSfxContext();
  if (!ctx || !sfxUnlocked) return;
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  if (name === "hire") playHireSfx(ctx, detail);
  if (name === "demolish") playDemolishSfx(ctx);
  if (name === "diplomacy") playDiplomacySfx(ctx);
  if (name === "alert") playAlertSfx(ctx);
  if (name === "shot") playShotSfx(ctx, detail.weapon);
  if (name === "misfire") playMisfireSfx(ctx);
  if (name === "explosion") playExplosionSfx(ctx, detail.size);
  if (name === "nuke") playNukeSfx(ctx);
}

function playExplosionBatch(batch = []) {
  if (!batch.length) return;
  const now = Date.now();
  if (now - lastExplosionSfxAt < 90) return;
  lastExplosionSfxAt = now;

  const kinds = new Set(batch.map((explosion) => explosion.kind));
  if ([...kinds].every((kind) => kind === "epidemic")) return;
  if (kinds.has("nuke")) {
    playSfx("explosion", { size: "huge" });
  } else if (kinds.has("mlrs") || kinds.has("cruiser")) {
    playSfx("explosion", { size: "medium" });
  } else if (kinds.has("rocket")) {
    playSfx("explosion", { size: "big" });
  } else if (kinds.has("tank")) {
    playSfx("explosion", { size: "small" });
  } else {
    playSfx("explosion", { size: "tiny" });
  }
}

function playHireSfx(ctx, detail = {}) {
  const now = ctx.currentTime;
  const boat = detail.unit === "boat" || detail.unit === "cruiser";
  tone(ctx, boat ? 260 : 520, boat ? 180 : 680, 0.09, "triangle", 0.07, now);
  tone(ctx, boat ? 180 : 680, boat ? 130 : 420, 0.11, "triangle", 0.06, now + 0.1);
  noise(ctx, 0.08, 0.04, now + 0.03, boat ? "lowpass" : "highpass", boat ? 480 : 1600);
}

function playDemolishSfx(ctx) {
  const now = ctx.currentTime;
  tone(ctx, 180, 62, 0.22, "square", 0.12, now);
  noise(ctx, 0.24, 0.16, now, "lowpass", 520);
}

function playDiplomacySfx(ctx) {
  const now = ctx.currentTime;
  tone(ctx, 520, 660, 0.08, "sine", 0.05, now);
  tone(ctx, 660, 880, 0.12, "sine", 0.05, now + 0.09);
}

function playAlertSfx(ctx) {
  const now = ctx.currentTime;
  tone(ctx, 360, 240, 0.12, "square", 0.08, now);
  tone(ctx, 360, 220, 0.12, "square", 0.08, now + 0.18);
}

function playShotSfx(ctx, weapon = "tank") {
  const now = ctx.currentTime;
  if (weapon === "rocket") {
    noise(ctx, 0.05, 0.28, now, "highpass", 2200);
    noise(ctx, 0.42, 0.16, now + 0.02, "bandpass", 760);
    tone(ctx, 430, 82, 0.46, "sawtooth", 0.18, now);
    tone(ctx, 78, 34, 0.22, "square", 0.12, now + 0.08);
    return;
  }
  if (weapon === "mlrs") {
    for (let index = 0; index < 5; index += 1) {
      const at = now + index * 0.055;
      noise(ctx, 0.035, 0.18, at, "highpass", 2400);
      noise(ctx, 0.12, 0.08, at, "bandpass", 820);
      tone(ctx, 260, 66, 0.16, "sawtooth", 0.1, at);
    }
    return;
  }
  if (weapon === "cruiser") {
    for (let index = 0; index < 2; index += 1) {
      const at = now + index * 0.11;
      noise(ctx, 0.06, 0.22, at, "highpass", 2100);
      noise(ctx, 0.26, 0.12, at + 0.01, "lowpass", 520);
      tone(ctx, 120, 30, 0.24, "square", 0.2, at);
    }
    return;
  }
  if (weapon === "rpg") {
    noise(ctx, 0.04, 0.2, now, "highpass", 2400);
    noise(ctx, 0.22, 0.14, now + 0.015, "lowpass", 520);
    tone(ctx, 150, 42, 0.2, "square", 0.2, now);
    return;
  }
  noise(ctx, 0.035, 0.3, now, "highpass", 2600);
  noise(ctx, 0.18, 0.2, now, "lowpass", 560);
  tone(ctx, 118, 34, 0.22, "square", 0.25, now);
  tone(ctx, 44, 28, 0.24, "sine", 0.1, now + 0.04);
}

function playMisfireSfx(ctx) {
  const now = ctx.currentTime;
  noise(ctx, 0.04, 0.14, now, "highpass", 3600);
  tone(ctx, 900, 180, 0.08, "square", 0.05, now);
  tone(ctx, 120, 70, 0.12, "triangle", 0.04, now + 0.07);
}

function playExplosionSfx(ctx, size = "medium") {
  const now = ctx.currentTime;
  const scale = { tiny: 0.5, small: 0.82, medium: 1.18, big: 1.55, huge: 2.8 }[size] || 1;
  noise(ctx, 0.035, 0.34 * Math.min(scale, 1.8), now, "highpass", 1800);
  noise(ctx, 0.34 * scale, 0.24 * scale, now + 0.01, "lowpass", 360 / Math.max(0.7, scale));
  tone(ctx, 96, 24, 0.32 * scale, "triangle", 0.22 * scale, now);
  tone(ctx, 48, 18, 0.58 * scale, "sine", 0.12 * scale, now + 0.05);
  if (scale > 1.1) {
    noise(ctx, 0.75 * Math.min(scale, 2.2), 0.1 * scale, now + 0.16, "lowpass", 150);
  }
  if (scale > 2) {
    tone(ctx, 30, 15, 1.4, "sawtooth", 0.13 * scale, now + 0.24);
  }
}

function playNukeSfx(ctx) {
  const now = ctx.currentTime;
  noise(ctx, 0.08, 0.42, now, "highpass", 2600);
  tone(ctx, 540, 1080, 0.26, "sine", 0.1, now);
  tone(ctx, 1080, 280, 0.52, "sine", 0.11, now + 0.2);
  tone(ctx, 86, 14, 1.85, "sawtooth", 0.34, now + 0.3);
  tone(ctx, 32, 12, 2.25, "sine", 0.28, now + 0.5);
  noise(ctx, 2.15, 0.34, now + 0.32, "lowpass", 170);
  noise(ctx, 1.1, 0.16, now + 0.9, "bandpass", 90);
}

function tone(ctx, from, to, duration, type, volume, start) {
  const oscillator = ctx.createOscillator();
  const gain = envelope(ctx, start, volume, 0.01, duration);
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(Math.max(1, from), start);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, to), start + duration);
  oscillator.connect(gain);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}

function noise(ctx, duration, volume, start, filterType, frequency) {
  const sampleCount = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < sampleCount; index += 1) {
    const fade = 1 - index / sampleCount;
    data[index] = (Math.random() * 2 - 1) * fade;
  }

  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = envelope(ctx, start, volume, 0.005, duration);
  source.buffer = buffer;
  filter.type = filterType;
  filter.frequency.setValueAtTime(frequency, start);
  source.connect(filter);
  filter.connect(gain);
  source.start(start);
  source.stop(start + duration + 0.03);
}

function envelope(ctx, start, volume, attack, duration) {
  const gain = ctx.createGain();
  const peak = Math.max(0.0001, volume * MASTER_SFX_VOLUME);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.linearRampToValueAtTime(peak, start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + Math.max(attack + 0.01, duration));
  gain.connect(ctx.destination);
  return gain;
}

function toggleMusic() {
  unlockSfxAudio();
  if (music.paused) {
    if (!music.src) {
      loadCurrentMusicTrack();
    }
    setMusicStatus("loading");
    music.play().then(() => {
      setMusicStatus("on");
    }).catch(() => {
      setMusicStatus("");
      showToast("Браузер заблокировал звук до первого тапа.");
    });
  } else {
    music.pause();
    setMusicStatus("off");
  }
}

function setMusicStatus(status = "") {
  const lobbyLabels = {
    loading: "♪ ...",
    on: "♪ on",
    off: "♪ off",
    "": "♪"
  };
  const topLabels = {
    loading: "♪ ...",
    on: "♪ on",
    off: "♪ off",
    "": "♪"
  };
  if (els.lobbyMusic) {
    els.lobbyMusic.textContent = lobbyLabels[status] || "♪";
    els.lobbyMusic.title = status === "on" ? "Музыка включена" : status === "off" ? "Музыка выключена" : "Музыка";
  }
  if (els.gameMusic) {
    els.gameMusic.textContent = topLabels[status] || topLabels[""];
    els.gameMusic.title = status === "on" ? "Музыка включена" : status === "off" ? "Музыка выключена" : "Музыка";
  }
}

function updateTopButtons() {
  if (els.lobbyMusic) {
    els.lobbyMusic.textContent = music.paused ? "♪" : "♪ on";
    els.lobbyMusic.title = music.paused ? "Музыка" : "Музыка включена";
  }
  if (els.gameMusic) {
    els.gameMusic.textContent = music.paused ? "♪" : "♪ on";
    els.gameMusic.title = music.paused ? "Музыка" : "Музыка включена";
  }
}

function loadMusicPlaylist() {
  fetch("/api/music", { cache: "no-store" })
    .then((response) => response.ok ? response.json() : null)
    .then((data) => {
      if (Array.isArray(data?.playlist) && data.playlist.length) {
        musicPlaylist = data.playlist;
        musicIndex = 0;
        if (!music.paused) {
          loadCurrentMusicTrack();
          music.play().catch(() => {});
        }
      }
    })
    .catch(() => {});
}

function loadCurrentMusicTrack() {
  const src = musicPlaylist[musicIndex % musicPlaylist.length] || "/music/theme.mp3";
  if (music.src.endsWith(src)) return;
  music.src = src;
  music.load();
}

function playNextMusic() {
  if (!musicPlaylist.length) return;
  musicIndex = (musicIndex + 1) % musicPlaylist.length;
  loadCurrentMusicTrack();
  music.play().catch(() => {});
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function unitIconHtml(kind, size = "inline") {
  const unit = UNIT_DEFS[kind] || {};
  return `<span class="unit-icon-text unit-icon-text--${escapeHtml(size)}">${escapeHtml(unit.icon || "")}</span>`;
}

window.__paperMusicToggle = toggleMusic;
