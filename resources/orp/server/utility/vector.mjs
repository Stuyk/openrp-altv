import * as alt from 'alt';

// Get all of the players in range of a position.
export function getPlayersInRange(pos, range) {
    if (pos === undefined || range === undefined) {
        throw new Error('GetPlayersInRange => pos or range is undefined');
    }

    var inRange = [];

    alt.Player.all.forEach(value => {
        if (distance(pos, value.pos) > range) return;
        if (!value.data) return;
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

// Get a random position based around.
export function randPosAround(pos, range) {
    return {
        x: pos.x + Math.random() * (range * 2) - range,
        y: pos.y + Math.random() * (range * 2) - range,
        z: pos.z
    };
}

/**
 * Get the closest user to a player.
 * @param player The player requesting.
 * @param players The list of players to use.
 * @param isJobber Is this a jobber target type?
 */
export function getClosestPlayer(player, players, isJobber = false) {
    let closestPlayer;
    let lastDistance;

    // Get closest taxi driver.
    players.forEach(p2 => {
        const jobDistance = distance(player.pos, p2.pos);
        if (p2.target && isJobber) return;
        if (!p2.job.available) return;

        if (closestPlayer === undefined) {
            closestPlayer = p2;
            lastDistance = jobDistance;
            return;
        }

        // Get closest driver each time.
        if (jobDistance < lastDistance) {
            closestPlayer = p;
            lastDistance = jobDistance;
        }
    });

    return closestPlayer;
}
