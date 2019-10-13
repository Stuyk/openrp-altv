import * as alt from 'alt';
import * as native from 'natives';

export let doorState = {};

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
