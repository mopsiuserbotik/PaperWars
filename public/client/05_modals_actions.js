function handleModalClick(event) {
  if (event.target === els.modalLayer || event.target.closest("[data-modal-close]")) {
    closeModal();
    return;
  }

  if (event.target.closest("[data-exit-confirm]")) {
    closeModal();
    send({ type: "leaveRoom" }, { priority: true });
    return;
  }

  const trollLoan = event.target.closest("[data-troll-loan-choice]");
  if (trollLoan) {
    const id = trollLoan.dataset.trollId || "";
    const choice = trollLoan.dataset.trollLoanChoice || "";
    closeModal();
    send({ type: "trollResponse", id, choice }, { priority: true });
    return;
  }

  if (event.target.closest("[data-troll-fake-win]")) {
    showToast("Недостаточно уважения.");
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

  if (event.target.closest("[data-dev-troll-submit]")) {
    const targetId = els.modalLayer.querySelector("[data-dev-country]")?.value;
    const trollType = els.modalLayer.querySelector("[data-dev-troll]")?.value;
    const seconds = Number(els.modalLayer.querySelector("[data-dev-troll-seconds]")?.value || 8);
    send({ type: "devResources", code: DEV_CODE, action: "troll", targetId, trollType, seconds }, { priority: true });
    return;
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

function applyTrollEffect(troll = {}) {
  const type = troll.type || "";
  if (type === "adLoan") {
    openTrollLoanModal(troll);
    return;
  }
  if (type === "fakeEvent") {
    const text = troll.text || "ООН признала вашу страну слишком слабой.";
    addLocalSystemMessage(text);
    showToast(text);
    return;
  }
  if (type === "censorMap") {
    const seconds = clamp(Math.round(Number(troll.seconds) || 8), 1, 60);
    els.map?.classList.add("is-censored");
    clearTimeout(trollCensorTimer);
    trollCensorTimer = setTimeout(() => {
      els.map?.classList.remove("is-censored");
      trollCensorTimer = null;
    }, seconds * 1000);
    showToast(`Карта засекречена на ${seconds} сек.`);
    return;
  }
  if (type === "fakeFine") {
    openTrollNoticeModal("Штраф", troll.text || "Штраф -999 золота", "Оплатить морально");
    showToast("-999 золота");
    return;
  }
  if (type === "fakeWin") {
    openTrollFakeWinModal();
  }
}

function openTrollLoanModal(troll) {
  const id = troll.id || "";
  els.modalLayer.innerHTML = `
    <div class="modal-box modal-box--small troll-modal" role="dialog" aria-modal="true">
      <div class="modal-head">
        <strong>${escapeHtml(troll.title || "RAHMAT BANK")}</strong>
        <button data-modal-close type="button">×</button>
      </div>
      <p class="modal-note">${escapeHtml(troll.text || "Вашей стране срочно нужен кредит от RAHMAT BANK.")}</p>
      <div class="modal-actions">
        <button class="primary" data-troll-loan-choice="take" data-troll-id="${escapeHtml(id)}" type="button">Взять 999%</button>
        <button class="secondary" data-troll-loan-choice="suffer" data-troll-id="${escapeHtml(id)}" type="button">Страдать</button>
      </div>
    </div>
  `;
  els.modalLayer.classList.remove("hidden");
}

function openTrollNoticeModal(title, text, buttonText = "Закрыть") {
  els.modalLayer.innerHTML = `
    <div class="modal-box modal-box--small troll-modal" role="dialog" aria-modal="true">
      <div class="modal-head">
        <strong>${escapeHtml(title)}</strong>
        <button data-modal-close type="button">×</button>
      </div>
      <p class="modal-note">${escapeHtml(text)}</p>
      <button class="primary modal-submit" data-modal-close type="button">${escapeHtml(buttonText)}</button>
    </div>
  `;
  els.modalLayer.classList.remove("hidden");
}

function openTrollFakeWinModal() {
  els.modalLayer.innerHTML = `
    <div class="modal-box modal-box--small troll-modal" role="dialog" aria-modal="true">
      <div class="modal-head">
        <strong>Почти победа</strong>
        <button data-modal-close type="button">×</button>
      </div>
      <p class="modal-note">Найдена секретная кнопка победы.</p>
      <button class="primary modal-submit" data-troll-fake-win type="button">Победить</button>
    </div>
  `;
  els.modalLayer.classList.remove("hidden");
}

function addLocalSystemMessage(text) {
  if (!state) return;
  const journalEntry = {
    id: `local-troll-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type: "battle",
    text,
    at: Date.now()
  };
  state.journal = [...(state.journal || []), journalEntry].slice(-80);
  renderJournal();
  renderPanels();
  return;
  const entry = {
    id: `local-troll-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type: "system",
    name: "Событие",
    color: "#202020",
    text,
    at: Date.now()
  };
  state.chat = [...(state.chat || []), entry].slice(-40);
  renderChat();
  renderPanels();
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
      <div class="dev-event">
        <label class="field">
          <span>Троллинг</span>
          <select data-dev-troll>
            <option value="adLoan">Реклама RAHMAT BANK</option>
            <option value="fakeEvent">Фейковое событие ООН</option>
            <option value="censorMap">Цензура карты</option>
            <option value="fakeFine">Фейковый штраф -999</option>
            <option value="fakeWin">Фейковая кнопка победы</option>
          </select>
        </label>
        <label class="field">
          <span>Секунд для цензуры</span>
          <input data-dev-troll-seconds type="number" min="1" max="60" step="1" value="8">
        </label>
        <button data-dev-troll-submit type="button">Отправить троллинг</button>
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
  if (command === "shahed") {
    pending = { action: "shahed" };
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

