import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client.mjs');

// Import the rest of the events.
import * as servereventrouting from 'client/serverEvents/serverEventRouting.mjs';
import * as connectioncomplete from 'client/events/connectionComplete.mjs';
import * as disconnect from 'client/events/disconnect.mjs';

/*
alt.onServer('tpw', tpToWaypoint);

// Temporary Waypoint TP
function tpToWaypoint() {
    let waypoint = native.getFirstBlipInfoId(8);

    if (native.doesBlipExist(waypoint)) {
        let coords = native.getBlipInfoIdCoord(waypoint);

        let [_found, _res] = native.getGroundZFor3dCoord(
            coords.x,
            coords.y,
            coords.z + 100,
            undefined,
            undefined
        );

        coords.z = _res + 1;
        alt.log(_found);
        alt.log(_res);

        alt.emitServer('tpToWaypoint', coords);
    }
}

/*
alt.on('keydown', key => {
    if (key === 'O'.charCodeAt(0)) {
        alt.emitServer('requestFaceCustomizer');
    }
});
*/
