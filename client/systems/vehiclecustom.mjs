import * as alt from 'alt';
import * as native from 'natives';
import { createBlip } from 'client/blips/bliphelper.mjs';
import * as panelsVehicleCustom from 'client/panels/vehiclecustom.mjs';

alt.log('Loaded: client->systems->barbershop.mjs');

const shops = [196609, 234753, 164353, 153601, 201729, 179457];

let inShop = false;
let timeout = false;
let interval;

/*
[null,{"x":-817.9737548828125,"y":-185.95896911621094,"z":36.5706901550293},169410130]
*/
shops.forEach(shop => {
    let [_null, _shopPos] = native.getInteriorInfo(shop, undefined, undefined);
    createBlip(_shopPos, 402, 77, 'Vehicle Customs Shop');
});

// Interval to check if a user is in a shop.
alt.setInterval(() => {
    if (!alt.Player.local.vehicle) return;

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

    let ped = native.getPedInVehicleSeat(alt.Player.local.vehicle.scriptID, -1, 0);
    if (alt.Player.local.scriptID !== ped) {
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
        `Press ~INPUT_CONTEXT~ to customize your vehicle.`
    );
    native.endTextCommandDisplayHelp(0, false, true, -1);

    if (native.isControlJustReleased(0, 38) && alt.Player.local.vehicle) {
        if (timeout) return;

        timeout = true;
        panelsVehicleCustom.showDialogue();
        alt.setTimeout(() => {
            timeout = false;
        }, 500);
    }
}
