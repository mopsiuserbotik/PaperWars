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
  const className = [
    "cell",
    `terrain-${cell.terrain}`,
    cell.owner ? "is-owned" : "",
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

  flightEffects = flightEffects.filter((flight) => flight.until > now);
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

