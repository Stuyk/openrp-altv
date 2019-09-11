import * as alt from 'alt';
import * as native from 'natives';
import { View } from 'client/utility/view.mjs';

let webview;
let vehicleChanges = {};

export function showDialogue() {
    alt.log('Called');

    if (!alt.Player.local.getSyncedMeta('loggedin')) return;
    if (webview) return;
    webview = new View('http://resource/client/html/vehiclecustom/index.html', true);
    webview.on('fetchModList', buildModList);
    webview.on('updateLocalVehicle', updateLocalVehicle);
    webview.on('saveChanges', saveVehicle);
}

function buildModList() {
    const vehID = alt.Player.local.vehicle.scriptID;
    native.setVehicleModKit(vehID, 0);

    for (let i = 0; i <= 49; i++) {
        const mod = {
            index: i,
            numMods: 0,
            modLabels: []
        };
        mod.numMods = native.getNumVehicleMods(vehID, i);
        mod.slotName = native.getModSlotName(vehID, i);

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
                webview.emit(webview, 'parseMod', JSON.stringify(mod));
            }
        }
    }
}

function updateLocalVehicle({ modType, modIndex }) {
    const veh = alt.Player.local.vehicle.scriptID;

    native.setVehicleModKit(veh, 0);
    native.setVehicleMod(veh, modType, modIndex, false);

    vehicleChanges[modType] = modIndex;
}

function saveVehicle() {
    // const veh = alt.Player.local.vehicle.scriptID;

    alt.log(JSON.stringify(vehicleChanges));

    // native.setVehicleModKit(veh, 1);
    alt.emitServer('vehicle:modify', JSON.stringify(vehicleChanges));
}
