import * as alt from 'alt';
import * as native from 'natives';
import * as utilityVector from 'client/utility/vector.mjs';
import * as utilityMarker from 'client/utility/marker.mjs';

alt.log('Loaded: client->systems->job.mjs');

const validTypes = [
    { name: 'point', func: pointType },
    { name: 'capture', func: captureType },
    { name: 'retreive', func: retrieveType },
    { name: 'dropoff', func: dropOffType }
];
let currentPoint;
let currentInterval;
let isUpdateActive;

export function sync() {
    const current = JSON.parse(alt.Player.local.getSyncedMeta('job'));
    const point = alt.Player.local.getSyncedMeta('jobpoint');

    // Clearing the current point.
    if (currentPoint) {
        currentPoint.blip.destroy();
        currentPoint = undefined;
    }

    // Clearing the current check objective interval.
    // Turn off the update function for a moment.
    if (currentInterval !== undefined) {
        alt.log(currentInterval);
        alt.clearInterval(currentInterval);
        alt.off('update', drawObjectiveInfo);
        currentInterval = undefined;
        isUpdateActive = false;
    }

    if (current === null || current === undefined) return;

    // Getting the point data.
    let pointData = current.points[point];

    // Checking if the provided point type is valid.
    if (validTypes.includes(x => x.name === pointData.type) === undefined) {
        throw new Error('Invalid job point type. Please use lowercase.');
    }

    // Setup new blip for point.
    const blip = new alt.PointBlip(
        pointData.position.x,
        pointData.position.y,
        pointData.position.z
    );
    blip.shortRange = false;
    blip.sprite = pointData.blipSprite;
    blip.color = pointData.blipColor;
    blip.name = pointData.name;

    // Setting current point data.
    currentPoint = {
        position: pointData.position,
        func: validTypes.find(x => x.name === pointData.type).func,
        blip
    };

    // Turning on the interval
    currentInterval = alt.setInterval(checkObjective, 500);
}

function checkObjective() {
    // Establish the Draw Object Info Update
    if (!isUpdateActive) {
        isUpdateActive = true;
        alt.on('update', drawObjectiveInfo);
    }

    let isObjectiveComplete = currentPoint.func();
    if (!isObjectiveComplete) return;

    alt.emitServer('job:TestObjective');
}

function drawObjectiveInfo() {
    if (currentPoint === undefined) return;

    utilityMarker.drawMarker(
        1,
        currentPoint.position,
        new alt.Vector3(0, 0, 0),
        new alt.Vector3(0, 0, 0),
        new alt.Vector3(3, 3, 3),
        0,
        255,
        0,
        100
    );
}

function pointType() {
    alt.log('Checking point type');

    if (utilityVector.distance(alt.Player.local.pos, currentPoint.position) <= 3) {
        return true;
    }

    return false;
}

function dropOffType() {
    //
}

function retrieveType() {
    //
}

function captureType() {
    //
}
