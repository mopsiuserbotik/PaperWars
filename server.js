const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT) || 8080;
const WIDTH = 34;
const HEIGHT = 24;
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const SFX_DIR = path.join(ROOT, "server", "sfx");
const WS_GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
const MIN_HUMAN_PLAYERS = 1;
const MAX_HUMAN_PLAYERS = 7;
const HUMAN_IDS = Array.from({ length: MAX_HUMAN_PLAYERS }, (_, index) => `p${index + 1}`);
const BOT_IDS = ["farmers", "anarchists", "mechanics", "rivermen"];
const PLAYER_IDS = [...HUMAN_IDS, ...BOT_IDS];
const EVENT_SFX_ALIASES = {
  demolish: "d_house",
  misfire: "osechka",
  nuke: "yaderka"
};
const TROLL_CENSOR_MAX_SECONDS = 60;
const BOT_PROFILES = {
  farmers:   { country: "Фермеры",   color: "farmers",   colorValue: "#19c9c2", personality: "passive" },
  anarchists:{ country: "Анархисты", color: "anarchists",colorValue: "#2f3437", personality: "aggressive" },
  mechanics: { country: "Механики",  color: "mechanics", colorValue: "#c06010", personality: "industrial" },
  rivermen:  { country: "Рыбаки",    color: "rivermen",  colorValue: "#1a7a6e", personality: "fisher" }
};

const BOT_IDEOLOGIES = {
  farmers: "communism",
  anarchists: "anarchism",
  mechanics: "technocracy",
  rivermen: "democracy"
};

const FARMER_CELL_LIMIT = 28;
const BOT_ECONOMY_MULTIPLIER = 0.78;
const SUPPORT_INTERVAL_MS = 45_000;
const BOT_TURN_INTERVAL_MS = 3_200;
const BOT_TURN_STAGGER_MS = 2_400;
const BOT_MOVE_COOLDOWN_MS = 2_400;
const BOT_MOVE_JITTER_MS = 1_400;
const BOT_RETRY_COOLDOWN_MS = 2_000;
const GAME_LOOP_INTERVAL_MS = 500;
const INCOME_CHECK_INTERVAL_MS = 1_000;
const HQ_REBUILD_WINDOW_MS = 100_000;
const BOT_MINIMUMS = {
  passive:    { farm: 3, mine: 1, barracks: 1, factory: 0, port: 0 },
  aggressive: { farm: 1, mine: 1, barracks: 2, factory: 1, port: 0 },
  industrial: { farm: 1, mine: 2, barracks: 1, factory: 2, port: 0 },
  fisher:     { farm: 2, mine: 1, barracks: 1, factory: 0, port: 2 }
};
const BOT_FACTORY_LIMITS = {
  passive: 1,
  aggressive: 2,
  industrial: 2,
  fisher: 1
};
const BOT_BRIDGE_LIMITS = {
  passive: 0,
  aggressive: 2,
  industrial: 3,
  fisher: 4
};
const RESOURCE_SPACING = 2;
const RESOURCE_KEYS = ["gold", "iron", "pop", "ammo", "uranium"];
const RESOURCE_LABELS = {
  gold: "золото",
  iron: "железо",
  pop: "население",
  ammo: "боеприпасы",
  uranium: "уран"
};
const DEV_CODE = "6686";
const RANDOM_EVENT_INTERVAL_MS = 360_000;
const RANDOM_EVENT_WARNING_MS = 20_000;
const RANDOM_EVENT_CHANCE = 0.4;
const CONSTRUCTION_MS = 1_500;
const SHAHED_FLIGHT_MS = 17_040;
const NUKE_FLIGHT_MS = 2_400;
const ROCKET_FLIGHT_MS = 1_050;
const SHAHED_ACTION_THROTTLE_MS = 900;
const EPIDEMIC_TICK_MS = 12_000;
const EPIDEMIC_HOSPITALS_REQUIRED = 3;
const MISFIRE_CHANCE = 0.15;
const SPECIAL_OP_COOLDOWN_MS = 220_000;
const SPECIAL_OP_DELAY_MS = 30_000;
const AIR_DEFENSE_SABOTAGE_MS = 30_000;
const BASE_AMMO_CAPACITY = 20;
const AMMO_DEPOT_CAPACITY = 50;
const FACTORY_STRIKE_CHANCE = 0.15;
const FACTORY_STRIKE_MS = 45_000;
const BOT_TARGET_MEMORY_MS = {
  rpg: 12_000,
  tank: 12_000,
  rocket: 45_000,
  mlrs: 45_000,
  cruiser: 35_000,
  nuke: 180_000
};

const IDEOLOGIES = {
  autocracy: {
    label: "Автократия",
    buff: "перезарядка оружия -10%",
    cooldown: 0.9
  },
  communism: {
    label: "Коммунизм",
    buff: "население растет быстрее",
    popIncome: 1.2
  },
  democracy: {
    label: "Демократия",
    buff: "добыча золота +10%",
    goldIncome: 1.1
  },
  fascism: {
    label: "Фашизм",
    buff: "перезарядка оружия -15%",
    cooldown: 0.85
  },
  technocracy: {
    label: "Технократия",
    buff: "заводы и железные шахты эффективнее",
    ammoIncome: 1.15,
    ironIncome: 1.15
  },
  theocracy: {
    label: "Теократия",
    buff: "спецоперации заметно успешнее",
    specialOp: 0.08
  },
  anarchism: {
    label: "Анархизм",
    buff: "грабеж и спецоперации успешнее",
    specialOp: 0.08,
    botOnly: true
  }
};

const SPECIAL_OPS = {
  sabotageFactory: { label: "Саботаж завода", chance: 0.58 },
  sabotageAirDefense: { label: "Саботаж ПВО", chance: 0.6 },
  destroyBunker: { label: "Уничтожение бункера", chance: 0.54 },
  stealSupplies: { label: "Тихая кража", chance: 0.62 },
  partisanRaid: { label: "Партизанский рейд", chance: 0.52 },
  jamWeapons: { label: "Глушение оружия", chance: 0.55 },
  scout: { label: "Разведка", chance: 0.78 },
  smuggleAmmo: { label: "Контрабанда", chance: 0.64 },
  anarchistLoot: { label: "Грабеж", chance: 0.68, anarchistsOnly: true }
};

const RANDOM_EVENTS = {
  rain: { label: "Дождь", duration: 60_000 },
  drought: { label: "Засуха", duration: 60_000 },
  goldRush: { label: "Золотая лихорадка", duration: 60_000 },
  fog: { label: "Густой туман", duration: 60_000 },
  epidemic: { label: "Эпидемия", duration: 120_000 },
  looter: { label: "Праздник мародера", duration: 20_000 }
};

const COLOR_OPTIONS = [
  { id: "red", name: "Красный", value: "#e24343" },
  { id: "blue", name: "Синий", value: "#2f74ff" },
  { id: "green", name: "Зеленый", value: "#2eaa64" },
  { id: "violet", name: "Фиолетовый", value: "#8b5cf6" },
  { id: "gray", name: "Серый", value: "#6b7280" },
  { id: "orange", name: "Оранжевый", value: "#f97316" },
  { id: "cyan", name: "Бирюзовый", value: "#06b6d4" }
];

const BUILDINGS = {
  hq: { label: "Штаб", icon: "🏛", cost: { gold: 100 } },
  village: { label: "Деревня", icon: "🏘", cost: { gold: 5 } },
  city: { label: "Город", icon: "🏢", cost: { gold: 12 } },
  barracks: { label: "Казармы", icon: "🏚", cost: { gold: 8 } },
  mine: { label: "Шахта", icon: "⛏", cost: { gold: 10 } },
  minePlus: { label: "Шахта+", icon: "⛏+", cost: { gold: 35 } },
  farm: { label: "Ферма", icon: "🌾", cost: { gold: 5 } },
  port: { label: "Порт", icon: "🏗", cost: { gold: 15 } },
  bridge: { label: "Мост", icon: "🟫", cost: { gold: 20 } },
  factory: { label: "Завод", icon: "🏭", cost: { gold: 30 } },
  ammoDepot: { label: "Склад", icon: "📦", cost: { gold: 5 } },
  bunker: { label: "Бункер", icon: "🧱", cost: { gold: 22, iron: 8 } },
  hospital: { label: "Больница", icon: "🏥", cost: { gold: 13 } },
  tck: { label: "ТЦК", icon: "📋", cost: { gold: 24 } },
  counterIntel: { label: "Контрразведка", icon: "🕵", cost: { gold: 120 } },
  nuclearPlant: { label: "Ядерный завод", icon: "☢🏭", cost: { gold: 150 } }
};

const BUILDING_INCOME = {
  farm:     { interval: 30_000, resource: "gold",  amount: 1 },
  port:     { interval: 30_000, resource: "gold",  amount: 3 },
  village:  { interval: 30_000, resource: "pop",   amount: 1 },
  city:     { interval: 30_000, resource: "pop",   amount: 2 },
  barracks: { interval: 35_000, resource: "inf",   amount: 1 },  // "inf" — особый случай: юнит, не ресурс
  factory:  { interval: 90_000, resource: "ammo",  amount: 12 }
};

const MINE_INCOME = {
  gold:    { interval: 30_000, resource: "gold",    amount: 2 },
  iron:    { interval: 22_000, resource: "iron",    amount: 2 },
  uranium: { interval: 30_000, resource: "uranium", amount: 1 }
};

const LOBBY_INCOME_DEFAULTS = {
  farm: 1,
  port: 1,
  village: 1,
  city: 1,
  barracks: 1,
  factory: 1,
  mineGold: 1,
  mineIron: 1,
  mineUranium: 1,
  minePlusGold: 1
};


const UNITS = {
  rpg: { label: "Гранатометчик", icon: "🎯", cost: { pop: 1, gold: 6, iron: 1, ammo: 1 }, power: 1, movable: true, stack: false },
  inf: { label: "Пехота", icon: "⚔️", cost: { pop: 1, gold: 2 }, power: 1, movable: true, stack: true },
  tank: { label: "Танк", icon: "🚜", cost: { pop: 2, gold: 18, iron: 8 }, power: 3, movable: true, stack: false },
  rocket: { label: "Ракетная установка", icon: "🚀", cost: { pop: 1, gold: 28, iron: 12 }, power: 2, movable: false, stack: false },
  aa: { label: "ПВО", icon: "🛡", cost: { pop: 1, gold: 22, iron: 8 }, power: 1, movable: false, stack: false },
  aaPlus: { label: "ПВО+", icon: "🛰", cost: { pop: 2, gold: 55, iron: 18, uranium: 4 }, power: 2, movable: false, stack: false },
  ew: { label: "РЭБ", icon: "📡", cost: { gold: 10, iron: 2 }, power: 0, movable: true, stack: false },
  mlrs: { label: "РСЗО", icon: "🚚", cost: { pop: 3, gold: 70, iron: 28 }, power: 2, movable: true, stack: false },
  drone: { label: "Дрон", icon: "🛸", cost: { gold: 16, iron: 4, ammo: 3 }, power: 0, movable: true, stack: true },
  saboteur: { label: "Шахед", icon: "🛩", cost: { pop: 1, gold: 45, iron: 6, ammo: 4 }, power: 0, movable: true, stack: true },
  boat: { label: "Лодка", icon: "🚤", cost: { pop: 1, gold: 12, iron: 5 }, power: 0, movable: true, stack: false },
  cruiser: { label: "Крейсер", icon: "🚢", cost: { pop: 2, gold: 55, iron: 24 }, power: 0, movable: true, stack: false }
};

const NUCLEAR_COST = { gold: 90, iron: 30, uranium: 20, pop: 3 };
const SCRAPPABLE_UNITS = ["tank", "rocket", "aa", "aaPlus", "ew", "mlrs", "drone", "boat", "cruiser"];
const COOLDOWNS = {
  rpg: 15_000,
  tank: 10_000,
  rocket: 60_000,
  mlrs: 70_000,
  cruiser: 45_000,
  nuke: 120_000,
  saboteur: 120_000
};
const MLRS_SALVO_COUNT = 4;
const MLRS_INFANTRY_KILL_RATIO = 0.5;
const MLRS_TECH_HIT_CHANCE = 0.6;
const RPG_DESTROY_CHANCE = 0.6;
const DRONE_DESTROY_CHANCE = 0.6;
const COUNTER_INTEL_PENALTY = 0.16;
const COUNTER_INTEL_PENALTY_CAP = 0.35;
const UNIT_KEYS = ["inf", "rpg", "tank", "rocket", "aa", "aaPlus", "ew", "mlrs", "drone", "saboteur", "boat", "cruiser"];
const TECH_SFX_UNITS = ["tank", "rocket", "aa", "aaPlus", "ew", "mlrs", "drone", "boat", "cruiser"];
const WEAPON_COOLDOWN_KEYS = ["rpg", "tank", "rocket", "mlrs", "cruiser"];
const STATIC_DEPLOY_UNITS = new Set(["rocket", "aa", "aaPlus", "ew"]);

const WS_PING_INTERVAL_MS = 10_000;
const MAX_WS_BUFFER_BYTES = 64 * 1024;
const MAX_WS_PAYLOAD_BYTES = 32 * 1024;
const MAX_WS_BACKLOG_BYTES = 64 * 1024;
const MESSAGE_WINDOW_MS = 5_000;
const MAX_MESSAGES_PER_WINDOW = 80;
const STATE_BROADCAST_DELAY_MS = 16;
const NUKE_ACTION_THROTTLE_MS = 900;
const LOBBY_CODE_LENGTH = 4;
const EMPTY_LOBBY_TTL_MS = 30 * 60_000;
const EMPTY_RUNNING_TTL_MS = 20 * 60_000;

const clients = new Set();
const games = new Map();
let game = null;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

const server = http.createServer((req, res) => {
  try {
    serveHttp(req, res);
  } catch (error) {
    console.error(error);
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Server error");
  }
});

server.on("upgrade", (req, socket) => {
  if ((req.headers.upgrade || "").toLowerCase() !== "websocket") {
    socket.destroy();
    return;
  }

  const key = req.headers["sec-websocket-key"];
  if (!key) {
    socket.destroy();
    return;
  }

  const accept = crypto.createHash("sha1").update(key + WS_GUID).digest("base64");
  socket.write([
    "HTTP/1.1 101 Switching Protocols",
    "Upgrade: websocket",
    "Connection: Upgrade",
    `Sec-WebSocket-Accept: ${accept}`,
    "",
    ""
  ].join("\r\n"));

  attachWebSocket(socket, req);
});

server.listen(PORT, () => {
  console.log(`Paper Wars server: http://localhost:${PORT}`);
});

setInterval(() => {
  for (const client of clients) {
    if (client.socket.destroyed) {
      detachClient(client);
      continue;
    }

    if (!client.alive && Date.now() - client.lastSeen > WS_PING_INTERVAL_MS) {
      client.socket.destroy();
      detachClient(client);
      continue;
    }

    client.alive = false;
    if (client.socket.writableLength < MAX_WS_BACKLOG_BYTES) {
      sendFrame(client.socket, 0x9, Buffer.alloc(0));
    }
  }
  cleanupEmptyGames();
}, WS_PING_INTERVAL_MS).unref?.();

function serveHttp(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/api/sfx") {
    sendJson(res, { sfx: getEventSfxPaths() });
    return;
  }

  if (url.pathname.startsWith("/sfx/")) {
    const file = safePath(SFX_DIR, url.pathname.replace(/^\/sfx\//, ""));
    serveFile(req, file, res);
    return;
  }

  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const file = safePath(PUBLIC_DIR, pathname);
  serveFile(req, file, res);
}

function safePath(root, requestPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(requestPath).replace(/^[/\\]+/, "");
  } catch (error) {
    return null;
  }
  const resolved = path.resolve(root, decoded);
  const normalizedRoot = path.resolve(root);
  const relative = path.relative(normalizedRoot, resolved);
  return relative && (relative.startsWith("..") || path.isAbsolute(relative)) ? null : resolved;
}

function serveFile(req, file, res) {
  if (!file || !fs.existsSync(file)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const stat = fs.statSync(file);
  if (!stat.isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const ext = path.extname(file).toLowerCase();
  const isAudio = [".wav", ".mp3", ".ogg"].includes(ext);
  const etag = `W/"${stat.size}-${Math.floor(stat.mtimeMs)}"`;
  const baseHeaders = {
    "Content-Type": mimeTypes[ext] || "application/octet-stream",
    "Cache-Control": isAudio ? "public, max-age=86400" : "no-cache",
    "ETag": etag,
    "Last-Modified": stat.mtime.toUTCString()
  };

  if (!req.headers.range && req.headers["if-none-match"] === etag) {
    res.writeHead(304, baseHeaders);
    res.end();
    return;
  }

  if (isAudio) {
    baseHeaders["Accept-Ranges"] = "bytes";
  }

  if (isAudio && req.headers.range) {
    const range = parseRange(req.headers.range, stat.size);
    if (!range) {
      res.writeHead(416, {
        ...baseHeaders,
        "Content-Range": `bytes */${stat.size}`
      });
      res.end();
      return;
    }

    res.writeHead(206, {
      ...baseHeaders,
      "Content-Length": range.end - range.start + 1,
      "Content-Range": `bytes ${range.start}-${range.end}/${stat.size}`
    });
    fs.createReadStream(file, { start: range.start, end: range.end }).pipe(res);
    return;
  }

  res.writeHead(200, {
    ...baseHeaders,
    "Content-Length": stat.size
  });
  fs.createReadStream(file).pipe(res);
}

function parseRange(header, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header || "");
  if (!match) return null;
  let start = match[1] ? Number(match[1]) : 0;
  let end = match[2] ? Number(match[2]) : size - 1;

  if (!Number.isInteger(start) || !Number.isInteger(end)) return null;
  if (!match[1] && match[2]) {
    const suffixLength = Number(match[2]);
    if (!Number.isInteger(suffixLength) || suffixLength <= 0) return null;
    start = Math.max(0, size - suffixLength);
    end = size - 1;
  }

  end = Math.min(end, size - 1);
  return start <= end && start >= 0 ? { start, end } : null;
}

function sendJson(res, body) {
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
}

function getEventSfxPaths() {
  const entries = [];
  try {
    for (const file of fs.readdirSync(SFX_DIR)) {
      if (!file.toLowerCase().endsWith(".mp3")) continue;
      const name = path.basename(file, path.extname(file));
      entries.push([name, `/sfx/${encodeURIComponent(file)}`]);
    }
  } catch (error) {}
  const paths = Object.fromEntries(entries);
  for (const [alias, target] of Object.entries(EVENT_SFX_ALIASES)) {
    if (paths[target] && !paths[alias]) {
      paths[alias] = paths[target];
    }
  }
  return paths;
}

function createGameRoom() {
  const room = createFreshGame();
  room.id = typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  games.set(room.id, room);
  return room;
}

function withGame(room, callback) {
  if (!room) return undefined;
  const previousGame = game;
  game = room;
  try {
    return callback();
  } finally {
    game = previousGame;
  }
}

function clientGame(client) {
  return client?.gameId ? games.get(client.gameId) || null : null;
}

function clientsForGame(room) {
  if (!room?.id) return [];
  return Array.from(clients).filter((client) => client.gameId === room.id);
}

function clientsForCurrentGame() {
  return clientsForGame(game);
}

function emptyLobbyPayload() {
  return {
    type: "lobby",
    status: "lobby",
    created: false,
    hostId: null,
    code: null,
    settings: defaultLobbySettings(),
    bots: botLobbyPayload(),
    players: Object.fromEntries(HUMAN_IDS.map((id) => [id, null])),
    maxHumans: defaultLobbySettings().maxHumans,
    minHumans: MIN_HUMAN_PLAYERS,
    maxHumanLimit: MAX_HUMAN_PLAYERS,
    colors: COLOR_OPTIONS
  };
}

function botLobbyPayload() {
  return Object.fromEntries(BOT_IDS.map((id) => [id, {
    id,
    country: BOT_PROFILES[id].country,
    colorValue: BOT_PROFILES[id].colorValue,
    personality: BOT_PROFILES[id].personality
  }]));
}

function uniqueLobbyCode() {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const code = String(randomInt(0, 10 ** LOBBY_CODE_LENGTH - 1)).padStart(LOBBY_CODE_LENGTH, "0");
    const occupied = Array.from(games.values()).some((room) => room.lobbyCode === code && room.status !== "ended");
    if (!occupied) return code;
  }
  return String(Date.now() % (10 ** LOBBY_CODE_LENGTH)).padStart(LOBBY_CODE_LENGTH, "0");
}

function findLobbyByCode(code) {
  return Array.from(games.values()).find((room) => room.lobbyCreated && room.lobbyCode === code) || null;
}

function findRoomByPlayerToken(token) {
  if (!token) return null;
  return Array.from(games.values()).find((room) =>
    room.status !== "ended" &&
    HUMAN_IDS.some((id) => room.players[id]?.token === token)
  ) || null;
}

function humanSlotsForRoom(room = game) {
  const maxHumans = sanitizeHumanCount(room?.settings?.maxHumans);
  return HUMAN_IDS.slice(0, maxHumans);
}

function joinedHumanIds(room = game) {
  return humanSlotsForRoom(room).filter((id) => room?.players[id]?.joined);
}

function connectedJoinedHumanIds(room = game) {
  return joinedHumanIds(room).filter((id) => room.players[id]?.connected);
}

function lobbyReadyToStart(room = game) {
  const slots = humanSlotsForRoom(room);
  return slots.length > 0 &&
    joinedHumanIds(room).length >= slots.length &&
    connectedJoinedHumanIds(room).length >= slots.length;
}

function sendHello(client) {
  send(client, {
    type: "hello",
    playerId: client.playerId,
    spectator: client.spectator,
    colors: COLOR_OPTIONS,
    width: WIDTH,
    height: HEIGHT,
    sfx: getEventSfxPaths()
  });
}

function attachWebSocket(socket, req) {
  socket.setNoDelay?.(true);
  socket.setKeepAlive?.(true, WS_PING_INTERVAL_MS);

  const token = readClientToken(req);
  const ip = readClientIp(req);
  const previousSession = disconnectDuplicateTokenClients(token);

  const client = {
    socket,
    token,
    ip,
    buffer: Buffer.alloc(0),
    gameId: null,
    playerId: null,
    spectator: false,
    messageWindowStarted: Date.now(),
    messageCount: 0,
    pendingState: null,
    waitingForDrain: false,
    lastMapVersionSent: -1,
    lastChatVersionSent: -1,
    lastNukeActionAt: 0,
    lastNukeThrottleNoticeAt: 0,
    alive: true,
    lastSeen: Date.now()
  };

  clients.add(client);

  const previousRoom = previousSession?.gameId ? games.get(previousSession.gameId) : findRoomByPlayerToken(token);
  if (previousRoom) {
    const slot = assignPlayerSlot(previousRoom, previousSession?.playerId || null, token, ip);
    if (slot) {
      withGame(previousRoom, () => {
        attachClientToGame(client, previousRoom, slot);
      });
    }
  }

  sendHello(client);
  const joinedRoom = clientGame(client);
  if (joinedRoom) {
    withGame(joinedRoom, () => {
      if (game.status === "lobby" && lobbyReadyToStart(game)) {
        startGame();
      }
    });
    if (joinedRoom.status === "lobby") {
      withGame(joinedRoom, () => send(client, lobbyPayloadFor(client)));
    } else {
      withGame(joinedRoom, () => sendState(client));
    }
  } else {
    send(client, emptyLobbyPayload());
  }

  socket.on("data", (chunk) => readFrames(client, chunk));
  socket.on("close", () => detachClient(client));
  socket.on("end", () => detachClient(client));
  socket.on("error", () => detachClient(client));
}

function readClientToken(req) {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    return cleanText(url.searchParams.get("client"), 80);
  } catch (error) {
    return "";
  }
}

function readClientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return cleanText(forwarded || req.socket?.remoteAddress || "", 80);
}

function disconnectDuplicateTokenClients(token) {
  if (!token) return null;
  let previousSession = null;

  for (const client of Array.from(clients)) {
    if (client.token !== token) continue;
    if (!previousSession && client.playerId && client.gameId) {
      previousSession = { gameId: client.gameId, playerId: client.playerId };
    }
    detachClient(client);
    client.socket.destroy();
  }

  return previousSession;
}

function assignPlayerSlot(room, preferredSlot = null, token = "", ip = "") {
  if (!room) return null;
  const activeHuman = (id) => clientsForGame(room).some((client) => client.playerId === id);
  const allowedSlots = humanSlotsForRoom(room);
  const canUseSlot = (id) => allowedSlots.includes(id) && !activeHuman(id);

  if (preferredSlot && canUseSlot(preferredSlot)) {
    return preferredSlot;
  }

  for (const id of allowedSlots) {
    const player = room.players[id];
    if (!player?.joined || !canUseSlot(id)) continue;
    if (token && player.token === token) {
      return id;
    }
  }

  for (const id of allowedSlots) {
    const player = room.players[id];
    if (!canUseSlot(id)) continue;
    if (!player?.joined) return id;
  }

  return null;
}

function attachClientToGame(client, room, playerId) {
  if (!client || !room || !playerId) return false;
  if (client.gameId && client.gameId !== room.id) {
    const previousRoom = clientGame(client);
    if (previousRoom) {
      const previousPlayerId = client.playerId;
      withGame(previousRoom, () => {
        markClientDisconnected(client);
        const previousPlayer = game.players[previousPlayerId];
        const stillConnected = clientsForCurrentGame().some((clientItem) => clientItem !== client && clientItem.playerId === previousPlayerId);
        if (previousPlayer && !stillConnected) {
          if (previousPlayer.token === client.token) previousPlayer.token = "";
          if (previousPlayer.ip === client.ip) previousPlayer.ip = "";
        }
        if (game.status === "lobby") {
          broadcastLobby();
        } else {
          broadcastState();
        }
      });
    }
  }

  client.gameId = room.id;
  client.playerId = playerId;
  client.spectator = false;
  client.lastMapVersionSent = -1;
  client.lastChatVersionSent = -1;
  client.pendingState = null;

  const player = room.players[playerId] || createPlayer(playerId);
  player.connected = true;
  player.token = client.token || player.token;
  player.ip = client.ip || player.ip;
  room.players[playerId] = player;
  return true;
}

function markClientDisconnected(client) {
  if (!client?.playerId || !game?.players?.[client.playerId]) return;
  const player = game.players[client.playerId];
  const connected = clientsForCurrentGame().some((clientItem) => clientItem !== client && clientItem.playerId === client.playerId);
  player.connected = connected;
  if (!connected && game.status === "running") {
    addSystemEvent(`${player.country} вышла из браузера, ожидается возвращение.`, { sound: "alert" });
  }
}

function maybeDisposeGame(room, now = Date.now()) {
  if (!room?.id) return;
  if (clientsForGame(room).length > 0) {
    room.emptySince = 0;
    return;
  }
  room.emptySince = room.emptySince || now;
  const ttl = room.status === "running"
    ? EMPTY_RUNNING_TTL_MS
    : (room.status === "lobby" && room.lobbyCreated ? EMPTY_LOBBY_TTL_MS : 0);
  if (ttl && now - room.emptySince < ttl) return;
  clearInterval(room.timer);
  if (room.stateBroadcastTimer) clearTimeout(room.stateBroadcastTimer);
  games.delete(room.id);
}

function cleanupEmptyGames(now = Date.now()) {
  for (const room of Array.from(games.values())) {
    maybeDisposeGame(room, now);
  }
}

function detachClient(client) {
  if (!clients.has(client)) return;

  const room = clientGame(client);
  clients.delete(client);

  if (room) {
    withGame(room, () => {
      markClientDisconnected(client);
      if (game.status === "lobby") {
        broadcastLobby();
      } else {
        broadcastState();
      }
    });
    maybeDisposeGame(room);
  }
}

function readFrames(client, chunk) {
  client.buffer = Buffer.concat([client.buffer, chunk]);
  if (client.buffer.length > MAX_WS_BUFFER_BYTES) {
    client.socket.end();
    return;
  }

  while (client.buffer.length >= 2) {
    const first = client.buffer[0];
    const second = client.buffer[1];
    const opcode = first & 0x0f;
    const masked = Boolean(second & 0x80);
    let length = second & 0x7f;
    let offset = 2;

    if (length === 126) {
      if (client.buffer.length < offset + 2) return;
      length = client.buffer.readUInt16BE(offset);
      offset += 2;
    } else if (length === 127) {
      if (client.buffer.length < offset + 8) return;
      const bigLength = client.buffer.readBigUInt64BE(offset);
      if (bigLength > BigInt(Number.MAX_SAFE_INTEGER)) {
        client.socket.end();
        return;
      }
      length = Number(bigLength);
      offset += 8;
    }

    if (length > MAX_WS_PAYLOAD_BYTES) {
      client.socket.end();
      return;
    }

    let mask;
    if (masked) {
      if (client.buffer.length < offset + 4) return;
      mask = client.buffer.subarray(offset, offset + 4);
      offset += 4;
    }

    if (client.buffer.length < offset + length) return;

    let payload = Buffer.from(client.buffer.subarray(offset, offset + length));
    client.buffer = client.buffer.subarray(offset + length);

    if (masked) {
      for (let index = 0; index < payload.length; index += 1) {
        payload[index] ^= mask[index % 4];
      }
    }

    client.alive = true;
    client.lastSeen = Date.now();

    if (opcode === 0x8) {
      client.socket.end();
      return;
    }

    if (opcode === 0x9) {
      sendFrame(client.socket, 0xA, payload);
      continue;
    }

    if (opcode === 0xA) {
      continue;
    }

    if (opcode === 0x1) {
      if (!allowClientMessage(client)) {
        sendError(client, "Слишком много команд, подожди секунду.");
        client.socket.end();
        return;
      }
      try {
        handleMessage(client, JSON.parse(payload.toString("utf8")));
      } catch (error) {
        sendError(client, "Некорректная команда.");
      }
    }
  }
}

function allowClientMessage(client) {
  const now = Date.now();
  if (now - client.messageWindowStarted > MESSAGE_WINDOW_MS) {
    client.messageWindowStarted = now;
    client.messageCount = 0;
  }
  client.messageCount += 1;
  return client.messageCount <= MAX_MESSAGES_PER_WINDOW;
}

function send(client, body) {
  if (!client.socket.destroyed) {
    if (body.type === "state" && (client.socket.writableNeedDrain || client.socket.writableLength > MAX_WS_BACKLOG_BYTES)) {
      client.pendingState = mergePendingState(client.pendingState, body);
      flushPendingStateOnDrain(client);
      return false;
    }
    const sent = sendFrame(client.socket, 0x1, Buffer.from(JSON.stringify(body), "utf8"));
    if (sent === null) {
      return false;
    }
    if (sent === false) {
      flushPendingStateOnDrain(client);
      return true;
    }
    return sent;
  }
  return false;
}

function mergePendingState(previous, next) {
  if (previous?.type !== "state" || next?.type !== "state") {
    return next;
  }

  const state = { ...next.state };
  if (!state.map && previous.state?.map) {
    state.map = previous.state.map;
  }
  if (!state.chat && previous.state?.chat) {
    state.chat = previous.state.chat;
    state.chatVersion = previous.state.chatVersion;
  }
  return { ...next, state };
}

function sendFrame(socket, opcode, payload) {
  let header;

  if (payload.length < 126) {
    header = Buffer.from([0x80 | opcode, payload.length]);
  } else if (payload.length < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x80 | opcode;
    header[1] = 126;
    header.writeUInt16BE(payload.length, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x80 | opcode;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(payload.length), 2);
  }

  try {
    socket.cork?.();
    const headerSent = socket.write(header);
    const payloadSent = payload.length ? socket.write(payload) : true;
    socket.uncork?.();
    return headerSent && payloadSent;
  } catch (error) {
    try {
      socket.uncork?.();
    } catch (uncorkError) {}
    socket.destroy();
    return null;
  }
}

function flushPendingStateOnDrain(client) {
  if (client.waitingForDrain) return;
  client.waitingForDrain = true;
  client.socket.once("drain", () => {
    client.waitingForDrain = false;
    if (!clients.has(client) || client.socket.destroyed || !client.pendingState) {
      client.pendingState = null;
      return;
    }
    const pendingState = client.pendingState;
    client.pendingState = null;
    if (send(client, pendingState) && pendingState.type === "state") {
      if (pendingState.state?.map) {
        client.lastMapVersionSent = pendingState.state.mapVersion;
      }
      if (pendingState.state?.chat) {
        client.lastChatVersionSent = pendingState.state.chatVersion ?? clientGame(client)?.chatVersion ?? 0;
      }
    }
  });
}

function broadcast(body) {
  for (const client of clientsForCurrentGame()) {
    send(client, body);
  }
}

function emitSfx(name, x, y, options = {}) {
  broadcast({
    type: "sfx",
    name,
    x,
    y,
    at: Date.now(),
    ...options
  });
}

function emitFlight(kind, from, to, duration, options = {}) {
  if (!from || !to) return;
  broadcast({
    type: "flight",
    id: ++game.flightId,
    kind,
    from: { x: from.x, y: from.y },
    to: { x: to.x, y: to.y },
    duration,
    at: Date.now(),
    ...options
  });
}

function emitReport(x, y, text, kind = "info") {
  return;
}

function sendError(client, message) {
  if (!client) return;
  send(client, { type: "error", message });
}

function sendInfo(client, message) {
  if (!client) return;
  send(client, { type: "info", message });
}

function handleMessage(client, message) {
  if (message.type === "ping") {
    send(client, { type: "pong", at: Date.now() });
    return;
  }

  if (message.type === "join") {
    handleJoin(client, message);
    return;
  }

  const room = clientGame(client);
  if (!room) {
    sendError(client, "Сначала создай лобби или войди по коду друга.");
    return;
  }

  withGame(room, () => handleGameMessage(client, message));
}

function handleGameMessage(client, message) {
  if (message.type === "leaveRoom") {
    handleLeaveRoom(client);
    return;
  }

  if (message.type === "chat") {
    handleChat(client, message);
    return;
  }

  if (message.type === "restart") {
    handleRestart(client);
    return;
  }

  if (message.type === "continueBots") {
    handleContinueWithBots(client);
    return;
  }

  if (message.type === "trollResponse") {
    handleTrollResponse(client, message);
    return;
  }

  if (!client.playerId || client.spectator) {
    sendError(client, "Зрители не могут отдавать приказы.");
    return;
  }

  if (game.status !== "running") {
    sendError(client, "Матч еще не идет.");
    return;
  }

  if (isDefeated(client.playerId)) {
    sendError(client, "Пораженная страна может только наблюдать.");
    return;
  }

  if (message.type === "build") {
    handleBuild(client, message);
  } else if (message.type === "demolish") {
    handleDemolish(client, message);
  } else if (message.type === "scrap") {
    handleScrap(client, message);
  } else if (message.type === "hire") {
    handleHire(client, message);
  } else if (message.type === "action") {
    handleAction(client, message);
  } else if (message.type === "diplomacy") {
    handleDiplomacy(client, message);
  } else if (message.type === "resources") {
    handleResources(client, message);
  } else if (message.type === "specialOp") {
    handleSpecialOp(client, message);
  } else if (message.type === "devResources") {
    handleDevResources(client, message);
  }
}

function handleJoin(client, message) {
  const mode = message.mode === "enter" ? "enter" : "create";
  let room = null;
  let playerId = null;

  if (mode === "create") {
    room = clientGame(client);
    if (room && room.status !== "lobby") {
      sendError(client, "Ты уже в запущенном матче.");
      return;
    }
    if (!room) {
      room = createGameRoom();
      playerId = "p1";
    } else {
      playerId = client.playerId || assignPlayerSlot(room, "p1", client.token, client.ip);
      if (room.lobbyCreated && room.lobbyHostId && room.lobbyHostId !== playerId) {
        sendError(client, "Это лобби уже создано другим игроком. Войти можно только по его коду.");
        return;
      }
    }
  } else {
    const code = cleanText(message.code, LOBBY_CODE_LENGTH).toUpperCase();
    if (!/^[0-9]{4}$/.test(code)) {
      sendError(client, "Введи 4-значный код лобби.");
      return;
    }
    room = findLobbyByCode(code);
    if (!room) {
      sendError(client, "Лобби с таким кодом не найдено.");
      return;
    }
    if (room.status !== "lobby") {
      sendError(client, "Матч в этом лобби уже стартовал.");
      return;
    }
    playerId = assignPlayerSlot(room, client.gameId === room.id ? client.playerId : null, client.token, client.ip);
    if (!playerId) {
      sendError(client, "Лобби уже заполнено.");
      return;
    }
    if (playerId === room.lobbyHostId) {
      sendError(client, "Создатель уже находится в этом лобби.");
      return;
    }
  }

  if (!room || !playerId) {
    sendError(client, "Не удалось занять слот в лобби.");
    return;
  }

  let joined = false;
  withGame(room, () => {
    if (game.status !== "lobby") {
      sendError(client, "Матч уже стартовал.");
      return;
    }

    const country = cleanText(message.country, 22) || `Страна ${HUMAN_IDS.indexOf(playerId) + 1 || 1}`;
    const colorId = cleanText(message.color, 20);
    const requestedIdeology = cleanText(message.ideology, 30);
    const ideologyId = IDEOLOGIES[requestedIdeology] && !IDEOLOGIES[requestedIdeology].botOnly ? requestedIdeology : "democracy";
    const customColor = /^#[0-9a-fA-F]{6}$/.test(colorId)
      ? { id: colorId.toLowerCase(), name: "RGB", value: colorId.toLowerCase() }
      : null;
    const color = customColor || COLOR_OPTIONS.find((option) => option.id === colorId);

    if (!color) {
      sendError(client, "Выбери цвет.");
      return;
    }

    const occupied = Object.entries(game.players).some(([id, player]) => id !== playerId && player.joined && player.color === color.id);
    if (occupied) {
      sendError(client, "Этот цвет уже занят.");
      return;
    }

    attachClientToGame(client, game, playerId);
    joined = true;
    const player = game.players[playerId] || createPlayer(playerId);
    player.country = country;
    player.color = color.id;
    player.colorValue = color.value;
    player.ideology = ideologyId;
    player.joined = true;
    player.connected = true;
    player.token = client.token || player.token;
    player.ip = client.ip || player.ip;
    game.players[playerId] = player;

    if (mode === "create") {
      game.lobbyCreated = true;
      game.lobbyHostId = playerId;
      game.lobbyCode = game.lobbyCode || uniqueLobbyCode();
      const nextSettings = sanitizeLobbySettings(message.settings);
      nextSettings.maxHumans = clamp(nextSettings.maxHumans, Math.max(MIN_HUMAN_PLAYERS, joinedHumanIds(game).length), MAX_HUMAN_PLAYERS);
      game.settings = nextSettings;
    }

    sendHello(client);
    broadcastLobby();

    if (lobbyReadyToStart(game)) {
      startGame();
    }
  });
  if (!joined) maybeDisposeGame(room);
}

function handleChat(client, message) {
  const text = cleanText(message.text, 140);
  if (!text) return;

  const player = client.playerId ? game.players[client.playerId] : null;
  addChatEntry({
    type: "user",
    playerId: client.playerId,
    name: player?.country || "Зритель",
    color: player?.colorValue || "#555",
    text
  });
}

function addChatEntry(entry, options = {}) {
  const fullEntry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type: entry.type || "system",
    playerId: entry.playerId || null,
    name: entry.name || "",
    color: entry.color || "#555",
    text: cleanText(entry.text, 180),
    at: Date.now()
  };

  if (!fullEntry.text) return;
  game.chat.push(fullEntry);
  game.chat = game.chat.slice(-40);
  game.chatVersion += 1;
  if (options.broadcastNow !== false) {
    for (const client of clientsForCurrentGame()) {
      if (send(client, { type: "chat", entry: fullEntry, chat: game.chat, chatVersion: game.chatVersion })) {
        client.lastChatVersionSent = game.chatVersion;
      }
    }
  }
  if (entry.sound) {
    emitSfx(entry.sound, 0, 0, { system: true });
  }
}

function addSystemEvent(text, options = {}) {
  addChatEntry({
    type: "system",
    name: "Событие",
    color: "#202020",
    text,
    sound: options.sound
  }, options);
}

function handleLeaveRoom(client) {
  const player = client.playerId ? game.players[client.playerId] : null;
  const slotNumber = Math.max(1, HUMAN_IDS.indexOf(client.playerId) + 1);
  const country = cleanText(player?.country || "", 40) || `Игрок ${slotNumber}`;
  closeCurrentRoom(`${country} вышел. Комната удалена.`);
}

function closeCurrentRoom(message) {
  if (!game?.id) return;
  const room = game;
  const roomClients = clientsForCurrentGame();
  clearPendingStateBroadcast();
  clearInterval(room.timer);
  room.timer = null;
  games.delete(room.id);

  for (const client of roomClients) {
    client.gameId = null;
    client.playerId = null;
    client.spectator = false;
    client.pendingState = null;
    client.waitingForDrain = false;
    client.lastMapVersionSent = -1;
    client.lastChatVersionSent = -1;
    send(client, { type: "roomClosed", message });
    sendHello(client);
    send(client, emptyLobbyPayload());
  }
}

function handleRestart(client) {
  if (!client.playerId || game.status !== "ended") {
    return;
  }
  if (game.ended?.winnerId && game.ended.winnerId !== client.playerId) {
    sendError(client, "Новое лобби может начать только победитель.");
    return;
  }

  const oldPlayers = game.players;
  const roomId = game.id;
  clearPendingStateBroadcast();
  clearInterval(game.timer);
  const fresh = createFreshGame();
  fresh.id = roomId;
  games.set(roomId, fresh);
  game = fresh;

  for (const id of HUMAN_IDS) {
    if (oldPlayers[id]) {
      game.players[id] = createPlayer(id);
      game.players[id].connected = clientsForCurrentGame().some((clientItem) => clientItem.playerId === id);
      game.players[id].token = oldPlayers[id].token || "";
      game.players[id].ip = oldPlayers[id].ip || "";
    }
  }

  for (const clientItem of clientsForCurrentGame()) {
    clientItem.pendingState = null;
    clientItem.lastMapVersionSent = -1;
    clientItem.lastChatVersionSent = -1;
  }

  broadcastLobby();
}

function handleContinueWithBots(client) {
  if (!client.playerId || game.status !== "ended" || game.ended?.winnerId !== client.playerId) {
    sendError(client, "Продолжить с ботами может только победитель.");
    return;
  }

  game.status = "running";
  game.continuedWithBots = true;
  game.continueWinnerId = client.playerId;
  game.ended = null;
  if (!game.timer) {
    const room = game;
    game.timer = setInterval(() => withGame(room, gameLoop), GAME_LOOP_INTERVAL_MS);
  }
  addSystemEvent(`${game.players[client.playerId].country} продолжает партию против ботов.`, { sound: "diplomacy" });
  recomputePlayerFlags();
  broadcastStateNow();
}

function handleTrollResponse(client, message) {
  if (!client.playerId || client.spectator) return;
  const promptId = cleanText(message.id, 80);
  const choice = cleanText(message.choice, 20);
  const prompt = game.trollPrompts?.[promptId];
  if (!prompt || prompt.targetId !== client.playerId || prompt.type !== "adLoan") {
    sendError(client, "Реклама уже неактуальна.");
    return;
  }
  delete game.trollPrompts[promptId];
  if (prompt.expiresAt && Date.now() > prompt.expiresAt) {
    sendError(client, "Реклама уже закрылась.");
    return;
  }

  const player = game.players[client.playerId];
  if (!player) return;
  if (choice === "take") {
    addResource(player, "gold", 1);
    sendInfo(client, "RAHMAT BANK одобрил кредит: +1 золото.");
  } else if (choice === "suffer") {
    player.resources.gold = Math.max(0, round1((player.resources.gold || 0) - 1));
    sendInfo(client, "Вы выбрали страдать: -1 золото.");
  } else {
    sendError(client, "Выбери действие.");
    return;
  }
  broadcastStateNow();
}

function defaultLobbySettings() {
  return {
    maxHumans: 2,
    bots: Object.fromEntries(BOT_IDS.map((id) => [id, true])),
    randomEvents: true,
    incomeMultipliers: { ...LOBBY_INCOME_DEFAULTS }
  };
}

function sanitizeHumanCount(value) {
  const number = Number(value);
  return Number.isFinite(number)
    ? clamp(Math.round(number), MIN_HUMAN_PLAYERS, MAX_HUMAN_PLAYERS)
    : 2;
}

function sanitizeLobbySettings(raw = {}) {
  raw = raw || {};
  const defaults = defaultLobbySettings();
  const settings = {
    maxHumans: sanitizeHumanCount(raw.maxHumans ?? defaults.maxHumans),
    bots: { ...defaults.bots },
    randomEvents: raw.randomEvents !== false,
    incomeMultipliers: { ...defaults.incomeMultipliers }
  };

  for (const id of BOT_IDS) {
    if (Object.prototype.hasOwnProperty.call(raw.bots || {}, id)) {
      settings.bots[id] = raw.bots[id] !== false;
    }
  }

  for (const key of Object.keys(LOBBY_INCOME_DEFAULTS)) {
    const value = Number(raw.incomeMultipliers?.[key]);
    settings.incomeMultipliers[key] = Number.isFinite(value)
      ? clamp(Math.round(value * 10) / 10, 0, 5)
      : LOBBY_INCOME_DEFAULTS[key];
  }

  return settings;
}

function activeBotIds() {
  const bots = game.settings?.bots || {};
  return BOT_IDS.filter((id) => bots[id] !== false);
}

function playerAtWar(playerId) {
  return PLAYER_IDS.some((id) => id !== playerId && game.players[id] && !isDefeated(id) && isHostile(playerId, id));
}

function handleBuild(client, message) {
  const player = game.players[client.playerId];
  const kind = cleanText(message.kind, 20);
  const definition = BUILDINGS[kind];
  const cell = getCell(message.x, message.y);

  if (!definition || !cell) {
    sendError(client, "Нельзя построить здесь.");
    return;
  }

  if (cell.building) {
    sendError(client, "На клетке уже есть постройка.");
    return;
  }
  if (cell.construction) {
    sendError(client, "На клетке уже идет строительство.");
    return;
  }

  const validation = validateBuild(client.playerId, kind, cell);
  if (!validation.ok) {
    sendError(client, validation.message);
    return;
  }

  if (!canPay(player, definition.cost)) {
    sendError(client, "Не хватает ресурсов.");
    return;
  }

  spend(player, definition.cost);
  startConstruction(cell, {
    type: "building",
    kind,
    owner: client.playerId,
    label: definition.label
  });
  touchMap();
  emitReport(cell.x, cell.y, `${definition.label} строится`, "build");
  broadcastState();
}

function startConstruction(cell, data) {
  const now = Date.now();
  cell.construction = {
    type: data.type,
    kind: data.kind,
    owner: data.owner,
    label: data.label || "",
    startedAt: now,
    completesAt: now + CONSTRUCTION_MS
  };
  emitSfx("stroyka", cell.x, cell.y, { playerId: data.owner });
}

function handleDemolish(client, message) {
  const cell = getCell(message.x, message.y);
  if (!cell?.building || cell.building.owner !== client.playerId) {
    sendError(client, "Снести можно только свою постройку.");
    return;
  }

  if (cell.building.type === "hq") {
    sendError(client, "Штаб снести нельзя.");
    return;
  }

  const label = BUILDINGS[cell.building.type]?.label || "Постройка";
  const demolishedType = cell.building.type;
  if (demolishedType === "village" || demolishedType === "city") {
    applySettlementPopulationLoss(client.playerId, demolishedType);
  }
  cell.building = null;
  if (demolishedType === "ammoDepot") clampAmmoToCapacity(client.playerId);
  touchMap();
  addSystemEvent(`${game.players[client.playerId].country} сносит постройку: ${label}.`);
  emitSfx("d_house", cell.x, cell.y, { playerId: client.playerId });
  recomputePlayerFlags();
  broadcastState();
}

function handleScrap(client, message) {
  const player = game.players[client.playerId];
  const cell = getCell(message.x, message.y);
  const unitKind = cleanText(message.unit, 20);
  const definition = UNITS[unitKind];

  if (!cell || !definition || !SCRAPPABLE_UNITS.includes(unitKind)) {
    sendError(client, "Выбери свою технику для списания.");
    return;
  }

  const ownUnits = unitsFor(cell, client.playerId);
  if ((ownUnits[unitKind] || 0) <= 0) {
    sendError(client, "На выбранной клетке нет такой твоей техники.");
    return;
  }

  if ((unitKind === "boat" || unitKind === "cruiser") && cell.terrain === "water" && ((ownUnits.inf || 0) > 0 || (ownUnits.rpg || 0) > 0)) {
    sendError(client, "Сначала высади пехоту с корабля.");
    return;
  }

  ownUnits[unitKind] -= 1;
  const cooldowns = weaponCooldownsFor(cell, client.playerId);
  if (unitKind === "tank" || unitKind === "rocket" || unitKind === "mlrs" || unitKind === "cruiser") {
    cooldowns[unitKind] = 0;
  }

  const refund = scrapRefund(definition.cost);
  for (const [resource, amount] of Object.entries(refund)) {
    addResource(player, resource, amount);
  }

  pruneWeaponCooldowns(cell);
  touchMap();
  emitSfx("d_tehnika", cell.x, cell.y, { playerId: client.playerId });
  addSystemEvent(`${player.country} списывает технику: ${definition.label}. Возврат: ${resourceBundleText(refund)}.`);
  broadcastState();
}

function validateBuild(playerId, kind, cell, options = {}) {
  const ownLand = controlsCell(playerId, cell) && isLandLike(cell);
  if (!options.ignoreConstruction && cell.construction) {
    return { ok: false, message: "На клетке уже идет строительство." };
  }

  if (kind === "hq") {
    const player = game.players[playerId];
    const existingHq = findHqCell(playerId);
    if (existingHq) {
      return { ok: false, message: "Нельзя иметь два штаба одной страны." };
    }
    if (!options.ignoreConstruction && hasPendingConstruction(playerId, "building", "hq")) {
      return { ok: false, message: "Штаб уже строится." };
    }
    if (!player?.hqDestroyed) {
      return { ok: false, message: "Новый штаб строится только после уничтожения старого." };
    }
    if (hqRebuildExpired(playerId)) {
      return { ok: false, message: "Окно восстановления штаба уже закрыто." };
    }
    if (!controlsCell(playerId, cell) || cell.terrain === "water") {
      return { ok: false, message: "Штаб можно восстановить на любой своей сухопутной территории." };
    }
    return { ok: true };
  }

  if (kind === "bridge") {
    if (cell.building) {
      return { ok: false, message: "На клетке уже есть мост или постройка." };
    }
    if (cellHasAnyVessel(cell)) {
      return { ok: false, message: "Мост нельзя ставить поверх корабля." };
    }
    if (cell.terrain === "water") {
      return hasAdjacentOwnedCell(playerId, cell.x, cell.y) ? { ok: true } : { ok: false, message: "Мост через воду ставится рядом со своей клеткой." };
    }
    return { ok: false, message: "Мост ставится на воду. На берегу это просто дорогая табличка." };
  }

  if (!ownLand) {
    return { ok: false, message: "Строить можно только на своей земле." };
  }

  if (kind === "mine") {
    return cell.terrain === "gold" || cell.terrain === "uranium" || cell.terrain === "iron"
      ? { ok: true }
      : { ok: false, message: "Шахта работает только на золоте, железе или уране." };
  }

  if (kind === "minePlus") {
    return cell.terrain === "gold"
      ? { ok: true }
      : { ok: false, message: "Шахта+ строится только на золоте." };
  }

  if (kind === "port") {
    return hasAdjacentWater(cell.x, cell.y)
      ? { ok: true }
      : { ok: false, message: "Порт строится только на побережье." };
  }

  if (cell.terrain === "gold" || cell.terrain === "uranium" || cell.terrain === "iron") {
    return { ok: false, message: "На залежах можно строить только шахту." };
  }

  return { ok: true };
}

function hasPendingConstruction(playerId, type, kind) {
  return allCells(game.map).some((cell) => (
    cell.construction?.owner === playerId &&
    cell.construction.type === type &&
    cell.construction.kind === kind
  ));
}

function handleHire(client, message) {
  const player = game.players[client.playerId];
  const kind = cleanText(message.kind, 20);
  const definition = UNITS[kind];
  const cell = getCell(message.x, message.y) || findRecruitCell(client.playerId);

  if (kind === "boat" || kind === "cruiser") {
    handleVesselHire(client, player, definition, cell, kind);
    return;
  }

  if (kind === "saboteur") {
    sendError(client, "Шахед теперь запускается с завода: нажми Шахед и выбери цель на карте.");
    return;
  }

  if (STATIC_DEPLOY_UNITS.has(kind)) {
    handleStaticDeploy(client, player, definition, cell, kind);
    return;
  }

  if (!definition || !cell || !controlsCell(client.playerId, cell) || !canRecruitOn(cell, client.playerId)) {
    sendError(client, "Найм идет на своем HQ, в казармах или на заводе.");
    return;
  }

  const ownUnits = unitsFor(cell, client.playerId);
  if (!definition.stack && ownUnits[kind] > 0) {
    sendError(client, "Эта техника не стакается на одной клетке.");
    return;
  }

  const cost = unitHireCost(client.playerId, kind, cell);
  if (!canPay(player, cost)) {
    sendError(client, "Не хватает ресурсов.");
    return;
  }

  if (kind === "saboteur" && !cooldownReady(player, "saboteur")) {
    sendError(client, `Шахед готовится: ${Math.ceil(((player.cooldowns.saboteur || 0) - Date.now()) / 1000)} с.`);
    return;
  }

  spend(player, cost);
  ownUnits[kind] += 1;
  if (kind === "inf") {
    clearFactoryStrikeIfGuarded(cell, client.playerId);
  }
  if (kind === "saboteur") {
    setCooldown(player, "saboteur");
  }
  emitSfx("hire", cell.x, cell.y, { unit: kind, playerId: client.playerId });
  touchMap();
  broadcastState();
}

function handleStaticDeploy(client, player, definition, cell, kind) {
  if (!definition || !cell || !controlsCell(client.playerId, cell) || !isPassable(cell)) {
    sendError(client, "Эту технику можно развернуть только на своей проходимой клетке.");
    return;
  }

  if (cell.construction) {
    sendError(client, "На клетке уже идет строительство.");
    return;
  }

  const ownUnits = unitsFor(cell, client.playerId);
  if (!definition.stack && ownUnits[kind] > 0) {
    sendError(client, "Эта техника не стакается на одной клетке.");
    return;
  }

  if (!canPay(player, definition.cost)) {
    sendError(client, "Не хватает ресурсов.");
    return;
  }

  spend(player, definition.cost);
  startConstruction(cell, {
    type: "unit",
    kind,
    owner: client.playerId,
    label: definition.label
  });
  touchMap();
  broadcastState();
}

function handleVesselHire(client, player, definition, cell, kind) {
  if (!definition || !cell || cell.terrain !== "water" || cell.building) {
    sendError(client, kind === "cruiser" ? "Крейсер ставится только на воду возле союзного порта." : "Лодка ставится только на реку рядом со своей клеткой.");
    return;
  }

  if (kind === "cruiser" && !hasAdjacentFriendlyPort(client.playerId, cell.x, cell.y)) {
    sendError(client, "Крейсер ставится только на воду возле своего или союзного порта.");
    return;
  }

  if (kind === "boat" && !hasAdjacentOwnedCell(client.playerId, cell.x, cell.y)) {
    sendError(client, "Лодка ставится только на реку рядом со своей клеткой.");
    return;
  }

  const ownUnits = unitsFor(cell, client.playerId);
  if (ownUnits.boat > 0 || ownUnits.cruiser > 0) {
    sendError(client, "На этой воде уже есть твой корабль.");
    return;
  }

  if (PLAYER_IDS.some((id) => id !== client.playerId && ((unitsFor(cell, id).boat || 0) > 0 || (unitsFor(cell, id).cruiser || 0) > 0))) {
    sendError(client, "На этой воде уже стоит чужой корабль.");
    return;
  }

  if (!canPay(player, definition.cost)) {
    sendError(client, "Не хватает ресурсов.");
    return;
  }

  spend(player, definition.cost);
  ownUnits[kind] = 1;
  emitSfx("hire", cell.x, cell.y, { unit: kind, playerId: client.playerId });
  touchMap();
  broadcastState();
}

function unitHireCost(playerId, kind, cell) {
  if (kind === "inf" && cell?.building?.type === "barracks" && mobilizationActive(playerId)) {
    return { pop: 1, gold: 1 };
  }
  return UNITS[kind]?.cost || {};
}

function handleAction(client, message) {
  const action = cleanText(message.action, 20);

  if (action === "move") {
    handleMove(client, message);
  } else if (action === "rpg") {
    handleRpgShot(client, message);
  } else if (action === "tank") {
    handleTankShot(client, message);
  } else if (action === "rocket") {
    handleRocketStrike(client, message);
  } else if (action === "mlrs") {
    handleMlrs(client, message);
  } else if (action === "cruiser") {
    handleCruiserSalvo(client, message);
  } else if (action === "detonateDrone") {
    handleDroneDetonation(client, message);
  } else if (action === "detonateSaboteur") {
    handleSaboteurDetonation(client, message);
  } else if (action === "mobilize") {
    handleMobilization(client);
  } else if (action === "nuke") {
    handleNuke(client, message);
  } else if (action === "shahed") {
    handleShahedStrike(client, message);
  }
}

function handleDiplomacy(client, message) {
  const playerId = client.playerId;
  const player = game.players[playerId];
  const action = cleanText(message.action, 30);
  const targetId = cleanText(message.targetId, 30);

  if (isDefeated(playerId)) {
    sendError(client, "Побежденная страна не может вести дипломатию.");
    return;
  }

  if (player?.vassalOf) {
    sendError(client, "Вассал не ведет самостоятельную дипломатию. Войны и союзы задает сюзерен.");
    return;
  }

  if (action === "acceptAlliance" || action === "rejectAlliance") {
    const offerId = cleanText(message.offerId, 80);
    const offer = game.diplomacyOffers.find((item) => item.id === offerId && item.to === playerId);
    if (!offer) {
      sendError(client, "Предложение уже неактуально.");
      return;
    }
    game.diplomacyOffers = game.diplomacyOffers.filter((item) => item.id !== offer.id);
    if (action === "acceptAlliance") {
      setRelation(playerId, offer.from, "alliance");
      addSystemEvent(`${game.players[playerId].country} принимает союз с ${game.players[offer.from].country}.`, { sound: "soyuz" });
      botSayPhrase(playerId, "alliance");
      botSayPhrase(offer.from, "alliance");
    } else {
      addSystemEvent(`${game.players[playerId].country} отказывается от союза с ${game.players[offer.from].country}.`, { sound: "diplomacy" });
    }
    broadcastState();
    return;
  }

  if (action === "acceptUltimatum" || action === "rejectUltimatum") {
    const ultimatumId = cleanText(message.ultimatumId, 80);
    const ultimatum = game.ultimatums.find((item) => item.id === ultimatumId && item.to === playerId);
    if (!ultimatum) {
      sendError(client, "Ультиматум уже неактуален.");
      return;
    }
    game.ultimatums = game.ultimatums.filter((item) => item.id !== ultimatum.id);
    if (action === "acceptUltimatum") {
      forceVassalage(playerId, ultimatum.from, `${game.players[playerId].country} принимает ультиматум и становится вассалом ${game.players[ultimatum.from].country}.`);
    } else {
      addSystemEvent(`${game.players[playerId].country} отклоняет ультиматум ${game.players[ultimatum.from].country}.`, { sound: "alert" });
      declareWar(ultimatum.from, playerId);
    }
    broadcastState();
    return;
  }

  if (!PLAYER_IDS.includes(targetId) || targetId === playerId || isDefeated(targetId)) {
    sendError(client, "Выбери действующую страну.");
    return;
  }
  if (game.players[targetId]?.vassalOf && action !== "declareWar" && action !== "releaseVassal") {
    sendError(client, "По дипломатии вассала отвечает его сюзерен.");
    return;
  }

  if (action === "offerAlliance") {
    offerAlliance(playerId, targetId);
    broadcastState();
    return;
  }

  if (action === "declareWar") {
    declareWar(playerId, targetId);
    broadcastState();
    return;
  }

  if (action === "releaseVassal") {
    releaseVassal(playerId, targetId);
    broadcastState();
    return;
  }

  if (action === "ultimatum") {
    if (relationStatus(playerId, targetId) === "alliance") {
      sendError(client, "Союзнику ультиматум не нужен.");
      return;
    }
    issueUltimatum(playerId, targetId);
    broadcastState();
  }
}

function emitReportForPlayer(playerId, text, kind = "info") {
  const hq = findHqCell(playerId);
  if (hq) {
    emitReport(hq.x, hq.y, text, kind);
    return;
  }
  let fallback = null;
  forEachCell((cell) => {
    if (!fallback && cell.owner === playerId) fallback = cell;
  });
  if (fallback) emitReport(fallback.x, fallback.y, text, kind);
}

function handleResources(client, message) {
  const action = cleanText(message.action, 30);
  const player = game.players[client.playerId];

  if (isDefeated(client.playerId)) {
    sendError(client, "Побежденная страна не может работать с ресурсами.");
    return;
  }

  if (player?.vassalOf) {
    sendError(client, "Вассал не может сам передавать или запрашивать ресурсы у стран.");
    return;
  }

  if (action === "transfer") {
    handleResourceTransfer(client.playerId, cleanText(message.targetId, 30), sanitizeResourceBundle(message.resources));
    return;
  }

  if (action === "request") {
    handleResourceRequest(client.playerId, cleanText(message.targetId, 30), sanitizeResourceBundle(message.resources));
    return;
  }

  if (action === "acceptRequest" || action === "rejectRequest") {
    handleResourceRequestResponse(client.playerId, cleanText(message.requestId, 80), action === "acceptRequest");
  }
}

function handleSpecialOp(client, message) {
  const playerId = client.playerId;
  const player = game.players[playerId];
  const targetId = cleanText(message.targetId, 30);
  const operation = cleanText(message.operation, 40);
  const target = game.players[targetId];
  const definition = SPECIAL_OPS[operation];
  const now = Date.now();

  if (!player || isDefeated(playerId)) {
    sendError(client, "Побежденная страна не может проводить спецоперации.");
    return;
  }
  if (player.vassalOf) {
    sendError(client, "Вассал не проводит самостоятельные спецоперации.");
    return;
  }
  if (!definition) {
    sendError(client, "Выбери спецоперацию.");
    return;
  }
  if (definition.anarchistsOnly && playerId !== "anarchists") {
    sendError(client, "Грабеж доступен только Анархистам.");
    return;
  }
  if (!target || targetId === playerId || !PLAYER_IDS.includes(targetId) || isDefeated(targetId)) {
    sendError(client, "Выбери действующую страну-цель.");
    return;
  }
  if (operation === "anarchistLoot" && relationStatus(playerId, targetId) === "alliance") {
    sendError(client, "Анархисты не грабят союзников.");
    return;
  }
  if (now < (player.specialOpCooldown || 0)) {
    sendError(client, `Спецоперации на перезарядке: ${Math.ceil((player.specialOpCooldown - now) / 1000)} с.`);
    return;
  }

  const ideology = IDEOLOGIES[player.ideology] || {};
  const defensePenalty = counterIntelPenalty(targetId);
  const chance = clamp(definition.chance + (ideology.specialOp || 0) - defensePenalty, 0.08, 0.9);
  player.specialOpCooldown = now + SPECIAL_OP_COOLDOWN_MS;
  sendInfo(client, `Спецоперация "${definition.label}" против ${target.country} начата. Результат через 30 секунд.`);
  const matchStartedAt = game.startedAt;
  const room = game;
  const timer = setTimeout(() => {
    if (games.get(room.id) !== room) return;
    withGame(room, () => {
      if (game.startedAt === matchStartedAt) resolveSpecialOp(playerId, targetId, operation, chance);
    });
  }, SPECIAL_OP_DELAY_MS);
  if (typeof timer.unref === "function") timer.unref();
  broadcastState();
}

function resolveSpecialOp(playerId, targetId, operation, chance) {
  const actor = game.players[playerId];
  const target = game.players[targetId];
  const definition = SPECIAL_OPS[operation];
  if (game.status !== "running" || !actor || !target || actor.defeated || target.defeated || !definition) return;

  if (Math.random() > chance) {
    sendInfo(playerClient(playerId), `Спецоперация "${definition.label}" провалилась.`);
    broadcastState();
    return;
  }

  const result = applySpecialOpResult(playerId, targetId, operation);
  sendInfo(playerClient(playerId), `Спецоперация "${definition.label}" успешна. ${result}`);
  recomputePlayerFlags();
  checkVictory();
  broadcastState();
}

function counterIntelPenalty(playerId) {
  const count = countBuildings(playerId).counterIntel || 0;
  return Math.min(COUNTER_INTEL_PENALTY_CAP, count * COUNTER_INTEL_PENALTY);
}

function applySpecialOpResult(playerId, targetId, operation) {
  const actor = game.players[playerId];
  const target = game.players[targetId];
  if (!actor || !target) return "";

  if (operation === "sabotageFactory") {
    const factory = shuffle(allCells(game.map)).find((cell) =>
      cell.building?.type === "factory" &&
      cell.building.owner === targetId &&
      (unitsFor(cell, targetId).inf || 0) <= 0);
    if (!factory) return "Цель не найдена: заводы прикрыты пехотой.";
    factory.building.strikeUntil = Date.now() + 60_000;
    touchMap();
    return "Завод цели остановлен на минуту.";
  }

  if (operation === "sabotageAirDefense") {
    const affected = [];
    const sabotageUntil = Date.now() + AIR_DEFENSE_SABOTAGE_MS;
    forEachCell((cell) => {
      const units = unitsFor(cell, targetId);
      if ((units.aa || 0) <= 0 && (units.aaPlus || 0) <= 0) return;
      cell.airDefenseSabotage = cell.airDefenseSabotage || {};
      cell.airDefenseSabotage[targetId] = Math.max(cell.airDefenseSabotage[targetId] || 0, sabotageUntil);
      affected.push(cell);
    });
    if (!affected.length) return "У цели не найдено ПВО или ПВО+.";
    return `ПВО/ПВО+ цели отключены на ${Math.round(AIR_DEFENSE_SABOTAGE_MS / 1000)} секунд: ${affected.length} позиций.`;
  }

  if (operation === "destroyBunker") {
    const bunker = shuffle(allCells(game.map)).find((cell) =>
      cell.building?.type === "bunker" && cell.building.owner === targetId);
    if (!bunker) return "У цели не найден бункер.";
    destroyBuilding(bunker, playerId);
    touchMap();
    return "Бункер цели уничтожен.";
  }

  if (operation === "stealSupplies") {
    const stolen = {};
    const limits = { gold: 10, iron: 6, ammo: 14, uranium: 2 };
    for (const [resource, limit] of Object.entries(limits)) {
      const amount = Math.min(Math.floor(target.resources[resource] || 0), limit);
      if (amount > 0) {
        target.resources[resource] -= amount;
        addResource(actor, resource, amount);
        stolen[resource] = amount;
      }
    }
    return resourceBundleEmpty(stolen) ? "У цели почти нечего было взять." : `Добыто: ${resourceBundleText(stolen)}.`;
  }

  if (operation === "anarchistLoot") {
    const stolen = {};
    const limits = { gold: 14, iron: 8, ammo: 12, uranium: 2 };
    for (const [resource, limit] of Object.entries(limits)) {
      const available = Math.floor(target.resources[resource] || 0);
      const amount = available > 0 ? Math.min(Math.max(1, Math.floor(available * 0.25)), limit) : 0;
      if (amount > 0) {
        target.resources[resource] -= amount;
        addResource(actor, resource, amount);
        stolen[resource] = amount;
      }
    }
    return resourceBundleEmpty(stolen) ? "Грабить было почти нечего, но шуму навели." : `Награблено: ${resourceBundleText(stolen)}.`;
  }

  if (operation === "partisanRaid") {
    const targetCell = shuffle(allCells(game.map)).find((cell) => {
      const units = unitsFor(cell, targetId);
      return cell.owner === targetId && ((units.inf || 0) > 0 || (units.rpg || 0) > 0 || (units.tank || 0) > 0 || (units.mlrs || 0) > 0);
    });
    if (!targetCell) return "Рейд никого не застал.";
    const lossSnapshot = armyGoldSnapshot();
    const units = unitsFor(targetCell, targetId);
    if (units.inf > 0) units.inf = Math.max(0, units.inf - 2);
    else if (units.rpg > 0) units.rpg = Math.max(0, units.rpg - 1);
    else if (units.mlrs > 0) units.mlrs -= 1;
    else if (units.tank > 0) units.tank -= 1;
    applyArmyLossEffects(lossSnapshot, playerId);
    touchMap();
    return "Партизаны вывели из строя часть сил.";
  }

  if (operation === "jamWeapons") {
    const jamUntil = Date.now() + 30_000;
    forEachCell((cell) => {
      const cooldowns = weaponCooldownsFor(cell, targetId);
      for (const weapon of ["rpg", "tank", "rocket", "mlrs", "cruiser"]) {
        cooldowns[weapon] = Math.max(cooldowns[weapon] || 0, jamUntil);
      }
    });
    jamNuclearPlants(targetId, jamUntil);
    return "Оружие цели заглушено на 30 секунд.";
  }

  if (operation === "scout") {
    const stats = computeStats(targetId);
    actor.scoutReports = actor.scoutReports || {};
    actor.scoutReports[targetId] = {
      at: Date.now(),
      country: target.country,
      ideology: target.ideology,
      resources: formatResources(target.resources),
      stats: { ...stats },
      hqLost: Boolean(target.hqLost),
      vassalOf: target.vassalOf || null
    };
    return "Разведданные обновлены во вкладке статистики.";
  }

  if (operation === "smuggleAmmo") {
    addResource(actor, "ammo", 18);
    addResource(actor, "gold", 4);
    return "Получено 18 боеприпасов и 4 золота.";
  }

  return "Операция завершена.";
}

function handleDevResources(client, message) {
  if (cleanText(message.code, 12) !== DEV_CODE) {
    sendError(client, "Неверный код разработчика.");
    return;
  }

  const action = cleanText(message.action || "setResources", 30);
  const targetId = cleanText(message.targetId, 30);
  const target = game.players[targetId];

  if (action === "clearCooldowns") {
    game.devNoCooldowns = true;
    clearAllCooldowns();
    sendInfo(client, "Перезарядки отключены.");
    broadcastStateNow();
    return;
  }

  if (action === "restoreCooldowns") {
    game.devNoCooldowns = false;
    sendInfo(client, "Перезарядки снова включены.");
    broadcastStateNow();
    return;
  }

  if (action === "peaceAll") {
    game.relations = {};
    game.diplomacyOffers = [];
    game.ultimatums = [];
    game.resourceRequests = [];
    game.supportDeals = {};
    sendInfo(client, "Все отношения сброшены в нейтралитет.");
    broadcastStateNow();
    return;
  }

  if (action === "triggerEvent") {
    const eventType = cleanText(message.eventType, 30);
    if (!forceRandomEvent(eventType)) {
      sendError(client, "Выбери событие.");
      return;
    }
    sendInfo(client, `${RANDOM_EVENTS[eventType].label}: событие запущено.`);
    broadcastStateNow();
    return;
  }

  if (action === "clearEvent") {
    game.activeEvent = null;
    game.pendingEvent = null;
    game.nextRandomEventAt = Date.now() + RANDOM_EVENT_INTERVAL_MS;
    sendInfo(client, "Случайное событие отключено.");
    broadcastStateNow();
    return;
  }

  if (action === "toggleAlwaysMisfire") {
    if (!target || !PLAYER_IDS.includes(targetId)) {
      sendError(client, "Выбери страну на карте.");
      return;
    }
    target.devAlwaysMisfire = !target.devAlwaysMisfire;
    sendInfo(client, `${target.country}: всегда осечки ${target.devAlwaysMisfire ? "включены" : "выключены"}.`);
    broadcastStateNow();
    return;
  }

  if (action === "clearAlwaysMisfire") {
    if (!target || !PLAYER_IDS.includes(targetId)) {
      sendError(client, "Выбери страну на карте.");
      return;
    }
    target.devAlwaysMisfire = false;
    sendInfo(client, `${target.country}: осечки сняты.`);
    broadcastStateNow();
    return;
  }

  if (action === "maxAllResources") {
    for (const id of PLAYER_IDS) {
      if (game.players[id]) setResourcesExact(game.players[id], Object.fromEntries(RESOURCE_KEYS.map((key) => [key, 999])));
    }
    sendInfo(client, "Всем странам выставлено по 999 ресурсов.");
    broadcastStateNow();
    return;
  }

  if (!target || !PLAYER_IDS.includes(targetId)) {
    sendError(client, "Выбери страну на карте.");
    return;
  }

  if (action === "forceFactoryStrikes") {
    const count = forceFactoryStrikes(targetId);
    sendInfo(client, `${target.country}: забастовка на ${count} заводах.`);
    broadcastStateNow();
    return;
  }

  if (action === "troll") {
    sendDevTroll(client, targetId, message);
    return;
  }

  if (action === "maxResources") {
    setResourcesExact(target, Object.fromEntries(RESOURCE_KEYS.map((key) => [key, 999])));
    sendInfo(client, `${target.country}: ресурсы выставлены на 999.`);
    broadcastStateNow();
    return;
  }

  const resources = sanitizeResourceState(message.resources);
  setResourcesExact(target, resources);
  sendInfo(client, `${target.country}: ресурсы обновлены.`);
  broadcastStateNow();
}

function sendDevTroll(client, targetId, message) {
  const target = game.players[targetId];
  const targetClient = playerClient(targetId);
  if (!target || !PLAYER_IDS.includes(targetId)) {
    sendError(client, "Выбери страну на карте.");
    return;
  }
  if (!targetClient) {
    sendError(client, "У этой страны сейчас нет подключенного игрока.");
    return;
  }

  const trollType = cleanText(message.trollType, 30);
  const promptId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const seconds = clamp(Math.round(Number(message.seconds) || 8), 1, TROLL_CENSOR_MAX_SECONDS);
  let troll = null;

  if (trollType === "adLoan") {
    game.trollPrompts[promptId] = {
      id: promptId,
      type: "adLoan",
      targetId,
      expiresAt: Date.now() + 60_000
    };
    troll = {
      id: promptId,
      type: "adLoan",
      title: "RAHMAT BANK",
      text: "Вашей стране срочно нужен кредит от RAHMAT BANK.",
      buttons: ["Взять 999%", "Страдать"]
    };
  } else if (trollType === "fakeEvent") {
    troll = {
      id: promptId,
      type: "fakeEvent",
      text: "ООН признала вашу страну слишком слабой."
    };
  } else if (trollType === "censorMap") {
    troll = {
      id: promptId,
      type: "censorMap",
      seconds
    };
  } else if (trollType === "fakeFine") {
    troll = {
      id: promptId,
      type: "fakeFine",
      text: "Штраф -999 золота"
    };
  } else if (trollType === "fakeWin") {
    troll = {
      id: promptId,
      type: "fakeWin",
      text: "Победить"
    };
  }

  if (!troll) {
    sendError(client, "Выбери троллинг.");
    return;
  }

  send(targetClient, { type: "troll", troll });
  sendInfo(client, `${target.country || targetId}: троллинг отправлен.`);
}

function forceFactoryStrikes(playerId) {
  const until = Date.now() + FACTORY_STRIKE_MS;
  let count = 0;
  forEachCell((cell) => {
    if (cell.building?.type !== "factory" || cell.building.owner !== playerId) return;
    if ((unitsFor(cell, playerId).inf || 0) > 0) return;
    cell.building.strikeUntil = Math.max(cell.building.strikeUntil || 0, until);
    count += 1;
  });
  if (count > 0) touchMap();
  return count;
}

function handleResourceTransfer(fromId, toId, resources) {
  const from = game.players[fromId];
  const to = game.players[toId];
  if (!from || !to || fromId === toId || !PLAYER_IDS.includes(toId) || isDefeated(fromId) || isDefeated(toId)) {
    sendError(playerClient(fromId), "Выбери действующую страну.");
    return;
  }

  if (resourceBundleEmpty(resources)) {
    sendError(playerClient(fromId), "Укажи хотя бы один ресурс.");
    return;
  }

  if (!canPay(from, resources)) {
    sendError(playerClient(fromId), "Не хватает ресурсов для передачи.");
    return;
  }

  transferResourceBundle(from, to, resources);
  addSystemEvent(`${from.country} передает ${to.country}: ${resourceBundleText(resources)}.`, { sound: resourceTransferSound(resources) });

  if (to.vassalOf === fromId) {
    const available = capResourceBundleToPlayer(to, resources);
    if (resourceBundleEmpty(available)) {
      sendError(playerClient(fromId), "У вассала нет запрошенных ресурсов.");
      return;
    }
    transferResourceBundle(to, from, available);
    addSystemEvent(`${to.country} автоматически отправляет сюзерену ${from.country}: ${resourceBundleText(available)}.`, { sound: resourceTransferSound(available) });
    broadcastState();
    return;
  }

  if (to.isBot) {
    activateBotSupport(toId, fromId, resources);
  }

  broadcastState();
}

function handleResourceRequest(fromId, toId, resources) {
  const from = game.players[fromId];
  const to = game.players[toId];
  if (!from || !to || fromId === toId || !PLAYER_IDS.includes(toId) || isDefeated(fromId) || isDefeated(toId)) {
    sendError(playerClient(fromId), "Выбери действующую страну.");
    return;
  }

  if (resourceBundleEmpty(resources)) {
    sendError(playerClient(fromId), "Запрашивать ноль ресурсов бессмысленно.");
    return;
  }

  if (to.isBot) {
    resolveBotResourceRequest(fromId, toId, resources);
    broadcastState();
    return;
  }

  game.resourceRequests = game.resourceRequests.filter((request) => !(request.from === fromId && request.to === toId));
  game.resourceRequests.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    from: fromId,
    to: toId,
    resources,
    at: Date.now()
  });
  addSystemEvent(`${from.country} запрашивает у ${to.country}: ${resourceBundleText(resources)}.`, { sound: "diplomacy" });
  broadcastState();
}

function capResourceBundleToPlayer(player, resources) {
  const capped = {};
  for (const key of RESOURCE_KEYS) {
    const requested = Math.max(0, Math.floor(Number(resources[key] || 0)));
    if (requested <= 0) continue;
    const available = Math.max(0, Math.floor(Number(player.resources[key] || 0)));
    const amount = Math.min(requested, available);
    if (amount > 0) capped[key] = amount;
  }
  return capped;
}

function handleResourceRequestResponse(playerId, requestId, accepted) {
  const request = game.resourceRequests.find((item) => item.id === requestId && item.to === playerId);
  const responder = game.players[playerId];
  if (!request || !responder || isDefeated(playerId)) {
    sendError(playerClient(playerId), "Запрос уже неактуален.");
    return;
  }

  const requester = game.players[request.from];
  game.resourceRequests = game.resourceRequests.filter((item) => item.id !== request.id);

  if (!accepted) {
    addSystemEvent(`${responder.country} отказывает ${requester?.country || "стране"} в ресурсах.`, { sound: "diplomacy" });
    broadcastState();
    return;
  }

  if (!requester || isDefeated(request.from) || !canPay(responder, request.resources)) {
    sendError(playerClient(playerId), "Не хватает ресурсов, чтобы выполнить запрос.");
    broadcastState();
    return;
  }

  transferResourceBundle(responder, requester, request.resources);
  addSystemEvent(`${responder.country} отправляет ${requester.country}: ${resourceBundleText(request.resources)}.`, { sound: resourceTransferSound(request.resources) });
  broadcastState();
}

function resolveBotResourceRequest(fromId, botId, resources) {
  const requester = game.players[fromId];
  const bot = game.players[botId];
  if (!requester || !bot || isDefeated(fromId) || isDefeated(botId)) {
    sendError(playerClient(fromId), "Эта страна больше не может отвечать на запросы.");
    return;
  }

  // §6.3 Лимиты на сумму одного запроса
  const LIMITS = { gold: 15, iron: 10, ammo: 20, pop: 3, uranium: 5 };
  const capped = {};
  for (const [resource, amount] of Object.entries(resources)) {
    capped[resource] = Math.min(amount, LIMITS[resource] || amount);
  }

  // §6.3 Защита от спама: один игрок не чаще раза в 90 сек
  const now = Date.now();
  game.resourceRequestCooldowns = game.resourceRequestCooldowns || {};
  const cooldownKey = `${fromId}->${botId}`;
  const lastRequest = game.resourceRequestCooldowns[cooldownKey];
  if (lastRequest) {
    const elapsed = now - lastRequest.at;
    if (elapsed < 90_000) {
      // Повторный запрос в течение 60 сек после отказа — автоотказ
      if (!lastRequest.accepted && elapsed < 60_000) {
        addSystemEvent(`${bot.country} отказывает ${requester.country} в ресурсах.`, { sound: "diplomacy" });
        return;
      }
      if (elapsed < 90_000) {
        addSystemEvent(`${bot.country} отказывает ${requester.country} в ресурсах.`, { sound: "diplomacy" });
        return;
      }
    }
  }

  const chance = botResourceRequestChance(botId, fromId, capped);
  const accepted = canPay(bot, capped) && Math.random() < chance;
  game.resourceRequestCooldowns[cooldownKey] = { at: now, accepted };

  if (accepted) {
    transferResourceBundle(bot, requester, capped);
    addSystemEvent(`${bot.country} соглашается помочь ${requester.country}: ${resourceBundleText(capped)}.`, { sound: resourceTransferSound(capped) });
  } else {
    addSystemEvent(`${bot.country} отказывает ${requester.country} в ресурсах.`, { sound: "diplomacy" });
  }
}

function botResourceRequestChance(botId, requesterId, resources) {
  const bot = game.players[botId];
  const relation = relationStatus(botId, requesterId);

  // §6.3 Война — всегда отказ
  if (relation === "war") return 0;

  // Резервы бота: не отдаём если упадём ниже минимума
  const RESERVE = { gold: 15, iron: 8, ammo: 20, pop: 5, uranium: 3 };
  for (const [resource, amount] of Object.entries(resources)) {
    if ((bot.resources[resource] || 0) < (RESERVE[resource] || 5) + amount) return 0;
  }

  let chance = relation === "alliance" ? 0.85 : 0.35;

  // Нейтрал: только если у нас излишек > 2× запрошенного
  if (relation === "neutral") {
    for (const [resource, amount] of Object.entries(resources)) {
      const surplus = (bot.resources[resource] || 0) - (RESERVE[resource] || 5);
      if (surplus < amount * 2) return 0;
    }
  }

  if (bot.personality === "passive" || bot.personality === "fisher") chance += 0.05;
  if (bot.personality === "aggressive") chance -= 0.15;
  if (hasSupportDeal(botId, requesterId)) chance += 0.1;

  return clamp(chance, 0, 1);
}

function transferResourceBundle(from, to, resources) {
  spend(from, resources);
  for (const [resource, amount] of Object.entries(resources)) {
    addResource(to, resource, amount);
  }
}

function resourceTransferSound(resources = {}) {
  return (resources.gold || 0) > 0 ? "money" : "diplomacy";
}

function setResourcesExact(player, resources) {
  for (const key of RESOURCE_KEYS) {
    player.resources[key] = clamp(Math.floor(Number(resources[key] || 0)), 0, key === "ammo" ? Math.max(9999, ammoCapacity(player.id)) : 9999);
  }
}

function clearAllCooldowns() {
  for (const player of Object.values(game.players)) {
    if (player) player.cooldowns = { nuke: 0, saboteur: 0 };
  }
  forEachCell((cell) => {
    cell.cooldowns = emptyCooldownsByPlayer();
    if (cell.building?.type === "nuclearPlant") {
      cell.building.nukeCooldown = 0;
    }
  });
}

function activateBotSupport(botId, beneficiaryId, resources) {
  if (!game.players[botId]?.isBot || !game.players[beneficiaryId] || isDefeated(botId) || isDefeated(beneficiaryId)) return;
  if (relationStatus(botId, beneficiaryId) === "war") {
    setRelation(botId, beneficiaryId, "neutral");
  }
  setRelation(botId, beneficiaryId, "alliance");
  const key = supportKey(botId, beneficiaryId);
  const existing = game.supportDeals[key];
  const intensity = clamp(Math.ceil(resourceBundleValue(resources) / 16), 1, 5);
  game.supportDeals[key] = {
    from: botId,
    to: beneficiaryId,
    intensity: Math.max(existing?.intensity || 0, intensity),
    nextAt: existing?.nextAt || Date.now() + randomInt(20_000, 38_000)
  };
  addSystemEvent(`${game.players[botId].country} будет регулярно помогать ${game.players[beneficiaryId].country} ресурсами.`, { sound: "diplomacy" });
}

function runSupportDeals(now) {
  let changed = false;
  for (const [key, deal] of Object.entries(game.supportDeals || {})) {
    const from = game.players[deal.from];
    const to = game.players[deal.to];
    if (!from || !to || isDefeated(deal.from) || isDefeated(deal.to) || relationStatus(deal.from, deal.to) !== "alliance") {
      delete game.supportDeals[key];
      continue;
    }
    if (now < (deal.nextAt || 0)) continue;
    if (!botShouldSendSupport(deal.from, deal.to)) {
      deal.nextAt = now + SUPPORT_INTERVAL_MS;
      continue;
    }

    const resources = supportBundleFor(from, deal.intensity || 1);
    deal.nextAt = now + SUPPORT_INTERVAL_MS + randomInt(0, 25_000);
    if (resourceBundleEmpty(resources)) continue;

    transferResourceBundle(from, to, resources);
    addSystemEvent(`${from.country} отправляет помощь ${to.country}: ${resourceBundleText(resources)}.`, { sound: resourceTransferSound(resources) });
    changed = true;
  }
  return changed;
}

function botShouldSendSupport(fromId, toId) {
  const from = game.players[fromId];
  const to = game.players[toId];
  if (!from || !to || isDefeated(fromId) || isDefeated(toId) || relationStatus(fromId, toId) !== "alliance") return false;
  if (to.hqLost || botIsUnderAttack(toId)) return true;
  if ((to.resources.ammo || 0) < 6 && (from.resources.ammo || 0) > 24) return true;
  if ((to.resources.gold || 0) < 6 && (from.resources.gold || 0) > 24) return true;
  return hasCommonEnemy(fromId, toId) && computeStats(toId).power < computeStats(fromId).power * 0.75;
}

function supportBundleFor(player, intensity) {
  const bundle = {};
  const caps = {
    gold: intensity >= 4 ? 2 : 1,
    iron: 1,
    pop: intensity >= 5 ? 1 : 0,
    ammo: intensity >= 3 ? 3 : 2,
    uranium: 0
  };
  const reserve = {
    gold: 8,
    iron: 5,
    pop: 2,
    ammo: 10,
    uranium: 2
  };

  for (const resource of RESOURCE_KEYS) {
    const amount = caps[resource] || 0;
    if (amount > 0 && (player.resources[resource] || 0) >= reserve[resource] + amount) {
      bundle[resource] = amount;
    }
  }
  return bundle;
}

function sanitizeResourceBundle(raw) {
  const bundle = {};
  for (const key of RESOURCE_KEYS) {
    const value = Math.max(0, Math.floor(Number(raw?.[key] || 0)));
    if (value > 0) bundle[key] = Math.min(value, 999);
  }
  return bundle;
}

function sanitizeResourceState(raw) {
  const bundle = {};
  for (const key of RESOURCE_KEYS) {
    bundle[key] = clamp(Math.floor(Number(raw?.[key] || 0)), 0, 9999);
  }
  return bundle;
}

function resourceBundleEmpty(resources) {
  return !resources || Object.values(resources).every((amount) => !amount);
}

function resourceBundleText(resources) {
  return Object.entries(resources)
    .filter(([, amount]) => amount > 0)
    .map(([resource, amount]) => `${amount} ${RESOURCE_LABELS[resource] || resource}`)
    .join(", ");
}

function resourceBundleValue(resources) {
  const weights = { gold: 1, iron: 1.35, pop: 4, ammo: 0.35, uranium: 5 };
  return Object.entries(resources || {}).reduce((sum, [resource, amount]) => sum + amount * (weights[resource] || 1), 0);
}

function supportKey(fromId, toId) {
  return `${fromId}->${toId}`;
}

function hasSupportDeal(fromId, toId) {
  return Boolean(game.supportDeals?.[supportKey(fromId, toId)]);
}

function playerClient(playerId) {
  return clientsForCurrentGame().find((client) => client.playerId === playerId && !client.spectator) || null;
}

function offerAlliance(fromId, toId) {
  if (isDefeated(fromId) || isDefeated(toId)) return;
  if (game.players[fromId]?.vassalOf) return;
  if (game.players[toId]?.vassalOf) return;
  if (relationStatus(fromId, toId) === "alliance") {
    return;
  }

  if (game.players[toId]?.isBot) {
    const chance = botAllianceChance(toId, fromId);
    if (Math.random() < chance) {
      setRelation(fromId, toId, "alliance");
      addSystemEvent(`${game.players[toId].country} принимает союз с ${game.players[fromId].country}.`, { sound: "soyuz" });
      botSayPhrase(toId, "alliance");
    } else {
      addSystemEvent(`${game.players[toId].country} отклоняет союз с ${game.players[fromId].country}.`, { sound: "diplomacy" });
    }
    return;
  }

  const duplicate = game.diplomacyOffers.some((offer) => offer.from === fromId && offer.to === toId);
  if (!duplicate) {
    game.diplomacyOffers.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      from: fromId,
      to: toId,
      at: Date.now()
    });
  }
  addSystemEvent(`${game.players[fromId].country} предлагает союз стране ${game.players[toId].country}.`, { sound: "diplomacy" });
}

function issueUltimatum(fromId, toId) {
  if (isDefeated(fromId) || isDefeated(toId) || fromId === toId) return false;
  if (game.players[fromId]?.vassalOf) return false;
  if (game.players[toId]?.vassalOf) return false;
  if (game.players[toId]?.isBot) {
    if (botAcceptsUltimatum(fromId, toId)) {
      forceVassalage(toId, fromId, `${game.players[toId].country} принимает ультиматум и становится вассалом ${game.players[fromId].country}.`);
    } else {
      addSystemEvent(`${game.players[toId].country} отклоняет ультиматум ${game.players[fromId].country}.`, { sound: "alert" });
      declareWar(fromId, toId);
    }
    return true;
  }

  const duplicate = game.ultimatums.some((item) => item.from === fromId && item.to === toId);
  if (!duplicate) {
    game.ultimatums.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      from: fromId,
      to: toId,
      at: Date.now()
    });
  }
  addSystemEvent(`${game.players[fromId].country} выдвигает ультиматум стране ${game.players[toId].country}.`, { sound: "diplomacy" });
  return true;
}

function botAcceptsUltimatum(fromId, toId) {
  const fromStats = computeStats(fromId);
  const targetStats = computeStats(toId);
  const target = game.players[toId];
  if (target?.hqLost || target?.hqDestroyed) return true;
  if (targetStats.cells <= 5 || targetStats.power <= 2) return true;
  if (fromStats.power >= targetStats.power * 2 + 4 && fromStats.cells >= targetStats.cells * 1.25) return true;
  return false;
}

function forceVassalage(vassalId, overlordId, text = "") {
  const vassal = game.players[vassalId];
  const overlord = game.players[overlordId];
  if (!vassal || !overlord || vassal.defeated || overlord.defeated || vassalId === overlordId) return false;
  vassal.vassalOf = overlordId;
  vassal.capitulatedAt = Date.now();
  vassal.hqDestroyed = false;
  vassal.hqDestroyedAt = 0;
  setRelation(vassalId, overlordId, "alliance");
  for (const id of PLAYER_IDS) {
    if (id === vassalId || id === overlordId || isDefeated(id)) continue;
    if (isHostile(overlordId, id)) setRelation(vassalId, id, "war");
  }
  game.diplomacyOffers = game.diplomacyOffers.filter((offer) => offer.from !== vassalId && offer.to !== vassalId);
  game.ultimatums = game.ultimatums.filter((item) => item.from !== vassalId && item.to !== vassalId);
  game.resourceRequests = game.resourceRequests.filter((request) => request.from !== vassalId && request.to !== vassalId);
  addSystemEvent(text || `${vassal.country} становится вассалом ${overlord.country}.`, { sound: "diplomacy" });
  touchMap();
  recomputePlayerFlags();
  checkVictory();
  return true;
}

function releaseVassal(overlordId, vassalId) {
  const overlord = game.players[overlordId];
  const vassal = game.players[vassalId];
  if (!overlord || !vassal || vassal.vassalOf !== overlordId || isDefeated(overlordId) || isDefeated(vassalId)) {
    sendError(playerClient(overlordId), "Выбери своего действующего вассала.");
    return false;
  }

  vassal.vassalOf = null;
  vassal.capitulatedAt = 0;
  game.diplomacyOffers = game.diplomacyOffers.filter((offer) => offer.from !== vassalId && offer.to !== vassalId);
  game.ultimatums = game.ultimatums.filter((item) => item.from !== vassalId && item.to !== vassalId);
  game.resourceRequests = game.resourceRequests.filter((request) => request.from !== vassalId && request.to !== vassalId);
  for (const id of PLAYER_IDS) {
    if (id !== vassalId) clearRelation(vassalId, id);
  }
  addSystemEvent(`${overlord.country} освобождает вассала ${vassal.country}.`, { sound: "diplomacy" });
  emitReportForPlayer(vassalId, "Вассал освобожден", "diplomacy");
  recomputePlayerFlags();
  return true;
}

function declareWar(fromId, toId) {
  if (isDefeated(fromId) || isDefeated(toId)) return;
  if (game.players[fromId]?.vassalOf) return;
  const targetOverlord = game.players[toId]?.vassalOf;
  if (targetOverlord && targetOverlord !== fromId && !isDefeated(targetOverlord)) {
    toId = targetOverlord;
  }
  if (isVassalOf(fromId, toId) || isVassalOf(toId, fromId)) return;
  setRelation(fromId, toId, "war");
  game.diplomacyOffers = game.diplomacyOffers.filter((offer) => !samePair(offer.from, offer.to, fromId, toId));
  game.ultimatums = game.ultimatums.filter((item) => !samePair(item.from, item.to, fromId, toId));
  game.resourceRequests = game.resourceRequests.filter((request) => !samePair(request.from, request.to, fromId, toId));
  cancelSupportBetween(fromId, toId);
  addSystemEvent(`${game.players[fromId].country} объявляет войну стране ${game.players[toId].country}!`, { sound: "war" });
  botSayPhrase(fromId, "war");
}

function clearRelation(a, b) {
  if (!a || !b || a === b) return;
  delete game.relations[pairKey(a, b)];
}

function botAllianceChance(botId, fromId) {
  const bot = game.players[botId];
  const relation = relationStatus(botId, fromId);
  const myPower = computeStats(botId).power || 1;
  const theirPower = computeStats(fromId).power || 1;
  let chance = relation === "war" ? 0.18 : 0.42;
  if (bot.personality === "passive" || bot.personality === "fisher") chance += 0.28;
  if (bot.personality === "industrial") chance += 0.03;
  if (bot.personality === "aggressive") chance -= 0.2;
  if (theirPower > myPower * 1.35) chance += 0.12;
  if (myPower > theirPower * 1.8 && bot.personality === "aggressive") chance -= 0.16;
  if (hasSupportDeal(botId, fromId)) chance += 0.22;
  return clamp(chance, 0.08, 0.86);
}

function cancelSupportBetween(a, b) {
  for (const key of Object.keys(game.supportDeals || {})) {
    const deal = game.supportDeals[key];
    if (samePair(deal.from, deal.to, a, b)) {
      delete game.supportDeals[key];
    }
  }
}

function emitMovementSfx(moved, cell, playerId) {
  if (!cell) return;
  if ((moved.drone || 0) > 0) emitSfx("drone_run", cell.x, cell.y, { playerId });
  if ((moved.tank || 0) > 0) emitSfx("tank", cell.x, cell.y, { playerId });
  if ((moved.mlrs || 0) > 0) emitSfx("rszo", cell.x, cell.y, { playerId });
}

function handleMove(client, message) {
  const playerId = client.playerId;
  const player = game.players[playerId];
  const from = getCell(message.x, message.y);
  const to = getCell(message.tx, message.ty);

  if (!from || !to || !isAdjacent(from, to)) {
    sendError(client, "Марш возможен только на соседнюю клетку.");
    return;
  }

  const sourceUnits = unitsFor(from, playerId);
  const fromBoat = from.terrain === "water" && sourceUnits.boat > 0;
  const fromCruiser = from.terrain === "water" && sourceUnits.cruiser > 0;
  const fromVessel = fromBoat || fromCruiser;
  if (!controlsCell(playerId, from) && !fromVessel && (sourceUnits.drone || 0) <= 0 && (sourceUnits.saboteur || 0) <= 0) {
    sendError(client, "Марш начинается только со своей клетки или своего корабля.");
    return;
  }

  const rawWaterTarget = to.terrain === "water" && to.building?.type !== "bridge";
  const hasInfRequest = Object.prototype.hasOwnProperty.call(message, "inf");
  const hasRpgRequest = Object.prototype.hasOwnProperty.call(message, "rpg");
  const hasTankRequest = Object.prototype.hasOwnProperty.call(message, "tank");
  const hasMlrsRequest = Object.prototype.hasOwnProperty.call(message, "mlrs");
  const hasEwRequest = Object.prototype.hasOwnProperty.call(message, "ew");
  const hasDroneRequest = Object.prototype.hasOwnProperty.call(message, "drone");
  const hasSaboteurRequest = Object.prototype.hasOwnProperty.call(message, "saboteur");
  const hasBoatRequest = Object.prototype.hasOwnProperty.call(message, "boat");
  const hasCruiserRequest = Object.prototype.hasOwnProperty.call(message, "cruiser");
  const requestedInf = hasInfRequest ? Math.max(0, Math.floor(Number(message.inf || 0))) : sourceUnits.inf;
  const requestedRpg = hasRpgRequest ? Math.max(0, Math.floor(Number(message.rpg || 0))) : sourceUnits.rpg;
  const requestedEw = hasEwRequest ? Math.max(0, Math.floor(Number(message.ew || 0))) : 0;
  const requestedDrone = hasDroneRequest ? Math.max(0, Math.floor(Number(message.drone || 0))) : 0;
  const requestedSaboteur = hasSaboteurRequest ? Math.max(0, Math.floor(Number(message.saboteur || 0))) : 0;
  const moved = emptyUnits();

  const onlyCovertRequested = (requestedDrone > 0 || requestedSaboteur > 0) && requestedInf <= 0 && requestedRpg <= 0 && requestedEw <= 0 && !message.tank && !message.mlrs && !message.boat && !message.cruiser;
  if (onlyCovertRequested) {
    moved.drone = Math.min(sourceUnits.drone, requestedDrone);
    moved.saboteur = Math.min(sourceUnits.saboteur, requestedSaboteur);
    if (moved.drone <= 0 && moved.saboteur <= 0) {
      sendError(client, "На клетке нет дронов или Шахедов.");
      return;
    }
    if (to.owner && to.owner !== playerId && !isHostile(playerId, to.owner) && !controlsOwner(playerId, to.owner)) {
      sendError(client, "Воздушные юниты можно заводить к врагу, нейтралу или вассалу.");
      return;
    }
    const ammoCost = movementAmmoCost(moved.drone + moved.saboteur, playerId, from);
    if (!canPay(player, { ammo: ammoCost })) {
      sendError(client, "Не хватает боеприпасов для движения.");
      return;
    }
    spend(player, { ammo: ammoCost });
    sourceUnits.drone -= moved.drone;
    sourceUnits.saboteur -= moved.saboteur;
    interceptDronesEnteringCell(playerId, to, moved);
    interceptShahedsEnteringCell(playerId, to, moved);
    if (movingUnitCount(moved) <= 0) {
      touchMap();
      send(client, { type: "moveResult", from: { x: from.x, y: from.y }, to: { x: to.x, y: to.y } });
      broadcastState();
      return;
    }
    addUnits(unitsFor(to, playerId), moved);
    emitMovementSfx(moved, to, playerId);
    touchMap();
    send(client, { type: "moveResult", from: { x: from.x, y: from.y }, to: { x: to.x, y: to.y } });
    broadcastState();
    return;
  }

  if (fromVessel && rawWaterTarget) {
    moved.inf = Math.min(sourceUnits.inf, requestedInf);
    moved.rpg = Math.min(sourceUnits.rpg, requestedRpg, 1);
    moved.cruiser = fromCruiser && (hasCruiserRequest ? message.cruiser : true) ? 1 : 0;
    moved.boat = !moved.cruiser && fromBoat && (hasBoatRequest ? message.boat : true) ? 1 : 0;
    if (!moved.boat && !moved.cruiser) {
      sendError(client, "По воде должен идти корабль.");
      return;
    }
    if (hostileCruiserAtCell(playerId, to)) {
      sendError(client, "Вражеский крейсер блокирует воду. Сбей его ракетой или крейсером.");
      return;
    }
    if (hasOwnWaterVessel(to, playerId)) {
      sendError(client, "На этой воде уже есть твой корабль.");
      return;
    }
    if (moved.rpg && (unitsFor(to, playerId).rpg || 0) > 0) {
      sendError(client, "На клетке уже есть твой гранатометчик.");
      return;
    }
    const ammoCost = movementAmmoCost(moved.inf + moved.rpg + 1, playerId, from);
    if (!canPay(player, { ammo: ammoCost })) {
      sendError(client, "Не хватает боеприпасов для движения.");
      return;
    }
    spend(player, { ammo: ammoCost });
    const movedCooldowns = movedWeaponCooldowns(from, playerId, moved);
    sourceUnits.inf -= moved.inf;
    sourceUnits.rpg -= moved.rpg;
    sourceUnits.boat -= moved.boat;
    sourceUnits.cruiser -= moved.cruiser;
    addUnits(unitsFor(to, playerId), moved);
    applyMovedWeaponCooldowns(from, to, playerId, movedCooldowns);
    pruneWeaponCooldowns(from);
    pruneWeaponCooldowns(to);
    touchMap();
    send(client, { type: "moveResult", from: { x: from.x, y: from.y }, to: { x: to.x, y: to.y } });
    broadcastState();
    return;
  }

  if (fromVessel && !rawWaterTarget) {
    moved.inf = Math.min(sourceUnits.inf, requestedInf);
    moved.rpg = Math.min(sourceUnits.rpg, requestedRpg, 1);
    if (moved.inf <= 0 && moved.rpg <= 0) {
      sendError(client, "На корабле нет пехоты для высадки.");
      return;
    }
    if (!isPassable(to)) {
      sendError(client, "Высадка невозможна.");
      return;
    }
    if (to.owner && to.owner !== playerId && !isHostile(playerId, to.owner) && !controlsOwner(playerId, to.owner)) {
      sendError(client, relationStatus(playerId, to.owner) === "alliance" ? "Союзную территорию нельзя захватывать." : "Сначала объяви войну.");
      return;
    }
    if (moved.rpg && (unitsFor(to, playerId).rpg || 0) > 0) {
      sendError(client, "На клетке уже есть твой гранатометчик.");
      return;
    }
    const ammoCost = movementAmmoCost(moved.inf + moved.rpg, playerId, from);
    if (!canPay(player, { ammo: ammoCost })) {
      sendError(client, "Не хватает боеприпасов для движения.");
      return;
    }
    spend(player, { ammo: ammoCost });
    sourceUnits.inf -= moved.inf;
    sourceUnits.rpg -= moved.rpg;
    resolveMoveIntoCell(playerId, to, moved);
    touchMap();
    send(client, { type: "moveResult", from: { x: from.x, y: from.y }, to: { x: to.x, y: to.y } });
    recomputePlayerFlags();
    checkVictory();
    broadcastState();
    return;
  }

  if (rawWaterTarget) {
    if (hostileCruiserAtCell(playerId, to)) {
      sendError(client, "Вражеский крейсер блокирует воду. Сбей его ракетой или крейсером.");
      return;
    }
    if (!hasOwnWaterVessel(to, playerId)) {
      sendError(client, "Вода без моста непроходима. Пехоту можно посадить только в свой корабль.");
      return;
    }
    moved.inf = Math.min(sourceUnits.inf, requestedInf);
    moved.rpg = Math.min(sourceUnits.rpg, requestedRpg, 1);
    if (moved.inf <= 0 && moved.rpg <= 0) {
      sendError(client, "В лодку можно посадить только пехоту или гранатометчиков.");
      return;
    }
    if (moved.rpg && (unitsFor(to, playerId).rpg || 0) > 0) {
      sendError(client, "На клетке уже есть твой гранатометчик.");
      return;
    }
    const ammoCost = movementAmmoCost(moved.inf + moved.rpg, playerId, from);
    if (!canPay(player, { ammo: ammoCost })) {
      sendError(client, "Не хватает боеприпасов для движения.");
      return;
    }
    spend(player, { ammo: ammoCost });
    sourceUnits.inf -= moved.inf;
    sourceUnits.rpg -= moved.rpg;
    unitsFor(to, playerId).inf += moved.inf;
    unitsFor(to, playerId).rpg += moved.rpg;
    touchMap();
    send(client, { type: "moveResult", from: { x: from.x, y: from.y }, to: { x: to.x, y: to.y } });
    broadcastState();
    return;
  }

  if (!isPassable(to)) {
    sendError(client, "Вода без моста непроходима.");
    return;
  }

  if (to.owner && to.owner !== playerId && !isHostile(playerId, to.owner) && !controlsOwner(playerId, to.owner)) {
    sendError(client, relationStatus(playerId, to.owner) === "alliance" ? "Союзную территорию нельзя захватывать." : "Сначала объяви войну.");
    return;
  }

  moved.inf = Math.min(sourceUnits.inf, requestedInf);
  moved.rpg = Math.min(sourceUnits.rpg, requestedRpg, 1);
  moved.tank = (hasTankRequest ? message.tank : sourceUnits.tank > 0) ? Math.min(sourceUnits.tank, 1) : 0;
  moved.mlrs = (hasMlrsRequest ? message.mlrs : sourceUnits.mlrs > 0) ? Math.min(sourceUnits.mlrs, 1) : 0;
  moved.ew = hasEwRequest ? Math.min(sourceUnits.ew, requestedEw, 1) : 0;
  moved.drone = hasDroneRequest ? Math.min(sourceUnits.drone, requestedDrone) : 0;
  moved.saboteur = hasSaboteurRequest ? Math.min(sourceUnits.saboteur, requestedSaboteur) : 0;

  if (movingUnitCount(moved) <= 0) {
    sendError(client, "На клетке нет подвижных войск.");
    return;
  }

  const targetOwnUnits = unitsFor(to, playerId);
  if (moved.tank && targetOwnUnits.tank) {
    sendError(client, "На клетке уже есть твой танк.");
    return;
  }
  if (moved.mlrs && targetOwnUnits.mlrs) {
    sendError(client, "На клетке уже есть твой РСЗО.");
    return;
  }
  if (moved.rpg && targetOwnUnits.rpg) {
    sendError(client, "На клетке уже есть твой гранатометчик.");
    return;
  }
  if (moved.ew && targetOwnUnits.ew) {
    sendError(client, "На клетке уже есть твой РЭБ.");
    return;
  }
  if (moved.ew && (moved.inf + moved.rpg + moved.tank + moved.mlrs) <= 0) {
    sendError(client, "РЭБ нужно перевозить вместе с пехотой или техникой.");
    return;
  }

  const ammoCost = movementAmmoCost(moved.inf + moved.rpg + moved.tank * 2 + moved.mlrs * 2 + moved.ew + moved.drone + moved.saboteur, playerId, from);
  if (!canPay(player, { ammo: ammoCost })) {
    sendError(client, "Не хватает боеприпасов для движения.");
    return;
  }

  const movedCooldowns = movedWeaponCooldowns(from, playerId, moved);
  spend(player, { ammo: ammoCost });
  sourceUnits.inf -= moved.inf;
  sourceUnits.rpg -= moved.rpg;
  sourceUnits.tank -= moved.tank;
  sourceUnits.mlrs -= moved.mlrs;
  sourceUnits.ew -= moved.ew;
  sourceUnits.drone -= moved.drone;
  sourceUnits.saboteur -= moved.saboteur;
  interceptDronesEnteringCell(playerId, to, moved);
  interceptShahedsEnteringCell(playerId, to, moved);
  if (movingUnitCount(moved) <= 0) {
    pruneWeaponCooldowns(from);
    touchMap();
    send(client, {
      type: "moveResult",
      from: { x: from.x, y: from.y },
      to: { x: to.x, y: to.y }
    });
    broadcastState();
    return;
  }
  resolveMoveIntoCell(playerId, to, moved);
  applyMovedWeaponCooldowns(from, to, playerId, movedCooldowns);
  emitMovementSfx(moved, to, playerId);
  pruneWeaponCooldowns(from);
  pruneWeaponCooldowns(to);
  touchMap();
  send(client, {
    type: "moveResult",
    from: { x: from.x, y: from.y },
    to: { x: to.x, y: to.y }
  });
  recomputePlayerFlags();
  checkVictory();
  broadcastState();
}

function resolveMoveIntoCell(playerId, cell, moved) {
  if (unitPower(moved) <= 0 && ((moved.drone || 0) > 0 || (moved.saboteur || 0) > 0)) {
    addUnits(unitsFor(cell, playerId), moved);
    return;
  }

  const lossSnapshot = armyGoldSnapshot();
  const attack = unitPower(moved);
  const defenders = hostileUnitIdsAtCell(playerId, cell);
  const bunkerOwner = cell.building?.type === "bunker" ? cell.building.owner : null;
  const bunkerDefender = bunkerOwner && defenders.includes(bunkerOwner) ? bunkerOwner : null;
  const bunkerInf = bunkerDefender ? (unitsFor(cell, bunkerDefender).inf || 0) : 0;
  const bunkerBonus = bunkerDefender ? Math.max(2, bunkerInf * 2) : 0;
  const defense = defenders.reduce((sum, defenderId) => sum + unitPower(unitsFor(cell, defenderId)), 0) + bunkerBonus;

  if (defense > 0) {
    if (attack > defense) {
      const survivors = scaleUnits(moved, (attack - defense) / attack, true);
      for (const defenderId of defenders) {
        cell.units[defenderId] = emptyUnits();
      }
      if (bunkerDefender) destroyBuilding(cell, playerId);
      addUnits(unitsFor(cell, playerId), survivors);
      captureCell(playerId, cell);
      applyArmyLossEffects(lossSnapshot, playerId);
      addSystemEvent(`${game.players[playerId].country} нападает на ${defenderNames(defenders)} и берет клетку.`, { sound: "alert" });
    } else {
      const ratio = Math.max(0, (defense - attack) / defense);
      for (const defenderId of defenders) {
        cell.units[defenderId] = scaleUnits(unitsFor(cell, defenderId), ratio, false);
      }
      applyArmyLossEffects(lossSnapshot, null);
      addSystemEvent(`${game.players[playerId].country} нападает на ${defenderNames(defenders)}, но атака отбита.`, { sound: "alert" });
    }
    return;
  }

  if (defenders.length) {
    for (const defenderId of defenders) {
      cell.units[defenderId] = emptyUnits();
    }
    applyArmyLossEffects(lossSnapshot, playerId);
  }
  addUnits(unitsFor(cell, playerId), moved);
  if (cell.owner !== playerId && !controlsOwner(playerId, cell.owner)) {
    captureCell(playerId, cell);
  }
  clearFactoryStrikeIfGuarded(cell, playerId);
}

function handleTankShot(client, message) {
  const playerId = client.playerId;
  const player = game.players[playerId];
  const from = getCell(message.x, message.y);
  const target = getCell(message.tx, message.ty);

  if (!from || !target || !controlsCell(playerId, from) || !isAdjacent(from, target) || unitsFor(from, playerId).tank < 1) {
    sendError(client, "Танк стреляет по соседней клетке.");
    return;
  }

  if (!weaponCooldownReady(from, playerId, "tank")) {
    sendError(client, "Танк перезаряжается.");
    return;
  }

  if (maybeMisfire(playerId, from, "tank")) {
    sendInfo(client, "Осечка: танк не выстрелил.");
    broadcastState();
    return;
  }

  const lossSnapshot = armyGoldSnapshot();
  const techBefore = hostileTechUnitCount(playerId, target);
  for (const enemyId of hostileUnitIdsAtCell(playerId, target)) {
    const enemyUnits = unitsFor(target, enemyId);
    enemyUnits.inf = Math.max(0, enemyUnits.inf - 2);
    enemyUnits.rpg = Math.max(0, enemyUnits.rpg - 1);
    enemyUnits.rocket = Math.max(0, enemyUnits.rocket - 1);
    enemyUnits.aa = Math.max(0, enemyUnits.aa - 1);
    enemyUnits.aaPlus = Math.max(0, enemyUnits.aaPlus - 1);
    enemyUnits.ew = Math.max(0, enemyUnits.ew - 1);
    enemyUnits.boat = Math.max(0, enemyUnits.boat - 1);
  }

  applyArmyLossEffects(lossSnapshot, playerId);
  emitTechDestroyedIfChanged(techBefore, target, playerId);
  pruneWeaponCooldowns(target);
  setWeaponCooldown(from, player, playerId, "tank");
  emitSfx("shot", from.x, from.y, { weapon: "tank", playerId });
  emitExplosions([{ x: target.x, y: target.y, kind: "tank" }]);
  addSystemEvent(`${game.players[playerId].country} стреляет танком по ${cellTargetName(target, playerId)}.`, { sound: "alert" });
  touchMap();
  recomputePlayerFlags();
  checkVictory();
  broadcastState();
}

function handleRpgShot(client, message) {
  const playerId = client.playerId;
  const player = game.players[playerId];
  const from = getCell(message.x, message.y);
  const target = getCell(message.tx, message.ty);

  if (!from || !target || !controlsCell(playerId, from) || !isAdjacent(from, target) || unitsFor(from, playerId).rpg < 1) {
    sendError(client, "Гранатометчик стреляет только по соседней клетке.");
    return;
  }

  if (!weaponCooldownReady(from, playerId, "rpg")) {
    sendError(client, "Гранатометчик перезаряжается.");
    return;
  }

  if (!canPay(player, { ammo: 1 })) {
    sendError(client, "Нужен 1 боеприпас для выстрела из РПГ.");
    return;
  }

  if (maybeMisfire(playerId, from, "rpg")) {
    sendInfo(client, "Осечка: РПГ дал искры без выстрела.");
    broadcastState();
    return;
  }

  const lossSnapshot = armyGoldSnapshot();
  const techBefore = hostileTechUnitCount(playerId, target);
  const hit = damageRpgCell(playerId, target);
  if (!hit) {
    sendError(client, "На соседней клетке нет вражеской техники для РПГ.");
    return;
  }

  spend(player, { ammo: 1 });
  applyArmyLossEffects(lossSnapshot, playerId);
  emitTechDestroyedIfChanged(techBefore, target, playerId);
  pruneWeaponCooldowns(target);
  setWeaponCooldown(from, player, playerId, "rpg");
  emitSfx("shot", from.x, from.y, { weapon: "rpg", playerId });
  emitExplosions([{ x: target.x, y: target.y, kind: "tank" }]);
  addSystemEvent(`${game.players[playerId].country} стреляет из РПГ по ${cellTargetName(target, playerId)}, цель: ${hit.label}${hit.destroyed ? "" : " не уничтожена"}.`, { sound: "alert" });
  touchMap();
  recomputePlayerFlags();
  checkVictory();
  broadcastState();
}

function damageRpgCell(playerId, cell) {
  if (!cell) return null;
  for (const enemyId of hostileUnitIdsAtCell(playerId, cell)) {
    const enemyUnits = unitsFor(cell, enemyId);
    const hit = ["tank", "mlrs", "rocket", "aaPlus", "aa", "ew"].find((unit) => (enemyUnits[unit] || 0) > 0);
    if (!hit) continue;
    const label = UNITS[hit]?.label || hit;
    if (Math.random() >= RPG_DESTROY_CHANCE) {
      return { label, destroyed: false };
    }
    enemyUnits[hit] = Math.max(0, enemyUnits[hit] - 1);
    return { label, destroyed: true };
  }
  return null;
}

function handleRocketStrike(client, message) {
  const playerId = client.playerId;
  const player = game.players[playerId];
  const from = getCell(message.x, message.y);
  const target = getCell(message.tx, message.ty);

  if (!from || !target || !controlsCell(playerId, from) || unitsFor(from, playerId).rocket < 1 || distance(from, target) > 5) {
    sendError(client, "Ракетная установка бьет в радиусе 5.");
    return;
  }

  if (!weaponCooldownReady(from, playerId, "rocket")) {
    sendError(client, "Ракеты перезаряжаются.");
    return;
  }

  if (maybeMisfire(playerId, from, "rocket")) {
    sendInfo(client, "Осечка: ракета не стартовала.");
    broadcastState();
    return;
  }

  launchRocketStrike(playerId, from, target, client);
}

function launchRocketStrike(playerId, from, target, client = null) {
  const player = game.players[playerId];
  if (!player || !from || !target) return false;
  setWeaponCooldown(from, player, playerId, "rocket");
  emitFlight("rocket", from, target, ROCKET_FLIGHT_MS, { playerId });
  emitSfx("raketa", target.x, target.y, { playerId });
  touchMap();
  broadcastState();

  const room = game;
  const tx = target.x;
  const ty = target.y;
  const timer = setTimeout(() => withGame(room, () => resolveRocketImpact(playerId, tx, ty, client)), ROCKET_FLIGHT_MS);
  timer.unref?.();
  return true;
}

function resolveRocketImpact(playerId, tx, ty, client = null) {
  if (!game || game.ended) return;
  const target = getCell(tx, ty);
  if (!target) return;

  const blocker = findHostileAirDefense(playerId, target.x, target.y, 4);
  if (blocker) {
    emitExplosions([{ x: target.x, y: target.y, kind: "intercept" }, { x: blocker.x, y: blocker.y, kind: "aa" }]);
    emitSfx("pvo", blocker.x, blocker.y, { playerId });
    if (client) sendInfo(client, "Ракета перехвачена ПВО.");
    touchMap();
    broadcastStateNow();
    return;
  }

  const lossSnapshot = armyGoldSnapshot();
  const techBefore = hostileTechUnitCount(playerId, target);
  damageRocketCell(playerId, target);
  applyArmyLossEffects(lossSnapshot, playerId);
  emitTechDestroyedIfChanged(techBefore, target, playerId);
  pruneWeaponCooldowns(target);
  emitExplosions([{ x: target.x, y: target.y, kind: "rocket" }]);
  addSystemEvent(`${game.players[playerId].country} запускает ракету по ${cellTargetName(target, playerId)}.`, { sound: "alert" });
  touchMap();
  recomputePlayerFlags();
  checkVictory();
  broadcastStateNow();
}

function maybeMisfire(playerId, cell, weapon) {
  if (!cell || !COOLDOWNS[weapon]) return false;
  const player = game.players[playerId];
  if (!player?.devAlwaysMisfire && (game.devNoCooldowns || Math.random() >= MISFIRE_CHANCE)) return false;
  setWeaponCooldown(cell, player, playerId, weapon);
  emitSfx("misfire", cell.x, cell.y, { weapon, playerId });
  emitExplosions([{ x: cell.x, y: cell.y, kind: "misfire" }]);
  touchMap();
  return true;
}

function damageRocketCell(playerId, cell) {
  if (!cell) return;
  const rain = activeEventType("rain");
  for (const enemyId of hostileUnitIdsAtCell(playerId, cell)) {
    const enemyUnits = unitsFor(cell, enemyId);
    if ((enemyUnits.ew || 0) > 0) {
      enemyUnits.ew = 0;
    }
    if (bunkerProtects(cell, enemyId)) {
      continue;
    }
    enemyUnits.inf = Math.max(0, enemyUnits.inf - (rain ? 2 : 4));
    for (const unit of ["rpg", "tank", "rocket", "aa", "aaPlus", "boat", "mlrs", "cruiser"]) {
      if ((enemyUnits[unit] || 0) > 0 && (!rain || Math.random() < 0.5)) {
        enemyUnits[unit] = Math.max(0, enemyUnits[unit] - 1);
      }
    }
  }
  if (cell.building?.type === "bunker" && isHostile(playerId, cell.building.owner)) {
    return;
  }
  if (cell.building && isHostile(playerId, cell.building.owner) && (!rain || Math.random() < 0.5)) {
    destroyBuilding(cell, playerId);
  }
}

function damageMlrsCell(playerId, cell) {
  if (!cell) return;
  for (const enemyId of hostileUnitIdsAtCell(playerId, cell)) {
    const enemyUnits = unitsFor(cell, enemyId);
    enemyUnits.ew = 0;
    if (bunkerProtects(cell, enemyId)) {
      continue;
    }
    enemyUnits.inf = Math.max(0, enemyUnits.inf - Math.ceil((enemyUnits.inf || 0) * MLRS_INFANTRY_KILL_RATIO));
    for (const unit of ["rpg", "tank", "rocket", "aa", "aaPlus", "mlrs", "boat"]) {
      if ((enemyUnits[unit] || 0) > 0 && Math.random() < MLRS_TECH_HIT_CHANCE) {
        enemyUnits[unit] = Math.max(0, enemyUnits[unit] - 1);
      }
    }
  }
}

function mlrsSalvoCells(target) {
  if (!target) return [];
  const cells = [target];
  const nearby = [];
  for (let y = target.y - 1; y <= target.y + 1; y += 1) {
    for (let x = target.x - 1; x <= target.x + 1; x += 1) {
      if (x === target.x && y === target.y) continue;
      const cell = getCell(x, y);
      if (cell) nearby.push(cell);
    }
  }
  return cells.concat(shuffle(nearby).slice(0, Math.max(0, MLRS_SALVO_COUNT - 1)));
}

function damageCruiserCell(playerId, cell) {
  if (!cell) return;
  for (const enemyId of hostileUnitIdsAtCell(playerId, cell)) {
    const enemyUnits = unitsFor(cell, enemyId);
    enemyUnits.ew = Math.max(0, enemyUnits.ew - 1);
    if ((enemyUnits.cruiser || 0) > 0) {
      enemyUnits.cruiser = Math.max(0, enemyUnits.cruiser - 1);
      continue;
    }
    if ((enemyUnits.boat || 0) > 0) {
      enemyUnits.boat = Math.max(0, enemyUnits.boat - 1);
      continue;
    }
    enemyUnits.inf = Math.max(0, enemyUnits.inf - 2);
    enemyUnits.rpg = Math.max(0, enemyUnits.rpg - 1);
  }
  if (cell.building && isHostile(playerId, cell.building.owner)) {
    destroyBuilding(cell, playerId);
  }
}

function handleMlrs(client, message) {
  const playerId = client.playerId;
  const player = game.players[playerId];
  const from = getCell(message.x, message.y);
  const target = getCell(message.tx, message.ty);

  if (!from || !target || !controlsCell(playerId, from) || unitsFor(from, playerId).mlrs < 1 || distance(from, target) > 4) {
    sendError(client, "РСЗО бьет в радиусе 4.");
    return;
  }

  if (!weaponCooldownReady(from, playerId, "mlrs")) {
    sendError(client, "РСЗО перезаряжается.");
    return;
  }

  if (maybeMisfire(playerId, from, "mlrs")) {
    sendInfo(client, "Осечка: РСЗО дала искру без залпа.");
    broadcastState();
    return;
  }

  const lossSnapshot = armyGoldSnapshot();
  const blasts = [];

  for (const cell of mlrsSalvoCells(target)) {
    const techBefore = hostileTechUnitCount(playerId, cell);
    damageMlrsCell(playerId, cell);
    emitTechDestroyedIfChanged(techBefore, cell, playerId);
    pruneWeaponCooldowns(cell);
    blasts.push({ x: cell.x, y: cell.y, kind: "mlrs" });
  }

  setWeaponCooldown(from, player, playerId, "mlrs");
  applyArmyLossEffects(lossSnapshot, playerId);
  emitSfx("shot", from.x, from.y, { weapon: "mlrs", playerId });
  emitExplosions(blasts);
  for (const blast of blasts) {
    emitSfx("rszo_hit", blast.x, blast.y, { playerId });
  }
  addSystemEvent(`${game.players[playerId].country} накрывает ${cellTargetName(target, playerId)} залпом РСЗО.`, { sound: "alert" });
  touchMap();
  recomputePlayerFlags();
  checkVictory();
  broadcastState();
}

function handleCruiserSalvo(client, message) {
  const playerId = client.playerId;
  const player = game.players[playerId];
  const from = getCell(message.x, message.y);
  const target = getCell(message.tx, message.ty);

  if (!from || !target || unitsFor(from, playerId).cruiser < 1 || !cruiserTargetInLine(from, target)) {
    sendError(client, "Крейсер бьет только по вертикали или горизонтали в радиусе 3.");
    return;
  }

  if (!weaponCooldownReady(from, playerId, "cruiser")) {
    sendError(client, "Крейсер перезаряжается.");
    return;
  }

  if (maybeMisfire(playerId, from, "cruiser")) {
    sendInfo(client, "Осечка: крейсер дал искры без залпа.");
    broadcastState();
    return;
  }

  const lossSnapshot = armyGoldSnapshot();
  const techBefore = hostileTechUnitCount(playerId, target);
  for (let index = 0; index < 2; index += 1) {
    damageCruiserCell(playerId, target);
    pruneWeaponCooldowns(target);
  }

  setWeaponCooldown(from, player, playerId, "cruiser");
  applyArmyLossEffects(lossSnapshot, playerId);
  emitTechDestroyedIfChanged(techBefore, target, playerId);
  emitSfx("shot", from.x, from.y, { weapon: "cruiser", playerId });
  emitExplosions([{ x: target.x, y: target.y, kind: "cruiser" }]);
  addSystemEvent(`${game.players[playerId].country} стреляет крейсером по ${cellTargetName(target, playerId)}.`, { sound: "alert" });
  touchMap();
  recomputePlayerFlags();
  checkVictory();
  broadcastState();
}

function handleDroneDetonation(client, message) {
  const playerId = client.playerId;
  const cell = getCell(message.x, message.y);
  if (!cell || (unitsFor(cell, playerId).drone || 0) <= 0) {
    sendError(client, "Для детонации выбери клетку со своим дроном.");
    return;
  }

  const defenders = hostileUnitIdsAtCell(playerId, cell);
  if (!defenders.length) {
    sendError(client, "На клетке нет вражеской цели для дрона.");
    return;
  }

  detonateDroneAt(playerId, cell);
  broadcastState();
}

function detonateDroneAt(playerId, cell) {
  const defenders = hostileUnitIdsAtCell(playerId, cell);
  const lossSnapshot = armyGoldSnapshot();
  const techBefore = hostileTechUnitCount(playerId, cell);
  const ownUnits = unitsFor(cell, playerId);
  ownUnits.drone = Math.max(0, ownUnits.drone - 1);

  let hitText = "";
  let destroyed = false;
  for (const enemyId of defenders) {
    const enemyUnits = unitsFor(cell, enemyId);
    const hit = ["tank", "mlrs", "aaPlus", "aa", "ew", "rpg"].find((unit) => (enemyUnits[unit] || 0) > 0);
    if (hit) {
      hitText = UNITS[hit]?.label || hit;
      if (Math.random() < DRONE_DESTROY_CHANCE) {
        enemyUnits[hit] = Math.max(0, enemyUnits[hit] - 1);
        destroyed = true;
      }
      break;
    }
    if ((enemyUnits.inf || 0) > 0) {
      const killed = Math.min(enemyUnits.inf, 3);
      hitText = `${killed} пехоты`;
      if (Math.random() < DRONE_DESTROY_CHANCE) {
        enemyUnits.inf -= killed;
        destroyed = true;
      }
      break;
    }
  }

  applyArmyLossEffects(lossSnapshot, playerId);
  emitTechDestroyedIfChanged(techBefore, cell, playerId);
  pruneWeaponCooldowns(cell);
  touchMap();
  emitSfx("shot", cell.x, cell.y, { weapon: "drone", playerId });
  emitExplosions([{ x: cell.x, y: cell.y, kind: "drone" }]);
  addSystemEvent(`${game.players[playerId].country} подрывает дрон на клетке ${cell.x + 1}:${cell.y + 1}${hitText ? `, цель: ${hitText}${destroyed ? "" : " не уничтожена"}` : ""}.`, { sound: "alert" });
  recomputePlayerFlags();
  checkVictory();
  return true;
}

function handleSaboteurDetonation(client, message) {
  const playerId = client.playerId;
  const cell = getCell(message.x, message.y);
  const ownUnits = cell ? unitsFor(cell, playerId) : null;

  if (!cell || !ownUnits || (ownUnits.saboteur || 0) <= 0) {
    sendError(client, "Для удара выбери клетку со своим Шахедом.");
    return;
  }

  if (!cell.building || !cell.building.owner || !isHostile(playerId, cell.building.owner)) {
    sendError(client, "Шахед бьет только по вражеским постройкам.");
    return;
  }

  detonateSaboteurAt(playerId, cell);
  broadcastState();
}

function detonateSaboteurAt(playerId, cell) {
  const ownUnits = unitsFor(cell, playerId);
  if ((ownUnits.saboteur || 0) <= 0 || !cell.building?.owner || !isHostile(playerId, cell.building.owner)) return false;
  const targetOwner = cell.building.owner;
  const buildingLabel = BUILDINGS[cell.building.type]?.label || "постройку";
  ownUnits.saboteur = Math.max(0, ownUnits.saboteur - 1);
  destroyBuilding(cell, playerId);
  touchMap();
  emitSfx("shot", cell.x, cell.y, { weapon: "saboteur", playerId });
  emitExplosions([{ x: cell.x, y: cell.y, kind: "rocket" }]);
  addSystemEvent(`${game.players[playerId].country} направляет Шахед и уничтожает ${buildingLabel} страны ${game.players[targetOwner]?.country || "противника"}.`, { sound: "alert" });
  recomputePlayerFlags();
  checkVictory();
  return true;
}

function handleMobilization(client) {
  const playerId = client.playerId;
  const player = game.players[playerId];
  const now = Date.now();

  if (!playerHasBuilding(playerId, "tck")) {
    sendError(client, "Для мобилизации нужен ТЦК на своей территории.");
    return;
  }

  player.mobilizationActive = !player.mobilizationActive;
  if (player.mobilizationActive) {
    player.mobilizationStartedAt = now;
    addSystemEvent(`${player.country} включает мобилизацию: казармы ускорены.`, { sound: "diplomacy" });
  } else {
    player.mobilizationStartedAt = 0;
    addSystemEvent(`${player.country} выключает мобилизацию.`, { sound: "diplomacy" });
  }
  broadcastState();
}

function mobilizationActive(playerId, now = Date.now()) {
  const player = game.players[playerId];
  if (!player?.mobilizationActive) return false;
  if (!playerHasBuilding(playerId, "tck")) {
    player.mobilizationActive = false;
    player.mobilizationStartedAt = 0;
    return false;
  }
  return true;
}

function handleShahedStrike(client, message) {
  const playerId = client.playerId;
  const player = game.players[playerId];
  const now = Date.now();

  if (now - (client.lastShahedActionAt || 0) < SHAHED_ACTION_THROTTLE_MS) {
    return;
  }
  client.lastShahedActionAt = now;

  const target = getCell(message.tx, message.ty);
  if (!target) {
    sendError(client, "Выбери точку удара Шахеда.");
    return;
  }

  const factory = factoryLaunchCell(playerId);
  if (!factory) {
    sendError(client, "Для запуска Шахеда нужен хотя бы один завод.");
    return;
  }

  if (!cooldownReady(player, "saboteur")) {
    sendError(client, `Шахед готовится: ${Math.ceil(((player.cooldowns.saboteur || 0) - Date.now()) / 1000)} с.`);
    return;
  }

  const cost = UNITS.saboteur.cost;
  if (!canPay(player, cost)) {
    sendError(client, "Не хватает ресурсов для запуска Шахеда.");
    return;
  }

  launchShahedStrike(playerId, target, factory);
}

function launchShahedStrike(playerId, target, factory) {
  const player = game.players[playerId];
  if (!player || !target || !factory) return false;
  spend(player, UNITS.saboteur.cost);
  setCooldown(player, "saboteur");
  emitFlight("shahed", factory, target, SHAHED_FLIGHT_MS, { playerId });
  emitSfx("shahed", factory.x, factory.y, { playerId });
  addSystemEvent(`${player.country} запускает Шахед.`);
  broadcastState();

  const room = game;
  const tx = target.x;
  const ty = target.y;
  const timer = setTimeout(() => withGame(room, () => resolveShahedImpact(playerId, tx, ty)), SHAHED_FLIGHT_MS);
  timer.unref?.();
  return true;
}

function resolveShahedImpact(playerId, tx, ty) {
  if (!game || game.ended) return;
  const target = getCell(tx, ty);
  if (!target) return;

  const blocker = findHostileAirDefense(playerId, target.x, target.y, 4);
  if (blocker) {
    const blockerOwner = airDefenseOwnerAtCell(blocker, playerId);
    emitSfx("pvo", blocker.x, blocker.y, { playerId: blockerOwner || playerId });
    emitExplosions([{ x: target.x, y: target.y, kind: "aa" }]);
    addSystemEvent(`ПВО сбивает Шахед у ${target.x + 1}:${target.y + 1}.`);
    broadcastState();
    return;
  }

  let targetOwner = target.building?.owner || null;
  let buildingLabel = "";
  if (target.building && targetOwner && isHostile(playerId, targetOwner)) {
    buildingLabel = BUILDINGS[target.building.type]?.label || "постройку";
    destroyBuilding(target, playerId);
  }

  touchMap();
  emitExplosions([{ x: target.x, y: target.y, kind: "rocket" }]);
  if (buildingLabel) {
    addSystemEvent(`${game.players[playerId].country} направляет Шахед и уничтожает ${buildingLabel} страны ${game.players[targetOwner]?.country || "противника"}.`);
  } else {
    addSystemEvent(`${game.players[playerId].country} направляет Шахед по клетке ${target.x + 1}:${target.y + 1}.`);
  }
  recomputePlayerFlags();
  checkVictory();
  broadcastStateNow();
}

function handleNuke(client, message) {
  const playerId = client.playerId;
  const player = game.players[playerId];
  const now = Date.now();

  if (now - (client.lastNukeActionAt || 0) < NUKE_ACTION_THROTTLE_MS) {
    if (now - (client.lastNukeThrottleNoticeAt || 0) >= NUKE_ACTION_THROTTLE_MS) {
      client.lastNukeThrottleNoticeAt = now;
      sendError(client, "Ядерка уже обрабатывается, подожди момент.");
    }
    return;
  }
  client.lastNukeActionAt = now;

  const target = getCell(message.tx, message.ty);

  if (!target) {
    sendError(client, "Выбери точку удара.");
    return;
  }

  if (!playerHasBuilding(playerId, "nuclearPlant")) {
    sendError(client, "Для ядерки нужен Ядерный завод на своей территории.");
    return;
  }

  const plant = readyNuclearPlant(playerId);
  if (!plant) {
    sendError(client, "Ядерные заводы перезаряжаются.");
    return;
  }

  if (!canPay(player, NUCLEAR_COST)) {
    sendError(client, "Не хватает ресурсов для ядерки.");
    return;
  }

  launchNuke(playerId, target, client, plant);
  recomputePlayerFlags();
  checkVictory();
  broadcastStateNow();
}

function launchNuke(playerId, target, client = null, plantCell = null) {
  const player = game.players[playerId];
  const plant = plantCell || readyNuclearPlant(playerId);
  if (!plant) return { failed: true };
  spend(player, NUCLEAR_COST);
  setNuclearPlantCooldown(plant, player);
  const launchCell = nukeLaunchCell(playerId, plant);
  emitFlight("nuke", launchCell, target, NUKE_FLIGHT_MS, { playerId });
  broadcastState();

  const room = game;
  const tx = target.x;
  const ty = target.y;
  const timer = setTimeout(() => withGame(room, () => resolveNukeImpact(playerId, tx, ty, client)), NUKE_FLIGHT_MS);
  timer.unref?.();
  return { launched: true };
}

function resolveNukeImpact(playerId, tx, ty, client = null) {
  if (!game || game.ended) return;
  const target = getCell(tx, ty);
  if (!target) return;

  const blocker = findHostileNuclearDefense(playerId, target.x, target.y, 5);
  if (blocker) {
    emitExplosions([{ x: target.x, y: target.y, kind: "intercept" }, { x: blocker.x, y: blocker.y, kind: "aa" }]);
    emitSfx("pvo", blocker.x, blocker.y, { playerId });
    if (client) sendInfo(client, "Ядерный удар перехвачен ПВО+.");
    addSystemEvent(`${game.players[playerId].country} запускает ядерку, но ПВО+ перехватывает удар.`, { sound: "alert" });
    touchMap();
    broadcastStateNow();
    return;
  }

  const lossSnapshot = armyGoldSnapshot();
  for (let y = target.y - 1; y <= target.y + 1; y += 1) {
    for (let x = target.x - 1; x <= target.x + 1; x += 1) {
      const cell = getCell(x, y);
      if (!cell) continue;
      const bunkerOwner = cell.building?.type === "bunker" ? cell.building.owner : null;
      const protectedInf = bunkerOwner ? (unitsFor(cell, bunkerOwner).inf || 0) : 0;
      for (const id of PLAYER_IDS) {
        const cruiser = unitsFor(cell, id).cruiser || 0;
        cell.units[id] = emptyUnits();
        cell.units[id].cruiser = cruiser;
        if (id === bunkerOwner) {
          cell.units[id].inf = protectedInf;
        }
        cell.cooldowns[id] = emptyWeaponCooldowns();
      }
      if (cell.building && cell.building.type !== "bunker") {
        destroyBuilding(cell, playerId);
      }
    }
  }

  applyArmyLossEffects(lossSnapshot, playerId);
  touchMap();
  emitExplosions([{ x: target.x, y: target.y, kind: "nuke" }]);
  emitSfx("yaderka", target.x, target.y, { playerId });
  addSystemEvent(`${game.players[playerId].country} использует ядерку против ${cellTargetName(target, playerId)}.`, { sound: "alert" });
  recomputePlayerFlags();
  checkVictory();
  broadcastStateNow();
}

function nukeLaunchCell(playerId, plantCell = null) {
  let fallback = plantCell || null;
  const hq = findHqCell(playerId);
  if (hq) return hq;
  if (fallback) return fallback;
  forEachCell((cell) => {
    if (!fallback && controlsCell(playerId, cell)) fallback = cell;
  });
  return fallback || { x: 0, y: 0 };
}

function createFreshGame() {
  return {
    id: "",
    status: "lobby",
    players: {},
    relations: {},
    diplomacyOffers: [],
    ultimatums: [],
    resourceRequests: [],
    supportDeals: {},
    diplomacyCooldowns: {},
    resourceRequestCooldowns: {},
    trollPrompts: {},
    lobbyCreated: false,
    lobbyHostId: null,
    lobbyCode: "",
    settings: defaultLobbySettings(),
    map: [],
    flatCells: null,
    flatCellsSource: null,
    chat: [],
    chatVersion: 0,
    startedAt: null,
    ended: null,
    timer: null,
    stateBroadcastTimer: null,
    emptySince: 0,
    explosionId: 0,
    reportId: 0,
    stateVersion: 0,
    mapVersion: 0,
    flightId: 0,
    devNoCooldowns: false,
    botCursor: 0,
    botTargetMemory: {},
    continuedWithBots: false,
    continueWinnerId: null,
    activeEvent: null,
    pendingEvent: null,
    nextRandomEventAt: 0,
    nextIncomeCheckAt: 0
  };
}

function createPlayer(id) {
  const bot = BOT_PROFILES[id] || null;
  return {
    id,
    joined: Boolean(bot),
    connected: Boolean(bot),
    isBot: Boolean(bot),
    personality: bot?.personality || "human",
    ideology: BOT_IDEOLOGIES[id] || "democracy",
    country: bot?.country || "",
    color: bot?.color || "",
    colorValue: bot?.colorValue || "#555",
    token: "",
    ip: "",
    resources: { gold: 50, iron: 0, pop: 0, ammo: 20, uranium: 0 },
    specialOpCooldown: 0,
    scoutReports: {},
    mobilizationActive: false,
    mobilizationStartedAt: 0,
    cooldowns: { nuke: 0, saboteur: 0 },
    hqLost: false,
    hqDestroyed: false,
    hqDestroyedAt: 0,
    defeated: false,
    vassalOf: null,
    capitulatedAt: 0,
    devAlwaysMisfire: false,
    lastEco: Date.now(),
    lastIronEco: Date.now(),
    lastBarracks: Date.now(),
    lastFactory: Date.now(),
    lastBotAction: Date.now() - BOT_TURN_INTERVAL_MS + randomInt(0, BOT_TURN_STAGGER_MS),
    lastDiplomacy: Date.now(),
    nextBotMove: Date.now() + randomInt(500, BOT_MOVE_COOLDOWN_MS)
  };
}

function startGame() {
  clearPendingStateBroadcast();
  game.status = "running";
  game.startedAt = Date.now();
  game.ended = null;
  game.chat = [];
  game.map = generateMap();
  game.flatCells = null;
  game.flatCellsSource = null;
  game.resourceRequests = [];
  game.ultimatums = [];
  game.supportDeals = {};

  const enabledBots = new Set(activeBotIds());
  for (const id of BOT_IDS) {
    if (enabledBots.has(id)) {
      game.players[id] = createPlayer(id);
    } else {
      delete game.players[id];
    }
  }

  const BOT_START_RES = {
    farmers:    { gold: 50, iron: 0, pop: 2, ammo: 20, uranium: 0 },
    anarchists: { gold: 50, iron: 2, pop: 2, ammo: 20, uranium: 0 },
    mechanics:  { gold: 50, iron: 10, pop: 2, ammo: 20, uranium: 0 },
    rivermen:   { gold: 50, iron: 2, pop: 2, ammo: 20, uranium: 0 }
  };

  for (const id of PLAYER_IDS) {
    const player = game.players[id];
    if (!player) continue;
    player.resources = player.isBot
      ? (BOT_START_RES[id] || { gold: 50, iron: 0, pop: 2, ammo: 20, uranium: 0 })
      : { gold: 50, iron: 10, pop: 3, ammo: 20, uranium: 0 };
    player.cooldowns = { nuke: 0, saboteur: 0 };
    player.specialOpCooldown = 0;
    player.scoutReports = {};
    player.mobilizationActive = false;
    player.mobilizationStartedAt = 0;
    player.hqLost = false;
    player.hqDestroyed = false;
    player.hqDestroyedAt = 0;
    player.defeated = false;
    player.vassalOf = null;
    player.capitulatedAt = 0;
    player.devAlwaysMisfire = false;
    player.lastBotAction = Date.now() - BOT_TURN_INTERVAL_MS + randomInt(0, BOT_TURN_STAGGER_MS);
    player.lastDiplomacy = Date.now() + randomInt(5_000, 15_000);
    player.nextBotMove = Date.now() + randomInt(500, BOT_MOVE_COOLDOWN_MS);
  }

  game.activeEvent = null;
  game.pendingEvent = null;
  game.nextRandomEventAt = game.settings?.randomEvents === false ? 0 : Date.now() + RANDOM_EVENT_INTERVAL_MS;
  game.nextIncomeCheckAt = Date.now();
  game.botCursor = randomInt(0, Math.max(0, activeBotIds().length - 1));

  initializeDiplomacy();
  placeStartingBases();
  addSystemEvent("Матч начался. Четыре государства захватили стартовые позиции.", { broadcastNow: false });
  touchMap();
  for (const client of clientsForCurrentGame()) {
    client.pendingState = null;
    client.lastMapVersionSent = -1;
    client.lastChatVersionSent = -1;
  }
  clearInterval(game.timer);
  const room = game;
  game.timer = setInterval(() => withGame(room, gameLoop), GAME_LOOP_INTERVAL_MS);
  recomputePlayerFlags();
  broadcast({ type: "start" });
  broadcastState();
}

function generateMap() {
  const cells = [];
  for (let y = 0; y < HEIGHT; y += 1) {
    const row = [];
    for (let x = 0; x < WIDTH; x += 1) {
      row.push({
        x,
        y,
        terrain: "land",
        owner: null,
        building: null,
        construction: null,
        units: emptyUnitsByPlayer(),
        cooldowns: emptyCooldownsByPlayer()
      });
    }
    cells.push(row);
  }

  paintNaturalRiver(cells);
  paintHorizontalRiver(cells);
  paintLakes(cells);

  for (const start of Object.values(startingLayouts())) {
    clearBaseZone(cells, start.x, start.y);
  }
  placeUnmirroredResources(cells);

  return cells;
}

function startingLayouts() {
  const ids = activeLayoutPlayerIds();
  const layouts = {};
  const cx = (WIDTH - 1) / 2;
  const cy = (HEIGHT - 1) / 2;
  const radiusX = Math.max(6, WIDTH / 2 - 4);
  const radiusY = Math.max(5, HEIGHT / 2 - 4);
  const count = Math.max(1, ids.length);

  ids.forEach((playerId, index) => {
    const angle = Math.PI + (index * Math.PI * 2) / count;
    const x = clamp(Math.round(cx + Math.cos(angle) * radiusX), 2, WIDTH - 3);
    const y = clamp(Math.round(cy + Math.sin(angle) * radiusY), 2, HEIGHT - 3);
    layouts[playerId] = {
      x,
      y,
      x0: clamp(x - 1, 0, WIDTH - 1),
      x1: clamp(x + 1, 0, WIDTH - 1),
      y0: clamp(y - 1, 0, HEIGHT - 1),
      y1: clamp(y + 1, 0, HEIGHT - 1)
    };
  });

  return layouts;
}

function activeLayoutPlayerIds() {
  const humans = joinedHumanIds(game);
  const bots = activeBotIds();
  const ids = [...humans, ...bots].filter((id) => PLAYER_IDS.includes(id));
  return ids.length ? ids : ["p1"];
}

function placeStartingBases() {
  const starts = startingLayouts();

  for (const [playerId, start] of Object.entries(starts)) {
    if (!game.players[playerId]?.joined) continue;
    for (let y = start.y0; y <= start.y1; y += 1) {
      for (let x = start.x0; x <= start.x1; x += 1) {
        const cell = getCell(x, y);
        cell.terrain = "land";
        cell.owner = playerId;
      }
    }
    const hq = getCell(start.x, start.y);
    hq.owner = playerId;
    hq.building = { type: "hq", owner: playerId, originalOwner: playerId, lastIncome: Date.now() };
    unitsFor(hq, playerId).inf = game.players[playerId]?.isBot ? 2 : 3;
    if (HUMAN_IDS.includes(playerId)) {
      placeStarterFarms(playerId, start);
    }
  }
}

function placeStarterFarms(playerId, start) {
  const dx = start.x < WIDTH / 2 ? 1 : -1;
  const dy = start.y < HEIGHT / 2 ? 1 : -1;
  const offsets = [[dx, 0], [0, dy]];
  for (const [dx, dy] of offsets) {
    const cell = getCell(start.x + dx, start.y + dy);
    if (cell?.owner === playerId && !cell.building && cell.terrain === "land") {
      cell.building = { type: "farm", owner: playerId, lastIncome: Date.now() };
    }
  }
}

function gameLoop() {
  if (game.status !== "running") return;

  const now = Date.now();
  let changed = false;
  let mapChanged = false;
  const previousStatus = game.status;
  const checkIncome = now >= (game.nextIncomeCheckAt || 0);
  if (checkIncome) {
    game.nextIncomeCheckAt = now + INCOME_CHECK_INTERVAL_MS;
  }

  const eventResult = updateRandomEvents(now);
  changed = eventResult.changed || changed;
  mapChanged = eventResult.mapChanged || mapChanged;

  const constructionResult = updateConstructions(now);
  changed = constructionResult.changed || changed;
  mapChanged = constructionResult.mapChanged || mapChanged;

  if (updateEwInterceptions()) {
    changed = true;
    mapChanged = true;
  }

  if (updateAirDefenseInterceptions()) {
    changed = true;
    mapChanged = true;
  }

  if (markExpiredDefeats(now)) {
    changed = true;
    mapChanged = true;
  }

  for (const playerId of PLAYER_IDS) {
    const player = game.players[playerId];
    if (!player || isDefeated(playerId)) continue;
    const rm = (player.hqLost ? 0.5 : 1) * (player.isBot ? BOT_ECONOMY_MULTIPLIER : 1);

    if (checkIncome) {
      // Доход каждого здания считается независимо от момента постройки
      forEachCell((cell) => {
        const b = cell.building;
        if (!b || b.owner !== playerId) return;

        const cfg = incomeConfigFor(cell);
        if (!cfg) return; // HQ, мост и т.п. дохода не приносят

        const last = b.lastIncome || 0;
        const interval = incomeIntervalFor(playerId, cell, cfg, now);

        if (b.type === "port") {
          const blockerId = portBlockader(playerId, cell);
          if (blockerId) {
            if (notePortBlockade(playerId, cell, blockerId, now)) {
              changed = true;
              mapChanged = true;
            }
            if (now - last >= interval) {
              b.lastIncome = now;
              changed = true;
            }
            return;
          }
          if (clearPortBlockade(cell)) {
            changed = true;
            mapChanged = true;
          }
        }

        if (now - last < interval) return;

        if (b.type === "farm" && activeEventType("drought")) {
          b.lastIncome = now;
          changed = true;
          return;
        }

        if (b.type === "factory") {
          const guarded = (unitsFor(cell, playerId).inf || 0) > 0;
          if (guarded && b.strikeUntil) {
            b.strikeUntil = 0;
            mapChanged = true;
          }
          if (!guarded && b.strikeUntil && now >= b.strikeUntil) {
            b.strikeUntil = 0;
            mapChanged = true;
          }
          if (!guarded && ((b.strikeUntil && now < b.strikeUntil) || Math.random() < FACTORY_STRIKE_CHANCE)) {
            b.strikeUntil = Math.max(b.strikeUntil || 0, now + FACTORY_STRIKE_MS);
            b.lastIncome = now;
            changed = true;
            mapChanged = true;
            return;
          }
        }

        if (cfg.resource === "inf") {
          const cost = unitHireCost(playerId, "inf", cell);
          if (!canPay(player, cost)) return;
          b.lastIncome = now;
          spend(player, cost);
          unitsFor(cell, playerId).inf += 1;
          changed = true;
          mapChanged = true;
        } else {
          b.lastIncome = now;
          addResource(player, cfg.resource, incomeAmountFor(player, cell, cfg) * rm);
          changed = true;
        }
      });
    }

  }

  const botResult = runDueBotTurn(now);
  changed = botResult.changed || changed;
  mapChanged = botResult.mapChanged || mapChanged;

  if (runSupportDeals(now)) {
    changed = true;
  }

  recomputePlayerFlags();
  if (syncVassalDiplomacy()) {
    changed = true;
  }
  if (maybeCapitulateBots()) {
    changed = true;
    mapChanged = true;
  }
  if (markExpiredDefeats(now)) {
    changed = true;
    mapChanged = true;
  }
  checkVictory();
  if (mapChanged) {
    touchMap();
  }
  if (changed || game.status !== previousStatus) {
    broadcastState();
  }
}

function runDueBotTurn(now = Date.now()) {
  const bots = activeBotIds().filter((id) => {
    const player = game.players[id];
    return player?.isBot && !isDefeated(id) && !hqRebuildExpired(id, now);
  });
  if (!bots.length) return { changed: false, mapChanged: false };

  const start = game.botCursor % bots.length;
  for (let i = 0; i < bots.length; i += 1) {
    const index = (start + i) % bots.length;
    const playerId = bots[index];
    const player = game.players[playerId];
    const atWar = playerAtWar(playerId);
    if (!player || (!atWar && now - player.lastBotAction < BOT_TURN_INTERVAL_MS)) continue;
    player.lastBotAction = atWar ? now : now + randomInt(0, BOT_TURN_STAGGER_MS);
    game.botCursor = (index + 1) % bots.length;
    return runBotTurn(playerId);
  }

  return { changed: false, mapChanged: false };
}

function runBotTurn(playerId) {
  const player = game.players[playerId];
  if (!player || isDefeated(playerId) || hqRebuildExpired(playerId)) return { changed: false, mapChanged: false };

  // Анализ карты и оппонентов один раз за ход (кешируем на объекте игрока)
  player._mapAnalysis = botAnalyzeMap(playerId);

  if (botVassalSupport(playerId)) {
    return { changed: true, mapChanged: false };
  }

  // Приоритетная очередь: 1) стратегический удар 2) стрельба 3) экстренные ресурсы 4) строительство 5) найм 6) движение 7) дипломатия
  if (tryBotBetrayForVictory(playerId)) {
    return { changed: true, mapChanged: false };
  }

  if (tryBotNuke(playerId)) {
    return { changed: true, mapChanged: true };
  }

  if (tryAnarchistLootOperation(playerId)) {
    return { changed: true, mapChanged: false };
  }

  if (tryBotSaboteur(playerId)) {
    return { changed: true, mapChanged: true };
  }

  if (tryBotDrone(playerId)) {
    return { changed: true, mapChanged: true };
  }

  if (tryBotShoot(playerId)) {
    return { changed: true, mapChanged: true };
  }

  if (tryBotCruiserBlockade(playerId)) {
    return { changed: true, mapChanged: true };
  }

  // Если под прямой атакой — сбрасываем таймер движения для немедленной реакции
  // и автоматически объявляем войну атакующему (контратака)
  const underAttackNow = botIsUnderAttack(playerId);
  if (underAttackNow) {
    player.nextBotMove = 0;
    const attackers = new Set();
    forEachCell((cell) => {
      if (cell.owner !== playerId) return;
      for (const otherId of PLAYER_IDS) {
        if (otherId === playerId || relationStatus(playerId, otherId) === "war") continue;
        const units = cell.units?.[otherId];
        if (units && (unitPower(units) > 0 || (units.boat || 0) > 0 || (units.cruiser || 0) > 0)) {
          attackers.add(otherId);
        }
      }
    });
    for (const otherId of attackers) {
      const commanderId = player.vassalOf || playerId;
      if (relationStatus(commanderId, otherId) !== "war") {
        declareWar(commanderId, otherId);
        addSystemEvent(`${game.players[commanderId]?.country || player.country} объявляет войну в ответ на вторжение против ${player.country}.`, { sound: 'alert' });
      }
    }
  }

  if (underAttackNow) {
    if (tryBotMobilization(playerId)) return { changed: true, mapChanged: false };
    if (tryBotHire(playerId, { emergency: true })) return { changed: true, mapChanged: true };
    if (tryBotMove(playerId, { emergency: true })) return { changed: true, mapChanged: true };
  }

  if (tryBotClearFactoryStrike(playerId)) {
    return { changed: true, mapChanged: true };
  }

  if (canRebuildHq(playerId) && canPay(player, BUILDINGS.hq.cost)) {
    const hqCell = botBuildCell(playerId, "hq");
    if (hqCell) return { changed: buildBotBuilding(playerId, "hq", hqCell), mapChanged: true };
  }

  // §8 HQ потерян: режим выживания — просим ресурсы у союзников, только обороняемся
  if (player.hqLost) {
    const helpChanged = botRequestAllyHelp(playerId);
    if (tryBotMove(playerId)) return { changed: true, mapChanged: true };
    const dipChanged = runBotDiplomacy(playerId);
    return { changed: helpChanged || Boolean(dipChanged), mapChanged: false };
  }

  if (tryBotEmergencyResources(playerId)) {
    return { changed: true, mapChanged: true };
  }

  if (Math.random() < 0.006) {
    botSayPhrase(playerId, "idle");
  }

  if (tryBotBuild(playerId)) return { changed: true, mapChanged: true };
  if (tryBotMobilization(playerId)) return { changed: true, mapChanged: false };
  if (isBotRich(playerId) && tryBotMove(playerId)) return { changed: true, mapChanged: true };
  if (tryBotHire(playerId)) return { changed: true, mapChanged: true };
  if (tryBotMove(playerId)) return { changed: true, mapChanged: true };

  const diplomacyChanged = runBotDiplomacy(playerId);
  return { changed: Boolean(diplomacyChanged), mapChanged: false };
}

function tryAnarchistLootOperation(playerId) {
  if (playerId !== "anarchists") return false;
  const player = game.players[playerId];
  const definition = SPECIAL_OPS.anarchistLoot;
  const now = Date.now();
  if (!player || player.vassalOf || isDefeated(playerId) || !definition || now < (player.specialOpCooldown || 0)) return false;

  const targetId = PLAYER_IDS
    .filter((id) => id !== playerId && !isDefeated(id) && relationStatus(playerId, id) !== "alliance")
    .sort((a, b) => lootTargetScore(b) - lootTargetScore(a))[0];
  if (!targetId || lootTargetScore(targetId) <= 0) return false;

  player.specialOpCooldown = now + SPECIAL_OP_COOLDOWN_MS;
  const matchStartedAt = game.startedAt;
  const chance = clamp(definition.chance - counterIntelPenalty(targetId), 0.08, 0.9);
  const room = game;
  const timer = setTimeout(() => {
    if (games.get(room.id) !== room) return;
    withGame(room, () => {
      if (game.startedAt === matchStartedAt) resolveSpecialOp(playerId, targetId, "anarchistLoot", chance);
    });
  }, SPECIAL_OP_DELAY_MS);
  if (typeof timer.unref === "function") timer.unref();
  return true;
}

function botVassalSupport(playerId) {
  const player = game.players[playerId];
  const overlord = game.players[player?.vassalOf];
  const now = Date.now();
  if (!player?.isBot || !overlord || isDefeated(playerId) || isDefeated(player.vassalOf)) return false;
  if (now < (player.lastVassalSupport || 0) + 55_000) return false;
  if (!botShouldSendSupport(playerId, player.vassalOf) && !isBotRich(playerId)) return false;
  const resources = supportBundleFor(player, isBotRich(playerId) ? 4 : 2);
  if (resourceBundleEmpty(resources)) return false;
  player.lastVassalSupport = now;
  transferResourceBundle(player, overlord, resources);
  addSystemEvent(`${player.country} как вассал отправляет ресурсы ${overlord.country}: ${resourceBundleText(resources)}.`, { sound: resourceTransferSound(resources) });
  return true;
}

function tryBotMobilization(playerId) {
  const player = game.players[playerId];
  const now = Date.now();
  if (!player?.isBot) return false;
  if (!playerHasBuilding(playerId, "tck")) {
    if (player.mobilizationActive) {
      player.mobilizationActive = false;
      player.mobilizationStartedAt = 0;
      return true;
    }
    return false;
  }
  const counts = countBuildings(playerId);
  if ((counts.barracks || 0) < 1) return false;
  const stats = computeStats(playerId);
  const shouldMobilize = botIsUnderAttack(playerId) ||
    (isBotRich(playerId) && stats.inf < Math.max(4, stats.cells * 0.3) && (player.resources.pop || 0) >= 2);
  if (mobilizationActive(playerId, now)) {
    const enoughInf = stats.inf >= Math.max(5, stats.cells * 0.45);
    if (!shouldMobilize || enoughInf) {
      player.mobilizationActive = false;
      player.mobilizationStartedAt = 0;
      addSystemEvent(`${player.country} выключает мобилизацию через ТЦК.`, { sound: "diplomacy" });
      return true;
    }
    return false;
  }
  if (!shouldMobilize) return false;
  player.mobilizationActive = true;
  player.mobilizationStartedAt = now;
  addSystemEvent(`${player.country} включает мобилизацию через ТЦК.`, { sound: "diplomacy" });
  return true;
}

function lootTargetScore(playerId) {
  const player = game.players[playerId];
  if (!player) return 0;
  return (player.resources.gold || 0) + (player.resources.iron || 0) * 1.3 +
    (player.resources.ammo || 0) * 0.8 + (player.resources.uranium || 0) * 4;
}

// §8 HQ потерян: запрос ресурсов у союзников
function botRequestAllyHelp(playerId) {
  const player = game.players[playerId];
  if (!player || isDefeated(playerId)) return false;
  const now = Date.now();
  const cooldownKey = `hqHelp-${playerId}`;
  if ((player._lastHqHelpRequest || 0) + 60_000 > now) return false;
  player._lastHqHelpRequest = now;

  const allies = PLAYER_IDS.filter((id) => id !== playerId && !isDefeated(id) && relationStatus(playerId, id) === "alliance");
  for (const allyId of allies) {
    const ally = game.players[allyId];
    if (!ally) continue;
    // Просим то, чего не хватает
    const needAmmo = (player.resources.ammo || 0) < 10;
    const needGold = (player.resources.gold || 0) < 8;
    if (!needAmmo && !needGold) continue;

    if (ally.isBot) {
      // Бот-союзник: напрямую передаём без запроса
      const bundle = {};
      if (needAmmo && (ally.resources.ammo || 0) > 25) bundle.ammo = Math.min(10, ally.resources.ammo - 20);
      if (needGold && (ally.resources.gold || 0) > 20) bundle.gold = Math.min(8, ally.resources.gold - 15);
      if (!resourceBundleEmpty(bundle)) {
        transferResourceBundle(ally, player, bundle);
        addSystemEvent(`${ally.country} помогает ${player.country} в трудный момент: ${resourceBundleText(bundle)}.`, { sound: resourceTransferSound(bundle) });
        return true;
      }
    }
  }
  return false;
}

// §1.1 / §8 Экстренные ресурсы: патроны заканчиваются → завод; железо = 0 при нужде в технике → шахта
function tryBotEmergencyResources(playerId) {
  const player  = game.players[playerId];
  const analysis = player._mapAnalysis || botAnalyzeMap(playerId);
  const ammo    = player.resources.ammo || 0;
  const iron    = player.resources.iron || 0;
  const counts  = analysis.counts;

  // Доход патронов в секунду
  const ammoIncome = analysis.ammoIncome;
  // Critical ammo: build an emergency factory or ask allies before movement stalls.
  const factoryLimit = BOT_FACTORY_LIMITS[player.personality] || 1;
  const wantsFactory = (counts.factory || 0) < factoryLimit;
  const turnsToEmpty = ammoIncome > 0 ? ammo / ammoIncome : (ammo > 0 ? 9999 : 0);
  const criticalAmmo = ammo <= 5 || turnsToEmpty < 60;
  const noAmmoIncome = ammoIncome <= 0;
  if (wantsFactory && (criticalAmmo || ((player.personality === "aggressive" || player.personality === "industrial") && noAmmoIncome))) {
    if (canPay(player, BUILDINGS.factory.cost)) {
      const cell = botBuildCell(playerId, "factory");
      if (cell) return buildBotBuilding(playerId, "factory", cell);
    }
    if (botRequestEmergencyAid(playerId, criticalAmmo)) return true;
  }

  // §8 Железо = 0, нужна техника → строим шахту железа
  const needsIron = (player.personality === 'aggressive' || player.personality === 'industrial') &&
    iron <= 0 && (counts.factory || 0) > 0;
  if (needsIron && canPay(player, BUILDINGS.mine.cost)) {
    const mine = botMineTarget(playerId, ["iron"]);
    if (mine && mine.terrain === 'iron') return buildBotBuilding(playerId, 'mine', mine);
  }

  return false;
}

function botRequestEmergencyAid(playerId, criticalAmmo) {
  const player = game.players[playerId];
  if (!player || isDefeated(playerId)) return false;
  const now = Date.now();
  if ((player._lastEmergencyAidRequest || 0) + 30_000 > now) return false;

  const allies = PLAYER_IDS.filter((id) => id !== playerId && !isDefeated(id) && relationStatus(playerId, id) === "alliance");
  for (const allyId of allies) {
    const ally = game.players[allyId];
    if (!ally?.isBot) continue;

    const bundle = {};
    if (criticalAmmo && (ally.resources.ammo || 0) > 28) {
      bundle.ammo = Math.min(12, Math.floor((ally.resources.ammo || 0) - 22));
    }

    const factoryShortage = Math.max(0, BUILDINGS.factory.cost.gold - (player.resources.gold || 0));
    if (factoryShortage > 0 && factoryShortage <= 12 && (ally.resources.gold || 0) > 35) {
      bundle.gold = Math.min(factoryShortage, Math.floor((ally.resources.gold || 0) - 25));
    }

    if (resourceBundleEmpty(bundle)) continue;
    player._lastEmergencyAidRequest = now;
    transferResourceBundle(ally, player, bundle);
    addSystemEvent(`${ally.country} sends emergency aid to ${player.country}: ${resourceBundleText(bundle)}.`, { sound: resourceTransferSound(bundle) });
    return true;
  }

  player._lastEmergencyAidRequest = now;
  return false;
}

function tryBotBetrayForVictory(playerId) {
  const player = game.players[playerId];
  if (!player?.isBot || player.vassalOf || isDefeated(playerId)) return false;
  if (player.personality !== "aggressive" && player.personality !== "industrial") return false;
  if (!isBotRich(playerId)) return false;

  const now = Date.now();
  if ((player.lastBetrayal || 0) + 90_000 > now) return false;
  if (game.startedAt && now - game.startedAt < 240_000) return false;

  const myStats = computeStats(playerId);
  const activeRivals = PLAYER_IDS.filter((id) => id !== playerId && !isDefeated(id) && computeStats(id).cells > 0);
  const noRealEnemies = !activeRivals.some((id) => relationStatus(playerId, id) === "war");
  const totalCells = activeRivals.reduce((sum, id) => sum + computeStats(id).cells, myStats.cells);
  const closeToWin = myStats.cells >= Math.max(32, totalCells * 0.42) || myStats.power >= 14;
  if (!noRealEnemies && !closeToWin) return false;

  const target = activeRivals
    .filter((id) => relationStatus(playerId, id) === "alliance")
    .map((id) => ({ id, stats: computeStats(id), border: hasBorderContact(playerId, id) }))
    .filter((item) => item.border || noRealEnemies)
    .filter((item) => myStats.power >= Math.max(4, item.stats.power * 0.9) || myStats.cells > item.stats.cells * 1.25)
    .sort((a, b) => a.stats.power - b.stats.power || a.stats.cells - b.stats.cells)[0];

  if (!target) return false;
  player.lastBetrayal = now;
  declareWar(playerId, target.id);
  game.diplomacyCooldowns[pairKey(playerId, target.id)] = now;
  addSystemEvent(`${player.country} разрывает союз с ${game.players[target.id].country} ради победы.`, { sound: "alert" });
  return true;
}

function runBotDiplomacy(playerId) {
  const player = game.players[playerId];
  if (!player || player.vassalOf || isDefeated(playerId)) return false;
  const now = Date.now();
  const waitMap = { aggressive: 40_000, passive: 65_000, industrial: 50_000, fisher: 70_000 };
  const wait = waitMap[player.personality] || 70_000;
  if (now - player.lastDiplomacy < wait) return false;
  player.lastDiplomacy = now + randomInt(0, 20_000);

  const pool = [
    ...HUMAN_IDS.filter(id => game.players[id]?.joined && !isDefeated(id)),
    ...activeBotIds().filter(id => id !== playerId && !isDefeated(id))
  ].filter((id) => !game.players[id]?.vassalOf);
  if (!pool.length) return false;

  const myStats = computeStats(playerId);
  const candidates = pool
    .map((id) => ({
      id,
      relation: relationStatus(playerId, id),
      stats: computeStats(id),
      pairCooldown: now - (game.diplomacyCooldowns[pairKey(playerId, id)] || 0),
      border: hasBorderContact(playerId, id)
    }))
    .filter((candidate) => candidate.pairCooldown >= 90_000);
  if (!candidates.length) return false;

  // §6.2 Союз предлагается по состоянию, война объявляется по чётким условиям
  switch (player.personality) {
    case "passive":
    case "fisher": {
      // Союз: есть общий враг, или мы слабее 70%, или нейтральный сосед сильнее нас
      const allyTarget = candidates.find((c) =>
        c.relation !== "alliance" && c.relation !== "war" && (
          hasCommonEnemy(playerId, c.id) ||
          (myStats.power < c.stats.power * 0.7) ||
          (c.relation === "neutral" && c.border && c.stats.power > myStats.power * 0.8)
        )
      );
      // Мир: если воюем и сила < 50% врага
      const peaceTarget = candidates.find((c) =>
        c.relation === "war" && myStats.power < c.stats.power * 0.5
      );
      const target = peaceTarget || allyTarget;
      if (!target) return false;
      offerAlliance(playerId, target.id);
      game.diplomacyCooldowns[pairKey(playerId, target.id)] = now;
      return true;
    }
    case "aggressive": {
      if (game.startedAt && now - game.startedAt < 150_000) return false;
      // Война: наша сила > 120% цели И есть граница (было 150%)
      const warTarget = candidates
        .filter((c) => c.relation !== "war" && c.border && myStats.power > c.stats.power * 1.2)
        .sort((a, b) => a.stats.power - b.stats.power)[0];
      if (warTarget) {
        if (botShouldUseUltimatum(playerId, warTarget.id)) issueUltimatum(playerId, warTarget.id);
        else declareWar(playerId, warTarget.id);
        game.diplomacyCooldowns[pairKey(playerId, warTarget.id)] = now;
        return true;
      }
      // Союз только если проигрываем (сила < 60% врага)
      const allyTarget = candidates.find((c) =>
        c.relation !== "alliance" && c.relation !== "war" &&
        myStats.power < c.stats.power * 0.6 && hasCommonEnemy(playerId, c.id)
      );
      if (!allyTarget) return false;
      offerAlliance(playerId, allyTarget.id);
      game.diplomacyCooldowns[pairKey(playerId, allyTarget.id)] = now;
      return true;
    }
    case "industrial": {
      const counts = countBuildings(playerId);
      // Война: сила > 110% И граница И есть завод (было 125%)
      const warTarget = candidates
        .filter((c) =>
          c.relation !== "war" && c.border &&
          myStats.power > c.stats.power * 1.1 &&
          (counts.factory || 0) >= 1
        )
        .sort((a, b) => a.stats.power - b.stats.power)[0];
      if (warTarget) {
        if (botShouldUseUltimatum(playerId, warTarget.id)) issueUltimatum(playerId, warTarget.id);
        else declareWar(playerId, warTarget.id);
        game.diplomacyCooldowns[pairKey(playerId, warTarget.id)] = now;
        return true;
      }
      // Союз с сильными соседями
      const allyTarget = candidates
        .filter((c) => c.relation === "neutral" && (hasCommonEnemy(playerId, c.id) || c.stats.power > myStats.power))
        .sort((a, b) => b.stats.power - a.stats.power)[0];
      if (!allyTarget) return false;
      offerAlliance(playerId, allyTarget.id);
      game.diplomacyCooldowns[pairKey(playerId, allyTarget.id)] = now;
      return true;
    }
  }
  return false;
}

function hasBorderContact(a, b) {
  let contact = false;
  forEachCell((cell) => {
    if (contact || cell.owner !== a) return;
    contact = neighbors(cell.x, cell.y).some(([x, y]) => getCell(x, y)?.owner === b);
  });
  return contact;
}

function hasCommonEnemy(a, b) {
  const aEnemies = new Set(hostilePlayerIds(a));
  return hostilePlayerIds(b).some((id) => aEnemies.has(id));
}

function botShouldUseUltimatum(fromId, toId) {
  const actor = game.players[fromId];
  const target = game.players[toId];
  if (!actor?.isBot || actor.vassalOf || !target || target.vassalOf) return false;
  if (relationStatus(fromId, toId) === "war" || relationStatus(fromId, toId) === "alliance") return false;
  const fromStats = computeStats(fromId);
  const targetStats = computeStats(toId);
  if (target.hqLost || target.hqDestroyed) return true;
  return fromStats.power >= targetStats.power * 2 + 5 && fromStats.cells >= targetStats.cells * 1.2;
}

// ─── Map / opponent analysis — вычисляется один раз за ход бота ─────────────
function botAnalyzeMap(playerId) {
  const player = game.players[playerId];
  const eventType = game.activeEvent?.type || "";
  if (player?._mapAnalysis &&
      player._mapAnalysisVersion === game.mapVersion &&
      player._mapAnalysisEvent === eventType) {
    return player._mapAnalysis;
  }
  const hqCell  = findHqCell(playerId);
  const counts  = countBuildings(playerId);

  // Клетки с ресурсами, которые ещё не захвачены нами
  const uncapturedResources = allCells(game.map).filter(c =>
    ['gold', 'iron', 'uranium'].includes(c.terrain) && c.owner !== playerId
  );

  // Наши клетки с ресурсами, где ещё нет шахты
  const unmined = allCells(game.map).filter(c =>
    c.owner === playerId && ['gold', 'iron', 'uranium'].includes(c.terrain) && !c.building
  );

  // Фронтовые клетки: соседствуют с чужой/пустой проходимой землёй
  const frontierCells = allCells(game.map).filter(c =>
    c.owner === playerId &&
    neighbors(c.x, c.y).some(([nx, ny]) => {
      const nc = getCell(nx, ny);
      return nc && nc.terrain !== 'water' && nc.owner !== playerId;
    })
  );

  // Средняя пехота на фронтовых клетках (анализ по клеткам, а не суммарный)
  const avgFrontierInf = frontierCells.length
    ? frontierCells.reduce((s, c) => s + (unitsFor(c, playerId).inf || 0), 0) / frontierCells.length
    : 0;

  // Доход боеприпасов и золота в секунду (приближённо)
  const income = botIncomeProfile(playerId);
  const ammoIncome = income.ammo;
  const goldIncome = income.gold;

  // Ближайший незахваченный ресурс от HQ
  let nearestResource = null;
  if (hqCell && uncapturedResources.length) {
    nearestResource = uncapturedResources.slice().sort((a, b) =>
      (Math.abs(a.x - hqCell.x) + Math.abs(a.y - hqCell.y)) -
      (Math.abs(b.x - hqCell.x) + Math.abs(b.y - hqCell.y))
    )[0];
  }

  // Ближайшая незанятая клетка, прилегающая к воде (для рыбаков)
  let nearestWaterFrontier = null;
  if (hqCell) {
    let minDist = Infinity;
    forEachCell(c => {
      if (c.owner === playerId || !isPassable(c) || c.terrain === 'water') return;
      if (!hasAdjacentWater(c.x, c.y)) return;
      const d = Math.abs(c.x - hqCell.x) + Math.abs(c.y - hqCell.y);
      if (d < minDist) { minDist = d; nearestWaterFrontier = c; }
    });
  }

  // Статистика оппонентов
  const opponentStats = {};
  for (const id of PLAYER_IDS) {
    if (id !== playerId) opponentStats[id] = computeStats(id);
  }

  // Главная угроза: враг с наибольшим пограничным контактом
  let biggestThreat = null;
  let maxContact = 0;
  for (const id of PLAYER_IDS) {
    if (id === playerId || !isHostile(playerId, id)) continue;
    let contact = 0;
    forEachCell(c => {
      if (c.owner !== id) return;
      if (neighbors(c.x, c.y).some(([nx, ny]) => getCell(nx, ny)?.owner === playerId)) contact++;
    });
    if (contact > maxContact) { maxContact = contact; biggestThreat = id; }
  }

  const analysis = {
    hqCell, counts, uncapturedResources, unmined, frontierCells,
    avgFrontierInf, ammoIncome, goldIncome, income, nearestResource,
    nearestWaterFrontier, opponentStats, biggestThreat
  };
  if (player) {
    player._mapAnalysis = analysis;
    player._mapAnalysisVersion = game.mapVersion;
    player._mapAnalysisEvent = eventType;
  }
  return analysis;
}

function botIncomeProfile(playerId) {
  const player = game.players[playerId];
  const multiplier = (player?.hqLost ? 0.5 : 1) * (player?.isBot ? BOT_ECONOMY_MULTIPLIER : 1);
  const income = { gold: 0, iron: 0, pop: 0, ammo: 0, uranium: 0 };

  forEachCell((cell) => {
    const building = cell.building;
    if (!building || building.owner !== playerId) return;
    const cfg = incomeConfigFor(cell);
    if (!cfg || !Object.prototype.hasOwnProperty.call(income, cfg.resource)) return;
    if (building.type === "port" && portBlockader(playerId, cell)) return;
    income[cfg.resource] += incomeAmountFor(player, cell, cfg) * multiplier / (incomeIntervalFor(playerId, cell, cfg) / 1000);
  });

  return income;
}

function incomeIntervalFor(playerId, cell, cfg, now = Date.now()) {
  let interval = cfg.interval;
  if (cell?.building?.type === "barracks" && mobilizationActive(playerId, now)) {
    interval *= 0.5;
  }
  const multiplier = lobbyIncomeMultiplier(cell);
  return multiplier > 0 ? Math.max(1_000, interval / multiplier) : Number.MAX_SAFE_INTEGER;
}

function incomeConfigFor(cell) {
  const building = cell?.building;
  if (!building) return null;
  if (building.type === "mine") return MINE_INCOME[cell.terrain] || null;
  if (building.type === "minePlus") {
    return cell.terrain === "gold"
      ? { ...MINE_INCOME.gold, amount: MINE_INCOME.gold.amount * 2 }
      : null;
  }
  return BUILDING_INCOME[building.type] || null;
}

function incomeAmountFor(player, cell, cfg) {
  const ideology = IDEOLOGIES[player?.ideology] || {};
  let amount = cfg.amount * lobbyIncomeMultiplier(cell);
  if (cfg.resource === "gold" && ideology.goldIncome) amount *= ideology.goldIncome;
  if (cfg.resource === "pop" && ideology.popIncome) amount *= ideology.popIncome;
  if (cfg.resource === "ammo" && ideology.ammoIncome) amount *= ideology.ammoIncome;
  if (cfg.resource === "iron" && ideology.ironIncome) amount *= ideology.ironIncome;
  if (cfg.resource === "gold" && cell?.terrain === "gold" && activeEventType("goldRush")) amount *= 1.5;
  return amount;
}

function lobbyIncomeMultiplier(cell) {
  const key = lobbyIncomeKey(cell);
  return game.settings?.incomeMultipliers?.[key] ?? 1;
}

function lobbyIncomeKey(cell) {
  const type = cell?.building?.type;
  if (type === "mine") {
    if (cell.terrain === "gold") return "mineGold";
    if (cell.terrain === "iron") return "mineIron";
    if (cell.terrain === "uranium") return "mineUranium";
  }
  if (type === "minePlus") return "minePlusGold";
  return type || "";
}

function activeEventType(type) {
  return game.activeEvent?.type === type && Date.now() < (game.activeEvent.endsAt || 0);
}

function clearFactoryStrikeIfGuarded(cell, playerId) {
  if (cell?.building?.type !== "factory" || cell.building.owner !== playerId) return false;
  if (!cell.building.strikeUntil || (unitsFor(cell, playerId).inf || 0) <= 0) return false;
  cell.building.strikeUntil = 0;
  return true;
}

function movementAmmoCost(base, playerId = null, fromCell = null) {
  let cost = base;
  if (activeEventType("rain")) cost *= 2;
  if (playerId && fromCell && base > 0 && !hasSettlementSupport(playerId, fromCell, 3)) {
    cost *= 2;
  }
  return cost;
}

function hasSettlementSupport(playerId, fromCell, radius = 3) {
  let supported = false;
  forEachCell((cell) => {
    if (supported) return;
    if (!controlsOwner(playerId, cell.owner)) return;
    if (!["village", "city"].includes(cell.building?.type)) return;
    if (distance(fromCell, cell) <= radius) supported = true;
  });
  return supported;
}

function updateRandomEvents(now = Date.now()) {
  let changed = false;
  let mapChanged = false;

  if (game.pendingEvent && now >= game.pendingEvent.startsAt) {
    const event = game.pendingEvent;
    game.pendingEvent = null;
    game.activeEvent = {
      type: event.type,
      label: event.label,
      startedAt: now,
      endsAt: now + (RANDOM_EVENTS[event.type]?.duration || 60_000)
    };
    addSystemEvent(`${event.label} началось.`, { sound: event.type === "rain" ? "rain" : "alert" });
    changed = true;
    mapChanged = true;
  }

  if (game.activeEvent?.type === "epidemic") {
    const epidemicResult = updateEpidemic(now);
    changed = epidemicResult.changed || changed;
    mapChanged = epidemicResult.mapChanged || mapChanged;
    if (game.activeEvent?.type === "epidemic" && epidemicFullyContained()) {
      addSystemEvent("Эпидемия остановлена: все живые страны развернули больницы.", { sound: "diplomacy" });
      game.activeEvent = null;
      changed = true;
      mapChanged = true;
    }
  }

  if (game.activeEvent && now >= game.activeEvent.endsAt) {
    addSystemEvent(`${game.activeEvent.label} закончилось.`, { sound: "diplomacy" });
    game.activeEvent = null;
    changed = true;
    mapChanged = true;
  }

  if (game.settings?.randomEvents !== false && !game.pendingEvent && !game.activeEvent && game.nextRandomEventAt && now >= game.nextRandomEventAt) {
    game.nextRandomEventAt = now + RANDOM_EVENT_INTERVAL_MS;
    if (Math.random() < RANDOM_EVENT_CHANCE) {
      const type = randomChoice(Object.keys(RANDOM_EVENTS));
      const definition = RANDOM_EVENTS[type];
      game.pendingEvent = {
        type,
        label: definition.label,
        startsAt: now + RANDOM_EVENT_WARNING_MS
      };
      addSystemEvent(`Внимание: приближается ${definition.label}. Осталось ${Math.ceil(RANDOM_EVENT_WARNING_MS / 1000)} секунд.`, { sound: "alert" });
      changed = true;
      mapChanged = true;
    }
  } else if (game.settings?.randomEvents === false && game.nextRandomEventAt) {
    game.nextRandomEventAt = 0;
  }

  return { changed, mapChanged };
}

function updateConstructions(now = Date.now()) {
  let changed = false;
  let mapChanged = false;

  forEachCell((cell) => {
    const construction = cell.construction;
    if (!construction || now < (construction.completesAt || 0)) return;

    const completed = completeConstruction(cell, construction);
    cell.construction = null;
    changed = true;
    mapChanged = true;
    if (!completed) {
      emitReport(cell.x, cell.y, "Стройка отменена", "loss");
    }
  });

  return { changed, mapChanged };
}

function updateEwInterceptions() {
  let changed = false;
  const lossSnapshot = armyGoldSnapshot();
  forEachCell((cell) => {
    for (const playerId of PLAYER_IDS) {
      if ((unitsFor(cell, playerId).ew || 0) <= 0) continue;
      if (interceptHostileDronesNearEw(playerId, cell)) {
        changed = true;
      }
    }
  });
  if (changed) applyArmyLossEffects(lossSnapshot, null);
  return changed;
}

function updateAirDefenseInterceptions() {
  let changed = false;
  const lossSnapshot = armyGoldSnapshot();
  const now = Date.now();
  forEachCell((cell) => {
    for (const playerId of PLAYER_IDS) {
      const units = unitsFor(cell, playerId);
      if ((units.aa || 0) <= 0 && (units.aaPlus || 0) <= 0) continue;
      if (airDefenseSabotaged(cell, playerId, now)) continue;
      if (interceptHostileShahedsNearAirDefense(playerId, cell)) {
        changed = true;
      }
    }
  });
  if (changed) applyArmyLossEffects(lossSnapshot, null);
  return changed;
}

function completeConstruction(cell, construction) {
  const playerId = construction.owner;
  const player = game.players[playerId];
  if (!player || isDefeated(playerId)) return false;

  if (construction.type === "building") {
    if (cell.building) return false;
    const validation = validateBuild(playerId, construction.kind, cell, { ignoreConstruction: true });
    if (!validation.ok) return false;

    if (construction.kind === "bridge" && cell.terrain === "water") {
      cell.owner = playerId;
    }
    if (construction.kind === "hq") {
      cell.owner = playerId;
    }
    cell.building = construction.kind === "hq"
      ? { type: "hq", owner: playerId, originalOwner: playerId, lastIncome: Date.now() }
      : { type: construction.kind, owner: playerId, lastIncome: Date.now() };
    if (construction.kind === "hq") {
      player.hqDestroyed = false;
      player.hqDestroyedAt = 0;
      player.hqLost = false;
      addSystemEvent(`${player.country} восстанавливает штаб.`);
    }
    emitReport(cell.x, cell.y, `${construction.label || BUILDINGS[construction.kind]?.label || "Постройка"} построен`, "build");
    return true;
  }

  if (construction.type === "unit") {
    const definition = UNITS[construction.kind];
    if (!definition || !canCompleteStaticDeploy(playerId, construction.kind, cell)) return false;
    unitsFor(cell, playerId)[construction.kind] += 1;
    emitSfx("hire", cell.x, cell.y, { unit: construction.kind, playerId });
    if (construction.kind === "ew") {
      interceptHostileDronesNearEw(playerId, cell);
    }
    return true;
  }

  return false;
}

function canCompleteStaticDeploy(playerId, kind, cell) {
  if (!STATIC_DEPLOY_UNITS.has(kind) || !cell || !controlsCell(playerId, cell) || !isPassable(cell)) return false;
  const definition = UNITS[kind];
  const ownUnits = unitsFor(cell, playerId);
  return Boolean(definition?.stack || ownUnits[kind] <= 0);
}

function updateEpidemic(now = Date.now()) {
  const event = game.activeEvent;
  if (!event || event.type !== "epidemic") return { changed: false, mapChanged: false };
  if (!event.nextTickAt) {
    event.nextTickAt = now + EPIDEMIC_TICK_MS;
    return { changed: true, mapChanged: false };
  }
  if (now < event.nextTickAt) return { changed: false, mapChanged: false };
  event.nextTickAt = now + EPIDEMIC_TICK_MS;

  let changed = false;
  let mapChanged = false;
  const skulls = [];
  for (const playerId of PLAYER_IDS) {
    const player = game.players[playerId];
    if (!player || isDefeated(playerId) || epidemicProtected(playerId)) continue;
    if ((player.resources.pop || 0) > 0) {
      player.resources.pop = Math.max(0, round1((player.resources.pop || 0) - 1));
      const marker = epidemicMarkerCell(playerId);
      if (marker) skulls.push({ x: marker.x, y: marker.y, kind: "epidemic" });
      changed = true;
    }

    const stats = computeStats(playerId);
    const infantryCells = shuffle(allCells(game.map).filter((cell) => {
      const units = unitsFor(cell, playerId);
      return (units.inf || 0) > 0 || (units.rpg || 0) > 0;
    }));
    const losses = Math.min(infantryCells.length, stats.inf + stats.rpg >= 12 ? 2 : 1);
    for (let index = 0; index < losses; index += 1) {
      const cell = infantryCells[index];
      const units = unitsFor(cell, playerId);
      if ((units.rpg || 0) > 0 && ((units.inf || 0) <= 0 || Math.random() < 0.35)) {
        units.rpg = Math.max(0, units.rpg - 1);
        pruneWeaponCooldowns(cell);
      } else {
        units.inf = Math.max(0, units.inf - 1);
      }
      skulls.push({ x: cell.x, y: cell.y, kind: "epidemic" });
      changed = true;
      mapChanged = true;
    }
  }

  if (skulls.length) emitExplosions(skulls.slice(0, 24));
  if (mapChanged) touchMap();
  return { changed, mapChanged };
}

function epidemicProtected(playerId) {
  return (countBuildings(playerId).hospital || 0) >= EPIDEMIC_HOSPITALS_REQUIRED;
}

function epidemicFullyContained() {
  const activePlayers = PLAYER_IDS.filter((id) => {
    const player = game.players[id];
    return player && !isDefeated(id) && computeStats(id).cells > 0;
  });
  return activePlayers.length > 0 && activePlayers.every((id) => epidemicProtected(id));
}

function epidemicMarkerCell(playerId) {
  const priority = allCells(game.map).filter((cell) =>
    cell.owner === playerId && ["city", "village", "hq", "hospital"].includes(cell.building?.type));
  return shuffle(priority)[0] || shuffle(allCells(game.map).filter((cell) => cell.owner === playerId))[0] || null;
}

function forceRandomEvent(type, now = Date.now()) {
  const definition = RANDOM_EVENTS[type];
  if (!definition) return false;
  game.pendingEvent = null;
  game.activeEvent = {
    type,
    label: definition.label,
    startedAt: now,
    endsAt: now + definition.duration
  };
  game.nextRandomEventAt = now + RANDOM_EVENT_INTERVAL_MS;
  return true;
}

function tryBotBuild(playerId) {
  const player = game.players[playerId];
  if (!player || isDefeated(playerId)) return false;
  const counts = player._mapAnalysis?.counts || countBuildings(playerId);

  if (activeEventType("epidemic") && (counts.hospital || 0) < EPIDEMIC_HOSPITALS_REQUIRED && canPay(player, BUILDINGS.hospital.cost)) {
    const hospitalCell = botBuildCell(playerId, "hospital");
    if (hospitalCell) return buildBotBuilding(playerId, "hospital", hospitalCell);
  }

  // §7 Nuclear rush: механики и анархисты при флаге копят ресурсы, не тратят на постройки
  if (player.nuclearRush) {
    if ((counts.nuclearPlant || 0) < 1 && canPay(player, BUILDINGS.nuclearPlant.cost)) {
      const plantCell = botBuildCell(playerId, "nuclearPlant");
      if (plantCell) return buildBotBuilding(playerId, "nuclearPlant", plantCell);
    }

    const mine = botMineTarget(playerId, ["uranium", "gold", "iron"]);
    if (mine && canPay(player, BUILDINGS.mine.cost)) {
      return buildBotBuilding(playerId, "mine", mine);
    }
    return false;
  }

  if ((counts.nuclearPlant || 0) < 1 && botShouldPrepareNuke(playerId) && canPay(player, BUILDINGS.nuclearPlant.cost)) {
    const plantCell = botBuildCell(playerId, "nuclearPlant");
    if (plantCell) return buildBotBuilding(playerId, "nuclearPlant", plantCell);
  }

  const minePlus = botMinePlusTarget(playerId);
  if (minePlus && (counts.mine || 0) >= 1 && canPay(player, BUILDINGS.minePlus.cost)) {
    return buildBotBuilding(playerId, "minePlus", minePlus);
  }

  const mine = botMineTarget(playerId);
  if (mine && canPay(player, BUILDINGS.mine.cost)) {
    return buildBotBuilding(playerId, "mine", mine);
  }

  // §2.3 Мост: только под конкретную цель; лимит не дает застроить всю реку.
  const bridgeCounts = player._mapAnalysis?.counts || countBuildings(playerId);
  const attackBridge = botBridgeAttackTarget(playerId);
  const bridgeLimit = BOT_BRIDGE_LIMITS[player.personality] ?? 1;
  const bridgeCount = bridgeCounts.bridge || 0;
  const expansionBridge = bridgeCount < bridgeLimit ? botExpansionBridgeTarget(playerId) : null;
  const bridgeAllowed = bridgeCount < bridgeLimit && (
    Boolean(attackBridge) ||
    Boolean(expansionBridge)
  );
  if (bridgeAllowed &&
      (player.resources.gold || 0) >= BUILDINGS.bridge.cost.gold + 8 &&
      canPay(player, BUILDINGS.bridge.cost)) {
    const bridgeCell = attackBridge || expansionBridge;
    if (bridgeCell) {
      return buildBotBuilding(playerId, "bridge", bridgeCell);
    }
  }

  const priorities = botBuildPriorities(playerId);

  for (const kind of priorities) {
    const definition = BUILDINGS[kind];
    if (kind === "bridge" && bridgeCount >= bridgeLimit) continue;
    if (!definition || !canPay(player, definition.cost)) continue;
    const cell = botBuildCell(playerId, kind);
    if (!cell) continue;
    return buildBotBuilding(playerId, kind, cell);
  }
  return false;
}

function botShouldPrepareNuke(playerId) {
  const player = game.players[playerId];
  if (player.personality !== "industrial" && player.personality !== "aggressive") return false;
  if ((player.resources.uranium || 0) < 12) return false;
  if ((player.resources.iron || 0) < 24) return false;
  return (player.resources.gold || 0) >= BUILDINGS.nuclearPlant.cost.gold + 20;
}

function isBotRich(playerId) {
  const player = game.players[playerId];
  if (!player) return false;
  return (player.resources.gold || 0) >= 160 ||
    ((player.resources.gold || 0) >= 80 && (player.resources.iron || 0) >= 40 && (player.resources.ammo || 0) >= 60);
}

function buildBotBuilding(playerId, kind, cell) {
  const player = game.players[playerId];
  const definition = BUILDINGS[kind];
  if (!player || !definition || !cell || cell.building) return false;
  if (!canPay(player, definition.cost)) return false;
  if (!validateBuild(playerId, kind, cell).ok) return false;

  spend(player, definition.cost);
  startConstruction(cell, {
    type: "building",
    kind,
    owner: playerId,
    label: definition.label
  });
  touchMap();
  emitReport(cell.x, cell.y, `${definition.label} строится`, "build");

  // §8 Враг построил завод — ботам с ракетой рядом сигнал для атаки (планируется в следующем тике)
  if (kind === "factory") {
    for (const botId of activeBotIds()) {
      if (botId === playerId) continue;
      if (!isHostile(botId, playerId)) continue;
      if (game.players[botId]) game.players[botId].lastBotAction = 0; // форсируем скорейший следующий тик
    }
  }

  return true;
}

function botBuildPriorities(playerId) {
  const player = game.players[playerId];
  const analysis = player._mapAnalysis || botAnalyzeMap(playerId);
  const counts = analysis.counts;
  const res = player.resources;

  const hasMine    = (counts.mine    || 0) >= 1;
  const hasFarm    = (counts.farm    || 0) >= 1;
  const hasFactory = (counts.factory || 0) >= 1;
  const gold       = res.gold || 0;
  const rich = isBotRich(playerId);
  const unminedCount = analysis.unmined?.length || 0;

  if (unminedCount > 0) return ["mine"];

  if (player.personality === "passive") {
    const priority = [];
    const add = (kind) => {
      if (kind === "farm" && activeEventType("drought")) return;
      if (!priority.includes(kind)) priority.push(kind);
    };
    if (activeEventType("epidemic") && (counts.hospital || 0) < EPIDEMIC_HOSPITALS_REQUIRED) add("hospital");
    if ((counts.farm || 0) < 6) add("farm");
    if ((counts.village || 0) < 2) add("village");
    if ((counts.city || 0) < 1 && (res.gold || 0) >= BUILDINGS.city.cost.gold) add("city");
    if ((counts.barracks || 0) < 1) add("barracks");
    if ((counts.tck || 0) < 1 && (counts.barracks || 0) > 0 && rich) add("tck");
    if ((counts.counterIntel || 0) < 1 && rich) add("counterIntel");
    if ((counts.mine || 0) < 2) add("mine");
    if ((counts.factory || 0) > 0 && (counts.ammoDepot || 0) < 1) add("ammoDepot");
    if (rich && (counts.factory || 0) < 1) add("factory");
    if (rich && (counts.city || 0) < 3) add("city");
    if (rich && (counts.hospital || 0) < 1) add("hospital");
    return priority;
  }

  // Шаг 1: нет завода → копим 30 золота и строим завод
  // Исключение: можно поставить ферму, если останется золото на завод (30+5=35)
  if (!hasFactory && !rich) {
    if (gold >= BUILDINGS.factory.cost.gold) return ['factory'];
    if (!activeEventType("drought") && !hasFarm && gold >= BUILDINGS.factory.cost.gold + BUILDINGS.farm.cost.gold) return ['farm'];
    return []; // копим на завод
  }

  // Шаг 2: есть завод, нет шахты → ставим ферму для дохода; шахта строится через botMineTarget
  if (!hasMine && !rich) {
    if (!activeEventType("drought") && !hasFarm) return ['farm'];
    return []; // ждём захвата ресурсной клетки движением
  }
  // ─── Конец начальных фаз, дальше обычные приоритеты ──────────────────────

  const min = BOT_MINIMUMS[player.personality] || BOT_MINIMUMS.passive;
  const requiredBarracks = player.personality === "aggressive" && (counts.factory || 0) < 1
    ? 1
    : (min.barracks || 0);
  const priority = [];
  const add = (kind) => {
    if (kind === "farm" && activeEventType("drought")) return;
    if (!priority.includes(kind)) priority.push(kind);
  };
  const needsAmmoDepot = (counts.factory || 0) > 0 &&
    (counts.ammoDepot || 0) < Math.max(1, Math.ceil((counts.factory || 0) / 2)) &&
    ((res.ammo || 0) >= ammoCapacity(playerId) - 8 || rich);
  const needsBunker = botIsUnderAttack(playerId) && (counts.bunker || 0) < 2;
  const needsHospital = activeEventType("epidemic") && (counts.hospital || 0) < EPIDEMIC_HOSPITALS_REQUIRED;
  const needsTck = (counts.barracks || 0) > 0 && (counts.tck || 0) < 1 && (rich || botIsUnderAttack(playerId));
  const needsCounterIntel = (counts.counterIntel || 0) < (rich ? 2 : 1) && (rich || (counts.factory || 0) > 1);

  if (player.personality === "fisher") {
    const needVillage = (res.pop || 0) < 2 || (counts.village || 0) < 1;
    if (needsHospital) add("hospital");
    if ((counts.port || 0) < (min.port || 0)) add("port");
    if ((counts.farm || 0) < (min.farm || 0) && analysis.goldIncome < 0.12) add("farm");
    if (needVillage) add("village");
    if ((counts.barracks || 0) < (min.barracks || 0)) add("barracks");
    if (needsTck) add("tck");
    if (needsBunker) add("bunker");
    if (needsCounterIntel) add("counterIntel");
    if ((res.gold || 0) >= BUILDINGS.bridge.cost.gold + 8) add("bridge");
    if ((res.ammo || 0) <= 2 && (counts.factory || 0) < 1) add("factory");
    if (needsAmmoDepot) add("ammoDepot");
    return priority;
  }

  const strategicFactory = player.personality === "aggressive" || player.personality === "industrial";
  const missingFactory = strategicFactory && (counts.factory || 0) < (min.factory || 0);
  const factoryShortage = BUILDINGS.factory.cost.gold - (res.gold || 0);

  if ((counts.farm || 0) < (min.farm || 0) && analysis.goldIncome < 0.08) add("farm");
  if (needsHospital) add("hospital");
  const needVillage = (res.pop || 0) < 2 ||
    ((player.personality === "passive" || player.personality === "fisher") && (counts.village || 0) < 1);
  if (needVillage) add("village");
  if ((counts.port || 0) < (min.port || 0)) add("port");
  if ((counts.barracks || 0) < requiredBarracks) add("barracks");
  if (needsTck) add("tck");

  if (missingFactory) {
    add("factory");
    const factoryBasicsReady = (counts.farm || 0) >= (min.farm || 0) &&
      (counts.barracks || 0) >= requiredBarracks;
    if (factoryBasicsReady && factoryShortage > 0 && factoryShortage <= 25 && analysis.goldIncome > 0) {
      return priority.filter((kind) => kind === "factory");
    }
  }

  const needBarracks = analysis.avgFrontierInf < 1.5 && (counts.barracks || 0) < Math.max(1, requiredBarracks);
  const wantSecondFactory = strategicFactory &&
    (counts.factory || 0) < (BOT_FACTORY_LIMITS[player.personality] || 1) &&
    analysis.ammoIncome < 0.18;

  if (player.personality === "industrial") {
    if (wantSecondFactory) add("factory");
    if (needsAmmoDepot) add("ammoDepot");
    if (needBarracks) add("barracks");
    if (needsTck) add("tck");
    if (needsCounterIntel) add("counterIntel");
    if (needsBunker) add("bunker");
    // Деревня нужна сразу: pop кончается на пехоте, танки требуют pop:2
    if ((counts.village || 0) < 2) add("village");
    add("mine");
    if ((counts.farm || 0) < 2 && analysis.goldIncome < 0.12) add("farm");
    if (rich) {
      if ((counts.factory || 0) < 4) add("factory");
      if ((counts.barracks || 0) < 3) add("barracks");
      if ((counts.city || 0) < 3) add("city");
      if ((counts.village || 0) < 4) add("village");
      if ((counts.hospital || 0) < 1) add("hospital");
      if ((counts.farm || 0) < 4) add("farm");
    }
    return priority;
  }

  if (player.personality === "aggressive") {
    // Казармы строим как только есть завод — нужны для найма танков
    const wantsBarracks = (counts.barracks || 0) < Math.max(1, requiredBarracks);
    if (wantsBarracks) add("barracks");
    if (needsTck) add("tck");
    if (needsCounterIntel) add("counterIntel");
    if (needsBunker) add("bunker");
    // Деревня сразу после завода — нужен pop для тяжёлой техники
    if ((counts.village || 0) < 2) add("village");
    if (wantSecondFactory) add("factory");
    if (needsAmmoDepot) add("ammoDepot");
    add("mine");
    if ((counts.farm || 0) < 2 && analysis.goldIncome < 0.1) add("farm");
    if (rich) {
      if ((counts.factory || 0) < 3) add("factory");
      if ((counts.barracks || 0) < 4) add("barracks");
      if ((counts.city || 0) < 2) add("city");
      if ((counts.village || 0) < 4) add("village");
      if ((counts.hospital || 0) < 1) add("hospital");
      if ((counts.farm || 0) < 3) add("farm");
    }
    return priority;
  }

  add("barracks");
  if ((counts.farm || 0) < 4 && analysis.goldIncome < 0.12) add("farm");
  add("village");
  if ((res.ammo || 0) <= 2 && (counts.factory || 0) < 1) add("factory");
  if (needsAmmoDepot) add("ammoDepot");
  if (rich && (counts.hospital || 0) < 1) add("hospital");
  return priority;
}

function botMineTarget(playerId, order = ["gold", "iron", "uranium"]) {
  const cells = allCells(game.map).filter((cell) =>
    cell.owner === playerId && !cell.building && ["iron", "gold", "uranium"].includes(cell.terrain)
  );
  if (!cells.length) return null;
  for (const terrain of order) {
    const match = cells.find((cell) => cell.terrain === terrain && validateBuild(playerId, "mine", cell).ok);
    if (match) return match;
  }
  return cells.find((cell) => validateBuild(playerId, "mine", cell).ok) || null;
}

function botMinePlusTarget(playerId) {
  return allCells(game.map).find((cell) =>
    cell.owner === playerId &&
    !cell.building &&
    cell.terrain === "gold" &&
    validateBuild(playerId, "minePlus", cell).ok
  ) || null;
}

function botCurrentPhase(playerId) {
  const player = game.players[playerId];
  if (!player) return 'factory';
  if (isBotRich(playerId) && (countBuildings(playerId).factory || 0) > 0) return 'military';
  const counts = player._mapAnalysis?.counts || countBuildings(playerId);

  // Phase 'factory': нет завода — первым делом строим завод (источник боеприпасов)
  if ((counts.factory || 0) === 0) return 'factory';

  // Phase 'expand': есть завод, но ещё нет шахты на золоте — захватываем руды
  const hasGoldMine = allCells(game.map).some(c =>
    c.owner === playerId && (c.building?.type === 'mine' || c.building?.type === 'minePlus') && c.terrain === 'gold'
  );
  if (!hasGoldMine) return 'expand';

  // Phase 'military': завод + золотая шахта → нанимаем технику, воюем
  return 'military';
}

// Ближайший незахваченный ресурс к конкретной клетке (для распределённого захвата)
function botNearestResourceToCell(playerId, fromCell) {
  let nearest = null;
  let minDist = Infinity;
  forEachCell(c => {
    if (!['gold', 'iron', 'uranium'].includes(c.terrain)) return;
    if (c.owner === playerId) return; // уже наша
    if (c.owner && !isHostile(playerId, c.owner)) return; // союзная
    const d = Math.abs(c.x - fromCell.x) + Math.abs(c.y - fromCell.y);
    if (d < minDist) { minDist = d; nearest = c; }
  });
  return nearest;
}

function botBridgeAttackTarget(playerId) {
  const player = game.players[playerId];
  if (!player || player.personality === "passive") return null;
  const canStartWar = Date.now() - (game.startedAt || Date.now()) > 150_000;
  const myStats = computeStats(playerId);
  if (myStats.power < 4 && myStats.cells < 12) return null;

  const candidates = [];
  for (const cell of allCells(game.map)) {
    if (cell.terrain !== "water" || cell.building || !validateBuild(playerId, "bridge", cell).ok) continue;

    let score = 0;
    for (let y = cell.y - 3; y <= cell.y + 3; y += 1) {
      for (let x = cell.x - 3; x <= cell.x + 3; x += 1) {
        const target = getCell(x, y);
        if (!target || !target.owner || target.owner === playerId || isDefeated(target.owner) || isAllied(playerId, target.owner)) continue;
        if (target.terrain === "water" && !target.building) continue;

        const relation = relationStatus(playerId, target.owner);
        if (relation !== "war") {
          if (!canStartWar) continue;
          if (player.personality !== "aggressive" && player.personality !== "industrial") continue;
        }

        const enemyStats = computeStats(target.owner);
        const weaker = enemyStats.power <= Math.max(2, myStats.power * 0.82) ||
          enemyStats.cells <= Math.max(4, myStats.cells * 0.75);
        if (!weaker) continue;

        const d = Math.abs(cell.x - target.x) + Math.abs(cell.y - target.y);
        score = Math.max(score, (relation === "war" ? 16 : 9) + Math.max(0, 6 - d) + Math.max(0, myStats.power - enemyStats.power) * 0.25);
      }
    }

    if (score > 0) candidates.push({ cell, score });
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.cell || null;
}

function botExpansionBridgeTarget(playerId) {
  const player = game.players[playerId];
  if (!player || player.personality === "passive") return null;

  const existingBridges = allCells(game.map).filter((cell) =>
    cell.building?.type === "bridge" && cell.building.owner === playerId
  );
  const candidates = [];

  for (const cell of allCells(game.map)) {
    if (cell.terrain !== "water" || cell.building || !validateBuild(playerId, "bridge", cell).ok) continue;

    const nearbyBridge = existingBridges.some((bridge) =>
      Math.abs(bridge.x - cell.x) + Math.abs(bridge.y - cell.y) <= 3
    );
    if (nearbyBridge) continue;

    const adjacentCells = neighbors(cell.x, cell.y)
      .map(([nx, ny]) => getCell(nx, ny))
      .filter(Boolean);
    const targets = adjacentCells.filter((target) =>
      target.terrain !== "water" &&
      target.owner !== playerId &&
      (!target.owner || isHostile(playerId, target.owner))
    );
    if (!targets.length) continue;

    let score = player.personality === "fisher" ? 4 : 2;
    for (const target of targets) {
      if (!target.owner) score += 4;
      if (target.owner && isHostile(playerId, target.owner)) score += 8;
      if (target.terrain === "gold") score += 12;
      if (target.terrain === "iron") score += 10;
      if (target.terrain === "uranium") score += 8;
    }

    candidates.push({ cell, score });
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.cell || null;
}


function countBuildings(playerId) {
  const counts = {};
  forEachCell((cell) => {
    if (cell.building?.owner === playerId) {
      counts[cell.building.type] = (counts[cell.building.type] || 0) + 1;
    }
  });
  return counts;
}

function botBuildCell(playerId, kind) {
  if (kind === "mine") return botMineTarget(playerId);
  if (kind === "bridge") {
    return botBridgeAttackTarget(playerId) || botExpansionBridgeTarget(playerId);
  }

  const ownCells = allCells(game.map).filter((cell) => cell.owner === playerId && !cell.building);
  const hqCell = findHqCell(playerId);

  // §2.2 Умный выбор клетки по типу постройки
  const valid = ownCells.filter((cell) => validateBuild(playerId, kind, cell).ok);
  if (!valid.length) return null;

  if (kind === "port") {
    // Порт: у воды, желательно не на краю границы (не рядом с враждебными клетками)
    const safeCoastal = valid.filter((cell) =>
      hasAdjacentWater(cell.x, cell.y) &&
      !neighbors(cell.x, cell.y).some(([nx, ny]) => {
        const nc = getCell(nx, ny);
        return nc && nc.owner && isHostile(playerId, nc.owner);
      })
    );
    return shuffle(safeCoastal)[0] || shuffle(valid.filter((c) => hasAdjacentWater(c.x, c.y)))[0] || null;
  }

  if (kind === "barracks") {
    // Казармы: как можно дальше от HQ (к линии фронта)
    if (hqCell) {
      return valid.sort((a, b) => {
        const sa = botFrontierScore(playerId, a);
        const sb = botFrontierScore(playerId, b);
        if (sa !== sb) return sb - sa;
        const da = Math.abs(a.x - hqCell.x) + Math.abs(a.y - hqCell.y);
        const db = Math.abs(b.x - hqCell.x) + Math.abs(b.y - hqCell.y);
        return db - da;
      })[0] || null;
    }
    return shuffle(valid)[0] || null;
  }

  if (kind === "factory") {
    // Завод: в тылу, рядом с HQ
    if (hqCell) {
      return valid.sort((a, b) => {
        const ra = botCellRisk(playerId, a);
        const rb = botCellRisk(playerId, b);
        if (ra !== rb) return ra - rb;
        const da = Math.abs(a.x - hqCell.x) + Math.abs(a.y - hqCell.y);
        const db = Math.abs(b.x - hqCell.x) + Math.abs(b.y - hqCell.y);
        return da - db;
      })[0] || null;
    }
    return shuffle(valid)[0] || null;
  }

  if (kind === "village" || kind === "hospital") {
    // Деревня/больница: подальше от фронта
    if (hqCell) {
      return valid.sort((a, b) => {
        const ra = botCellRisk(playerId, a);
        const rb = botCellRisk(playerId, b);
        if (ra !== rb) return ra - rb;
        const fa = botFrontierScore(playerId, a);
        const fb = botFrontierScore(playerId, b);
        return fa - fb;
      })[0] || null;
    }
    return shuffle(valid)[0] || null;
  }

  if (kind === "bunker") {
    const withInf = valid.filter((cell) => (unitsFor(cell, playerId).inf || 0) > 0);
    const pool = withInf.length ? withInf : valid;
    return pool.sort((a, b) => botFrontierScore(playerId, b) - botFrontierScore(playerId, a))[0] || null;
  }

  // farm и остальные — любая своя земля без ресурсов
  const noResource = valid.filter((c) => !["gold", "iron", "uranium"].includes(c.terrain));
  return (noResource.length ? noResource : valid)
    .sort((a, b) => botCellRisk(playerId, a) - botCellRisk(playerId, b))[0] || null;
}

// §1.3 Производственный минимум: пока не достигнут — тяжёлую технику не нанимаем
function botMinimumMet(playerId) {
  const player = game.players[playerId];
  const counts = countBuildings(playerId);
  const min = BOT_MINIMUMS[player.personality] || {};
  return Object.entries(min).every(([building, required]) => (counts[building] || 0) >= required);
}

function botFrontierScore(playerId, cell) {
  return neighbors(cell.x, cell.y).reduce((score, [nx, ny]) => {
    const nc = getCell(nx, ny);
    if (!nc) return score;
    if (!nc.owner && isPassable(nc)) return score + 2;
    if (nc.owner && nc.owner !== playerId && isHostile(playerId, nc.owner)) return score + 5;
    if (hostileUnitIdsAtCell(playerId, nc).length > 0) return score + 4;
    return score;
  }, 0);
}

function botCellRisk(playerId, cell) {
  return neighbors(cell.x, cell.y).reduce((risk, [nx, ny]) => {
    const nc = getCell(nx, ny);
    if (!nc) return risk;
    if (hostileUnitIdsAtCell(playerId, nc).length > 0) return risk + 6;
    if (nc.owner && nc.owner !== playerId && isHostile(playerId, nc.owner)) return risk + 4;
    if (nc.owner && nc.owner !== playerId) return risk + 1;
    return risk;
  }, 0);
}

function tryBotHire(playerId, options = {}) {
  const player = game.players[playerId];
  if (!player || isDefeated(playerId)) return false;
  const order = botHireOrder(playerId);
  const minMet = botMinimumMet(playerId);
  // Тяжёлая техника — только после достижения производственного минимума
  const heavyUnits = new Set(["tank", "rocket", "mlrs", "drone", "aa", "aaPlus", "ew"]);

  // ─── НАЧАЛЬНЫЕ ФАЗЫ: завод/расширение → только оборонная пехота ──────────
  const analysis = player._mapAnalysis || botAnalyzeMap(playerId);
  const phase = botCurrentPhase(playerId);
  if (botNeedsFactoryGuard(playerId)) {
    const guardCell = findRecruitCell(playerId, 'inf');
    if (guardCell) {
      const infCost = unitHireCost(playerId, 'inf', guardCell);
      if (canPay(player, infCost)) {
        spend(player, infCost);
        unitsFor(guardCell, playerId).inf += 1;
        clearFactoryStrikeIfGuarded(guardCell, playerId);
        touchMap();
        emitSfx("hire", guardCell.x, guardCell.y, { unit: "inf", playerId });
        return true;
      }
    }
  }
  if (phase !== 'military' && !options.emergency && !isBotRich(playerId)) {
    // В фазах 'factory' и 'expand' не тратим ресурсы на технику
    if (!botShouldHireDefensiveInf(playerId)) return false;
    const defCell = findRecruitCell(playerId, 'inf');
    if (!defCell) return false;
    const infCost = unitHireCost(playerId, 'inf', defCell);
    // Резерв: в фазе 'factory' держим 30+ золота на завод
    const reserveGold = phase === 'factory' ? BUILDINGS.factory.cost.gold : 8;
    if ((player.resources.gold || 0) - (infCost.gold || 0) < reserveGold) return false;
    const defDef = UNITS['inf'];
    if (!defDef || !canPay(player, infCost)) return false;
    spend(player, infCost);
    unitsFor(defCell, playerId).inf += 1;
    touchMap();
    emitSfx("hire", defCell.x, defCell.y, { unit: 'inf', playerId });
    return true;
  }
  // ─────────────────────────────────────────────────────────────────────────

  for (const kind of order) {
    if (!minMet && kind === "inf" && !botShouldHireDefensiveInf(playerId)) continue;
    if (!minMet && (kind === "boat" || kind === "cruiser")) continue;
    if (heavyUnits.has(kind) && !botCanHireHeavyUnit(playerId, kind, minMet || options.emergency || isBotRich(playerId))) continue;

    // Не тратим pop на пехоту если он нужен для тяжёлой техники
    // (factory есть, есть gold+iron для тяжёлого юнита, не хватает только pop)
    if (kind === 'inf' && !botShouldHireDefensiveInf(playerId)) {
      const canHireHeavy = order.some(k => {
        if (!heavyUnits.has(k)) return false;
        if (!botCanHireHeavyUnit(playerId, k, minMet)) return false;
        const def = UNITS[k];
        if (!def) return false;
        // Хватает всего кроме pop?
        const nonPopCost = Object.entries(def.cost).filter(([r]) => r !== 'pop');
        return nonPopCost.every(([r, v]) => (player.resources[r] || 0) >= v);
      });
      if (canHireHeavy) continue; // придержим pop для танка/ракеты
    }
    const definition = UNITS[kind];
    if (!definition) continue;
    if (kind === "saboteur") continue;

    if (kind === "boat" || kind === "cruiser") {
      const water = findBotVesselHireCell(playerId, kind);
      if (!water) continue;
      if (!canPay(player, definition.cost)) continue;
      spend(player, definition.cost);
      unitsFor(water, playerId)[kind] = 1;
      touchMap();
      emitSfx("hire", water.x, water.y, { unit: kind, playerId });
      return true;
    }

    const cell = findRecruitCell(playerId, kind);
    if (!cell) continue;
    const ownUnits = unitsFor(cell, playerId);
    if (STATIC_DEPLOY_UNITS.has(kind)) {
      if (cell.construction || !canCompleteStaticDeploy(playerId, kind, cell)) continue;
      if (!canPay(player, definition.cost)) continue;
      spend(player, definition.cost);
      startConstruction(cell, {
        type: "unit",
        kind,
        owner: playerId,
        label: definition.label
      });
      touchMap();
      return true;
    }
    if (!definition.stack && ownUnits[kind] > 0) continue;
    const cost = unitHireCost(playerId, kind, cell);
    if (!canPay(player, cost)) continue;
    spend(player, cost);
    ownUnits[kind] += 1;
    if (kind === "inf") {
      clearFactoryStrikeIfGuarded(cell, playerId);
    }
    if (kind === "saboteur") setCooldown(player, "saboteur");
    touchMap();
    emitSfx("hire", cell.x, cell.y, { unit: kind, playerId });
    return true;
  }
  return false;
}

function findBotVesselHireCell(playerId, kind) {
  const candidates = allCells(game.map).filter((cell) => (
    cell.terrain === "water" &&
    !cell.building &&
    !cellHasAnyVessel(cell) &&
    (kind === "cruiser"
      ? hasAdjacentFriendlyPort(playerId, cell.x, cell.y)
      : hasAdjacentOwnedCell(playerId, cell.x, cell.y))
  ));
  return shuffle(candidates)[0] || null;
}

function botCanHireHeavyUnit(playerId, kind, minMet) {
  const player = game.players[playerId];
  const counts = countBuildings(playerId);
  if ((counts.factory || 0) < 1) return false;
  if (isBotRich(playerId)) return true;
  // AA можно без шахты (только золото+pop), остальное требует железо → нужна шахта
  if (kind !== "aa" && (counts.mine || 0) < 1 && (counts.minePlus || 0) < 1) return false;
  if (kind === "aaPlus" && !botSeesNuclearThreat(playerId) && !minMet) return false;
  if (player.personality === "aggressive") {
    // Анархисты: factory + mine достаточно (барак опционален)
    return true;
  }
  if (player.personality === "industrial") {
    // Механики: factory + mine, барак не обязателен
    return true;
  }
  return minMet;
}

function botShouldHireDefensiveInf(playerId) {
  if (botIsUnderAttack(playerId)) return true;
  if (botNeedsFactoryGuard(playerId)) return true;
  const hq = findHqCell(playerId);
  if (!hq || hq.owner !== playerId) return true;
  if (unitPower(unitsFor(hq, playerId)) < 2) return true;
  return computeStats(playerId).inf < 2;
}

function botSeesNuclearThreat(playerId) {
  return hostilePlayerIds(playerId).some((enemyId) => {
    const enemy = game.players[enemyId];
    if (!enemy) return false;
    if (playerHasBuilding(enemyId, "nuclearPlant")) return true;
    return (enemy.resources.uranium || 0) >= 14 && (enemy.resources.iron || 0) >= 24;
  });
}

function botHireOrder(playerId) {
  const player  = game.players[playerId];
  const analysis = player._mapAnalysis || botAnalyzeMap(playerId);
  const counts  = analysis.counts;
  const cells   = computeStats(playerId).cells;

  // ── Фермеры: только пехота (экономический бот) ──
  if (player.personality === 'passive') {
    return ['inf'];
  }

  // ── Рыбаки: пехота + лодки, без тяжёлой военной техники ──
  if (player.personality === 'fisher') {
    return ['inf', 'boat', 'cruiser'];
  }

  // Фазы игры по количеству клеток
  const earlyGame = cells < 10;
  const lateGame  = cells >= 25;

  if (earlyGame) {
    if (player.personality === 'aggressive' && (counts.factory || 0) > 0) {
      return ['tank', 'rpg', 'drone', 'saboteur', 'rocket', 'ew', 'inf', 'aa'];
    }
    if (player.personality === 'industrial' && (counts.factory || 0) > 0) {
      return ['rocket', 'rpg', 'drone', 'saboteur', 'tank', 'ew', 'aa', 'inf'];
    }
    return ['inf', 'inf', 'inf'];
  }

  if (lateGame) {
    return botSeesNuclearThreat(playerId)
      ? ['aaPlus', 'rocket', 'mlrs', 'rpg', 'drone', 'saboteur', 'cruiser', 'tank', 'ew', 'aa', 'inf']
      : ['rocket', 'mlrs', 'rpg', 'drone', 'saboteur', 'cruiser', 'tank', 'ew', 'aa', 'inf'];
  }

  // Средняя игра по личности
  if (player.personality === 'industrial') {
    return counts.factory > 0
      ? (botSeesNuclearThreat(playerId) ? ['aaPlus', 'rocket', 'rpg', 'drone', 'saboteur', 'tank', 'mlrs', 'cruiser', 'ew', 'aa', 'inf'] : ['rocket', 'rpg', 'drone', 'saboteur', 'tank', 'mlrs', 'cruiser', 'ew', 'aa', 'inf'])
      : ['inf', 'rpg', 'aa', 'ew', 'rocket', 'tank'];
  }

  if (player.personality === 'aggressive') {
    const stats = computeStats(playerId);
    const base = stats.inf < 3
      ? ['tank', 'inf', 'rpg', 'drone', 'saboteur', 'rocket', 'ew', 'aa', 'mlrs']
      : ['tank', 'rpg', 'drone', 'saboteur', 'rocket', 'mlrs', 'cruiser', 'ew', 'inf', 'aa'];
    return botSeesNuclearThreat(playerId) ? ['aaPlus', ...base] : base;
  }

  return ['inf', 'aa'];
}

function botStruckFactories(playerId, now = Date.now()) {
  return allCells(game.map).filter((cell) =>
    cell.building?.type === "factory" &&
    cell.building.owner === playerId &&
    (cell.building.strikeUntil || 0) > now
  );
}

function botNeedsFactoryGuard(playerId) {
  return botStruckFactories(playerId).some((cell) => (unitsFor(cell, playerId).inf || 0) <= 0);
}

function botFactoryGuardReserve(cell, playerId) {
  return cell.building?.type === "hq" && cell.building.owner === playerId ? 1 : 0;
}

function manhattanDistance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function botFactoryGuardStep(playerId, from, factory) {
  if (isAdjacent(from, factory)) return factory;
  const fromDist = manhattanDistance(from, factory);
  return shuffle(neighbors(from.x, from.y).map(([x, y]) => getCell(x, y)).filter(Boolean))
    .filter((cell) =>
      cell &&
      controlsCell(playerId, cell) &&
      isPassable(cell) &&
      cell.terrain !== "water" &&
      hostileUnitIdsAtCell(playerId, cell).length === 0 &&
      manhattanDistance(cell, factory) < fromDist
    )
    .sort((a, b) => manhattanDistance(a, factory) - manhattanDistance(b, factory) || botCellRisk(playerId, a) - botCellRisk(playerId, b))[0] || null;
}

function botFactoryGuardSource(playerId, factory) {
  const candidates = [];
  forEachCell((cell) => {
    if (cell === factory) return;
    if (!controlsCell(playerId, cell) || !isPassable(cell) || cell.terrain === "water") return;
    if (hostileUnitIdsAtCell(playerId, cell).length > 0) return;
    const units = unitsFor(cell, playerId);
    if ((units.inf || 0) <= botFactoryGuardReserve(cell, playerId)) return;
    const step = botFactoryGuardStep(playerId, cell, factory);
    if (!step) return;
    candidates.push({
      cell,
      dist: manhattanDistance(cell, factory),
      risk: botCellRisk(playerId, cell)
    });
  });
  candidates.sort((a, b) => a.dist - b.dist || a.risk - b.risk);
  return candidates[0]?.cell || null;
}

function tryBotClearFactoryStrike(playerId) {
  const player = game.players[playerId];
  if (!player || isDefeated(playerId)) return false;

  const hqCell = findHqCell(playerId);
  const factories = botStruckFactories(playerId)
    .filter((cell) => (unitsFor(cell, playerId).inf || 0) <= 0)
    .sort((a, b) => botCellRisk(playerId, a) - botCellRisk(playerId, b) || manhattanDistance(a, hqCell || a) - manhattanDistance(b, hqCell || b));

  for (const factory of factories) {
    if (hostileUnitIdsAtCell(playerId, factory).length > 0) continue;
    const source = botFactoryGuardSource(playerId, factory);
    if (!source) continue;
    const step = botFactoryGuardStep(playerId, source, factory);
    if (!step) continue;

    const ammoCost = movementAmmoCost(1, playerId, source);
    if (!canPay(player, { ammo: ammoCost })) continue;

    const sourceUnits = unitsFor(source, playerId);
    if ((sourceUnits.inf || 0) <= botFactoryGuardReserve(source, playerId)) continue;

    const moved = { ...emptyUnits(), inf: 1 };
    spend(player, { ammo: ammoCost });
    sourceUnits.inf -= 1;
    resolveMoveIntoCell(playerId, step, moved);
    clearFactoryStrikeIfGuarded(step, playerId);
    pruneWeaponCooldowns(source);
    pruneWeaponCooldowns(step);
    touchMap();

    const now = Date.now();
    player.nextBotMove = playerAtWar(playerId) ? now : now + BOT_MOVE_COOLDOWN_MS + randomInt(0, BOT_MOVE_JITTER_MS);
    return true;
  }

  return false;
}

function tryBotMove(playerId, options = {}) {
  const player = game.players[playerId];
  if (!player || isDefeated(playerId)) return false;
  const now = Date.now();
  const atWar = playerAtWar(playerId);

  if (!options.emergency && !atWar && now < (player.nextBotMove || 0)) return false;

  // §4.1 Резерв боеприпасов по личности: не двигаемся если меньше минимума
  const underAttack = botIsUnderAttack(playerId);
  const looterEvent = activeEventType("looter");

  // ─── ФАЗЫ: factory/expand — бережём патроны и движемся к ресурсам ────────
  const analysis = player._mapAnalysis || botAnalyzeMap(playerId);
  const phase = botCurrentPhase(playerId);
  const earlyPhase = phase === 'factory';   // нет завода
  const expandPhase = phase === 'expand';   // есть завод, нет золотой шахты
  const preMillitary = phase !== 'military';
  const minAmmo = options.emergency ? 1 : (preMillitary ? 4 : (underAttack ? 1 : 2));
  if ((player.resources.ammo || 0) < minAmmo) {
    player.nextBotMove = atWar ? now : now + BOT_RETRY_COOLDOWN_MS + randomInt(0, BOT_MOVE_JITTER_MS);
    return false;
  }

  const MAX_INF = { aggressive: 5, passive: 2, industrial: 3, fisher: 2 };
  const maxInf  = (MAX_INF[player.personality] || 2) + (looterEvent ? 2 : 0);

  const sources = allCells(game.map)
    .filter(cell => cell.owner === playerId && movableLandPower(unitsFor(cell, playerId)) > 0)
    .sort((a, b) => {
      // ─── НАЧАЛЬНЫЕ ФАЗЫ: сортируем по близости к ближайшему ресурсу ────────
      if (preMillitary && analysis.nearestResource) {
        const nr = analysis.nearestResource;
        const da = Math.abs(a.x - nr.x) + Math.abs(a.y - nr.y);
        const db = Math.abs(b.x - nr.x) + Math.abs(b.y - nr.y);
        if (da !== db) return da - db;
      }
      // Приоритет: сначала клетки рядом с врагом или незанятой землёй
      const aFrontier = neighbors(a.x, a.y).some(([nx, ny]) => {
        const nc = getCell(nx, ny);
        return nc && ((!nc.owner && isPassable(nc)) || (nc.owner && isHostile(playerId, nc.owner)));
      });
      const bFrontier = neighbors(b.x, b.y).some(([nx, ny]) => {
        const nc = getCell(nx, ny);
        return nc && ((!nc.owner && isPassable(nc)) || (nc.owner && isHostile(playerId, nc.owner)));
      });
      if (aFrontier && !bFrontier) return -1;
      if (!aFrontier && bFrontier) return 1;
      return Math.random() - 0.5;
    });

  for (const from of sources) {
    const target = chooseBotMoveTarget(playerId, from);
    if (!target) continue;

    const su = unitsFor(from, playerId);
    const moved = emptyUnits();

    // §4.3 Размер отряда: атакуем не всем стеком, держим резерв для обороны
    const enemyPower = hostileUnitIdsAtCell(playerId, target)
      .reduce((s, id) => s + unitPower(unitsFor(target, id)), 0);
    const isHostileTarget = target.owner && target.owner !== playerId && isHostile(playerId, target.owner);
    const maxAttackInf = isHostileTarget && enemyPower > 0
      ? Math.ceil(Math.min(su.inf, enemyPower * 1.5 + 2))
      : Math.min(su.inf, maxInf);
    const keepInf = from.building?.type === "hq" && !underAttack ? 1 : 0;
    const availableInf = Math.max(0, su.inf - keepInf);
    const targetOwnUnits = unitsFor(target, playerId);
    const availableRpg = targetOwnUnits.rpg ? 0 : Math.max(0, su.rpg || 0);

    // ─── НАЧАЛЬНЫЕ ФАЗЫ: экономим технику; в expand — 2 скаута для руд ──────
    // НО: если под атакой — бросаем всё в оборону независимо от фазы
    if (earlyPhase && !underAttack) {
      moved.inf  = Math.min(1, availableInf);  // factory: 1 разведчик, берём патроны бережнее
      moved.rpg = 0;
      moved.tank = 0;
      moved.mlrs = 0;
    } else if (expandPhase && !underAttack) {
      moved.inf  = Math.min(2, availableInf);  // expand: 2 скаута - захватываем все руды быстрее
      moved.rpg = 0;
      moved.tank = 0;
      moved.mlrs = 0;
    } else {
      moved.inf  = Math.min(availableInf, Math.max(1, Math.min(maxInf, maxAttackInf)));
      moved.rpg = Math.min(availableRpg, 1);
      moved.tank = su.tank > 0 && !targetOwnUnits.tank ? 1 : 0;
      moved.mlrs = su.mlrs > 0 && !targetOwnUnits.mlrs ? 1 : 0;
    }
    if (movingUnitCount(moved) <= 0) continue;

    // §4.3 Сокращаем отряд если патронов не хватает с учётом резерва
    const AMMO_RESERVE_MOVE = { aggressive: 3, passive: 5, industrial: 4, fisher: 5 };
    // В начальных фазах держим больший резерв патронов (завод только строится)
    const ammoReserve = looterEvent ? 0 : (preMillitary ? 5 : (underAttack ? 1 : (AMMO_RESERVE_MOVE[player.personality] || 5)));
    let ammoCost = movementAmmoCost(moved.inf + moved.rpg + moved.tank * 2 + moved.mlrs * 2, playerId, from);
    while (ammoCost > (player.resources.ammo || 0) - ammoReserve && moved.inf > 0) {
      moved.inf -= 1;
      ammoCost = movementAmmoCost(moved.inf + moved.rpg + moved.tank * 2 + moved.mlrs * 2, playerId, from);
    }
    while (ammoCost > (player.resources.ammo || 0) - ammoReserve && moved.rpg > 0) {
      moved.rpg -= 1;
      ammoCost = movementAmmoCost(moved.inf + moved.rpg + moved.tank * 2 + moved.mlrs * 2, playerId, from);
    }
    if (!canPay(player, { ammo: ammoCost }) || movingUnitCount(moved) <= 0) continue;

    const movedCooldowns = movedWeaponCooldowns(from, playerId, moved);
    spend(player, { ammo: ammoCost });
    su.inf  -= moved.inf;
    su.rpg  -= moved.rpg;
    su.tank -= moved.tank;
    su.mlrs -= moved.mlrs;
    resolveMoveIntoCell(playerId, target, moved);
    applyMovedWeaponCooldowns(from, target, playerId, movedCooldowns);
    emitMovementSfx(moved, target, playerId);
    pruneWeaponCooldowns(from);
    pruneWeaponCooldowns(target);

    if (target.owner === playerId && Math.random() < 0.12) {
      botSayPhrase(playerId, "capture");
    }

    touchMap();
    player.nextBotMove = atWar ? now : now + BOT_MOVE_COOLDOWN_MS + randomInt(0, BOT_MOVE_JITTER_MS);
    recomputePlayerFlags();
    checkVictory();
    return true;
  }

  player.nextBotMove = atWar ? now : now + BOT_RETRY_COOLDOWN_MS + randomInt(0, BOT_MOVE_JITTER_MS);
  return false;
}

function chooseBotMoveTarget(playerId, from) {
  const player   = game.players[playerId];
  const analysis = player._mapAnalysis || botAnalyzeMap(playerId);
  const cells = shuffle(neighbors(from.x, from.y).map(([x, y]) => getCell(x, y)).filter(Boolean));
  const valid = cells.filter((cell) => (
    isPassable(cell) &&
    cell.terrain !== "water" &&
    (!cell.owner || cell.owner === playerId || isHostile(playerId, cell.owner)) &&
    (!unitsFor(cell, playerId).rpg || !unitsFor(from, playerId).rpg) &&
    (!unitsFor(cell, playerId).tank || !unitsFor(from, playerId).tank) &&
    (!unitsFor(cell, playerId).mlrs || !unitsFor(from, playerId).mlrs)
  ));

  // §4.2 п.1 Защита HQ: если HQ под угрозой — войска идут туда
  const hqCell = analysis.hqCell;
  if (hqCell && hqCell.owner === playerId) {
    const hqUnits = unitsFor(hqCell, playerId);
    const hqTotalPower = unitPower(hqUnits);
    const hqNeighborHostile = neighbors(hqCell.x, hqCell.y).some(([nx, ny]) => {
      const nc = getCell(nx, ny);
      return nc && hostileUnitIdsAtCell(playerId, nc).length > 0;
    });
    if (hqNeighborHostile && hqTotalPower < 4) {
      const toHQ = valid.find((c) => c.x === hqCell.x && c.y === hqCell.y);
      if (toHQ) return toHQ;
    }
  }

  // §4.2 п.1в Срочная оборона: если где-то наши клетки под атакой — двигаемся туда
  const attackedCell = botFindAttackedCell(playerId);
  if (attackedCell) {
    const distFromTo = Math.abs(from.x - attackedCell.x) + Math.abs(from.y - attackedCell.y);
    if (distFromTo > 1) {
      // Юнит не рядом — идём в сторону атакуемой клетки
      const towardAttacked = valid
        .filter(c => isPassable(c) && (c.owner === playerId || !c.owner))
        .filter(c => (Math.abs(c.x - attackedCell.x) + Math.abs(c.y - attackedCell.y)) < distFromTo)
        .sort((a, b) =>
          (Math.abs(a.x - attackedCell.x) + Math.abs(a.y - attackedCell.y)) -
          (Math.abs(b.x - attackedCell.x) + Math.abs(b.y - attackedCell.y))
        )[0] || null;
      if (towardAttacked) return towardAttacked;
    }
  }


  // §4.2 п.1б Защита своих клеток под угрозой (соседних)
  const threatenedOwn = valid.find((c) => {
    if (c.owner !== playerId) return false;
    return neighbors(c.x, c.y).some(([nx, ny]) => {
      const nc = getCell(nx, ny);
      return nc && hostileUnitIdsAtCell(playerId, nc).length > 0;
    });
  });
  if (threatenedOwn) return threatenedOwn;

  const hostile  = valid.find(c => c.owner && c.owner !== playerId && isHostile(playerId, c.owner));
  const resource = valid.find(c => !c.owner && ['iron','gold','uranium'].includes(c.terrain));
  const empty    = valid.find(c => !c.owner);
  const ownRes   = valid.find(c => c.owner === playerId && ['iron','gold','uranium'].includes(c.terrain) && !c.building);

  // §4.2 п.2 Атака только при небольшом превосходстве (≥1.0× достаточно)
  const hostileWithAdvantage = valid.find((c) => {
    if (!c.owner || c.owner === playerId || !isHostile(playerId, c.owner)) return false;
    const myPow    = unitPower(unitsFor(from, playerId));
    const theirPow = hostileUnitIdsAtCell(playerId, c).reduce((s, id) => s + unitPower(unitsFor(c, id)), 0);
    return myPow >= theirPow * 1.0; // атакуем при равной или большей силе
  });

  // §4.2 п.2б Движение к ближайшей враждебной клетке для наступления (режим войны)
  const atWar = PLAYER_IDS.some(id => id !== playerId && relationStatus(playerId, id) === 'war');
  let towardEnemy = null;
  if (atWar) {
    const nearEnemy = botFindNearestEnemyCell(playerId, from);
    if (nearEnemy) {
      const fromDist = Math.abs(from.x - nearEnemy.x) + Math.abs(from.y - nearEnemy.y);
      towardEnemy = valid
        .filter(c => isPassable(c) && (c.owner === playerId || !c.owner || isHostile(playerId, c.owner)))
        .filter(c => (Math.abs(c.x - nearEnemy.x) + Math.abs(c.y - nearEnemy.y)) < fromDist)
        .sort((a, b) =>
          (Math.abs(a.x - nearEnemy.x) + Math.abs(a.y - nearEnemy.y)) -
          (Math.abs(b.x - nearEnemy.x) + Math.abs(b.y - nearEnemy.y))
        )[0] || null;
    }
  }


  // §4.2 п.3 Per-unit таргетинг ресурса: каждый юнит идёт к ближайшей руде,
  // а не все к одной глобально-ближайшей — распределённый захват нейтралки
  const unitNearestRes = botNearestResourceToCell(playerId, from) || analysis.nearestResource;
  let towardResource = null;
  if (unitNearestRes) {
    const nr = unitNearestRes;
    const fromDist = Math.abs(from.x - nr.x) + Math.abs(from.y - nr.y);
    towardResource = valid
      .filter(c => isPassable(c) && (c.owner === playerId || !c.owner))
      .filter(c => (Math.abs(c.x - nr.x) + Math.abs(c.y - nr.y)) < fromDist)
      .sort((a, b) =>
        (Math.abs(a.x - nr.x) + Math.abs(a.y - nr.y)) -
        (Math.abs(b.x - nr.x) + Math.abs(b.y - nr.y))
      )[0] || null;
  }

  // §4.2 п.3 Движение к фронту (если рядом только свои)
  let towardFrontier = null;
  if (!hostile && !resource && !empty) {
    const frontier = findNearestFrontierCell(playerId, from);
    if (frontier) {
      const fromDist = Math.abs(from.x - frontier.x) + Math.abs(from.y - frontier.y);
      towardFrontier = valid
        .filter(c => isPassable(c) && (c.owner === playerId || !c.owner))
        .filter(c => (Math.abs(c.x - frontier.x) + Math.abs(c.y - frontier.y)) < fromDist)
        .sort((a, b) =>
          (Math.abs(a.x - frontier.x) + Math.abs(a.y - frontier.y)) -
          (Math.abs(b.x - frontier.x) + Math.abs(b.y - frontier.y))
        )[0] || null;
    }
  }

  // ─── НАЧАЛЬНЫЕ ФАЗЫ (factory/expand): движемся к ресурсам, НО если атакуют — защищаемся
  const phase = botCurrentPhase(playerId);
  if (phase === 'factory' || phase === 'expand') {
    // Даже в ранней фазе, если враг уже на наших клетках — контратакуем
    return hostileWithAdvantage || resource || towardResource || empty || null;
  }

  switch (player.personality) {
    case "aggressive":
      // Aggressive: сначала атака/движение к врагу, потом ресурсы
      return hostileWithAdvantage || towardEnemy || resource || towardResource || empty || towardFrontier || null;

    case "passive": {
      const myStats = computeStats(playerId);
      if (myStats.cells >= FARMER_CELL_LIMIT) return ownRes || null;
      // Фермеры: если война — тоже идут к врагу, иначе расширяются мирно
      if (atWar) return hostileWithAdvantage || towardEnemy || resource || towardResource || empty || ownRes || null;
      return resource || towardResource || empty || ownRes || towardFrontier || null;
    }

    case "industrial":
      // Industrial: в войне — наступаем, в мире — экономика
      if (atWar) return hostileWithAdvantage || towardEnemy || resource || ownRes || towardResource || empty || null;
      return resource || ownRes || towardResource || hostileWithAdvantage || empty || towardFrontier || null;

    case "fisher": {
      const myStats = computeStats(playerId);
      if (myStats.cells >= FARMER_CELL_LIMIT) return ownRes || null;

      // Рыбаки: сначала идут к воде / прибрежным клеткам
      const nearWater = valid.find(c => !c.owner && hasAdjacentWater(c.x, c.y));

      // Движение к ближайшей прибрежной незанятой клетке (из анализа карты)
      let towardWater = null;
      if (analysis.nearestWaterFrontier) {
        const nwf = analysis.nearestWaterFrontier;
        const fromDist = Math.abs(from.x - nwf.x) + Math.abs(from.y - nwf.y);
        towardWater = valid
          .filter(c => isPassable(c) && (c.owner === playerId || !c.owner))
          .filter(c => (Math.abs(c.x - nwf.x) + Math.abs(c.y - nwf.y)) < fromDist)
          .sort((a, b) =>
            (Math.abs(a.x - nwf.x) + Math.abs(a.y - nwf.y)) -
            (Math.abs(b.x - nwf.x) + Math.abs(b.y - nwf.y))
          )[0] || null;
      }

      if (atWar) return hostileWithAdvantage || towardEnemy || nearWater || towardWater || resource || towardResource || empty || ownRes || null;
      return nearWater || towardWater || resource || towardResource || empty || ownRes || towardFrontier || null;
    }

    default:
      return towardEnemy || empty || towardFrontier || null;
  }
}

// Ближайшая клетка врага (для наступления когда объявлена война)
function botFindNearestEnemyCell(playerId, from) {
  let nearest = null;
  let minDist = Infinity;
  forEachCell(c => {
    if (!c.owner || c.owner === playerId) return;
    if (!isHostile(playerId, c.owner)) return;
    const d = Math.abs(c.x - from.x) + Math.abs(c.y - from.y);
    if (d < minDist) { minDist = d; nearest = c; }
  });
  return nearest;
}

function tryBotDrone(playerId) {
  const player = game.players[playerId];
  if (!player || isDefeated(playerId)) return false;
  const droneCells = shuffle(allCells(game.map).filter((cell) => (unitsFor(cell, playerId).drone || 0) > 0));
  for (const cell of droneCells) {
    if (hostileUnitIdsAtCell(playerId, cell).length) {
      detonateDroneAt(playerId, cell);
      return true;
    }
  }

  for (const from of droneCells) {
    const target = botFindDroneTarget(playerId, from);
    if (!target) continue;
    const fromDist = distance(from, target);
    const step = shuffle(neighbors(from.x, from.y).map(([x, y]) => getCell(x, y)).filter(Boolean))
      .filter((cell) => {
        if (cell.owner && cell.owner !== playerId && !isHostile(playerId, cell.owner) && !controlsOwner(playerId, cell.owner)) return false;
        return distance(cell, target) < fromDist;
      })
      .sort((a, b) => distance(a, target) - distance(b, target))[0];
    if (!step) continue;
    const ammoCost = movementAmmoCost(1, playerId, from);
    if (!canPay(player, { ammo: ammoCost })) return false;
    spend(player, { ammo: ammoCost });
    unitsFor(from, playerId).drone -= 1;
    unitsFor(step, playerId).drone += 1;
    emitSfx("drone_run", step.x, step.y, { playerId });
    touchMap();
    return true;
  }
  return false;
}

function tryBotSaboteur(playerId) {
  const player = game.players[playerId];
  if (!player || isDefeated(playerId)) return false;
  const factory = factoryLaunchCell(playerId);
  if (!factory || !cooldownReady(player, "saboteur") || !canPay(player, UNITS.saboteur.cost)) return false;
  const target = botFindSaboteurTarget(playerId, factory);
  return target ? launchShahedStrike(playerId, target, factory) : false;
}

function botFindSaboteurTarget(playerId, from) {
  let best = null;
  let bestScore = 0;
  forEachCell((cell) => {
    if (!cell.building?.owner || !isHostile(playerId, cell.building.owner)) return;
    if (!botCanSeeTarget(playerId, cell)) return;
    const score = botNukeBuildingValue(cell.building.type) * 10 - distance(from, cell);
    if (score > bestScore) {
      bestScore = score;
      best = cell;
    }
  });
  return best;
}

function tryBotCruiserBlockade(playerId) {
  const player = game.players[playerId];
  if (!player || isDefeated(playerId)) return false;
  const cruisers = shuffle(allCells(game.map).filter((cell) => (unitsFor(cell, playerId).cruiser || 0) > 0));
  for (const from of cruisers) {
    const targetPort = botFindPortBlockadeTarget(playerId, from);
    if (!targetPort) continue;
    if (neighbors(targetPort.x, targetPort.y).some(([x, y]) => {
      const cell = getCell(x, y);
      return cell?.terrain === "water" && (unitsFor(cell, playerId).cruiser || 0) > 0;
    })) continue;
    const step = shuffle(neighbors(from.x, from.y).map(([x, y]) => getCell(x, y)).filter(Boolean))
      .filter((cell) =>
        cell &&
        cell.terrain === "water" &&
        !cell.building &&
        !cellHasAnyVessel(cell) &&
        !hostileCruiserAtCell(playerId, cell) &&
        distance(cell, targetPort) < distance(from, targetPort)
      )
      .sort((a, b) => distance(a, targetPort) - distance(b, targetPort))[0];
    if (!step) continue;
    const ammoCost = movementAmmoCost(1, playerId, from);
    if (!canPay(player, { ammo: ammoCost })) return false;
    const moved = { ...emptyUnits(), cruiser: 1 };
    const movedCooldowns = movedWeaponCooldowns(from, playerId, moved);
    spend(player, { ammo: ammoCost });
    unitsFor(from, playerId).cruiser -= 1;
    unitsFor(step, playerId).cruiser += 1;
    applyMovedWeaponCooldowns(from, step, playerId, movedCooldowns);
    pruneWeaponCooldowns(from);
    pruneWeaponCooldowns(step);
    touchMap();
    return true;
  }
  return false;
}

function botFindPortBlockadeTarget(playerId, from) {
  let best = null;
  let bestScore = 0;
  forEachCell((cell) => {
    if (cell.building?.type !== "port" || !cell.building.owner || !isHostile(playerId, cell.building.owner)) return;
    if (!botCanSeeTarget(playerId, cell)) return;
    if (!neighbors(cell.x, cell.y).some(([x, y]) => getCell(x, y)?.terrain === "water")) return;
    const score = 40 - distance(from, cell) + botCellTargetScore(playerId, cell);
    if (score > bestScore) {
      bestScore = score;
      best = cell;
    }
  });
  return best;
}

function botFindDroneTarget(playerId, from) {
  let best = null;
  let bestScore = -Infinity;
  forEachCell((cell) => {
    if (!cell.owner || !isHostile(playerId, cell.owner)) return;
    if (!botCanSeeTarget(playerId, cell)) return;
    const value = hostileUnitIdsAtCell(playerId, cell).reduce((sum, enemyId) => {
      const units = unitsFor(cell, enemyId);
      return sum + (units.tank || 0) * 6 + (units.mlrs || 0) * 6 + (units.aaPlus || 0) * 5 + (units.ew || 0) * 5 + (units.aa || 0) * 4 + (units.rpg || 0) * 3 + Math.min(units.inf || 0, 3);
    }, 0);
    if (value <= 0) return;
    const score = value * 10 - distance(from, cell);
    if (score > bestScore) {
      bestScore = score;
      best = cell;
    }
  });
  return best;
}

// Ближайшая клетка, находящаяся под атакой врага (для быстрой обороны)
function botFindAttackedCell(playerId) {
  let best = null;
  let bestScore = -1;
  forEachCell(c => {
    if (c.owner !== playerId) return;
    const score = hostileUnitIdsAtCell(playerId, c).reduce((s, id) => s + unitPower(unitsFor(c, id)), 0);
    if (score > bestScore) { bestScore = score; best = c; }
  });
  return bestScore > 0 ? best : null;
}


// §4.2 п.3 Ближайшая клетка-цель для движения к фронту
function findNearestFrontierCell(playerId, from) {
  let nearest = null;
  let minDist = Infinity;
  forEachCell((cell) => {
    if (cell.owner === playerId) return;
    if (cell.terrain === "water" && !cell.building) return;
    const dist = Math.abs(cell.x - from.x) + Math.abs(cell.y - from.y);
    if (dist < minDist) {
      minDist = dist;
      nearest = cell;
    }
  });
  return nearest;
}

// Проверяет — есть ли рядом с клетками бота вражеские войска
function botIsUnderAttack(playerId) {
  let underAttack = false;
  forEachCell((cell) => {
    if (underAttack || cell.owner !== playerId) return;
    underAttack = neighbors(cell.x, cell.y).some(([nx, ny]) => {
      const nc = getCell(nx, ny);
      return nc && hostileUnitIdsAtCell(playerId, nc).length > 0;
    });
  });
  return underAttack;
}

// §5.2 Поиск цели для ракеты вне зоны покрытия ПВО врага
function botFindRocketTargetAvoidAA(playerId, from, radius) {
  let best = null;
  let bestScore = 0;
  for (const cell of allCells(game.map)) {
    if (distance(from, cell) > radius) continue;
    if (!botCanSeeTarget(playerId, cell)) continue;
    if (findHostileAirDefense(playerId, cell.x, cell.y, 4)) continue; // прикрыта ПВО
    const score = botCellTargetScore(playerId, cell, { includeCruiser: true }) - recentBotTargetPenalty(playerId, "rocket", cell);
    if (score > bestScore) { bestScore = score; best = cell; }
  }
  return bestScore > 0 ? best : null;
}

// Returns the highest-value hostile target cell in given radius from `from`.
function botFindShootTarget(playerId, from, radius, options = {}) {
  let best = null;
  let bestScore = 0;
  const includeCruiser = Boolean(options.includeCruiser);
  for (const cell of allCells(game.map)) {
    if (distance(from, cell) > radius) continue;
    if (!botCanSeeTarget(playerId, cell)) continue;
    const score = botCellTargetScore(playerId, cell, { includeCruiser }) - recentBotTargetPenalty(playerId, options.weapon || "rocket", cell);
    if (score > bestScore) { bestScore = score; best = cell; }
  }
  return bestScore > 0 ? best : null;
}

function botFindCruiserTarget(playerId, from) {
  let best = null;
  let bestScore = 0;
  for (const cell of allCells(game.map)) {
    if (!cruiserTargetInLine(from, cell)) continue;
    if (!botCanSeeTarget(playerId, cell)) continue;
    let score = 0;
    for (const enemyId of hostileUnitIdsAtCell(playerId, cell)) {
      const u = unitsFor(cell, enemyId);
      score += (u.cruiser || 0) * 9 + (u.ew || 0) * 5 + (u.boat || 0) * 4 + (u.inf || 0);
    }
    score -= recentBotTargetPenalty(playerId, "cruiser", cell);
    if (score > bestScore) {
      bestScore = score;
      best = cell;
    }
  }
  return bestScore > 0 ? best : null;
}

function botFindRpgTarget(playerId, from) {
  return neighbors(from.x, from.y)
    .map(([x, y]) => getCell(x, y))
    .filter((cell) => cell && botCanSeeTarget(playerId, cell) && rpgCanDamageHostileCell(playerId, cell) && recentBotTargetPenalty(playerId, "rpg", cell) < 999)
    .sort((a, b) => botCellTargetScore(playerId, b) - botCellTargetScore(playerId, a))[0] || null;
}

function rpgCanDamageHostileCell(playerId, cell) {
  return hostileUnitIdsAtCell(playerId, cell).some((enemyId) => {
    const u = unitsFor(cell, enemyId);
    return (u.tank || 0) > 0 || (u.mlrs || 0) > 0 || (u.rocket || 0) > 0 ||
      (u.ew || 0) > 0 ||
      (u.aaPlus || 0) > 0 || (u.aa || 0) > 0;
  });
}

function tankCanDamageHostileCell(playerId, cell) {
  return hostileUnitIdsAtCell(playerId, cell).some((enemyId) => {
    const u = unitsFor(cell, enemyId);
    return (u.inf || 0) > 0 || (u.rpg || 0) > 0 || (u.rocket || 0) > 0 || (u.aa || 0) > 0 ||
      (u.ew || 0) > 0 ||
      (u.aaPlus || 0) > 0 || (u.boat || 0) > 0;
  });
}

function botCellTargetScore(playerId, cell, options = {}) {
  if (!cell) return 0;
  let score = 0;
  for (const enemyId of hostileUnitIdsAtCell(playerId, cell)) {
    const u = unitsFor(cell, enemyId);
    score += (u.inf || 0) +
      (u.rpg || 0) * 3 +
      (u.tank || 0) * 3 +
      (u.rocket || 0) * 4 +
      (u.mlrs || 0) * 5 +
      (u.aa || 0) * 2 +
      (u.aaPlus || 0) * 5 +
      (u.ew || 0) * 4 +
      (u.boat || 0) +
      (options.includeCruiser ? (u.cruiser || 0) * 7 : 0);
  }
  if (cell.building?.owner && isHostile(playerId, cell.building.owner)) {
    score += botNukeBuildingValue(cell.building.type);
  }
  return score;
}

function botCanSeeTarget(playerId, cell) {
  if (!activeEventType("fog")) return true;
  if (!cell) return false;
  if (cell.owner === playerId || controlsOwner(playerId, cell.owner)) return true;
  return neighbors(cell.x, cell.y).some(([x, y]) => {
    const near = getCell(x, y);
    return near && (near.owner === playerId || controlsOwner(playerId, near.owner));
  });
}

function rememberBotTarget(playerId, weapon, cell) {
  if (!cell) return;
  game.botTargetMemory = game.botTargetMemory || {};
  game.botTargetMemory[playerId] = game.botTargetMemory[playerId] || {};
  game.botTargetMemory[playerId][weapon] = game.botTargetMemory[playerId][weapon] || [];
  const now = Date.now();
  game.botTargetMemory[playerId][weapon] = game.botTargetMemory[playerId][weapon]
    .filter((entry) => now - entry.at < (BOT_TARGET_MEMORY_MS[weapon] || 30_000));
  game.botTargetMemory[playerId][weapon].push({ x: cell.x, y: cell.y, at: now });
}

function recentBotTargetPenalty(playerId, weapon, cell) {
  const now = Date.now();
  const entries = game.botTargetMemory?.[playerId]?.[weapon] || [];
  const ttl = BOT_TARGET_MEMORY_MS[weapon] || 30_000;
  const radius = weapon === "nuke" ? 2 : 1;
  return entries.some((entry) => now - entry.at < ttl && distance(entry, cell) <= radius) ? 999 : 0;
}

function tryBotNuke(playerId) {
  const player = game.players[playerId];
  if (!player?.nuclearRush && player.personality !== "industrial" && player.personality !== "aggressive") return false;
  if (!playerHasBuilding(playerId, "nuclearPlant")) return false;
  const plant = readyNuclearPlant(playerId);
  if (!plant) return false;
  if (!canPay(player, NUCLEAR_COST)) return false;

  const target = botFindNukeTarget(playerId);
  if (!target) return false;
  rememberBotTarget(playerId, "nuke", target);
  launchNuke(playerId, target, null, plant);
  recomputePlayerFlags();
  checkVictory();
  return true;
}

function botFindNukeTarget(playerId) {
  let best = null;
  let bestScore = 0;

  for (const target of allCells(game.map)) {
    if (recentBotTargetPenalty(playerId, "nuke", target) >= 999) continue;
    if (!botCanSeeTarget(playerId, target)) continue;
    if (findHostileNuclearDefense(playerId, target.x, target.y, 5)) continue;
    let score = 0;
    let hostileValue = 0;

    for (let y = target.y - 1; y <= target.y + 1; y += 1) {
      for (let x = target.x - 1; x <= target.x + 1; x += 1) {
        const cell = getCell(x, y);
        if (!cell) continue;

        for (const id of PLAYER_IDS) {
          const units = unitsFor(cell, id);
          const value = (units.inf || 0) + (units.rpg || 0) * 2 + (units.tank || 0) * 4 + (units.rocket || 0) * 4 +
            (units.aa || 0) * 2 + (units.aaPlus || 0) * 5 + (units.mlrs || 0) * 5 + (units.boat || 0);
          if (!value) continue;
          if (id === playerId || isAllied(playerId, id)) score -= value * 2;
          if (isHostile(playerId, id)) {
            score += value;
            hostileValue += value;
          }
        }

        if (cell.building?.owner) {
          const owner = cell.building.owner;
          const buildingValue = botNukeBuildingValue(cell.building.type);
          if (owner === playerId || isAllied(playerId, owner)) score -= buildingValue * 2;
          if (isHostile(playerId, owner)) {
            score += buildingValue;
            hostileValue += buildingValue;
          }
        }
      }
    }

    if (hostileValue < 16) continue;
    if (score > bestScore) {
      bestScore = score;
      best = target;
    }
  }

  return bestScore >= 16 ? best : null;
}

function botNukeBuildingValue(type) {
  return {
    hq: 18,
    nuclearPlant: 14,
    factory: 10,
    barracks: 7,
    minePlus: 8,
    mine: 5,
    port: 5,
    city: 4,
    village: 3,
    farm: 2
  }[type] || 2;
}

// Anarchists shoot with tank / rocket / mlrs when targets are in range.
function tryBotShoot(playerId) {
  const player = game.players[playerId];
  const cells = shuffle(allCells(game.map).filter((cell) => cell.owner === playerId));
  const cruiserCells = shuffle(allCells(game.map).filter((cell) => unitsFor(cell, playerId).cruiser > 0));
  const conserveRocketsInRain = activeEventType("rain") && player.personality !== "aggressive" && !botIsUnderAttack(playerId);

  for (const from of cruiserCells) {
    if (!weaponCooldownReady(from, playerId, "cruiser")) continue;
    const target = botFindCruiserTarget(playerId, from);
    if (!target) continue;
    if (maybeMisfire(playerId, from, "cruiser")) return true;
    rememberBotTarget(playerId, "cruiser", target);
    const lossSnapshot = armyGoldSnapshot();
    const techBefore = hostileTechUnitCount(playerId, target);
    for (let index = 0; index < 2; index += 1) {
      damageCruiserCell(playerId, target);
      pruneWeaponCooldowns(target);
    }
    setWeaponCooldown(from, player, playerId, "cruiser");
    applyArmyLossEffects(lossSnapshot, playerId);
    emitTechDestroyedIfChanged(techBefore, target, playerId);
    emitSfx("shot", from.x, from.y, { weapon: "cruiser", playerId });
    emitExplosions([{ x: target.x, y: target.y, kind: "cruiser" }]);
    addSystemEvent(`${player.country} стреляет крейсером по ${cellTargetName(target, playerId)}.`, { sound: "alert" });
    touchMap();
    return true;
  }

  for (const from of cells) {
    const units = unitsFor(from, playerId);

    if (units.rpg > 0 && weaponCooldownReady(from, playerId, "rpg") && canPay(player, { ammo: 1 })) {
      const target = botFindRpgTarget(playerId, from);
      if (target) {
        if (maybeMisfire(playerId, from, "rpg")) return true;
        const lossSnapshot = armyGoldSnapshot();
        const techBefore = hostileTechUnitCount(playerId, target);
        const hit = damageRpgCell(playerId, target);
        if (hit) {
          rememberBotTarget(playerId, "rpg", target);
          spend(player, { ammo: 1 });
          applyArmyLossEffects(lossSnapshot, playerId);
          emitTechDestroyedIfChanged(techBefore, target, playerId);
          pruneWeaponCooldowns(target);
          setWeaponCooldown(from, player, playerId, "rpg");
          emitSfx("shot", from.x, from.y, { weapon: "rpg", playerId });
          emitExplosions([{ x: target.x, y: target.y, kind: "tank" }]);
          addSystemEvent(`${player.country} стреляет из РПГ по ${cellTargetName(target, playerId)}, цель: ${hit.label}${hit.destroyed ? "" : " не уничтожена"}.`, { sound: "alert" });
          touchMap();
          return true;
        }
      }
    }

    // ── Tank (adjacent hostile) ── §5.1 Приоритет: ракета/РСЗО → ПВО → пехота → здания
    if (units.tank > 0 && weaponCooldownReady(from, playerId, "tank")) {
      const adjCells = neighbors(from.x, from.y).map(([x, y]) => getCell(x, y)).filter(Boolean);
      // Приоритет целей для танка
      const target =
        adjCells.find((cell) => hostileUnitIdsAtCell(playerId, cell).some((id) => unitsFor(cell, id).rocket > 0 || unitsFor(cell, id).mlrs > 0)) ||
        adjCells.find((cell) => hostileUnitIdsAtCell(playerId, cell).some((id) => unitsFor(cell, id).aaPlus > 0)) ||
        adjCells.find((cell) => hostileUnitIdsAtCell(playerId, cell).some((id) => unitsFor(cell, id).aa > 0)) ||
        adjCells.find((cell) => tankCanDamageHostileCell(playerId, cell) && recentBotTargetPenalty(playerId, "tank", cell) < 999);
      if (target) {
        if (maybeMisfire(playerId, from, "tank")) return true;
        rememberBotTarget(playerId, "tank", target);
        const lossSnapshot = armyGoldSnapshot();
        const techBefore = hostileTechUnitCount(playerId, target);
        for (const enemyId of hostileUnitIdsAtCell(playerId, target)) {
          const eu = unitsFor(target, enemyId);
          eu.inf    = Math.max(0, eu.inf    - 2);
          eu.rpg    = Math.max(0, eu.rpg    - 1);
          eu.rocket = Math.max(0, eu.rocket - 1);
          eu.aa     = Math.max(0, eu.aa     - 1);
          eu.aaPlus = Math.max(0, eu.aaPlus - 1);
          eu.boat   = Math.max(0, eu.boat   - 1);
        }
        applyArmyLossEffects(lossSnapshot, playerId);
        emitTechDestroyedIfChanged(techBefore, target, playerId);
        pruneWeaponCooldowns(target);
        setWeaponCooldown(from, player, playerId, "tank");
        emitSfx("shot", from.x, from.y, { weapon: "tank", playerId });
        emitExplosions([{ x: target.x, y: target.y, kind: "tank" }]);
        addSystemEvent(`${player.country} стреляет танком по ${cellTargetName(target, playerId)}.`, { sound: "alert" });
        touchMap();
        return true;
      }
    }

    // ── Rocket (radius 5) ── §5.2 Проверяем ПВО, ищем цель вне его зоны
    if (!conserveRocketsInRain && units.rocket > 0 && weaponCooldownReady(from, playerId, "rocket")) {
      let target = botFindShootTarget(playerId, from, 5, { includeCruiser: true });
      if (target) {
        // Если цель прикрыта ПВО — ищем альтернативную цель без прикрытия
        let blocker = findHostileAirDefense(playerId, target.x, target.y, 4);
        if (blocker) {
          const altTarget = botFindRocketTargetAvoidAA(playerId, from, 5);
          if (altTarget) {
            target = altTarget;
            blocker = null;
          }
        }
        if (blocker) continue;
        if (maybeMisfire(playerId, from, "rocket")) return true;
        rememberBotTarget(playerId, "rocket", target);
        launchRocketStrike(playerId, from, target);
        return true;
      }
    }

    // ── MLRS (radius 4) ──
    if (!conserveRocketsInRain && units.mlrs > 0 && weaponCooldownReady(from, playerId, "mlrs")) {
      const target = botFindShootTarget(playerId, from, 4, { weapon: "mlrs" });
      if (target) {
        if (maybeMisfire(playerId, from, "mlrs")) return true;
        rememberBotTarget(playerId, "mlrs", target);
        const lossSnapshot = armyGoldSnapshot();
        const blasts = [];
        for (const cell of mlrsSalvoCells(target)) {
          const techBefore = hostileTechUnitCount(playerId, cell);
          damageMlrsCell(playerId, cell);
          emitTechDestroyedIfChanged(techBefore, cell, playerId);
          pruneWeaponCooldowns(cell);
          blasts.push({ x: cell.x, y: cell.y, kind: "mlrs" });
        }
        setWeaponCooldown(from, player, playerId, "mlrs");
        applyArmyLossEffects(lossSnapshot, playerId);
        emitSfx("shot", from.x, from.y, { weapon: "mlrs", playerId });
        emitExplosions(blasts);
        for (const blast of blasts) {
          emitSfx("rszo_hit", blast.x, blast.y, { playerId });
        }
        addSystemEvent(`${player.country} накрывает ${cellTargetName(target, playerId)} залпом РСЗО.`, { sound: "alert" });
        touchMap();
        return true;
      }
    }
  }
  return false;
}

function movableLandPower(units) {
  return (units.inf || 0) + (units.rpg || 0) + (units.tank || 0) + (units.mlrs || 0);
}

function broadcastLobby() {
  for (const client of clientsForCurrentGame()) {
    send(client, lobbyPayloadFor(client));
  }
}

function lobbyPayloadFor(client = null) {
  const room = game || clientGame(client);
  if (!room) return emptyLobbyPayload();

  const players = {};
  for (const id of HUMAN_IDS) {
    const player = room.players[id];
    players[id] = player
      ? {
          id,
          joined: player.joined,
          connected: player.connected,
          country: player.country,
          color: player.color,
          colorValue: player.colorValue,
          ideology: player.ideology
        }
      : null;
  }

  return {
    type: "lobby",
    status: room.status,
    created: room.lobbyCreated,
    hostId: room.lobbyHostId,
    code: client?.playerId === room.lobbyHostId ? room.lobbyCode : null,
    settings: room.settings || defaultLobbySettings(),
    bots: botLobbyPayload(),
    players,
    maxHumans: sanitizeHumanCount((room.settings || defaultLobbySettings()).maxHumans),
    minHumans: MIN_HUMAN_PLAYERS,
    maxHumanLimit: MAX_HUMAN_PLAYERS,
    colors: COLOR_OPTIONS
  };
}

function broadcastState() {
  if (!game || game.stateBroadcastTimer) return;
  const room = game;
  room.stateBroadcastTimer = setTimeout(() => withGame(room, flushStateBroadcast), STATE_BROADCAST_DELAY_MS);
  room.stateBroadcastTimer.unref?.();
}

function flushStateBroadcast() {
  if (!game) return;
  game.stateBroadcastTimer = null;
  game.stateVersion += 1;
  const stateSnapshot = serializeState(false);
  const mapSnapshot = hasClientNeedingMap() ? serializeMap() : null;
  const chatSnapshot = hasClientNeedingChat() ? game.chat : null;
  for (const client of clientsForCurrentGame()) {
    sendState(client, stateSnapshot, mapSnapshot, chatSnapshot);
  }
}

function broadcastStateNow() {
  clearPendingStateBroadcast();
  game.stateVersion += 1;
  const stateSnapshot = serializeState(false);
  const mapSnapshot = hasClientNeedingMap() ? serializeMap() : null;
  const chatSnapshot = hasClientNeedingChat() ? game.chat : null;
  for (const client of clientsForCurrentGame()) {
    sendState(client, stateSnapshot, mapSnapshot, chatSnapshot);
  }
}

function clearPendingStateBroadcast() {
  if (!game?.stateBroadcastTimer) return;
  clearTimeout(game.stateBroadcastTimer);
  game.stateBroadcastTimer = null;
}

function touchMap() {
  game.mapVersion += 1;
}

function hasClientNeedingMap() {
  for (const client of clientsForCurrentGame()) {
    if (client.lastMapVersionSent !== game.mapVersion) return true;
  }
  return false;
}

function hasClientNeedingChat() {
  for (const client of clientsForCurrentGame()) {
    if (client.lastChatVersionSent !== game.chatVersion) return true;
  }
  return false;
}

function sendState(client, stateSnapshot = serializeState(false), mapSnapshot = null, chatSnapshot = null) {
  const mustSendMap = client.lastMapVersionSent !== game.mapVersion || Boolean(stateSnapshot.map);
  const mustSendChat = client.lastChatVersionSent !== game.chatVersion || Boolean(stateSnapshot.chat);
  const stateForClient = { ...stateSnapshot };
  if (mustSendMap) stateForClient.map = stateSnapshot.map || mapSnapshot || serializeMap();
  if (mustSendChat) stateForClient.chat = stateSnapshot.chat || chatSnapshot || game.chat;
  const privatePlayer = client.playerId ? game.players[client.playerId] : null;
  const personalizedState = {
    ...stateForClient,
    private: {
      scoutReports: privatePlayer?.scoutReports || {}
    }
  };

  const sent = send(client, {
    type: "state",
    you: client.playerId,
    spectator: client.spectator,
    state: personalizedState
  });
  if (sent && mustSendMap) {
    client.lastMapVersionSent = game.mapVersion;
  }
  if (sent && mustSendChat) {
    client.lastChatVersionSent = game.chatVersion;
  }
}

function serializeState(includeMap = true) {
  const now = Date.now();
  const players = {};

  for (const id of PLAYER_IDS) {
    const player = game.players[id];
    if (!player) {
      players[id] = null;
      continue;
    }

    players[id] = {
      id,
      country: player.country,
      color: player.color,
      colorValue: player.colorValue,
      ideology: player.ideology,
      connected: player.connected,
      joined: player.joined,
      isBot: player.isBot,
      personality: player.personality,
      hqLost: player.hqLost,
      hqDestroyed: player.hqDestroyed,
      hqRebuild: player.hqDestroyed ? hqRebuildSeconds(player, now) : 0,
      defeated: Boolean(player.defeated),
      vassalOf: player.vassalOf || null,
      devAlwaysMisfire: Boolean(player.devAlwaysMisfire),
      ammoCapacity: ammoCapacity(id),
      specialOpCooldown: Math.max(0, Math.ceil(((player.specialOpCooldown || 0) - now) / 1000)),
      mobilization: mobilizationActive(id),
      resources: formatResources(player.resources),
      cooldowns: serializePlayerCooldowns(id, now),
      stats: computeStats(id)
    };
  }

  const snapshot = {
    status: game.status,
    version: game.stateVersion,
    mapVersion: game.mapVersion,
    width: WIDTH,
    height: HEIGHT,
    players,
    relations: game.relations,
    diplomacyOffers: game.diplomacyOffers,
    ultimatums: game.ultimatums,
    resourceRequests: game.resourceRequests,
    activeEvent: serializeTimedEvent(game.activeEvent, now),
    pendingEvent: serializeTimedEvent(game.pendingEvent, now),
    chatVersion: game.chatVersion,
    ended: game.ended,
    serverTime: now
  };

  if (includeMap) {
    snapshot.map = serializeMap(now);
  }

  return snapshot;
}

function serializePlayerCooldowns(playerId, now = Date.now()) {
  const player = game.players[playerId];
  const cooldowns = { ...(player?.cooldowns || {}) };
  cooldowns.nuke = nextNukeCooldownUntil(playerId, now);
  return Object.fromEntries(Object.entries(cooldowns).map(([key, until]) => [key, Math.max(0, Math.ceil(((until || 0) - now) / 1000))]));
}

function serializeMap(now = Date.now()) {
  return game.map.map((row) => row.map((cell) => ({
    x: cell.x,
    y: cell.y,
    terrain: cell.terrain,
    owner: cell.owner,
    building: serializeBuilding(cell.building),
    construction: serializeConstruction(cell.construction, now),
    units: serializeUnits(cell.units),
    cooldowns: serializeCellCooldowns(cell.cooldowns, now)
  })));
}

function serializeBuilding(building) {
  if (!building) return null;
  const result = {
    type: building.type,
    owner: building.owner
  };
  if (building.originalOwner) result.originalOwner = building.originalOwner;
  if (building.strikeUntil) result.strikeUntil = building.strikeUntil;
  if (building.blockadedBy) result.blockadedBy = building.blockadedBy;
  return result;
}

function serializeConstruction(construction, now = Date.now()) {
  if (!construction) return null;
  return {
    type: construction.type,
    kind: construction.kind,
    owner: construction.owner,
    label: construction.label || "",
    completesAt: construction.completesAt || 0,
    remaining: Math.max(0, Math.ceil(((construction.completesAt || now) - now) / 1000))
  };
}

function serializeUnits(unitsByPlayer = {}) {
  const result = {};
  for (const [playerId, units] of Object.entries(unitsByPlayer)) {
    const packed = {};
    for (const [unit, count] of Object.entries(units || {})) {
      if (count) packed[unit] = count;
    }
    if (Object.keys(packed).length) result[playerId] = packed;
  }
  return result;
}

function serializeCellCooldowns(cooldownsByPlayer = {}, now = Date.now()) {
  const result = {};
  for (const [playerId, cooldowns] of Object.entries(cooldownsByPlayer)) {
    const packed = {};
    for (const [weapon, until] of Object.entries(cooldowns || {})) {
      if (until > now) packed[weapon] = until;
    }
    if (Object.keys(packed).length) result[playerId] = packed;
  }
  return result;
}

function serializeTimedEvent(event, now = Date.now()) {
  if (!event) return null;
  const definition = RANDOM_EVENTS[event.type] || {};
  return {
    type: event.type,
    label: event.label || definition.label || event.type,
    endsAt: event.endsAt || 0,
    startsAt: event.startsAt || 0,
    endsIn: Math.max(0, Math.ceil(((event.endsAt || event.startsAt || now) - now) / 1000)),
    startsIn: event.startsAt ? Math.max(0, Math.ceil((event.startsAt - now) / 1000)) : 0
  };
}

function emitExplosions(blasts) {
  const explosions = blasts.map((blast) => ({
    id: ++game.explosionId,
    x: blast.x,
    y: blast.y,
    kind: blast.kind,
    at: Date.now()
  }));
  broadcast({ type: "explosions", explosions });
}

function recomputePlayerFlags() {
  for (const playerId of PLAYER_IDS) {
    const player = game.players[playerId];
    if (!player) continue;
    const wasLost = player.hqLost;
    const hqCell = findHqCell(playerId);
    player.hqLost = player.hqDestroyed || !hqCell || hqCell.owner !== playerId || hqCell.building?.owner !== playerId;
    if (player.isBot && !wasLost && player.hqLost) {
      botSayPhrase(playerId, "underAttack");

      // §7 Спецправило Фермеров: при атаке HQ — немедленно мобилизовать всю пехоту из казарм к HQ
      if (player.personality === "passive" && hqCell) {
        botMobilizeToHQ(playerId, hqCell);
      }

      // §7 Спецправило Анархистов: при угрозе HQ — nuclear rush
      if (player.personality === "aggressive") {
        player.nuclearRush = true;
      }
    }

    // §7 Спецправило Механиков: iron > 30 → накапливаем на ядерку
    if (player.isBot && player.personality === "industrial" && (player.resources.iron || 0) > 30) {
      player.nuclearRush = true;
    }
  }
}

function syncVassalDiplomacy() {
  let changed = false;
  for (const vassalId of PLAYER_IDS) {
    const vassal = game.players[vassalId];
    const overlordId = vassal?.vassalOf;
    const overlord = game.players[overlordId];
    if (!vassal || !overlordId) continue;
    if (!overlord || overlord.defeated) {
      vassal.vassalOf = null;
      changed = true;
      continue;
    }
    if (game.relations[pairKey(vassalId, overlordId)] !== "alliance") {
      setRelation(vassalId, overlordId, "alliance");
      changed = true;
    }
    const offersBefore = game.diplomacyOffers.length;
    const ultimatumsBefore = game.ultimatums.length;
    const requestsBefore = game.resourceRequests.length;
    game.diplomacyOffers = game.diplomacyOffers.filter((offer) => offer.from !== vassalId && offer.to !== vassalId);
    game.ultimatums = game.ultimatums.filter((item) => item.from !== vassalId && item.to !== vassalId);
    game.resourceRequests = game.resourceRequests.filter((request) => request.from !== vassalId && request.to !== vassalId);
    if (offersBefore !== game.diplomacyOffers.length || ultimatumsBefore !== game.ultimatums.length || requestsBefore !== game.resourceRequests.length) {
      changed = true;
    }
    for (const id of PLAYER_IDS) {
      if (id === vassalId || id === overlordId || isDefeated(id)) continue;
      const masterRelation = relationStatus(overlordId, id);
      const key = pairKey(vassalId, id);
      if (masterRelation === "war" && game.relations[key] !== "war") {
        setRelation(vassalId, id, "war");
        changed = true;
      } else if (masterRelation === "alliance" && game.relations[key] !== "alliance") {
        setRelation(vassalId, id, "alliance");
        changed = true;
      } else if (masterRelation === "neutral" && game.relations[key]) {
        clearRelation(vassalId, id);
        changed = true;
      }
    }
  }
  return changed;
}

function maybeCapitulateBots() {
  let changed = false;
  for (const botId of activeBotIds()) {
    const bot = game.players[botId];
    if (!bot || bot.defeated || bot.vassalOf) continue;
    const enemies = PLAYER_IDS
      .filter((id) => id !== botId && !isDefeated(id) && isHostile(botId, id))
      .sort((a, b) => (computeStats(b).power + computeStats(b).cells) - (computeStats(a).power + computeStats(a).cells));
    const overlordId = enemies[0];
    if (!overlordId) continue;

    const stats = computeStats(botId);
    const enemyStats = computeStats(overlordId);
    const hqGone = bot.hqLost || bot.hqDestroyed || !findHqCell(botId);
    const crushedCells = stats.cells <= 4;
    const crushedArmy = stats.power <= 2 && enemyStats.power >= 7;
    const overwhelmed = stats.cells <= 8 && enemyStats.cells >= stats.cells * 1.8 && enemyStats.power >= stats.power * 1.6 + 4;
    const hqCollapse = hqGone && stats.cells <= 10 && enemyStats.power >= Math.max(4, stats.power);
    if (!crushedCells && !crushedArmy && !overwhelmed && !hqCollapse) continue;

    capitulateBot(botId, overlordId);
    changed = true;
  }
  return changed;
}

function capitulateBot(botId, overlordId) {
  const bot = game.players[botId];
  const overlord = game.players[overlordId];
  if (!bot || !overlord || bot.defeated) return false;
  return forceVassalage(botId, overlordId, `${bot.country} капитулирует и становится вассалом ${overlord.country}.`);
}

// §7 Фермеры: мобилизация пехоты из казарм к HQ
function botMobilizeToHQ(playerId, hqCell) {
  forEachCell((cell) => {
    if (cell.owner !== playerId) return;
    if (cell.building?.type !== "barracks") return;
    const u = unitsFor(cell, playerId);
    if (u.inf <= 0) return;
    // Перемещаем пехоту в сторону HQ
    const path = neighbors(cell.x, cell.y)
      .map(([nx, ny]) => getCell(nx, ny))
      .filter((nc) => nc && nc.owner === playerId && isPassable(nc));
    if (!path.length) return;
    const step = path.sort((a, b) => {
      const da = Math.abs(a.x - hqCell.x) + Math.abs(a.y - hqCell.y);
      const db = Math.abs(b.x - hqCell.x) + Math.abs(b.y - hqCell.y);
      return da - db;
    })[0];
    if (!step) return;
    const ammoCost = movementAmmoCost(u.inf, playerId, cell);
    const player = game.players[playerId];
    if (!canPay(player, { ammo: ammoCost })) return;
    spend(player, { ammo: ammoCost });
    unitsFor(step, playerId).inf += u.inf;
    u.inf = 0;
  });
}

function botSayPhrase(playerId, event) {
  return;
}

function checkVictory() {
  if (game.status !== "running") return;
  const now = Date.now();
  markExpiredDefeats(now);

  for (const playerId of PLAYER_IDS) {
    const player = game.players[playerId];
    if (!player) continue;
    if (!player.defeated && computeStats(playerId).cells <= 0) {
      markPlayerDefeated(playerId);
    }
  }

  const contenders = activeContenderIds();
  const targetHumanCount = sanitizeHumanCount(game.settings?.maxHumans);
  if (game.continuedWithBots || targetHumanCount <= 1) {
    if (contenders.length === 1) {
      endGame(contenders[0], `${game.players[contenders[0]]?.country || "Победитель"} осталась последней страной.`);
    }
    return;
  }

  const humanContenders = joinedHumanIds(game).filter((id) => {
    const player = game.players[id];
    return player && !player.defeated && computeStats(id).cells > 0;
  });
  if (humanContenders.length === 1) {
    endGame(humanContenders[0], `${game.players[humanContenders[0]]?.country || "Победитель"} осталась последней страной игрока.`);
  } else if (humanContenders.length === 0 && contenders.length) {
    endGame(contenders[0], "Все игроки потеряли свои страны.");
  }
}

function endGame(winnerId, reason) {
  if (game.status === "ended") return;
  game.status = "ended";
  game.ended = {
    winnerId,
    winner: game.players[winnerId]?.country || "Победитель",
    reason,
    at: Date.now()
  };
  addSystemEvent(`${game.ended.winner} победила. ${reason}`, { sound: "win" });
  clearInterval(game.timer);
  game.timer = null;
}

function activeContenderIds() {
  return PLAYER_IDS.filter((id) => {
    const player = game.players[id];
    return player && player.joined && !player.defeated && computeStats(id).cells > 0;
  });
}

function captureCell(playerId, cell) {
  const previousOwner = cell.owner;
  const capturedBuilding = cell.building;
  const capturedBuildingOwner = capturedBuilding?.owner || previousOwner;
  cell.owner = playerId;
  if (previousOwner !== playerId) {
    emitReport(cell.x, cell.y, previousOwner ? "Территория захвачена" : "Нейтральная клетка занята", "capture");
    if (previousOwner) emitSfx("attack", cell.x, cell.y, { playerId });
  }
  for (const enemyId of hostilePlayerIds(playerId)) {
    clearWeaponCooldowns(cell, enemyId);
  }
  if (capturedBuilding?.type === "hq" && (capturedBuilding.originalOwner || capturedBuilding.owner) !== playerId) {
    destroyBuilding(cell, playerId);
  } else if (cell.building) {
    cell.building.owner = playerId;
    if (previousOwner && previousOwner !== playerId && capturedBuilding?.type === "ammoDepot") {
      clampAmmoToCapacity(previousOwner);
    }
    if (previousOwner && previousOwner !== playerId && ["village", "city"].includes(capturedBuilding?.type)) {
      applySettlementPopulationLoss(capturedBuildingOwner, capturedBuilding.type);
    }
  }

  // Если нейтральный бот потерял клетку — немедленно объявляет войну захватчику
  if (previousOwner && previousOwner !== playerId &&
      game.players[previousOwner]?.isBot &&
      relationStatus(playerId, previousOwner) !== "war") {
    const defenderCommander = game.players[previousOwner].vassalOf || previousOwner;
    declareWar(defenderCommander, playerId);
    botSayPhrase(defenderCommander, "war");
    if (game.players[previousOwner]) game.players[previousOwner].lastBotAction = 0;
  }

  // §8 Союзник теряет клетку — боты-союзники форсируют следующий тик для возможной поддержки
  if (previousOwner && previousOwner !== playerId) {
    for (const botId of activeBotIds()) {
      if (botId === playerId) continue;
      if (relationStatus(botId, previousOwner) === "alliance") {
        // Форсируем действие: бот попытается ударить по захватчику в ближайшем тике
        if (game.players[botId]) game.players[botId].lastBotAction = 0;
      }
    }
  }
}

function destroyBuilding(cell, attackerId = null) {
  const building = cell.building;
  if (!building) return;
  const ownerId = building.owner;
  const originalOwner = building.originalOwner || ownerId;

  if (building.type === "hq") {
    if (game.players[originalOwner]) {
      game.players[originalOwner].hqDestroyed = true;
      game.players[originalOwner].hqDestroyedAt = Date.now();
      addSystemEvent(`${game.players[originalOwner].country} потеряла штаб. Есть 100 секунд на восстановление.`, { sound: "alert" });
    }
  } else if ((building.type === "city" || building.type === "village") && game.players[ownerId]) {
    applySettlementPopulationLoss(ownerId, building.type);
  }

  if (attackerId && ownerId && attackerId !== ownerId && isHostile(attackerId, ownerId) && activeEventType("looter")) {
    const attacker = game.players[attackerId];
    const goldBonus = Math.floor((BUILDINGS[building.type]?.cost?.gold || 0) * 0.5);
    if (attacker && goldBonus > 0) addResource(attacker, "gold", goldBonus);
  }

  cell.building = null;
  if (building.type === "ammoDepot" && ownerId) clampAmmoToCapacity(ownerId);
  emitSfx("d_house", cell.x, cell.y, { playerId: attackerId || ownerId || null });
  emitReport(cell.x, cell.y, building.type === "hq" ? "Штаб потерян" : "Постройка уничтожена", "loss");
}

function airDefenseSabotaged(cell, playerId, now = Date.now()) {
  return (cell?.airDefenseSabotage?.[playerId] || 0) > now;
}

function bunkerProtects(cell, playerId) {
  return cell?.building?.type === "bunker" && cell.building.owner === playerId;
}

function findAirDefense(playerId, x, y, radius) {
  let found = null;
  const now = Date.now();
  forEachCell((cell) => {
    if (airDefenseSabotaged(cell, playerId, now)) return;
    const units = unitsFor(cell, playerId);
    if (!found && ((units.aa || 0) > 0 || (units.aaPlus || 0) > 0) && distance(cell, { x, y }) <= radius) {
      found = cell;
    }
  });
  return found;
}

function findNuclearDefense(playerId, x, y, radius) {
  let found = null;
  const now = Date.now();
  forEachCell((cell) => {
    if (airDefenseSabotaged(cell, playerId, now)) return;
    if (!found && (unitsFor(cell, playerId).aaPlus || 0) > 0 && distance(cell, { x, y }) <= radius) {
      found = cell;
    }
  });
  return found;
}

function findHostileEwDefense(playerId, x, y) {
  let found = null;
  forEachCell((cell) => {
    if (found) return;
    for (const enemyId of hostilePlayerIds(playerId)) {
      if ((unitsFor(cell, enemyId).ew || 0) > 0 && distance(cell, { x, y }) <= 1) {
        found = { cell, ownerId: enemyId };
        return;
      }
    }
  });
  return found;
}

function interceptDronesEnteringCell(playerId, cell, moved) {
  if (!cell || (moved.drone || 0) <= 0) return false;
  const blocker = findHostileEwDefense(playerId, cell.x, cell.y);
  if (!blocker) return false;
  const lossSnapshot = armyGoldSnapshot();
  moved.drone = 0;
  applyArmyLossEffects(lossSnapshot, blocker.ownerId);
  emitSfx("shot", blocker.cell.x, blocker.cell.y, { weapon: "aa", playerId: blocker.ownerId });
  emitExplosions([{ x: cell.x, y: cell.y, kind: "aa" }]);
  addSystemEvent(`${game.players[blocker.ownerId]?.country || "РЭБ"} сбивает вражеский дрон у ${cell.x + 1}:${cell.y + 1}.`, { sound: "alert" });
  return true;
}

function interceptShahedsEnteringCell(playerId, cell, moved) {
  if (!cell || (moved.saboteur || 0) <= 0) return false;
  const blocker = findHostileAirDefense(playerId, cell.x, cell.y, 4);
  if (!blocker) return false;
  const lossSnapshot = armyGoldSnapshot();
  const blockerOwner = airDefenseOwnerAtCell(blocker, playerId);
  moved.saboteur = 0;
  applyArmyLossEffects(lossSnapshot, blockerOwner || playerId);
  emitSfx("shot", blocker.x, blocker.y, { weapon: "aa", playerId: blockerOwner || playerId });
  emitExplosions([{ x: cell.x, y: cell.y, kind: "aa" }]);
  addSystemEvent(`ПВО сбивает шахед у ${cell.x + 1}:${cell.y + 1}.`, { sound: "alert" });
  return true;
}

function airDefenseOwnerAtCell(cell, attackerId) {
  return hostilePlayerIds(attackerId).find((id) => {
    const units = unitsFor(cell, id);
    return (units.aa || 0) > 0 || (units.aaPlus || 0) > 0;
  }) || null;
}

function interceptHostileDronesNearEw(playerId, ewCell) {
  let intercepted = false;
  const blasts = [];
  forEachCell((cell) => {
    if (distance(cell, ewCell) > 1) return;
    for (const enemyId of hostilePlayerIds(playerId)) {
      const units = unitsFor(cell, enemyId);
      if ((units.drone || 0) <= 0) continue;
      units.drone = 0;
      intercepted = true;
      blasts.push({ x: cell.x, y: cell.y, kind: "aa" });
    }
  });
  if (intercepted) {
    emitSfx("shot", ewCell.x, ewCell.y, { weapon: "aa", playerId });
    emitExplosions(blasts);
  }
  return intercepted;
}

function interceptHostileShahedsNearAirDefense(playerId, aaCell) {
  let intercepted = false;
  const blasts = [];
  forEachCell((cell) => {
    if (distance(cell, aaCell) > 4) return;
    for (const enemyId of hostilePlayerIds(playerId)) {
      const units = unitsFor(cell, enemyId);
      if ((units.saboteur || 0) <= 0) continue;
      units.saboteur = 0;
      intercepted = true;
      blasts.push({ x: cell.x, y: cell.y, kind: "aa" });
    }
  });
  if (intercepted) {
    emitSfx("shot", aaCell.x, aaCell.y, { weapon: "aa", playerId });
    emitExplosions(blasts);
  }
  return intercepted;
}

function findHqCell(originalOwner) {
  let found = null;
  forEachCell((cell) => {
    if (!found && cell.building?.type === "hq" && cell.building.originalOwner === originalOwner) {
      found = cell;
    }
  });
  return found;
}

function findRecruitCell(playerId, unitKind = "") {
  const recruits = [];
  forEachCell((cell) => {
    if (controlsCell(playerId, cell) && canRecruitOn(cell, playerId)) {
      recruits.push(cell);
    }
  });
  if (!unitKind) return recruits[0] || null;

  const definition = UNITS[unitKind];
  const viable = recruits.filter((cell) => definition?.stack || unitsFor(cell, playerId)[unitKind] <= 0);
  if (!viable.length) return null;

  if (unitKind === "inf") {
    const struckFactory = viable.find((cell) =>
      cell.building?.type === "factory" &&
      cell.building.owner === playerId &&
      (cell.building.strikeUntil || 0) > Date.now() &&
      (unitsFor(cell, playerId).inf || 0) <= 0
    );
    if (struckFactory) return struckFactory;
  }

  // Ракеты — неподвижные, ставим их как можно ближе к ближайшему врагу
  if (unitKind === "rocket" || unitKind === "aa" || unitKind === "aaPlus" || unitKind === "ew") {
    const enemies = allCells(game.map).filter(c => c.owner && isHostile(playerId, c.owner));
    if (enemies.length > 0) {
      const scored = viable.map(cell => {
        const minEnemyDist = Math.min(...enemies.map(e => Math.abs(cell.x - e.x) + Math.abs(cell.y - e.y)));
        return { cell, minEnemyDist };
      });
      scored.sort((a, b) => a.minEnemyDist - b.minEnemyDist);
      return scored[0].cell;
    }
    // Нет врагов ещё — ставим на любую фронтальную клетку (barracks > factory)
    return viable.find(c => c.building?.type === "barracks") ||
           viable.find(c => c.building?.type === "factory") ||
           viable[0];
  }

  if (["tank", "mlrs", "drone", "saboteur"].includes(unitKind)) {
    return viable.find((cell) => cell.building?.type === "factory") || viable[0];
  }
  return viable.find((cell) => cell.building?.type === "barracks") || viable[0];
}

function canRecruitOn(cell, playerId) {
  return cell.building?.owner === playerId && ["hq", "barracks", "factory"].includes(cell.building.type);
}

function hqRebuildSeconds(player, now = Date.now()) {
  if (!player?.hqDestroyed || !player.hqDestroyedAt) return 0;
  return Math.max(0, Math.ceil((player.hqDestroyedAt + HQ_REBUILD_WINDOW_MS - now) / 1000));
}

function isDefeated(playerId) {
  return Boolean(game.players[playerId]?.defeated);
}

function hqRebuildExpired(playerId, now = Date.now()) {
  const player = game.players[playerId];
  return Boolean(player?.hqDestroyed && !player.vassalOf && !player.defeated && !findHqCell(playerId) && hqRebuildSeconds(player, now) <= 0);
}

function canRebuildHq(playerId, now = Date.now()) {
  const player = game.players[playerId];
  return Boolean(player?.hqDestroyed && !player.defeated && !findHqCell(playerId) && hqRebuildSeconds(player, now) > 0);
}

function markExpiredDefeats(now = Date.now()) {
  let changed = false;
  for (const playerId of PLAYER_IDS) {
    if (hqRebuildExpired(playerId, now)) {
      markPlayerDefeated(playerId);
      changed = true;
    }
  }
  return changed;
}

function markPlayerDefeated(playerId) {
  const player = game.players[playerId];
  if (!player || player.defeated) return false;
  player.defeated = true;
  player.hqLost = true;
  player.hqDestroyed = true;
  player.vassalOf = null;
  game.diplomacyOffers = game.diplomacyOffers.filter((offer) => offer.from !== playerId && offer.to !== playerId);
  game.ultimatums = game.ultimatums.filter((item) => item.from !== playerId && item.to !== playerId);
  game.resourceRequests = game.resourceRequests.filter((request) => request.from !== playerId && request.to !== playerId);
  for (const key of Object.keys(game.supportDeals || {})) {
    const deal = game.supportDeals[key];
    if (deal.from === playerId || deal.to === playerId) delete game.supportDeals[key];
  }
  forEachCell((cell) => {
    cell.units[playerId] = emptyUnits();
    cell.cooldowns[playerId] = emptyWeaponCooldowns();
  });
  addSystemEvent(`${player.country} выбыла из игры.`, { sound: "fail" });
  touchMap();
  return true;
}

function playerHasBuilding(playerId, type) {
  let found = false;
  forEachCell((cell) => {
    if (!found && cell.building?.owner === playerId && cell.building.type === type) {
      found = true;
    }
  });
  return found;
}

function factoryLaunchCell(playerId) {
  let found = null;
  forEachCell((cell) => {
    if (!found && cell.building?.owner === playerId && cell.building.type === "factory") {
      found = cell;
    }
  });
  return found;
}

function nuclearPlantCells(playerId) {
  const plants = [];
  forEachCell((cell) => {
    if (cell.building?.owner === playerId && cell.building.type === "nuclearPlant") {
      plants.push(cell);
    }
  });
  return plants;
}

function readyNuclearPlant(playerId, now = Date.now()) {
  const plants = nuclearPlantCells(playerId);
  if (!plants.length) return null;
  if (game.devNoCooldowns) return plants[0];
  return plants.find((cell) => now >= (cell.building.nukeCooldown || 0)) || null;
}

function nextNukeCooldownUntil(playerId, now = Date.now()) {
  const plants = nuclearPlantCells(playerId);
  if (!plants.length || game.devNoCooldowns) return 0;
  let next = Infinity;
  for (const cell of plants) {
    const until = cell.building.nukeCooldown || 0;
    if (until <= now) return 0;
    next = Math.min(next, until);
  }
  return Number.isFinite(next) ? next : 0;
}

function setNuclearPlantCooldown(cell, player) {
  const until = game.devNoCooldowns ? 0 : Date.now() + COOLDOWNS.nuke * cooldownPenalty(player);
  if (cell?.building?.type === "nuclearPlant") {
    cell.building.nukeCooldown = until;
  }
  if (player) {
    player.cooldowns.nuke = nextNukeCooldownUntil(player.id);
  }
}

function jamNuclearPlants(playerId, until) {
  for (const cell of nuclearPlantCells(playerId)) {
    cell.building.nukeCooldown = Math.max(cell.building.nukeCooldown || 0, until);
  }
  const player = game.players[playerId];
  if (player) {
    player.cooldowns.nuke = nextNukeCooldownUntil(playerId);
  }
}

function canPay(player, cost) {
  return Object.entries(cost).every(([resource, amount]) => (player.resources[resource] || 0) >= amount);
}

function spend(player, cost) {
  for (const [resource, amount] of Object.entries(cost)) {
    player.resources[resource] = round1((player.resources[resource] || 0) - amount);
  }
}

function applySettlementPopulationLoss(playerId, type) {
  const player = game.players[playerId];
  if (!player) return;
  const loss = type === "city" ? 5 : 2;
  player.resources.pop = Math.max(0, round1((player.resources.pop || 0) - loss));
}

function addResource(player, resource, amount) {
  const next = round1((player.resources[resource] || 0) + amount);
  player.resources[resource] = resource === "ammo"
    ? Math.min(next, ammoCapacity(player.id))
    : next;
}

function ammoCapacity(playerId) {
  let depots = 0;
  forEachCell((cell) => {
    if (cell.building?.owner === playerId && cell.building.type === "ammoDepot") {
      depots += 1;
    }
  });
  return BASE_AMMO_CAPACITY + depots * AMMO_DEPOT_CAPACITY;
}

function clampAmmoToCapacity(playerId) {
  const player = game.players[playerId];
  if (!player) return;
  player.resources.ammo = Math.min(player.resources.ammo || 0, ammoCapacity(playerId));
}

function armyGoldSnapshot() {
  return Object.fromEntries(PLAYER_IDS.map((id) => [id, armyGoldValue(id)]));
}

function hostileTechUnitCount(playerId, cell) {
  if (!cell) return 0;
  let count = 0;
  for (const enemyId of hostilePlayerIds(playerId)) {
    const units = unitsFor(cell, enemyId);
    for (const unit of TECH_SFX_UNITS) {
      count += units[unit] || 0;
    }
  }
  return count;
}

function emitTechDestroyedIfChanged(before, cell, playerId) {
  if (!cell || hostileTechUnitCount(playerId, cell) >= before) return;
  emitSfx("d_tehnika", cell.x, cell.y, { playerId });
}

function armyGoldValue(playerId) {
  let value = 0;
  forEachCell((cell) => {
    const units = unitsFor(cell, playerId);
    for (const [unit, count] of Object.entries(units)) {
      value += (count || 0) * (UNITS[unit]?.cost?.gold || 0);
    }
  });
  return value;
}

function applyArmyLossEffects(before, attackerId = null) {
  for (const playerId of PLAYER_IDS) {
    const start = before?.[playerId] || 0;
    if (start <= 0) continue;
    const loss = Math.max(0, start - armyGoldValue(playerId));
    if (loss <= 0) continue;
    if (attackerId && game.players[attackerId] && attackerId !== playerId && activeEventType("looter")) {
      addResource(game.players[attackerId], "gold", Math.floor(loss * 0.5));
    }
  }
}

function scrapRefund(cost = {}) {
  const refund = {};
  if (cost.iron) refund.iron = cost.iron;
  if (cost.gold) refund.gold = Math.floor(cost.gold * 0.5);
  return refund;
}

function cooldownReady(player, weapon) {
  if (game.devNoCooldowns) return true;
  return Date.now() >= (player.cooldowns[weapon] || 0);
}

function setCooldown(player, weapon) {
  if (game.devNoCooldowns) {
    player.cooldowns[weapon] = 0;
    return;
  }
  player.cooldowns[weapon] = Date.now() + COOLDOWNS[weapon] * cooldownPenalty(player);
}

function weaponCooldownReady(cell, playerId, weapon) {
  if (game.devNoCooldowns) return true;
  return Date.now() >= (weaponCooldownsFor(cell, playerId)[weapon] || 0);
}

function setWeaponCooldown(cell, player, playerId, weapon) {
  if (game.devNoCooldowns) {
    weaponCooldownsFor(cell, playerId)[weapon] = 0;
    return;
  }
  weaponCooldownsFor(cell, playerId)[weapon] = Date.now() + COOLDOWNS[weapon] * cooldownPenalty(player);
}

function cooldownPenalty(player) {
  const ideology = IDEOLOGIES[player?.ideology] || {};
  return (player?.hqLost ? 2 : 1) * (ideology.cooldown || 1);
}

function movedWeaponCooldowns(cell, playerId, moved) {
  const cooldowns = weaponCooldownsFor(cell, playerId);
  return {
    rpg: moved.rpg ? cooldowns.rpg || 0 : 0,
    tank: moved.tank ? cooldowns.tank || 0 : 0,
    mlrs: moved.mlrs ? cooldowns.mlrs || 0 : 0,
    cruiser: moved.cruiser ? cooldowns.cruiser || 0 : 0
  };
}

function applyMovedWeaponCooldowns(from, to, playerId, movedCooldowns) {
  const fromCooldowns = weaponCooldownsFor(from, playerId);
  const toCooldowns = weaponCooldownsFor(to, playerId);
  const targetUnits = unitsFor(to, playerId);

  if (movedCooldowns.rpg) {
    fromCooldowns.rpg = 0;
    if (targetUnits.rpg > 0) {
      toCooldowns.rpg = Math.max(toCooldowns.rpg || 0, movedCooldowns.rpg);
    }
  }

  if (movedCooldowns.tank) {
    fromCooldowns.tank = 0;
    if (targetUnits.tank > 0) {
      toCooldowns.tank = Math.max(toCooldowns.tank || 0, movedCooldowns.tank);
    }
  }

  if (movedCooldowns.mlrs) {
    fromCooldowns.mlrs = 0;
    if (targetUnits.mlrs > 0) {
      toCooldowns.mlrs = Math.max(toCooldowns.mlrs || 0, movedCooldowns.mlrs);
    }
  }

  if (movedCooldowns.cruiser) {
    fromCooldowns.cruiser = 0;
    if (targetUnits.cruiser > 0) {
      toCooldowns.cruiser = Math.max(toCooldowns.cruiser || 0, movedCooldowns.cruiser);
    }
  }
}

function pruneWeaponCooldowns(cell) {
  for (const playerId of PLAYER_IDS) {
    const units = unitsFor(cell, playerId);
    const cooldowns = weaponCooldownsFor(cell, playerId);
    for (const weapon of WEAPON_COOLDOWN_KEYS) {
      if ((units[weapon] || 0) < 1) {
        cooldowns[weapon] = 0;
      }
    }
  }
}

function clearWeaponCooldowns(cell, playerId) {
  cell.cooldowns = cell.cooldowns || {};
  cell.cooldowns[playerId] = emptyWeaponCooldowns();
}

const statsCache = new Map();

function computeStats(playerId) {
  const cacheKey = `${game?.id || "global"}:${playerId}`;
  const cached = statsCache.get(cacheKey);
  if (cached && cached.mapVersion === game.mapVersion) return cached.stats;

  const stats = { cells: 0, power: 0, inf: 0, rpg: 0, tank: 0, rocket: 0, aa: 0, aaPlus: 0, ew: 0, mlrs: 0, drone: 0, saboteur: 0, boat: 0, cruiser: 0 };
  forEachCell((cell) => {
    if (cell.owner === playerId) stats.cells += 1;
    const units = unitsFor(cell, playerId);
    for (const key of UNIT_KEYS) {
      stats[key] += units[key] || 0;
    }
    stats.power += unitPower(units);
  });

  statsCache.set(cacheKey, { mapVersion: game.mapVersion, stats });
  return stats;
}

function formatResources(resources) {
  return Object.fromEntries(Object.entries(resources).map(([key, value]) => [key, round1(value)]));
}

function emptyUnits() {
  return { inf: 0, rpg: 0, tank: 0, rocket: 0, aa: 0, aaPlus: 0, ew: 0, mlrs: 0, drone: 0, saboteur: 0, boat: 0, cruiser: 0 };
}

function emptyWeaponCooldowns() {
  return { rpg: 0, tank: 0, rocket: 0, mlrs: 0, cruiser: 0 };
}

function emptyUnitsByPlayer() {
  return Object.fromEntries(PLAYER_IDS.map((id) => [id, emptyUnits()]));
}

function emptyCooldownsByPlayer() {
  return Object.fromEntries(PLAYER_IDS.map((id) => [id, emptyWeaponCooldowns()]));
}

function unitsFor(cell, playerId) {
  if (!cell.units[playerId]) {
    cell.units[playerId] = emptyUnits();
  } else {
    for (const key of UNIT_KEYS) {
      if (!Object.prototype.hasOwnProperty.call(cell.units[playerId], key)) {
        cell.units[playerId][key] = 0;
      }
    }
  }
  return cell.units[playerId];
}

function weaponCooldownsFor(cell, playerId) {
  cell.cooldowns = cell.cooldowns || {};
  cell.cooldowns[playerId] = cell.cooldowns[playerId] || emptyWeaponCooldowns();
  for (const key of WEAPON_COOLDOWN_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(cell.cooldowns[playerId], key)) {
      cell.cooldowns[playerId][key] = 0;
    }
  }
  return cell.cooldowns[playerId];
}

function addUnits(target, source) {
  for (const key of UNIT_KEYS) {
    target[key] = (target[key] || 0) + (source[key] || 0);
  }
}

function unitPower(units) {
  return (units.inf || 0) * 1 + (units.rpg || 0) * 1 + (units.tank || 0) * 3 + (units.rocket || 0) * 2 +
    (units.aa || 0) * 1 + (units.aaPlus || 0) * 2 + (units.mlrs || 0) * 2;
}

function movingUnitCount(units) {
  return (units.inf || 0) + (units.rpg || 0) + (units.tank || 0) + (units.mlrs || 0) + (units.ew || 0) + (units.drone || 0) + (units.saboteur || 0) + (units.boat || 0) + (units.cruiser || 0);
}

function scaleUnits(units, ratio, keepOneIfNeeded) {
  const scaled = emptyUnits();
  scaled.inf = Math.floor((units.inf || 0) * ratio);
  scaled.rpg = Math.floor((units.rpg || 0) * ratio);
  scaled.tank = (units.tank || 0) && ratio >= 0.34 ? 1 : 0;
  scaled.rocket = (units.rocket || 0) && ratio >= 0.5 ? 1 : 0;
  scaled.aa = (units.aa || 0) && ratio >= 0.5 ? 1 : 0;
  scaled.aaPlus = (units.aaPlus || 0) && ratio >= 0.5 ? 1 : 0;
  scaled.ew = (units.ew || 0) && ratio >= 0.5 ? 1 : 0;
  scaled.mlrs = (units.mlrs || 0) && ratio >= 0.4 ? 1 : 0;
  scaled.drone = Math.floor((units.drone || 0) * ratio);
  scaled.boat = (units.boat || 0) && ratio >= 0.5 ? 1 : 0;
  scaled.cruiser = (units.cruiser || 0) && ratio >= 0.5 ? 1 : 0;

  if (keepOneIfNeeded && unitPower(scaled) === 0 && unitPower(units) > 0 && ratio > 0) {
    if (units.tank) scaled.tank = 1;
    else if (units.mlrs) scaled.mlrs = 1;
    else if (units.rocket) scaled.rocket = 1;
    else if (units.aaPlus) scaled.aaPlus = 1;
    else if (units.aa) scaled.aa = 1;
    else if (units.ew) scaled.ew = 1;
    else if (units.cruiser) scaled.cruiser = 1;
    else if (units.boat) scaled.boat = 1;
    else if (units.rpg) scaled.rpg = 1;
    else scaled.inf = 1;
  }

  return scaled;
}

function getCell(x, y) {
  const cx = Number(x);
  const cy = Number(y);
  if (!Number.isInteger(cx) || !Number.isInteger(cy) || cx < 0 || cy < 0 || cx >= WIDTH || cy >= HEIGHT) {
    return null;
  }
  return game.map[cy]?.[cx] || null;
}

function getGeneratedCell(cells, x, y) {
  if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return null;
  return cells[y][x];
}

function forEachCell(callback) {
  for (const row of game.map) {
    for (const cell of row) {
      callback(cell);
    }
  }
}

function allCells(cells) {
  if (cells === game.map) {
    if (!game.flatCells || game.flatCellsSource !== game.map) {
      game.flatCells = cells.flat();
      game.flatCellsSource = game.map;
    }
    return game.flatCells;
  }
  return cells.flat();
}

function isLandLike(cell) {
  return ["land", "gold", "iron", "uranium"].includes(cell.terrain) || cell.building?.type === "bridge";
}

function isPassable(cell) {
  return cell.terrain !== "water" || cell.building?.type === "bridge";
}

function hasAdjacentWater(x, y) {
  return neighbors(x, y).some(([nx, ny]) => getCell(nx, ny)?.terrain === "water");
}

function hasAdjacentOwnedCell(playerId, x, y) {
  return neighbors(x, y).some(([nx, ny]) => {
    const cell = getCell(nx, ny);
    return cell && controlsCell(playerId, cell) && isLandLike(cell);
  });
}

function hasAdjacentFriendlyPort(playerId, x, y) {
  return neighbors(x, y).some(([nx, ny]) => {
    const cell = getCell(nx, ny);
    const owner = cell?.building?.owner;
    return cell?.building?.type === "port" && owner && (owner === playerId || isAllied(playerId, owner));
  });
}

function hasOwnWaterVessel(cell, playerId) {
  const units = unitsFor(cell, playerId);
  return (units.boat || 0) > 0 || (units.cruiser || 0) > 0;
}

function cellHasAnyVessel(cell) {
  return PLAYER_IDS.some((id) => {
    const units = unitsFor(cell, id);
    return (units.boat || 0) > 0 || (units.cruiser || 0) > 0;
  });
}

function hostileCruiserAtCell(playerId, cell) {
  return hostilePlayerIds(playerId).some((id) => (unitsFor(cell, id).cruiser || 0) > 0);
}

function portBlockader(ownerId, portCell) {
  if (!portCell?.building || portCell.building.type !== "port") return null;
  for (const [nx, ny] of neighbors(portCell.x, portCell.y)) {
    const cell = getCell(nx, ny);
    if (!cell || cell.terrain !== "water") continue;
    const blockerId = PLAYER_IDS.find((id) => id !== ownerId && isHostile(ownerId, id) && (unitsFor(cell, id).cruiser || 0) > 0);
    if (blockerId) return blockerId;
  }
  return null;
}

function notePortBlockade(ownerId, portCell, blockerId, now = Date.now()) {
  const building = portCell?.building;
  if (!building) return false;
  const changed = building.blockadedBy !== blockerId;
  building.blockadedBy = blockerId;
  if (changed || now - (building.lastBlockadeNoticeAt || 0) >= 60_000) {
    building.lastBlockadeNoticeAt = now;
    addSystemEvent(`Порт страны ${game.players[ownerId]?.country || "цели"} заблокирован крейсером ${game.players[blockerId]?.country || "противника"}.`, { sound: "alert" });
  }
  return changed;
}

function clearPortBlockade(portCell) {
  const building = portCell?.building;
  if (!building?.blockadedBy) return false;
  building.blockadedBy = null;
  return true;
}

function neighbors(x, y) {
  return [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1]
  ].filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < WIDTH && ny < HEIGHT);
}

function isAdjacent(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
}

function distance(a, b) {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

function cruiserTargetInLine(from, target) {
  if (!from || !target) return false;
  const dx = Math.abs(from.x - target.x);
  const dy = Math.abs(from.y - target.y);
  const dist = dx + dy;
  return dist > 0 && dist <= 3 && (dx === 0 || dy === 0);
}

function initializeDiplomacy() {
  game.relations = {};
  game.diplomacyOffers = [];
  for (let i = 0; i < PLAYER_IDS.length; i += 1) {
    for (let j = i + 1; j < PLAYER_IDS.length; j += 1) {
      setRelation(PLAYER_IDS[i], PLAYER_IDS[j], "neutral");
    }
  }
  const humans = joinedHumanIds(game);
  for (let i = 0; i < humans.length; i += 1) {
    for (let j = i + 1; j < humans.length; j += 1) {
      setRelation(humans[i], humans[j], "war");
    }
  }
  if (game.players.anarchists && game.players.farmers) {
    setRelation("anarchists", "farmers", "war");
  }
}

function pairKey(a, b) {
  return [a, b].sort().join(":");
}

function samePair(a, b, c, d) {
  return pairKey(a, b) === pairKey(c, d);
}

function setRelation(a, b, status) {
  if (!a || !b || a === b) return;
  game.relations[pairKey(a, b)] = status;
}

function relationStatus(a, b) {
  if (!a || !b || a === b) return "self";
  if (isVassalOf(a, b) || isVassalOf(b, a)) return "alliance";
  return game.relations[pairKey(a, b)] || "neutral";
}

function isHostile(a, b) {
  if (isVassalOf(a, b) || isVassalOf(b, a)) return false;
  return relationStatus(a, b) === "war";
}

function isAllied(a, b) {
  return relationStatus(a, b) === "alliance" || isVassalOf(a, b) || isVassalOf(b, a);
}

function hostilePlayerIds(playerId) {
  return PLAYER_IDS.filter((id) => id !== playerId && isHostile(playerId, id));
}

function isVassalOf(vassalId, overlordId) {
  return Boolean(vassalId && overlordId && game.players[vassalId]?.vassalOf === overlordId);
}

function controlsOwner(playerId, ownerId) {
  return Boolean(ownerId && (ownerId === playerId || isVassalOf(ownerId, playerId)));
}

function controlsCell(playerId, cell) {
  return Boolean(cell && controlsOwner(playerId, cell.owner));
}

function hostileUnitIdsAtCell(playerId, cell) {
  return hostilePlayerIds(playerId).filter((id) => {
    const units = unitsFor(cell, id);
    return unitPower(units) > 0 || (units.ew || 0) > 0 || (units.boat || 0) > 0 || (units.cruiser || 0) > 0;
  });
}

function defenderNames(ids) {
  return ids.map((id) => game.players[id]?.country || id).join(", ");
}

function cellTargetName(cell, attackerId) {
  if (cell.owner && cell.owner !== attackerId) {
    return game.players[cell.owner]?.country || "цель";
  }
  const defender = hostileUnitIdsAtCell(attackerId, cell)[0];
  return defender ? game.players[defender]?.country || "цель" : "нейтральную клетку";
}

function findHostileAirDefense(playerId, x, y, radius) {
  let found = null;
  for (const enemyId of hostilePlayerIds(playerId)) {
    found = findAirDefense(enemyId, x, y, radius);
    if (found) break;
  }
  return found;
}

function findHostileNuclearDefense(playerId, x, y, radius) {
  let found = null;
  for (const enemyId of hostilePlayerIds(playerId)) {
    found = findNuclearDefense(enemyId, x, y, radius);
    if (found) break;
  }
  return found;
}

function cleanText(value, maxLength) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(items) {
  return items[randomInt(0, items.length - 1)];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function shuffle(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function clearBaseZone(cells, cx, cy) {
  for (let y = cy - 3; y <= cy + 3; y += 1) {
    for (let x = cx - 3; x <= cx + 3; x += 1) {
      if (getGeneratedCell(cells, x, y)) {
        cells[y][x].terrain = "land";
      }
    }
  }
}

function paintNaturalRiver(cells) {
  let center = randomInt(Math.floor(WIDTH / 2) - 2, Math.floor(WIDTH / 2) + 1);
  let flow = randomInt(-1, 1);

  for (let y = 0; y < HEIGHT; y += 1) {
    if (Math.random() < 0.42) {
      flow = randomInt(-1, 1);
    }
    if (Math.random() < 0.7) {
      center += flow;
    }
    center = clamp(center, Math.floor(WIDTH / 2) - 4, Math.floor(WIDTH / 2) + 3);

    const thicknessRoll = Math.random();
    const thickness = thicknessRoll < 0.16 ? 3 : thicknessRoll < 0.68 ? 2 : 1;
    const start = thickness === 1 ? center : thickness === 2 ? center + randomInt(-1, 0) : center - 1;

    for (let dx = 0; dx < thickness; dx += 1) {
      setWaterIfAllowed(cells, start + dx, y);
    }

    if (Math.random() < 0.16) {
      setWaterIfAllowed(cells, start - 1, y);
    }
    if (Math.random() < 0.16) {
      setWaterIfAllowed(cells, start + thickness, y);
    }
  }
}

function paintHorizontalRiver(cells) {
  let center = randomInt(Math.floor(HEIGHT / 2) - 1, Math.floor(HEIGHT / 2) + 1);
  let flow = randomInt(-1, 1);

  for (let x = 0; x < WIDTH; x += 1) {
    if (Math.random() < 0.42) {
      flow = randomInt(-1, 1);
    }
    if (Math.random() < 0.7) {
      center += flow;
    }
    center = clamp(center, Math.floor(HEIGHT / 2) - 3, Math.floor(HEIGHT / 2) + 2);

    const thicknessRoll = Math.random();
    const thickness = thicknessRoll < 0.2 ? 2 : 1;
    const start = thickness === 1 ? center : center + randomInt(-1, 0);

    for (let dy = 0; dy < thickness; dy += 1) {
      setWaterIfAllowed(cells, x, start + dy);
    }

    if (Math.random() < 0.12) {
      setWaterIfAllowed(cells, x, start - 1);
    }
    if (Math.random() < 0.12) {
      setWaterIfAllowed(cells, x, start + thickness);
    }
  }
}

function paintLakes(cells) {
  const cx = Math.floor(WIDTH / 2);
  const cy = Math.floor(HEIGHT / 2);

  // One small lake per quadrant, placed away from the river cross and bases
  const quadrants = [
    { x0: 3, x1: cx - 3, y0: 2, y1: cy - 3 },
    { x0: cx + 3, x1: WIDTH - 4, y0: 2, y1: cy - 3 },
    { x0: 3, x1: cx - 3, y0: cy + 3, y1: HEIGHT - 3 },
    { x0: cx + 3, x1: WIDTH - 4, y0: cy + 3, y1: HEIGHT - 3 },
  ];

  for (const quad of quadrants) {
    const center = randomLakeCenterInRegion(quad);
    if (!center) continue;
    let x = center.x;
    let y = center.y;
    const size = randomInt(2, 3);

    for (let step = 0; step < size; step += 1) {
      setWaterIfAllowed(cells, x, y);
      for (const [nx, ny] of neighbors(x, y)) {
        if (Math.random() < 0.25) {
          setWaterIfAllowed(cells, nx, ny);
        }
      }
      x = clamp(x + randomInt(-1, 1), quad.x0, quad.x1);
      y = clamp(y + randomInt(-1, 1), quad.y0, quad.y1);
    }
  }
}

function randomLakeCenterInRegion(region) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const x = randomInt(region.x0, region.x1);
    const y = randomInt(region.y0, region.y1);
    if (!isBaseReserve(x, y)) {
      return { x, y };
    }
  }
  return null;
}

function setWaterIfAllowed(cells, x, y) {
  const cell = getGeneratedCell(cells, x, y);
  if (!cell || isBaseReserve(x, y)) return false;
  cell.terrain = "water";
  return true;
}

function placeUnmirroredResources(cells) {
  const cx = Math.floor(WIDTH / 2);
  const cy = Math.floor(HEIGHT / 2);

  // Four quadrants — resources spread evenly across the whole map
  const topLeft     = { x0: 1, x1: cx - 2, y0: 1, y1: cy - 2 };
  const topRight    = { x0: cx + 2, x1: WIDTH - 2, y0: 1, y1: cy - 2 };
  const bottomLeft  = { x0: 1, x1: cx - 2, y0: cy + 2, y1: HEIGHT - 2 };
  const bottomRight = { x0: cx + 2, x1: WIDTH - 2, y0: cy + 2, y1: HEIGHT - 2 };

  // More map space needs more deposits, but spacing keeps them from becoming dense.
  for (const region of [topLeft, topRight, bottomLeft, bottomRight]) {
    placeTerrainInRegion(cells, "gold", randomInt(5, 6), region);
    placeTerrainInRegion(cells, "iron", randomInt(3, 4), region);
    placeTerrainInRegion(cells, "uranium", randomInt(1, 2), region, { nearWater: true });
  }
}

function placeTerrainInRegion(cells, terrain, count, region, options = {}) {
  let placed = 0;

  while (placed < count) {
    const candidates = terrainCandidates(cells, region, options);
    if (!candidates.length) break;
    const cell = candidates[0];
    cell.terrain = terrain;
    placed += 1;
  }

  return placed;
}

function terrainCandidates(cells, region, options = {}) {
  const spacing = options.spacing ?? RESOURCE_SPACING;
  let candidates = allCells(cells).filter((cell) => (
    cell.terrain === "land" &&
    cell.x >= region.x0 &&
    cell.x <= region.x1 &&
    cell.y >= region.y0 &&
    cell.y <= region.y1 &&
    !isBaseReserve(cell.x, cell.y) &&
    !hasNearbyResource(cells, cell.x, cell.y, spacing) &&
    (!options.nearWater || generatedNeighbors(cells, cell.x, cell.y).some((near) => near.terrain === "water"))
  ));

  if (!candidates.length && options.nearWater) {
    candidates = allCells(cells).filter((cell) => (
      cell.terrain === "land" &&
      cell.x >= region.x0 &&
      cell.x <= region.x1 &&
      cell.y >= region.y0 &&
      cell.y <= region.y1 &&
      !isBaseReserve(cell.x, cell.y) &&
      !hasNearbyResource(cells, cell.x, cell.y, spacing)
    ));
  }

  if (!candidates.length) {
    candidates = allCells(cells).filter((cell) => (
      cell.terrain === "land" &&
      cell.x >= region.x0 &&
      cell.x <= region.x1 &&
      cell.y >= region.y0 &&
      cell.y <= region.y1 &&
      !isBaseReserve(cell.x, cell.y)
    ));
  }

  return shuffle(candidates);
}

function hasNearbyResource(cells, x, y, radius = 1) {
  for (let yy = y - radius; yy <= y + radius; yy += 1) {
    for (let xx = x - radius; xx <= x + radius; xx += 1) {
      if (Math.abs(xx - x) + Math.abs(yy - y) > radius) continue;
      const cell = getGeneratedCell(cells, xx, yy);
      if (cell && (cell.terrain === "gold" || cell.terrain === "iron" || cell.terrain === "uranium")) {
        return true;
      }
    }
  }
  return false;
}

function generatedNeighbors(cells, x, y) {
  return [
    getGeneratedCell(cells, x + 1, y),
    getGeneratedCell(cells, x - 1, y),
    getGeneratedCell(cells, x, y + 1),
    getGeneratedCell(cells, x, y - 1)
  ].filter(Boolean);
}

function isBaseReserve(x, y) {
  const reserveMargin = 2;
  return Object.values(startingLayouts()).some((start) => (
    x >= start.x0 - reserveMargin &&
    x <= start.x1 + reserveMargin &&
    y >= start.y0 - reserveMargin &&
    y <= start.y1 + reserveMargin
  ));
}
