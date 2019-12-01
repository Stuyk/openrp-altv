import * as alt from 'alt';
import { View } from '/client/utility/view.mjs';

alt.log('Loaded: client->panels->info.mjs');

const url = 'http://resource/client/html/trade/index.html';
let webview;
let targetName = '';

alt.onServer('trade:Establish', target => {
    if (!target) {
        return;
    }

    targetName = target.getSyncedMeta('name');
    showDialogue();
});

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
    webview.on('trade:Close', closeDialogue);
    webview.on('trade:OfferItems', offerItems);
    webview.on('trade:OfferCash', offerCash);
    webview.on('trade:LockState', lockState);
    webview.on('trade:Ready', ready);
}

function offerItems(items) {
    alt.emitServer('trade:OfferItems', items);
}

function offerCash(cash) {
    alt.emitServer('trade:OfferCash', cash);
}

function lockState(state) {
    alt.emitServer('trade:LockState', state);
}

function closeDialogue() {
    if (!webview) return;
    alt.emitServer('trade:KillTrade');
}

function ready() {
    if (!webview) return;
    const inventory = JSON.parse(alt.Player.local.getMeta('inventory'));
    webview.emit('trade:SetInventory', inventory);

    const cash = alt.Player.local.getMeta('cash');
    webview.emit('trade:SetCash', cash);

    const name = targetName;
    webview.emit('trade:SetTargetName', name);

    let nullSlotCount = 0;
    inventory.forEach((item, index) => {
        if (index >= 28) return;
        if (!item) {
            nullSlotCount += 1;
        }
    });

    alt.emitServer('trade:SetTargetSlotsAvailable', nullSlotCount);
}

alt.onServer('trade:KillTrade', () => {
    if (!webview) return;
    webview.close();
});

alt.onServer('trade:SetOfferedItems', items => {
    if (!webview) return;
    webview.emit('trade:SetOfferedItems', items);
});

alt.onServer('trade:SetOfferedCash', cash => {
    if (!webview) return;
    webview.emit('trade:SetOfferedCash', cash);
});

alt.onServer('trade:SetLockState', state => {
    if (!webview) return;
    webview.emit('trade:SetLockState', state);
});

alt.onServer('trade:SetTargetSlots', slots => {
    if (!webview) return;
    webview.emit('trade:SetTargetSlots', slots);
});
