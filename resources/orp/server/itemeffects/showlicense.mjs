import * as alt from 'alt';

console.log('Loaded: itemeffects->showlicense.mjs');

alt.on('itemeffects:ShowLicense', (player, itemData) => {
    player.send('You show your license.');

    player.send(`${JSON.stringify(itemData)}`);
});
