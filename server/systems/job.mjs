import * as alt from 'alt';
import * as chat from '../chat/chat.mjs';
import { Dictionary } from '../configuration/dictionary.mjs';
import { distance, randPosAround } from '../utility/vector.mjs';
import { addXP } from '../systems/skills.mjs';
import { Items } from '../configuration/items.mjs';

const Debug = true;

export const objectives = {
    POINT: 0, // Go to Point
    CAPTURE: 1, // Stand in Point
    HOLD: 2, // Hold 'E'
    MASH: 3, // Mash 'E'
    PLAYER: 4, // Player Type
    ORDER: 5, // Press Keys in Order
    INFINITE: 6 // Repeat any objectives after this.
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
    MAX: 256
};

/**
 * These cause instant fails. :D
 */
export const restrictions = {
    MIN: 0,
    NO_VEHICLES: 1,
    NO_WEAPONS: 2,
    NO_DIEING: 4,
    TIME_LIMIT: 8,
    MAX: 16
};

/**
 * Checks if a flag is being used.
 * @param flags
 * @param flagValue
 */
function isFlagged(flags, flagValue) {
    if ((flags & flagValue) === flagValue) {
        return true;
    }
    return false;
}

/**
 * Create an objective to add to a JOB.
 */
export class Objective {
    constructor(objectiveType, objectiveFlags) {
        this.type = objectiveType;
        this.flags = objectiveFlags;
        this.rewards = [];
        this.range = 5;
        this.maxProgress = 5;
        this.progress = -1;

        if (this.type === 5) {
            this.word = getWord();
        }
    }

    /**
     * Set the objective position.
     * @param pos vector3
     */
    setPosition(pos) {
        pos.z -= 0.5;
        this.pos = pos;
    }

    /**
     * The distance the player must be in
     * for the objective to be valid.
     * @param pos number
     */
    setRange(range) {
        if (range <= 2) range = 2;
        this.range = range;
    }

    /**
     * Set the objective message for info.
     * @param msg stirng
     */
    setHelpText(msg) {
        this.helpText = msg;
    }

    /**
     * Set a scenario to be played when using
     * any key press type.
     * @param name
     */
    setScenario(name) {
        this.scenario = name;
    }

    /**
     * Set an array of rewards to give.
     * [
     * { type: 'item', prop: 'itemKey', quantity: 1 },
     * { type: 'xp', prop: 'agility', quantity: 25 }
     * ]
     * @param arrayOfRewards
     */
    setRewards(arrayOfRewards) {
        this.rewards = arrayOfRewards;
    }

    /**
     * Sound played for each progress tick.
     * @param soundName string
     */
    setEverySound(soundName) {
        this.everySound = soundName;
    }

    /**
     * Sound played at objective completion.
     * @param soundName string
     */
    setFinishSound(soundName) {
        this.finishSound = soundName;
    }

    /**
     * Set the animation to play while doing this objective.
     * @param dict string
     * @param anim string
     * @param flags number
     * @param duration numberInMS
     */
    setAnimation(dict, name, flag, duration) {
        this.anim = {
            dict,
            name,
            flag,
            duration
        };
    }

    /**
     * Display a marker?
     * @param type number
     * @param pos vector3
     * @param dir vector3
     * @param rot vector3
     * @param scale vector3
     * @param r number
     * @param g number
     * @param b number
     * @param a number
     */
    setMarker(type, pos, dir, rot, scale, r, g, b, a) {
        this.marker = {
            type,
            pos,
            dir,
            rot,
            scale,
            r,
            g,
            b,
            a
        };
    }

    /**
     * The blip to set for the objective.
     * @param type number
     * @param color number
     * @param pos vector3
     */
    setBlip(sprite, color, pos) {
        this.blip = {
            sprite,
            color,
            pos
        };
    }

    /**
     * Set a target for the objective.
     * @param target vector3, player, vehicle, etc.
     * @param type vector3, player, vehicle, as string
     */
    setTarget(target, type) {
        this.target = {
            target,
            type
        };
    }

    /**
     * [{ label: 'Pickaxe', inInventory: true, quantity: 1 }]
     * @param arrayOfItems
     */
    setItemRestrictions(arrayOfItems) {
        this.itemRestrictions = arrayOfItems;
    }

    /**
     * Set a vehicle to be spawned after objective completion.
     * @param type
     * @param pos
     */
    setVehicle(type, pos) {
        this.veh = {
            type,
            pos
        };
    }

    /**
     * Set the max progress to complete
     * an objective. 10 is minimum.
     * @param amount
     */
    setMaxProgress(amount = 10) {
        if (amount <= 10) amount = 10;
        this.maxProgress = amount;
    }

    /**
     * Called when the user wants to attempt
     * the objective reference they have.
     * @param player
     * @param args
     */
    attemptObjective(player, ...args) {
        // Check job restrictions from job.
        checkRestrictions(player);

        if (!player.job) return;

        // Check the Objective
        if (!this.checkObjective(player, args)) {
            player.emitMeta('job:Progress', this.progress);
            return false;
        }

        // Issue Rewards
        if (this.rewards.length >= 1) {
            this.rewards.forEach(reward => {
                if (reward.type === 'xp') {
                    addXP(player, reward.prop, reward.quantity);
                }

                if (reward.type === 'item') {
                    if (Items[reward.prop]) {
                        if (Items[reward.prop].stackable) {
                            player.addItem(
                                { ...Items[reward.prop] },
                                reward.quantity,
                                false
                            );
                            player.send(
                                `${Items[reward.prop].label} was added to your inventory.`
                            );
                        } else {
                            for (let i = 0; i < reward.quantity; i++) {
                                player.addItem({ ...Items[reward.prop] }, 1, false);
                                player.send(
                                    `${Items[reward.prop].label} was added to your inventory.`
                                );
                            }
                        }
                    } else {
                        console.log(`${reward.prop} was not found for a reward.`);
                    }
                }
            });
        }

        if (this.veh) {
            let pos = randPosAround(this.veh.pos, 10);
            const vehicle = new alt.Vehicle(this.veh.type, pos.x, pos.y, pos.z, 0, 0, 0);

            vehicle.job = {
                player,
                preventHijack: true
            };

            player.vehicles.push(vehicle);
        }

        // Play a sound; after a user finishes their objective.
        playFinishedSound(player, this);

        // Reset progress for this objective.
        this.progress = -1;

        // Go To Next Objective
        // Issue Rewards Here
        player.emitMeta('job:Objective', undefined);
        return true;
    }

    /**
     * Check the objective and see if it's
     * valid.
     * @param player
     * @param args
     */
    checkObjective(player, args) {
        let valid = true;

        // Set the position to the player
        // if the objective doesn't have one.
        if (!this.pos) {
            this.pos = player.pos;
        }

        /**
         * Range Check First
         */
        if (this.type <= 5) {
            if (!isInRange(player, this)) valid = false;
        }

        /**
         * Target objectives have to come first.
         */
        // TODO: Add target objectives.

        if (isFlagged(this.flags, modifiers.ON_FOOT) && valid) {
            if (player.vehicle) valid = false;
        }

        if (isFlagged(this.flags, modifiers.IN_VEHICLE) && valid) {
            if (!player.vehicle) {
                valid = false;
            } else {
                const vehicles = player.vehicles.filter(
                    x => x.job !== undefined && x === player.vehicle
                );

                if (vehicles.length <= 0) {
                    valid = false;
                }
            }
        }

        /**
         * Finally check the base objective type
         */
        if (this.type === objectives.CAPTURE && valid) {
            valid = capture(player, this);
        }

        if (this.type === objectives.HOLD && valid) {
            valid = hold(player, this);
        }

        if (this.type === objectives.MASH && valid) {
            valid = mash(player, this);
        }

        if (this.type === objectives.ORDER && valid) {
            valid = order(player, this, args);
        }

        return valid;
    }
}

const isInRange = (player, objective) => {
    if (distance(player.pos, objective.pos) >= objective.range) return false;
    return true;
};

/**
 * The Follow objectives
 * are to be kept seperate; for additional objective modifiers.
 */

// CAPTURE: 1, // Stand in Point
const capture = (player, objective) => {
    objective.progress += 1;
    if (objective.progress < objective.maxProgress) {
        playAnimation(player, objective);
        playEverySound(player, objective);
        return false;
    }
    return true;
};

// HOLD: 2, // Hold 'E'
const hold = (player, objective) => {
    objective.progress += 1;
    if (objective.progress < objective.maxProgress) {
        playAnimation(player, objective);
        playEverySound(player, objective);
        return false;
    }
    return true;
};

// MASH: 3, // Mash 'E'
const mash = (player, objective) => {
    objective.progress += 1;

    alt.log(objective.progress);
    alt.log(objective.maxProgress);

    if (objective.progress < objective.maxProgress) {
        playAnimation(player, objective);
        playEverySound(player, objective);
        return false;
    }
    return true;
};

// TARGET: 4, // Target
const target = (player, objective) => {
    //
};

// ORDER: 5, // Press Keys in Order
const order = (player, objective, args) => {
    //
};

const getWord = () => {
    const word = Math.floor(Math.random() * (Dictionary.length - 1));
    return Dictionary[word];
};

const playAnimation = (player, objective) => {
    if (objective.anim === undefined) return;
    const anim = objective.anim;
    player.playAnimation(anim.dict, anim.name, anim.duration, anim.flag);
};

const playEverySound = (player, objective) => {
    if (objective.everySound === undefined) return;
    player.playAudio(objective.everySound);
};

const playFinishedSound = (player, objective) => {
    if (objective.finishSound === undefined) return;
    player.playAudio(objective.finishSound);
};

export class Job {
    constructor(player, name, restrictions = 0) {
        this.name = name;
        this.objectives = [];
        this.restrictions = restrictions;
        this.items = [];
        this.timelimit = 60000;
        player.hasDied = false;
        player.job = this;
    }

    /**
     * Clear the job
     * @param player
     */
    clear(player) {
        let currentJob = player.getMeta('job');
        if (currentJob) {
            // Clear the Job Here
        }
    }

    /**
     * Start the job.
     * @param player
     */
    start(player) {
        // Check Item Restrictions
        if (!this.checkItemRestrictions(player)) {
            quitJob(player, false, true);
            return;
        }

        this.addUniform(player);

        this.start = Date.now();
        player.emitMeta('job:Objective', JSON.stringify(this.objectives[0]));

        if (isFlagged(this.restrictions, restrictions.TIME_LIMIT)) {
            this.end = this.start + this.timelimit;
        }
    }

    setUniform(uniformKey) {
        if (!Items[uniformKey]) {
            console.log('That key does not exist in items.');
            return;
        }

        this.uniform = uniformKey;
    }

    addUniform(player) {
        if (!this.uniform) return;
        if (player.hasItem(Items[this.uniform].label)) return;
        player.addItem({ ...Items[this.uniform] }, 1, false);
        player.send(`${Items[this.uniform].label} was added to your inventory.`);
    }

    checkItemRestrictions(player) {
        if (this.items.length <= 0) return true;
        let allValid = true;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].hasItem) {
                if (!player.hasItem(this.items[i].label)) {
                    allValid = false;
                    player.send('You are restricted from doing this job.');
                    player.send(`You don't have {FF0000}${this.items[i].label}{FFFFFF}.`);
                    break;
                }
            } else {
                if (player.hasItem(this.items[i].label)) {
                    allValid = false;
                    player.send('You are restricted from doing this job.');
                    player.send(`You have {FF0000}${this.items[i].label}{FFFFFF}.`);
                    break;
                }
            }
        }
        return allValid;
    }

    /**
     * Set a time limit for the entire job.
     * @param timeInMS
     */
    setTimelimit(timeInMS) {
        this.timelimit = timeInMS;
    }

    /**
     * [{ label: 'Drivers License', hasItem: false }]
     * @param arrayOfItems
     */
    setItemRestrictions(arrayOfItems) {
        this.items = arrayOfItems;
    }

    /**
     * Add an Objective Class type to loop through.
     * @param objectiveClass
     */
    add(objectiveClass) {
        this.objectives.push(objectiveClass);
    }

    /**
     * Go to the next objective.
     */
    next(player) {
        const lastObjective = this.objectives.shift();
        player.emitMeta('job:ClearObjective', true);

        // Check if an objective is present.
        if (this.objectives[0]) {
            // Append Objective to End of Array
            if (this.infinite) {
                this.objectives.push(lastObjective);
            }

            // If the objective type is infinite; skip it.
            if (this.objectives[0].type === objectives.INFINITE) {
                this.infinite = true;
                this.objectives.shift();
            }
        } else {
            player.emitMeta('job:Objective', undefined);
            player.send('Job Complete');
            return;
        }

        player.emitMeta('job:Objective', JSON.stringify(this.objectives[0]));
    }

    /**
     * Check an objective.
     * @param player
     * @param args
     */
    check(player, ...args) {
        if (player.checking) return;
        player.checking = true;

        if (!this.objectives[0].attemptObjective(player, ...args)) {
            player.checking = false;
            return;
        }

        player.checking = false;
        this.next(player);
    }
}

export function check(player) {
    if (!player.job) return;
    player.job.check(player);
}

export function checkRestrictions(player) {
    if (!player.job) return;
    if (player.job.restrictions <= 0) return;
    if (isFlagged(player.job.restrictions, restrictions.NO_VEHICLES)) {
        if (player.vehicle) {
            player.send('Failed; no vehicles allowed.');
            quitJob(player, false, true);
            return;
        }
    }

    if (isFlagged(player.job.restrictions, restrictions.TIME_LIMIT)) {
        if (Date.now() > this.end) {
            player.send('You have exhausted your time limit.');
            quitJob(player, false, true);
            return;
        }
    }

    // Dieing Restriction
    if (isFlagged(player.job.restrictions, restrictions.NO_DIEING)) {
        if (player.hasDied) {
            player.send('This job does not allow dieing; you have failed.');
            quitJob(player, false, true);
            return;
        }
    }

    // Weapon Restriction
    if (isFlagged(player.job.restrictions, restrictions.NO_WEAPONS)) {
        if (player.inventory[37]) {
            if (player.inventory[37].isWeapon) {
                player.send('This job does not allow weapons.');
                quitJob(player, false, true);
                return;
            }
        }
    }
}

export function quitJob(player, loggingOut = false, playFailSound = false) {
    if (player.job) delete player.job;
    if (player.vehicles.length >= 1) {
        let nonJobVehicles = player.vehicles.filter(x => x.job === undefined);
        let jobVehicles = player.vehicles.filter(x => x.job !== undefined);
        player.vehicles = nonJobVehicles;
        if (jobVehicles.length >= 1) {
            jobVehicles.forEach(veh => {
                veh.destroy();
            });
        }
    }

    if (playFailSound) {
        player.playAudio('error');
    }

    player.emitMeta('job:ClearObjective', true);
}

/*
let objectivemodifiers = 0;
objectivemodifiers |= flags.ON_FOOT;
objectivemodifiers |= flags.PROGRESS_BAR;

if (isFlagTicked(objectivemodifiers, flags.IN_VEHICLE)) {
  console.log(true);
} else {
  console.log(false);
}


let typemodifiers = 0;
typemodifiers |= types.POINT;
typemodifiers |= types.HACK;

if (isFlagTicked(typemodifiers, types.POINT)) {
    console.log(true);
}
*/

chat.registerCmd('test', player => {
    player.pos = { x: -1694.181640625, y: 144.24208068847656, z: 63.3714828491211 };

    let job = new Job(player, 'idkwtf');
    let emptyVector = { x: 0, y: 0, z: 0 };

    // 0
    let objective = new Objective(0, 1);
    let pos = { x: -1694.181640625, y: 144.24208068847656, z: 63.3714828491211 };
    objective.setPosition(pos);
    objective.setRange(5);
    objective.setHelpText('Hey 1');
    objective.setBlip(1, 2, pos);
    objective.setMarker(
        1,
        pos,
        emptyVector,
        emptyVector,
        new alt.Vector3(5, 5, 1),
        0,
        255,
        0,
        100
    );
    job.add(copyObjective(objective));

    // 1
    pos = {
        x: -1698.1951904296875,
        y: 150.09451293945312,
        z: 63.37149047851562
    };
    objective.setHelpText('Hey 2');
    objective.setPosition(pos);
    objective.setBlip(1, 2, pos);
    objective.setMarker(
        1,
        pos,
        emptyVector,
        emptyVector,
        new alt.Vector3(5, 5, 1),
        0,
        255,
        0,
        100
    );
    job.add(copyObjective(objective));

    /// 2
    pos = {
        x: -1711.4559326171875,
        y: 168.86724853515625,
        z: 63.37132263183594
    };
    objective.setHelpText('Hey 3');
    objective.setPosition(pos);
    objective.setBlip(1, 2, pos);
    objective.setMarker(
        1,
        pos,
        emptyVector,
        emptyVector,
        new alt.Vector3(5, 5, 1),
        0,
        255,
        0,
        100
    );
    job.add(copyObjective(objective));

    objective = new Objective(6, 1);
    job.add(copyObjective(objective));

    // Capture Type
    objective = new Objective(0, 1);
    pos = { x: -1694.181640625, y: 144.24208068847656, z: 63.3714828491211 };
    objective.setPosition(pos);
    objective.setRange(5);
    objective.setHelpText('Hey 4');
    objective.setBlip(1, 2, pos);
    objective.setMarker(
        1,
        pos,
        emptyVector,
        emptyVector,
        new alt.Vector3(5, 5, 1),
        0,
        255,
        0,
        100
    );
    objective.setEverySound('tick');
    job.add(copyObjective(objective));

    // Capture Type
    objective = new Objective(0, 1);
    pos = {
        x: -1698.1951904296875,
        y: 150.09451293945312,
        z: 63.37149047851562
    };
    objective.setPosition(pos);
    objective.setRange(2);
    objective.setHelpText('Hold ~INPUT_CONTEXT~ to capture.');
    objective.setBlip(1, 2, pos);
    objective.setMarker(
        1,
        pos,
        emptyVector,
        emptyVector,
        new alt.Vector3(1, 1, 1),
        0,
        255,
        0,
        100
    );
    objective.setEverySound('tick');
    job.add(copyObjective(objective));

    // Capture Type
    objective = new Objective(0, 1);
    pos = { x: -1694.181640625, y: 144.24208068847656, z: 63.3714828491211 };
    objective.setPosition(pos);
    objective.setRange(2);
    objective.setHelpText('Mash ~INPUT_CONTEXT~ to capture.');
    objective.setBlip(1, 2, pos);
    objective.setMarker(
        1,
        pos,
        emptyVector,
        emptyVector,
        new alt.Vector3(1, 1, 1),
        0,
        255,
        0,
        100
    );
    objective.setEverySound('tick');
    objective.setFinishSound('complete');
    job.add(copyObjective(objective));
    job.start(player);
});

export function copyObjective(original) {
    var copied = Object.assign(Object.create(Object.getPrototypeOf(original)), original);
    return copied;
}
