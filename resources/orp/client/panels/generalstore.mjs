import * as alt from 'alt';
import { View } from '/client/utility/view.mjs';

alt.log('Loaded: client->panels->info.mjs');

const url = 'http://resource/client/html/generalstore/index.html';
let webview;

// Show the webview for the player to type in their roleplay info.
export function showDialogue() {
    if (!webview) {
        webview = new View();
    }

    if (alt.Player.local.getMeta('viewOpen')) return;
    if (alt.Player.local.getSyncedMeta('dead')) return;
    if (alt.Player.local.getMeta('arrest')) return;

    // Setup Webview
    webview.open(url, true);
    webview.on('general:Close', closeDialogue);
    webview.on('general:Buy', buy);
    webview.on('general:Ready', ready);
}

function closeDialogue() {
    if (!webview) return;
    alt.emit('hud:AdjustHud', false);
    webview.close();
}

function ready() {
    if (!webview) return;
    alt.emitServer('general:GetItems');
    alt.emit('hud:AdjustHud', true);
}

function buy(itemKey) {
    if (!webview) return;
    alt.emitServer('general:BuyItem', itemKey);
}

alt.onServer('general:Items', items => {
    if (!webview) return;
    const currentItems = JSON.parse(items);
    if (!currentItems) return;
    currentItems.forEach(item => {
        webview.emit('general:AddItem', item);
    });
});
