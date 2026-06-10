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
const SCRAPPABLE_UNITS = ["tank", "rocket", "aa", "aaPlus", "ew", "mlrs", "drone", "pickup", "boat", "cruiser"];
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

