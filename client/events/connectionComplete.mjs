import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->events->connectionComplete.mjs');

alt.on('connectionComplete', () => {
    alt.log('Loading Interiors');

    alt.requestIpl('ex_dt1_02_office_02b');

    let coordLoc = native.getInteriorAtCoords(-141.1987, -620.913, 168.8205);
    alt.log(`Interior Location ID: ${coordLoc}`);

    native.pinInteriorInMemory(coordLoc);
});
