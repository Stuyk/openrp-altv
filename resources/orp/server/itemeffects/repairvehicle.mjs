import * as alt from 'alt';

alt.on('itemeffects:RepairVehicle', (player, item, hash) => {
    if (!player.subItem(item.key, 1)) {
        return;
    }

    alt.emitClient(player, 'inventory:UseRepairKit');
});
