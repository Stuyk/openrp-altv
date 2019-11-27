import * as alt from 'alt';
import { View } from '/client/utility/view.mjs';

alt.log('Loaded: client->panels->info.mjs');

const url = 'http://resource/client/html/generalstore/index.html';
let webview;
let storeType = 'general';

alt.on('store:Food', () => {
    showDialogue('food');
});

// Show the webview for the player to type in their roleplay info.
export function showDialogue(setStoreType = 'general') {
    if (!webview) {
        webview = new View();
    }

    if (alt.Player.local.getMeta('viewOpen')) return;
    if (alt.Player.local.getSyncedMeta('dead')) return;
    if (alt.Player.local.getMeta('arrest')) return;

    storeType = setStoreType;

    // Setup Webview
    webview.open(url, true);
    webview.on('general:Close', closeDialogue);
    webview.on('general:Buy', buy);
    webview.on('general:Ready', ready);
}

function closeDialogue() {
    if (!webview) return;
    webview.close();
}

function ready() {
    if (!webview) return;
    alt.emitServer('general:GetItems', storeType);
}

function buy(itemKey, amount) {
    if (!webview) return;
    alt.emitServer('general:BuyItem', storeType, itemKey, amount);
}

// When the player updates their inventory.
alt.on('meta:Changed', (key, value) => {
    if (key !== 'cash') return;
    if (!webview) return;
    webview.emit('general:SetCash', value);
});

alt.onServer('general:Items', items => {
    if (!webview) return;
    const currentItems = JSON.parse(items);
    if (!currentItems) return;
    currentItems.forEach(item => {
        webview.emit('general:AddItem', item);
    });

    webview.emit('general:SetCash', alt.Player.local.getMeta('cash'));
});
