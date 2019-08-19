import * as alt from 'alt';
import * as configurationHospitals from '../configuration/hospitals.mjs';
import * as utilityVector from '../utility/vector.mjs';

alt.on('playerDeath', (target, killer, weapon) => {
    if (target.reviving) return;

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

    target.data.dead = true;
    target.data.lastposition = JSON.stringify(closestHospital);
    target.revivePos = closestHospital;
    target.sendMessage('Type /revive to revive at the nearest hospital.');
});
