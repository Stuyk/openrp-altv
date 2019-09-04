import * as alt from 'alt';

// Returns in Minutes
export function getPlayingTime(startTimeMS, endTimeMS) {
    return (endTimeMS - startTimeMS) / 1000 / 60;
}

export function minutesToUpgradePoints(minutes) {
    return Math.floor(minutes / 60 / 10);
}
