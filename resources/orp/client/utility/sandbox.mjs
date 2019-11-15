// Nothing here now.
import * as alt from 'alt';
import * as native from 'natives';

alt.onServer('getForwardVector', () => {
    var forward = native.getEntityForwardVector(alt.Player.local.scriptID);
    alt.emitServer('getForwardVector', forward);
});

alt.onServer('teleportToWaypoint', callbackName => {
    if (!native.isWaypointActive()) {
        alt.emitServer(callbackName, callbackName, undefined);
        return;
    }

    const wp = native.getFirstBlipInfoId(8);
    const coords = native.getBlipInfoIdCoord(wp);
    native.setEntityAlpha(alt.Player.local.scriptID, 0, false);

    let start = 1000;
    const timeout = alt.setInterval(() => {
        if (start <= 0) {
            alt.emitServer(callbackName, callbackName, undefined);
            alt.clearInterval(timeout);
            native.freezeEntityPosition(alt.Player.local.scriptID, false);
            native.setEntityAlpha(alt.Player.local.scriptID, 255, false);
            return;
        }

        native.startPlayerTeleport(
            alt.Player.local.scriptID,
            coords.x,
            coords.y,
            start,
            0,
            true,
            true,
            false
        );

        native.freezeEntityPosition(alt.Player.local.scriptID, true);
        native.requestCollisionAtCoord(coords.x, coords.y, start);
        const [_found, zValue] = native.getGroundZFor3dCoord(coords.x, coords.y, start);
        if (!_found) {
            start -= 5;
            return;
        }

        alt.emitServer(callbackName, callbackName, {
            x: coords.x,
            y: coords.y,
            z: zValue
        });

        native.setEntityAlpha(alt.Player.local.scriptID, 255, false);
        native.freezeEntityPosition(alt.Player.local.scriptID, false);
        alt.clearInterval(timeout);
    }, 5);
});

alt.onServer('create:Object', name => {
    const hash = native.getHashKey(name);
    alt.loadModel(hash);
    native.requestModel(hash);
    const pos = alt.Player.local.pos;
    let obj = native.createObject(hash, pos.x, pos.y, pos.z, false, false, false);

    alt.setTimeout(() => {
        native.deleteEntity(obj);
    }, 5000);
});
