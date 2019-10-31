import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';
import { Doors } from '../configuration/doors.mjs';
import { colshapes } from '../systems/grid.mjs';
import { distance } from '../utility/vector.mjs';

const db = new SQL();
const doors = {};

export function getDoor(id) {
    return doors[id];
}

function setDoorState(id, state) {
    if (!doors[id]) return;
    doors[id].lockstate = state;
}

function changeDoorOwnership(door) {
    if (!door.id) return;
    if (!doors[door.id]) return;
    doors[door.id] = door;
    alt.emitClient(null, 'door:UpdateDynamicDoor', door);
    alt.emit('door:CacheDoor', door.id, door);
}

alt.on('door:ExitDynamicDoor', (player, id) => {
    const door = getDoor(id);
    if (!door) return;
    const exitData = JSON.parse(door.exit);
    const dist = distance(exitData.position, player.pos);
    if (dist > 5) return;

    player.emitMeta('door:EnteredInterior', undefined);
    player.dimension = 0;
    player.saveDimension(0);

    const enterData = JSON.parse(door.enter);

    if (player.vehicle) {
        player.vehicle.pos = enterData.position;
        player.vehicle.dimension = 0;
        if (player.vehicle.saveDimension) {
            player.vehicle.saveDimension(0);
        }
    } else {
        player.pos = enterData.position;
    }

    if (player.preColshape) {
        alt.emit('entityEnterColshape', player.preColshape, player);
    }
});

alt.on('door:UseDynamicDoor', (player, data) => {
    const id = data.id;
    const door = getDoor(id);
    if (!door) return;
    const enterData = JSON.parse(door.enter);
    const dist = distance(enterData.position, player.pos);
    if (dist > 5) return;

    if (door.lockstate) {
        player.notify('The door seems to be locked.');
        return;
    }

    if (player.vehicle && !door.isGarage) {
        player.notify('You cannot enter this interior with a vehicle.');
        return;
    }

    const exitData = JSON.parse(door.exit);
    player.preColshape = player.colshape;

    if (player.vehicle) {
        player.vehicle.dimension = door.id;
        player.dimension = door.id;
        player.vehicle.pos = door.exit.position;
        if (player.vehicle.saveDimension) {
            player.vehicle.saveDimension(door.id);
        }
    } else {
        player.dimension = door.id;
        player.pos = exitData.position;
    }

    player.saveDimension(door.id);
    player.emitMeta('door:EnteredInterior', door);
});

alt.on('door:LockDynamicDoor', (player, data) => {
    const id = data.id;
    const door = getDoor(id);
    if (!door) return;
    const enterData = JSON.parse(door.enter);
    const dist = distance(enterData.position, player.pos);
    if (dist > 5) return;

    if (door.guid !== player.data.id) {
        player.send('You do not have the keys for this door.');
        return;
    }

    const state = door.lockstate === 1 ? 0 : 1;
    door.lockstate = state;

    alt.emit('updateDoorLockState', door.id, state);
    alt.emitClient(null, 'door:SetDoorState', door.id, state);
    alt.emit('door:CacheDoor', door.id, door);
    setDoorState(id, state);

    if (state) {
        player.notify('You have locked the door.');
    } else {
        player.notify('You have unlocked the door.');
    }
});

alt.on('door:CacheDoor', (id, data) => {
    if (data.sector === -1) {
        let lastDist;
        let currentIndex = -1;
        colshapes.forEach((colshape, index) => {
            const sector = colshape.sector;
            let pos = {
                x: (sector.coords.first.x + sector.coords.second.x) / 2,
                y: (sector.coords.first.y + sector.coords.second.y) / 2,
                z: (sector.coords.first.z + sector.coords.second.z) / 2
            };

            const enterData = JSON.parse(data.enter);
            const dist = distance(enterData.position, pos);
            if (!lastDist) {
                lastDist = dist;
                currentIndex = index;
                return;
            }

            if (dist < lastDist) {
                lastDist = dist;
                currentIndex = index;
            }
        });

        alt.emit('updateDoorSector', id, currentIndex);
        data.sector = currentIndex;
    }

    doors[id] = data;
    alt.emit('parseDoorSector', data);
});

alt.on('door:SetupDoorConfiguration', () => {
    let id = 1;
    Doors.forEach(door => {
        door.id = id;
        door.enter = JSON.stringify(door.enter);
        door.exit = JSON.stringify(door.exit);
        db.upsertData(door, 'Door', res => {
            alt.emit('door:CacheDoor', res.id, res);
        });
        id += 1;
    });

    console.log(`Doors Created: ${Doors.length}`);
});

alt.on('door:CreateDoor', data => {
    db.upsertData(data, 'Door', res => {
        alt.emit('door:CacheDoor', res.id, res);
    });
});

alt.on('updateDoorLockState', (id, state) => {
    db.updatePartialData(id, { lockstate: state }, 'Door', () => {});
});

alt.on('updateDoorSector', (id, index) => {
    db.updatePartialData(id, { sector: index }, 'Door', () => {});
});

alt.on('parseDoorSector', data => {
    const index = colshapes[parseInt(data.sector)].sector.doors.findIndex(door => {
        if (door.id === data.id) return door;
    });

    if (index <= -1) {
        colshapes[parseInt(data.sector)].sector.doors.push(data);
    } else {
        colshapes[parseInt(data.sector)].sector.doors[index] = data;
    }
});

alt.on('door:PurchaseDynamicDoor', (player, data) => {
    const id = data.id;
    let door = getDoor(id);
    if (!door) return;
    const enterData = JSON.parse(door.enter);
    const dist = distance(enterData.position, player.pos);
    if (dist > 5) return;

    // Server Ownership
    if (door.guid <= -1) {
        if (!player.subCash(door.salePrice)) {
            player.notify('You do not have enough cash.');
            return;
        }

        door.guid = player.data.id;
        door.salePrice = -1;
        db.upsertData(door, 'Door', res => {});
        changeDoorOwnership(door);
        return;
    }

    db.fetchByIds(door.guid, 'Character', res => {
        if (!res) {
            player.notify('User does not exist.');
            return;
        }

        if (!player.subCash(door.salePrice)) {
            player.notify('You do not have enough cash.');
            return;
        }

        res.cash += door.salePrice;
        door.guid = player.data.id;
        door.salePrice = -1;
        db.upsertData(door, 'Door', res => {});
        db.updatePartialData(res.id, { cash: res.cash }, 'Character', res => {
            console.log('Cash was recieved by other user for door sale.');
        });
        changeDoorOwnership(door);
    });
});
