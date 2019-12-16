import * as alt from 'alt';
import * as native from 'natives';
import { distance } from '/client/utility/vector.js';

let deathBoxes = [];
let lastUpdate = Date.now();
let lastBoxes = null;

alt.onServer('deathbox:Sync', deathboxSync);
const unknownModel = native.getHashKey('sm_prop_smug_rsply_crate02a');
alt.loadModel(unknownModel);
native.requestModel(unknownModel);

function deathboxSync(boxJSON) {
    alt.log('Syncing Death Boxes');
    const boxes = JSON.parse(boxJSON);
    lastBoxes = boxes;
    alt.log(JSON.stringify(lastBoxes, null, '\t'));
    parseBoxes(boxes);
}

function parseBoxes(boxes = lastBoxes) {
    if (Date.now() < lastUpdate) {
        return;
    }

    lastUpdate = Date.now() + 500;

    if (!boxes) {
        return;
    }

    if (deathBoxes.length >= 1) {
        deathBoxes.forEach(box => {
            native.deleteEntity(box.id);
        });

        deathBoxes = [];
    }

    boxes.forEach(box => {
        if (distance(box.pos, alt.Player.local.pos) > 10) {
            return;
        }

        const newBox = { ...box };
        newBox.id = native.createObject(
            unknownModel,
            newBox.pos.x,
            newBox.pos.y,
            newBox.pos.z - 1.05,
            false,
            false,
            false
        );
        deathBoxes.push(newBox);
    });
}

export function getBoxByEntity(ent) {
    const index = deathBoxes.findIndex(box => box.id === ent);
    if (index <= -1) {
        return undefined;
    }

    return deathBoxes[index];
}

alt.setInterval(parseBoxes, 1500);
