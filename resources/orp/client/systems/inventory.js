import * as alt from 'alt';
import * as native from 'natives';
import { distance } from '/client/utility/vector.js';

let itemsOnGround = [];
let objects = [];
let lastDropUpdate = Date.now();
let drawItemsInterval;

const unknownModel = native.getHashKey('sm_prop_smug_rsply_crate02a');

alt.loadModel(unknownModel);
native.requestModel(unknownModel);

alt.onServer('inventory:ItemDrops', itemDrops);
alt.onServer('inventory:ItemPickup', itemPickup);
alt.onServer('inventory:UseRepairKit', useRepairKit);
alt.onServer('inventory:UseGasCan', useGasCan);

function itemDrops(jsonDrops) {
    itemsOnGround = JSON.parse(jsonDrops);

    if (drawItemsInterval) {
        alt.clearInterval(drawItemsInterval);
        drawItemsInterval = undefined;
    }

    if (itemsOnGround.length <= 0) {
        return;
    }

    drawItemsInterval = alt.setInterval(drawItems, 0);
}

function itemPickup(hash) {
    if (alt.Player.local.vehicle) {
        return;
    }

    if (itemsOnGround.length <= 0) {
        return;
    }

    let index = itemsOnGround.findIndex(item => item.hash === hash);
    if (index <= -1) {
        return;
    }

    itemsOnGround.splice(index, 1);
}

function drawItems() {
    if (itemsOnGround.length <= 0) {
        if (objects.length >= 1) {
            objects.forEach(object => {
                native.freezeEntityPosition(object.id, false);
                native.deleteEntity(object.id);
            });
            objects = [];
        }
        return;
    }

    if (Date.now() > lastDropUpdate) {
        lastDropUpdate = Date.now() + 1000;
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
}

alt.on('item:Pickup', data => {
    alt.emitServer('inventory:Pickup', data.hash);
});

export function getItemByEntity(ent) {
    const obj = objects.find(object => {
        if (object.id === ent) return object;
    });

    if (!obj) return undefined;
    return obj;
}

function useRepairKit() {
    alt.Player.local.isRepairing = true;
    alt.emit(
        'chat:Send',
        `{00FF00} Select the vehicle you want to repair with your cursor.`
    );
}

function useGasCan() {
    alt.Player.local.isUsingGasCan = true;
    alt.emit(
        'chat:Send',
        `{00FF00} Select the vehicle you want to re-fuel with your cursor.`
    );
}
