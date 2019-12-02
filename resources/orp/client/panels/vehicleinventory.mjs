import * as alt from 'alt';
import { View } from '/client/utility/view.mjs';

alt.log('Loaded: client->panels->info.mjs');

const url = 'http://resource/client/html/vehicleinventory/index.html';
let webview;
let vehicle;
let inventory;

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
    webview.on('vehinv:Close', closeDialogue);
    webview.on('vehinv:Ready', ready);
    webview.on('vehinv:AddItem', addItem);
    webview.on('vehinv:SubItem', subItem);
}

function closeDialogue() {
    if (!webview) return;
    webview.close();
}

function ready() {
    if (!webview) return;
    webview.emit('vehinv:SyncInventory', inventory);

    const playerInventory = JSON.parse(alt.Player.local.getMeta('inventory'));
    webview.emit('vehinv:SetInventory', playerInventory);
}

function addItem(hash) {
    if (!vehicle) return;
    alt.emitServer('vehicle:AddItemToVehicle', hash, vehicle);
}

function subItem(hash) {
    if (!vehicle) return;
    alt.emitServer('vehicle:RemoveItemFromVehicle', hash, vehicle);
}

alt.onServer('vehicle:AccessTrunk', (currentVehicle, currentInventory) => {
    vehicle = currentVehicle;
    inventory = currentInventory;
    showDialogue();
});

alt.onServer('vehicle:SyncInventory', (currentVehicle, currentInventory) => {
    if (vehicle !== currentVehicle) return;
    inventory = currentInventory;

    if (webview) {
        webview.emit('vehinv:SyncInventory', inventory);
    }
});

alt.on('meta:Changed', (key, value) => {
    if (key !== 'inventory') {
        return;
    }

    if (webview) {
        webview.emit('vehinv:SetInventory', JSON.parse(value));
    }
});
