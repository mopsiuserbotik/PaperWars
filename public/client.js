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
  rocket: { name: "Ракета", icon: "🚀", cost: "1👤 28💰 12⚙️ · 1.5с" },
  aa: { name: "ПВО", icon: "🛡", cost: "1👤 22💰 8⚙️ · 1.5с" },
  aaPlus: { name: "ПВО+", icon: "🛰", cost: "2👤 55💰 18⚙️ 4☢ · 1.5с" },
  ew: { name: "РЭБ", icon: "📡", cost: "10💰 2⚙️ · 1.5с" },
  mlrs: { name: "РСЗО", icon: "🚚", cost: "3👤 70💰 28⚙️" },
  drone: { name: "Дрон", icon: "🛸", cost: "16💰 4⚙️ 3💣" },
  pickup: { name: "Пикап", icon: "🚗", cost: "1👤 22💰 6⚙️ 2💣" },
  saboteur: { name: "Шахед", icon: "🛩", cost: "нужен 🏭 · 1👤 45💰 6⚙️ 4💣 · кд" },
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
const LAUNCH_COSTS = {
  nuke: { gold: 90, iron: 30, uranium: 20, pop: 3 },
  shahed: { pop: 1, gold: 45, iron: 6, ammo: 4 }
};
const BUILDING_COSTS = {
  hq: { gold: 100 },
  village: { gold: 5 },
  city: { gold: 12 },
  barracks: { gold: 8 },
  mine: { gold: 10 },
  minePlus: { gold: 35 },
  farm: { gold: 5 },
  port: { gold: 15 },
  bridge: { gold: 20 },
  factory: { gold: 30 },
  ammoDepot: { gold: 5 },
  bunker: { gold: 22, iron: 8 },
  hospital: { gold: 13 },
  tck: { gold: 24 },
  counterIntel: { gold: 120 },
  nuclearPlant: { gold: 150 }
};
const UNIT_COSTS = {
  inf: { pop: 1, gold: 2 },
  rpg: { pop: 1, gold: 6, iron: 1, ammo: 1 },
  tank: { pop: 2, gold: 18, iron: 8 },
  rocket: { pop: 1, gold: 28, iron: 12 },
  aa: { pop: 1, gold: 22, iron: 8 },
  aaPlus: { pop: 2, gold: 55, iron: 18, uranium: 4 },
  ew: { gold: 10, iron: 2 },
  mlrs: { pop: 3, gold: 70, iron: 28 },
  drone: { gold: 16, iron: 4, ammo: 3 },
  pickup: { pop: 1, gold: 22, iron: 6, ammo: 2 },
  boat: { pop: 1, gold: 12, iron: 5 },
  cruiser: { pop: 2, gold: 55, iron: 24 }
};

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
  pickup: "Пикап",
  saboteur: "Шахед",
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
  pickup: "Пикап"
};
const SCRAPPABLE_UNITS = ["inf", "rpg", "tank", "rocket", "aa", "aaPlus", "ew", "mlrs", "drone", "pickup", "boat", "cruiser"];
const STATIC_DEPLOY_UNITS = new Set(["rocket", "aa", "aaPlus", "ew"]);
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

const LOBBY_MAP_DEFS = {
  standard: {
    name: "Стандарт",
    info: "Реки, озера и привычная плотность ресурсов.",
    tags: ["реки", "озера", "баланс"]
  },
  islands: {
    name: "Острова",
    info: "Вода вокруг, остров 5x5 на страну, уран, золото и железо на каждом острове.",
    tags: ["5x5", "вода", "доход +"]
  },
  noWater: {
    name: "Без воды",
    info: "Стандартная суша без рек и озер, ресурсов на карте больше.",
    tags: ["суша", "без флота", "ресурсы +"]
  }
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
  lobbyHome: document.querySelector("#lobbyHome"),
  lobbyStartButtons: document.querySelectorAll("[data-lobby-start]"),
  lobbyBack: document.querySelector("#lobbyBack"),
  lobbySteps: document.querySelector("#lobbySteps"),
  lobbyStepButtons: document.querySelectorAll("[data-lobby-step]"),
  lobbySections: document.querySelectorAll("[data-lobby-section]"),
  lobbyPlayerCountField: document.querySelector("#lobbyPlayerCountField"),
  lobbyPlayerCountInput: document.querySelector("#lobbyPlayerCountInput"),
  lobbyPlayerCountChoices: document.querySelector("#lobbyPlayerCountChoices"),
  lobbyPlayerSlots: document.querySelector("#lobbyPlayerSlots"),
  lobbyCodeField: document.querySelector("#lobbyCodeField"),
  lobbyCodeInput: document.querySelector("#lobbyCodeInput"),
  lobbySettings: document.querySelector("#lobbySettings"),
  lobbyPrevStep: document.querySelector("#lobbyPrevStep"),
  lobbyNextStep: document.querySelector("#lobbyNextStep"),
  lobbySubmit: document.querySelector("#lobbySubmit"),
  lobbyNotice: document.querySelector("#lobbyNotice"),
  connectionStatus: document.querySelector("#connectionStatus"),
  lobbyThemeButton: document.querySelector("#lobbyThemeButton"),
  map: document.querySelector("#map"),
  mapMovePad: document.querySelector("#mapMovePad"),
  mapTools: document.querySelector("#mapTools"),
  statsButton: document.querySelector("#statsButton"),
  quickStatus: document.querySelector("#quickStatus"),
  eventBanner: document.querySelector("#eventBanner"),
  worldEventStatus: document.querySelector("#worldEventStatus"),
  targetPrompt: document.querySelector("#targetPrompt"),
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
  journalOpen: document.querySelector("#journalOpen"),
  journalDrawer: document.querySelector("#journalDrawer"),
  journalClose: document.querySelector("#journalClose"),
  journalLog: document.querySelector("#journalLog"),
  diplomacyPrompt: document.querySelector("#diplomacyPrompt"),
  modalLayer: document.querySelector("#modalLayer"),
  statsOverlay: document.querySelector("#statsOverlay"),
  statsClose: document.querySelector("#statsClose"),
  statsOverlayContent: document.querySelector("#statsOverlayContent"),
  soundButton: document.querySelector("#soundButton"),
  lobbySoundButton: document.querySelector("#lobbySoundButton"),
  themeButton: document.querySelector("#themeButton"),
  helpButton: document.querySelector("#helpButton"),
  lobbyHelpButton: document.querySelector("#lobbyHelpButton"),
  uiToggleButton: document.querySelector("#uiToggleButton"),
  exitButton: document.querySelector("#exitButton"),
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
let lobbyStep = "home";
let lobbyFormStep = "room";
let lobbySettings = null;
let lobbyMapPreview = "standard";
let selected = null;
let pendingMoveSelection = null;
let activeTab = "troops";
let pending = null;
let moveInf = 0;
let moveRpg = true;
let moveTank = true;
let moveMlrs = true;
let moveEw = false;
let moveCruiser = true;
let moveDrone = false;
let movePickup = true;
let explosions = [];
let nukeSmokes = [];
let impactSmokes = [];
let shotEffects = [];
let flightEffects = [];
const flightSfxStops = new Map();
let captureEffects = [];
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
let renderedJournalKey = "";
let renderedQuickStatusKey = "";
let renderedWorldEventKey = "";
let renderedStatsKey = "";
let renderedChatButtonKey = "";
let renderedJournalButtonKey = "";
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
let interfaceHidden = false;
const SFX_NAMES = [
  "attack", "drone", "drone_run", "d_house", "d_tehnika", "fail", "kreyser", "money", "osechka", "pikap", "pvo", "rain", "raketa", "reb",
  "rpg", "rszo", "rszo_hit", "rszo_shot", "shahed", "soyuz", "stroyka", "tank", "tank_shot", "war", "win", "yaderka"
];
const POSITIONAL_VOLUME_EXEMPT = new Set(["fail", "money", "rain", "shahed", "soyuz", "war", "win", "yaderka"]);
const SFX_PLAY_LIMIT_MS = {
  drone_run: 2000,
  pikap: 2000,
  tank: 2000
};
const MAX_SFX_OVERLAP_PER_NAME = 8;
let eventSfxSources = Object.fromEntries(SFX_NAMES.map((name) => [name, `/sfx/${name}.mp3`]));
const eventSfxPlayers = {};
const activeEventSfx = {};
let rainAmbientPlayer = null;
let sfxUnlocked = false;
let lastNukeRequestAt = 0;
let lastShahedRequestAt = 0;
let pendingJoinPayload = null;
let lastChatId = null;
let mapBubbles = [];
let unreadChatCount = 0;
let unreadJournalCount = 0;
let statsOpen = false;
let lastDisconnectNotice = "";
let mapZoom = 1;
let lastMapSyncRequestAt = 0;
let modalSubmitHandler = null;
let devUnlocked = false;
const activePointers = new Map();
let pinchStartDistance = 0;
let pinchStartZoom = 1;

const MAX_CLIENT_BUFFERED_BYTES = 64 * 1024;
const LOW_POWER_DEVICE = (navigator.hardwareConcurrency || 4) <= 4;
const MAX_EXPLOSIONS_ON_MAP = LOW_POWER_DEVICE ? 18 : 32;
const MAX_IMPACT_SMOKES_ON_MAP = LOW_POWER_DEVICE ? 20 : 40;
const MAX_NUKE_SMOKES_ON_MAP = LOW_POWER_DEVICE ? 18 : 36;
const MAX_SHOTS_ON_MAP = LOW_POWER_DEVICE ? 8 : 12;
const NUKE_SMOKE_MS = 8500;
const NUKE_CLIENT_THROTTLE_MS = 900;
const SHAHED_CLIENT_THROTTLE_MS = 900;
const SHAHED_FLIGHT_MS = 17040;
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
const CAPTURE_EFFECT_MS = 6000;
const HTTP_KEEPALIVE_INTERVAL_MS = 25_000;
let CLIENT_TOKEN = "";
let sfxEnabled = true;
let heldLobbyMessage = null;
let heldLobbyNoticeAt = 0;
let httpKeepAliveTimer = null;
let allowLobbyAfterRoomClosed = false;

function ensureDynamicUi() {
  if (!els.soundButton) {
    const topTools = document.querySelector(".top-tools");
    if (topTools) {
      els.soundButton = document.createElement("button");
      els.soundButton.id = "soundButton";
      els.soundButton.className = "top-tool";
      els.soundButton.type = "button";
      topTools.prepend(els.soundButton);
    }
  }

  if (!els.lobbySoundButton) {
    const lobbyTools = document.querySelector(".lobby-tools");
    if (lobbyTools) {
      els.lobbySoundButton = document.createElement("button");
      els.lobbySoundButton.id = "lobbySoundButton";
      els.lobbySoundButton.className = "top-tool";
      els.lobbySoundButton.type = "button";
      lobbyTools.prepend(els.lobbySoundButton);
    }
  }

  if (!els.lobbyHelpButton) {
    const lobbyTools = document.querySelector(".lobby-tools");
    if (lobbyTools) {
      els.lobbyHelpButton = document.createElement("button");
      els.lobbyHelpButton.id = "lobbyHelpButton";
      els.lobbyHelpButton.className = "top-tool top-tool--info";
      els.lobbyHelpButton.type = "button";
      els.lobbyHelpButton.title = "\u0421\u043f\u0440\u0430\u0432\u043a\u0430";
      els.lobbyHelpButton.textContent = "i";
      const anchor = els.lobbyThemeButton || null;
      lobbyTools.insertBefore(els.lobbyHelpButton, anchor);
    }
  }

  if (!els.helpButton) {
    const topTools = document.querySelector(".top-tools");
    if (topTools) {
      els.helpButton = document.createElement("button");
      els.helpButton.id = "helpButton";
      els.helpButton.className = "top-tool top-tool--info";
      els.helpButton.type = "button";
      els.helpButton.title = "\u0421\u043f\u0440\u0430\u0432\u043a\u0430";
      els.helpButton.textContent = "i";
      const anchor = els.statsButton || els.exitButton || null;
      topTools.insertBefore(els.helpButton, anchor);
    }
  }

  if (!els.uiToggleButton) {
    const topTools = document.querySelector(".top-tools");
    if (topTools) {
      els.uiToggleButton = document.createElement("button");
      els.uiToggleButton.id = "uiToggleButton";
      els.uiToggleButton.className = "top-tool top-tool--eye";
      els.uiToggleButton.type = "button";
      els.uiToggleButton.title = "\u0421\u043a\u0440\u044b\u0442\u044c \u0438\u043d\u0442\u0435\u0440\u0444\u0435\u0439\u0441";
      els.uiToggleButton.setAttribute("aria-pressed", "false");
      els.uiToggleButton.innerHTML = '<span class="eye-icon" aria-hidden="true"></span>';
      const anchor = els.statsButton || els.exitButton || null;
      topTools.insertBefore(els.uiToggleButton, anchor);
    }
  }

  if (!els.journalOpen) {
    const battlefield = document.querySelector(".battlefield");
    if (battlefield) {
      els.journalOpen = document.createElement("button");
      els.journalOpen.id = "journalOpen";
      els.journalOpen.className = "journal-toggle";
      els.journalOpen.type = "button";
      els.journalOpen.setAttribute("aria-controls", "journalDrawer");
      els.journalOpen.textContent = "\u0416\u0443\u0440\u043d\u0430\u043b";
      battlefield.append(els.journalOpen);
    }
  }

  if (!els.journalDrawer) {
    els.journalDrawer = document.createElement("section");
    els.journalDrawer.id = "journalDrawer";
    els.journalDrawer.className = "journal-drawer hidden";
    els.journalDrawer.innerHTML = `
      <header class="chat-head">
        <strong>\u0411\u043e\u0435\u0432\u043e\u0439 \u0436\u0443\u0440\u043d\u0430\u043b</strong>
        <button id="journalClose" type="button">&times;</button>
      </header>
      <div id="journalLog" class="chat-log"></div>
    `;
    els.chatDrawer?.after(els.journalDrawer);
    els.journalClose = els.journalDrawer.querySelector("#journalClose");
    els.journalLog = els.journalDrawer.querySelector("#journalLog");
  }
}

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
    if (!hasRunningMatchState()) {
      stopHttpKeepAlive();
    }
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
  startHttpKeepAlive();
}

function stopHeartbeat() {
  clearInterval(heartbeatTimer);
  heartbeatTimer = null;
}

function startHttpKeepAlive() {
  if (httpKeepAliveTimer) return;
  sendHttpKeepAlive();
  httpKeepAliveTimer = setInterval(sendHttpKeepAlive, HTTP_KEEPALIVE_INTERVAL_MS);
}

function stopHttpKeepAlive() {
  clearInterval(httpKeepAliveTimer);
  httpKeepAliveTimer = null;
}

function sendHttpKeepAlive() {
  if (!hasRunningMatchState() && socket?.readyState !== WebSocket.OPEN) return;
  fetch(`/healthz?client=${encodeURIComponent(CLIENT_TOKEN || "browser")}&t=${Date.now()}`, {
    cache: "no-store",
    keepalive: true
  }).catch(() => {});
}

function bindUi() {
  els.joinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const steps = visibleLobbyFormSteps();
    if (lobbyFormStep !== steps[steps.length - 1]) {
      if (validateLobbyFormStep(lobbyFormStep)) {
        lobbyFormStep = steps[Math.min(steps.length - 1, steps.indexOf(lobbyFormStep) + 1)];
        renderLobby();
      }
      return;
    }
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
      lobbyStep = "form";
      lobbyFormStep = "room";
      renderLobby();
    });
  });

  els.lobbyStartButtons?.forEach((button) => {
    button.addEventListener("click", () => {
      lobbyMode = button.dataset.lobbyStart || "create";
      lobbyStep = "form";
      lobbyFormStep = "room";
      renderLobby();
      requestAnimationFrame(() => (lobbyMode === "enter" ? els.lobbyCodeInput : els.lobbyPlayerCountInput)?.focus?.());
    });
  });

  els.lobbyBack?.addEventListener("click", () => {
    if (lobby?.players?.[me]?.joined) {
      openExitModal();
      return;
    }
    lobbyStep = "home";
    lobbyFormStep = "room";
    renderLobby();
  });

  els.lobbyStepButtons?.forEach((button) => {
    button.addEventListener("click", () => {
      const step = button.dataset.lobbyStep || "room";
      if (!visibleLobbyFormSteps().includes(step)) return;
      lobbyFormStep = step;
      renderLobby();
    });
  });

  els.lobbyPrevStep?.addEventListener("click", () => {
    const steps = visibleLobbyFormSteps();
    const index = steps.indexOf(lobbyFormStep);
    if (index <= 0) {
      lobbyStep = "home";
      lobbyFormStep = "room";
    } else {
      lobbyFormStep = steps[index - 1];
    }
    renderLobby();
  });

  els.lobbyNextStep?.addEventListener("click", () => {
    if (!validateLobbyFormStep(lobbyFormStep)) return;
    const steps = visibleLobbyFormSteps();
    const index = steps.indexOf(lobbyFormStep);
    if (index >= steps.length - 1) {
      els.joinForm?.requestSubmit?.();
      return;
    }
    lobbyFormStep = steps[index + 1];
    renderLobby();
  });

  els.lobbyPlayerCountInput?.addEventListener("input", () => {
    lobbySettings = readLobbySettings();
    renderLobbyPlayerCountChoices();
    renderLobbyPlayerSlots();
    renderLobbyNotice();
  });

  els.lobbyPlayerCountInput?.addEventListener("change", () => {
    setLobbyHumanCount(els.lobbyPlayerCountInput.value);
  });

  els.lobbyPlayerCountInput?.addEventListener("blur", () => {
    setLobbyHumanCount(els.lobbyPlayerCountInput.value);
  });

  els.lobbyPlayerCountChoices?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-lobby-player-count]");
    if (!button || button.disabled) return;
    setLobbyHumanCount(button.dataset.lobbyPlayerCount);
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
    const selectedMap = els.lobbySettings?.querySelector("[data-map-preset]:checked")?.value;
    if (selectedMap) lobbyMapPreview = selectedMap;
    renderLobbySettings();
  });

  els.lobbySettings?.addEventListener("click", (event) => {
    const previewButton = event.target.closest("[data-map-preview]");
    if (!previewButton) return;
    lobbySettings = readLobbySettings();
    lobbyMapPreview = previewButton.dataset.mapPreview || lobbySettings.mapType || "standard";
    renderLobbySettings();
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
  els.soundButton?.addEventListener("click", toggleSound);
  els.lobbySoundButton?.addEventListener("click", toggleSound);
  els.helpButton?.addEventListener("click", openHelpModal);
  els.lobbyHelpButton?.addEventListener("click", openHelpModal);
  els.uiToggleButton?.addEventListener("click", toggleInterfaceVisibility);

  els.statsButton?.addEventListener("click", () => {
    statsOpen = !statsOpen;
    renderStatsOverlay();
  });

  els.statsClose?.addEventListener("click", () => {
    statsOpen = false;
    renderStatsOverlay();
  });

  els.exitButton?.addEventListener("click", openExitModal);

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

  els.tabContent.addEventListener("change", handleMoveOptionChange);
  els.mapMovePad?.addEventListener("change", handleMoveOptionChange);

  els.chatOpen.addEventListener("click", () => toggleChat());
  els.journalOpen?.addEventListener("click", () => toggleJournal());

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
  els.journalClose?.addEventListener("click", () => {
    closeJournal();
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
      ultimatumId: button.dataset.ultimatumId,
      capitulationId: button.dataset.capitulationId
    }, { priority: true });
  });

  els.modalLayer.addEventListener("click", handleModalClick);
  els.modalLayer.addEventListener("change", handleModalChange);

  bindMapGestures();
  els.continueBotsButton?.addEventListener("click", () => send({ type: "continueBots" }, { priority: true }));
  els.restartButton.addEventListener("click", () => send({ type: "restart" }, { priority: true }));
  document.addEventListener("pointerdown", unlockSfxAudio, { passive: true });
  document.addEventListener("keydown", unlockSfxAudio);
}

function handleMoveOptionChange(event) {
  const toggle = event.target.closest("[data-move-toggle]");
  if (!toggle) return;

  if (toggle.dataset.moveToggle === "rpg") moveRpg = toggle.checked;
  if (toggle.dataset.moveToggle === "tank") moveTank = toggle.checked;
  if (toggle.dataset.moveToggle === "mlrs") moveMlrs = toggle.checked;
  if (toggle.dataset.moveToggle === "ew") moveEw = toggle.checked;
  if (toggle.dataset.moveToggle === "cruiser") moveCruiser = toggle.checked;
  if (toggle.dataset.moveToggle === "drone") moveDrone = toggle.checked;
  if (toggle.dataset.moveToggle === "pickup") movePickup = toggle.checked;
  renderGame();
}

function handleServerMessage(message) {
  if (message.type === "roomClosed") {
    pendingJoinPayload = null;
    allowLobbyAfterRoomClosed = true;
    clearHeldLobbyMessage();
    stopHttpKeepAlive();
    lobbyStep = "home";
    showToast(message.message || "Комната удалена.");
    return;
  }

  if (message.type === "full") {
    serverFull = true;
    clearTimeout(reconnectTimer);
    stopHeartbeat();
    stopHttpKeepAlive();
    els.connectionStatus.textContent = message.message || "Сервер заполнен.";
    showToast(message.message || "Сервер заполнен.");
    try {
      socket?.close();
    } catch (error) {}
    return;
  }

  if (message.type === "hello") {
    if (message.playerId || !hasRunningMatchState()) {
      me = message.playerId;
      spectator = message.spectator;
    }
    if (message.sfx) {
      updateEventSfxSources(message.sfx);
    }
  }

  if (message.type === "lobby") {
    if (shouldHoldLobbyDuringMatchRestore(message)) return;
    allowLobbyAfterRoomClosed = false;
    stopHttpKeepAlive();
    lobby = message;
    if (!lobbySettings || lobby.players?.[me]?.joined) {
      lobbySettings = normalizeLobbySettings(lobby.settings);
    }
    if (!lobby.created && !lobby.players?.[me]?.joined && !pendingJoinPayload) {
      lobbyStep = "home";
    }
    if (lobby.players?.[me]?.joined || pendingJoinPayload) {
      lobbyStep = "form";
    }
    if (lobby.created && me !== lobby.hostId && !lobby.players?.[me]?.joined && lobbyStep !== "home") {
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
    renderedJournalKey = "";
    renderedQuickStatusKey = "";
    renderedWorldEventKey = "";
    renderedStatsKey = "";
    renderedChatButtonKey = "";
    renderedJournalButtonKey = "";
    renderedDiplomacyPromptKey = "";
    renderedEndOverlayKey = "";
    mapBubbles = [];
    statsOpen = false;
    setInterfaceHidden(false);
    nukeSmokes = [];
    impactSmokes = [];
    shotEffects = [];
    flightEffects = [];
    stopAllFlightSfx();
    stopRainAmbientSfx();
    hqRebuildEnds = {};
    unreadChatCount = 0;
    unreadJournalCount = 0;
    closeChat();
    closeJournal();
    els.lobby.classList.remove("hidden");
    els.game.classList.add("hidden");
    renderLobby();
  }

  if (message.type === "start") {
    clearHeldLobbyMessage();
    pendingJoinPayload = null;
    selected = null;
    pendingMoveSelection = null;
    pending = null;
    centeredHome = false;
    moveSelectionKey = null;
    resetMapDom(true);
    renderedControlsKey = "";
    renderedChatKey = "";
    renderedJournalKey = "";
    renderedQuickStatusKey = "";
    renderedWorldEventKey = "";
    renderedStatsKey = "";
    renderedChatButtonKey = "";
    renderedJournalButtonKey = "";
    renderedDiplomacyPromptKey = "";
    renderedEndOverlayKey = "";
    mapBubbles = [];
    statsOpen = false;
    setInterfaceHidden(false);
    nukeSmokes = [];
    impactSmokes = [];
    shotEffects = [];
    flightEffects = [];
    stopAllFlightSfx();
    stopRainAmbientSfx();
    hqRebuildEnds = {};
    unreadChatCount = 0;
    unreadJournalCount = 0;
    closeChat();
    closeJournal();
    showToast("Матч начался.");
  }

  if (message.type === "state") {
    clearHeldLobbyMessage();
    allowLobbyAfterRoomClosed = false;
    pendingJoinPayload = null;
    const previousState = state;
    const previousMap = previousState?.map || null;
    const previousChat = previousState?.chat || [];
    const previousJournal = previousState?.journal || [];
    const nextMap = message.state.map || applyMapPatch(previousMap, message.state.mapPatch, previousState?.mapVersion);
    syncCaptureEffects(previousMap, nextMap, previousState?.players || {}, message.state.players || previousState?.players || {});
    state = {
      ...message.state,
      map: nextMap || previousMap || [],
      chat: message.state.chat || previousChat,
      journal: message.state.journal || previousJournal
    };
    me = message.you || me;
    spectator = message.spectator;
    serverClockOffset = Date.now() - (state.serverTime || Date.now());
    applyPendingMoveSelection();
    rememberCooldowns();
    noticeDisconnectedOpponent();
    syncAmbientSfx();
    if (hasRunningMatchState()) {
      startHttpKeepAlive();
    } else {
      stopHttpKeepAlive();
    }
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

  if (message.type === "flight") {
    addFlightEffect(message);
  }

  if (message.type === "flightCancel") {
    flightEffects = flightEffects.filter((flight) => flight.id !== message.id);
    stopFlightSfx(message.id);
    refreshMapEffects(250);
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
              upsertNukeSmoke({ id: `${explosion.id}:${x}:${y}`, x, y, at: now, until: now + NUKE_SMOKE_MS });
            }
          }
        }
      } else if (explosion.kind !== "epidemic") {
        impactSmokes.push({ id: `${explosion.id}:smoke`, x: explosion.x, y: explosion.y, kind: explosion.kind, at: now, until: now + smokeMs });
      }
    }
    nukeSmokes = nukeSmokes.slice(-MAX_NUKE_SMOKES_ON_MAP);
    impactSmokes = impactSmokes.slice(-MAX_IMPACT_SMOKES_ON_MAP);
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

  if (message.type === "journal") {
    if (state) {
      state.journal = message.journal;
      state.journalVersion = message.journalVersion ?? state.journalVersion;
      showEventBanner(message.entry?.text || "");
      if (els.journalDrawer?.classList.contains("hidden")) {
        unreadJournalCount += 1;
      } else {
        unreadJournalCount = 0;
      }
      renderJournal();
      updateJournalButton();
    }
  }

  if (message.type === "error" || message.type === "info") {
    showToast(message.message);
  }
}

function hasRunningMatchState() {
  return state?.status === "running" && !state?.ended;
}

function shouldHoldLobbyDuringMatchRestore(message) {
  if (message?._forceLobby || allowLobbyAfterRoomClosed || !hasRunningMatchState()) return false;
  const myLobbyPlayer = me ? message.players?.[me] : null;
  const emptyLobby = !message.created && !myLobbyPlayer?.joined;
  if (!emptyLobby) return false;

  heldLobbyMessage = message;
  startHttpKeepAlive();
  els.connectionStatus.textContent = "Восстанавливаем матч...";
  const now = Date.now();
  if (now - heldLobbyNoticeAt > 8000) {
    heldLobbyNoticeAt = now;
    showToast("Связь с сервером восстанавливается, карта остается на экране.");
  }
  return true;
}

function clearHeldLobbyMessage() {
  heldLobbyMessage = null;
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

function applyMapPatch(previousMap, patch, previousVersion) {
  if (!patch) return null;
  if (!previousMap || patch.fromVersion !== previousVersion || !Array.isArray(patch.cells)) {
    requestFullMapSync();
    return previousMap || null;
  }

  const nextMap = previousMap.map((row) => row.slice());
  for (const cell of patch.cells) {
    const x = Number(cell?.x);
    const y = Number(cell?.y);
    if (!Number.isInteger(x) || !Number.isInteger(y) || !nextMap[y]) continue;
    nextMap[y][x] = cell;
  }
  return nextMap;
}

function syncCaptureEffects(previousMap, nextMap, previousPlayers = {}, nextPlayers = {}) {
  if (!Array.isArray(previousMap) || !Array.isArray(nextMap)) return;
  const now = Date.now();
  const nextEffects = [];

  for (let y = 0; y < nextMap.length; y += 1) {
    const previousRow = previousMap[y];
    const nextRow = nextMap[y];
    if (!Array.isArray(previousRow) || !Array.isArray(nextRow)) continue;

    for (let x = 0; x < nextRow.length; x += 1) {
      const previousCell = previousRow[x];
      const nextCell = nextRow[x];
      if (!previousCell || !nextCell) continue;

      const fromOwner = previousCell.owner || "";
      const toOwner = nextCell.owner || "";
      if (fromOwner === toOwner || (!fromOwner && !toOwner)) continue;

      nextEffects.push({
        id: `capture:${now}:${x}:${y}:${fromOwner}:${toOwner}`,
        x,
        y,
        fromOwner,
        toOwner,
        fromColor: captureColorForOwner(fromOwner, previousPlayers, previousCell),
        toColor: captureColorForOwner(toOwner, nextPlayers, nextCell),
        at: now,
        until: now + CAPTURE_EFFECT_MS
      });
    }
  }

  if (!nextEffects.length) return;
  const replaced = new Set(nextEffects.map((effect) => `${effect.x}:${effect.y}`));
  captureEffects = captureEffects
    .filter((effect) => effect.until > now && !replaced.has(`${effect.x}:${effect.y}`))
    .concat(nextEffects)
    .slice(-80);
  refreshCaptureEffects(CAPTURE_EFFECT_MS);
}

function captureColorForOwner(ownerId, players = {}, cell = null) {
  if (ownerId && players[ownerId]?.colorValue) return players[ownerId].colorValue;
  return terrainCaptureColor(cell?.terrain);
}

function terrainCaptureColor(terrain = "land") {
  return {
    water: "var(--water)",
    gold: "var(--gold)",
    iron: "#b7b7b0",
    uranium: "var(--uranium)"
  }[terrain] || "var(--button)";
}

function refreshCaptureEffects(duration = CAPTURE_EFFECT_MS) {
  renderedMapKey = "";
  setTimeout(() => {
    renderedMapKey = "";
    renderMap();
  }, duration + 80);
}

function requestFullMapSync() {
  const now = Date.now();
  if (now - lastMapSyncRequestAt < 1200) return;
  lastMapSyncRequestAt = now;
  send({ type: "syncMap" }, { silent: true, priority: true });
}

function addFlightEffect(detail) {
  if (!detail?.from || !detail?.to) return;
  const now = Date.now();
  const duration = Math.max(500, Number(detail.duration || SHAHED_FLIGHT_MS));
  const effect = {
    id: detail.id || `flight:${now}:${Math.random().toString(16).slice(2)}`,
    kind: detail.kind || "flight",
    from: { x: Number(detail.from.x), y: Number(detail.from.y) },
    to: { x: Number(detail.to.x), y: Number(detail.to.y) },
    at: now,
    duration,
    until: now + duration
  };
  if (!Number.isFinite(effect.from.x) || !Number.isFinite(effect.from.y) || !Number.isFinite(effect.to.x) || !Number.isFinite(effect.to.y)) return;
  flightEffects.push(effect);
  while (flightEffects.length > 8) {
    const removed = flightEffects.shift();
    stopFlightSfx(removed?.id);
  }
  refreshMapEffects(duration);
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
  renderLobbyPlayerSlots();
  renderLobbyNotice();
}

function renderLobbyMode() {
  const onHome = lobbyStep === "home";
  const steps = visibleLobbyFormSteps();
  if (!steps.includes(lobbyFormStep)) lobbyFormStep = steps[0] || "room";
  els.lobbyHome?.classList.toggle("hidden", !onHome);
  els.joinForm?.classList.toggle("hidden", onHome);
  els.lobbyBack?.classList.toggle("hidden", onHome);
  els.lobbySteps?.classList.toggle("hidden", onHome);
  document.querySelector(".lobby-mode")?.classList.toggle("hidden", onHome);
  els.lobbyModeButtons?.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lobbyMode === lobbyMode);
  });
  els.lobbyStepButtons?.forEach((button) => {
    const step = button.dataset.lobbyStep || "room";
    button.classList.toggle("hidden", !steps.includes(step));
    button.classList.toggle("is-active", step === lobbyFormStep);
  });
  els.lobbySections?.forEach((section) => {
    section.classList.toggle("hidden", section.dataset.lobbySection !== lobbyFormStep);
  });
  els.lobbyCodeField?.classList.toggle("hidden", lobbyMode !== "enter");
  els.lobbyPlayerCountField?.classList.toggle("hidden", lobbyMode !== "create");
  if (els.lobbyPlayerCountInput) {
    const settings = currentLobbySettings();
    const limits = lobbyHumanLimits();
    els.lobbyPlayerCountInput.min = String(limits.min);
    els.lobbyPlayerCountInput.max = String(limits.max);
    if (document.activeElement !== els.lobbyPlayerCountInput && String(els.lobbyPlayerCountInput.value) !== String(settings.maxHumans || 2)) {
      els.lobbyPlayerCountInput.value = String(settings.maxHumans || 2);
    }
  }
  renderLobbyPlayerCountChoices();
  const lastStep = steps[steps.length - 1];
  els.lobbyPrevStep?.classList.toggle("hidden", onHome);
  els.lobbyNextStep?.classList.toggle("hidden", onHome || lobbyFormStep === lastStep);
  if (els.lobbySubmit) {
    els.lobbySubmit.classList.toggle("hidden", onHome || lobbyFormStep !== lastStep);
    els.lobbySubmit.textContent = lobbyMode === "enter"
      ? "Войти"
      : ((currentLobbySettings().maxHumans || 2) === 1 ? "Начать с ботами" : (lobby?.created && lobby.hostId === me ? "Обновить комнату" : "Создать комнату"));
  }
}

function visibleLobbyFormSteps() {
  return lobbyMode === "create" ? ["room", "country", "rules"] : ["room", "country"];
}

function validateLobbyFormStep(step) {
  if (step === "room") {
    if (lobbyMode === "enter") {
      const code = (els.lobbyCodeInput?.value || "").trim();
      if (!/^[0-9]{4}$/.test(code)) {
        showToast("Введи 4 цифры кода лобби.");
        return false;
      }
    } else {
      const count = Number(els.lobbyPlayerCountInput?.value);
      const limits = lobbyHumanLimits();
      if (!Number.isFinite(count) || count < limits.min || count > limits.max) {
        showToast(`Игроков должно быть от ${limits.min} до ${limits.max}.`);
        return false;
      }
    }
  }
  if (step === "country") {
    if (!selectedColor) {
      showToast("Выбери цвет.");
      return false;
    }
  }
  return true;
}

function renderLobbySettings() {
  if (!els.lobbySettings) return;
  const settings = currentLobbySettings();
  if (!LOBBY_MAP_DEFS[lobbyMapPreview]) lobbyMapPreview = settings.mapType || "standard";
  els.lobbySettings.innerHTML = `
    <div class="lobby-settings__section">
      <strong>Карта</strong>
      <div class="map-preset-list">
        ${Object.entries(LOBBY_MAP_DEFS).map(([id, preset]) => mapPresetHtml(id, preset, settings)).join("")}
      </div>
      ${mapPreviewHtml(lobbyMapPreview, settings)}
    </div>
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

function mapPresetHtml(id, preset, settings) {
  const selected = settings.mapType === id;
  const previewed = lobbyMapPreview === id;
  return `
    <div class="map-preset ${selected ? "is-selected" : ""} ${previewed ? "is-previewed" : ""}">
      <label>
        <input data-map-preset name="lobbyMapType" type="radio" value="${escapeHtml(id)}" ${selected ? "checked" : ""}>
        <span class="map-preset__body">
          <strong>${escapeHtml(preset.name)}</strong>
          <em>${escapeHtml(preset.info)}</em>
          <span class="map-preset__tags">
            ${preset.tags.map((tag) => `<b>${escapeHtml(tag)}</b>`).join("")}
          </span>
        </span>
      </label>
      <button class="map-preset__eye" data-map-preview="${escapeHtml(id)}" type="button" title="Просмотреть карту" aria-label="Просмотреть карту ${escapeHtml(preset.name)}">👁</button>
    </div>
  `;
}

function mapPreviewHtml(mapType, settings) {
  const preset = LOBBY_MAP_DEFS[mapType] || LOBBY_MAP_DEFS.standard;
  const cells = lobbyMapPreviewCells(mapType, settings);
  return `
    <div class="map-preview" style="--preview-cols:34" aria-label="Предпросмотр карты ${escapeHtml(preset.name)}">
      <div class="map-preview__head">
        <strong>${escapeHtml(preset.name)}</strong>
        <span>${escapeHtml(previewPlayerCountLabel(settings))}</span>
      </div>
      <div class="map-preview__grid">
        ${cells.map((terrain) => `<span class="map-preview__cell map-preview__cell--${terrain}"></span>`).join("")}
      </div>
    </div>
  `;
}

function lobbyMapPreviewCells(mapType, settings) {
  const width = 34;
  const height = 24;
  const cells = Array.from({ length: width * height }, () => mapType === "islands" ? "water" : "land");
  const set = (x, y, terrain) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    cells[y * width + x] = terrain;
  };

  if (mapType === "islands") {
    for (const start of previewStartLayouts(previewPlayerCount(settings), width, height)) {
      for (let y = start.y - 2; y <= start.y + 2; y += 1) {
        for (let x = start.x - 2; x <= start.x + 2; x += 1) {
          set(x, y, "land");
        }
      }
      set(start.x, start.y, "hq");
      set(start.x - 2, start.y - 2, "gold");
      set(start.x + 2, start.y - 2, "iron");
      set(start.x - 2, start.y + 2, "uranium");
      set(start.x + 2, start.y + 2, "gold");
    }
    return cells;
  }

  if (mapType === "standard") {
    for (let y = 0; y < height; y += 1) {
      const x = Math.round(width / 2 + Math.sin(y * 0.8) * 1.6);
      set(x, y, "water");
      if (y % 4 === 0) set(x + 1, y, "water");
    }
    for (let x = 0; x < width; x += 1) {
      const y = Math.round(height / 2 + Math.sin(x * 0.65) * 1.1);
      set(x, y, "water");
    }
  }

  const resourceSeeds = mapType === "noWater"
    ? [
        [4, 4, "gold"], [8, 7, "iron"], [12, 3, "uranium"], [18, 6, "gold"], [23, 4, "iron"], [29, 8, "gold"],
        [5, 18, "iron"], [10, 15, "gold"], [15, 20, "uranium"], [21, 17, "iron"], [26, 19, "gold"], [30, 14, "iron"]
      ]
    : [
        [4, 4, "gold"], [8, 7, "iron"], [13, 5, "uranium"], [24, 4, "gold"], [29, 8, "iron"],
        [6, 18, "iron"], [11, 15, "gold"], [21, 17, "uranium"], [27, 19, "gold"]
      ];
  for (const [x, y, terrain] of resourceSeeds) set(x, y, terrain);
  for (const start of previewStartLayouts(previewPlayerCount(settings), width, height)) {
    set(start.x, start.y, "hq");
  }
  return cells;
}

function previewStartLayouts(count, width, height) {
  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  const radiusX = Math.max(6, width / 2 - 4);
  const radiusY = Math.max(5, height / 2 - 4);
  return Array.from({ length: Math.max(1, count) }, (_, index) => {
    const angle = Math.PI + (index * Math.PI * 2) / Math.max(1, count);
    return {
      x: clamp(Math.round(cx + Math.cos(angle) * radiusX), 2, width - 3),
      y: clamp(Math.round(cy + Math.sin(angle) * radiusY), 2, height - 3)
    };
  });
}

function previewPlayerCount(settings) {
  const humans = clamp(Math.round(Number(settings.maxHumans) || 2), lobby?.minHumans || 1, lobby?.maxHumanLimit || 7);
  const bots = Object.values(settings.bots || {}).filter(Boolean).length;
  return humans + bots;
}

function previewPlayerCountLabel(settings) {
  const count = previewPlayerCount(settings);
  return `${count} ${count === 1 ? "страна" : count < 5 ? "страны" : "стран"}`;
}

function renderLobbyPlayerSlots() {
  if (!els.lobbyPlayerSlots) return;
  const settings = currentLobbySettings();
  const maxHumans = clamp(Math.round(Number(settings.maxHumans) || 2), lobby?.minHumans || 1, lobby?.maxHumanLimit || 7);
  const playerEntries = Object.entries(lobby?.players || {})
    .filter(([id]) => /^p\d+$/.test(id))
    .sort(([a], [b]) => Number(a.slice(1)) - Number(b.slice(1)))
    .slice(0, maxHumans);

  els.lobbyPlayerSlots.innerHTML = playerEntries.map(([id, player], index) => {
    const joined = Boolean(player?.joined);
    const color = player?.colorValue || "#9ca3af";
    const name = joined ? player.country || `Игрок ${index + 1}` : `Игрок ${index + 1}`;
    const status = joined ? (player.connected ? "готов" : "нет связи") : "ожидается";
    return `
      <div class="lobby-slot">
        <span class="lobby-slot__dot" style="--swatch:${escapeHtml(color)}"></span>
        <span>${escapeHtml(name)}</span>
        <span class="lobby-slot__status">${escapeHtml(status)}</span>
      </div>
    `;
  }).join("");
}

function renderLobbyNotice() {
  if (!els.lobbyNotice) return;
  const myPlayer = lobby.players?.[me];
  const settings = currentLobbySettings();
  const joinedCount = Object.values(lobby.players || {}).filter((player) => player?.joined && !player.isBot).length;
  const maxHumans = settings.maxHumans || lobby.maxHumans || 2;
  if (lobbyStep === "home") {
    els.lobbyNotice.innerHTML = `<strong>Выбери режим</strong><span>Создай комнату или войди по коду друга.</span>`;
    return;
  }
  if (lobby.created && lobby.hostId === me && lobby.code) {
    els.lobbyNotice.innerHTML = `<strong>Код лобби: ${escapeHtml(lobby.code)}</strong><span>Игроки: ${joinedCount}/${maxHumans}. Матч стартует автоматически.</span>`;
    return;
  }
  if (lobby.created && !myPlayer?.joined) {
    els.lobbyNotice.innerHTML = `<strong>Лобби уже создано</strong><span>Нажми «Войти» и введи код от создателя.</span>`;
    return;
  }
  if (myPlayer?.joined) {
    els.lobbyNotice.innerHTML = `<strong>Готово</strong><span>Игроки: ${joinedCount}/${maxHumans}. Ждем остальных.</span>`;
    return;
  }
  els.lobbyNotice.innerHTML = `<strong>Создай матч</strong><span>Настройки уже заполнены стандартными значениями.</span>`;
}

function currentLobbySettings() {
  if (!lobbySettings) lobbySettings = normalizeLobbySettings(lobby?.settings);
  return lobbySettings;
}

function lobbyHumanLimits() {
  return {
    min: lobby?.minHumans || 1,
    max: lobby?.maxHumanLimit || 7
  };
}

function setLobbyHumanCount(value) {
  const limits = lobbyHumanLimits();
  const next = clamp(Math.round(Number(value) || 2), limits.min, limits.max);
  const settings = normalizeLobbySettings(lobbySettings || lobby?.settings);
  settings.maxHumans = next;
  lobbySettings = settings;
  if (els.lobbyPlayerCountInput) els.lobbyPlayerCountInput.value = String(next);
  renderLobbyMode();
  renderLobbyPlayerSlots();
  renderLobbyNotice();
}

function renderLobbyPlayerCountChoices() {
  if (!els.lobbyPlayerCountChoices) return;
  const settings = currentLobbySettings();
  const limits = lobbyHumanLimits();
  const selected = clamp(Math.round(Number(settings.maxHumans) || 2), limits.min, limits.max);
  els.lobbyPlayerCountChoices.classList.toggle("hidden", lobbyMode !== "create");
  els.lobbyPlayerCountChoices.innerHTML = Array.from({ length: limits.max - limits.min + 1 }, (_, index) => limits.min + index)
    .map((count) => `<button class="${count === selected ? "is-selected" : ""}" data-lobby-player-count="${count}" type="button">${count}</button>`)
    .join("");
}

function normalizeLobbySettings(raw = {}) {
  raw = raw || {};
  const limits = lobbyHumanLimits();
  const settings = {
    maxHumans: clamp(Math.round(Number(raw.maxHumans) || 2), limits.min, limits.max),
    mapType: LOBBY_MAP_DEFS[raw.mapType] ? raw.mapType : "standard",
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
  const maxHumans = Number(els.lobbyPlayerCountInput?.value);
  const limits = lobbyHumanLimits();
  if (Number.isFinite(maxHumans)) {
    settings.maxHumans = clamp(Math.round(maxHumans), limits.min, limits.max);
  }
  const mapPreset = els.lobbySettings?.querySelector("[data-map-preset]:checked");
  if (mapPreset && LOBBY_MAP_DEFS[mapPreset.value]) {
    settings.mapType = mapPreset.value;
    lobbyMapPreview = mapPreset.value;
  }
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
  renderTargetPrompt();
  renderPanels();
  renderMapMovePad();
  renderControls();
  renderStatsOverlay();
  renderChat();
  renderJournal();
  updateChatButton();
  updateJournalButton();
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

function renderTargetPrompt() {
  if (!els.targetPrompt) return;
  const text = pendingTargetPromptText();
  if (!text) {
    els.targetPrompt.classList.add("hidden");
    els.targetPrompt.textContent = "";
    return;
  }
  els.targetPrompt.textContent = text;
  els.targetPrompt.classList.remove("hidden");
}

function pendingTargetPromptText() {
  if (!pending) return "";
  if (pending.action === "nuke") return "ВЫБЕРИ КЛЕТКУ ДЛЯ ЯДЕРНОГО УДАРА";
  if (pending.action === "shahed") return "ВЫБЕРИ КЛЕТКУ ДЛЯ ЗАПУСКА ШАХЕДА";
  return "";
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
  captureEffects = captureEffects.filter((effect) => effect.until > now);
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
  const captureByCell = new Map(captureEffects.map((effect) => [`${effect.x}:${effect.y}`, effect]));
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
        captureByCell,
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
      mapCellNodes.push({ button, building, construction, units, capture: null, bubble: null, renderKey: "" });
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
  const capture = context.captureByCell.get(`${cell.x}:${cell.y}`);
  const bubble = mapBubbleForCell(cell, context.now);
  const className = [
    "cell",
    `terrain-${cell.terrain}`,
    cell.owner ? "is-owned" : "",
    capture ? "is-capturing" : "",
    bubble ? "has-bubble" : "",
    cell.building?.type === "bridge" ? "has-bridge" : "",
    cell.construction ? "has-construction" : "",
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
  const captureKey = capture ? `${capture.id}:${capture.fromColor}:${capture.toColor}:${capture.until}` : "";
  const bubbleKey = bubble ? `${bubble.id}:${bubble.text}` : "";
  const nextRenderKey = [className, ownerColor, borderColor, edgeKey, buildingText, constructionText, unitsText, title, captureKey, bubbleKey].join("|");
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

  if (capture) {
    if (!entry.capture) {
      entry.capture = document.createElement("span");
      entry.capture.className = "capture-stripe";
      button.append(entry.capture);
    }
    entry.capture.style.setProperty("--capture-from-color", capture.fromColor);
    entry.capture.style.setProperty("--capture-to-color", capture.toColor);
    entry.capture.style.setProperty("--capture-duration", `${CAPTURE_EFFECT_MS}ms`);
    entry.capture.style.animationDelay = `-${Math.min(context.now - capture.at, CAPTURE_EFFECT_MS)}ms`;
  } else if (entry.capture) {
    entry.capture.remove();
    entry.capture = null;
  }

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
  if (clearDom) {
    captureEffects = [];
    els.map.replaceChildren();
  }
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

  flightEffects = flightEffects.filter((flight) => {
    const active = flight.until > now;
    if (!active) stopFlightSfx(flight.id);
    return active;
  });
  for (const flight of flightEffects) {
    const node = document.createElement("span");
    node.className = `map-flight map-flight--${flight.kind || "flight"}`;
    setFlightPath(node, flight, width, height, now);
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

function setFlightPath(node, effect, width, height, now) {
  const duration = Math.max(1, effect.duration || SHAHED_FLIGHT_MS);
  const age = Math.max(0, now - (effect.at || now));
  const fromLeft = ((effect.from.x + 0.5) / width) * 100;
  const fromTop = ((effect.from.y + 0.5) / height) * 100;
  const toLeft = ((effect.to.x + 0.5) / width) * 100;
  const toTop = ((effect.to.y + 0.5) / height) * 100;
  const angle = Math.atan2(effect.to.y - effect.from.y, effect.to.x - effect.from.x) * 180 / Math.PI;
  const visualAngle = angle + flightIconAngleOffset(effect.kind);
  node.style.setProperty("--from-left", `${fromLeft}%`);
  node.style.setProperty("--from-top", `${fromTop}%`);
  node.style.setProperty("--to-left", `${toLeft}%`);
  node.style.setProperty("--to-top", `${toTop}%`);
  node.style.setProperty("--flight-path-angle", `${angle}deg`);
  node.style.setProperty("--flight-angle", `${visualAngle}deg`);
  node.style.setProperty("--effect-duration", `${duration}ms`);
  node.style.animationDelay = `-${Math.min(age, duration)}ms`;
}

function flightIconAngleOffset(kind) {
  if (kind === "shahed") return 0;
  if (kind === "rocket") return 45;
  return 90;
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
  const actionKey = activeTab === "actions" || pending ? `${activeTab}:${moveInf}:${moveRpg ? 1 : 0}:${moveTank ? 1 : 0}:${moveMlrs ? 1 : 0}:${moveEw ? 1 : 0}:${moveCruiser ? 1 : 0}:${moveDrone ? 1 : 0}:${movePickup ? 1 : 0}` : "";
  const explosionKey = explosions.map((explosion) => `${explosion.id}:${explosion.until}`).join("|");
  const smokeKey = nukeSmokes.map((smoke) => `${smoke.id}:${smoke.until}`).join("|");
  const impactSmokeKey = impactSmokes.map((smoke) => `${smoke.id}:${smoke.until}`).join("|");
  const shotEffectKey = shotEffects.map((effect) => `${effect.id}:${effect.until}`).join("|");
  const flightEffectKey = flightEffects.map((effect) => `${effect.id}:${effect.until}`).join("|");
  const captureEffectKey = captureEffects.map((effect) => `${effect.id}:${effect.until}`).join("|");
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
    flightEffectKey,
    captureEffectKey,
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
    if ((controlsCell(selectedCell) || (selectedCell?.terrain === "water" && hasOwnVessel(selectedCell)) || (selectedCell?.units?.[me]?.drone || 0) > 0) && movablePower(selectedCell.units?.[me] || {}) > 0) {
      addMoveTargets(selectedCell, highlights.move);
    }
  }

  if (pending?.action === "rpg" || pending?.action === "tank" || pending?.action === "rocket" || pending?.action === "mlrs" || pending?.action === "cruiser") {
    addAttackTargets(getCell(pending.x, pending.y), pending.action, highlights.attack);
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
    && (controlsCell(cell) || (cell.terrain === "water" && hasOwnVessel(cell)) || (ownUnits.drone || 0) > 0)
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
  const pickup = movePickup && (ownUnits.pickup || 0) > 0 ? 1 : 0;
  const saboteur = 0;
  const rpgBlockedByCovert = drone && inf <= 0 && !tank && !mlrs && !pickup && !cruiser;
  const rpg = moveRpg && !rpgBlockedByCovert ? Math.min(ownUnits.rpg || 0, 1) : 0;
  const ewEscort = inf + rpg + (tank ? 1 : 0) + (mlrs ? 1 : 0) + pickup;
  const ew = moveEw && (ownUnits.ew || 0) > 0 && ewEscort > 0 ? 1 : 0;
  const boat = source?.terrain === "water" && (ownUnits.boat || 0) > 0;
  return {
    inf,
    rpg,
    tank,
    mlrs,
    ew,
    drone,
    pickup,
    saboteur,
    boat,
    cruiser,
    power: inf + rpg + (tank ? 1 : 0) + (mlrs ? 1 : 0) + ew + drone + pickup + saboteur + (boat ? 1 : 0) + (cruiser ? 1 : 0),
    ammoCost: inf + rpg + (tank ? 2 : 0) + (mlrs ? 2 : 0) + ew + drone + pickup + saboteur + (boat || cruiser ? 1 : 0)
  };
}

function canMoveInto(target, source, request) {
  if (!target) return false;
  const rawWater = target.terrain === "water" && target.building?.type !== "bridge";
  const airMove = request.drone || request.saboteur;
  const landMove = request.inf + request.rpg + (request.tank ? 1 : 0) + (request.mlrs ? 1 : 0) + request.ew + request.pickup;
  const droneOnlyMove = (request.drone || 0) > 0 && landMove <= 0 && !request.boat && !request.cruiser && !request.saboteur;
  if (rawWater) {
    if (landMove > 0 && !request.boat && !request.cruiser) return false;
    if (request.ew) return false;
    if (hasHostileCruiser(target) && (request.boat || request.cruiser || !airMove)) return false;
    if (!airMove && !request.boat && !request.cruiser && !hasOwnVessel(target)) return false;
  } else if (source?.terrain === "water" && hasOwnVessel(source) && !request.drone && !request.saboteur) {
    if (request.inf + request.rpg <= 0) return false;
    if (!isPassableCell(target)) return false;
  } else if (!isPassableCell(target)) {
    return false;
  }
  if (!droneOnlyMove && target.owner && target.owner !== me && relationStatus(target.owner) !== "war" && !controlsOwner(target.owner)) return false;
  const targetOwnUnits = target.units?.[me] || {};
  if (request.rpg && targetOwnUnits.rpg) return false;
  if (request.tank && targetOwnUnits.tank) return false;
  if (request.mlrs && targetOwnUnits.mlrs) return false;
  if (request.pickup && targetOwnUnits.pickup) return false;
  if (request.ew && targetOwnUnits.ew) return false;
  if (request.boat && targetOwnUnits.boat) return false;
  if (request.cruiser && targetOwnUnits.cruiser) return false;
  return true;
}

function renderPanels() {
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
  const relationPart = Object.entries(state?.relations || {})
    .filter(([key]) => key.split(":").includes(me))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join(",");
  const hasTck = hasOwnBuilding("tck") ? 1 : 0;
  const hasFactory = hasOwnBuilding("factory") ? 1 : 0;
  const hasNuclearPlant = hasOwnBuilding("nuclearPlant") ? 1 : 0;
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
    pending ? `${pending.action}:${pending.x ?? ""}:${pending.y ?? ""}` : "",
    cellPart,
    moveInf,
    moveRpg ? 1 : 0,
    moveTank ? 1 : 0,
    moveMlrs ? 1 : 0,
    moveEw ? 1 : 0,
    moveCruiser ? 1 : 0,
    moveDrone ? 1 : 0,
    movePickup ? 1 : 0,
    player.vassalOf || "",
    relationPart,
    player.hqDestroyed ? 1 : 0,
    player.devFreeActions ? 1 : 0,
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
    hasTck,
    hasFactory,
    hasNuclearPlant
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
  const mobilizationOn = Boolean(state?.players?.[me]?.mobilization);
  const canUseTactics = state.status === "running" && !spectator;
  const troopActions = canUseTactics ? troopActionButtonsHtml(cell, ownUnits, { availableOnly: true, mobilizationOn }) : "";
  const scrapActions = canUseTactics ? scrapButtonsHtml(ownUnits) : "";
  const cancelAction = canUseTactics && pending ? commandButton("cancel", "", "× Сброс", "цель") : "";
  const hasTactics = Boolean(troopActions || scrapActions || cancelAction);

  els.mapMovePad.classList.toggle("hidden", !canMove && !hasTactics);
  els.mapMovePad.classList.toggle("is-actions-only", !canMove && hasTactics);
  if (!canMove && !hasTactics) {
    els.mapMovePad.innerHTML = "";
    return;
  }

  els.mapMovePad.innerHTML = `
    ${canMove ? mapDirectionsHtml() : ""}
    <div class="map-tactics">
      ${canMove ? mapMoveOptionsHtml(ownUnits) : ""}
      ${hasTactics ? `<div class="map-action-grid">${troopActions}${scrapActions}${cancelAction}</div>` : ""}
    </div>
  `;

  els.mapMovePad.querySelectorAll("button[data-command='moveDir']").forEach((button) => {
    button.disabled = Boolean(pendingMoveSelection);
  });
}

function mapDirectionsHtml() {
  return `
    <div class="map-move-pad__directions">
      <button class="map-move-button map-move-button--north" data-command="moveDir" data-dx="0" data-dy="-1" type="button" title="Вверх">↑</button>
      <button class="map-move-button map-move-button--west" data-command="moveDir" data-dx="-1" data-dy="0" type="button" title="Влево">←</button>
      <button class="map-move-button map-move-button--east" data-command="moveDir" data-dx="1" data-dy="0" type="button" title="Вправо">→</button>
      <button class="map-move-button map-move-button--south" data-command="moveDir" data-dx="0" data-dy="1" type="button" title="Вниз">↓</button>
    </div>
  `;
}

function mapMoveOptionsHtml(ownUnits = {}) {
  const toggles = [
    ["rpg", moveRpg, (ownUnits.rpg || 0) > 0],
    ["tank", moveTank, (ownUnits.tank || 0) > 0],
    ["mlrs", moveMlrs, (ownUnits.mlrs || 0) > 0],
    ["pickup", movePickup, (ownUnits.pickup || 0) > 0],
    ["ew", moveEw, (ownUnits.ew || 0) > 0 && ((ownUnits.inf || 0) > 0 || (ownUnits.rpg || 0) > 0 || (ownUnits.tank || 0) > 0 || (ownUnits.mlrs || 0) > 0 || (ownUnits.pickup || 0) > 0)],
    ["cruiser", moveCruiser, (ownUnits.cruiser || 0) > 0],
    ["drone", moveDrone, (ownUnits.drone || 0) > 0]
  ].filter(([, , enabled]) => enabled);
  return `
    <div class="move-options map-move-options">
      ${(ownUnits.inf || 0) > 0 ? `<div class="stepper">
        <button data-command="infMinus" type="button">−</button>
        <output>${moveInf}${unitIconHtml("inf")}</output>
        <button data-command="infPlus" type="button">+</button>
      </div>` : ""}
      ${toggles.map(([kind, checked, enabled]) => moveToggleHtml(kind, checked, enabled)).join("")}
    </div>
  `;
}

function renderTroopsTab() {
  const cell = selected ? getCell(selected.x, selected.y) : null;
  const buttons = Object.entries(UNIT_DEFS).map(([kind, unit]) => {
    const command = kind === "nuke" ? "nuke" : kind === "saboteur" ? "shahed" : "hire";
    const availability = launchCommandAvailability(command) || hireCommandAvailability(kind, cell);
    const disabled = !availability.ready;
    return commandButton(command, kind, unit.name, availability?.hint || unit.cost, { disabled });
  }).join("");
  els.tabContent.innerHTML = `<div class="command-grid">${buttons}</div>`;
}

function renderBuildingsTab() {
  const cell = selected ? getCell(selected.x, selected.y) : null;
  const buttons = Object.entries(BUILDING_DEFS).map(([kind, building]) => {
    const availability = buildingCommandAvailability(kind, cell);
    return commandButton("build", kind, `${building.icon} ${building.name}`, availability.hint, { disabled: !availability.ready });
  }).join("");
  const demolish = demolishCommandAvailability(cell);
  els.tabContent.innerHTML = `
    <div class="action-section">
      <div class="command-grid">${buttons}</div>
      <div class="command-grid command-grid--danger">
        ${commandButton("demolish", "", "⌫ Снести", demolish.hint, { disabled: !demolish.ready })}
      </div>
    </div>
  `;
}

function renderActionsTab() {
  const vassal = isMyCountryVassal();
  const hasVassals = myVassals().length > 0;
  els.tabContent.innerHTML = `
    <div class="action-strip">
      ${actionsDiplomacyHtml({ vassal, hasVassals })}
    </div>
  `;
}

function moveToggleHtml(kind, checked, enabled, label = `${unitIconHtml(kind)} ${MOVE_TOGGLE_LABELS[kind] || UNIT_DEFS[kind]?.name || UNIT_MARKS[kind] || kind}`) {
  return `<label class="toggle ${enabled ? "" : "is-disabled"}"><input type="checkbox" data-move-toggle="${kind}" ${enabled && checked ? "checked" : ""} ${enabled ? "" : "disabled"}> ${label}</label>`;
}

function actionCommandButton(command, cell, ownUnits, label, cost) {
  return commandButton(command, "", label, cost, { disabled: !actionUnitAvailable(command, cell, ownUnits) });
}

function troopActionButtonsHtml(cell, ownUnits = {}, options = {}) {
  const actions = [
    ["rpg", `${unitIconHtml("rpg")} РПГ`, "рядом"],
    ["tank", `${unitIconHtml("tank")} Танк`, "рядом"],
    ["rocket", "🚀 Удар", "R5"],
    ["mlrs", `${unitIconHtml("mlrs")} Залп`, "R4"],
    ["cruiser", `${unitIconHtml("cruiser")} Залп`, "линия 3"],
    ["detonateDrone", `${unitIconHtml("drone")} Детонация`, "эта клетка"]
  ];
  const buttons = actions
    .map(([command, label, hint]) => {
      const ready = actionUnitAvailable(command, cell, ownUnits) && actionCommandReady(command, cell);
      if (options.availableOnly && !ready) return "";
      return commandButton(command, "", label, hint, { disabled: !ready });
    })
    .join("");
  const mobilize = hasOwnBuilding("tck")
    ? commandButton("mobilize", "", options.mobilizationOn ? "📋 Выкл. моб." : "📋 Мобилизация", options.mobilizationOn ? "включено" : "выключено")
    : "";
  return `${buttons}${mobilize}`;
}

function actionUnitAvailable(command, cell, ownUnits = {}) {
  if (!cell) return false;
  if (command === "cruiser") return cell.terrain === "water" && (ownUnits.cruiser || 0) > 0;
  if (command === "detonateDrone") return (ownUnits.drone || 0) > 0;
  if (command === "detonateSaboteur") return (ownUnits.saboteur || 0) > 0;
  const unit = command === "rpg" ? "rpg" : command === "tank" ? "tank" : command === "rocket" ? "rocket" : command === "mlrs" ? "mlrs" : "";
  return Boolean(unit && controlsCell(cell) && (ownUnits[unit] || 0) > 0);
}

function actionCommandReady(command, cell) {
  if (!["rpg", "tank", "rocket", "mlrs", "cruiser"].includes(command)) return true;
  return cellWeaponCooldownReady(cell, me, command);
}

function launchCommandAvailability(command) {
  if (command !== "nuke" && command !== "shahed") return null;
  const player = state?.players?.[me];
  if (!player || spectator || state?.status !== "running") {
    return { ready: false, hint: "недоступно", reason: "Запуск сейчас недоступен." };
  }

  if (command === "nuke") {
    if (!hasOwnBuilding("nuclearPlant")) {
      return { ready: false, hint: "нужен ядерный завод", reason: "Для ядерки нужен ядерный завод." };
    }
    const cooldown = Math.max(0, Math.ceil(player.cooldowns?.nuke || 0));
    if (cooldown > 0) {
      return { ready: false, hint: `кд ${cooldown}с`, reason: `Ядерка перезаряжается: ${cooldown}с.` };
    }
    const missing = player.devFreeActions ? "" : resourceShortageText(LAUNCH_COSTS.nuke, player.resources);
    if (missing) {
      return { ready: false, hint: `не хватает ${missing}`, reason: `Не хватает ресурсов для ядерки: ${missing}.` };
    }
    return { ready: true, hint: "готово: выбери цель", reason: "Ядерка готова: выбери клетку на карте." };
  }

  if (!hasOwnBuilding("factory")) {
    return { ready: false, hint: "нужен завод", reason: "Для запуска Шахеда нужен завод." };
  }
  const cooldown = Math.max(0, Math.ceil(player.cooldowns?.saboteur || 0));
  if (cooldown > 0) {
    return { ready: false, hint: `кд ${cooldown}с`, reason: `Шахед готовится: ${cooldown}с.` };
  }
  const missing = player.devFreeActions ? "" : resourceShortageText(LAUNCH_COSTS.shahed, player.resources);
  if (missing) {
    return { ready: false, hint: `не хватает ${missing}`, reason: `Не хватает ресурсов для запуска Шахеда: ${missing}.` };
  }
  return { ready: true, hint: "готово: выбери цель", reason: "Шахед готов: выбери клетку на карте." };
}

function resourceShortageText(cost = {}, resources = {}) {
  return Object.entries(cost)
    .map(([key, needed]) => {
      const current = Math.max(0, Number(resources?.[key] || 0));
      const missing = Math.max(0, needed - current);
      if (!missing) return "";
      const resource = RESOURCE_DEFS.find((item) => item.key === key);
      return `${resource?.icon || key}${missing}`;
    })
    .filter(Boolean)
    .join(" ");
}

function costHint(cost = {}, fallback = "") {
  const text = RESOURCE_DEFS
    .filter((resource) => cost[resource.key] > 0)
    .map((resource) => `${resource.icon}${cost[resource.key]}`)
    .join(" ");
  return text || fallback;
}

function canPayClient(cost = {}) {
  if (state?.players?.[me]?.devFreeActions) return true;
  const resources = state?.players?.[me]?.resources || {};
  return Object.entries(cost).every(([key, amount]) => (resources[key] || 0) >= amount);
}

function isLandLikeClient(cell) {
  return Boolean(cell && (["land", "gold", "iron", "uranium"].includes(cell.terrain) || cell.building?.type === "bridge"));
}

function hasAdjacentWaterClient(cell) {
  if (!cell) return false;
  return [[0, -1], [-1, 0], [1, 0], [0, 1]].some(([dx, dy]) => getCell(cell.x + dx, cell.y + dy)?.terrain === "water");
}

function hasAdjacentOwnedCellClient(cell) {
  if (!cell) return false;
  return [[0, -1], [-1, 0], [1, 0], [0, 1]].some(([dx, dy]) => {
    const next = getCell(cell.x + dx, cell.y + dy);
    return next && controlsCell(next) && isLandLikeClient(next);
  });
}

function hasAdjacentFriendlyPortClient(cell) {
  if (!cell) return false;
  return [[0, -1], [-1, 0], [1, 0], [0, 1]].some(([dx, dy]) => {
    const next = getCell(cell.x + dx, cell.y + dy);
    const owner = next?.building?.owner;
    return next?.building?.type === "port" && owner && (controlsOwner(owner) || relationStatus(owner) === "alliance");
  });
}

function anyVesselOnCell(cell) {
  if (!cell) return false;
  return Object.values(cell.units || {}).some((units) => (units.boat || 0) > 0 || (units.cruiser || 0) > 0);
}

function hireCommandAvailability(kind, cell) {
  const player = state?.players?.[me];
  if (!player || spectator || state?.status !== "running") {
    return { ready: false, hint: "недоступно" };
  }
  if (kind === "nuke" || kind === "saboteur") return launchCommandAvailability(kind === "nuke" ? "nuke" : "shahed");
  const definition = UNIT_DEFS[kind];
  if (!definition) return { ready: false, hint: "нет юнита" };
  const cost = unitHireCostClient(kind, cell);
  const missing = resourceShortageText(cost, player.resources);
  const costText = costHint(cost, definition.cost);
  const hireHint = player.devFreeActions ? "бесплатно" : costText;

  if (!cell) return { ready: false, hint: "выбери клетку" };
  if (!canPayClient(cost)) return { ready: false, hint: `не хватает ${missing}` };

  if (kind === "boat" || kind === "cruiser") {
    if (cell.terrain !== "water" || cell.building) return { ready: false, hint: kind === "cruiser" ? "вода у порта" : "вода у земли" };
    if (kind === "boat" && !hasAdjacentOwnedCellClient(cell)) return { ready: false, hint: "рядом своя земля" };
    if (kind === "cruiser" && !hasAdjacentFriendlyPortClient(cell)) return { ready: false, hint: "рядом порт" };
    if (anyVesselOnCell(cell)) return { ready: false, hint: "вода занята" };
    return { ready: true, hint: hireHint };
  }

  if (STATIC_DEPLOY_UNITS.has(kind)) {
    if (!controlsCell(cell) || !isLandLikeClient(cell) || cell.construction) return { ready: false, hint: "своя проходная клетка" };
    if (!UNIT_DEFS[kind] || (cell.units?.[me]?.[kind] || 0) > 0) return { ready: false, hint: "уже стоит" };
    return { ready: true, hint: `${hireHint} · 1.5с` };
  }

  if (!controlsCell(cell) || !["hq", "barracks", "factory"].includes(cell.building?.type)) {
    return { ready: false, hint: "HQ/казармы/завод" };
  }
  if ((cell.units?.[me]?.[kind] || 0) > 0 && kind !== "inf" && kind !== "drone") {
    return { ready: false, hint: "уже есть" };
  }
  return { ready: true, hint: hireHint };
}

function unitHireCostClient(kind, cell) {
  if (kind === "inf" && cell?.building?.type === "barracks" && state?.players?.[me]?.mobilization) {
    return { pop: 1, gold: 1 };
  }
  return UNIT_COSTS[kind] || {};
}

function buildingCommandAvailability(kind, cell) {
  const player = state?.players?.[me];
  const definition = BUILDING_DEFS[kind];
  const cost = BUILDING_COSTS[kind] || {};
  const baseHint = `${player?.devFreeActions ? "бесплатно" : costHint(cost, definition?.cost || "")} · 1.5с`;
  if (!player || spectator || state?.status !== "running") return { ready: false, hint: "недоступно" };
  if (!cell) return { ready: false, hint: "выбери клетку" };
  if (cell.building) return { ready: false, hint: "занято" };
  if (cell.construction) return { ready: false, hint: "строится" };
  const missing = resourceShortageText(cost, player.resources);
  if (!canPayClient(cost)) return { ready: false, hint: `не хватает ${missing}` };

  if (kind === "bridge") {
    if (cell.terrain !== "water") return { ready: false, hint: "только вода" };
    if (anyVesselOnCell(cell)) return { ready: false, hint: "корабль" };
    if (!hasAdjacentOwnedCellClient(cell)) return { ready: false, hint: "рядом своя клетка" };
    return { ready: true, hint: baseHint };
  }

  if (kind === "hq") {
    if (!state.players?.[me]?.hqDestroyed) return { ready: false, hint: "штаб жив" };
    if (!controlsCell(cell) || cell.terrain === "water") return { ready: false, hint: "своя суша" };
    return { ready: true, hint: baseHint };
  }

  if (!controlsCell(cell) || !isLandLikeClient(cell)) return { ready: false, hint: "своя земля" };
  if (kind === "mine" && !["gold", "iron", "uranium"].includes(cell.terrain)) return { ready: false, hint: "ресурсная клетка" };
  if (kind === "minePlus" && cell.terrain !== "gold") return { ready: false, hint: "только золото" };
  if (kind === "port" && !hasAdjacentWaterClient(cell)) return { ready: false, hint: "у воды" };
  if (["gold", "iron", "uranium"].includes(cell.terrain) && kind !== "mine" && kind !== "minePlus") return { ready: false, hint: "только шахта" };
  return { ready: true, hint: baseHint };
}

function demolishCommandAvailability(cell) {
  if (!cell) return { ready: false, hint: "выбери клетку" };
  if (cell.building?.owner !== me) return { ready: false, hint: "не твоя постройка" };
  if (cell.building.type === "hq") return { ready: false, hint: "штаб нельзя" };
  return { ready: true, hint: BUILDING_DEFS[cell.building.type]?.name || "постройка" };
}

function actionsDiplomacyHtml({ vassal, hasVassals }) {
  const hasTargets = hasDiplomacyTargets();
  const hasWars = hasWarTargets();
  return `
    <div class="action-section">
      <div class="command-grid">
        ${vassal ? commandButton("revolution", "", "⚑ Революция", "свобода") : disabledCommandButton("⚑ Революция", "только вассал")}
        ${vassal ? disabledCommandButton("🤝 Союз", "сюзерен") : commandButton("ally", "", "🤝 Союз", hasTargets ? "страна" : "нет целей", { disabled: !hasTargets })}
        ${vassal ? disabledCommandButton("⚑ Война", "сюзерен") : commandButton("war", "", "⚑ Война", hasTargets ? "страна" : "нет целей", { disabled: !hasTargets })}
        ${vassal ? disabledCommandButton("⚠ Ультиматум", "сюзерен") : commandButton("ultimatum", "", "⚠ Ультиматум", hasTargets ? "вассалитет" : "нет целей", { disabled: !hasTargets })}
        ${vassal ? disabledCommandButton("🏳 Капитуляция", "сюзерен") : commandButton("capitulate", "", "🏳 Капитуляция", hasWars ? "страна в войне" : "нет войны", { disabled: !hasWars })}
        ${vassal ? disabledCommandButton("🕊 Освободить", "сюзерен") : (hasVassals ? commandButton("releaseVassal", "", "🕊 Освободить", "вассал") : disabledCommandButton("🕊 Освободить", "нет вассалов"))}
        ${vassal ? disabledCommandButton("🎁 Передать", "сюзерен") : commandButton("transfer", "", "🎁 Передать", hasTargets ? "страна" : "нет целей", { disabled: !hasTargets })}
        ${vassal ? disabledCommandButton("🙏 Запросить", "сюзерен") : commandButton("requestResources", "", "🙏 Запросить", hasTargets ? "страна" : "нет целей", { disabled: !hasTargets })}
        ${vassal ? disabledCommandButton("🕶 Спецоперация", "сюзерен") : commandButton("specialOp", "", "🕶 Спецоперация", hasTargets ? "страна" : "нет целей", { disabled: !hasTargets })}
        ${commandButton("cancel", "", "× Сброс", "цель")}
      </div>
    </div>
  `;
}

function scrapButtonsHtml(units = {}) {
  return SCRAPPABLE_UNITS
    .filter((kind) => (units[kind] || 0) > 0)
    .map((kind) => commandButton("scrap", kind, `♻ ${unitIconHtml(kind)} ${scrapActionLabel(kind)}`, scrapActionHint(kind)))
    .join("");
}

function scrapActionLabel(kind) {
  return kind === "inf" || kind === "rpg" ? "Распустить" : "Списать";
}

function scrapActionHint(kind) {
  if (kind === "inf") return "1💰 1👤";
  if (kind === "rpg") return "3💰 1⚙️ 1👤";
  return UNIT_DEFS[kind]?.name || kind;
}

function syncMoveOptions(cell, ownUnits = {}) {
  const key = cell ? `${cell.x}:${cell.y}` : "";
  if (key !== moveSelectionKey) {
    moveSelectionKey = key;
    moveInf = ownUnits.inf || 0;
    moveRpg = (ownUnits.rpg || 0) > 0;
    moveTank = (ownUnits.tank || 0) > 0;
    moveMlrs = (ownUnits.mlrs || 0) > 0;
    movePickup = (ownUnits.pickup || 0) > 0;
    moveEw = (ownUnits.ew || 0) > 0 && ((ownUnits.inf || 0) > 0 || (ownUnits.rpg || 0) > 0 || (ownUnits.tank || 0) > 0 || (ownUnits.mlrs || 0) > 0 || (ownUnits.pickup || 0) > 0);
    moveCruiser = (ownUnits.cruiser || 0) > 0;
    moveDrone = (ownUnits.drone || 0) > 0 && (ownUnits.inf || 0) <= 0 && (ownUnits.rpg || 0) <= 0 && !ownUnits.tank && !ownUnits.mlrs && !ownUnits.pickup;
    return;
  }

  moveInf = defaultMoveInf(ownUnits);
  if (!ownUnits.rpg) moveRpg = false;
  if (!ownUnits.tank) moveTank = false;
  if (!ownUnits.mlrs) moveMlrs = false;
  if (!ownUnits.pickup) movePickup = false;
  if (!ownUnits.ew || ((ownUnits.inf || 0) <= 0 && (ownUnits.rpg || 0) <= 0 && !ownUnits.tank && !ownUnits.mlrs && !ownUnits.pickup)) moveEw = false;
  if (!ownUnits.cruiser) moveCruiser = false;
  if (!ownUnits.drone) moveDrone = false;
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
    ["Пикапы", stats.pickup],
    ["Шахеды", stats.saboteur],
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

function toggleInterfaceVisibility() {
  setInterfaceHidden(!interfaceHidden);
}

function setInterfaceHidden(hidden) {
  interfaceHidden = Boolean(hidden);
  if (interfaceHidden) {
    closeChat();
    closeJournal();
    statsOpen = false;
    renderStatsOverlay();
  }
  applyInterfaceVisibility();
}

function applyInterfaceVisibility() {
  els.game?.classList.toggle("game--ui-hidden", interfaceHidden);
  if (!els.uiToggleButton) return;
  els.uiToggleButton.classList.toggle("is-active", interfaceHidden);
  els.uiToggleButton.setAttribute("aria-pressed", interfaceHidden ? "true" : "false");
  els.uiToggleButton.title = interfaceHidden ? "Показать интерфейс" : "Скрыть интерфейс";
}

function openHelpModal() {
  modalSubmitHandler = null;
  const sections = [
    {
      title: "Цель партии",
      items: [
        "Твоя задача — остаться главной независимой страной на карте.",
        "Захватывай клетки, строй экономику, собирай армию и выбивай соперников.",
        "Если в конце осталась твоя страна и твои вассалы, победа засчитывается тебе."
      ]
    },
    {
      title: "Первые минуты",
      items: [
        "Нажми свою клетку со штабом. Внизу появятся действия для этой клетки.",
        "Сначала строй доход: ферму, деревню, город или шахту на ресурсной клетке.",
        "Найми пехоту. Без пехоты ты почти не сможешь расширяться.",
        "Занимай ближайшие пустые клетки, пока соседи не подошли к твоим границам."
      ]
    },
    {
      title: "Управление",
      items: [
        "Выбери клетку — игра покажет только действия, которые относятся к ней.",
        "Серые кнопки недоступны: не хватает ресурсов, здания, войск или идет перезарядка.",
        "Кнопки направления двигают выбранные войска на соседнюю клетку.",
        "Кнопка глаза в матче скрывает интерфейс, чтобы удобно смотреть карту."
      ]
    },
    {
      title: "Ресурсы",
      items: [
        "Золото нужно почти для всего: построек, найма, техники и спецоружия.",
        "Население тратится на солдат и экипажи. Его дают деревни и города.",
        "Железо нужно для техники, обороны, ракет и тяжелого оружия.",
        "Боеприпасы нужны для стрельбы, дронов, шахедов и РСЗО.",
        "Уран нужен для ядерки и усиленной ПВО."
      ]
    },
    {
      title: "Постройки",
      items: [
        "Ферма — простой доход золотом.",
        "Деревня и город дают население. Город сильнее, но дороже.",
        "Шахта добывает ресурс клетки: золото, железо или уран.",
        "Казарма помогает с пехотой, завод открывает технику и боеприпасы.",
        "Бункер держит оборону, ПВО сбивает воздух, РЭБ мешает дронам."
      ]
    },
    {
      title: "Захват клеток",
      items: [
        "Пустые нейтральные клетки можно занимать движением войск.",
        "Чужие клетки захватываются только во время войны.",
        "Для обычного захвата нужна пехота или гранатометчик.",
        "После успешной атаки клетка сначала отмечается штрихами, затем полностью становится твоей.",
        "Не оставляй важные клетки пустыми: враг может быстро пройти к штабу."
      ]
    },
    {
      title: "Война",
      items: [
        "Войну можно объявить через дипломатию или начать атакой по чужой клетке.",
        "Перед нападением подтяни пехоту, технику и боеприпасы к границе.",
        "Бей по экономике, заводам и штабу — так враг быстрее слабеет.",
        "Если враг капитулирует, победитель выбирает: продолжить захват или сделать его вассалом.",
        "Если потерял штаб, построй новый как можно быстрее."
      ]
    },
    {
      title: "Войска и оружие",
      items: [
        "Пехота дешевая и нужна для захвата территории.",
        "Гранатометчик помогает против техники и тоже может захватывать клетки.",
        "Танк силен на фронте и может стрелять по соседней клетке.",
        "Ракеты, РСЗО и крейсеры бьют на расстоянии, но требуют ресурсы и перезарядку.",
        "Дроны, шахеды и ядерка запускаются так: выбери оружие, затем выбери клетку-цель."
      ]
    },
    {
      title: "Дипломатия",
      items: [
        "Союз нужен, чтобы не воевать и помогать друг другу ресурсами.",
        "Запрос ресурсов отправляется другой стране. Если это твой вассал, ресурсы переводятся сразу.",
        "Ультиматум давит на слабую страну: она может сдаться или получить войну.",
        "Капитуляция — добровольная сдача врагу, с которым уже идет война.",
        "Революция позволяет вассалу попытаться выйти из подчинения."
      ]
    },
    {
      title: "Карты",
      items: [
        "Стандарт — обычная карта с сушей, водой и ресурсами.",
        "Острова — у каждой страны отдельный остров, воды много, ресурсов и дохода больше.",
        "Без воды — карта без рек и озер, больше места для сухопутной войны.",
        "В лобби можно нажать глаз рядом с картой и заранее посмотреть расклад."
      ]
    }
  ];

  els.modalLayer.innerHTML = `
    <div class="modal-box modal-box--help" role="dialog" aria-modal="true">
      <div class="modal-head">
        <strong>Как играть</strong>
        <button data-modal-close type="button">×</button>
      </div>
      <div class="help-rules">
        ${sections.map((section) => `
          <section class="help-section">
            <h3>${escapeHtml(section.title)}</h3>
            <ul>
              ${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </section>
        `).join("")}
      </div>
    </div>
  `;
  els.modalLayer.classList.remove("hidden");
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

function openCountrySelectModal({ title, submitLabel, onSubmit, optionsHtml = targetCountryOptionsHtml() }) {
  if (!optionsHtml) {
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
      ${countrySelectHtml(optionsHtml)}
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

function countrySelectHtml(optionsHtml = targetCountryOptionsHtml()) {
  return `
    <label class="field">
      <span>Страна</span>
      <select data-country-target>
        ${optionsHtml}
      </select>
    </label>
  `;
}

function targetCountryOptionsHtml(predicate = null) {
  return Object.values(state?.players || {})
    .filter((player) => player && player.id !== me && !player.defeated && (!predicate || predicate(player)))
    .map((player) => `<option value="${escapeHtml(player.id)}">${escapeHtml(player.country || player.id)} ${relationLabel(player.id)}</option>`)
    .join("");
}

function hasDiplomacyTargets() {
  return Boolean(targetCountryOptionsHtml());
}

function warTargetOptionsHtml() {
  return targetCountryOptionsHtml((player) => relationStatus(player.id) === "war");
}

function hasWarTargets() {
  return Boolean(warTargetOptionsHtml());
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

  if (event.target.closest("[data-exit-confirm]")) {
    send({ type: "leaveRoom" }, { priority: true });
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
    openDeveloperPanel();
    return;
  }

  const resourceAction = event.target.closest("[data-dev-resource-action]");
  if (resourceAction) {
    const targetId = els.modalLayer.querySelector("[data-dev-country]")?.value;
    const action = resourceAction.dataset.devResourceAction || "setResources";
    const resources = action === "setResources" ? readModalResourceState() : readDevResourceChange();
    if (!targetId || !resources) return;
    send({ type: "devResources", code: DEV_CODE, action, targetId, resources }, { priority: true });
    return;
  }

  const cheat = event.target.closest("[data-dev-cheat]");
  if (cheat) {
    const targetId = els.modalLayer.querySelector("[data-dev-country]")?.value;
    const eventType = els.modalLayer.querySelector("[data-dev-event]")?.value;
    const devCheat = cheat.dataset.devCheat;
    send({ type: "devResources", code: DEV_CODE, action: devCheat, targetId, eventType }, { priority: true });
    if ((devCheat === "enableFreeActions" || devCheat === "disableFreeActions") && state?.players?.[targetId]) {
      state.players[targetId].devFreeActions = devCheat === "enableFreeActions";
      openDeveloperPanel(targetId);
      return;
    }
    if ((devCheat === "clearTargetCooldowns" || devCheat === "restoreTargetCooldowns") && state?.players?.[targetId]) {
      state.players[targetId].devNoCooldowns = devCheat === "clearTargetCooldowns";
      openDeveloperPanel(targetId);
      return;
    }
    if (devCheat === "clearCooldowns" || devCheat === "restoreCooldowns") {
      const disabled = devCheat === "clearCooldowns";
      for (const player of Object.values(state?.players || {})) {
        if (player) player.devNoCooldowns = disabled;
      }
      openDeveloperPanel(targetId);
      return;
    }
    if (devCheat === "maxResources" || devCheat === "maxAllResources") {
      if (devCheat === "maxResources") {
        for (const input of els.modalLayer.querySelectorAll("[data-resource-input]")) {
          input.value = 999;
        }
      }
    } else if (devCheat === "zeroResources") {
      for (const input of els.modalLayer.querySelectorAll("[data-resource-input]")) {
        input.value = 0;
      }
    }
  }

}

function handleModalChange(event) {
  if (event.target.matches("[data-dev-country]")) {
    openDeveloperPanel(event.target.value);
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

function readDevResourceChange() {
  const resources = {};
  for (const input of els.modalLayer.querySelectorAll("[data-dev-resource-change]")) {
    const amount = Math.max(0, Math.floor(Number(input.value || 0)));
    if (amount > 0) resources[input.dataset.devResourceChange] = amount;
  }
  if (!Object.keys(resources).length) {
    showToast("Укажи сумму хотя бы для одного ресурса.");
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

function upsertNukeSmoke(nextSmoke) {
  const existing = nukeSmokes.find((smoke) => smoke.x === nextSmoke.x && smoke.y === nextSmoke.y);
  if (existing) {
    existing.id = nextSmoke.id;
    existing.at = nextSmoke.at;
    existing.until = nextSmoke.until;
    return;
  }
  nukeSmokes.push(nextSmoke);
}

function openExitModal() {
  els.modalLayer.innerHTML = `
    <div class="modal-box modal-box--small" role="dialog" aria-modal="true">
      <div class="modal-head">
        <strong>Выйти из комнаты?</strong>
        <button data-modal-close type="button">×</button>
      </div>
      <p class="modal-note">Комната будет удалена для всех игроков. Текущая партия не сохранится.</p>
      <div class="modal-actions">
        <button class="secondary" data-modal-close type="button">Остаться</button>
        <button class="primary danger-action" data-exit-confirm type="button">Выйти</button>
      </div>
    </div>
  `;
  els.modalLayer.classList.remove("hidden");
}

function openDeveloperMenu() {
  if (devUnlocked) {
    openDeveloperPanel();
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

function openDeveloperPanel(selectedId = null) {
  if (!state?.players) {
    showToast("Матч еще не загружен.");
    return;
  }
  const players = Object.values(state.players).filter(Boolean);
  const activeId = selectedId && state.players[selectedId] ? selectedId : (players[0]?.id || "");
  const active = state.players[activeId] || {};
  const dev = state.dev || {};
  const timedEvent = state.activeEvent || state.pendingEvent;
  const eventStatus = timedEvent
    ? `${timedEvent.label || timedEvent.type} ${state.pendingEvent ? `через ${timedEvent.startsIn || 0}с` : `${timedEvent.endsIn || 0}с`}`
    : "нет активного события";
  const options = players
    .map((player) => `<option value="${escapeHtml(player.id)}" ${player.id === activeId ? "selected" : ""}>${escapeHtml(player.country || player.id)}${player.defeated ? " (выбыла)" : ""}</option>`)
    .join("");

  els.modalLayer.innerHTML = `
    <div class="modal-box modal-box--dev" role="dialog" aria-modal="true">
      <div class="modal-head">
        <strong>Dev режим</strong>
        <button data-modal-close type="button">×</button>
      </div>

      <div class="dev-status-grid">
        <div><span>Код</span><strong>активен</strong></div>
        <div><span>События</span><strong>${dev.randomEventsEnabled ? "включены" : "выключены"}</strong></div>
        <div><span>Сейчас</span><strong>${escapeHtml(eventStatus)}</strong></div>
        <div><span>Перезарядки</span><strong>${dev.noCooldowns ? "отключены" : "обычные"}</strong></div>
      </div>

      <section class="dev-section">
        <div class="dev-section__head">
          <strong>Страна</strong>
          <span>${active.isBot ? "бот" : "игрок"}${active.defeated ? " · выбыла" : ""}</span>
        </div>
        <label class="field">
          <span>Кого правим</span>
          <select data-dev-country>${options}</select>
        </label>
        <div class="dev-country-card">
          <strong style="color:${escapeHtml(active.colorValue || "var(--ink)")};">${escapeHtml(active.country || active.id || "Страна")}</strong>
          <span>${resourcesLineHtml(active.resources || {})}</span>
          <span>nuke ${fmt(active.cooldowns?.nuke || 0)}с · saboteur ${fmt(active.cooldowns?.saboteur || 0)}с · power ${fmt(active.stats?.power || 0)} · ${active.devFreeActions ? "все бесплатно" : "обычная экономика"} · ${active.devNoCooldowns ? "без перезарядок" : "кд обычные"}</span>
        </div>
        <div class="dev-actions">
          <button class="${active.devFreeActions ? "" : "primary"}" data-dev-cheat="enableFreeActions" type="button">Все бесплатно ON</button>
          <button class="${active.devFreeActions ? "primary" : ""}" data-dev-cheat="disableFreeActions" type="button">Все бесплатно OFF</button>
        </div>
      </section>

      <section class="dev-section">
        <div class="dev-section__head">
          <strong>Ресурсы выбранной страны</strong>
          <span>новое значение / изменить на</span>
        </div>
        <div class="dev-resource-head"><span>ресурс</span><span>поставить</span><span>изменить на</span></div>
        <div class="dev-resource-editor">
          ${devResourceRowsHtml(active.resources || {})}
        </div>
        <div class="dev-actions dev-actions--three">
          <button class="primary" data-dev-resource-action="addResources" type="button">Добавить выбранной</button>
          <button data-dev-resource-action="subtractResources" type="button">Снять у выбранной</button>
          <button data-dev-resource-action="setResources" type="button">Поставить выбранной</button>
        </div>
        <div class="dev-actions">
          <button data-dev-cheat="maxResources" type="button">999 выбранной</button>
          <button data-dev-cheat="zeroResources" type="button">0 выбранной</button>
        </div>
        <div class="dev-actions dev-actions--global">
          <button data-dev-cheat="maxAllResources" type="button">Глобально: 999 всем странам</button>
        </div>
      </section>

      <section class="dev-section">
        <div class="dev-section__head">
          <strong>События</strong>
          <span>${dev.randomEventsEnabled ? "авто включены" : "авто выключены"}</span>
        </div>
        <div class="dev-event">
          <label class="field">
            <span>Тип события</span>
            <select data-dev-event>
              ${Object.entries(RANDOM_EVENT_DEFS).map(([id, label]) => `<option value="${escapeHtml(id)}">${escapeHtml(label)}</option>`).join("")}
            </select>
          </label>
          <button data-dev-cheat="triggerEvent" type="button">Запустить</button>
          <button data-dev-cheat="clearEvent" type="button">Снять текущее</button>
          <button data-dev-cheat="enableEvents" type="button">Авто ON</button>
          <button data-dev-cheat="disableEvents" type="button">Авто OFF</button>
        </div>
      </section>

      <section class="dev-section">
        <div class="dev-section__head">
          <strong>Перезарядки</strong>
          <span>${dev.hasCooldownSnapshot ? "есть сохранение" : "сохранения нет"}</span>
        </div>
        <div class="dev-actions">
          <button data-dev-cheat="clearCooldowns" type="button">Убрать всем</button>
          <button data-dev-cheat="restoreCooldowns" type="button">Вернуть всем</button>
          <button data-dev-cheat="clearTargetCooldowns" type="button">Убрать стране</button>
          <button data-dev-cheat="restoreTargetCooldowns" type="button">Вернуть стране</button>
        </div>
      </section>

      <section class="dev-section">
        <div class="dev-section__head">
          <strong>Матч</strong>
          <span>служебные действия</span>
        </div>
        <div class="dev-actions">
          <button data-dev-cheat="toggleAlwaysMisfire" type="button">${active.devAlwaysMisfire ? "Выключить осечки" : "Всегда осечки"}</button>
          <button data-dev-cheat="clearAlwaysMisfire" type="button">Снять осечки</button>
          <button data-dev-cheat="forceFactoryStrikes" type="button">Забастовки</button>
          <button data-dev-cheat="peaceAll" type="button">Нейтралитет всем</button>
        </div>
      </section>
    </div>
  `;
  els.modalLayer.classList.remove("hidden");
}

function devResourceRowsHtml(values = {}) {
  return RESOURCE_DEFS.map((resource) => `
    <label class="dev-resource-row">
      <span>${resource.icon} ${resource.label}</span>
      <input data-resource-input="${resource.key}" inputmode="numeric" min="0" type="number" value="${Math.max(0, Math.floor(values[resource.key] || 0))}" title="Поставить">
      <input data-dev-resource-change="${resource.key}" inputmode="numeric" min="0" type="number" value="0" title="Изменить на">
    </label>
  `).join("");
}

function handleCommand(command, kind, data = {}) {
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
    const availability = launchCommandAvailability("nuke");
    if (!availability?.ready) {
      showToast(availability?.reason || "Ядерка сейчас недоступна.");
      return;
    }
    pending = { action: "nuke" };
    showToast(availability.reason);
    renderGame();
    return;
  }
  if (command === "shahed") {
    const availability = launchCommandAvailability("shahed");
    if (!availability?.ready) {
      showToast(availability?.reason || "Шахед сейчас недоступен.");
      return;
    }
    pending = { action: "shahed" };
    showToast(availability.reason);
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
  if (command === "revolution") {
    send({ type: "diplomacy", action: "revolution" }, { priority: true });
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
  if (command === "capitulate") {
    openCountrySelectModal({
      title: "Капитуляция",
      submitLabel: "Сдаться",
      optionsHtml: warTargetOptionsHtml(),
      onSubmit(targetId) {
        send({
          type: "diplomacy",
          action: "capitulate",
          targetId
        }, { priority: true });
      }
    });
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
      sendNukeStrike(x, y);
    } else if (pending.action === "shahed") {
      sendShahedStrike(x, y);
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

function sendNukeStrike(tx, ty) {
  const now = Date.now();
  if (now - lastNukeRequestAt < NUKE_CLIENT_THROTTLE_MS) {
    return false;
  }
  lastNukeRequestAt = now;
  return send({ type: "action", action: "nuke", tx, ty }, { priority: true });
}

function sendShahedStrike(tx, ty) {
  const now = Date.now();
  if (now - lastShahedRequestAt < SHAHED_CLIENT_THROTTLE_MS) {
    return false;
  }
  lastShahedRequestAt = now;
  return send({ type: "action", action: "shahed", tx, ty }, { priority: true });
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
  if (!controlsCell(cell) && !(cell.terrain === "water" && hasOwnVessel(cell)) && (ownUnits.drone || 0) <= 0) {
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
    pickup: rawWaterTarget ? 0 : request.pickup,
    saboteur: 0,
    boat: boatSails && !cruiserSails,
    cruiser: cruiserSails
  }, { priority: true });
}

function pendingLabel() {
  if (!pending) return "";
  if (pending.action === "nuke") return "☢ выбери точку ядерного удара";
  if (pending.action === "shahed") return "🛩 выбери цель Шахеда";
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
  closeJournal();
  els.chatDrawer.classList.remove("hidden");
  renderChat();
  updateChatButton();
  setTimeout(() => els.chatInput?.focus(), 0);
}

function closeChat() {
  els.chatDrawer.classList.add("hidden");
  updateChatButton();
}

function toggleJournal() {
  if (els.journalDrawer?.classList.contains("hidden")) {
    openJournal();
  } else {
    closeJournal();
  }
}

function openJournal() {
  if (!els.journalDrawer) return;
  unreadJournalCount = 0;
  closeChat();
  els.journalDrawer.classList.remove("hidden");
  renderJournal();
  updateJournalButton();
}

function closeJournal() {
  els.journalDrawer?.classList.add("hidden");
  updateJournalButton();
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

function updateJournalButton() {
  if (!els.journalOpen) return;
  const unread = Math.min(unreadJournalCount, 99);
  const drawerOpen = !els.journalDrawer?.classList.contains("hidden");
  const nextKey = `${unread}:${drawerOpen ? 1 : 0}`;
  if (nextKey === renderedJournalButtonKey) return;
  renderedJournalButtonKey = nextKey;
  els.journalOpen.innerHTML = `
    <span>\u0416\u0443\u0440\u043d\u0430\u043b</span>
    ${unread > 0 ? `<b>${unread}</b>` : ""}
  `;
  els.journalOpen.classList.toggle("has-unread", unread > 0);
  els.journalOpen.setAttribute("aria-expanded", String(drawerOpen));
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

function renderJournal() {
  if (!state || !els.journalDrawer || els.journalDrawer.classList.contains("hidden")) return;
  const journal = (state.journal || []).slice(-80);
  const journalKey = journal.map((entry) => entry.id).join("|");
  if (journalKey === renderedJournalKey) return;
  renderedJournalKey = journalKey;
  els.journalLog.innerHTML = journal.map(journalEntryHtml).join("");
  els.journalLog.scrollTop = els.journalLog.scrollHeight;
}

function journalEntryHtml(entry) {
  const time = formatChatTime(entry.at || entry.time || entry.createdAt);
  return `
    <div class="chat-entry chat-entry--system">
      <div class="chat-entry__meta"><strong>\u0411\u043e\u0439</strong><span>${time}</span></div>
      <p>${escapeHtml(entry.text)}</p>
    </div>
  `;
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
  const capitulation = (state.capitulationOffers || []).find((item) => item.to === me);
  if (capitulation) {
    const nextKey = `capitulation:${capitulation.id}:${capitulation.from}`;
    if (nextKey === renderedDiplomacyPromptKey) return;
    renderedDiplomacyPromptKey = nextKey;
    const from = state.players?.[capitulation.from];
    els.diplomacyPrompt.classList.remove("hidden");
    els.diplomacyPrompt.classList.add("diplomacy-prompt--ultimatum");
    els.diplomacyPrompt.innerHTML = `
      <strong>${escapeHtml(from?.country || "Страна")} капитулирует</strong>
      <div>
        <button data-diplomacy-response="rejectCapitulation" data-capitulation-id="${escapeHtml(capitulation.id)}" type="button">Продолжить захват</button>
        <button data-diplomacy-response="acceptCapitulation" data-capitulation-id="${escapeHtml(capitulation.id)}" type="button">Сделать вассалом</button>
      </div>
    `;
    return;
  }

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
    .map((id) => formatUnits(cell.units?.[id] || {}))
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

function compactUnits(units) {
  const parts = [];
  if (units.inf) parts.push(`${UNIT_MARKS.inf} ${units.inf}`);
  if (units.rpg) parts.push(`${UNIT_MARKS.rpg} ${units.rpg}`);
  for (const key of ["tank", "rocket", "aa", "aaPlus", "ew", "mlrs", "drone", "pickup", "saboteur", "boat", "cruiser"]) {
    if (units[key]) parts.push(key === "drone" || key === "saboteur" ? `${UNIT_MARKS[key]} ${units[key]}` : UNIT_MARKS[key]);
  }
  return parts.join(" ");
}

function compactOtherUnits(cell) {
  return otherPlayerIds()
    .map((id) => compactUnits(cell.units?.[id] || {}))
    .filter(Boolean)
    .join("/");
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
  return (units.inf || 0) + (units.rpg || 0) + (units.tank || 0) + (units.mlrs || 0) + (units.drone || 0) + (units.pickup || 0) + (units.boat || 0) + (units.cruiser || 0);
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
      scrollMapToFraction(0.5, 0.5, force ? "smooth" : "auto");
      return;
    }
    const width = state.width || 34;
    const height = state.height || 24;
    scrollMapToFraction((homeCell.x + 0.5) / width, (homeCell.y + 0.5) / height, force ? "smooth" : "auto");
  });
}

function currentMapViewFraction() {
  const wrap = els.map?.parentElement;
  if (!wrap || !els.map?.offsetWidth || !els.map?.offsetHeight) return null;
  return {
    x: clamp((wrap.scrollLeft + wrap.clientWidth / 2 - els.map.offsetLeft) / els.map.offsetWidth, 0, 1),
    y: clamp((wrap.scrollTop + wrap.clientHeight / 2 - els.map.offsetTop) / els.map.offsetHeight, 0, 1)
  };
}

function scrollMapToFraction(x, y, behavior = "auto") {
  const wrap = els.map?.parentElement;
  if (!wrap || !els.map?.offsetWidth || !els.map?.offsetHeight) return;
  const left = els.map.offsetLeft + clamp(x, 0, 1) * els.map.offsetWidth - wrap.clientWidth / 2;
  const top = els.map.offsetTop + clamp(y, 0, 1) * els.map.offsetHeight - wrap.clientHeight / 2;
  wrap.scrollTo({
    left: clamp(left, 0, Math.max(0, wrap.scrollWidth - wrap.clientWidth)),
    top: clamp(top, 0, Math.max(0, wrap.scrollHeight - wrap.clientHeight)),
    behavior
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

function formatUnits(units) {
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
  if (units.pickup) parts.push("🚗");
  if (units.saboteur) parts.push(`${units.saboteur}🛩`);
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
  if (meta) meta.content = normalized === "dark" ? "#050505" : "#f5f5f2";
  try {
    localStorage.setItem("paperWarsTheme", normalized);
  } catch (error) {}
}

function loadSoundEnabled() {
  try {
    return localStorage.getItem("paperWarsSound") !== "off";
  } catch (error) {
    return true;
  }
}

function toggleSound() {
  sfxEnabled = !sfxEnabled;
  try {
    localStorage.setItem("paperWarsSound", sfxEnabled ? "on" : "off");
  } catch (error) {}
  applySoundPreference();
  if (!sfxEnabled) {
    stopRainAmbientSfx();
    stopAllEventSfx();
  } else {
    unlockSfxAudio();
    syncAmbientSfx();
  }
}

function applySoundPreference() {
  for (const button of [els.soundButton, els.lobbySoundButton]) {
    if (!button) continue;
    button.textContent = sfxEnabled ? "\u266a" : "\u00d7";
    button.title = sfxEnabled ? "Sound on" : "Sound off";
    button.setAttribute("aria-pressed", String(sfxEnabled));
  }
}

function stopAllEventSfx() {
  stopAllFlightSfx();
  stopNativeSfx();
  for (const players of Object.values(activeEventSfx)) {
    for (const audio of players || []) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (error) {}
    }
    players.length = 0;
  }
}

function startFlightSfx(effect) {
  stopFlightSfx(effect.id);
  const stop = playLoopedEventSfx("shahed", {
    x: effect.from.x,
    y: effect.from.y,
    playerId: effect.playerId
  }, effect.duration + 350);
  if (stop) flightSfxStops.set(effect.id, stop);
}

function stopFlightSfx(id) {
  const stop = flightSfxStops.get(id);
  if (!stop) return;
  flightSfxStops.delete(id);
  stop();
}

function stopAllFlightSfx() {
  for (const stop of flightSfxStops.values()) {
    stop();
  }
  flightSfxStops.clear();
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
  const center = currentMapViewFraction();
  mapZoom = nextZoom;
  els.map.style.setProperty("--map-zoom", mapZoom.toFixed(2));
  if (center) {
    requestAnimationFrame(() => scrollMapToFraction(center.x, center.y));
  }
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

function unlockSfxAudio() {
  sfxUnlocked = true;
  if (sfxEnabled) syncAmbientSfx();
}

function playSfx(name, detail = {}) {
  if (!sfxEnabled) return;
  const resolved = resolveSfxName(name, detail);
  if (eventSfxSources[resolved]) {
    playEventSfx(resolved, detail);
  }
}

function resolveSfxName(name, detail = {}) {
  if (name === "shot") {
    return {
      aa: "pvo",
      cruiser: "kreyser",
      drone: "drone",
      mlrs: "rszo_shot",
      rpg: "rpg",
      saboteur: "shahed",
      tank: "tank_shot"
    }[detail.weapon] || "";
  }
  const aliases = {
    alert: "",
    demolish: "d_house",
    diplomacy: "",
    hire: "stroyka",
    misfire: "osechka",
    nuke: "yaderka",
    Pikap: "pikap",
    REB: "reb"
  };
  return Object.prototype.hasOwnProperty.call(aliases, name) ? aliases[name] : name;
}

function updateEventSfxSources(sfx = {}) {
  eventSfxSources = {
    ...eventSfxSources,
    ...Object.fromEntries(Object.entries(sfx).filter(([, src]) => typeof src === "string" && src))
  };
  preloadEventSfx();
}

function preloadEventSfx() {
  if (nativeSfxAvailable()) return;
  for (const [name, src] of Object.entries(eventSfxSources)) {
    if (!src) continue;
    if (!eventSfxPlayers[name] || eventSfxPlayers[name].dataset.src !== src) {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.volume = 0.68;
      audio.dataset.src = src;
      eventSfxPlayers[name] = audio;
      audio.load();
    }
    fetch(src, { cache: "force-cache" }).catch(() => {});
  }
}

function playEventSfx(name, detail = {}) {
  if (!sfxUnlocked || !sfxEnabled) return;
  const src = eventSfxSources[name];
  if (!src && !nativeSfxAvailable()) return;
  if (name === "rain") {
    startRainAmbientSfx();
    return;
  }
  if (playNativeSfx(name, detail)) return;
  if (!src) return;
  const audio = createEventSfxAudio(name, src);
  const active = activeEventSfx[name] || [];
  activeEventSfx[name] = active.filter((item) => !item.ended && !item.paused);
  while (activeEventSfx[name].length >= MAX_SFX_OVERLAP_PER_NAME) {
    const old = activeEventSfx[name].shift();
    old.pause();
    old.currentTime = 0;
  }
  audio.currentTime = 0;
  audio.volume = sfxVolumeFor(name, detail);
  activeEventSfx[name].push(audio);
  const cleanup = () => {
    activeEventSfx[name] = (activeEventSfx[name] || []).filter((item) => item !== audio);
  };
  audio.addEventListener("ended", cleanup, { once: true });
  audio.play().catch(() => cleanup());
  const limit = SFX_PLAY_LIMIT_MS[name] || 0;
  if (limit > 0) {
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
      cleanup();
    }, limit);
  }
}

function playLoopedEventSfx(name, detail = {}, duration = SHAHED_FLIGHT_MS) {
  if (!sfxUnlocked || !sfxEnabled) return null;
  const src = eventSfxSources[name];
  if (!src && !nativeSfxAvailable()) return null;

  let stopped = false;
  let audio = null;
  let nativeLoopId = 0;
  let timer = null;
  const cleanup = () => {
    if (timer) clearTimeout(timer);
    if (nativeLoopId) {
      stopNativeLoopedSfx(nativeLoopId);
      nativeLoopId = 0;
    } else if (audio) {
      audio.pause();
      audio.currentTime = 0;
      activeEventSfx[name] = (activeEventSfx[name] || []).filter((item) => item !== audio);
    } else {
      stopNativeSfx(name);
    }
  };
  const stop = () => {
    if (stopped) return;
    stopped = true;
    cleanup();
  };

  nativeLoopId = playNativeLoopedSfx(name, detail);
  if (nativeLoopId) {
    timer = setTimeout(stop, Math.max(500, duration));
    return stop;
  }

  const canUseLegacyNativeLoop = !(name === "shahed" && nativeSfxAvailable() && !nativeLoopedSfxAvailable());
  if (canUseLegacyNativeLoop && playNativeSfx(name, detail, true)) {
    timer = setTimeout(stop, Math.max(500, duration));
    return stop;
  }

  if (!src) return null;
  audio = createEventSfxAudio(name, src);
  audio.loop = true;
  audio.volume = sfxVolumeFor(name, detail);
  activeEventSfx[name] = (activeEventSfx[name] || []).filter((item) => !item.ended && !item.paused);
  activeEventSfx[name].push(audio);
  audio.play().catch(stop);
  timer = setTimeout(stop, Math.max(500, duration));
  return stop;
}

function createEventSfxAudio(name, src) {
  const template = eventSfxPlayers[name];
  const audio = template?.cloneNode ? template.cloneNode(true) : new Audio(src);
  audio.preload = "auto";
  audio.dataset.src = src;
  return audio;
}

function syncAmbientSfx() {
  if (sfxEnabled && state?.activeEvent?.type === "rain") {
    startRainAmbientSfx();
  } else {
    stopRainAmbientSfx();
  }
}

function startRainAmbientSfx() {
  if (!sfxUnlocked || !sfxEnabled || rainAmbientPlayer) return;
  if (playNativeSfx("rain", {}, true)) {
    rainAmbientPlayer = { native: true };
    return;
  }
  const src = eventSfxSources.rain;
  if (!src) return;
  const audio = createEventSfxAudio("rain", src);
  audio.loop = true;
  audio.volume = 0.38;
  rainAmbientPlayer = audio;
  audio.play().catch(() => {
    if (rainAmbientPlayer === audio) rainAmbientPlayer = null;
  });
}

function stopRainAmbientSfx() {
  if (!rainAmbientPlayer) return;
  if (rainAmbientPlayer.native) {
    stopNativeSfx("rain");
    rainAmbientPlayer = null;
    return;
  }
  rainAmbientPlayer.pause();
  rainAmbientPlayer.currentTime = 0;
  rainAmbientPlayer = null;
}

function nativeSfxAvailable() {
  return Boolean(window.PaperWarsNativeAudio?.playSfx);
}

function nativeLoopedSfxAvailable() {
  const bridge = window.PaperWarsNativeAudio;
  return Boolean(bridge?.playLoopingSfx && bridge?.stopLoopingSfx);
}

function playNativeSfx(name, detail = {}, loop = false) {
  if (!nativeSfxAvailable()) return false;
  try {
    return window.PaperWarsNativeAudio.playSfx(String(name), sfxVolumeFor(name, detail), Boolean(loop)) !== false;
  } catch (error) {
    return false;
  }
}

function playNativeLoopedSfx(name, detail = {}) {
  if (!nativeLoopedSfxAvailable()) return 0;
  try {
    const streamId = Number(window.PaperWarsNativeAudio.playLoopingSfx(String(name), sfxVolumeFor(name, detail)));
    return Number.isFinite(streamId) && streamId !== 0 ? streamId : 0;
  } catch (error) {
    return 0;
  }
}

function stopNativeLoopedSfx(streamId) {
  const bridge = window.PaperWarsNativeAudio;
  if (!bridge?.stopLoopingSfx || !streamId) return;
  try {
    bridge.stopLoopingSfx(Number(streamId));
  } catch (error) {}
}

function stopNativeSfx(name = "") {
  const bridge = window.PaperWarsNativeAudio;
  if (!bridge) return;
  try {
    if (name && bridge.stopSfx) {
      bridge.stopSfx(String(name));
    } else if (bridge.stopAllSfx) {
      bridge.stopAllSfx();
    }
  } catch (error) {}
}

function sfxVolumeFor(name, detail = {}) {
  const baseVolume = name === "win" ? 0.78 : 0.68;
  if (detail.system || POSITIONAL_VOLUME_EXEMPT.has(name)) return baseVolume;

  const x = Number(detail.x);
  const y = Number(detail.y);
  if (!Number.isFinite(x) || !Number.isFinite(y) || !state?.width || !state?.height) return baseVolume;

  const view = cameraViewMetrics();
  if (!view) return baseVolume;

  const distance = Math.hypot(x - view.x, y - view.y);
  const audibleRadius = Math.max(1.2, Math.hypot(view.visibleWidth, view.visibleHeight) * 0.62);
  const distanceGain = Math.pow(clamp(1 - distance / audibleRadius, 0, 1), 2.15);
  const zoomT = clamp((mapZoom - 0.72) / (2.8 - 0.72), 0, 1);
  const zoomGain = 0.035 + Math.pow(zoomT, 1.65) * 1.35;
  return clamp(baseVolume * distanceGain * zoomGain, 0, 1);
}

function cameraViewMetrics() {
  const wrap = els.map?.parentElement;
  if (!wrap || !state?.width || !state?.height) return null;
  const wrapRect = wrap.getBoundingClientRect();
  const mapRect = els.map.getBoundingClientRect();
  if (!mapRect.width || !mapRect.height) return null;
  const x = ((wrapRect.left + wrapRect.width / 2 - mapRect.left) / mapRect.width) * state.width - 0.5;
  const y = ((wrapRect.top + wrapRect.height / 2 - mapRect.top) / mapRect.height) * state.height - 0.5;
  return {
    x: clamp(x, 0, state.width - 1),
    y: clamp(y, 0, state.height - 1),
    visibleWidth: clamp((wrapRect.width / mapRect.width) * state.width, 1, state.width),
    visibleHeight: clamp((wrapRect.height / mapRect.height) * state.height, 1, state.height)
  };
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

CLIENT_TOKEN = getClientToken();
sfxEnabled = loadSoundEnabled();

ensureDynamicUi();
applyTheme(loadTheme());
applySoundPreference();
connect();
bindUi();
preloadEventSfx();
registerServiceWorker();
setInterval(updateLivePanels, 1000);
