import * as alt from 'alt';

console.log('Loaded: events->playerLeftVehicle.mjs');

alt.on('playerLeftVehicle', (player, vehicle, seat) => {
    if (player.vehicles === undefined) return;

    // Not their vehicle.
    if (!player.vehicles.includes(vehicle)) return;

    vehicle.saveVehicleData();
});
