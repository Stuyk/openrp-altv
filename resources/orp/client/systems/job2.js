import * as alt from 'alt';
import * as native from 'natives';
import { createBlip } from '/client/blips/bliphelper.js';
import { drawMarker } from '/client/utility/marker.js';
import { playAudio } from '/client/systems/sound.js';
import { playParticleFX } from '/client/utility/particle.js';
import { distance } from '/client/utility/vector.js';
import { isFlagged } from '/client/utility/flags.js';

const ObjectiveFlags = {
    MIN: 0,
    ON_FOOT: 1,
    IN_VEHICLE: 2,
    NO_WEAPON: 4,
    IS_CAPTURE: 8,
    HOLD_ACTION_KEY: 16,
    TAP_ACTION_KEY: 32,
    MAX: 63
};

const emptyVec = { x: 0, y: 0, z: 0 };
let tapThreshold = 0;
let objective;
let displayInterval;
let lastCheck = Date.now() + 2500;
let blip;

alt.log('Loaded New Job Framework');
alt.onServer('objective:Info', objectiveInfo);

function objectiveInfo(value) {
    alt.log('Got Data?');
    alt.log(value);

    if (displayInterval) {
        alt.clearInterval(displayInterval);
        displayInterval = undefined;
    }

    if (blip) {
        native.removeBlip(blip);
        blip = undefined;
    }

    if (!value) {
        objective = undefined;
        return;
    }

    lastCheck = Date.now() + 2500;
    objective = JSON.parse(value);
    blip = createBlip(
        'job',
        objective.pos,
        objective.blip.sprite,
        objective.blip.color,
        objective.blip.description
    );

    displayInterval = alt.setInterval(display, 0);
}

function display() {
    if (!objective) {
        return;
    }

    if (alt.Player.local.getMeta('viewOpen')) {
        return;
    }

    const dist = distance(alt.Player.local.pos, objective.pos);

    if (Date.now() > lastCheck) {
        lastCheck = Date.now() + 100;
        checkObjective(dist);
    }

    const shouldDrawMarker = dist < 20 && dist >= 1 ? true : false;
    if (shouldDrawMarker) {
        drawMarker(
            objective.markerType,
            { x: objective.pos.x, y: objective.pos.y, z: objective.pos.z - 0.5 },
            emptyVec,
            emptyVec,
            { x: 0.5, y: 0.5, z: 3 },
            objective.color.r,
            objective.color.g,
            objective.color.b,
            objective.color.a
        );
    }
}

function checkObjective(dist) {
    if (dist > objective.range) {
        return;
    }

    if (isFlagged(objective.flags, ObjectiveFlags.TAP_ACTION_KEY)) {
        if (!tapActionKey()) {
            return;
        }
    }

    if (isFlagged(objective.flags, ObjectiveFlags.HOLD_ACTION_KEY)) {
        if (!holdActionKey()) {
            return;
        }
    }

    alt.emitServer('objective:Test');
}

function holdActionKey() {
    if (!native.isControlPressed(0, 38)) {
        return false;
    }

    return true;
}

function tapActionKey() {
    if (native.isControlPressed(0, 38)) {
        tapThreshold += 1;
    }

    if (tapThreshold >= 5) {
        tapThreshold = 0;
        return true;
    }

    return false;
}

//
// HOLD_ACTION_KEY: 16,
// TAP_ACTION_KEY: 32,
