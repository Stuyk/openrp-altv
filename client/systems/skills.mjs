import * as alt from 'alt';
import * as native from 'natives';
import { getLevel } from '/client/systems/xp.mjs';

let agilityCooldown = Date.now();
let skills;

// When the player updates their inventory.
alt.on('meta:Changed', loadInterval);
function loadInterval(key, value) {
    if (key === 'skills') skills = JSON.parse(value);
    if (key !== 'loggedin') return;
    alt.setInterval(skillInterval, 1000);
}

function skillInterval() {
    agilitySkill();
}

/**
 * Restore agility LVL stamina every 5 seconds.
 * Train every 5 seconds of sprinting.
 * Must be above 5 speed in any direction.
 */
function agilitySkill() {
    if (alt.Player.local.vehicle) return;
    if (!native.isControlPressed(0, 21)) {
        alt.Player.local.agility = Date.now();
        return;
    }

    if (Date.now() <= alt.Player.local.agility + 5000) return;
    alt.Player.local.agility = Date.now();
    let speedVector = native.getEntitySpeedVector(alt.Player.local.scriptID);

    // Validate they're going a decent speed.
    if (
        validateAgility(speedVector.x) ||
        validateAgility(speedVector.y) ||
        validateAgility(speedVector.z)
    ) {
        alt.emitServer('skill:Agility');
        if (skills && skills['agility']) {
            native.restorePlayerStamina(
                alt.Player.local.scriptID,
                parseFloat(getLevel(skills['agility'].xp) * 0.01)
            );
        }
    }
}

function validateAgility(speed) {
    if (Math.abs(speed) >= 5) {
        return true;
    }
    return false;
}
