import * as alt from 'alt';
import * as configurationHospitals from '../configuration/hospitals.mjs';
import * as utilityVector from '../utility/vector.mjs';
import { verifyWeapon } from '../systems/anticheat.mjs';
import { Weapons, CauseOfDeath } from '../configuration/weapons.mjs';
import { checkRestrictions } from '../systems/job.mjs';
import { appendToMdc } from '../systems/mdc.mjs';

alt.on('playerDeath', (target, killer, weapon) => {
    if (target.reviving) return;
    // Anti Cheat Handling
    if (handleAntiCheat(target, killer, weapon)) return;

    // Cuff Handling
    handleHasCuffed(target);

    // Hospital Handling
    handleHospital(target);

    // Job Handling
    checkRestrictions(target);

    // MDC Registration Handling
    handleMdcRegistration(target, killer);
});

/**
 * Checks if the killer has a weapon; and
 * if they have the rights to that weapon.
 * @param target
 * @param killer
 */
function handleAntiCheat(target, killer, weapon) {
    if (target !== killer) {
        if (weapon !== 133987706 && weapon !== 2741846334) {
            if (killer && killer.constructor.name === 'Player') {
                if (!verifyWeapon(killer)) {
                    target.spawn(target.pos.x, target.pos.y, target.pos.z, 200);
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * Checks if the player who died; has someone cuffed.
 * @param player
 */
function handleHasCuffed(player) {
    if (player.cuffedPlayer) {
        player.cuffedPlayer.setSyncedMeta('arrested', undefined);
        player.cuffedPlayer.emitMeta('arrest', undefined);
    }
}

/**
 * Determines closest hospital; and sets up revive.
 * @param player
 */
function handleHospital(player) {
    player.reviving = false;

    let closestHospital = configurationHospitals.Locations[0];
    let lastDistance = 0;

    configurationHospitals.Locations.forEach(hospital => {
        const distance = utilityVector.distance(hospital, player.pos);

        if (lastDistance === 0) {
            lastDistance = utilityVector.distance(hospital, player.pos);
            return;
        }

        if (lastDistance > distance) {
            lastDistance = distance;
            closestHospital = hospital;
        }
    });

    player.hasDied = true;
    player.revivePos = player.isArrested
        ? { x: 459.00830078125, y: -998.204833984375, z: 24.91485023498535 }
        : closestHospital;
    player.saveDead(true);
    player.send('Type /revive to revive at the nearest hospital.');
}

function handleMdcRegistration(target, killer) {
    if (target === killer) return;
    if (!killer) return;

    if (killer.constructor.name === 'Vehicle') {
        const owner = alt.Player.all.find(p => p.vehicles.find(veh => veh === killer));
        if (!owner) return;
        if (target === owner) return;

        appendToMdc(target.data.name, owner.data.name, 'Vehicular Manslaughter');
        return;
    }

    appendToMdc(target.data.name, killer.data.name, 'Murder');
}
