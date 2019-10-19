import * as alt from 'alt';

alt.on('itemeffects:RepairVehicle', (player, item, hash) => {
    if (!player.subItem(item.key, 1)) {
        return;
    }

    player.send('You begin repairing the vehicle.');

    // TODO: couldn't get animation to work :(
    //player.playAnimation = ('mini@repair', 'fixing_a_car', 1200, 33);

    alt.emitClient(player, 'inventory:UseRepairKit');
});
