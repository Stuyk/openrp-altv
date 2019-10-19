import * as alt from 'alt';

alt.on('itemeffects:RepairVehicle', (player, itemData) => {
    player.send('You begin repairing the vehicle.');

    // TODO: couldn't get animation to work :(
    //player.playAnimation = ('mini@repair', 'fixing_a_car', 1200, 33);

    //player.send(`${JSON.stringify(itemData)}`);
    alt.emitClient(player, 'inventory:UseRepairKit');
});
