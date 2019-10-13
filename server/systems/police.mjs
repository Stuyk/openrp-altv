import * as alt from 'alt';

const jailBookCoordA = {
    x: 462.2236633300781,
    y: -1003.0838623046875,
    z: 24.01488265991211
};

const jailBookCoordB = {
    x: 465.2227478027344,
    y: -992.9740600585938,
    z: 24.91488265991211
};

const bookingShape = new alt.ColshapeCuboid(
    jailBookCoordA.x,
    jailBookCoordA.y,
    jailBookCoordA.z,
    jailBookCoordB.x,
    jailBookCoordB.y,
    jailBookCoordB.z + 2
);
bookingShape.name = 'policeBooking';

export function forwardColshapeEnter(colshape, player) {
    if (colshape.name !== 'policeBooking') return;
    player.isInPoliceBooking = true;
    player.send('You are inside of police booking area.');
}
