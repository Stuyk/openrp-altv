import * as alt from 'alt';

/**
 * Get the player's current playing time.
 * @param startTimeMS
 * @param endTimeMS
 */
export function getPlayingTime(startTimeMS, endTimeMS) {
    return (endTimeMS - startTimeMS) / 1000 / 60;
}

export function minutesToUpgradePoints(minutes) {
    return Math.floor(minutes / 60 / 10);
}
