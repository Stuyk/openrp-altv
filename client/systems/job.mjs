import * as alt from 'alt';
import * as native from 'natives';
import { distance } from '/client/utility/vector.mjs';
import { drawMarker } from '/client/utility/marker.mjs';
import { playAudio } from '/client/systems/sound.mjs';
import { playParticleFX } from '/client/utility/particle.mjs';
import { drawText3d } from '/client/utility/text.mjs';

alt.log('Loaded: client->systems->job.mjs');

/**
 * Intervals
 */
const regex = new RegExp('^[a-zA-Z]{1}$');
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
let target;
let targetBlip = false;
let soundCooldown = Date.now();
let projectileCooldown = Date.now();

const types = {
    0: point, // Go to Point
    1: capture, // Stand in Point
    2: hold, // Hold 'E'
    3: mash, // Mash 'E'
    4: player, // Target
    5: order, // Press Keys in Order
    7: wait
};

export const modifiers = {
    MIN: 0,
    ON_FOOT: 1,
    IN_VEHICLE: 2,
    REMOVE_VEHICLE: 4,
    PICKUP_PLAYER: 16,
    DROPOFF_PLAYER: 32,
    KILL_PLAYER: 64,
    REPAIR_PLAYER: 128,
    GOTO_PLAYER: 256,
    REMOVE_ITEM: 512,
    CLEAR_PROPS: 1024,
    MAX: 2048
};

const metaTypes = {
    'job:Objective': setupObjective,
    'job:ClearObjective': clearObjective,
    'job:Progress': updateProgress,
    'job:Target': updateTarget
};

// When the player updates their inventory.
alt.on('meta:Changed', (key, value) => {
    if (!key.includes('job')) return;
    metaTypes[key](value);
});

/**
 * Setup the current objective information
 * that is passed from server-side.
 * @param value
 */
function setupObjective(value) {
    if (!value) return;
    pause = true;
    objective = JSON.parse(value);

    if (objective.blip) {
        if (objective.blip.pos.x + objective.blip.pos.y !== 0) {
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
    }

    if (objective.forcedAnim) {
        loadAnim(objective.forcedAnim.dict).then(res => {
            native.taskPlayAnim(
                alt.Player.local.scriptID,
                objective.forcedAnim.dict,
                objective.forcedAnim.name,
                1,
                -1,
                -1,
                objective.forcedAnim.flag,
                1.0,
                false,
                false,
                false
            );
        });
    }

    if (objective.type === 5) {
        alt.Player.local.setMeta('job:KeyPressEvent', true);
        alt.on('keyup', keyPressEvents);
    }

    objectiveInfo = alt.setInterval(intervalObjectiveInfo, 0);
    objectiveChecking = alt.setInterval(intervalObjectiveChecking, 100);

    alt.log(`job.mjs ${objectiveInfo}`);
    alt.log(`job.mjs ObjChecking ${objectiveChecking}`);
    pause = false;
}

function keyPressEvents(e) {
    if (!objective) return;
    if (pause) return;
    let key = String.fromCharCode(e).toLowerCase();

    if (!key.match(regex)) {
        return;
    }

    if (key !== objective.word[0].toLowerCase()) {
        alt.off('keyup', keyPressEvents);
        alt.emitServer('job:SkipToBeginning');
        return;
    }

    objective.word.shift();
    if (objective.word.length <= 0) {
        alt.emitServer('job:Check');
        return;
    }
}

/**
 * Clear the current objective.
 */
function clearObjective() {
    alt.off('keyup', keyPressEvents);
    alt.Player.local.setMeta('job:KeyPressEvent', false);
    pause = true;
    objective = undefined;
    clearScenario();

    if (
        !alt.Player.local.vehicle &&
        !native.isPedSwimming(alt.Player.local.scriptID) &&
        native.isPedStill(alt.Player.local.scriptID)
    ) {
        native.clearPedTasks(alt.Player.local.scriptID);
        native.clearPedTasksImmediately(alt.Player.local.scriptID);
    }

    if (objectiveInfo) {
        alt.clearInterval(objectiveInfo);
        objectiveInfo = undefined;
    }

    if (objectiveChecking) {
        alt.clearInterval(objectiveChecking);
        objectiveChecking = undefined;
    }

    if (blip && !targetBlip) {
        blip.destroy();
        blip = undefined;
    }

    mashing = 0;
    pause = false;
}

/**
 * Update progress of a job.
 * @param value
 */
function updateProgress(value) {
    if (!objective) return;
    objective.progress = value;
}

/**
 * Setup a Target for the 'Player' objective type.
 * @param jsonOrUndefined
 */
function updateTarget(data) {
    if (!data) {
        target = undefined;
        targetBlip = false;
        if (blip) {
            blip.destroy();
            blip = undefined;
        }
        return;
    }

    target = data;

    if (blip) {
        blip.destroy();
        blip = undefined;
    }

    targetBlip = true;
    blip = new alt.PointBlip(
        target.entity.pos.x,
        target.entity.pos.y,
        target.entity.pos.z
    );
    blip.shortRange = false;
    blip.sprite = objective.blip.sprite;
    blip.color = objective.blip.color;
    blip.name = 'Objective';
}

/**
 * Constant looping and displaying.
 */
function intervalObjectiveInfo() {
    if (!objective || pause) return;
    if (alt.Player.local.getMeta('viewOpen')) return;

    if (objective.marker && dist <= 100 && dist > 1) {
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

    if (objective.word && objective.word.length >= 1 && objective.marker) {
        native.disableAllControlActions(0);
        native.disableAllControlActions(1);
        drawText3d(
            objective.word.join(''),
            objective.marker.pos.x,
            objective.marker.pos.y,
            objective.marker.pos.z + 1,
            0.5,
            4,
            255,
            255,
            255,
            255,
            true
        );
    }

    if (objective && objective.helpText && !target) {
        native.beginTextCommandDisplayHelp('STRING');
        native.addTextComponentSubstringPlayerName(objective.helpText);
        native.endTextCommandDisplayHelp(0, false, true, -1);
    } else if (target) {
        native.beginTextCommandDisplayHelp('STRING');
        native.addTextComponentSubstringPlayerName(target.message);
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
            lastMash = Date.now() + 1500;
            mashing += 1;
        }
    }

    playerSpeed = native.getEntitySpeed(alt.Player.local.scriptID);

    if (playerSpeed >= 1) {
        alt.Player.local.inAnimation = false;
    }

    /**
     * Check if target is defined.
     */
    if (target && isFlagged(objective.flags, modifiers.DROPOFF_PLAYER)) {
        dist = distance(alt.Player.local.pos, target.pos);
        if (blip) {
            blip.position = [target.pos.x, target.pos.y, target.pos.z];
        }
        return;
    }

    if (target && isFlagged(objective.flags, modifiers.PICKUP_PLAYER)) {
        dist = distance(alt.Player.local.pos, target.entity.pos);
        if (blip) {
            blip.position = [
                target.entity.pos.x,
                target.entity.pos.y,
                target.entity.pos.z
            ];
        }
        return;
    }

    if (target && isFlagged(objective.flags, modifiers.REPAIR_PLAYER)) {
        dist = distance(alt.Player.local.pos, target.entity.pos);
        if (blip) {
            blip.position = [
                target.entity.pos.x,
                target.entity.pos.y,
                target.entity.pos.z
            ];
        }
        return;
    }

    if (target && isFlagged(objective.flags, modifiers.GOTO_PLAYER)) {
        dist = distance(alt.Player.local.pos, target.pos);
        if (blip) {
            blip.position = [
                target.entity.pos.x,
                target.entity.pos.y,
                target.entity.pos.z
            ];
        }
        return;
    }

    dist = distance(alt.Player.local.pos, objective.pos);
}

function intervalObjectiveChecking() {
    if (!objective || pause) return;
    if (alt.Player.local.getMeta('viewOpen')) return;

    // Check Distance
    if (dist > objective.range) {
        if (alt.Player.local.inAnimation || alt.Player.local.inScenario) {
            clearScenario();
        }

        return;
    }

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
        return;
    }

    // Check Serverside
    alt.emitServer('job:Check');
}

function preObjectiveCheck() {
    let valid = true;

    if (isFlagged(objective.flags, modifiers.ON_FOOT) && valid) {
        if (alt.Player.local.vehicle) valid = false;
    }

    if (isFlagged(objective.flags, modifiers.IN_VEHICLE) && valid) {
        if (!alt.Player.local.vehicle) valid = false;
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
        if (!alt.Player.local.inScenario) {
            playScenario();
        }

        if (!alt.Player.local.inAnimation) {
            playAnimation();
        }
        return true;
    } else {
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
        clearScenario();
        return false;
    } else {
        if (!alt.Player.local.inScenario) {
            playScenario();
        }

        if (!alt.Player.local.inAnimation) {
            playAnimation();
        }
    }

    if (mashing >= 5) {
        mashing = 0;
        return true;
    }

    return false;
}

function wait() {
    if (playerSpeed >= 5 && !alt.Player.local.inScenario) {
        clearScenario();
        return false;
    }

    if (Date.now() < objective.modifiedWaitTime) {
        if (!alt.Player.local.inAnimation) {
            playAnimation();
        }
        return false;
    }

    return true;
}

function order() {
    if (!alt.Player.local.inAnimation) {
        playAnimation();
    }
    return false;
}

/**
 * Check if the target has been set.
 * Then check the modifiers that
 * are set for the individual
 * objective.
 */
function player() {
    if (!target) return false;

    let isValid = true;
    if (isFlagged(objective.flags, modifiers.DROPOFF_PLAYER)) {
        if (dist > objective.range) isValid = false;
    }

    if (isFlagged(objective.flags, modifiers.PICKUP_PLAYER)) {
        if (target.entity.vehicle !== alt.Player.local.vehicle) isValid = false;
    }

    if (isFlagged(objective.flags, modifiers.REPAIR_PLAYER)) {
        alt.log('Checking Repair');
        if (dist > objective.range) isValid = false;
        if (!hold()) {
            isValid = false;
        }
    }

    if (isFlagged(objective.flags, modifiers.GOTO_PLAYER)) {
        if (dist > objective.range) isValid = false;
    }

    return isValid;
}

function playScenario() {
    if (!objective.scenario) return;
    alt.Player.local.inScenario = true;
    native.freezeEntityPosition(alt.Player.local.scriptID, true);
    alt.nextTick(() => {
        native.taskStartScenarioInPlace(
            alt.Player.local.scriptID,
            objective.scenario,
            0,
            true
        );
    });
}

function clearScenario() {
    if (alt.Player.local.jobEffectInterval) {
        alt.clearInterval(alt.Player.local.jobEffectInterval);
        alt.Player.local.jobEffectInterval = undefined;
    }

    if (objective) {
        if (objective.forcedAnim) return;
    }

    native.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.Player.local.inScenario = false;
    alt.Player.local.inAnimation = false;
    if (alt.Player.local.vehicle) return;
    native.clearPedTasks(alt.Player.local.scriptID);
}

function playAnimation() {
    if (!objective.anim) return;
    alt.Player.local.inAnimation = true;
    loadAnim(objective.anim.dict).then(res => {
        native.taskPlayAnim(
            alt.Player.local.scriptID,
            objective.anim.dict,
            objective.anim.name,
            1,
            -1,
            objective.anim.duration,
            objective.anim.flag,
            1.0,
            false,
            false,
            false
        );

        if (!alt.Player.local.jobEffectInterval) {
            alt.Player.local.jobEffectInterval = alt.setInterval(() => {
                native.freezeEntityPosition(alt.Player.local.scriptID, true);
                let time = native.getEntityAnimCurrentTime(
                    alt.Player.local.scriptID,
                    objective.anim.dict,
                    objective.anim.name
                );

                time = time.toFixed(2) * 1;
                if (objective.anim.sounds) {
                    objective.anim.sounds.forEach(sound => {
                        if (!sound.time) return;
                        if (time !== sound.time) return;
                        if (!sound.name) return;
                        if (Date.now() < soundCooldown) return;
                        soundCooldown = Date.now() + 100;
                        playAudio(sound.name);
                    });
                }

                if (objective.particles) {
                    objective.particles.forEach(particle => {
                        if (!particle.dict) return;
                        if (!particle.name) return;
                        if (!particle.duration) return;
                        if (!particle.scale) return;
                        if (!particle.offset) return;
                        if (!particle.time) return;
                        if (time !== particle.time) return;
                        if (Date.now() < projectileCooldown) return;
                        projectileCooldown = Date.now() + 10;
                        playParticleFX(
                            particle.dict,
                            particle.name,
                            particle.duration,
                            particle.scale,
                            particle.offset.x,
                            particle.offset.y,
                            particle.offset.z
                        );
                    });
                }
            }, 3);
        }
    });
}

async function loadAnim(dict) {
    return new Promise(resolve => {
        native.requestAnimDict(dict);
        let inter = alt.setInterval(() => {
            if (native.hasAnimDictLoaded(dict)) {
                resolve(true);
                alt.clearInterval(inter);
                return;
            }
        }, 5);
    });
}

let dict;
let name;

alt.on('consoleCommand', (cmd, ...args) => {
    if (cmd === 'markanim') {
        let [_dict, _name, _time] = args;
        if (!_time) {
            _time = 8000;
        }

        dict = _dict;
        name = _name;

        alt.log(`markanim ${_dict} ${_name}`);
        loadAnim(_dict).then(res => {
            native.taskPlayAnim(
                alt.Player.local.scriptID,
                _dict,
                _name,
                1,
                -1,
                20000,
                1,
                1.0,
                false,
                false,
                false
            );

            alt.setTimeout(() => {
                alt.nextTick(() => {
                    const totalTime = native.getEntityAnimTotalTime(
                        alt.Player.local.scriptID,
                        _dict,
                        _name
                    );
                    alt.log(`Total Time: ${totalTime}`);

                    alt.on('keydown', keyHelper);
                    alt.setTimeout(() => {
                        alt.log('Cleared');
                        alt.off('keydown', keyHelper);
                        native.clearPedTasksImmediately(alt.Player.local.scriptID);
                    }, _time * 1);
                });
            }, 20);
        });
    }
});

function keyHelper(e) {
    if (e === 32) {
        let animTime = native.getEntityAnimCurrentTime(
            alt.Player.local.scriptID,
            dict,
            name
        );

        alt.log(`Logged: ${animTime}`);
    }
}

// markanim weapons@projectile@ drop_underhand

/**
 * Creates a 'fish'
 * and then drops the fish into the water.
 * Then it checks if the fish is in the water.
 * If it's not then it returns false.
 */
alt.onServer('job:isInWater', callbackName => {
    const id = alt.Player.local.scriptID;
    const fwd = native.getEntityForwardVector(id);
    const pPos = alt.Player.local.pos;
    let pos = {
        x: pPos.x + fwd.x * 10,
        y: pPos.y + fwd.y * 10,
        z: pPos.z
    };

    const [_, height] = native.testVerticalProbeAgainstAllWater(
        pos.x,
        pos.y,
        pos.z,
        undefined,
        undefined
    );

    if (height === 0) {
        alt.emitServer(callbackName, callbackName, false);
        return;
    }

    const hash = native.getHashKey('a_c_fish');
    native.requestModel(hash);
    alt.nextTick(() => {
        const entity = native.createPed(1, hash, pos.x, pos.y, pos.z, 0, false, false);
        native.setEntityAlpha(entity, 0, true);

        alt.setTimeout(() => {
            alt.nextTick(() => {
                const inWater = native.isEntityInWater(entity);
                pos.z = height;
                alt.emitServer(callbackName, callbackName, inWater, pos);
                native.deleteEntity(entity);
            });
        }, 3500);
    });
});
