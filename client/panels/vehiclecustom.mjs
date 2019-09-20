import * as alt from 'alt';
import * as native from 'natives';
import { View } from '/client/utility/view.mjs';

const url = 'http://resource/client/html/vehiclecustom/index.html';
let webview;
let vehicleChanges = {};
let previousVehicle = {};

export function showDialogue() {
    if (!webview) {
        webview = new View();
    }

    if (alt.Player.local.getMeta('viewOpen')) return;

    // Setup Webview
    webview.open(url, true);
    webview.on('vehicle:FetchModList', buildModList);
    webview.on('vehicle:UpdateLocalVehicle', updateLocalVehicle);
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
}

function buildModList() {
    const vehID = alt.Player.local.vehicle.scriptID;
    native.setVehicleModKit(vehID, 0);

    for (let i = 0; i <= 48; i++) {
        const mod = {
            index: i,
            numMods: 0,
            modLabels: []
        };
        mod.numMods = native.getNumVehicleMods(vehID, i);

        if (mod.numMods >= 1) {
            for (let modIndex = 0; modIndex < mod.numMods; modIndex++) {
                const displayName = native.getLabelText(
                    native.getModTextLabel(vehID, i, modIndex)
                );
                if (displayName !== 'NULL') {
                    mod.modLabels.push({
                        displayName,
                        index: modIndex
                    });
                }
            }

            if (mod.modLabels.length > 0) {
                webview.emit('parseMod', JSON.stringify(mod));
            }
        }
    }
}

function updateLocalVehicle({ modType, modIndex }) {
    const veh = alt.Player.local.vehicle.scriptID;

    if (modType === 'color') {
        native.setVehicleCustomPrimaryColour(
            vehicle_number,
            modIndex.r,
            modIndex.g,
            modIndex.b
        );

        vehicleChanges[modType] = modIndex;
        return;
    }

    if (modType === 'color2') {
        native.native.setVehicleCustomSecondaryColour(
            vehicle_number,
            modIndex.r,
            modIndex.g,
            modIndex.b
        );

        vehicleChanges[modType] = modIndex;
        return;
    }

    native.setVehicleModKit(veh, 0);
    native.setVehicleMod(veh, modType, modIndex, false);
    vehicleChanges[modType] = modIndex;
}

function saveChanges() {
    webview.close();
    webview = undefined;

    Object.keys(vehicleChanges).forEach(key => {
        previousVehicle[key] = vehicleChanges[key];
    });

    Object.keys(previousVehicle).forEach(key => {
        if (previousVehicle[key] === -1) delete previousVehicle[key];
    });

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

    Object.keys(previousVehicle).forEach(key => {
        native.setVehicleMod(
            alt.Player.local.vehicle.scriptID,
            key,
            previousVehicle[key],
            false
        );
    });
}
