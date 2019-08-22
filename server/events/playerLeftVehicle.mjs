import * as alt from 'alt';

alt.on('playerLeftVehicle ', (player, vehicle, seat) => {
    if (player.vehicles === undefined) return;

    // Not their vehicle.
    if (!player.vehicles.includes(targetVehicle)) return;

    vehicle.savePosition();
    vehicle.saveRotation();
});
