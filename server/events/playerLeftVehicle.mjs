import * as alt from 'alt';
import * as systemsJob from '../systems/job.mjs';

console.log('Loaded: events->playerLeftVehicle.mjs');

alt.on('playerLeftVehicle', (player, vehicle) => {
    if (systemsJob.isTarget(player, vehicle) && player.jobTarget !== undefined) {
        systemsJob.exitFee(player, vehicle.job);
    }

    if (player.inJobVehicle && vehicle.job !== undefined) {
        systemsJob.exitFee(player, vehicle.job);
    }

    if (player.vehicles === undefined) return;

    // Not their vehicle.
    if (!player.vehicles.includes(vehicle)) return;
    if (vehicle.data === undefined) return;

    vehicle.saveVehicleData();
});
