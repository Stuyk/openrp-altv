import * as alt from 'alt';

alt.on('itemeffects:ShowLicense', (player, itemData) => {
    player.send('You show your license.');

    player.send(`${JSON.stringify(itemData)}`);
});
