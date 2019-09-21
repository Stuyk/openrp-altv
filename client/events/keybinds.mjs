import * as alt from 'alt';
import * as native from 'natives';
import * as panelsInventory from '/client/panels/inventory.mjs';
import * as panelsChat from '/client/panels/chat.mjs';
import * as panelsHelp from '/client/panels/help.mjs';
import * as systemsVehicles from '/client/systems/vehicles.mjs';
import * as systemsContext from '/client/systems/context.mjs';
import * as utilityGameInfo from '/client/utility/gameinfo.mjs';
// import * as chat from 'chat';

alt.log('Loaded: client->events->keyup.mjs');

let keybinds = {
    // Shift + F - Keep Engine Running
    70: {
        altModifier: false,
        shiftModifier: true,
        func: systemsVehicles.keepEngineRunning
    },
    // Shift + F - Keep Engine Running
    71: {
        altModifier: false,
        shiftModifier: true,
        func: systemsVehicles.toggleEngine
    },
    // H - Toggle Vehicle Lock
    72: {
        altModifier: false,
        shiftModifier: true,
        func: systemsVehicles.toggleLock
    },
    // I - Inventory
    73: {
        altModifier: false,
        shiftModifier: false,
        func: panelsInventory.showDialogue
    },
    // T - Chat
    84: {
        altModifier: false,
        shiftModifier: false,
        func: panelsChat.toggleDialogue
    },
    // Shift + F1 - Get Interior Info
    112: {
        altModifier: false,
        shiftModifier: true,
        func: utilityGameInfo.printInteriorInfo
    },
    // Shift + F2 - Get Location Info
    113: {
        altModifier: false,
        shiftModifier: true,
        func: utilityGameInfo.printLocation
    },
    // Shift + F7 - Hide Chat
    118: {
        altModifier: false,
        shiftModifier: true,
        func: panelsChat.toggleHide
    },
    // Tab - Toggle Cursor
    9: {
        altModifier: false,
        shiftModifier: false,
        func: systemsContext.toggleInterval
    }
};
let cooldown = false;
let shiftModified = false;
let altModified = false;

alt.on('meta:Changed', loadInterval);

// Only starts the interval after the player has logged in.
function loadInterval(key) {
    if (key !== 'loggedin') return;
    alt.off('meta:Changed', loadInterval);
    alt.on('keyup', keyup);
    alt.on('keydown', keydown);
}

function keyup(key) {
    if (key === 16) shiftModified = false;
    if (key === 18) altModified = false;

    if (!alt.Player.local.getMeta('loggedin')) return;
    if (alt.Player.local.getMeta('chat')) return;

    if (cooldown) return;
    if (keybinds[key] !== undefined) {
        cooldown = true;
        alt.setTimeout(() => {
            cooldown = false;
        }, 200);

        // Shift Modified Keys
        if (keybinds[key].shiftModifier) {
            if (!shiftModified) return;
            keybinds[key].func();
            return;
        }

        // Alt Modified Keys
        if (keybinds[key].altModifier) {
            if (!altModified) return;
            keybinds[key].func();
            return;
        }

        // Normal Keys
        keybinds[key].func();
        return;
    }
}

// For Key Modifiers
function keydown(key) {
    if (key === 16) shiftModified = true;
    if (key === 18) altModified = true;
}
