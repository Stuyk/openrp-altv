import * as alt from 'alt';
import { View } from '/client/utility/view.mjs';

alt.log('Loaded: client->panels->info.mjs');

const url = 'http://resource/client/html/crafting/index.html';
let webview;

export function weaponryCrafting() {
    alt.emitServer('gangs:CheckCraftDialogue', 'weaponry');
}

alt.onServer('gangs:ShowCraftingDialogue', type => {
    showDialogue(type);
});

// Show the webview for the player to type in their roleplay info.
export function showDialogue(type) {
    alt.log('Got it. This is your point.');
    alt.log(type);

    /*
    if (!webview) {
        webview = new View();
    }

    if (alt.Player.local.getMeta('viewOpen')) return;
    if (alt.Player.local.getSyncedMeta('dead')) return;
    if (alt.Player.local.getMeta('arrest')) return;

    // Setup Webview
    /*
    webview.open(url, true);
    webview.on('general:Close', closeDialogue);
    webview.on('general:Buy', buy);
    webview.on('general:Ready', ready);
    */
}

function closeDialogue() {
    if (!webview) return;
    alt.emit('hud:AdjustHud', false);
    webview.close();
}

function ready() {
    if (!webview) return;
}
