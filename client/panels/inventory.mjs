import * as alt from 'alt';
import * as native from 'natives';
import * as panelsPanelStatus from 'client/panels/panelstatus.mjs';
//import { WebView } from 'client/utility/webview.mjs';

alt.log(`Loaded: panels->inventory.mjs`);

let webview = undefined;

// Show the Dialogue for the Inventory
export function showDialogue() {
    if (webview) {
        close();
        return;
    }

    if (panelsPanelStatus.isAnyPanelOpen()) return;

    webview = new alt.WebView('http://resources/orp/client/html/inventory/index.html');

    alt.emit('panel:SetStatus', 'inventory', true);
    webview.focus();
    webview.on('drop', drop);
    webview.on('use', use);
    webview.on('destroy', destroy);
    webview.on('fetchItems', fetchItems);
    webview.on('close', close);

    alt.showCursor(true);
    alt.on('update', disableControls);
}

export function fetchItems() {
    if (webview === undefined) return;

    let itemJSON = alt.Player.local.getSyncedMeta('inventory');
    let itemArray = JSON.parse(itemJSON);

    webview.emit('clearitems');

    itemArray.forEach(ele => {
        webview.emit('parseitem', ele);
    });

    webview.emit('enablebuttons');
}

function destroy(hash) {
    alt.emitServer('inventory:DestroyItem', hash);
}

function use(hash) {
    alt.log('USING');
    alt.emitServer('inventory:UseItem', hash);
}

function drop(hash) {
    alt.log('DROPPED');
    alt.emitServer('inventory:DropItem', hash);
}

function close() {
    webview.off('drop', drop);
    webview.off('use', use);
    webview.off('destroy', destroy);
    webview.off('fetchItems', fetchItems);
    webview.off('close', close);
    webview.destroy();
    alt.showCursor(false);
    alt.toggleGameControls(true);
    alt.off('update', disableControls);
    alt.emit('panel:SetStatus', 'inventory', false);
    webview = undefined;
}

function disableControls() {
    native.disableControlAction(0, 24, true);
    native.disableControlAction(0, 25, true);
}
