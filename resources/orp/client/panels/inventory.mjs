import * as alt from 'alt';
import * as native from 'natives';
//import * as panelsPanelStatus from 'client/panels/panelstatus.mjs';
//import { WebView } from 'client/utility/webview.mjs';
import { View } from '/client/utility/view.mjs';
import { getLevel } from '/client/systems/xp.mjs';

alt.log(`Loaded: client->panels->inventory.mjs`);

const options = ['AirplaneMode', 'YandexKey', 'Language'];
const url = 'http://resource/client/html/inventory/index.html';
let webview;

alt.on('meta:Changed', (key, value) => {
    if (
        key !== 'equipment' &&
        key !== 'inventory' &&
        key !== 'skills' &&
        key !== 'contactList'
    )
        return;

    switch (key) {
        case 'equipment':
            fetchEquipment(value);
            break;
        case 'inventory':
            fetchItems(value);
            break;
        case 'skills':
            fetchStats(value);
            break;
        case 'contactList':
            fetchContacts();
            break;
    }

    loadOptions();
});

// Show the Dialogue for the Inventory
export function showDialogue() {
    if (!webview) {
        webview = new View();
    }

    if (alt.Player.local.getMeta('viewOpen')) return;
    if (alt.Player.local.getSyncedMeta('dead')) return;
    if (alt.Player.local.getMeta('arrest')) return;

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
    webview.on('inventory:FetchVehicles', fetchVehicles);
    webview.on('inventory:LocateVehicle', locateVehicle);
    webview.on('inventory:DestroyVehicle', destroyVehicle);
    webview.on('inventory:FetchContacts', fetchContacts);
    webview.on('inventory:AddContact', addContact);
    webview.on('inventory:DeleteContact', deleteContact);
    webview.on('option:SetOption', setOption);
    webview.on('option:LoadOptions', loadOptions);

    alt.emit('hud:AdjustHud', true);
}

function swapItem(heldIndex, dropIndex) {
    alt.emitServer('inventory:SwapItem', heldIndex, dropIndex);
}

export function fetchEquipment(value) {
    if (webview === undefined) return;
    if (!value) {
        value = alt.Player.local.getMeta('equipment');
    }

    const equipmentArray = JSON.parse(value);

    alt.log('Fetched Equipment');

    equipmentArray.forEach((item, index) => {
        if (!item) {
            webview.emit('inventory:EquipItem', null, index, null);
            return;
        }

        webview.emit('inventory:EquipItem', item.name, index, item.hash, item.icon);
    });
}

export function fetchStats(value) {
    if (webview === undefined) return;
    if (!value) {
        value = alt.Player.local.getMeta('skills');
    }
    const statArray = JSON.parse(value);

    alt.log('Fetched Stats');

    Object.keys(statArray).forEach(key => {
        webview.emit(
            'inventory:AddStat',
            key,
            getLevel(statArray[key].xp),
            statArray[key].xp
        );
    });
}

export function fetchItems(value) {
    if (webview === undefined) return;
    if (!value) {
        value = alt.Player.local.getMeta('inventory');
    }

    const itemArray = JSON.parse(value);
    if (!itemArray) return;
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

    webview.emit('inventory:ForceUpdate');
}

function exit() {
    webview.close();
    alt.emit('hud:AdjustHud', false);
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

function fetchVehicles() {
    if (!webview) return;
    const vehicles = alt.Player.local.getMeta('vehiclesMeta');
    if (!vehicles) return;
    vehicles.forEach(veh => {
        webview.emit('inventory:RecieveVehicle', JSON.parse(veh));
    });
}

function locateVehicle(id) {
    exit();
    alt.emitServer('vehicle:TrackVehicle', id);
}

function destroyVehicle(id) {
    exit();
    alt.emitServer('vehicle:DestroyVehicle', id);
}

function fetchContacts() {
    if (!webview) return;
    const contacts = alt.Player.local.getMeta('contactList');
    if (!contacts) return;
    webview.emit('inventory:ClearContacts');
    contacts.forEach(contact => {
        webview.emit('inventory:SetContact', contact.id, contact.name, contact.online);
    });
}

function addContact(id) {
    if (!webview) return;
    webview.emit('inventory:ClearContacts');
    alt.emitServer('phone:AddContact', id);
}

function deleteContact(id) {
    if (!webview) return;
    webview.emit('inventory:ClearContacts');
    alt.emitServer('phone:DeleteContact', id);
}

function setOption(key, value) {
    const cache = alt.LocalStorage.get();
    cache.set(key, value);
    cache.save();
    loadOptions();

    alt.emit('hud:QueueNotification', `Option: ${key} updated to ${value}`);
}

function loadOptions() {
    const cache = alt.LocalStorage.get();

    if (!webview) {
        options.forEach(option => {
            alt.emit('option:Changed', option, cache.get(`option:${option}`));
        });
        return;
    }

    options.forEach(option => {
        alt.emit('option:Changed', option, cache.get(`option:${option}`));
        webview.emit('option:SetOption', option, cache.get(`option:${option}`));
    });
}
