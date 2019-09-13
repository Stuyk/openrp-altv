import * as alt from 'alt';
import * as configurationHospitals from '../configuration/hospitals.mjs';
import * as utilityVector from '../utility/vector.mjs';
import { verifyWeapon } from '../systems/anticheat.mjs';
import { Weapons, CauseOfDeath } from '../configuration/weapons.mjs';

alt.on('playerDeath', (target, killer, weapon) => {
    if (target.reviving) return;

    if (target !== killer) {
        if (weapon !== 133987706 || weapon !== 2741846334) {
            if (killer) {
                if (!verifyWeapon(killer)) {
                    target.spawn(target.pos.x, target.pos.y, target.pos.z, 200);
                    return;
                }
            }
        }
    }

    target.reviving = false;

    let closestHospital = configurationHospitals.Locations[0];
    let lastDistance = 0;

    configurationHospitals.Locations.forEach(hospital => {
        const distance = utilityVector.distance(hospital, target.pos);

        if (lastDistance === 0) {
            lastDistance = utilityVector.distance(hospital, target.pos);
            return;
        }

        if (lastDistance > distance) {
            lastDistance = distance;
            closestHospital = hospital;
        }
    });

    target.revivePos = closestHospital;
    target.saveDead(true);
    target.send('Type /revive to revive at the nearest hospital.');
});
