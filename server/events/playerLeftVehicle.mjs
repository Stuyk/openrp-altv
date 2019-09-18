import * as alt from 'alt';
import * as systemsJob from '../systems/job.mjs';

console.log('Loaded: events->playerLeftVehicle.mjs');

alt.on('playerLeftVehicle', (player, vehicle) => {
    if (player.vehicles === undefined) return;

    // Not their vehicle.
    if (!player.vehicles.includes(vehicle)) return;
    if (vehicle.data === undefined) return;

    vehicle.saveVehicleData();
});
