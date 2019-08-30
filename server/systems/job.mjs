import * as alt from 'alt';
import * as configurationJob from '../configuration/job.mjs';
import * as utilityVector from '../utility/vector.mjs';
import { Interaction } from '../systems/interaction.mjs';

const jobs = configurationJob.Configuration;

jobs.forEach((job, index) => {
    //position, type, serverEventName, radius, height, message, indexValue)
    let interact = new Interaction(
        job.start,
        'job',
        'job:StartJob',
        3,
        2,
        job.name,
        index
    );
    interact.addBlip(job.blipSprite, job.blipColor, job.name);
});

/* The way these jobs work....
 1. Load the Jobs from the Configuration.
 2. Create Interaction points for each job.
 3. Player visits the interaction point; and presses E to start the job.
 4. Once the job is started...
 5. Synchronize the Job Data with the player on client-side.
 6. Show the markers for the points.
 7. JobPoint is the current index of the target point in points in the configuration.
 8. Player visits the point; it has a TYPE.
 9. Depending on the TYPE it will invoke various functions on the server.
 10. These functions are also checked on client-side first.
 11. After visiting all points in the list; the job is considered complete.
 12. Rewards are distributed on an per-objective basis.
 13. Cleanup job after finishing. 
 */

const objectiveTypes = [
    // On Foot Point
    { name: 'point', func: pointType },
    // Capture Point on Foot
    { name: 'capture', func: captureType },
    // Retrieve Item on Foot Type
    { name: 'retreive', func: retrieveType },
    // Drop Off Item on Foot Type
    { name: 'dropoff', func: dropOffType },
    // Hold 'E' to do something.
    { name: 'hack', func: hackType },
    // Drive to a point.
    { name: 'drivepoint', func: drivepointType },
    // Spawn a job Vehicle.
    { name: 'spawnvehicle', func: spawnVehicleType },
    // Drop off a Vehicle.
    { name: 'vehicledrop', func: vehicleDropType }
];

alt.on('job:StartJob', (player, index) => {
    if (index === undefined) return;
    if (player.job !== undefined) clearJob(player);

    // Finds the job we're attempting to start.
    let currentJob = jobs[index];
    if (!player.job) player.job = {};

    // Setup the job information for server-side.
    player.job.currentJob = currentJob;
    player.job.currentPointIndex = 0;
    player.job.currentPoint = currentJob.points[0];
    player.send('Starting job.');

    // Sync the meta.
    syncMeta(player, 0, true);
});

function syncMeta(player, index, isStart) {
    // Set Synced Meta
    player.setSyncedMeta('job:Job', JSON.stringify(player.job.currentJob));
    player.setSyncedMeta('job:PointIndex', index);
    player.setSyncedMeta('job:Progress', -1);
    player.job.progress = -1;
    player.job.cooldown = Date.now();

    if (isStart) {
        // New Job
        player.setSyncedMeta('job:Start', Date.now());
    } else {
        // Existing Job
        player.setSyncedMeta('job:Update', Date.now());
    }
}

// Used to cleanup / clear the current job the player is doing.
export function clearJob(player) {
    // Destroy any current vehicles.
    if (player.job.currentVehicle !== undefined && player.job.currentVehicle !== null) {
        player.job.currentVehicle.destroy();
    }

    player.setSyncedMeta('job:Job', undefined);
    player.setSyncedMeta('job:PointIndex', undefined);
    player.setSyncedMeta('job:Clear', Date.now());
    player.job = {};
}

// Verify an Objective is Complete
export function testObjective(player) {
    // No Job Found; why are you testing?
    if (player.job === undefined) return;
    if (player.job.currentJob === undefined) return;
    if (player.job.testing) return;

    // Prevent testing multiple times.
    player.job.testing = true;

    // Distance check first
    const dist = utilityVector.distance(player.pos, player.job.currentPoint.position);

    // Incorrect distance for the user.
    if (dist > player.job.currentPoint.range) {
        player.job.testing = false;
        return;
    }

    // Check if the objective type exists.
    let objective = objectiveTypes.find(x => x.name === player.job.currentPoint.type);

    // Bad Objective
    if (objective === undefined) {
        player.job.testing = false;
        return;
    }

    // Pass the player and distance to objective.
    // Will process the rest in a bit.
    objective.func(player, dist, player.job.currentPoint, completed => {
        if (!completed) {
            player.job.testing = false;
            return;
        }

        // Add reward before increment.
        if (player.job.currentPoint.reward > 0) {
            player.addCash(player.job.currentPoint.reward);
        }

        // Objective was successful; move to next.
        player.job.currentPointIndex += 1;

        // Update current point.
        const index = player.job.currentPointIndex;
        player.job.currentPoint = player.job.currentJob.points[index];

        // The job is complete.
        if (player.job.currentPoint === undefined) {
            player.send('Job is complete.');
            clearJob(player);
            return;
        }

        // The job is still going...
        syncMeta(player, index, false);
        player.job.testing = false;
        player.send('Proceed to next objective.');
        return;
    });
}

// Requires the user to be on foot.
function pointType(player, dist, obj, callback) {
    // Startup the async process.
    if (dist > obj.range) {
        return callback(false);
    }
    return callback(true);
}

// Requires the user to have a job vehicle.
function drivepointType(player, dist, obj, callback) {
    if (player.vehicle !== player.job.currentVehicle) callback(false);

    if (dist > obj.range) {
        return callback(false);
    }
    return callback(true);
}

function captureType(player, dist, obj, callback) {
    // Startup the async process.
    if (dist > obj.range) return callback(false);

    if (Date.now() < player.job.cooldown) return callback(false);

    player.job.cooldown = Date.now() + 2000;

    player.job.progress += 1;
    player.setSyncedMeta('job:Progress', player.job.progress);

    if (player.job.progress > obj.progressMax) {
        return callback(true);
    }

    return callback(false);
}

function hackType(player, dist, obj, callback) {
    // Setup Callback from Client
    let callbackname = `${player.name}:${obj.type}`;
    alt.onClient(callbackname, callbackHack);

    // Setup Promise
    player.job.def = defer();

    // Send Callback
    player.setSyncedMeta(
        'job:Callback',
        JSON.stringify({ type: obj.type, callback: callbackname })
    );

    player.job.def.promise
        .then(() => {
            callback(true);
        })
        .catch(() => {
            callback(false);
        });
}

function spawnVehicleType(player, dist, obj, callback) {
    if (dist > obj.range) return callback(false);

    // Set the Car Type to Spawn
    if (obj.vehicle === undefined) {
        throw new Error('Vehicle is not defined for this objective.');
    }

    // Spawn Job Vehicle
    player.job.vehicle = obj.vehicle;

    // Setup Callback
    let callbackname = `${player.name}:${obj.type}`;
    alt.onClient(callbackname, callbackSpawnVehicle);

    // Setup Promise
    player.job.def = defer();

    // Send Callback
    player.setSyncedMeta(
        'job:Callback',
        JSON.stringify({ type: obj.type, callback: callbackname })
    );

    player.job.def.promise
        .then(() => {
            callback(true);
        })
        .catch(() => {
            callback(false);
        });
}

function retrieveType(player, dist, obj) {
    return new Promise((resolve, reject) => {
        // Startup the async process.
    });
}

function dropOffType(player, dist, obj) {
    return new Promise((resolve, reject) => {
        // Startup the async process.
    });
}

function vehicleDropType(player, dist, obj, callback) {
    if (dist > obj.range) return callback(false);

    if (player.job.currentVehicle !== player.vehicle) callback(false);

    player.ejectSlowly();
    setTimeout(() => {
        if (player === null || player === undefined) return;

        player.job.currentVehicle.destroy();
        player.job.currentVehicle = undefined;
    }, 2500);

    callback(true);
}

function defer() {
    var deferred = {
        promise: null,
        resolve: null,
        reject: null
    };

    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });

    return deferred;
}

function callbackHack(player, callbackname, value) {
    alt.offClient(callbackname, callbackHack);

    if (player.job.progress === undefined) player.job.progress = -1;

    // Cooldown
    if (player.job.cooldown) {
        if (Date.now() < player.job.cooldown) {
            return player.job.def.reject();
        } else {
            player.job.cooldown = Date.now() + 2000;
        }
    }

    if (!player.job.cooldown) player.job.cooldown = Date.now() + 2000;

    if (value) {
        player.job.progress += 1;
        player.setSyncedMeta('job:Progress', player.job.progress);

        if (player.job.progress > player.job.currentPoint.progressMax) {
            return player.job.def.resolve();
        }
    }

    player.job.def.reject();
}

function callbackSpawnVehicle(player, callbackname, value) {
    alt.offClient(callbackname, callbackSpawnVehicle);

    // Spawn the vehicle here.
    /*
        vehicle: {
            model: 'cheetah',
            lockState: 1, // 1 for unlocked. 2 for locked.
            preventHijack: true
        },
    */
    let forwardPos = {
        x: player.pos.x + value.x * 3,
        y: player.pos.y + value.y * 3,
        z: player.pos.z
    };

    player.job.currentVehicle = new alt.Vehicle(
        player.job.vehicle.model,
        forwardPos.x,
        forwardPos.y,
        forwardPos.z,
        0,
        0,
        0
    );

    player.job.currentVehicle.setSyncedMeta('job:Owner', player.data.name);
    player.job.currentVehicle.lockState = player.job.vehicle.lockState;

    if (player.job.vehicle.preventHijack) {
        player.job.currentVehicle.preventHijack = true;
    }

    player.job.def.resolve();
}
