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
    GOTO_PLAYER: 256,
    REMOVE_ITEM: 512,
    MAX: 1024
};

export const restrictions = {
    MIN: 0,
    NO_VEHICLES: 1,
    NO_WEAPONS: 2,
    NO_DIEING: 4,
    TIME_LIMIT: 8,
    MAX: 16
};

function isFlagged(flags, flagValue) {
    if ((flags & flagValue) === flagValue) {
        return true;
    }
    return false;
}

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

    setPosition(pos) {
        this.pos = pos;
    }

    setRange(range) {
        if (range <= 3) range = 3;
        this.range = range;
    }

    setHelpText(msg) {
        this.helpText = msg;
    }

    setAnimationScenario(name) {
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

    setSoundEveryProgressTick(soundName) {
        this.everySound = soundName;
    }

    /**
     * Sound played at objective completion.
     * @param soundName string
     */
    setFinishedSound(soundName) {
        this.finishSound = soundName;
    }

    /**
     * Set the animation to play while doing this objective.
     * @param dict string
     * @param anim string
     * @param flags number
     * @param duration numberInMS
     */
    setAnimationAndSound(
        dict,
        name,
        flag,
        duration,
        sound = undefined,
        animationHitTime
    ) {
        this.anim = {
            dict,
            name,
            flag,
            duration,
            sound,
            animationHitTime
        };
    }

    setParticleEffect(dict, name, duration, isGround = false) {
        this.particle = {
            dict,
            name,
            duration,
            isGround
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
     * [{ label: 'Pickaxe', quantity: 1 }]
     * @param data Item array.
     */
    setRemoveItem(arrayOfItems) {
        this.removeItem = arrayOfItems;
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

        // Item Removal Check
        if (isFlagged(this.flags, modifiers.REMOVE_ITEM) && this.removeItem) {
            let allValid = true;
            let itemsToRemove = [];
            for (let i = 0; i < this.removeItem.length; i++) {
                let result = player.getItemQuantity(this.removeItem[i].label);
                if (result.count < this.removeItem[i].quantity) {
                    if (!player.job.itemWarning) {
                        player.send(
                            `You need ${this.removeItem[i].quantity} of the item ${this.removeItem[i].label}`
                        );
                    }

                    allValid = false;
                    continue;
                } else {
                    itemsToRemove = itemsToRemove.concat(result.items);
                }
            }

            player.job.itemWarning = true;

            if (!allValid) {
                return false;
            } else {
                itemsToRemove.forEach(item => {
                    player.subItemByHash(item.hash, item.quantity);
                });
            }
        }

        player.job.itemWarning = false;

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
            let pos = randPosAround(this.veh.pos, 2);
            const vehicle = new alt.Vehicle(this.veh.type, pos.x, pos.y, pos.z, 0, 0, 0);

            vehicle.job = {
                player,
                preventHijack: true
            };

            vehicle.engineOn = true;
            const vehicles = [...player.vehicles];
            vehicles.push(vehicle);
            player.vehicles = vehicles;
        }

        // Play a sound; after a user finishes their objective.
        playFinishedSound(player, this);

        // Reset progress for this objective.
        this.progress = -1;

        // Check objective modifier flags.
        if (player.job.target && player.job.target.entity) {
            const entity = player.job.target.entity;

            if (isFlagged(this.flags, modifiers.DROPOFF_PLAYER)) {
                if (entity) {
                    entity.ejectSlowly();
                    entity.jobber = undefined;
                }
            }

            if (isFlagged(this.flags, modifiers.REPAIR_PLAYER)) {
                let fare = player.job.target.owner.jobber.fare;
                if (!fare) {
                    fare = 0;
                }

                if (entity.constructor.name === 'Player') {
                    entity.spawn(entity.pos.x, entity.pos.y, entity.pos.z, 0);
                    entity.health = 25;
                    player.job.target.owner.subCash(fare);
                    player.addCash(fare);
                    player.job.target.owner.send(`{FF0000}-$${fare}`);
                    player.send(`{00FF00}+$${fare}`);
                }

                if (entity.constructor.name === 'Vehicle') {
                    entity.repair();
                    player.job.target.owner.subCash(fare);
                    player.addCash(fare);
                    player.job.target.owner.send(`{FF0000}-$${fare}`);
                    player.send(`{00FF00}+$${fare}`);
                }
            }
        }

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

        // Normal range check.
        // Then do a targed range check
        // if the objective type is 4.
        if (this.type <= objectives.ORDER && this.type !== objectives.PLAYER) {
            if (!isInRange(player, this)) valid = false;
        }

        // Checks if a player is on foot.
        if (isFlagged(this.flags, modifiers.ON_FOOT) && valid) {
            if (player.vehicle) valid = false;
        }

        // Checks if the player is in an job vehicle.
        if (isFlagged(this.flags, modifiers.IN_VEHICLE) && valid) {
            console.log('Checking vehicle flag.');
            if (!player.vehicle) {
                valid = false;
            } else {
                console.log('Checking vehicles list.');

                const vehicles = player.vehicles.filter(x => x.job !== undefined);

                let isVehicleUsed = false;
                vehicles.forEach(veh => {
                    if (veh === player.vehicle) {
                        isVehicleUsed = true;
                    }
                });

                if (!isVehicleUsed) {
                    valid = false;
                } else {
                    console.log('Valid vehicle.');
                }
            }
        }

        /**
         * Finally check the base objective type
         */
        // Check the capture objective type.
        // When the user is standing in a specific area.
        if (this.type === objectives.CAPTURE && valid) {
            valid = capture(player, this);
        }

        // Check the hold objective type.
        // When the user is holding 'E'
        if (this.type === objectives.HOLD && valid) {
            valid = hold(player, this);
        }

        // Check the mash objective type.
        // When the user is mashing 'E'.
        if (this.type === objectives.MASH && valid) {
            valid = mash(player, this);
        }

        // Check the order objective type
        // When the user is pressing keys in a specific
        // order.
        if (this.type === objectives.ORDER && valid) {
            valid = order(player, this, args);
        }

        // Check the player objective type
        // When the user has a 'target' type.
        if (this.type == objectives.PLAYER && valid) {
            if (player.job.target) {
                valid = targetPlayer(player, this);
            } else {
                valid = false;
            }
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
        playEverySound(player, objective);
        return false;
    }
    return true;
};

// HOLD: 2, // Hold 'E'
const hold = (player, objective) => {
    objective.progress += 1;
    if (objective.progress < objective.maxProgress) {
        playEverySound(player, objective);
        return false;
    }
    return true;
};

// MASH: 3, // Mash 'E'
const mash = (player, objective) => {
    objective.progress += 1;

    if (objective.progress < objective.maxProgress) {
        playEverySound(player, objective);
        return false;
    }
    return true;
};

// TARGET: 4, // Target
const targetPlayer = (player, objective) => {
    if (!player.job.target) return false;

    const target = player.job.target;

    let isValid = true;
    if (isFlagged(objective.flags, modifiers.PICKUP_PLAYER)) {
        if (!target.entity.vehicle) {
            isValid = false;
        } else {
            if (target.entity.vehicle !== player.vehicle) {
                isValid = false;
            }
        }
    }

    if (isFlagged(objective.flags, modifiers.DROPOFF_PLAYER)) {
        if (distance(target.entity.pos, target.pos) >= objective.range) {
            isValid = false;
        }
    }

    if (isFlagged(objective.flags, modifiers.KILL_PLAYER)) {
        if (!target.entity.hasDied) {
            isValid = false;
        }
    }

    /**
     * Called for repairing a target.
     */
    if (isFlagged(objective.flags, modifiers.REPAIR_PLAYER)) {
        if (distance(target.entity.pos, player.pos) >= objective.range) {
            isValid = false;
        } else {
            objective.progress += 1;
            if (objective.progress < objective.maxProgress) {
                isValid = false;
            }
        }
    }

    if (isFlagged(objectives.flags, modifiers.GOTO_PLAYER)) {
        if (distance(target.pos, player.pos) > objective.range) isValid = false;
    }

    return isValid;
};

// ORDER: 5, // Press Keys in Order
const order = (player, objective, args) => {
    //
};

const getWord = () => {
    const word = Math.floor(Math.random() * (Dictionary.length - 1));
    return Dictionary[word];
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
        if (player.job) {
            quitJob(player);
        }

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
        player.job.available = false;

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
                console.log(this.items[i]);

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
                this.objectives[0].infinite = true;
            }

            if (this.objectives[0].infinite) {
                this.clearTarget(player);
            }
        } else {
            player.emitMeta('job:Objective', undefined);
            player.send('Job Complete');
            quitJob(player);
            return;
        }

        player.emitMeta('job:Objective', JSON.stringify(this.objectives[0]));
    }

    /**
     * Skip all objectives; go straight to
     * beginning of infinite.
     * @param player
     */
    skipToBeginning(player) {
        this.clearTarget(player);
        player.emitMeta('job:ClearObjective', true);
        while (this.objectives[0].infinite !== true) {
            let last = this.objectives.shift();
            this.objectives.push(last);

            if (this.objectives[0] === undefined) {
                break;
            }
        }

        if (this.objectives[0] === undefined) {
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

    /**
     * Set the entity & position if necessary.
     * Only called from external methods;
     * never set this directly.
     * ===> player.job.setTarget
     * @param entity
     * @param position
     */
    setTarget(player, entity, position = undefined, message = '', owner = undefined) {
        this.target = {
            entity,
            pos: position,
            message,
            owner
        };
        player.emitMeta('job:Target', this.target);
    }

    /**
     * Clear the target for this job.
     */
    clearTarget(player) {
        this.target = undefined;
        player.job.available = true;
        player.emitMeta('job:Target', undefined);
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

/**
 * Called when the player quits a job as a target.
 * @param player
 *
 * player.jobber = {
 *     fare: cost.toFixed(2) * 1,
 *     position: player.pos,
 *     jobber: closestDriver,
 *     objectiveFare: false, // Called when the fare should only be invoked
 *                          // when an objective is complete.
 * };
 */
export function quitTarget(player) {
    if (!player.jobber) return;
    const dist = distance(player.pos, player.jobber.position);
    const employee = player.jobber.employee;
    const fare = player.jobber.fare;
    const isObjectiveFare = player.jobber.objectiveFare;
    player.send('You have cancelled your request.');

    // Employee doesn't exist; don't pay.
    if (!employee) {
        player.jobber = undefined;
        return;
    }

    if (fare && !isObjectiveFare) {
        if (employee && dist >= 25) {
            player.subCash(fare);
            player.send(`{FF0000} -$${fare}`);
            employee.addCash(fare);
            employee.send(`{00FF00} +$${fare}`);
        }

        if (employee) {
            if (employee.job) {
                employee.job.skipToBeginning(employee);
                employee.send('{FF0000}Your customer has left.');
            }
        }
    } else {
        if (employee) {
            if (employee.job) {
                employee.send('{FF0000}Your customer has cancelled the request.');
                employee.job.skipToBeginning(employee);
            }
        }
    }

    player.jobber = undefined;
}

export function quitJob(player, loggingOut = false, playFailSound = false) {
    if (player.vehicles.length >= 1) {
        let nonJobVehicles = player.vehicles.filter(x => x.job === undefined);
        let jobVehicles = player.vehicles.filter(x => x.job !== undefined);

        player.vehicles = nonJobVehicles;
        if (jobVehicles.length >= 1) {
            jobVehicles.forEach(veh => {
                veh.destroy();
            });
        }

        console.log(player.vehicles);
    }

    if (playFailSound) {
        player.playAudio('error');
    }

    if (player.job) {
        if (player.job.target) {
            if (player.job.target.entity.constructor.name === 'Player') {
                player.job.target.entity.jobber = undefined;
                player.job.target.entity.send('The employee quit their job.');
            }
        }
    }

    if (player.job) player.job = undefined;
    player.emitMeta('job:ClearObjective', true);
}

export function copyObjective(original) {
    var copied = Object.assign(Object.create(Object.getPrototypeOf(original)), original);
    return copied;
}
