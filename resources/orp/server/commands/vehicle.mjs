import * as alt from 'alt';
import * as chat from '../chat/chat.mjs';

chat.registerCmd('destroyvehicle', player => {
    if (!player.destroyVehicle) return;
    const index = player.vehicles.findIndex(
        veh => parseInt(veh.data.id) === player.destroyVehicle
    );

    if (index <= -1) {
        player.notify('Vehicle is not defined for destroying.');
        return;
    }

    if (player.vehicles[index]) {
        player.vehicles[index].destroy();
        player.vehicles.splice(index, 1);
        player.emitMeta('vehicles', player.vehicles);
        const vehData = [];
        player.vehicles.forEach(veh => {
            vehData.push(JSON.stringify(veh.data));
        });
        player.emitMeta('vehiclesMeta', vehData);
    }

    player.deleteVehicle(player.destroyVehicle);
    player.destroyVehicle = undefined;
    player.notify('The vehicle has been deleted.');
});
