import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';
import { colshapes } from '../systems/grid.mjs';

const db = new SQL();

// Normal Doors Use -> prop_cntrdoor_ld_l

const doorParamsEnter = {
    // Where we spawn player.
    position: { x: 8.257935523986816, y: -243.91233825683594, z: 51.860504150390625 },
    // Where an invisible door is placed.
    doorPos: { x: 8.71374225616455, y: -243.2096405029297, z: 51.860504150390625 },
    // The rotation of the door.
    doorRot: 90,
    // Door Model for the invisible door.
    doorModel: 'prop_cntrdoor_ld_l'
};

const doorParamsExit = {
    position: { x: -786.8663, y: 315.7642, z: 217.6385 }
};

const door = {
    guid: 2,
    enter: JSON.stringify(doorParamsEnter),
    exit: JSON.stringify(doorParamsExit),
    interior: 'apa_v_mp_h_01_a',
    lockstate: 0,
    isGarage: 0,
    salePrice: -1
};

db.upsertData(door, 'Door', res => {
    console.log(res);
});

/*
alt.on('updateDoorLockState', (id, state) => {
    db.updatePartialData(id, { lockstate: state }, 'Door', () => {});
});
*/

alt.on('updateDoorSector', (id, index) => {
    db.updatePartialData(id, { sector: index }, 'Door', () => {});
});

alt.on('parseDoorSector', data => {
    colshapes[parseInt(data.sector)].sector.doors.push(data);
});
