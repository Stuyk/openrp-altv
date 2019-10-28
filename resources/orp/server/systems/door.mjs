import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';
import { colshapes } from '../systems/grid.mjs';

const db = new SQL();

const doorParamsEnter = {
    // Where we spawn player.
    position: { x: 347.47271728515625, y: -1103.85791015625, z: 29.4061222076416 },
    // Where an invisible door is placed.
    doorPos: { x: 350.0965881347656, y: -1103.873046875, z: 29.491796493530273 },
    // The rotation of the door.
    doorRot: 90,
    // Door Model for the invisible door.
    doorModel: 'v_ilev_csr_garagedoor'
};

const doorParamsExit = {
    position: { x: 198.1461181640625, y: -1001.44091796875, z: -99.00003051757812 },
    doorPos: { x: 201.78433227539062, y: -1007.7326049804688, z: -99.00003051757812 },
    doorRot: 90,
    doorModel: 'v_ilev_csr_garagedoor'
};

const door = {
    guid: -1,
    enter: JSON.stringify(doorParamsEnter),
    exit: JSON.stringify(doorParamsExit),
    interior: '',
    lockstate: 0,
    isGarage: 1,
    salePrice: -1
};
/*
db.upsertData(door, 'Door', res => {
    console.log(res);
});
*/

alt.on('updateDoorSector', (id, index) => {
    db.updatePartialData(id, { sector: index }, 'Door', () => {});
});

alt.on('parseDoorSector', data => {
    colshapes[parseInt(data.sector)].sector.doors.push(data);
});
