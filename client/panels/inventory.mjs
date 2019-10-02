import * as alt from 'alt';
import * as native from 'natives';
//import * as panelsPanelStatus from 'client/panels/panelstatus.mjs';
//import { WebView } from 'client/utility/webview.mjs';
import { View } from '/client/utility/view.mjs';
import { getLevel } from '/client/systems/xp.mjs';

alt.log(`Loaded: client->panels->inventory.mjs`);

const url = 'http://resource/client/html/inventory/index.html';
let webview;

alt.on('meta:Changed', (key, value) => {
    if (key !== 'equipment' && key !== 'inventory') return;
    if (webview === undefined) return;
    fetchEquipment();
    fetchStats();
    fetchItems();
});

// Show the Dialogue for the Inventory
export function showDialogue() {
    if (!webview) {
        webview = new View();
    }

    if (alt.Player.local.getMeta('viewOpen')) return;

    // Setup Webview
    webview.open(url, true);
    webview.on('inventory:Drop', drop);
    webview.on('inventory:Use', use);
    webview.on('inventory:Destroy', destroy);
    webview.on('inventory:FetchItems', fetchItems);
    webview.on('inventory:SwapItem', swapItem);
    webview.on('inventory:Rename', rename);
    webview.on('inventory:Exit', exit);
    webview.on('inventory:FetchStats', fetchStats);
    webview.on('inventory:FetchEquipment', fetchEquipment);
    webview.on('inventory:UnequipItem', unequipItem);
    webview.on('inventory:Split', split);
}

function swapItem(heldIndex, dropIndex) {
    alt.emitServer('inventory:SwapItem', heldIndex, dropIndex);
}

export function fetchEquipment() {
    if (webview === undefined) return;
    const equipmentJSON = alt.Player.local.getMeta('equipment');
    const equipmentArray = JSON.parse(equipmentJSON);

    equipmentArray.forEach((item, index) => {
        if (!item) {
            webview.emit('inventory:EquipItem', null, index, null);
            return;
        }

        webview.emit('inventory:EquipItem', item.name, index, item.hash, item.icon);
    });
}

export function fetchStats() {
    if (webview === undefined) return;
    const statJSON = alt.Player.local.getMeta('skills');
    const statArray = JSON.parse(statJSON);

    Object.keys(statArray).forEach(key => {
        webview.emit(
            'inventory:AddStat',
            key,
            getLevel(statArray[key].xp),
            statArray[key].xp
        );
    });
}

export function fetchItems() {
    if (webview === undefined) return;
    const itemJSON = alt.Player.local.getMeta('inventory');
    const itemArray = JSON.parse(itemJSON);

    itemArray.forEach((item, index) => {
        if (!item) {
            webview.emit('inventory:AddItem', index, null);
            return;
        }

        // const [name, index, base, hash, quantity, props] = args;
        webview.emit(
            'inventory:AddItem',
            item.name,
            index,
            item.base,
            item.hash,
            item.quantity,
            item.props,
            item.icon
        );
    });

    //webview.emit('enablebuttons');
}

function exit() {
    webview.close();
}

function destroy(hash) {
    alt.emitServer('inventory:DestroyItem', hash);
}

function use(hash) {
    alt.emitServer('inventory:UseItem', hash);
}

function drop(hash, quantity) {
    alt.emitServer('inventory:DropItem', hash);
}

function rename(hash, name) {
    alt.emitServer('inventory:RenameItem', hash, name);
}

function unequipItem(hash) {
    alt.emitServer('inventory:UnequipItem', hash);
}

function split(hash) {
    alt.emitServer('inventory:Split', hash);
}
