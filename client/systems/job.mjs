import * as alt from 'alt';
import * as native from 'natives';
import * as utilityVector from 'client/utility/vector.mjs';
import * as utilityMarker from 'client/utility/marker.mjs';

alt.log('Loaded: client->systems->job.mjs');

const objectiveTypes = [
    { name: 'point', func: pointType },
    { name: 'capture', func: captureType },
    { name: 'retreive', func: retrieveType },
    { name: 'dropoff', func: dropOffType },
    { name: 'hack', func: hackType }
];

const callbackTypes = [{ name: 'hack', func: hackCallback }];

const jobFunctions = {
    'job:Start': { func: jobStart }, // Start a Job
    'job:Clear': { func: jobClear }, // Clear a Job
    'job:Update': { func: jobUpdate }, // Update the Job Progress
    'job:Progress': { func: jobProgress }, // Progress to Next Job Point
    'job:Callback': { func: jobCallback }
};

let currentJob;
let currentPointIndex;
let currentPoint;
let currentBlip;
let currentObjective;
let currentProgress = 0;
let pause = false;
let cooldown = Date.now() + 2000;

let currentInterval;
let isUpdateActive;

alt.on('syncedMetaChange', (entity, key, value) => {
    if (entity !== alt.Player.local) return; // Local Player Only

    // Call the job function for the synced meta change.
    if (jobFunctions[key] !== undefined) {
        jobFunctions[key].func(value);
    }
});

// This means to start an interval an and update method.
// Store the data above.
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
    alt.on('update', drawPointInfo);
}

function jobClear() {
    // Set current job/point info to undefined.
    currentJob = undefined;
    currentPoint = undefined;
    currentPointIndex = undefined;
    currentObjective = undefined;

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
        alt.off('update', drawPointInfo);
        isUpdateActive = false;
    }
}

// Called to update the current job info.
function jobUpdate() {
    pause = true;
    currentJob = JSON.parse(alt.Player.local.getSyncedMeta('job:Job'));
    currentPointIndex = alt.Player.local.getSyncedMeta('job:PointIndex');
    currentPoint = currentJob.points[currentPointIndex];
    parseJobInfo(currentPoint);
    pause = false;
}

// Called to progress to the next job point.
function jobProgress(value) {
    currentProgress = value;
    alt.log(value);
}

function jobCallback(value) {
    //  { type: obj.type, callback: callbackname }
    const info = JSON.parse(value);
    const type = callbackTypes.find(x => x.name === info.type);
    type.func(info.callback);
}

function parseJobInfo(currentPoint) {
    // Current Objective Function
    currentObjective = objectiveTypes.find(x => x.name === currentPoint.type).func;

    if (currentBlip !== undefined) {
        currentBlip.destroy();
        currentBlip = undefined;
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

// How should this work?
// Call the objective based on point type.
// If the point type returns true;
// Use the TestObjective event.
// TestObjective will relay back down update Objective Info
function checkPoint() {
    if (pause) return;
    if (currentObjective === undefined) return;
    let isTestReady = currentObjective();
    if (!isTestReady) return;
    alt.emitServer('job:TestObjective');
}

// Draw HUD Elements / Markers for the user.
function drawPointInfo() {
    if (pause) return;
    if (currentPoint === undefined) return;

    let dist = utilityVector.distance(alt.Player.local.pos, currentPoint.position);

    // Draw Marker
    if (dist <= 75) {
        utilityMarker.drawMarker(
            currentPoint.markerType,
            currentPoint.position,
            new alt.Vector3(0, 0, 0),
            new alt.Vector3(0, 0, 0),
            new alt.Vector3(currentPoint.range, currentPoint.range, currentPoint.range),
            currentPoint.markerColor.r,
            currentPoint.markerColor.g,
            currentPoint.markerColor.b,
            currentPoint.markerColor.a
        );
    }

    // Draw Specific to Range
    if (dist <= currentPoint.range) {
        //
    }
}

// When a player enters a point's range.
function pointType() {
    const dist = utilityVector.distance(alt.Player.local.pos, currentPoint.position);
    if (dist <= currentPoint.range) return true;
    return false;
}

// Drops off a retrieved 'object' that is 'stored' on the player.
function dropOffType() {
    //
}

// Retrieves an 'object' and stores it on the player.
function retrieveType() {
    //
}

// Must stand inside a point and do something for 'x' seconds.
function captureType() {
    if (utilityVector.distance(alt.Player.local.pos, currentPoint.position) >= 3)
        return false;
    return true;
}

// When pressing 'E' do whatever.
function hackType() {
    if (Date.now() < cooldown) return false;

    cooldown = Date.now() + 2000;

    if (!native.isControlPressed(0, 38)) return false;
    return true;
}

function hackCallback(callbackname) {
    // have to provide the name again; otherwise callback isn't turned off.
    alt.emitServer(callbackname, callbackname, native.isControlPressed(0, 38));
}
