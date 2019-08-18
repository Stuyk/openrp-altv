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
        alt.off('keydown', keyPressHandler);
        return;
    }

    if (interactionEnabled) return;

    // Show prompt for interaction.
    interactionEnabled = true;
    alt.on('update', showKeyPress);
    alt.on('keydown', keyPressHandler);
}, 500);

// Check for the key the user is pressing when enabled.
function showKeyPress() {
    utilitytext.drawText2d(
        `Press "E" to Interact`,
        0.5,
        0.15,
        0.5,
        4,
        255,
        255,
        255,
        150,
        true,
        false,
        99
    );
}

// When the player wants to interact. The press this key.
function keyPressHandler(key) {
    if (key === 'E'.charCodeAt(0)) {
        alt.emitServer('interaction:Exec');
    }
}
