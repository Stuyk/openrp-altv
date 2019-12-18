import * as alt from 'alt';
import { View } from '/client/utility/view.js';
import { showCursor } from '/client/utility/cursor.js';

alt.log(`Loaded: client->panels->atm.js`);
alt.on('atm:Open', showDialogue);
alt.on('meta:Changed', updateData);

const url = 'http://resource/client/html/atm/index.html';
let webview;

// Show the Dialogue for the ATM Menu.
export function showDialogue() {
    if (!webview) {
        webview = new View();
    }

    if (alt.Player.local.getMeta('viewOpen')) return;
    if (alt.Player.local.getSyncedMeta('dead')) return;
    if (alt.Player.local.getMeta('arrest')) return;

    // Load Webview
    webview.open(url);
    webview.on('atm:Redeem', redeem);
    webview.on('atm:Ready', ready);
    webview.on('atm:Close', close);
}

function close() {
    if (!webview) {
        return;
    }

    webview.close();
    showCursor(false);
}

function redeem(points) {
    alt.emitServer('atm:Redeem', points);
}

function ready() {
    showCursor(true);
    loadData();
}

function loadData() {
    if (!webview) {
        return;
    }

    const availablePoints = alt.Player.local.getMeta('reward:Available');
    const totalPoints = alt.Player.local.getMeta('reward:Total');
    const cashPerPoint = alt.Player.local.getMeta('reward:PerPoint');
    webview.emit('atm:SetAvailablePoints', availablePoints);
    webview.emit('atm:SetTotalPoints', totalPoints);
    webview.emit('atm:CashPerPoint', cashPerPoint);
}

function updateData(key, value) {
    if (!key.includes('reward:')) {
        return;
    }

    loadData();
}
