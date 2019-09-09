import * as alt from 'alt';
import * as native from 'natives';
import { createBlip } from 'client/blips/bliphelper.mjs';
import * as panelsBarbershop from 'client/panels/barbershop.mjs';

alt.log('Loaded: client->systems->barbershop.mjs');

const shops = [165377, 198657, 171009, 199937, 155905, 140545, 180225];

let inShop = false;
let timeout = false;
let interval;

/*
[null,{"x":-817.9737548828125,"y":-185.95896911621094,"z":36.5706901550293},169410130]
*/
shops.forEach(shop => {
    let [_null, _shopPos] = native.getInteriorInfo(shop, undefined, undefined);
    createBlip(_shopPos, 71, 17, 'Barbershop');
});

// Interval to check if a user is in a shop.
alt.setInterval(() => {
    // Get the current interior of the user.
    const currInterior = native.getInteriorFromEntity(alt.Player.local.scriptID);

    // Check if the shop list includes this interior.
    // If it does not; turn off the update function.
    if (!shops.includes(currInterior)) {
        inShop = false;

        if (interval !== undefined) {
            alt.clearInterval(interval);
            interval = undefined;
        }
        return;
    }

    // Check if they're already in a shop. Return if they are.
    if (inShop) return;

    // Turn on the shop key update function.
    inShop = true;
    interval = alt.setInterval(shopKey, 0);
}, 1000);

function shopKey() {
    native.beginTextCommandDisplayHelp('STRING');
    native.addTextComponentSubstringPlayerName(
        `Press ~INPUT_CONTEXT~ to change your hairstyle.`
    );
    native.endTextCommandDisplayHelp(0, false, true, -1);

    if (native.isControlJustReleased(0, 38) && !alt.Player.local.vehicle) {
        if (timeout) return;

        timeout = true;
        panelsBarbershop.showDialogue();
        alt.setTimeout(() => {
            timeout = false;
        }, 500);
    }
}
