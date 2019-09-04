import * as alt from 'alt';
import * as native from 'natives';
import * as panelsClothing from 'client/panels/clothing.mjs';

alt.log('Loaded: client->systems->clothing.mjs');

const shops = [
    198145,
    165633,
    235265,
    137217,
    171265,
    166145,
    179713,
    140801,
    183553,
    201473,
    202497,
    169217,
    176129,
    175361
];

let inShop = false;
let timeout = false;

// Interval to check if a user is in a shop.
alt.setInterval(() => {
    // Get the current interior of the user.
    const currInterior = native.getInteriorFromEntity(alt.Player.local.scriptID);

    // Check if the shop list includes this interior.
    // If it does not; turn off the update function.
    if (!shops.includes(currInterior)) {
        inShop = false;
        alt.off('update', shopKey);
        return;
    }

    // Check if they're already in a shop. Return if they are.
    if (inShop) return;

    // Turn on the shop key update function.
    inShop = true;
    alt.on('update', shopKey);
}, 1000);

function shopKey() {
    native.beginTextCommandDisplayHelp('STRING');
    native.addTextComponentSubstringPlayerName(
        `Press ~INPUT_CONTEXT~ to change your clothes.`
    );
    native.endTextCommandDisplayHelp(0, false, true, -1);

    if (native.isControlJustReleased(0, 38)) {
        if (timeout) return;

        timeout = true;
        panelsClothing.showDialogue();
        alt.setTimeout(() => {
            timeout = false;
        }, 500);
    }
}
