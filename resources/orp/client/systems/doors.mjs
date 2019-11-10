import * as alt from 'alt';
import * as native from 'natives';
import { distance } from '/client/utility/vector.mjs';

export let doorState = {};
const dynamicDoors = [];
let interval;
let editDoorId;
let isEditingDoor = false;
let editDoorInterval;
let doorRotation = 0;
let doorPosition;

alt.onServer('door:Lock', (type, pos, heading) => {
    doorState[`${JSON.stringify(pos)}`] = {
        type,
        pos,
        heading,
        locked: true
    };

    native.setStateOfClosestDoorOfType(type, pos.x, pos.y, pos.z, true, heading, 0);
});

alt.onServer('door:Unlock', (type, pos, heading) => {
    doorState[`${JSON.stringify(pos)}`] = {
        type,
        pos,
        heading,
        locked: false
    };

    native.setStateOfClosestDoorOfType(type, pos.x, pos.y, pos.z, false, heading, 0);
});

export function syncDoors() {
    Object.keys(doorState).forEach(door => {
        native.setStateOfClosestDoorOfType(
            doorState[door].type,
            doorState[door].pos.x,
            doorState[door].pos.y,
            doorState[door].pos.z,
            doorState[door].locked,
            0,
            0
        );
    });
}

// Dynamic Door Functionality
alt.onServer('door:RenderDoors', doors => {
    alt.log(`Rendering doors; ${doors}`);
    if (dynamicDoors.length >= 1) {
        dynamicDoors.forEach(door => {
            native.deleteEntity(door.enter);
        });
    }

    if (doors.length <= 0) return;
    doors.forEach(door => {
        const enterHash = native.getHashKey(door.enter.doorModel);

        alt.loadModel(enterHash);
        native.requestModel(enterHash);
        const enter = native.createObject(
            enterHash,
            door.enter.doorPos.x,
            door.enter.doorPos.y,
            door.enter.doorPos.z,
            false,
            false,
            false
        );
        native.setEntityHeading(enter, door.enter.doorRot);
        native.setEntityAlpha(enter, 0, false);

        dynamicDoors.push({
            id: door.id,
            guid: door.guid,
            enter,
            interior: door.interior,
            lockstate: door.lockstate,
            salePrice: door.salePrice
        });
    });
});

alt.onServer('door:SetDoorState', (id, state) => {
    const index = dynamicDoors.findIndex(door => {
        if (door.id === id) return door;
    });

    if (index <= -1) return;
    dynamicDoors[index].lockstate = state;
});

alt.onServer('door:UpdateDynamicDoor', dynDoor => {
    const index = dynamicDoors.findIndex(door => {
        if (door.id === dynDoor.id) return door;
    });

    if (index <= -1) return;

    dynamicDoors[index].guid = dynDoor.guid;
    dynamicDoors[index].salePrice = dynDoor.salePrice;
});

export function findDoor(ent) {
    const index = dynamicDoors.findIndex(door => {
        if (door.enter === ent) return door;
    });

    if (!index <= -1) {
        alt.log('Door was not found.');
        return;
    }

    return dynamicDoors[index];
}

// player.emitMeta('door:EnteredInterior', data);
alt.on('meta:Changed', (key, data) => {
    if (key !== 'door:EnteredInterior') return;
    if (!data) {
        if (interval) {
            alt.clearInterval(interval);
        }
        return;
    }

    native.freezeEntityPosition(alt.Player.local.scriptID, true);

    if (interval) {
        alt.clearInterval(interval);
    }

    if (data.interior !== '') {
        native.requestIpl(data.interior);
    }

    interval = alt.setInterval(() => {
        const dist = distance(alt.Player.local.pos, data.exit.position);
        if (dist >= 3) return;
        native.beginTextCommandDisplayHelp('STRING');
        native.addTextComponentSubstringPlayerName(
            `Press ~INPUT_CONTEXT~ to leave the interior.`
        );
        native.endTextCommandDisplayHelp(0, false, false, -1);

        if (native.isControlJustPressed(0, 38)) {
            alt.emitServer('use:ExitDynamicDoor', data.id);
        }
    }, 0);

    native.freezeEntityPosition(alt.Player.local.scriptID, false);
});

alt.onServer('editingDoor', state => {
    if (editDoorInterval && !state) {
        alt.clearInterval(editDoorInterval);
        native.deleteEntity(editDoorId);

        const doorData = {
            id: 0,
            enter: {
                position: alt.Player.local.pos,
                doorPos: doorPosition,
                doorRot: doorRotation,
                doorModel: 'prop_cntrdoor_ld_l'
            },
            exit: {
                position: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            },
            interior: '',
            isGarage: 0,
        };

        alt.log(JSON.stringify(doorData, null, '\t'));
        return;
    }

    const hash = native.getHashKey('prop_cntrdoor_ld_l');
    const pos = alt.Player.local.pos;
    alt.loadModel(hash);
    native.requestModel(hash);

    editDoorId = native.createObject(hash, pos.x, pos.y, pos.z, false, false, false);
    editDoorInterval = alt.setInterval(() => {
        native.disableInputGroup(0);
        let pos = native.getEntityCoords(editDoorId, false);

        // Scroll Down
        if (native.isDisabledControlJustPressed(0, 14)) {
            doorRotation -= 3;

            if (doorRotation < -180) {
                doorRotation = 180;
            }
        }

        // Scroll Up
        if (native.isDisabledControlJustPressed(0, 15)) {
            doorRotation += 3;

            if (doorRotation > 180) {
                doorRotation = -180;
            }
        }

        // Right Arrow
        if (native.isDisabledControlPressed(0, 190)) {
            pos.x += 0.005;
        }

        // left arr
        if (native.isDisabledControlPressed(0, 189)) {
            pos.x -= 0.005;
        }

        // down arr
        if (native.isDisabledControlPressed(0, 187)) {
            pos.y -= 0.005;
        }

        // up arro
        if (native.isDisabledControlPressed(0, 188)) {
            pos.y += 0.005;
        }

        // pgup
        if (native.isDisabledControlPressed(0, 10)) {
            pos.z += 0.005;
        }

        // pgdown
        if (native.isDisabledControlPressed(0, 11)) {
            pos.z -= 0.005;
        }

        native.setEntityCoords(
            editDoorId,
            pos.x,
            pos.y,
            pos.z,
            false,
            false,
            false,
            false
        );
        native.setEntityHeading(editDoorId, doorRotation);
        doorPosition = pos;
    }, 0);
});
