import * as alt from 'alt';
import * as native from 'natives';
import * as systemsSound from '/client/systems/sound.mjs';
import { distance } from '/client/utility/vector.mjs';
import * as utilityText from '/client/utility/text.mjs';
import * as utilityMarker from '/client/utility/marker.mjs';

let itemsOnGround = [];
let objects = [];
let pickingUpItem = false;
let interval;

const unknownModel = native.getHashKey('sm_prop_smug_rsply_crate02a');
let lastUpdate = Date.now();

alt.loadModel(unknownModel);
native.requestModel(unknownModel);

export function itemDrop(player, item, randomPos) {
    if (alt.Player.local === player) {
        systemsSound.playAudio('drop');
    }

    itemsOnGround.push({ pos: randomPos, item });
    const intervalID = alt.setInterval(drawItems, 0);
}

export function itemPickup(hash) {
    if (alt.Player.local.vehicle) return;

    if (itemsOnGround.length <= 0) return;

    let index = itemsOnGround.findIndex(x => x.item.hash === hash);

    if (index <= -1) return;

    itemsOnGround.splice(index, 1);

    if (itemsOnGround.length <= 0) {
        pickingUpItem = false;
        if (interval) {
            alt.clearInterval(interval);
            interval = undefined;
        }
    }
}

function drawItems() {
    if (itemsOnGround.length <= 0) {
        if (interval) {
            alt.clearInterval(interval);
            interval = undefined;
        }

        objects.forEach(object => {
            native.freezeEntityPosition(object.id, false);
            native.deleteEntity(object.id);
        });
        objects = [];
        pickingUpItem = false;
        return;
    }

    const now = Date.now();
    if (now > lastUpdate) {
        lastUpdate = Date.now() + 500;
        objects.forEach(object => {
            native.freezeEntityPosition(object.id, false);
            native.deleteEntity(object.id);
        });
        objects = [];

        itemsOnGround.forEach(itemData => {
            const dist = distance(alt.Player.local.pos, itemData.pos);
            if (dist > 10) return;
            const id = native.createObject(
                unknownModel,
                itemData.pos.x,
                itemData.pos.y,
                itemData.pos.z - 1.05,
                false,
                false,
                false
            );
            native.freezeEntityPosition(id, true);
            objects.push({ id, data: itemData });
        });
    }

    /*
    objects.forEach(object => {
        const dist = distance(alt.Player.local.pos, object.data.pos);
        if (dist >= 2) return;
        native.beginTextCommandDisplayHelp('THREESTRINGS');
        native.addTextComponentSubstringPlayerName(
            `Press ~INPUT_CONTEXT~ to pickup (${object.data.item.name})`
        );
        native.addTextComponentSubstringPlayerName(``);
        native.addTextComponentSubstringPlayerName(``);
        native.endTextCommandDisplayHelp(0, false, false, -1);

        if (native.isControlJustPressed(0, 38)) {
            if (pickingUpItem) return;
            lastUpdate = Date.now();
            pickingUpItem = true;
            alt.emitServer('inventory:Pickup', object.data.item.hash);
            alt.setTimeout(() => {
                pickingUpItem = false;
            }, 500);
        }
    });
    */
}

alt.on('item:Pickup', data => {
    alt.emitServer('inventory:Pickup', data.hash);
    lastUpdate = Date.now();
});

export function getItemByEntity(ent) {
    const obj = objects.find(object => {
        if (object.id === ent) return object;
    });

    if (!obj) return undefined;
    return obj;
}

export function useRepairKit() {
    alt.Player.local.isRepairing = true;
    alt.emit(
        'chat:Send',
        `{00FF00} Select the vehicle you want to repair with your cursor.`
    );
}

export function useGasCan() {
    alt.Player.local.isUsingGasCan = true;
    alt.emit(
        'chat:Send',
        `{00FF00} Select the vehicle you want to re-fuel with your cursor.`
    );
}
