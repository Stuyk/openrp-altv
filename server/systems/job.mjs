import * as alt from 'alt';
import * as chat from '../chat/chat.mjs';
import { Dictionary } from '../configuration/dictionary.mjs';
import { distance, randPosAround } from '../utility/vector.mjs';
import { addXP } from '../systems/skills.mjs';
import { Items, BaseItems } from '../configuration/items.mjs';
import { generateHash } from '../utility/encryption.mjs';

const Debug = true;

export const objectives = {
    POINT: 0, // Go to Point
    CAPTURE: 1, // Stand in Point
    HOLD: 2, // Hold 'E'
    MASH: 3, // Mash 'E'
    PLAYER: 4, // Player Type
    ORDER: 5, // Press Keys in Order
    INFINITE: 6, // Repeat any objectives after this.
    WAIT: 7,
    MINIGAME: 8
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
    NO_DAMAGE_VEHICLE: 2048,
    NULL_PLAYER: 4096,
    MAX: 8192
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
        this.waitTime = 0;
        this.useSectorWaitTime = -1;

        if (this.type === objectives.ORDER) {
            this.word = getWord().split('');
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
     * Time to wait in ms before this objective is ready.
     * @param ms
     */
    setWaitTime(ms) {
        this.waitTime = ms;
    }

    useSectorForWaitTime(maxValue = 100000) {
        this.useSectorWaitTime = maxValue;
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
    setAnimationAndSound(dict, name, flag, duration, sounds = undefined) {
        this.anim = {
            dict,
            name,
            flag,
            duration,
            sounds
        };
    }

    /**
     * Set a minigame for the minigame type.
     * @param minigameName
     */
    setMiniGame(minigameName) {
        this.minigame = minigameName;
        this.minigamehash = generateHash(this);
    }

    /**
     * Force an animation from start of objective; to next.
     * @param dict
     * @param name
     * @param flag
     */
    setForcedAnim(dict, name, flag) {
        this.forcedAnim = {
            dict,
            name,
            flag,
            duration: -1
        };
    }

    /**
     * Requires Animiation to Work
     * @param dict
     * @param name
     * @param duration
     * @param scale
     * @param offset Vector3
     * @param time TimeInMS to Play Based on Animation Ticks
     */
    setParticleEffect(arrayOfParticles) {
        this.particles = arrayOfParticles;
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
     * [{name: 'prop_fncwood_14a', bone: 57005, x: 0, y: 0, z: 0, pitch: 0, roll: 0, yaw: 0}]
     * @param propsArray
     */
    setProps(propsArray) {
        this.props = propsArray;
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
    setVehicle(type, pos, rot = 0) {
        this.veh = {
            type,
            pos,
            rot
        };
    }

    /**
     * Set the max progress to complete
     * an objective. 10 is minimum.
     * @param amount
     */
    setMaxProgress(amount = 1) {
        if (amount <= 1) amount = 1;
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
            const isValid = this.removeItems(player);
            if (!isValid) {
                return false;
            }
        }

        this.finishObjective(player);
        return true;
    }

    finishObjective(player) {
        // Reset progress for this objective.
        this.progress = -1;
        this.giveRewards(player);
        this.spawnVehicles(player);
        playFinishedSound(player, this);

        // Check objective modifier flags.
        if (player.job.target && player.job.target.entity) {
            this.finishTargetType(player);
        }

        if (isFlagged(this.flags, modifiers.CLEAR_PROPS)) {
            player.setSyncedMeta('job:Props', undefined);
        }

        if (this.props) {
            player.setSyncedMeta('job:Props', this.props);
        }

        // Go To Next Objective
        // Issue Rewards Here
        player.emitMeta('job:Objective', undefined);
    }

    finishTargetType(player) {
        const entity = player.job.target.entity;

        if (isFlagged(this.flags, modifiers.DROPOFF_PLAYER)) {
            if (entity) {
                entity.ejectSlowly();
                entity.jobber = undefined;
            }
        }

        if (!isFlagged(this.flags, modifiers.REPAIR_PLAYER)) return;

        if (entity.constructor.name === 'Player') {
            this.finishPayFares(player, entity);
        }

        if (entity.constructor.name === 'Vehicle') {
            this.handleVehicleRepair(player, entity);
        }
    }

    finishPayFares(player, entity) {
        let fare = player.job.target.owner.jobber.fare;
        if (!fare) {
            fare = 0;
        }
        entity.spawn(entity.pos.x, entity.pos.y, entity.pos.z, 0);
        entity.health = 25;
        player.job.target.owner.subCash(fare);
        player.addCash(fare);
        player.job.target.owner.send(`{FF0000}-$${fare}`);
        player.send(`{00FF00}+$${fare}`);
    }

    handleVehicleRepair(player, entity) {
        entity.repair();
        player.job.target.owner.subCash(fare);
        player.addCash(fare);
        player.job.target.owner.send(`{FF0000}-$${fare}`);
        player.send(`{00FF00}+$${fare}`);
    }

    removeItems(player) {
        let allValid = true;
        const removeItemParams = this.removeItem;
        removeItemParams.forEach(item => {
            if (!allValid) return;
            if (!player.hasQuantityOfItem(item.key, item.quantity)) {
                allValid = false;
                player.send(`Missing ${item.quantity}x of ${item.key}`);
                return;
            }
        });

        if (!allValid) {
            return false;
        }

        removeItemParams.forEach(item => {
            player.subItem(item.key, item.quantity);
        });
        return true;
    }

    spawnVehicles(player) {
        if (!this.veh) return;
        let pos = randPosAround(this.veh.pos, 2);
        const vehicle = new alt.Vehicle(
            this.veh.type,
            pos.x,
            pos.y,
            pos.z,
            0,
            0,
            Math.abs(this.veh.rot)
        );

        vehicle.job = {
            player,
            preventHijack: true
        };

        vehicle.engineOn = true;
        const vehicles = [...player.vehicles];
        vehicles.push(vehicle);
        player.vehicles = vehicles;

        if (isFlagged(this.flags, modifiers.NO_DAMAGE_VEHICLE)) {
            player.job.vehicleHealth = vehicle.engineHealth - 100;
        }

        alt.emitClient(player, 'vehicle:SetIntoVehicle', vehicle);
    }

    giveRewards(player) {
        if (this.rewards.length <= 0) return;

        const xpRewards = this.rewards.filter(reward => {
            if (reward && reward.type === 'xp') return reward;
        });

        const itemRewards = this.rewards.filter(reward => {
            if (reward && reward.type === 'item') return reward;
        });

        xpRewards.forEach(reward => {
            this.rewardXP(player, reward.prop, reward.quantity);
        });

        itemRewards.forEach(reward => {
            this.rewardItem(player, reward);
        });
    }

    rewardXP(player, skillName, quantity) {
        addXP(player, skillName, quantity);
    }

    rewardItem(player, reward) {
        if (!Items[reward.prop]) return;
        const baseItem = BaseItems[Items[reward.prop].base];
        if (baseItem.abilities.stack) {
            player.addItem(Items[reward.prop].key, reward.quantity);
            player.send(`${Items[reward.prop].name} was added to your inventory.`);
        } else {
            for (let i = 0; i < reward.quantity; i++) {
                player.addItem(Items[reward.prop].key, 1);
                player.send(`${Items[reward.prop].name} was added to your inventory.`);
            }
        }
    }

    /**
     * Check the objective and see if it's
     * valid.
     * @param player
     * @param args
     */
    checkObjective(player, hash) {
        // Normal range check.
        // Then do a targed range check
        // if the objective type is 4.
        if (!this.normalRangeCheck(player)) return false;
        if (!this.checkIfOnFoot(player)) return false;
        if (!this.checkIfInVehicle(player)) return false;
        if (!this.checkCapture(player)) return false;
        if (!this.checkHold(player)) return false;
        if (!this.checkMash(player)) return false;
        if (!this.checkWait(player)) return false;
        if (!this.checkMinigame(player, hash)) return false;

        // Check the player objective type
        // When the user has a 'target' type.
        if (this.type == objectives.PLAYER) {
            if (player.job.target) {
                return targetPlayer(player, this);
            } else {
                return false;
            }
        }

        return true;
    }

    normalRangeCheck(player) {
        if (this.type <= objectives.ORDER && this.type !== objectives.PLAYER) {
            if (!isInRange(player, this)) return false;
        }
        return true;
    }

    checkIfOnFoot(player) {
        if (isFlagged(this.flags, modifiers.ON_FOOT)) {
            if (player.vehicle) return false;
        }
        return true;
    }

    checkIfInVehicle(player) {
        if (isFlagged(this.flags, modifiers.IN_VEHICLE)) {
            if (!player.vehicle) return false;
            const vehicles = player.vehicles.filter(x => x.job !== undefined);
            let isVehicleUsed = false;
            vehicles.forEach(veh => {
                if (veh === player.vehicle) {
                    isVehicleUsed = true;
                }
            });

            if (!isVehicleUsed) return false;
            if (!this.checkIfVehicleDamaged(player, player.vehicle)) return false;
        }
        return true;
    }

    checkIfVehicleDamaged(player, vehicle) {
        if (isFlagged(this.flags, modifiers.NO_DAMAGE_VEHICLE)) {
            if (vehicle.engineHealth < player.job.vehicleHealth) {
                player.send(`You failed to keep your vehicle in good health.`);
                quitJob(player, false, true);
                return false;
            }
        }
        return true;
    }

    checkCapture(player) {
        if (this.type !== objectives.CAPTURE) return true;
        this.progress += 1;
        if (this.progress < this.maxProgress) {
            playEverySound(player, this);
            return false;
        }
        return true;
    }

    checkHold(player) {
        if (this.type !== objectives.HOLD) return true;
        this.progress += 1;
        if (this.progress < this.maxProgress) {
            playEverySound(player, this);
            return false;
        }
        return true;
    }

    checkMash(player) {
        if (this.type !== objectives.MASH) return true;
        this.progress += 1;
        if (this.progress < this.maxProgress) {
            playEverySound(player, this);
            return false;
        }
        return true;
    }

    checkWait(player) {
        if (this.type !== objectives.WAIT) return true;
        if (this.modifiedWaitTime > Date.now()) return false;
        return true;
    }

    checkMinigame(player, hash) {
        if (this.type !== objectives.MINIGAME) return true;
        if (this.minigamehash !== hash[0]) {
            return false;
        }
        return true;
    }
}

const isInRange = (player, objective) => {
    if (distance(player.pos, objective.pos) >= objective.range) return false;
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
    constructor(player, name, restrictions = 0, namecolor = undefined) {
        if (player.job) {
            quitJob(player);
        }

        this.name = name;
        this.objectives = [];
        this.restrictions = restrictions;
        this.items = [];
        this.levelRestrictions = [];
        this.timelimit = 60000;
        this.enabledTimer = false;
        player.hasDied = false;
        player.job = this;

        if (namecolor) {
            player.setSyncedMeta('namecolor', namecolor);
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

        checkRestrictions(player);
        this.checkLevelRestrictions(player);

        if (!player.job) return;

        this.addUniform(player);
        this.addItems(player);

        this.start = Date.now();
        player.emitMeta('job:Objective', JSON.stringify(this.objectives[0]));
        player.job.available = false;

        if (isFlagged(this.restrictions, restrictions.TIME_LIMIT)) {
            this.end = this.start + this.timelimit;
        }

        if (this.enabledTimer) {
            player.notice('Clock is ticking.. Go Go Go!');
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
        if (!Items[this.uniform]) return;
        if (player.hasItem(Items[this.uniform].key)) return;
        player.addItem(Items[this.uniform].key, 1, Items[this.uniform].props);
        player.send(`${Items[this.uniform].name} was added to your inventory.`);
    }

    /**
     * [{key: 'value', quantity: 1, props:{}, name: 'whatever'}]
     * @param items
     */
    setItems(items) {
        this.items = items;
    }

    addItems(player) {
        if (!this.items) return;

        this.items.forEach(item => {
            if (!Items[item.key]) return;

            const result = player.inventory.find(x => {
                if (x && x.key === item.key) return x;
            });

            if (result) return;
            if (Items[item.key].base.includes('weapon')) {
                player.addItem(
                    item.key,
                    item.quantity,
                    item.props,
                    false,
                    false,
                    item.name
                );
            } else {
                player.addItem(item.key, item.quantity, item.props);
            }
        });
    }

    checkItemRestrictions(player) {
        if (this.items.length <= 0) return true;
        let allValid = true;
        for (let i = 0; i < this.items.length; i++) {
            const valid = player.hasItem(this.items[i].key);

            if (this.items[i].hasItem && !valid) {
                allValid = false;
                player.send('You are restricted from doing this job.');
                player.send(`You don't have {FF0000}${this.items[i].key}{FFFFFF}.`);
                break;
            }

            if (!this.items[i].hasItem && valid) {
                allValid = false;
                player.send('You are restricted from doing this job.');
                player.send(`You already have a {FF0000}${this.items[i].key}{FFFFFF}.`);
                break;
            }
        }
        return allValid;
    }

    checkLevelRestrictions(player) {
        if (!this.arrayOfLevels) return;
        const skills = JSON.parse(player.data.skills);
        let valid = true;
        this.arrayOfLevels.forEach(restriction => {
            if (!valid) return;
            if (!restriction.skill) return;
            if (skills[restriction.skill.toLowerCase()].xp < restriction.xp) {
                valid = false;
                quitJob(player, false, true);
                player.send(
                    `You do not have a high enough ${restriction.skill} for this job.`
                );
                return;
            }
        });
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
     * [{ skill: 'notoriety', xp: '50000' }]
     * @param arrayOfLevels
     */
    setLevelRestrictions(arrayOfLevels) {
        this.arrayOfLevels = arrayOfLevels;
    }

    /**
     * Enables elapsed timer
     * Displays time at completion of job
     */
    setElapsedTimer() {
        this.enabledTimer = true;
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

            if (this.objectives[0].type === objectives.WAIT) {
                if (this.objectives[0].useSectorWaitTime !== -1) {
                    this.objectives[0].modifiedWaitTime =
                        Date.now() +
                        player.sector.seed.getNumber(
                            this.objectives[0].useSectorWaitTime
                        );
                } else {
                    this.objectives[0].modifiedWaitTime =
                        Date.now() + this.objectives[0].waitTime;
                }
            }

            if (this.objectives[0].type === objectives.ORDER) {
                this.objectives[0].word = getWord().split('');
            }

            if (this.objectives[0].infinite) {
                this.clearTarget(player);
            }
        } else {
            this.completeJob(player);
            return;
        }

        player.emitMeta('job:Objective', JSON.stringify(this.objectives[0]));
    }

    /**
     * Completes the current job.
     * @param player
     */
    completeJob(player) {
        player.emitMeta('job:Objective', undefined);
        if (this.enabledTimer) {
            let end = Date.now();
            let elapsed_time = parseFloat((end - this.start) / 1000).toFixed(1);
            player.notice(`Job Completed in ${elapsed_time} Seconds!`);
        } else {
            player.notice('Job Complete!');
        }
        quitJob(player);
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
            this.completeJob(player);
            return;
        }

        player.emitMeta('job:Objective', JSON.stringify(this.objectives[0]));
    }

    /**
     * Check an objective.
     * @param player
     * @param args
     */
    check(player, hash) {
        if (player.checking) return;
        player.checking = true;

        if (!this.objectives[0].attemptObjective(player, hash)) {
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

export function check(player, hash) {
    if (!player.job) return;
    player.job.check(player, hash);
}

export function skipToBeginning(player) {
    if (!player.job) {
        quitJob(player);
        return;
    }

    player.playAudio('error');
    player.job.skipToBeginning(player);
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
        if (player.equipment[11] && player.equipment[11].base === 'weapon') {
            player.send('This job does not allow weapons.');
            quitJob(player, false, true);
            return;
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
    }

    if (playFailSound) {
        player.playAudio('error');
    }

    if (player.job) {
        if (player.job.target && player.job.target.entity.constructor.name === 'Player') {
            player.job.target.entity.jobber = undefined;
            player.job.target.entity.send('The employee quit their job.');
        }
    }

    player.setSyncedMeta('namecolor', null);
    if (player.job) player.job = undefined;
    player.emitMeta('job:ClearObjective', true);
    player.setSyncedMeta('job:Props', undefined);
}

export function copyObjective(original) {
    var copied = Object.assign(Object.create(Object.getPrototypeOf(original)), original);
    return copied;
}
