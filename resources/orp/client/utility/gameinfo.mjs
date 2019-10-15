import * as alt from 'alt';
import * as native from 'natives';

export function printInteriorInfo() {
    alt.log(
        `Interior ID: ${native.getInteriorAtCoords(
            alt.Player.local.pos.x,
            alt.Player.local.pos.y,
            alt.Player.local.pos.z
        )}`
    );
}

export function printLocation() {
    alt.log(JSON.stringify(alt.Player.local.pos));
}
