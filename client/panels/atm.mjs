import * as alt from 'alt';
//import { WebView } from 'client/utility/webview.mjs';
import { View } from 'client/utility/view.mjs';

alt.log(`Loaded: client->panels->atm.mjs`);

const url = 'http://resource/client/html/atm/index.html';
let webview;

// Show the Dialogue for the ATM Menu.
export function showDialogue() {
    if (!webview) {
        webview = new View();
    }

    if (alt.Player.local.getMeta('viewOpen')) return;

    // Load Webview
    webview.open(url);
    webview.on('atm:Withdraw', withdrawBalance);
    webview.on('atm:Deposit', depositBalance);
    webview.on('atm:Ready', atmReady);
}

// Update the cash value on the Webview.
export function updateCash(value) {
    webview.emit('setCash', value);
}

// Show the bank value for the atm menu.
export function updateBank(value) {
    webview.emit('setBank', value);
}

function atmReady() {
    alt.emitServer('atm:Ready');
}

// Called when the user is withdrawing balance from the Bank.
function withdrawBalance(value) {
    alt.emitServer('atm:Withdraw', value);
}

// Called when the user is depositing cash into the Bank.
function depositBalance(value) {
    alt.emitServer('atm:Deposit', value);
}

// Show a success message on the ATM.
export function showSuccess(msg) {
    if (webview.view === undefined) return;
    webview.emit('showSuccess', msg);
}
