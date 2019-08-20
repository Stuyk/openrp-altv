import * as alt from 'alt';

console.log('Loaded: itemeffects->showlicense.mjs');

alt.on('itemeffects:ShowLicense', (player, itemData, message) => {
    player.sendMessage('You show your license.');

    player.sendMessage(`${JSON.stringify(itemData)}`);
});
