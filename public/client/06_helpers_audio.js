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
  if (meta) meta.content = normalized === "dark" ? "#161719" : "#f7f3ea";
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
    button.innerHTML = sfxEnabled ? "&#128266;" : "&#128263;";
    button.title = sfxEnabled ? "Sound on" : "Sound off";
    button.setAttribute("aria-pressed", String(sfxEnabled));
  }
}

function stopAllEventSfx() {
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
  return {
    demolish: "d_house",
    misfire: "osechka",
    nuke: "yaderka"
  }[name] || name;
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

function playNativeSfx(name, detail = {}, loop = false) {
  if (!nativeSfxAvailable()) return false;
  try {
    return window.PaperWarsNativeAudio.playSfx(String(name), sfxVolumeFor(name, detail), Boolean(loop)) !== false;
  } catch (error) {
    return false;
  }
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
