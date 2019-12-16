import * as alt from 'alt';
import * as configurationHospitals from '../configuration/hospitals.js';
import { Config } from '../configuration/config.js';
import { distance } from '../utility/vector.js';
import { verifyWeapon } from '../systems/anticheat.js';
import { checkRestrictions } from '../systems/job.js';
import { appendToMdc } from '../systems/mdc.js';

alt.on('playerDeath', (target, killer, weapon) => {
    if (target.reviving) return;
    // Anti Cheat Handling
    if (handleAntiCheat(target, killer, weapon)) return;

    // Job Handling
    checkRestrictions(target);

    // Cuff Handling
    handleHasCuffed(target);

    // IsCuffed
    handleIsCuffed(target);

    // Hospital Handling
    handleHospital(target);

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
 * If an officer or kidnapper dies; the cuffs are broken.
 * @param player
 */
function handleHasCuffed(player) {
    if (player.cuffedPlayer) {
        player.cuffedPlayer.setSyncedMeta('arrested', undefined);
        player.cuffedPlayer.emitMeta('arrest', undefined);
        player.cuffedPlayer = undefined;
    }
}

// This is called when a user is being
// arrested and they die. They will be
// sent straight to jail.
function handleIsCuffed(player) {
    const arrester = player.getSyncedMeta('arrested');
    if (!arrester) return;
    player.setSyncedMeta('arrested', undefined);
    player.emitMeta('arrest', undefined);
    arrester.cuffedPlayer = undefined;

    if (!arrester.job) return;
    if (!arrester.job.name.includes('Officer')) return;

    player.lastLocation = {
        x: 459.00830078125,
        y: -998.204833984375,
        z: 24.91485023498535
    };
    player.sendToJail = true;
    player.setSyncedMeta('namecolor', '{ff8400}');
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
        const dist = distance(hospital, player.pos);

        if (lastDistance === 0) {
            lastDistance = distance(hospital, player.pos);
            return;
        }

        if (lastDistance > dist) {
            lastDistance = dist;
            closestHospital = hospital;
        }
    });

    alt.emit('deathbox:Create', player);
    player.hasDied = true;
    player.revivePos = player.sendToJail
        ? { x: 459.00830078125, y: -998.204833984375, z: 24.91485023498535 }
        : closestHospital;
    player.saveDead(true);
    player.send('Type /revive to revive at the nearest hospital.');
    player.setSyncedMeta('dead', true);
    player.spawn(player.pos.x, player.pos.y, player.pos.z, 0);
    player.health = 200;
}

function handleMdcRegistration(target, killer) {
    if (target === killer) return;
    if (!killer) return;

    if (killer.constructor.name === 'Vehicle') {
        const owner = alt.Player.all.find(p => p.vehicles.find(veh => veh === killer));
        if (!owner) return;
        if (target === owner) return;

        appendToMdc(target, owner, 'Vehicular Manslaughter');
        return;
    }

    if (killer.job && killer.job.name.includes('Officer')) {
        if (target.equipment && target.equipment[11]) {
            if (target.equipment[11].base === 'weapon') {
                return;
            }

            if (target.equipment[11].base === 'boundweapon') {
                return;
            }
        }
    }

    appendToMdc(target, killer, 'Murder');
}
