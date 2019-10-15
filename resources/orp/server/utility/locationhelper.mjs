import * as alt from 'alt';

console.log('Loaded: utility->locationhelper.mjs');

export function goToLastLocation(player) {
    if (player.lastLocation === undefined) return;

    alt.log(`${player.name} was teleported to their last location.`);

    player.pos = player.lastLocation;
    player.lastLocation = undefined;
}
