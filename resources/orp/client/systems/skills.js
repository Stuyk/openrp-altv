import * as alt from 'alt';
import * as native from 'natives';
import { getLevel } from '/client/systems/xp.js';

let agilityCooldown = Date.now();
let skills;

// When the player updates their inventory.
alt.on('meta:Changed', loadInterval);
function loadInterval(key, value) {
    if (key === 'skills') {
        skills = JSON.parse(value);

        const skillBonus = alt.Player.local.getMeta('skills:Bonus');
        const agilityLevel = getLevel(skills.agility.xp);

        let agilityBonus = 0;
        if (skillBonus && skillBonus.agility) {
            alt.log(`Skill Bonus Applied: ${JSON.stringify(skillBonus.agility)}`);
            if (Date.now() > skillBonus.agility.time) {
                agilityBonus = 0;
            } else {
                agilityBonus = skillBonus.agility.level;
            }
        }

        if (alt.getStat('stamina') !== agilityLevel + agilityBonus) {
            alt.log('Agility stat set to: ' + (agilityLevel + agilityBonus));
            alt.resetStat('stamina');
            alt.setStat('stamina', Math.floor((agilityLevel + agilityBonus) / 1.3));
        }

        return;
    }

    if (key !== 'loggedin') return;
    const intervalID = alt.setInterval(skillInterval, 1000);
    alt.log(`skills.js ${intervalID}`);
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
    if (native.isPedStill(alt.Player.local.scriptID)) return;
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
    }
}

function validateAgility(speed) {
    if (Math.abs(speed) >= 5) {
        return true;
    }
    return false;
}
