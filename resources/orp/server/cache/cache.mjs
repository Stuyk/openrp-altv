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
let vehicleID;

export function cacheAccount(userid, id, rank) {
    accounts[userid] = {
        pgid: userid,
        id,
        rank
    };
}

export function modifyRank(pgid, rank) {
    accounts[pgid].rank = rank;
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
