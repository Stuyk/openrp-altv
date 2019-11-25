import * as alt from 'alt';
import * as native from 'natives';
import * as panelsClothing from '/client/panels/clothing.mjs';
import * as panelsVehicleCustom from '/client/panels/vehiclecustom.mjs';
import * as panelsGeneralStore from '/client/panels/generalstore.mjs';
import * as panelsCrafting from '/client/panels/crafting.mjs';
import * as panelsCharacter from '/client/panels/character.mjs';
import { createBlip } from '/client/blips/bliphelper.mjs';
import { syncDoors } from '/client/systems/doors.mjs';

alt.log('Loaded: client->systems->shop.mjs');

const shops = [
    {
        category: 'barbershop',
        type: 'Barbershop',
        sprite: 71,
        color: 53,
        ids: [
            //
            165377,
            198657,
            171009,
            199937,
            155905,
            140545,
            180225
        ],
        func: panelsCharacter.showAsBarbershop,
        message: `Press ~INPUT_CONTEXT~ to change your eyes, hair, or makeup.`
    },
    {
        category: 'tattooshop',
        type: 'Tattooshop',
        sprite: 75,
        color: 53,
        ids: [
            //
            171521,
            176897,
            180737,
            199425,
            140033,
            251137
        ],
        func: panelsCharacter.showAsTattooShop,
        message: `Press ~INPUT_CONTEXT~ to browse tattoo options.`
    },
    {
        category: 'vehiclecustoms',
        type: 'Vehicle Customs Shop',
        sprite: 402,
        color: 53,
        ids: [
            //
            196609,
            234753,
            164353,
            153601,
            201729,
            179457
        ],
        func: panelsVehicleCustom.showDialogue,
        vehicle: true,
        message: `Press ~INPUT_CONTEXT~ to edit your vehicle.`
    },
    {
        category: 'clothingstore',
        type: 'Clothing Store',
        sprite: 73,
        color: 53,
        ids: [
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
        ],
        func: panelsClothing.showDialogue,
        message: `Press ~INPUT_CONTEXT~ to shop for clothes.`
    },
    {
        category: 'generalstore',
        type: 'General Store',
        sprite: 52,
        color: 53,
        ids: [
            139777,
            178945,
            176641,
            177153,
            204801,
            200449,
            199169,
            184065,
            154113,
            170753,
            168449,
            175105,
            203265,
            200705,
            196865,
            198401,
            155649,
            167937,
            175873,
            183809
        ],
        func: panelsGeneralStore.showDialogue,
        message: `Press ~INPUT_CONTEXT~ to shop for general goods.`
    },
    {
        category: 'ammunation',
        type: 'Gun Crafting Point',
        sprite: 119,
        color: 6,
        ids: [
            164609,
            168193,
            153857,
            176385,
            137729,
            175617,
            140289,
            178689,
            200961,
            180481,
            248065
        ],
        func: panelsCrafting.weaponryCrafting,
        message: `Press ~INPUT_CONTEXT~ to access this crafting point.`
    }
];

let inShop = false;
let timeout = false;
let currentShop;
let interval;
let shopCheckInterval;

alt.on('meta:Changed', startShopInterval);

// Only starts the interval after the player has logged in.
function startShopInterval(key, value) {
    if (key !== 'loggedin' && !value) return;
    if (!shopCheckInterval) {
        shopCheckInterval = alt.setInterval(shopInterval, 250);
        alt.log(`shop.mjs ${shopCheckInterval}`);
        shops.forEach(shop => {
            shop.ids.forEach(id => {
                let [_null, _shopPos] = native.getInteriorInfo(id, undefined, undefined);
                createBlip(shop.category, _shopPos, shop.sprite, shop.color, shop.type);
            });
        });
    }

    alt.off('meta:Changed', startShopInterval);
}

// Used to handle interiors.
// Has to have special case for vehicle.
function shopInterval() {
    if (alt.Player.local.getMeta('arrest')) return;
    if (alt.Player.local.getMeta('viewOpen')) return;

    // Get the current interior of the user.
    const currInterior = native.getInteriorFromEntity(alt.Player.local.scriptID);

    // LSPD
    if (currInterior === 137473) {
        clearShop();
        syncDoors();
        return;
    }

    if (currInterior === 0) {
        clearShop();
        return;
    }

    currentShop = shops.find(x => x.ids.find(x => x === currInterior));
    if (!currentShop) {
        clearShop();
        return;
    }

    // Check if they're already in a shop. Return if they are.
    if (inShop) return;

    // Check if the user is the driver.
    if (currentShop.vehicle) {
        if (!alt.Player.local.vehicle) return;
        let ped = native.getPedInVehicleSeat(alt.Player.local.vehicle.scriptID, -1, 0);
        if (alt.Player.local.scriptID !== ped) return;
        if (alt.Player.local.vehicle.getSyncedMeta('isJobCar')) return;
    }

    // Turn on the shop key update function.
    inShop = true;
    interval = alt.setInterval(shopKey, 0);
    alt.log(`shop.mjs shopKey ${interval}`);
}

function clearShop() {
    inShop = false;
    currentShop = undefined;

    if (interval !== undefined) {
        alt.clearInterval(interval);
        interval = undefined;
    }
}

function shopKey() {
    if (alt.Player.local.getMeta('viewOpen')) return;
    if (currentShop === undefined) return;
    native.beginTextCommandDisplayHelp('STRING');
    native.addTextComponentSubstringPlayerName(currentShop.message);
    native.endTextCommandDisplayHelp(0, false, true, -1);

    if (native.isControlJustReleased(0, 38)) {
        if (timeout) return;
        timeout = true;
        currentShop.func();
        alt.setTimeout(() => {
            timeout = false;
        }, 500);
    }
}
