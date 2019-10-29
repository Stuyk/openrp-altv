import * as alt from 'alt';
import { colshapes } from '../systems/grid.mjs';
import { distance } from '../utility/vector.mjs';

// This is a fast and efficient way for us to quickly check
// data. We pool data into these arrays so we can find a value
// faster than looking it up in a database. This is done on
// server startup and newly registered users will be
// tossed into these arrays or objects.

// username, encrypted password

const accounts = {};
const characters = {};
const doors = {};
let vehicleID;

export function cacheAccount(userid, id) {
    accounts[userid] = {
        id
    };
}

export function getAccount(userid) {
    let dat = accounts[userid];
    return dat;
}

export function getCharacterName(id) {
    if (characters[id]) return characters[id];
    return 'none';
}

export function cacheCharacter(id, name) {
    characters[id] = name;
}

export function setVehicleID(lastVehicleID) {
    vehicleID = lastVehicleID;
    alt.log(`Next vehicle ID is set to ${vehicleID}`);
}

export function fetchNextVehicleID() {
    vehicleID += 1;
    return vehicleID;
}

/*
    sector = {
        x: index,
        y: sector,
        coords: {
            first: {
                x: column.pos1.x,
                y: column.pos1.y,
                z: -500
            },
            second: {
                x: column.pos2.x,
                y: column.pos2.y,
                z: 10000
            }
        },
        width: width,
        length: length
    }
*/

export function cacheDoor(id, data) {
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

            const dist = distance(data.enter.position, pos);
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
}

export function getDoor(id) {
    return doors[id];
}

export function setDoorState(id, state) {
    if (!doors[id]) return;
    doors[id].lockstate = state;
}
