import * as alt from 'alt';
import * as native from 'natives';
import { View } from '/client/utility/view.mjs';
import { showCursor } from '/client/utility/cursor.mjs';

const url = 'http://resource/client/html/vehiclecustom/index.html';
let webview;
let vehicleChanges = {};
let previousVehicle = {};
let previousColors = {};
let colors = {};

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
    webview.on('vehicle:FetchModList', buildModList);
    webview.on('vehicle:UpdateLocalVehicle', updateLocalVehicle);
    webview.on('vehicle:UpdateColor', updateVehicleColor);
    webview.on('vehicle:SaveChanges', saveChanges);
    webview.on('vehicle:Exit', exit);
    getPreviousVehicleMods();
}

function getPreviousVehicleMods() {
    previousVehicle = {};

    const vehID = alt.Player.local.vehicle.scriptID;
    native.setVehicleModKit(vehID, 0);
    for (let i = 0; i <= 48; i++) {
        let value = native.getVehicleMod(vehID, i);
        previousVehicle[i] = value;
    }

    getPreviousVehicleColors(vehID);
}

function getPreviousVehicleColors(vehID) {
    const [_null1, pr, pg, pb] = native.getVehicleCustomPrimaryColour(
        vehID,
        undefined,
        undefined,
        undefined
    );

    const [_null2, sr, sg, sb] = native.getVehicleCustomSecondaryColour(
        vehID,
        undefined,
        undefined,
        undefined
    );

    const [_null3, primaryPaintType] = native.getVehicleModColor1(
        vehID,
        undefined,
        undefined,
        undefined
    );

    const [_null4, secondaryPaintType] = native.getVehicleModColor2(
        vehID,
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

function buildModList() {
    if (!webview) return;
    showCursor(true);
    const vehID = alt.Player.local.vehicle.scriptID;

    native.setVehicleModKit(vehID, 0);

    for (let i = 0; i <= 48; i++) {
        if (i === 17 || i === 19 || i === 21) continue;

        const mod = {
            index: i,
            numMods: 0,
            modLabels: [],
            slotName: modTypes[i],
            active: native.getVehicleMod(vehID, i)
        };

        mod.numMods = isToggleMod(i) ? 1 : native.getNumVehicleMods(vehID, i); // 18 = Turbo

        if (mod.numMods >= 1) {
            for (let modIndex = -1; modIndex < mod.numMods; modIndex++) {
                let displayName = native.getLabelText(
                    native.getModTextLabel(vehID, i, modIndex)
                );

                if (isToggleMod(i)) {
                    if (modIndex === -1) displayName = `Disabled`;
                    if (displayName === 'NULL') displayName = `Enabled`;
                } else if (isTuningMod(i)) {
                    if (modIndex === -1) displayName = `Stock`;
                    if (displayName === 'NULL') displayName = `Level ${modIndex}`;
                } else {
                    if (modIndex === -1) displayName = 'Stock';
                    if (displayName === 'NULL') displayName = `Mod #${modIndex}`;
                }

                if (
                    modIndex !== -1 &&
                    (modIndex === native.getVehicleMod(vehID, i) ||
                        native.isToggleModOn(vehID, i))
                ) {
                    displayName = `${displayName}*`;
                    mod.modLabels.unshift({
                        displayName,
                        index: modIndex
                    });
                    continue;
                }

                mod.modLabels.push({
                    displayName,
                    index: modIndex
                });
            }

            if (mod.modLabels.length > 0) {
                webview.emit('parseMod', JSON.stringify(mod));
            }
        }
    }

    webview.emit('parseColors', previousColors);
}

function isToggleMod(modNumber) {
    return modNumber >= 17 && modNumber <= 22;
}

function isTuningMod(modNumber) {
    return modNumber >= 11 && modNumber <= 16;
}

function updateLocalVehicle({ modType, modIndex }) {
    const veh = alt.Player.local.vehicle.scriptID;

    native.setVehicleModKit(veh, 0);
    native.setVehicleMod(veh, modType, modIndex, false);
    vehicleChanges[modType] = modIndex;
}

function updateVehicleColor(
    primaryPaintType,
    secondaryPaintType,
    primaryColor,
    secondaryColor
) {
    const veh = alt.Player.local.vehicle.scriptID;

    /**
     * 0: Normal
     * 1: Metallic
     * 2: Pearl
     * 3: Matte
     * 4: Metal
     * 5: Chrome
     */

    native.setVehicleModColor1(veh, primaryPaintType, 0, 0);
    native.setVehicleCustomPrimaryColour(
        veh,
        primaryColor.r,
        primaryColor.g,
        primaryColor.b
    );

    native.setVehicleModColor2(veh, secondaryPaintType, 0, 0);
    native.setVehicleCustomSecondaryColour(
        veh,
        secondaryColor.r,
        secondaryColor.g,
        secondaryColor.b
    );

    // This is stored at the top of the file.
    // Set it; when the player enters the shop.
    colors = {
        primary: {
            type: primaryPaintType,
            color: primaryColor
        },
        secondary: {
            type: secondaryPaintType,
            color: secondaryColor
        }
    };
}

function saveChanges() {
    webview.close();
    webview = undefined;

    Object.keys(vehicleChanges).forEach(key => {
        previousVehicle[key] = vehicleChanges[key];
    });

    /*
    Object.keys(previousVehicle).forEach(key => {
        if (previousVehicle[key] === -1) delete previousVehicle[key];
    });
    */

    /*
        Need to add colors into this event here; for the previousVehicle data.
        The server-side mod distribution; also needs to handle this.
    */
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
