import * as alt from 'alt';

console.log('Loaded: itemeffects->showlicense.mjs');

alt.on('itemeffects:ShowLicense', (player, itemData) => {
    player.sendMessage('You show your license.');
});
