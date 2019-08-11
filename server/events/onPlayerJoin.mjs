import * as alt from 'alt';

const startingCamPoint = {
    x: -443.31427001953125,
    y: 1059.4945068359375,
    z: 327.6732177734375
};

alt.on('playerConnect', player => {
    player.pos = startingCamPoint;
});
