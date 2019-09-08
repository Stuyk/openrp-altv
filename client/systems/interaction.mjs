import * as alt from 'alt';
import * as native from 'natives';

alt.log(`Loaded: client->systems->interaction.mjs`);

let interactionEnabled = false;
let currentLabel = undefined;
let interval;

// Used to check if the player is standing in an interaction area.
alt.setInterval(() => {
    const indexData = alt.Player.local.getSyncedMeta('interaction');

    if (indexData === undefined || indexData === null) {
        currentLabel = undefined;
        interactionEnabled = false;

        if (interval !== undefined) {
            alt.clearInterval(interval);
            interval = undefined;
        }
        return;
    }

    if (interactionEnabled) return;

    alt.log(JSON.stringify(indexData));
    currentLabel = indexData.message;

    // Show prompt for interaction.
    interactionEnabled = true;
    interval = alt.setInterval(showKeyPress, 0);
}, 500);

// Check for the key the user is pressing when enabled.
function showKeyPress() {
    if (currentLabel === undefined) return;

    native.beginTextCommandDisplayHelp('STRING');
    native.addTextComponentSubstringPlayerName(`Press ~INPUT_CONTEXT~ ${currentLabel}`);
    native.endTextCommandDisplayHelp(0, false, true, -1);

    if (native.isControlJustPressed(0, 38)) {
        alt.emitServer('interaction:Exec');
    }
}
