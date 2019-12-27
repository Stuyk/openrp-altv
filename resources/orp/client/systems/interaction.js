import * as alt from 'alt';
import * as native from 'natives';

alt.log(`Loaded: client->systems->interaction.js`);

let interactionEnabled = false;
let currentLabel;
let interval;

alt.on('meta:Changed', (key, value) => {
    if (key !== 'interaction') return;
    const indexData = value;
    if (indexData === undefined || indexData === null) {
        currentLabel = undefined;
        interactionEnabled = false;

        if (interval !== undefined) {
            alt.clearInterval(interval);
            interval = undefined;
        }

        alt.Player.local.interactionPoint = false;
        return;
    }

    if (interactionEnabled) return;

    currentLabel = indexData.message;

    // Show prompt for interaction.
    interactionEnabled = true;
    interval = alt.setInterval(showKeyPress, 0);
    alt.Player.local.interactionPoint = true;
    alt.log(`interaction.js ${interval}`);
});

// Check for the key the user is pressing when enabled.
function showKeyPress() {
    if (currentLabel === undefined) return;

    native.beginTextCommandDisplayHelp('STRING');
    native.addTextComponentSubstringPlayerName(`Press ~INPUT_CONTEXT~ ${currentLabel}`);
    native.endTextCommandDisplayHelp(0, false, false, -1);

    if (native.isControlJustPressed(0, 38)) {
        alt.emitServer('interaction:Exec');
    }
}
