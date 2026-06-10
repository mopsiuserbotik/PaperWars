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
    if (event.target.matches("[data-move-toggle='pickup']")) {
      movePickup = event.target.checked;
      renderGame();
    }
  });

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
      ultimatumId: button.dataset.ultimatumId
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

function handleServerMessage(message) {
  if (message.type === "roomClosed") {
    pendingJoinPayload = null;
    lobbyStep = "home";
    showToast(message.message || "Комната удалена.");
    return;
  }

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
    if (message.sfx) {
      updateEventSfxSources(message.sfx);
    }
  }

  if (message.type === "lobby") {
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
    nukeSmokes = [];
    impactSmokes = [];
    shotEffects = [];
    flightEffects = [];
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
    nukeSmokes = [];
    impactSmokes = [];
    shotEffects = [];
    flightEffects = [];
    stopRainAmbientSfx();
    hqRebuildEnds = {};
    unreadChatCount = 0;
    unreadJournalCount = 0;
    closeChat();
    closeJournal();
    showToast("Матч начался.");
  }

  if (message.type === "state") {
    const previousMap = state?.map || null;
    const previousChat = state?.chat || [];
    const previousJournal = state?.journal || [];
    const nextMap = message.state.map || applyMapPatch(previousMap, message.state.mapPatch, state?.mapVersion);
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

  if (message.type === "troll") {
    applyTrollEffect(message.troll || {});
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
  flightEffects = flightEffects.slice(-8);
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

