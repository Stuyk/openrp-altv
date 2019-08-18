import * as alt from 'alt';
import * as native from 'natives';
import * as utilitytext from 'client/utility/text.mjs';

alt.log(`Loaded: systems->interactionsystem.mjs`);

let interactionEnabled = false;

// Used to check if the player is standing in an interaction area.
alt.setInterval(() => {
    const indexData = alt.Player.local.getSyncedMeta('interaction');

    if (indexData === undefined || indexData === null) {
        interactionEnabled = false;
        alt.off('update', showKeyPress);
        return;
    }

    if (interactionEnabled) return;

    // Show prompt for interaction.
    interactionEnabled = true;
    alt.on('update', showKeyPress);
}, 500);

// Check for the key the user is pressing when enabled.
function showKeyPress() {
    native.beginTextCommandDisplayHelp('STRING');
    native.addTextComponentSubstringPlayerName(
        'Press ~INPUT_CONTEXT~ to Interact'
    );
    native.endTextCommandDisplayHelp(0, false, true, -1);

    if (native.isControlJustPressed(0, 38)) {
        if (key === 'E'.charCodeAt(0)) {
            alt.emitServer('interaction:Exec');
        }
    }
}
