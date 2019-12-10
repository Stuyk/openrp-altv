import * as alt from 'alt';

export function goToLastLocation(player) {
    if (player.lastLocation === undefined) return;

    setTimeout(() => {
        alt.emit('goto:LastLocation', player);
    }, 250);
}

alt.on('goto:LastLocation', player => {
    if (!player) return;
    alt.log(`${player.name} was teleported to their last location.`);
    player.pos = player.lastLocation;
    player.lastLocation = undefined;
});

alt.onClient('utility:SetLastLocation', (player, pos) => {
    player.lastLocation = pos;
});
