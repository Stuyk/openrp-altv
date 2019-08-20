import * as alt from 'alt';
import * as native from 'natives';

alt.log(`Loaded: panels->atm.mjs`);

const pagePath = `http://resources/orp/client/html/atm/index.html`;
let webView = undefined;
let viewReady = false;

// Show the Dialogue for the ATM Menu.
export function showDialogue() {
    if (panelsPanelStatus.getStatus('atm')) return;

    // Show the ATM Dialogue
    webView = new alt.WebView(pagePath);
    webView.focus();
    alt.showCursor(true);
    alt.toggleGameControls(false);

    webView.on('withdraw', withdrawBalance);
    webView.on('deposit', depositBalance);
    webView.on('close', closeDialogue);
    webView.on('ready', dialogueReady);

    alt.emit('panel:SetStatus', 'atm', true);
}

// Close the Dialogue for the ATM menu.
export function closeDialogue() {
    webView.off('withdraw', withdrawBalance);
    webView.off('deposit', depositBalance);
    webView.off('close', closeDialogue);
    webView.off('ready', dialogueReady);
    webView.unfocus();
    webView.destroy();
    alt.showCursor(false);
    alt.toggleGameControls(true);
    viewReady = false;

    alt.emit('panel:SetStatus', 'atm', false);
}

// When the Dialogue is ready toggle this boolean.
function dialogueReady() {
    viewReady = true;
}

// Update the cash value on the Webview.
export function updateCash(value) {
    if (webView === undefined) return;

    if (viewReady) {
        webView.emit('setCash', value);
    } else {
        alt.setTimeout(() => {
            webView.emit('setCash', value);
        }, 1000);
    }
}

// Show the bank value for the atm menu.
export function updateBank(value) {
    if (webView === undefined) return;

    if (viewReady) {
        webView.emit('setBank', value);
    } else {
        alt.setTimeout(() => {
            webView.emit('setBank', value);
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
    if (webView === undefined) return;

    alt.log(msg);

    webView.emit('showSuccess', msg);
}
