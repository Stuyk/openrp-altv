import * as alt from 'alt';
import * as native from 'natives';
import { View } from '/client/utility/view.js';
import { showCursor } from '/client/utility/cursor.js';

const url = 'http://resource/client/html/vehiclecustom/index.html';
let webview;
let vehicleChanges = {};
let previousVehicle = {};
let previousColors = {};
let colors = {};
let wheelType = 0;
let wheelIndex = 0;
let targetVeh;

const modTypes = [
    'Spoiler', // 0
    'Frontbumper', // 1
    'Rearbumper', // 2
    'Sideskirt', // 3
    'Exhaust', // 4
    'Chassis', // 5
    'Grille', // 6
    'Hood', // 7
    'Fender', // 8
    'Rightfender', // 9
    'Roof', // 10
    'Engine', // 11
    'Brakes', // 12
    'Transmission', // 13
    'Horns', // 14
    'Suspension', // 15
    'Armor', // 16
    'Unk17', // 17
    'Turbo', // 18
    'Unk19', // 19
    'Tiresmoke', // 20
    'Unk21', // 21
    'Xenonlights', // 22
    'Frontwheels', // 23
    'Backwheels', // 24
    'Plateholder', // 25
    'Vanityplates', // 26
    'Trim', // 27
    'Ornaments', // 28
    'Dashboard', // 29
    'Dial', // 30
    'Doorspeaker', // 31
    'Seats', // 32
    'Steeringwheel', // 33
    'Shifterleavers', // 34
    'Plaques', // 35
    'Speakers', // 36
    'Trunk', // 37
    'Hydrulics', // 38
    'Engineblock', // 39
    'Airfilter', // 40
    'Struts', // 41
    'Archcover', // 42
    'Aerials', // 43
    'Trim', // 44
    'Tank', // 45
    'Windows', // 46
    'Unk47', // 47
    'Sticker' // 48 // Was "Livery"
];

export function showDialogue() {
    if (!webview) {
        webview = new View();
    }

    if (alt.Player.local.getMeta('viewOpen')) return;
    if (!alt.Player.local.vehicle) return;
    if (alt.Player.local.getSyncedMeta('dead')) return;
    if (alt.Player.local.getMeta('arrest')) return;

    previousVehicle = {};
    vehicleChanges = {};
    previousColors = {};
    colors = {};

    // Setup Webview
    webview.open(url, true);
    webview.on('custom:FetchMods', customFetchMods);
    webview.on('custom:AdjustMod', customAdjustMod);
    webview.on('custom:AdjustWheelType', customAdjustWheelType);
    webview.on('custom:AdjustRotation', customAdjustRotation);
    webview.on('custom:AdjustColor', customAdjustColor);
    alt.emit('hud:Hide', true);
    alt.emit('chat:Hide', true);
    getPreviousVehicleMods();
}

function customAdjustRotation(value) {
    native.setEntityHeading(targetVeh, value);
}

function getPreviousVehicleMods() {
    targetVeh = alt.Player.local.vehicle.scriptID;
    native.setVehicleModKit(targetVeh, 0);

    // Parse Previous Mods
    for (let i = 0; i <= 48; i++) {
        let value = native.getVehicleMod(targetVeh, i);
        previousVehicle[i] = value;
    }

    getPreviousVehicleColors();
}

function getPreviousVehicleColors() {
    const [_null1, pr, pg, pb] = native.getVehicleCustomPrimaryColour(
        targetVeh,
        undefined,
        undefined,
        undefined
    );

    const [_null2, sr, sg, sb] = native.getVehicleCustomSecondaryColour(
        targetVeh,
        undefined,
        undefined,
        undefined
    );

    const [_null3, primaryPaintType] = native.getVehicleModColor1(
        targetVeh,
        undefined,
        undefined,
        undefined
    );

    const [_null4, secondaryPaintType] = native.getVehicleModColor2(
        targetVeh,
        undefined,
        undefined,
        undefined
    );

    previousColors = {
        primary: {
            type: primaryPaintType,
            color: {
                r: pr,
                g: pg,
                b: pb
            }
        },
        secondary: {
            type: secondaryPaintType,
            color: {
                r: sr,
                g: sg,
                b: sb
            }
        }
    };
}

function customFetchMods() {
    if (!webview) {
        return;
    }

    showCursor(true);
    const mods = [];
    for (let i = 0; i <= 48; i++) {
        if (i === 17 || i === 19 || i === 21) {
            continue;
        }

        const mod = {
            index: i,
            max: 0,
            slotName: modTypes[i],
            active: native.getVehicleMod(targetVeh, i)
        };

        mod.max = native.getNumVehicleMods(targetVeh, i);
        mods.push(mod);
    }

    webview.emit('custom:SetMods', mods);
    webview.emit('custom:SetColors', previousColors);
}

function customAdjustMod(index, value) {
    native.setVehicleModKit(targetVeh, 0);

    if (index === 23) {
        wheelIndex = value;
        native.setVehicleWheelType(targetVeh, wheelType);
        native.setVehicleMod(targetVeh, index, value, true);
        return;
    }

    native.setVehicleMod(targetVeh, index, value, false);
    vehicleChanges[index] = value;
}

function customAdjustWheelType(value) {
    native.setVehicleModKit(targetVeh, 0);
    wheelType = value;
    native.setVehicleWheelType(targetVeh, value);
    native.setVehicleMod(targetVeh, 23, wheelIndex, true);
}

function customAdjustColor(primary, secondary) {
    native.setVehicleCustomPrimaryColour(targetVeh, primary.pr, primary.pg, primary.pb);
    native.setVehicleCustomSecondaryColour(
        targetVeh,
        secondary.sr,
        secondary.sg,
        secondary.sb
    );
}

function saveChanges() {
    webview.close();
    showCursor(false);
    webview = undefined;

    Object.keys(vehicleChanges).forEach(key => {
        previousVehicle[key] = vehicleChanges[key];
    });

    previousVehicle.colors = colors;

    // New modification list is sent up.
    alt.emitServer(
        'vehicle:SaveChanges',
        alt.Player.local.vehicle,
        JSON.stringify(previousVehicle)
    );
}

function exit() {
    webview.close();
    showCursor(false);
    webview = undefined;
    const scriptID = alt.Player.local.vehicle.scriptID;

    Object.keys(previousVehicle).forEach(key => {
        native.setVehicleMod(scriptID, key, previousVehicle[key], false);
    });

    native.setVehicleModColor1(scriptID, previousColors.primary.type, 0, 0);
    native.setVehicleCustomPrimaryColour(
        scriptID,
        previousColors.primary.r,
        previousColors.primary.g,
        previousColors.primary.b
    );

    native.setVehicleModColor2(scriptID, previousColors.secondary.type, 0, 0);
    native.setVehicleCustomSecondaryColour(
        scriptID,
        previousColors.secondary.r,
        previousColors.secondary.g,
        previousColors.secondary.b
    );
}
