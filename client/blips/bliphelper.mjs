import * as native from 'natives';
import * as alt from 'alt';

alt.log('Loaded: blips->bliphelper.mjs');

// Used to create blips for the player to see.
export function createBlip(pos, type, color, label) {
    // x: number, y: number, z: number);
    const blip = new alt.PointBlip(pos.x, pos.y, pos.z);
    blip.shortRange = true;
    blip.sprite = type;
    blip.color = color;
    blip.name = label;
}
