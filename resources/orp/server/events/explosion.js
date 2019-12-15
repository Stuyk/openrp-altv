import * as alt from 'alt';

// Cancel All Explosions
alt.on('explosion', (source, type, pos, fx) => {
    return false;
});
