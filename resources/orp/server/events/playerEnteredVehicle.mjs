import * as alt from 'alt';
import { checkRestrictions } from '../systems/job.mjs';

alt.on('playerEnteredVehicle', (player, vehicle, seat) => {
    player.lastVehicle = vehicle;

    if (vehicle.job) {
        if (seat === -1 && vehicle.job.preventHijack && vehicle.job.player !== player) {
            player.pos = new alt.Vector3(playe.pos.x, player.pos.y, player.pos.z);
            player.send('You cannot use that vehicle.');
        }
    }

    if (player.job) {
        player.vehicle = vehicle;
        checkRestrictions(player);
    }
});
