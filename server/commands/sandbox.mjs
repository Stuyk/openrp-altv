import * as alt from 'alt';
import * as chat from 'chat';

console.log('Loaded: commands->sandbox.mjs');

chat.registerCmd('pos', player => {
    console.log(player.pos);
});

chat.registerCmd('veh', player => {
    new alt.Vehicle(
        'infernus',
        player.pos.x,
        player.pos.y,
        player.pos.z,
        0,
        0,
        0
    );
});

chat.registerCmd('addcash', (player, value) => {
    let data = value * 1;

    player.addCash(data);
});

chat.registerCmd('wep', player => {
    player.giveWeapon(-1312131151, 999, true);
});
