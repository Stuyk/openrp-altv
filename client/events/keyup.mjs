import * as alt from 'alt';
import * as native from 'natives';
import * as panelsInventory from 'client/panels/inventory.mjs';
import * as panelsChat from 'client/panels/chat.mjs';
import * as systemsVehicles from 'client/systems/vehicles.mjs';
// import * as chat from 'chat';

alt.log('Loaded: client->events->keyup.mjs');

let keybinds = {};
let cooldown = false;
let isChatOpen = false;

// Setup Keybinds
let keyF = 'F'.charCodeAt(0);
keybinds[keyF] = systemsVehicles.keepEngineRunning;

let keyI = 'I'.charCodeAt(0);
keybinds[keyI] = panelsInventory.showDialogue;

let keyT = 'T'.charCodeAt(0);
keybinds[keyT] = panelsChat.toggleDialogue;

// Used to Print Location Info
let keyPlus = 187;
keybinds[keyPlus] = () => {
    alt.log(
        `Interior ID: ${native.getInteriorAtCoords(
            alt.Player.local.pos.x,
            alt.Player.local.pos.y,
            alt.Player.local.pos.z
        )}`
    );
};

keybinds[118] = panelsChat.toggleHide;

alt.on('keyup', key => {
    if (!alt.Player.local.getMeta('loggedin')) return;
    if (alt.Player.local.getMeta('chat')) return;

    if (cooldown) return;

    if (keybinds[key] !== undefined) {
        cooldown = true;
        keybinds[key]();

        alt.setTimeout(() => {
            cooldown = false;
        }, 200);
    }
});
