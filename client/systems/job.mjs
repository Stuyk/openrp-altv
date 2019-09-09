import * as alt from 'alt';
import * as native from 'natives';
import * as utilityVector from 'client/utility/vector.mjs';
import * as utilityMarker from 'client/utility/marker.mjs';

alt.log('Loaded: client->systems->job.mjs');
alt.Player.local.inAnimation = false;

const objectiveTypes = [
    { name: 'point', func: pointType },
    { name: 'capture', func: captureType },
    { name: 'retrieve', func: retrieveType },
    { name: 'dropoff', func: dropOffType },
    { name: 'hack', func: hackType },
    { name: 'spawnvehicle', func: spawnvehicleType },
    { name: 'drivepoint', func: drivepointType },
    { name: 'vehicledrop', func: vehicledropType },
    { name: 'drivecapture', func: drivecaptureType },
    { name: 'target', func: targetType },
    { name: 'targetdrop', func: targetDropType },
    { name: 'targetget', func: targetGetType },
    { name: 'targetrepair', func: targetRepairType }
];

const callbackTypes = [
    { name: 'hack', func: hackCallback },
    { name: 'spawnvehicle', func: spawnvehicleCallback }
];

const jobFunctions = {
    'job:Start': { func: jobStart }, // Start a Job
    'job:Clear': { func: jobClear }, // Clear a Job
    'job:Update': { func: jobUpdate }, // Update the Job Progress
    'job:Progress': { func: jobProgress }, // Progress to Next Job Point
    'job:Callback': { func: jobCallback }, // Used for native callbacks.
    'job:Target': { func: jobTarget }
};

let currentJob;
let currentPointIndex;
let currentPoint;
let currentBlip;
let currentObjective;
let currentProgress = 0;
let currentTarget;
let targetMessage = 'Wait for your task...';
let pause = false;
let cooldown = Date.now() + 2000;
let interval;

let currentInterval;
let isUpdateActive;

alt.on('syncedMetaChange', (entity, key, value) => {
    if (entity !== alt.Player.local) return; // Local Player Only
    // Call the job function for the synced meta change.
    if (jobFunctions[key] !== undefined) {
        jobFunctions[key].func(value);
    }
});

/**
 * Description:
 * The first thing we do to start up
 * the job process.
 */
function jobStart() {
    // Clear Current Job Info
    jobClear();

    // Get Current Job Info
    currentJob = JSON.parse(alt.Player.local.getSyncedMeta('job:Job'));
    currentPointIndex = alt.Player.local.getSyncedMeta('job:PointIndex'); // Always a number.

    // Store Point Info
    currentPoint = currentJob.points[currentPointIndex];
    parseJobInfo(currentPoint);

    // Turn on the Interval
    currentInterval = alt.setInterval(checkPoint, 100);

    // Turn on the Update
    isUpdateActive = true;

    interval = alt.setInterval(drawPointInfo, 0);
}

/**
 * Description:
 * Clear the player's current job.
 */
function jobClear(clearTarget) {
    alt.Player.local.inAnimation = false;

    // Set current job/point info to undefined.
    currentJob = undefined;
    currentPoint = undefined;
    currentPointIndex = undefined;
    currentObjective = undefined;
    targetMessage = '';

    // Destroy Current Blip
    if (currentBlip !== undefined) {
        currentBlip.destroy();
        currentBlip = undefined;
    }

    // Clear Existing Interval
    if (currentInterval !== undefined) {
        alt.clearInterval(currentInterval);
        currentInterval = undefined;
    }

    // Clear Current Update Function
    if (isUpdateActive) {
        alt.clearInterval(interval);
        isUpdateActive = false;
    }

    if (clearTarget) {
        currentTarget = true;
    }
}

/**
 *  Description:
 *  Invoked when there is a new objective.
 *  This is used to work through the objectives
 *  provided in the job configuration.
 *
 *  We pause before updating to prevent any
 *  unwanted behavior.
 */
function jobUpdate() {
    alt.log('Updating job.');

    pause = true;
    currentJob = JSON.parse(alt.Player.local.getSyncedMeta('job:Job'));
    currentPointIndex = alt.Player.local.getSyncedMeta('job:PointIndex');
    currentPoint = currentJob.points[currentPointIndex];

    parseJobInfo(currentPoint);
    alt.Player.local.inAnimation = false;
    pause = false;
}

/**
 * Description:
 * Used to update objective progression.
 * Mostly used for displays and such.
 * @param value
 */
function jobProgress(value) {
    currentProgress = value;
    alt.log(value);
}

/**
 * Description:
 * Used to parse a job callback.
 * @param value
 */
function jobCallback(value) {
    const info = JSON.parse(value);
    const type = callbackTypes.find(x => x.name === info.type);

    if (type === undefined) throw new Error('Failed to parse callback type in jobs.');

    type.func(info.callback);
}

/**
 * Description:
 * Parses the job target information.
 * It sets up properties and targettable data.
 * value = {
 *      player, => Whoever the target is.
 *      props => Whatever the server-side specified.
 * }
 * @param value
 */
function jobTarget(value) {
    currentTarget = value;
}

/**
 *  Description:
 *  Parse the information for the current
 *  point by pulling a function from the
 *  above list.
 *
 *  Also creates blips.
 * @param currentPoint
 */
function parseJobInfo(currentPoint) {
    // Current Objective Function
    currentObjective = objectiveTypes.find(x => x.name === currentPoint.type).func;

    if (currentBlip !== undefined) {
        currentBlip.destroy();
        currentBlip = undefined;
    }

    // Prevent target type from creating.
    if (currentPoint.type === 'target') {
        targetMessage = 'Please wait for your next task...';
        return;
    }

    // Don't do anything for the 'target' type.
    if (currentPoint.type.includes('target')) {
        return;
    }

    // Create Point Blip
    currentBlip = new alt.PointBlip(
        currentPoint.position.x,
        currentPoint.position.y,
        currentPoint.position.z
    );
    currentBlip.shortRange = false;
    currentBlip.sprite = currentPoint.blipSprite;
    currentBlip.color = currentPoint.blipColor;
    currentBlip.name = currentPoint.name;
}

/**
 *  Description:
 *  Checks the current objective if available.
 *  currentObjective is a function that is
 *  updated constantly by some of the above
 *  code. Once that objective is ready;
 *  we do calls to it to check if
 *  the objective is complete for a client.
 */
function checkPoint() {
    if (pause) return;
    if (currentObjective === undefined) return;
    let isTestReady = currentObjective();
    if (!isTestReady) return;
    alt.emitServer('job:TestObjective');
}

/**
 *  Description:
 *  Draws HUD elements for the current objective.
 */
function drawPointInfo() {
    if (pause) return;
    if (currentPoint === undefined) return;

    if (currentProgress >= 0) {
        let prog = currentProgress / currentPoint.progressMax;
        native.drawRect(prog / 2, 1, prog, 0.02, 0, 85, 100, 200);
    }

    // target subtype for drawing
    if (currentPoint.type.includes('target')) {
        if (currentTarget === undefined) {
            native.beginTextCommandDisplayHelp('STRING');
            native.addTextComponentSubstringPlayerName(targetMessage);
            native.endTextCommandDisplayHelp(0, false, true, -1);
            return;
        }

        // Draw Help Text for Target Types
        native.beginTextCommandDisplayHelp('STRING');
        native.addTextComponentSubstringPlayerName(currentPoint.message);
        native.endTextCommandDisplayHelp(0, false, true, -1);

        // Finds the Drop Off Point
        if (currentPoint.type === 'targetdrop') {
            let tPos = currentTarget.props.position;
            if (!currentBlip) {
                currentBlip = new alt.PointBlip(tPos.x, tPos.y, tPos.z);
                currentBlip.sprite = 1;
                currentBlip.color = 1;
                currentBlip.shortRange = false;
            } else {
                currentBlip.position = [tPos.x, tPos.y, tPos.z];
                utilityMarker.drawMarker(
                    0,
                    tPos,
                    new alt.Vector3(0, 0, 0),
                    new alt.Vector3(0, 0, 0),
                    new alt.Vector3(1, 1, 1),
                    255,
                    0,
                    0,
                    150
                );
            }
            return;
        }

        // Draws a marker above Target
        if (currentPoint.type === 'targetget') {
            let tPos = currentTarget.player.pos;
            if (!currentBlip) {
                currentBlip = new alt.PointBlip(tPos.x, tPos.y, tPos.z);
                currentBlip.sprite = 1;
                currentBlip.color = 1;
                currentBlip.shortRange = false;
            } else {
                currentBlip.position = [tPos.x, tPos.y, tPos.z];
                tPos.z += 3;
                utilityMarker.drawMarker(
                    0,
                    tPos,
                    new alt.Vector3(0, 0, 0),
                    new alt.Vector3(0, 0, 0),
                    new alt.Vector3(0.2, 0.2, 0.5),
                    255,
                    0,
                    0,
                    150
                );
            }
            return;
        }

        if (currentPoint.type === 'targethack') {
            let tPos = currentTarget.props.vehicle.pos;
            if (!currentBlip) {
                currentBlip = new alt.PointBlip(tPos.x, tPos.y, tPos.z);
                currentBlip.sprite = 1;
                currentBlip.color = 1;
                currentBlip.shortRange = false;
            } else {
                currentBlip.position = [tPos.x, tPos.y, tPos.z];
                tPos.z += 3;
                utilityMarker.drawMarker(
                    0,
                    tPos,
                    new alt.Vector3(0, 0, 0),
                    new alt.Vector3(0, 0, 0),
                    new alt.Vector3(0.2, 0.2, 0.5),
                    255,
                    0,
                    0,
                    150
                );
            }
            return;
        }
        return;
    }

    let dist = utilityVector.distance(alt.Player.local.pos, currentPoint.position);

    // Draw Marker
    if (dist <= 75) {
        utilityMarker.drawMarker(
            currentPoint.markerType,
            currentPoint.position,
            new alt.Vector3(0, 0, 0),
            new alt.Vector3(0, 0, 0),
            new alt.Vector3(currentPoint.range, currentPoint.range, currentPoint.height),
            currentPoint.markerColor.r,
            currentPoint.markerColor.g,
            currentPoint.markerColor.b,
            currentPoint.markerColor.a
        );
    }

    if (currentPoint.message) {
        native.beginTextCommandDisplayHelp('STRING');
        native.addTextComponentSubstringPlayerName(currentPoint.message);
        native.endTextCommandDisplayHelp(0, false, true, -1);
    }
}

/**
 *  Description: Drive to Point on Foot.
 */
function pointType() {
    if (alt.Player.local.vehicle) return false;
    const dist = utilityVector.distance(alt.Player.local.pos, currentPoint.position);
    if (dist <= currentPoint.range) return true;
    return false;
}

/**
 *  Description: Drive to a point.
 */
function drivepointType() {
    if (!alt.Player.local.vehicle) return false;

    const dist = utilityVector.distance(alt.Player.local.pos, currentPoint.position);
    if (dist <= currentPoint.range) return true;
    return false;
}

/**
 *  Description: Simply spawns a vehicle.
 */
function spawnvehicleType() {
    const dist = utilityVector.distance(alt.Player.local.pos, currentPoint.position);
    if (dist <= currentPoint.range) return true;
    return false;
}

/**
 *  Description: Stand inside of a point for specific progression time.
 */
function captureType() {
    if (alt.Player.local.vehicle) return false;

    if (Date.now() < cooldown) return false;

    cooldown = Date.now() + 2000;

    if (utilityVector.distance(alt.Player.local.pos, currentPoint.position) >= 3)
        return false;
    return true;
}

function drivecaptureType() {
    if (!alt.Player.local.vehicle) return false;

    if (Date.now() < cooldown) return false;

    cooldown = Date.now() + 2000;

    if (utilityVector.distance(alt.Player.local.vehicle.pos, currentPoint.position) >= 3)
        return false;
    return true;
}

/**
 *  Description: Hold 'E' to complete an objective.
 */
function hackType() {
    if (Date.now() < cooldown) return false;

    cooldown = Date.now() + 2000;

    if (!native.isDisabledControlPressed(0, 38)) return false;
    return true;
}

/**
 *  Description: Drop off a vehicle at a position.
 */
function vehicledropType() {
    if (!alt.Player.local.vehicle) return false;

    const dist = utilityVector.distance(alt.Player.local.pos, currentPoint.position);
    if (dist <= currentPoint.range) return true;
    return false;
}

/**
 *  Description: None. Always returns false.
 */
function targetType() {
    return false;
}

function targetGetType() {
    if (currentTarget === undefined) {
        return false;
    }

    const dist = utilityVector.distance(alt.Player.local.pos, currentTarget.player.pos);
    if (dist >= currentPoint.range) {
        return false;
    }
    if (!currentTarget.player.vehicle) {
        return false;
    }

    if (!alt.Player.local.vehicle) {
        return false;
    }

    if (currentTarget.player.vehicle.scriptID !== alt.Player.local.vehicle.scriptID) {
        return false;
    }
    return true;
}

function targetDropType() {
    if (currentTarget === undefined) return false;

    if (!currentTarget.player.vehicle) {
        return false;
    }

    if (!alt.Player.local.vehicle) {
        return false;
    }

    const dist = utilityVector.distance(
        alt.Player.local.pos,
        currentTarget.props.position
    );

    if (dist >= currentPoint.range) {
        return false;
    }

    return true;
}

function targetRepairType() {
    if (currentTarget === undefined) {
        return false;
    }

    if (!native.isDisabledControlPressed(0, 38)) {
        return false;
    }

    if (Date.now() < cooldown) {
        return false;
    }
    cooldown = Date.now() + 2000;

    const dist = utilityVector.distance(
        alt.Player.local.pos,
        currentTarget.props.vehicle.pos
    );
    if (dist >= currentPoint.range) {
        return false;
    }

    return true;
}

// Drops off a retrieved 'object' that is 'stored' on the player.
function dropOffType() {
    //
}

// Retrieves an 'object' and stores it on the player.
function retrieveType() {
    //
}

/**
 *  Description: Calls back up to the server for a 'native' check.
 * @param callbackname
 */
function hackCallback(callbackname) {
    alt.emitServer(callbackname, callbackname, native.isDisabledControlPressed(0, 38));
}
/**
 *  Description: Calls back up to the server for a 'native' get.
 * @param callbackname
 */
function spawnvehicleCallback(callbackname) {
    alt.emitServer(
        callbackname,
        callbackname,
        native.getEntityForwardVector(alt.Player.local.scriptID)
    );
}
