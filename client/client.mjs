import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client.mjs');

// Import the rest of the events.
import * as servereventrouting from 'client/serverEvents/serverEventRouting.mjs';
import * as connectioncomplete from 'client/events/connectionComplete.mjs';
import * as disconnect from 'client/events/disconnect.mjs';
import * as update from 'client/events/update.mjs';

// Sandbox Code
var pos = {
    x: 813,
    y: -279,
    z: 66
};
/*
alt.on('update', () => {
    let localPlayerName = alt.Player.local.getSyncedMeta('charactername');

    if (localPlayerName === undefined || localPlayerName === null) return;

    drawText3d(
        localPlayerName,
        alt.Player.local.pos.x,
        alt.Player.local.pos.y,
        alt.Player.local.pos.z,
        0.5,
        4,
        255,
        255,
        255,
        255,
        true,
        false,
        99
    );
});
*/
