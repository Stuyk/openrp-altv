import * as alt from 'alt';
import * as native from 'natives';
import { distance } from 'client/utility/vector.mjs';
import { drawMarker } from 'client/utility/marker.mjs';

alt.log('Loaded: client->systems->job.mjs');

/**
 * Intervals
 */
let objectiveInfo;
let objectiveChecking;
let objective;
let mashing;
let mashingCooldown = Date.now();
let lastMash = Date.now();
let blip;
let dist;
let cooldown = Date.now();
let pause = false;
let playerSpeed = 0;

const types = {
    0: point, // Go to Point
    1: capture, // Stand in Point
    2: hold, // Hold 'E'
    3: mash, // Mash 'E'
    4: player, // Target
    5: order // Press Keys in Order
};

const modifiers = {
    MIN: 0,
    ON_FOOT: 1,
    IN_VEHICLE: 2,
    PROGRESS: 4,
    SPAWN_VEHICLE: 8,
    REMOVE_VEHICLE: 16,
    PICKUP_PLAYER: 32,
    DROPOFF_PLAYER: 64,
    KILL_PLAYER: 128,
    REPAIR_PLAYER: 256,
    ITEM_RESTRICTIONS: 512,
    MAX: 1024
};

const metaTypes = {
    'job:Objective': setupObjective,
    'job:ClearObjective': clearObjective,
    'job:Progress': updateProgress
};

// When the player updates their inventory.
alt.on('meta:Changed', (key, value) => {
    if (!key.includes('job')) return;
    metaTypes[key](value);
});

function setupObjective(value) {
    if (!value) return;
    pause = true;
    objective = JSON.parse(value);
    native.freezeEntityPosition(alt.Player.local.scriptID, false);

    if (objective.blip) {
        blip = new alt.PointBlip(
            objective.blip.pos.x,
            objective.blip.pos.y,
            objective.blip.pos.z
        );
        blip.shortRange = false;
        blip.sprite = objective.blip.sprite;
        blip.color = objective.blip.color;
        blip.name = 'Objective';
    }

    objectiveInfo = alt.setInterval(intervalObjectiveInfo, 0);
    objectiveChecking = alt.setInterval(intervalObjectiveChecking, 100);
    pause = false;
}

function clearObjective() {
    pause = true;
    native.freezeEntityPosition(alt.Player.local.scriptID, false);
    objective = undefined;

    if (objectiveInfo) {
        alt.clearInterval(objectiveInfo);
        objectiveInfo = undefined;
    }

    if (objectiveChecking) {
        alt.clearInterval(objectiveChecking);
        objectiveChecking = undefined;
    }

    if (blip) {
        blip.destroy();
        blip = undefined;
    }

    if (!alt.Player.local.vehicle) {
        native.clearPedTasks(alt.Player.local.scriptID);
    }

    mashing = 0;
    pause = false;
}

function updateProgress(value) {
    if (!objective) return;
    objective.progress = value;
}

/**
 * Constant looping and displaying.
 */
function intervalObjectiveInfo() {
    if (!objective || pause) return;

    dist = distance(alt.Player.local.pos, objective.pos);

    if (objective.marker && dist <= 100) {
        drawMarker(
            objective.marker.type,
            objective.marker.pos,
            objective.marker.dir,
            objective.marker.rot,
            objective.marker.scale,
            objective.marker.r,
            objective.marker.g,
            objective.marker.b,
            objective.marker.a
        );
    }

    if (objective.helpText) {
        native.beginTextCommandDisplayHelp('STRING');
        native.addTextComponentSubstringPlayerName(objective.helpText);
        native.endTextCommandDisplayHelp(0, false, true, -1);
    }

    if (objective.progress >= 0) {
        let progress = objective.progress / objective.maxProgress;
        native.drawRect(progress / 2, 1, progress, 0.02, 255, 255, 100, 200);
    }

    // Mashing Helper
    if (objective.type === 3) {
        if (native.isControlJustPressed(0, 38) && Date.now() > mashingCooldown) {
            mashingCooldown = Date.now() + 125;
            mashing += 1;
            lastMash = Date.now() + 2500;
        }
    }

    playerSpeed = native.getEntitySpeed(alt.Player.local.scriptID);

    if (playerSpeed >= 0.2) {
        alt.Player.local.inAnimation = false;
    }
}

function intervalObjectiveChecking() {
    if (!objective || pause) return;

    // Check Distance
    if (dist > objective.range) return;

    // Check if type exists.
    let testType = types[objective.type];
    if (!testType) return;

    // Check modifier flags.
    if (!preObjectiveCheck()) {
        return;
    }

    // Execute Objective Test Type
    let result = testType();
    if (!result) {
        native.freezeEntityPosition(alt.Player.local.scriptID, false);
        return;
    }

    // Check Serverside
    alt.emitServer('job:Check');
}

function preObjectiveCheck() {
    let valid = true;

    if (isFlagged(objective.flags, modifiers.ON_FOOT) && valid) {
        if (player.vehicle) valid = false;
    }

    if (isFlagged(objective.flags, modifiers.IN_VEHICLE) && valid) {
        if (!player.vehicle) valid = false;
    }

    return valid;
}

function isFlagged(flags, flagValue) {
    if ((flags & flagValue) === flagValue) {
        return true;
    }
    return false;
}

function point() {
    return true;
}

function capture() {
    if (Date.now() < cooldown) return false;
    cooldown = Date.now() + 2000;

    if (playerSpeed >= 0.2) return false;

    return true;
}

function hold() {
    if (Date.now() < cooldown) return false;
    cooldown = Date.now() + 2000;

    if (playerSpeed >= 5) {
        clearScenario();
        return false;
    }

    if (native.isControlPressed(0, 38)) {
        native.freezeEntityPosition(alt.Player.local.scriptID, true);
        if (!alt.Player.local.inScenario) {
            playScenario();
        }
        return true;
    } else {
        native.freezeEntityPosition(alt.Player.local.scriptID, false);
        clearScenario();
    }

    native.clearPedTasks(alt.Player.local.scriptID);
    return false;
}

function mash() {
    if (playerSpeed >= 5 && !alt.Player.local.inScenario) {
        clearScenario();
        return false;
    }

    if (Date.now() > lastMash) {
        native.freezeEntityPosition(alt.Player.local.scriptID, false);
        clearScenario();
        return false;
    } else {
        if (!alt.Player.local.inScenario) {
            native.freezeEntityPosition(alt.Player.local.scriptID, true);
            playScenario();
        }
    }

    if (mashing >= 5) {
        mashing = 0;
        return true;
    }

    native.clearPedTasks(alt.Player.local.scriptID);
    return false;
}

function order() {}

function player() {}

function playScenario() {
    if (!objective.scenario) return;
    alt.Player.local.inScenario = true;
    native.taskStartScenarioInPlace(
        alt.Player.local.scriptID,
        objective.scenario,
        0,
        true
    );
}

function clearScenario() {
    alt.Player.local.inScenario = false;
    if (alt.Player.local.vehicle) return;
    native.clearPedTasks(alt.Player.local.scriptID);
}
