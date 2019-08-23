import * as alt from 'alt';
import { WebView } from 'client/utility/webview.mjs';

alt.log(`Loaded: panels->atm.mjs`);

let webview;

// Show the Dialogue for the ATM Menu.
export function showDialogue() {
    webview = new WebView('atm');
    webview.on('withdraw', withdrawBalance);
    webview.on('deposit', depositBalance);
}

export function closeDialogue() {
    // This won't work because this is undefined inside the class :/
    // Need to figure out how to store the class reference globally so you can re-access it to call close
    webview.close(webview);
}

// Update the cash value on the Webview.
export function updateCash(value) {
    if (webview.view === undefined) return;

    if (webview.ready) {
        webview.emit(webview, 'setCash', value);
    } else {
        alt.setTimeout(() => {
            webview.emit(webview, 'setCash', value);
        }, 1000);
    }
}

// Show the bank value for the atm menu.
export function updateBank(value) {
    if (webview.view === undefined) return;

    if (webview.ready) {
        webview.emit(webview, 'setBank', value);
    } else {
        alt.setTimeout(() => {
            webview.emit(webview, 'setBank', value);
        }, 1000);
    }
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

    alt.log(msg);

    webview.emit(webview, 'showSuccess', msg);
}
