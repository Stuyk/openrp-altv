// Nothing here now.
import * as alt from 'alt';
import * as native from 'natives';

alt.onServer('getForwardVector', () => {
    var forward = native.getEntityForwardVector(alt.Player.local.scriptID);
    alt.emitServer('getForwardVector', forward);
});

alt.onServer('teleportToWaypoint', player => {
    if (!native.isWaypointActive()) return;

    let wp = native.getFirstBlipInfoId(8);
    let coords = native.getBlipInfoIdCoord(wp);
    // Will fall through map until eventually lands on ground.
    native.doScreenFadeOut(250);
    native.setEntityCoords(alt.Player.local.scriptID, coords.x, coords.y, coords.z, 1, 0, 0, 1);
    alt.setTimeout(function () {
        native.doScreenFadeIn(250);
    }, 2000);
});