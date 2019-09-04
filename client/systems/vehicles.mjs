import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->systems->vehicles.mjs');

export function toggleDoor(vehicle, id, state) {
    if (state) {
        native.setVehicleDoorOpen(vehicle.scriptID, id, false, false);
    } else {
        native.setVehicleDoorShut(vehicle.scriptID, id, false);
    }
}

export function eject(slowly) {
    if (!slowly) {
        native.taskLeaveVehicle(
            alt.Player.local.scriptID,
            alt.Player.local.vehicle.scriptID,
            16
        );
    } else {
        native.taskLeaveVehicle(
            alt.Player.local.scriptID,
            alt.Player.local.vehicle.scriptID,
            1
        );
    }
}

export function repair(vehicle) {
    native.setVehicleFixed(vehicle.scriptID);
}

export function disableEngineControl() {
    native.setPedConfigFlag(alt.Player.local.scriptID, 429, 1);
}

// Disable seat shuffle.
alt.on('update', disableSeatShuffle);

function disableSeatShuffle() {
    if (!native.isPedInAnyVehicle(alt.Player.local.scriptID, undefined)) return;
    let vehicle = native.getVehiclePedIsIn(alt.Player.local.scriptID, undefined);

    let passenger = native.getPedInVehicleSeat(vehicle, 0);

    if (!native.getIsTaskActive(passenger, 165)) return;

    if (native.isVehicleSeatFree(vehicle, -1)) {
        if (passenger === alt.Player.local.scriptID) {
            native.setPedIntoVehicle(alt.Player.local.scriptID, vehicle, 0);
        }
    }
}
