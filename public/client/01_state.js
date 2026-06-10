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
let movePickup = true;
let explosions = [];
let nukeSmokes = [];
let impactSmokes = [];
let shotEffects = [];
let flightEffects = [];
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
const SFX_NAMES = [
  "attack", "drone", "drone_run", "d_house", "d_tehnika", "fail", "kreyser", "money", "osechka", "Pikap", "pvo", "rain", "raketa", "REB",
  "rpg", "rszo", "rszo_hit", "rszo_shot", "shahed", "soyuz", "stroyka", "tank", "tank_shot", "war", "win", "yaderka"
];
const POSITIONAL_VOLUME_EXEMPT = new Set(["fail", "money", "rain", "shahed", "soyuz", "war", "win", "yaderka"]);
const SFX_PLAY_LIMIT_MS = {
  drone_run: 2000,
  Pikap: 2000,
  tank: 2000
};
const MAX_SFX_OVERLAP_PER_NAME = 8;
let eventSfxSources = Object.fromEntries(SFX_NAMES.map((name) => [name, `/sfx/${name}.mp3`]));
const eventSfxPlayers = {};
const activeEventSfx = {};
let rainAmbientPlayer = null;
let sfxUnlocked = false;
let lastExplosionSfxAt = 0;
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
let trollCensorTimer = null;
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
let CLIENT_TOKEN = "";
let sfxEnabled = true;

