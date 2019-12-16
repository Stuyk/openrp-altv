import * as alt from 'alt';
import * as native from 'natives';
import { distance } from '/client/utility/vector.js';
import { drawMarker } from '/client/utility/marker.js';
import { createBlip } from '/client/blips/bliphelper.js';

let empVector = { x: 0, y: 0, z: 0 };
let currentDataSet;
let interval;
let blip;

alt.on('meta:Changed', (key, value) => {
    if (key !== 'faction:Info') {
        return;
    }

    if (interval) {
        alt.clearInterval(interval);
        interval = undefined;
    }

    if (blip) {
        native.deleteEntity(blip);
        blip = undefined;
    }

    const data = JSON.parse(value);
    if (!data) {
        return;
    }

    currentDataSet = data;
    currentDataSet.home = JSON.parse(currentDataSet.home);

    blip = createBlip(
        'factionhome',
        currentDataSet.home,
        411,
        currentDataSet.color,
        'Faction Home'
    );
    interval = alt.setInterval(drawFactionData, 0);
});

function drawFactionData() {
    if (alt.Player.local.getMeta('viewOpen')) return;
    if (!currentDataSet) {
        return;
    }

    const home = { ...currentDataSet.home };
    home.z -= 1;

    if (distance(alt.Player.local.pos, home) <= 25) {
        drawMarker(
            1,
            home,
            empVector,
            empVector,
            { x: 0.2, y: 0.2, z: 2 },
            255,
            255,
            255,
            255
        );
    }
}
