import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->systems->callbacks.js');

const callbackTypes = {
    waypoint: { func: waypoint }
};

alt.on('syncedMetaChange', (entity, key, value) => {
    if (entity !== alt.Player.local) return; // Local Player Only
    if (key !== 'callback:Request') return;

    if (callbackTypes[value.type] !== undefined) {
        callbackTypes[value.type].func(value.name); // Pass callback name through.
    }
});

function waypoint(callbackname) {
    alt.log(callbackname);

    alt.log('Callback');
    let waypoint = native.getFirstBlipInfoId(8);
    alt.log(waypoint);

    // Check if the waypoint exists.
    if (!native.doesBlipExist(waypoint))
        return alt.emitServer(callbackname, callbackname, false);

    let coords = native.getBlipInfoIdCoord(waypoint);

    let [_found, _coords] = native.getClosestVehicleNode(
        coords.x,
        coords.y,
        coords.z,
        undefined,
        1,
        3.0,
        3.0
    );

    if (!_found) {
        alt.emitServer(callbackname, callbackname, false);
        return;
    }

    native.setBlipCoords(waypoint, _coords.x, _coords.y, _coords.z);
    alt.emitServer(callbackname, callbackname, true, _coords);
}
