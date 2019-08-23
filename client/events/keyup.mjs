import * as alt from 'alt';
import * as native from 'natives';
import * as panelsInventory from 'client/panels/inventory.mjs';
import * as chat from 'chat';

alt.log('Loaded: client->events->keyup.mjs');

let keybinds = {};

// Setup Keybinds
let key = 'I'.charCodeAt(0);
keybinds[key] = panelsInventory.showDialogue;

alt.on('keyup', key => {
    if (!alt.Player.local.getSyncedMeta('loggedin')) return;

    if (chat.isChatOpen()) return;

    if (keybinds[key] !== undefined) {
        keybinds[key]();
    }
});
