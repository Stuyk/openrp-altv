import * as alt from 'alt';
import { View } from '/client/utility/view.js';
import { showCursor } from '/client/utility/cursor.js';

alt.log('Loaded: client->panels->info.js');

const url = 'http://resource/client/html/mdc/index.html';
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
    webview.on('mdc:Close', closeDialogue);
    webview.on('mdc:TurnIn', turnIn);
    webview.on('mdc:Pursue', pursue);
    webview.on('mdc:Ready', ready);
}

// Finish using this webview.
export function closeDialogue() {
    webview.close();
    showCursor(false);
}

export function data(data) {
    if (!webview) return;
    const dataArr = JSON.parse(data);
    dataArr.forEach(dat => {
        webview.emit('mdc:AddCase', dat.attacker, dat.victim, dat.reason, dat.hash);
    });
}

function ready() {
    showCursor(true);
    alt.emitServer('mdc:GetData');
}

function turnIn(hash) {
    alt.emitServer('mdc:TurnIn', hash);
}

function pursue(hash) {
    alt.emitServer('mdc:Pursue', hash);
}

alt.on('keyup', key => {
    if (key === 'u'.charCodeAt(0)) {
        showDialogue();
    }
});
