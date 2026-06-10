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
    movePickup ? 1 : 0,
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
    const command = kind === "nuke" ? "nuke" : kind === "saboteur" ? "shahed" : "hire";
    return commandButton(command, kind, unit.name, unit.cost);
  }).join("");
  els.tabContent.innerHTML = `<div class="command-grid">${buttons}</div>`;
}

function renderBuildingsTab() {
  const buttons = Object.entries(BUILDING_DEFS).map(([kind, building]) => (
    commandButton("build", kind, `${building.icon} ${building.name}`, `${building.cost} · 1.5с`)
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
        ${moveToggleHtml("pickup", movePickup, (ownUnits.pickup || 0) > 0)}
        ${moveToggleHtml("ew", moveEw, (ownUnits.ew || 0) > 0 && ((ownUnits.inf || 0) > 0 || (ownUnits.rpg || 0) > 0 || (ownUnits.tank || 0) > 0 || (ownUnits.mlrs || 0) > 0 || (ownUnits.pickup || 0) > 0))}
        ${moveToggleHtml("cruiser", moveCruiser, (ownUnits.cruiser || 0) > 0)}
        ${moveToggleHtml("drone", moveDrone, (ownUnits.drone || 0) > 0)}
      </div>
      <div class="command-grid">
        ${actionCommandButton("rpg", cell, ownUnits, `${unitIconHtml("rpg")} РПГ`, "рядом")}
        ${actionCommandButton("tank", cell, ownUnits, `${unitIconHtml("tank")} Танк`, "рядом")}
        ${actionCommandButton("rocket", cell, ownUnits, "🚀 Удар", "R5")}
        ${actionCommandButton("mlrs", cell, ownUnits, `${unitIconHtml("mlrs")} Залп`, "R4")}
        ${actionCommandButton("cruiser", cell, ownUnits, `${unitIconHtml("cruiser")} Залп`, "линия 3")}
        ${actionCommandButton("detonateDrone", cell, ownUnits, `${unitIconHtml("drone")} Детонация`, "эта клетка")}
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
        ${vassal ? disabledCommandButton("🕊 Освободить", "сюзерен") : (hasVassals ? commandButton("releaseVassal", "", "🕊 Освободить", "вассал") : disabledCommandButton("🕊 Освободить", "нет вассалов"))}
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

