import * as alt from 'alt';
import { quitTarget } from '../systems/job.mjs';

console.log('Loaded: events->playerLeftVehicle.mjs');

alt.on('playerLeftVehicle', (player, vehicle) => {
    player.lastVehicle = vehicle;

    if (player.jobber && vehicle.job) {
        quitTarget(player);
    }

    if (player.vehicles === undefined) return;

    // Not their vehicle.
    if (!player.vehicles.includes(vehicle)) return;
    if (vehicle.data === undefined) return;

    vehicle.saveVehicleData();
});
