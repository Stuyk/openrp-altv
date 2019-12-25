import * as alt from 'alt';
import * as native from 'natives';
import { createBlip } from '/client/blips/bliphelper.js';
import { drawMarker } from '/client/utility/marker.js';
import { playAudio } from '/client/systems/sound.js';
import { playParticleFX } from '/client/utility/particle.js';
import { distance } from '/client/utility/vector.js';
import { isFlagged } from '/client/utility/flags.js';
import { helpText } from '/client/utility/helpText.js';
import { showCursor } from '/client/utility/cursor.js';
import { View } from '../utility/view.js';

export const ObjectiveFlags = {
    MIN: 0,
    ON_FOOT: 1,
    IN_VEHICLE: 2,
    NO_WEAPON: 4,
    IS_CAPTURE: 8,
    HOLD_ACTION_KEY: 16,
    TAP_ACTION_KEY: 32,
    IS_IN_JOB_VEHICLE: 64,
    NO_DIEING: 128,
    HAS_WEAPON: 256,
    DELAYED: 512,
    DESTROY: 1024,
    MINIGAME: 2048,
    MAX: 4095
};

const emptyVec = { x: 0, y: 0, z: 0 };
let tapThreshold = 0;
let lastTap = Date.now();
let objective;
let displayInterval;
let lastCheck = Date.now() + 2500;
let blip;
let lastHit = Date.now() + 250;
let targetObject;
let targetObjectLastUpdate = Date.now();
let lastDelay = Date.now() + 1000;
let minigameView;

alt.log('Loaded New Job Framework');
alt.onServer('objective:Info', objectiveInfo);
alt.onServer('objective:SetIntoVehicle', setIntoVehicle);

function objectiveInfo(value) {
    objective = undefined;

    if (displayInterval) {
        alt.clearInterval(displayInterval);
        displayInterval = undefined;
    }

    if (blip) {
        native.removeBlip(blip);
        blip = undefined;
    }

    if (targetObject) {
        native.deleteEntity(targetObject);
        targetObject = undefined;
    }

    alt.Player.local.inMiniGame = false;
    alt.Player.local.inJob = false;

    if (!value) {
        objective = undefined;
        return;
    }

    objective = JSON.parse(value);
    alt.Player.local.inJob = true;
    lastCheck = Date.now() + 250;
    blip = createBlip(
        'job',
        objective.pos,
        objective.blip.sprite,
        objective.blip.color,
        objective.blip.description
    );

    if (objective.objectType) {
        const hash = native.getHashKey(objective.objectType);
        alt.loadModel(hash);
        native.requestModel(hash);
    }

    targetObjectLastUpdate = Date.now();
    displayInterval = alt.setInterval(display, 0);
}

function display() {
    if (!objective) {
        return;
    }

    if (alt.Player.local.getMeta('viewOpen')) {
        return;
    }

    helpText(objective.description);

    const dist = distance(alt.Player.local.pos, objective.pos);
    if (Date.now() > lastCheck) {
        lastCheck = Date.now() + 100;
        checkObjective(dist);
    }

    if (native.isControlJustPressed(0, 38)) {
        lastTap = Date.now();
        tapThreshold += 1;
    }

    if (lastTap + 600 < Date.now()) {
        tapThreshold = 0;
    }

    const shouldDrawMarker = dist < 20 && dist >= 1 ? true : false;
    if (shouldDrawMarker) {
        drawMarker(
            objective.markerType,
            { x: objective.pos.x, y: objective.pos.y, z: objective.pos.z - 1 },
            emptyVec,
            emptyVec,
            objective.scale,
            objective.color.r,
            objective.color.g,
            objective.color.b,
            objective.color.a
        );
    }

    if (targetObjectLastUpdate < Date.now() && dist < 50) {
        targetObjectLastUpdate = Date.now() + 2500;

        if (targetObject) {
            native.deleteEntity(targetObject);
            targetObject = undefined;
        }

        const hash = native.getHashKey(objective.objectType);
        targetObject = native.createObject(
            hash,
            objective.pos.x,
            objective.pos.y,
            objective.pos.z,
            false,
            false,
            false
        );

        native.setEntityAlpha(targetObject, objective.objectAlpha, false);
        native.setEntityInvincible(targetObject, true);
        native.freezeEntityPosition(targetObject, true);
    }

    if (targetObject && dist < 50) {
        const [isFreeAiming, ent] = native.getEntityPlayerIsFreeAimingAt(
            alt.Player.local.scriptID,
            targetObject
        );

        const firing = native.isControlPressed(0, 24);
        if (isFreeAiming && ent === targetObject) {
            if (firing) {
                alt.emit('objective:Hit', dist);
            }

            drawMarker(
                0,
                { x: objective.pos.x, y: objective.pos.y, z: objective.pos.z + 0.75 },
                emptyVec,
                emptyVec,
                { x: 0.2, y: 0.2, z: 0.5 },
                255,
                0,
                0,
                125
            );
        }
    }

    const shouldDrawObject = dist <= 20;
    if (shouldDrawObject) {
    }

    const progressData = objective.progress / objective.maxProgress;
    if (progressData !== 0) {
        native.drawRect(progressData / 2, 1, progressData, 0.02, 255, 0, 0, 200, false);
    }
}

function checkObjective(dist) {
    if (isFlagged(objective.flags, ObjectiveFlags.NO_DIEING)) {
        if (alt.Player.local.getSyncedMeta('dead')) {
            alt.emitServer('objective:Died');
            return;
        }
    }

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

    if (isFlagged(objective.flags, ObjectiveFlags.IN_VEHICLE)) {
        if (!alt.Player.local.vehicle) {
            return;
        }
    }

    if (isFlagged(objective.flags, ObjectiveFlags.IS_IN_JOB_VEHICLE)) {
        if (!alt.Player.local.vehicle) {
            return;
        }

        const isJobVehicle = alt.Player.local.vehicle.getSyncedMeta('isJobVehicle');
        if (!isJobVehicle) {
            return;
        }
    }

    if (isFlagged(objective.flags, ObjectiveFlags.ON_FOOT)) {
        if (alt.Player.local.vehicle) {
            return;
        }
    }

    if (isFlagged(objective.flags, ObjectiveFlags.DELAYED)) {
        if (lastDelay > Date.now()) {
            return;
        }

        lastDelay = Date.now() + 1000;
    }

    if (isFlagged(objective.flags, ObjectiveFlags.DESTROY)) {
        return;
    }

    if (isFlagged(objective.flags, ObjectiveFlags.MINIGAME)) {
        if (alt.Player.local.getMeta('viewOpen')) {
            return;
        }

        if (alt.Player.local.inMiniGame) {
            return;
        }

        startMiniGame();
        return;
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
    if (tapThreshold >= 5) {
        tapThreshold = 0;
        return true;
    }

    return false;
}

function setIntoVehicle(vehicle) {
    alt.setTimeout(() => {
        native.taskWarpPedIntoVehicle(alt.Player.local.scriptID, vehicle.scriptID, -1);
    }, 500);
}

function startMiniGame() {
    if (!minigameView) {
        minigameView = new View();
    }

    alt.Player.local.inMiniGame = true;
    minigameView.open('http://resource/client/html/pixigames/index.html', true);
    minigameView.on('minigame:Complete', completeMinigame);
    minigameView.on('minigame:Ready', () => {
        alt.log('Minigame Ready');
        showCursor(true);
        minigameView.emit(`minigame:${objective.miniGameIdentifier}`, objective.hash);
    });

    minigameView.on('minigame:Quit', () => {
        minigameView.close();
        alt.setTimeout(() => {
            alt.Player.local.inMiniGame = false;
        }, 3500);
    });
}

function completeMinigame(hash) {
    if (!minigameView) {
        return;
    }

    alt.setTimeout(() => {
        alt.Player.local.inMiniGame = false;
    }, 3500);

    minigameView.close();
    alt.emitServer('objective:Test', hash);
}

alt.on('objective:Hit', dist => {
    if (Date.now() < lastHit) {
        return;
    }

    const maxWepRange = native.getMaxRangeOfCurrentPedWeapon(alt.Player.local.scriptID);
    if (dist > maxWepRange) {
        return;
    }

    lastHit = Date.now() + 250;
    alt.emitServer('objective:Test');
});
