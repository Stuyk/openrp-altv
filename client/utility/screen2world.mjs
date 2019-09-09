import * as native from 'natives';
import * as alt from 'alt';

alt.log('Loaded: client->utility->screen2world.mjs');

function mulNumber(vector1, value) {
    var result = {};
    result.x = vector1.x * value;
    result.y = vector1.y * value;
    result.z = vector1.z * value;
    return result;
}

// Add one vector to another.
function addVector3(vector1, vector2) {
    return {
        x: vector1.x + vector2.x,
        y: vector1.y + vector2.y,
        z: vector1.z + vector2.z
    };
}

// Subtract one vector from another.
function subVector3(vector1, vector2) {
    return {
        x: vector1.x - vector2.x,
        y: vector1.y - vector2.y,
        z: vector1.z - vector2.z
    };
}

function rotationToDirection(rotation) {
    let z = degToRad(rotation.z);
    let x = degToRad(rotation.x);
    let num = Math.abs(Math.cos(x));

    let result = {};
    result.x = -Math.sin(z) * num;
    result.y = Math.cos(z) * num;
    result.z = Math.sin(x);
    return result;
}

function w2s(position) {
    let result = native.getScreenCoordFromWorldCoord(
        position.x,
        position.y,
        position.z,
        undefined,
        undefined
    );

    if (!result[0]) {
        return undefined;
    }

    let newPos = {};
    newPos.x = (result[1] - 0.5) * 2;
    newPos.y = (result[2] - 0.5) * 2;
    newPos.z = 0;
    return newPos;
}

function processCoordinates(x, y) {
    var res = native.getActiveScreenResolution(0, 0);
    let screenX = res[1];
    let screenY = res[2];

    let relativeX = 1 - (x / screenX) * 1.0 * 2;
    let relativeY = 1 - (y / screenY) * 1.0 * 2;

    if (relativeX > 0.0) {
        relativeX = -relativeX;
    } else {
        relativeX = Math.abs(relativeX);
    }

    if (relativeY > 0.0) {
        relativeY = -relativeY;
    } else {
        relativeY = Math.abs(relativeY);
    }

    return { x: relativeX, y: relativeY };
}

function s2w(camPos, relX, relY) {
    let camRot = native.getGameplayCamRot(0);
    let camForward = rotationToDirection(camRot);
    let rotUp = addVector3(camRot, { x: 10, y: 0, z: 0 });
    let rotDown = addVector3(camRot, { x: -10, y: 0, z: 0 });
    let rotLeft = addVector3(camRot, { x: 0, y: 0, z: -10 });
    let rotRight = addVector3(camRot, { x: 0, y: 0, z: 10 });

    let camRight = subVector3(
        rotationToDirection(rotRight),
        rotationToDirection(rotLeft)
    );
    let camUp = subVector3(rotationToDirection(rotUp), rotationToDirection(rotDown));

    let rollRad = -degToRad(camRot.y);

    let camRightRoll = subVector3(
        mulNumber(camRight, Math.cos(rollRad)),
        mulNumber(camUp, Math.sin(rollRad))
    );
    let camUpRoll = addVector3(
        mulNumber(camRight, Math.sin(rollRad)),
        mulNumber(camUp, Math.cos(rollRad))
    );

    let point3D = addVector3(
        addVector3(addVector3(camPos, mulNumber(camForward, 10.0)), camRightRoll),
        camUpRoll
    );

    let point2D = w2s(point3D);

    if (point2D === undefined) {
        return addVector3(camPos, mulNumber(camForward, 10.0));
    }

    let point3DZero = addVector3(camPos, mulNumber(camForward, 10.0));
    let point2DZero = w2s(point3DZero);

    if (point2DZero === undefined) {
        return addVector3(camPos, mulNumber(camForward, 10.0));
    }

    let eps = 0.001;

    if (
        Math.abs(point2D.x - point2DZero.x) < eps ||
        Math.abs(point2D.y - point2DZero.y) < eps
    ) {
        return addVector3(camPos, mulNumber(camForward, 10.0));
    }

    let scaleX = (relX - point2DZero.x) / (point2D.x - point2DZero.x);
    let scaleY = (relY - point2DZero.y) / (point2D.y - point2DZero.y);
    let point3Dret = addVector3(
        addVector3(
            addVector3(camPos, mulNumber(camForward, 10.0)),
            mulNumber(camRightRoll, scaleX)
        ),
        mulNumber(camUpRoll, scaleY)
    );

    return point3Dret;
}

function degToRad(deg) {
    return (deg * Math.PI) / 180.0;
}

// Get entity, ground, etc. targeted by mouse position in 3D space.
export function screenToWorld(flags, ignore) {
    let x = alt.getCursorPos().x;
    let y = alt.getCursorPos().y;

    let absoluteX = x;
    let absoluteY = y;

    let camPos = native.getGameplayCamCoord();
    let processedCoords = processCoordinates(absoluteX, absoluteY);
    let target = s2w(camPos, processedCoords.x, processedCoords.y);

    let dir = subVector3(target, camPos);
    let from = addVector3(camPos, mulNumber(dir, 0.05));
    let to = addVector3(camPos, mulNumber(dir, 300));

    let ray = native.startShapeTestRay(
        from.x,
        from.y,
        from.z,
        to.x,
        to.y,
        to.z,
        flags,
        ignore,
        0
    );
    return native.getShapeTestResult(ray);
}
