import * as alt from 'alt';

alt.log('Loaded: utility->vector.mjs');

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

// Get a random position based around.
export function randPosAround(pos, range) {
    return {
        x: pos.x + Math.random() * (range * 2) - range,
        y: pos.y + Math.random() * (range * 2) - range,
        z: pos.z
    };
}
