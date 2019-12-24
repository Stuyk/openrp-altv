import * as alt from 'alt';
import { distance } from '../utility/vector';
import { isFlagged } from '../utility/flags';

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
    MAX: 2047
};

class Objective {
    constructor(pos, range, markerType = -1, color = { r: 255, g: 255, b: 255, a: 100 }) {
        this.progress = 0;
        this.maxProgress = 10;
        this.pos = pos;
        this.range = range;
        this.markerType = markerType;
        this.color = color;
        this.checkingObjective = false;
        this.flags = 0;
        this.baseItemRequirements = [];
        this.keyItemRequirements = [];
        this.timeLimit = -1;
        this.vehicleType = undefined;
        this.players = [];
        this.blip = {
            sprite: 1,
            color: 1
        };
        this.description = 'Go to the point.';
        this.objectType = 'hei_prop_heist_box';
        this.objectAlpha = 255;

        if (this.range < 2) {
            this.range = 3;
        }
    }

    /**
     * Must be called before synchronizing the player.
     */
    start() {
        this.startTime = Date.now();
    }

    /**
     *
     * @param {Object} options
     * @param {String} [options.description] Text to display.
     * @param {Number} [options.progress] Current progress.
     * @param {Number} [options.maxProgress] Maximum progress to mark as complete.
     * @param {{x, y, z}} [options.pos] The position to set the objective to.
     * @param {Number} [options.range] The range of the objective. Recommended: 3
     * @param {{r, g, b}} [options.color] The color of the Marker.
     * @param {Number} [options.flags] The objective modifiers to use.
     * @param {{sprite, color, description}} [options.blip] The blip type and color to use.
     * @param {String} [objectType] Object string for an object model.
     * @param {Number} [objectAlpha] The opacity of this object. 0 - 255.
     */
    setOptions(options) {
        Object.keys(options).forEach(key => {
            this[key] = options[key];
        });
    }

    /**
     * Synchronize a player to this objective.
     * Can be shared.
     * @param {*} player
     */
    sync(player) {
        if (!this.hasAllItems(player)) {
            return false;
        }

        if (!this.players.includes(player)) {
            this.players.push(player);
        }

        const data = { ...this };
        delete data.players;

        alt.emitClient(player, 'objective:Info', JSON.stringify(data));
        return true;
    }

    addBlip(sprite, color, description) {
        this.blip = {
            sprite,
            color,
            description
        };
    }

    /**
     * The time in which this objective needs to be complete.
     * @param {*} seconds
     */
    setTimeLimit(seconds) {
        this.timeLimit = seconds * 1000;
    }

    /**
     * Modifiers that change the behavior of this objective.
     * @param {*} flags
     */
    setModifierFlags(flags) {
        this.flags = flags;
    }

    /**
     * Time to wait before the objective can be completed.
     * @param {*} seconds
     */
    setWaitTime(seconds) {
        this.waitTime = seconds * 1000;
    }

    /**
     * @param item { base: 'baseName', quantity: 0} or { key: 'keyName', quantity: 0}
     * @param removeItem Remove the item when objective ends?
     */
    addItemRequirement(item, removeItem = false) {
        if (item.base) {
            item.removeItem = removeItem;
            this.baseItemRequirements.push(item);
        }

        if (item.key) {
            item.removeItem = removeItem;
            this.keyItemRequirements.push(item);
        }
    }

    markAsBeingChecked() {
        this.checkingObjective = true;
    }

    markAsUnchecked() {
        this.checkingObjective = false;
    }

    isPlayerInRange(player) {
        const dist = distance(player.pos, this.pos);
        return dist <= this.range;
    }

    areObjectivePropsValid(player) {
        if (isFlagged(this.flags, ObjectiveFlags.IN_VEHICLE)) {
            if (!player.vehicle) {
                return false;
            }
        }

        if (isFlagged(this.flags, ObjectiveFlags.IS_IN_JOB_VEHICLE)) {
            if (!player.vehicle) {
                return false;
            }

            if (!player.vehicle.isJobVehicle) {
                return false;
            }
        }

        if (isFlagged(this.flags, ObjectiveFlags.ON_FOOT)) {
            if (player.vehicle) {
                return false;
            }
        }

        if (isFlagged(this.flags, ObjectiveFlags.NO_WEAPON)) {
            const equipment = player.equipment[11];
            const isWeapon = equipment && equipment.base.includes('weapon');
            if (isWeapon) {
                return false;
            }
        }

        if (isFlagged(this.flags, ObjectiveFlags.HAS_WEAPON)) {
            const equipment = player.equipment[11];
            const isWeapon = equipment && equipment.base.includes('weapon');
            if (!isWeapon) {
                return false;
            }
        }

        const isCapture = isFlagged(this.flags, ObjectiveFlags.IS_CAPTURE);
        const isTap = isFlagged(this.flags, ObjectiveFlags.TAP_ACTION_KEY);
        const isHold = isFlagged(this.flags, ObjectiveFlags.HOLD_ACTION_KEY);
        const isDestroy = isFlagged(this.flags, ObjectiveFlags.DESTROY);

        if (isCapture || isTap || isHold || isDestroy) {
            if (!this.isProgressExceeded()) {
                return false;
            }
        }

        if (this.isTimeLimitExpired()) {
            // Add quit job function.
            return false;
        }

        if (!this.isWaitTimeExceeded()) {
            return false;
        }

        return true;
    }

    isTimeLimitExpired() {
        if (this.timeLimit === -1) {
            return false;
        }

        if (Date.now() > this.startTime + this.timeLimit) {
            // Kill the job if time limit is past due.
            return true;
        }

        return false;
    }

    isWaitTimeExceeded() {
        if (!this.waitTime) {
            return true;
        }

        if (this.startTime + this.waitTime < Date.now()) {
            return true;
        }

        return false;
    }

    isProgressExceeded() {
        this.progress += 1;
        if (this.progress < this.maxProgress) {
            return false;
        }

        return true;
    }

    hasAllItems(player) {
        const checkBaseItems = this.baseItemRequirements.length >= 1;
        const checkKeyItems = this.keyItemRequirements.length >= 1;

        if (!checkBaseItems && !checkKeyItems) {
            return true;
        }

        if (checkKeyItems) {
            let areKeysValid = true;
            this.keyItemRequirements.forEach(item => {
                if (!player.hasQuantityOfItem(item.key, item.quantity)) {
                    areKeysValid = false;
                }
            });

            if (!areKeysValid) {
                return false;
            }
        }

        if (checkBaseItems) {
            let areBasesValid = true;
            this.keyItemRequirements.forEach(item => {
                if (!player.hasQuantityOfItem(item.base, item.quantity)) {
                    areBasesValid = false;
                }
            });

            if (!areBasesValid) {
                return false;
            }
        }

        return true;
    }

    finishObjective() {
        this.progress = 0;

        if (this.vehicleType) {
            const vehicle = new alt.Vehicle(
                this.vehicleType,
                this.pos.x,
                this.pos.z,
                this.pos.z,
                0,
                0,
                this.heading
            );

            vehicle.isJobVehicle = true;
            this.players.forEach(player => {
                player.vehicles.push(vehicle);
            });
        }
    }
}

class Point extends Objective {
    constructor(pos, range, markerType, color) {
        super(pos, range, markerType, color);
    }

    check(player) {
        if (this.checkingObjective) {
            return false;
        }

        this.markAsBeingChecked();

        if (!this.isPlayerInRange(player)) {
            this.markAsUnchecked();
            return false;
        }

        if (!this.areObjectivePropsValid(player)) {
            this.markAsUnchecked();
            return false;
        }

        this.markAsUnchecked();
        this.finishObjective();
        return true;
    }
}

class AddVehicle extends Objective {
    constructor(pos, range, markerType, color, vehicleType = 'blista', heading = 0) {
        super(pos, range, markerType, color);
        this.vehicleType = vehicleType;
        this.heading = heading;
    }

    check(player) {
        if (this.checkingObjective) {
            return false;
        }

        if (!this.isPlayerInRange(player)) {
            this.markAsUnchecked();
            return false;
        }

        this.markAsUnchecked();
        this.finishObjective();
        return true;
    }
}

class RemoveVehicle extends Objective {
    constructor(pos, range, markerType, color) {
        super(pos, range, markerType, color);
        this.flags = ObjectiveFlags.IS_IN_JOB_VEHICLE;
    }

    check(player) {
        if (this.checkingObjective) {
            return false;
        }

        if (!this.isPlayerInRange(player)) {
            this.markAsUnchecked();
            return false;
        }

        if (!this.areObjectivePropsValid(player)) {
            this.markAsUnchecked();
            return false;
        }

        this.markAsUnchecked();
        this.finishObjective();
        return true;
    }
}

class DestroyObject extends Objective {
    constructor(pos, range, markerType, color) {
        super(pos, range, markerType, color);
        this.objectType = 'hei_prop_heist_box';
        this.flags =
            ObjectiveFlags.HAS_WEAPON | ObjectiveFlags.ON_FOOT | ObjectiveFlags.DESTROY;
    }

    check(player) {
        if (this.checkingObjective) {
            return false;
        }

        if (!this.isPlayerInRange(player)) {
            this.markAsUnchecked();
            return false;
        }

        if (!this.areObjectivePropsValid(player)) {
            this.markAsUnchecked();
            return false;
        }

        this.markAsUnchecked();
        this.finishObjective();
        return true;
    }
}

export const Objectives = {
    Point,
    AddVehicle,
    RemoveVehicle,
    DestroyObject
};

export class Job {
    /**
     *
     * @param {*} player
     * @param {[Objective]} objectives
     */
    constructor(player, objectives = []) {
        this.objectives = objectives;
        this.party = [player];
        this.freeze = false;
        player.job = this;
    }

    /**
     * @param {Objective} objective Any extended objective type.
     */
    addObjective(objective) {
        this.objectives.push(objective);
    }

    /**
     * Add a player to the job party.
     * @param {} player
     */
    addPlayer(player) {
        if (this.started) {
            return false;
        }

        if (this.party.includes(player)) {
            return false;
        }

        this.party.push(player);
        player.job = this;
    }

    /**
     * Remove a player from the job party.
     * @param {*} player
     */
    removePlayer(player) {
        if (!this.party.includes(player)) {
            return false;
        }

        const index = this.party.findIndex(p => p === player);
        if (index <= -1) {
            return false;
        }

        this.party.splice(index, 1);
        this.removeJobVehicles(player, false);
        return true;
    }

    /**
     * Start the job.
     */
    start() {
        this.startTime = Date.now();
        this.nextObjective();
    }

    fail() {
        players.forEach(player => {
            player.send('{FF0000}Failed to complete objective.');
            player.job = undefined;
            this.removeJobVehicles(player, true);
        });
    }

    removeJobVehicles(player, destroy = false) {
        for (let i = player.vehicles.length; i > 0; i--) {
            const vehicle = player.vehicles[i];
            if (!vehicle) {
                player.vehicles.splice(i, 1);
                continue;
            }

            if (!vehicle.isJobVehicle) {
                continue;
            }

            if (destroy) {
                vehicle.destroy();
            }
            player.vehicles.splice(i, 1);
        }
    }

    nextObjective() {
        this.freeze = true;
        if (!this.started) {
            this.started = true;
        } else {
            this.objectives.shift();
        }

        const objective = this.objectives[0];
        if (!objective) {
            this.party.forEach(player => {
                player.send('The job has been complete.');
                player.job = undefined;
                player.playAudio('complete');
                alt.emitClient(player, 'objective:Info', null);
                this.removeJobVehicles(player, true);
            });
            return;
        }

        objective.start();
        this.party.forEach(player => {
            player.playAudio('complete');
            objective.sync(player);
        });

        this.freeze = false;
    }

    addJobVehicle(player, vehicleType, pos, heading) {
        const vehicle = new alt.Vehicle(vehicleType, pos.x, pos.y, pos.z, 0, 0, heading);
        vehicle.isJobVehicle = true;
        vehicle.noSave = true;
        vehicle.setSyncedMeta('isJobVehicle', true);
        this.party.forEach(partyMember => {
            partyMember.vehicles.push(vehicle);
        });

        alt.emitClient(player, 'objective:SetIntoVehicle', vehicle);
    }

    checkObjective(player) {
        if (this.freeze) {
            return;
        }

        const objective = this.objectives[0];
        if (!objective.check(player)) {
            this.party.forEach(partyMember => {
                objective.sync(partyMember);
            });
            return;
        }

        if (objective.constructor.name === 'AddVehicle') {
            this.addJobVehicle(
                player,
                objective.vehicleType,
                objective.pos,
                objective.heading
            );
        }

        if (objective.constructor.name === 'RemoveVehicle') {
            this.party.forEach(partyMember => {
                this.removeJobVehicles(partyMember, true);
            });
        }

        this.nextObjective();
    }
}

// Official
alt.onClient('objective:Died', objectiveDied);

// Unconfirmed
alt.onClient('objective:Test', objectiveTest);
alt.onClient('job:AddPlayer', addPlayer);

/**
 *
 * @param {*} player
 * @param {Job} job
 */
function objectiveTest(player, job = null) {
    if (!player) {
        return;
    }

    if (!player.job) {
        return;
    }

    job = player.job;
    job.checkObjective(player);
}

/**
 *
 * @param {alt.Player} player
 * @param {*} data
 * @param {Job} job
 */
function addPlayer(player, data, job = null) {
    const target = data.player;

    if (!player) {
        return;
    }

    if (!player.job) {
        return;
    }

    job = player.job;
    job.addPlayer(target);
}

/**
 *
 * @param {*} player
 * @param {Job} job
 */
function objectiveDied(player, job = null) {
    if (!player.job) {
        return;
    }

    job = player.job;
    job.fail();
}
