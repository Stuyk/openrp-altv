import * as alt from 'alt';
import { Atms } from 'client/locations/locations.mjs';

alt.log('Loaded: client->blips->bliphelper.mjs');

let sectorBlips = [];

// Used to create blips for the player to see.
export function createBlip(pos, type, color, label) {
    // x: number, y: number, z: number);
    const blip = new alt.PointBlip(pos.x, pos.y, pos.z);
    blip.shortRange = true;
    blip.sprite = type;
    blip.color = color;
    blip.name = label;

    return blip;
}

export function createAreaBlip(pos, width, length, color, alpha = 100) {
    const blip = new alt.AreaBlip(pos.x, pos.y, pos.z, width, length);
    blip.color = color;
    blip.alpha = alpha;

    return blip;
}

export function createSectorBlip(sector) {
    let pos = {};
    pos.x = (sector.coords.first.x + sector.coords.second.x) / 2;
    pos.y = (sector.coords.first.y + sector.coords.second.y) / 2;
    pos.z = (sector.coords.first.z + sector.coords.second.z) / 2;

    let blip = createAreaBlip(pos, sector.width, sector.length, sector.x + sector.y);
    sectorBlips.push(blip);
}

export function cleanSectorBlips() {
    sectorBlips.forEach((_, index) => {
        sectorBlips[index].destroy();
        sectorBlips.splice(index, 1);
    });
}

// Load ATM Blips
Atms.forEach(atm => {
    createBlip(atm, 108, 2, 'ATM');
});
