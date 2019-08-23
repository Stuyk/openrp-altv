import * as alt from 'alt';
import { WebView } from 'client/utility/webview.mjs';

alt.log(`Loaded: panels->inventory.mjs`);

let webview;

// Show the Dialogue for the ATM Menu.
export function showDialogue() {
    webview = new WebView('inventory');
    webview.on('drop', drop);
    webview.on('use', use);
    webview.on('destroy', destroy);
    webview.on('fetchItems', fetchItems);
}

export function fetchItems() {
    alt.log(webview.view);
    if (webview.view === undefined) return;

    let itemJSON = alt.Player.local.getSyncedMeta('inventory');
    let itemArray = JSON.parse(itemJSON);

    webview.view.emit('clearitems');

    itemArray.forEach(ele => {
        webview.view.emit('parseitem', ele);
    });

    webview.view.emit('enablebuttons');
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
