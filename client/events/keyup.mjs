import * as alt from 'alt';
import * as native from 'natives';
import * as panelsInventory from 'client/panels/inventory.mjs';
import * as chat from 'chat';

alt.log('Loaded: client->events->keyup.mjs');

let keybinds = {};
let cooldown = false;

// Setup Keybinds
let key = 'I'.charCodeAt(0);
keybinds[key] = panelsInventory.showDialogue;

alt.on('keyup', key => {
    if (!alt.Player.local.getSyncedMeta('loggedin')) return;

    if (chat.isChatOpen()) return;

    if (cooldown) return;

    if (keybinds[key] !== undefined) {
        cooldown = true;
        keybinds[key]();

        alt.setTimeout(() => {
            cooldown = false;
        }, 200);
    }
});
