import * as alt from 'alt';

alt.on('itemeffects:UseGasCan', (player, item, hash) => {
    if (!player.subItem(item.key, 1)) {
        return;
    }

    alt.emitClient(player, 'inventory:UseGasCan');
});
