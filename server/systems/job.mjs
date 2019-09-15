import * as alt from 'alt';
import * as configurationJob from '../configuration/job.mjs';
import * as utilityVector from '../utility/vector.mjs';
import { Interaction } from '../systems/interaction.mjs';
import * as configurationItems from '../configuration/items.mjs';
import { addXP } from '../systems/skills.mjs';

export function load(jobs) {
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
}

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
    // Drive and Capture a Point
    { name: 'drivecapture', func: driveCaptureType },
    // Spawn a job Vehicle.
    { name: 'spawnvehicle', func: spawnVehicleType },
    // Drop off a Vehicle.
    { name: 'vehicledrop', func: vehicleDropType },
    // Get a player's target type.
    // Invoked through a callback.
    { name: 'target', func: targetType },
    // Pickup a target.
    { name: 'targetget', func: targetGetType },
    // Dropoff a target.
    { name: 'targetdrop', func: targetDropType },
    // Hack a Target
    { name: 'targetrepair', func: targetRepairType }
];

/**
 * Called when a user wants to start a job.
 */
alt.on('job:StartJob', (player, index) => {
    if (index === undefined) return;
    if (player.job !== undefined) clearJob(player);

    // Finds the job we're attempting to start.
    let currentJob = jobs[index];
    if (!player.job) player.job = {};

    // Has item requirements / or no items specifically.
    if (currentJob.required !== undefined) {
        let passed = true;
        let failedItems = [];

        currentJob.required.forEach(item => {
            let isIn = item.inInventory;

            if (isIn) {
                if (!player.hasItem(item.name)) {
                    passed = false;
                    failedItems.push(item);
                }
            } else {
                if (player.hasItem(item.name)) {
                    passed = false;
                    failedItems.push(item);
                }
            }
        });

        if (!passed) {
            player.send(`The following is stopping you from doing this job.`);
            failedItems.forEach(item => {
                if (item.inInventory) {
                    player.send(`Should have: ${item.name}`);
                } else {
                    player.send(`Should not have: ${item.name}`);
                }
            });
            return;
        }
    }

    // Setup the job information for server-side.
    player.job.guid = currentJob.guid;
    player.job.currentJob = currentJob;
    player.job.currentPointIndex = 0;
    player.job.currentPoint = currentJob.points[0];
    player.send('Starting job.');

    // Sync the meta.
    syncMeta(player, 0, true);
});

/**
 *  Description:
 *  Called when a new objective must be synced.
 *  Passes the index for PointIndex
 *  Resets progress for individual objectives.
 *  Resets cooldowns
 *  Starts it as a new job if isNewJob is flagged.
 * @param player
 * @param index
 * @param isNewJob
 */
function syncMeta(player, index, isNewJob) {
    // Set Synced Meta
    player.emitMeta('job:Job', JSON.stringify(player.job.currentJob));
    player.emitMeta('job:PointIndex', index);
    player.emitMeta('job:Progress', -1);
    player.job.progress = -1;
    player.job.cooldown = Date.now();

    if (isNewJob) {
        player.emitMeta('job:Start', Date.now());
        return;
    }

    player.emitMeta('job:Update', Date.now());
}

// Used to cleanup / clear the current job the player is doing.
export function clearJob(player) {
    // Destroy any current vehicles.
    if (player.job !== undefined) {
        clearTimeout(player.job.timeout);
        const currentVeh = player.job.currentVehicle;

        if (player.vehicles) {
            let index = player.vehicles.findIndex(x => x === currentVeh);
            if (index !== -1) {
                player.vehicles.splice(index, 1);
            }
        }

        // Clear current vehicle.

        if (currentVeh !== undefined && currentVeh !== null) {
            currentVeh.destroy();
        }
    }

    player.emitMeta('job:Job', undefined);
    player.emitMeta('job:PointIndex', undefined);
    player.emitMeta('job:Clear', true);
    player.job = {};
}

export function getClosestDriverByGuid(player, guid) {
    let closestDriver;
    let lastDistance;

    // Get closest taxi driver.
    alt.Player.all.forEach(p => {
        if (p.job === undefined) return;
        if (p.job.guid !== guid) return;

        // This is checking if they're awaiting a ped.
        if (!p.job.isAvailable) return;

        const jobDistance = utilityVector.distance(player.pos, p.pos);

        if (closestDriver === undefined) {
            closestDriver = p;
            lastDistance = jobDistance;
            return;
        }

        // Get closest driver each time.
        if (jobDistance < lastDistance) {
            closestDriver = p;
            lastDistance = jobDistance;
        }
    });

    return closestDriver;
}

/**
 *  Description:
 *  Verifying an objective can be a long process.
 *  This is used to determine if the user is not full of shit.
 *
 *  1. Check if they're not testing already.
 *  2. Find the objective type to call.
 *  3. Call the objective type.
 *  4. Objective type verifies if parameters are met.
 *  5. If objective is complete...
 *  6. Go to the next objective.
 *
 * @param player
 */
export function testObjective(player) {
    // No Job Found; why are you testing?
    if (player.job === undefined) return;
    if (player.job.currentJob === undefined) return;
    if (player.job.testing) return;

    // Prevent testing multiple times.
    player.job.testing = true;

    // Check if the objective exists.
    let objective = objectiveTypes.find(x => x.name === player.job.currentPoint.type);

    // If the objective is bad.
    // Clear the player's job if it is and throw.
    if (objective === undefined) {
        player.job.testing = false;
        clearJob(player);
        console.error(`!!! -> Bad Objective Type`);
        return;
    }

    // Pass the player to objective...
    // isComplete is a callback.
    objective.func(player, isComplete => {
        if (!isComplete) {
            player.job.testing = false;
            return;
        }

        goToNext(player);
    });
}

/**
 * Description:
 * Goes to the next objective but also handles...
 * infinite and target types.
 *
 * Infinite means that any objective after an
 * infinite type means it will continue on forever
 * from that specific point.
 *
 * This allows for ENDLESS jobs.
 *
 * Target means that any objective that is of the
 * target type that it comes across will automatically
 * setup a callback that can be invoked by other
 * players requesting service for a specific type
 * of job.
 *
 * Once that service is invoked; the job will continue
 * like normal but will more than likely use target
 * sub types that assist with telling the user where
 * to go with their new friend.
 * @param player
 */
export function goToNext(player, goToInfinite) {
    // Add reward before incrementing to next objective.
    if (player.job.currentPoint.reward >= 1) {
        player.addCash(player.job.currentPoint.reward);
        player.send(`{00FF00}+$${player.job.currentPoint.reward}`);
    }

    // Increment the index.
    let index = player.job.currentPointIndex + 1;
    let nextPoint = player.job.currentJob.points[index];

    // If it's the end of the job and infinite is turned
    // on we need to reset the objective to the beginning.
    if (nextPoint === undefined && player.job.infinite) {
        index = player.job.infiniteIndex;
        nextPoint = player.job.currentJob.points[index];
        player.job.isAvailable = true;
    }

    // Forces the objective to the inifnite start state.
    if (goToInfinite) {
        index = player.job.infiniteIndex;
        nextPoint = player.job.currentJob.points[index];
        player.job.isAvailable = true;
    }

    if (nextPoint.type === 'rewarditem') {
        Object.keys(configurationItems.Items).forEach(key => {
            if (configurationItems.Items[key].label !== nextPoint.item) return;
            let itemTemplate = configurationItems.Items[key];
            player.addItem({ ...itemTemplate }, nextPoint.quantity, true);
            player.send(`You recieved: ${itemTemplate.label}`);
        });

        index += 1;
        nextPoint = player.job.currentJob.points[index];
    }

    if (nextPoint.type === 'rewardxp') {
        addXP(player, nextPoint.skill, nextPoint.quantity);
        player.send(
            `You recieved ${nextPoint.quantity}XP for the ${nextPoint.skill} skill.`
        );

        index += 1;
        nextPoint = player.job.currentJob.points[index];
    }

    // Finish Job if undefined point.
    if (nextPoint === undefined && !player.job.infinite) {
        player.send('You have finished your job.');
        try {
            clearJob(player);
        } catch (err) {
            console.log(err);
        }
        return;
    }

    // Setup infinite jobbing if called for.
    // infiniteIndex is used to go back to the start of
    // where we should begin infinite jobbing.
    if (nextPoint.type === 'infinite') {
        index += 1;
        nextPoint = player.job.currentJob.points[index];
        player.job.infinite = true;
        player.job.infiniteIndex = index;
    }

    // Setup player data for next point.
    player.job.currentPoint = nextPoint;
    player.job.currentPointIndex = index;

    // Special parameter for the 'target' type.
    // Directly invoke this objective to setup
    // a callback for player interception.
    if (nextPoint.type === 'target') {
        let objective = objectiveTypes.find(x => x.name === 'target');
        objective.func(player, isComplete => {
            if (!isComplete) {
                player.job.testing = false;
                return;
            }

            goToNext(player);
        });

        // Sync objective data.
        syncMeta(player, index, false);
        return;
    }

    // Sync objective data.
    syncMeta(player, index, false);
    player.job.testing = false;
    return;
}

export function isTarget(player, vehicle) {
    if (vehicle.job === undefined) return false;
    const jobber = vehicle.job;

    if (jobber.job.target === undefined) return false;

    if (jobber.job.target.player !== player) return false;

    return true;
}

/**
 *  Description:
 *  Charge the player for hopping out early.
 * @param player
 */
export function exitFee(player, jobber) {
    const dist = utilityVector.distance(player.pos, player.jobStartPosition);
    const fare = dist * 0.03;

    if (player.isJobTarget === undefined) {
        return;
    }

    player.subCash(fare);
    jobber.addCash(fare);

    // Reset User
    player.isJobTarget = undefined;

    jobber.send('Your customer left the taxi; he was charged accordingly.');
    player.send('You left your cab early; you were charged accordingly.');

    // Force jobber into ready state again.
    goToNext(jobber, true);
}

export function cancelTarget(player) {
    const players = alt.Player.all;
    let jobber;

    for (let t in players) {
        if (players[t].job === undefined) {
            continue;
        }

        if (players[t].job.target === undefined) {
            continue;
        }

        if (players[t].job.target.player !== player) {
            continue;
        }

        jobber = players[t];
        break;
    }

    if (jobber === undefined) return;

    if (player.vehicle === jobber.vehicle) {
        player.send('You must exit the vehicle to cancel.');
        return;
    }

    jobber.send('The customer cancelled.');
    goToNext(jobber, true);
}

export function cancelJob(jobber) {
    if (jobber.job === undefined) {
        return;
    }

    if (jobber.job.target === undefined) {
        clearJob(jobber);
        return;
    }

    if (jobber.job.target.player === undefined) {
        clearJob(jobber);
        return;
    }

    jobber.job.target.player.isJobTarget = undefined;
    jobber.job.target.player.send(
        'The employee quit their job. Your request was not fulfilled.'
    );
    clearJob(jobber);
}

/**
 * Description:
 * The 'point' type is used when the user has to
 * go to a location on foot.
 * @param player
 * @param callback
 */
function pointType(player, callback) {
    const dist = utilityVector.distance(player.pos, player.job.currentPoint.position);
    if (player.vehicle) return callback(false);
    if (dist > player.job.currentPoint.range) {
        return callback(false);
    }
    return callback(true);
}

/**
 * Description:
 * The 'target' type is controlled by external
 * cases. ie. When a user requests a taxi.
 * However, target is the only TYPE that is
 * processed DIRECTLY after an objective is complete.
 *
 * This is because it needs to setup a callback immediately.
 *
 * You can use a 'guid' in the job type.
 * To help filter out players from the all
 * list that are currently working a job.
 *
 * Doing this allows you to easily invoke
 * a 'jobber.job.processTarget(requester, props)'.
 *
 * This will push their job forward and help
 * the requester move forward with their
 * needs.
 *
 * It's complex but the Taxi job
 * is meant to be an example of how to use
 * this very specific type.
 *
 * @param player
 * @param callback
 */
function targetType(player, callback) {
    player.job.isAvailable = true;
    player.job.processTarget = (target, props) => {
        player.job.isAvailable = false;
        player.job.processTarget === undefined;
        player.job.target = {
            player: target,
            props
        };
        player.emitMeta('job:Target', player.job.target);
        return callback(true);
    };
    return callback(false);
}

/**
 * Description:
 * Requires 'target' type before usage.
 * Drop off a target at a specific location.
 * @param player
 * @param callback
 */
function targetDropType(player, callback) {
    const target = player.job.target;

    if (target.props.position === undefined) {
        console.error('!!! => position was not given to target type in jobs.');
        return callback(false);
    }

    const dist = utilityVector.distance(target.props.position, player.pos);

    if (dist > player.job.currentPoint.range) {
        return callback(false);
    }

    if (player.vehicle !== target.player.vehicle) {
        return callback(false);
    }

    if (player.job.currentVehicle !== player.vehicle) {
        return callback(false);
    }

    // Eject the target out of the car.
    target.player.isJobTarget = undefined;
    target.player.send('{00FF00}You have arrived at your destination.');

    // PAY THE MAN JANICE
    if (player.job.currentPoint.fare) {
        target.player.subCash(target.props.fare);
        player.addCash(target.props.fare);
        player.send(`{00FF00}+$${target.props.fare}`);
    }

    target.player.ejectSlowly();
    return callback(true);
}

/**
 * Description:
 * Requires 'target' type before usage.
 * Pick up a target at their location.
 * @param player
 * @param callback
 */
function targetGetType(player, callback) {
    const target = player.job.target;
    if (player.vehicle !== target.player.vehicle) {
        return callback(false);
    }

    if (player.job.currentVehicle !== player.vehicle) {
        return callback(false);
    }

    return callback(true);
}

/**
 * Description:
 * The 'drivepoint' types requires the user to...
 * drive to a specific point on the map.
 * @param player
 * @param callback
 */
function drivepointType(player, callback) {
    if (player.vehicle !== player.job.currentVehicle) callback(false);

    const dist = utilityVector.distance(player.pos, player.job.currentPoint.position);
    if (dist > player.job.currentPoint.range) {
        return callback(false);
    }
    return callback(true);
}

/**
 * Description:
 * The 'capture' type requires the user to stand...
 * inside a specific region. The progress slowly
 * fills up over time.
 * @param player
 * @param callback
 */
function captureType(player, callback) {
    const dist = utilityVector.distance(player.pos, player.job.currentPoint.position);
    if (dist > player.job.currentPoint.range) {
        return callback(false);
    }

    // Check Cooldown
    if (Date.now() < player.job.cooldown) {
        return callback(false);
    }

    if (player.vehicle) {
        return callback(false);
    }

    // Set Cooldown
    player.job.cooldown = Date.now() + 1000;
    playJobAnimation(player);

    // Add job progression.
    player.job.progress += 1;
    player.emitMeta('job:Progress', player.job.progress);

    // Check if the job progression meets the current...
    // points 'progressMax' value.
    if (player.job.progress >= player.job.currentPoint.progressMax) {
        return callback(true);
    }

    // Otherwise; wait for more progression.
    return callback(false);
}

/**
 * Description:
 * The 'drivecapture' type requires the user to drive...
 * and stay parked in a specific area.
 * fills up over time.
 * @param player
 * @param callback
 */
function driveCaptureType(player, callback) {
    const dist = utilityVector.distance(player.pos, player.job.currentPoint.position);
    if (dist > player.job.currentPoint.range) {
        return callback(false);
    }

    // Check Cooldown
    if (Date.now() < player.job.cooldown) {
        return callback(false);
    }

    if (!player.vehicle) {
        return callback(false);
    }

    // Set Cooldown
    player.job.cooldown = Date.now() + 1000;
    playJobAnimation(player);

    // Add job progression.
    player.job.progress += 1;
    player.emitMeta('job:Progress', player.job.progress);

    // Check if the job progression meets the current...
    // points 'progressMax' value.
    if (player.job.progress >= player.job.currentPoint.progressMax) {
        return callback(true);
    }

    // Otherwise; wait for more progression.
    return callback(false);
}

/**
 * Description:
 * The 'hack' type forces users to hold down a key.
 * It checks if they are holding the key each time.
 * @param player
 * @param callback
 */
function hackType(player, callback) {
    const dist = utilityVector.distance(player.pos, player.job.currentPoint.position);
    if (dist > player.job.currentPoint.range) {
        return callback(false);
    }

    // Setup Event Handling for Client Callback
    let callbackname = `${player.name}:${player.job.currentPoint.type}`;
    alt.onClient(callbackname, callbackHack);

    // Setup a callback to invoke.
    player.job.callback = callback;

    // Send Callback
    player.emitMeta(
        'job:Callback',
        JSON.stringify({ type: player.job.currentPoint.type, callback: callbackname })
    );
}

/**
 * Description:
 * The 'spawnvehicle' type is used to spawn a vehicle.
 * It makes a request to client-side for a forward vector...
 * so that users don't get crushed.
 * @param player
 * @param callback
 */
function spawnVehicleType(player, callback) {
    const dist = utilityVector.distance(player.pos, player.job.currentPoint.position);
    if (dist > player.job.currentPoint.range) return callback(false);

    // Set the Car Type to Spawn
    if (player.job.currentPoint.vehicle === undefined) {
        throw new Error('Vehicle is not defined for this objective.');
    }

    // Setup the data used to spawn a vehicle...
    // if the callback is successful.
    player.job.vehicle = player.job.currentPoint.vehicle;

    // Setup Event Handling for Client Callback
    let callbackname = `${player.name}:${player.job.currentPoint.type}`;
    alt.onClient(callbackname, callbackSpawnVehicle);

    // Setup a callback to invoke.
    player.job.callback = callback;

    // Send Callback
    player.emitMeta(
        'job:Callback',
        JSON.stringify({ type: player.job.currentPoint.type, callback: callbackname })
    );
}

/**
 * Description:
 * The 'retrieve' type places an item in the user's inventory.
 * @param player
 * @param callback
 */
function retrieveType(player, callback) {
    //
}

/**
 * Description:
 * The 'dropoff' type removes an item in the user's inventor.y
 * @param player
 * @param callback
 */
function dropOffType(player, callback) {
    //
}

/**
 * Description:
 * The 'vehicledrop' type forces the user to drop off their
 * current job vehicle. It will dissappear after.
 * @param player
 * @param callback
 */
function vehicleDropType(player, callback) {
    const dist = utilityVector.distance(player.pos, player.job.currentPoint.position);
    if (dist > player.job.currentPoint.range) return callback(false);

    if (player.job.currentVehicle !== player.vehicle) callback(false);

    player.ejectSlowly();
    player.job.timeout = setTimeout(() => {
        if (player.vehicles) {
            let index = player.vehicles.findIndex(x => x === player.job.currentVehicle);
            if (index !== -1) {
                player.vehicles.splice(index, 1);
            }
        }

        player.job.currentVehicle.destroy();
        player.job.currentVehicle = undefined;
    }, 2500);

    callback(true);
}

function targetRepairType(player, callback) {
    if (player.job.target === undefined) {
        return callback(false);
    }

    const dist = utilityVector.distance(player.pos, player.job.target.props.vehicle.pos);
    if (dist > player.job.currentPoint.range) {
        return callback(false);
    }

    if (player.vehicle) {
        return callback(false);
    }

    player.job.progress += 1;
    player.emitMeta('job:Progress', player.job.progress);
    playJobAnimation(player);

    if (player.job.progress < player.job.currentPoint.progressMax) {
        return callback(false);
    }

    if (player.job.currentPoint.fare) {
        player.job.target.player.subCash(player.job.target.props.fare);
        player.addCash(player.job.target.props.fare);
        player.send(`{00FF00}+$${player.job.target.props.fare}`);
    }

    player.job.target.props.vehicle.repair();
    player.job.target.props.vehicle.bodyHealth = 1000;
    player.job.target.props.vehicle.engineHealth = 1000;
    player.job.target.props.vehicle.saveVehicleData();
    return callback(true);
}

function playJobAnimation(player) {
    if (player.job.currentPoint.anim === undefined) return;
    const anim = player.job.currentPoint.anim;
    player.playAnimation(anim.dict, anim.name, anim.duration, anim.flag);
}

/**
 * Description:
 * Used to process the 'hack' type for an 'E' press.
 * @param player
 * @param callbackname
 * @param value
 */
function callbackHack(player, callbackname, value) {
    alt.offClient(callbackname, callbackHack);
    // Don't proceed further without a callback.
    if (player.job.callback === undefined) {
        return;
    }

    // Set progress is non-existant.
    if (player.job.progress === undefined) {
        player.job.progress = -1;
    }

    // Cooldown
    if (player.job.cooldown) {
        if (Date.now() < player.job.cooldown) {
            player.job.callback(false);
            player.job.callback = undefined;
            return;
        } else {
            player.job.cooldown = Date.now() + 2000;
        }
    }

    if (!player.job.cooldown) player.job.cooldown = Date.now() + 2000;

    if (value) {
        playJobAnimation(player);
        player.job.progress += 1;
        player.emitMeta('job:Progress', player.job.progress);

        if (player.job.progress > player.job.currentPoint.progressMax) {
            player.job.callback(true);
            player.job.callback = undefined;
            return;
        }
    }

    player.job.callback(false);
    player.job.callback = undefined;
}

/**
 * Description:
 * Used to process the 'spawnvehicle' type for a
 * forward vehicle. Almost always succeeds.
 * @param player
 * @param callbackname
 * @param value
 */
function callbackSpawnVehicle(player, callbackname, value) {
    alt.offClient(callbackname, callbackSpawnVehicle);
    // Don't proceed further without a callback.
    if (player.job.callback === undefined) {
        return;
    }

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

    player.job.currentVehicle.setMeta('job:Owner', player.data.name);
    player.job.currentVehicle.lockState = player.job.vehicle.lockState;
    player.job.currentVehicle.engineOn = true;
    player.vehicles.push(player.job.currentVehicle);

    if (player.job.vehicle.preventHijack) {
        player.job.currentVehicle.preventHijack = true;
    }

    player.job.currentVehicle.job = player;

    player.job.callback(true);
}
