import * as alt from 'alt';

console.log('Loaded: utility->vector.mjs');

// Get all of the players in range of a position.
export function getPlayersInRange(pos, range) {
    if (pos === undefined || range === undefined) {
        throw new Error('GetPlayersInRange => pos or range is undefined');
    }

    var inRange = [];

    alt.Player.all.forEach(value => {
        if (distance(pos, value.pos) > range) return;
        inRange.push(value);
    });

    return inRange;
}

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
