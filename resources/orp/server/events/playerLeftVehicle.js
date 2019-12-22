import * as alt from 'alt';
import { quitTarget } from '../systems/job.js';

alt.on('playerLeftVehicle', (player, vehicle) => {
    if (player.getSyncedMeta('arrested')) return false;

    player.lastVehicle = vehicle;

    if (player.jobber && vehicle.job) {
        quitTarget(player);
    }

    if (player.vehicles === undefined) {
        return;
    }

    // Not their vehicle.
    if (!player.vehicles.includes(vehicle)) {
        return;
    }

    if (vehicle.data === undefined) {
        return;
    }

    vehicle.saveVehicleData();

    if (player) {
        player.saveLocation(player.pos);
    }
});
