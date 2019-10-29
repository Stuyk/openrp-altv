import * as alt from 'alt';
import * as native from 'natives';
import { distance } from '/client/utility/vector.mjs';

export let doorState = {};
const dynamicDoors = [];
let interval;

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
    if (dynamicDoors.length >= 1) {
        dynamicDoors.forEach(door => {
            native.deleteEntity(door.enter);
        });
    }

    if (doors.length <= 0) return;
    doors.forEach(door => {
        const enterHash = native.getHashKey(door.enter.doorModel);
        const exitHash = native.getHashKey(door.exit.doorModel);

        alt.loadModel(enterHash);
        alt.loadModel(exitHash);
        native.requestModel(enterHash);
        native.requestModel(exitHash);

        const enterPos = door.enter.doorPos;
        const enter = native.createObject(
            enterHash,
            enterPos.x,
            enterPos.y,
            enterPos.z,
            false,
            false,
            false
        );
        native.setEntityHeading(enter, door.enter.doorRot);
        //native.setEntityAlpha(enter, 0, false);

        dynamicDoors.push({
            id: door.id,
            guid: door.guid,
            enter,
            interior: door.interior,
            lockstate: door.lockstate
        });
    });
});

export function findDoor(ent) {
    const door = dynamicDoors.find(door => {
        if (door.enter === ent) return door;
    });

    if (!door) {
        alt.log('Door was not found.');
        return;
    }

    return door;
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
});
