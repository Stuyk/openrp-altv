import * as alt from 'alt';

alt.on('itemeffects:RepairVehicle', player => {
    alt.emitClient(player, 'inventory:UseRepairKit');
});
