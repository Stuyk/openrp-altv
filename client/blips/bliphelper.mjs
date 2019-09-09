import * as alt from 'alt';
import { Atms } from 'client/locations/locations.mjs';

alt.log('Loaded: client->blips->bliphelper.mjs');

// Used to create blips for the player to see.
export function createBlip(pos, type, color, label) {
    // x: number, y: number, z: number);
    const blip = new alt.PointBlip(pos.x, pos.y, pos.z);
    blip.shortRange = true;
    blip.sprite = type;
    blip.color = color;
    blip.name = label;
}

// Load ATM Blips
Atms.forEach(atm => {
    createBlip(atm, 108, 2, 'ATM');
});
