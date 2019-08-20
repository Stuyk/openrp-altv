import * as alt from 'alt';
import * as native from 'natives';
import * as panelsPanelStatus from 'client/panels/panelstatus.mjs';

alt.log(`Loaded: panels->inventory.mjs`);

const pagePath = `http://resources/orp/client/html/inventory/index.html`;
let webView = undefined;

// Show the Dialogue for the ATM Menu.
export function showDialogue() {
    if (panelsPanelStatus.getStatus('inventory')) return;

    // Show the ATM Dialogue
    webView = new alt.WebView(pagePath);
    webView.focus();
    alt.showCursor(true);
    alt.toggleGameControls(false);

    webView.on('drop', drop);
    webView.on('use', use);
    webView.on('destroy', destroy);
    webView.on('close', closeDialogue);
    webView.on('fetchItems', fetchItems);

    alt.emit('panel:SetStatus', 'inventory', true);
}

// Close the Dialogue for the ATM menu.
export function closeDialogue() {
    webView.off('drop', drop);
    webView.off('use', use);
    webView.off('destroy', destroy);
    webView.off('close', closeDialogue);
    webView.off('fetchItems', fetchItems);
    webView.unfocus();
    webView.destroy();
    webView = undefined;
    alt.showCursor(false);
    alt.toggleGameControls(true);

    alt.emit('panel:SetStatus', 'inventory', false);
}

export function fetchItems() {
    if (webView === undefined) return;

    let itemJSON = alt.Player.local.getSyncedMeta('inventory');
    let itemArray = JSON.parse(itemJSON);

    webView.emit('clearitems');

    itemArray.forEach(ele => {
        webView.emit('parseitem', ele);
    });

    webView.emit('enablebuttons');
}

function destroy(hash) {
    alt.emitServer('inventory:DestroyItem', hash);
}

function use(hash) {
    alt.emitServer('inventory:UseItem', hash);
}

function drop(hash) {
    alt.emitServer('inventory:DropItem', hash);
}
