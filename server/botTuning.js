const economyMultiplier = 0.88;
const turnIntervalMs = 2_600;
const turnStaggerMs = 1_600;
const moveCooldownMs = 1_700;
const moveJitterMs = 900;
const retryCooldownMs = 1_100;

const maxInfByPersonality = {
  aggressive: 7,
  passive: 3,
  industrial: 4,
  fisher: 3
};

const ammoReserveByPersonality = {
  aggressive: 1,
  passive: 3,
  industrial: 2,
  fisher: 3
};

function minMoveAmmo({ emergency, preMilitary, underAttack }) {
  if (emergency || underAttack) return 1;
  return preMilitary ? 2 : 1;
}

function moveAmmoReserve({ looterEvent, preMilitary, underAttack, personality }) {
  if (looterEvent || underAttack) return 0;
  if (preMilitary) return 2;
  return ammoReserveByPersonality[personality] ?? 3;
}

module.exports = {
  economyMultiplier,
  turnIntervalMs,
  turnStaggerMs,
  moveCooldownMs,
  moveJitterMs,
  retryCooldownMs,
  maxInfByPersonality,
  ammoReserveByPersonality,
  minMoveAmmo,
  moveAmmoReserve
};
