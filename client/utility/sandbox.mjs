// Nothing here now.
import * as alt from 'alt';
import * as native from 'natives';

alt.onServer('getForwardVector', () => {
    var forward = native.getEntityForwardVector(alt.Player.local.scriptID);
    alt.emitServer('getForwardVector', forward);
});