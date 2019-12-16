import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->utility->vector.js');

// Get the distance between two vectors.
export function distance(vector1, vector2) {
    if (vector1 === undefined || vector2 === undefined) {
        throw new Error('AddVector => vector1 or vector2 is undefined');
    }

    return Math.sqrt(
        Math.pow(vector1.x - vector2.x, 2) +
            Math.pow(vector1.y - vector2.y, 2) +
            Math.pow(vector1.z - vector2.z, 2)
    );
}

export function getDirection(vector1, vector2) {
    const newCoords = {
        x: vector2.x - vector1.x,
        y: vector2.y - vector1.y,
        z: vector2.z - vector1.z
    };

    const dist = Math.sqrt(
        vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z
    );

    const x = newCoords.x * (1.0 / dist);
    const y = newCoords.y * (1.0 / dist);
    const z = newCoords.z * (1.0 / dist);
    return { x, y, z };
}

// Get a random position based around.
export function randPosAround(pos, range) {
    return {
        x: pos.x + Math.random() * (range * 2) - range,
        y: pos.y + Math.random() * (range * 2) - range,
        z: pos.z
    };
}

export function getForwardVector(entity, distance) {
    const forward = native.getEntityForwardVector(entity);
    const pos = native.getEntityCoords(entity, false);
    return {
        x: pos.x + forward.x * distance,
        y: pos.y + forward.y * distance,
        z: pos.z
    };
}

export function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

export function vectorLerp(vector1, vector2, l, clamp) {
    if (clamp) {
        if (l < 0.0) {
            l = 0.0;
        }

        if (l > 0.0) {
            l = 1.0;
        }
    }

    let x = lerp(vector1.x, vector2.x, l);
    let y = lerp(vector1.y, vector2.y, l);
    let z = lerp(vector1.z, vector2.z, l);

    return { x: x, y: y, z: z };
}

export function lerpObject(id, to, speed = 0.1) {
    let runTimer = 0;
    let dist = 0;
    native.freezeEntityPosition(id, true);

    return new Promise(resolve => {
        const objectInterval = alt.setInterval(() => {
            const pos = native.getEntityCoords(id, false);
            dist = distance(pos, to);

            const objectSpeed = (1.0 / dist) * 0.01 * speed;
            runTimer = runTimer + objectSpeed;

            const posTick = vectorLerp(pos, to, runTimer, false);
            native.setEntityCoords(
                id,
                posTick.x,
                posTick.y,
                posTick.z,
                false,
                false,
                false,
                false
            );

            if (dist <= 0.05) {
                alt.clearInterval(objectInterval);
                resolve(true);
            }
        }, 1);
    });
}


const hash = native.getHashKey('prop_rub_scrap_02');
alt.loadModel(hash)
native.requestModel(hash);

const pos = alt.Player.local.pos;
native.createObjectNoOffset(hash, pos.x, pos.y, pos.z, false, false, false);


