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
    webview.on('inventory:Drop', drop);
    webview.on('inventory:Use', use);
    webview.on('inventory:Destroy', destroy);
    webview.on('inventory:FetchItems', fetchItems);
    webview.on('inventory:SetPosition', setPosition);
}

function setPosition(newIndexPosition, oldIndexPosition) {
    alt.emitServer('inventory:UpdatePosition', newIndexPosition, oldIndexPosition);
}

export function fetchItems() {
    if (webview === undefined) return;

    let itemJSON = alt.Player.local.getSyncedMeta('inventory');
    let itemArray = JSON.parse(itemJSON);

    webview.emit('clearitems');

    itemArray.forEach((item, index) => {
        if (!item) {
            webview.emit('inventory:AddItem', index, null);
            return;
        }

        webview.emit(
            'inventory:AddItem',
            index,
            item.label,
            item.hash,
            item.props,
            item.quantity
        );
    });

    webview.emit('enablebuttons');
}

function destroy(hash) {
    alt.emitServer('inventory:DestroyItem', hash);
}

function use(hash) {
    alt.emitServer('inventory:UseItem', hash);
}

function drop(hash, quantity) {
    alt.emitServer('inventory:DropItem', hash, quantity);
}
