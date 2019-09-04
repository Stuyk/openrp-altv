import * as alt from 'alt';
import * as native from 'natives';
//import * as panelsPanelStatus from 'client/panels/panelstatus.mjs';
//import { WebView } from 'client/utility/webview.mjs';
import { View } from 'client/utility/view.mjs';

alt.log(`Loaded: client->panels->inventory.mjs`);

const url = 'http://resource/client/html/inventory/index.html';
let webview = undefined;

// Show the Dialogue for the Inventory
export function showDialogue() {
    if (!alt.Player.local.getSyncedMeta('loggedin')) return;
    // Load Webview
    if (webview !== undefined && webview.view !== undefined) {
        if (webview.view.url === url) {
            webview.close();
            return;
        }
    }

    webview = new View(url);
    webview.on('drop', drop);
    webview.on('use', use);
    webview.on('destroy', destroy);
    webview.on('fetchItems', fetchItems);

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

function disableControls() {
    native.disableControlAction(0, 24, true);
    native.disableControlAction(0, 25, true);
}
