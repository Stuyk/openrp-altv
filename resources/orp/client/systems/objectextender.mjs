import * as alt from 'alt';
import * as native from 'natives';
import { Trees } from '/client/gamedata/trees.mjs';
import { Rocks } from '/client/gamedata/rocks.mjs';
import { drawMarker } from '/client/utility/marker.mjs';
import { distance } from '/client/utility/vector.mjs';

/*
The purpose of this file is to take large amounts of `un-contextable items`.
Then set them up to act as `mock` objects.
*/

const MinYParam = 1300; // Prevents tree cutting / rock mining in cities.
const Unk = [];
const objects = [];

const EquipHelper = {
    axe: {
        array: Trees,
        model: native.getHashKey('prop_ld_pipe_single_01'),
        rotation: {
            x: 90,
            y: 0,
            z: 0
        },
        marker: {
            type: 1,
            rot: {
                x: 0,
                y: 0,
                z: 0
            },
            scale: {
                x: 2,
                y: 2,
                z: 2.5
            },
            offset: {
                x: 0,
                y: 0,
                z: 0
            }
        }
    },
    pickaxe: {
        array: Rocks,
        model: native.getHashKey('prop_mb_sandblock_01'),
        addZ: 1.0,
        marker: {
            type: 1,
            rot: {
                x: 0,
                y: 0,
                z: 0
            },
            scale: {
                x: 0.05,
                y: 0.05,
                z: 5
            },
            offset: {
                x: 0,
                y: 0,
                z: 0
            }
        }
    },
    hammer: {
        array: Unk,
        model: native.getHashKey('prop_ld_pipe_single_01')
    },
};

let interval;
let drawInterval;
let currentSet;

// When the player updates their inventory.
alt.on('meta:Changed', (key, value) => {
    if (key !== 'equipment') return;
    const equipment = JSON.parse(value);

    if (!equipment) {
        return;
    }

    const inHandItem = equipment[11];
    if (!inHandItem) {
        alt.log(`[Object Extender] Parsing for None`);
        if (interval) {
            alt.clearInterval(interval);
            interval = undefined;
        }

        if (drawInterval) {
            alt.clearInterval(drawInterval);
            drawInterval = undefined;
        }
        return;
    }

    if (!EquipHelper[inHandItem.base]) {
        alt.log(`[Object Extender] Parsing for None`);
        if (interval) {
            alt.clearInterval(interval);
            interval = undefined;
        }

        if (drawInterval) {
            alt.clearInterval(drawInterval);
            drawInterval = undefined;
        }
        return;
    }

    alt.log(`[Object Extender] Parsing for ${inHandItem.base}`);
    currentSet = EquipHelper[inHandItem.base];
    if (!interval) {
        interval = alt.setInterval(objectParser, 5000);
    }
});

export function getObjectById(id) {
    const index = objects.findIndex(currentObject => {
        if (currentObject.id === id) return currentObject;
    });

    return index <= -1 ? undefined : objects[index];
}

function objectParser() {
    const pos = alt.Player.local.pos;
    if (!currentSet) {
        alt.clearInterval(interval);
        interval = undefined;
        return;
    }

    while (objects.length >= 1) {
        try {
            native.deleteEntity(objects.pop().id);
        } catch (e) {
            alt.log('Object wasn not found.');
        }
    }

    if (pos.y <= MinYParam || alt.Player.local.vehicle) {
        return;
    }

    const closeObjects = currentSet.array.filter(objPos => {
        const newObjPos = objPos.x ? objPos : objPos.coord;
        const dist = distance(pos, newObjPos);
        if (dist <= 10) {
            return objPos;
        }
    });

    if (closeObjects.length <= 0) {
        if (drawInterval) {
            alt.clearInterval(drawInterval);
            drawInterval = undefined;
        }
        return;
    }

    if (!drawInterval) {
        drawInterval = alt.setInterval(drawObjects, 0);
    }

    closeObjects.forEach(objectData => {
        const hash = currentSet.model
            ? currentSet.model
            : native.getHashKey(objectData.model);

        alt.loadModel(hash);
        native.requestModel(hash);

        const rot = currentSet.rotation ? currentSet.rotation : objectData.rot;
        const pos = objectData.x ? { ...objectData } : { ...objectData.coord };

        if (currentSet.addZ) {
            pos.z += currentSet.addZ;
        }

        const spawnedObject = native.createObject(
            hash,
            pos.x,
            pos.y,
            pos.z,
            false,
            false,
            false
        );
        native.setEntityAlpha(spawnedObject, 0, false);
        native.freezeEntityPosition(spawnedObject, true);
        alt.nextTick(() => {
            native.setEntityRotation(spawnedObject, rot.x, rot.y, rot.z, 0, false);
        });
        objects.push({ id: spawnedObject, coord: pos });
    });
}

function drawObjects() {
    if (alt.Player.local.getMeta('viewOpen')) return;
    if (objects.length <= 0) return;
    objects.forEach(object => {
        const pos = { ...object.coord };
        if (!pos) {
            return;
        }

        if (!pos.x) {
            return;
        }

        pos.x += currentSet.marker.offset.x;
        pos.y += currentSet.marker.offset.y;
        pos.z += currentSet.marker.offset.z;

        // type, pos, dir, rot, scale, r, g, b, alpha
        drawMarker(
            currentSet.marker.type,
            pos,
            new alt.Vector3(0, 0, 0),
            currentSet.marker.rot,
            currentSet.marker.scale,
            0,
            190,
            250,
            100
        );
    });
}
