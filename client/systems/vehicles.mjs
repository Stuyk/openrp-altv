import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->systems->vehicles.mjs');

alt.on('meta:Changed', startInterval);

function startInterval(key, value) {
    if (key !== 'pedflags') return;
    alt.off('meta:Changed', startInterval);
    // Disable Vehicle Engine Startup
    // Disable Shuffling to Driver Seat - Doesn't work?
    // Disable Motorcylce Helmet
    native.setPedConfigFlag(alt.Player.local.scriptID, 429, 1);
    native.setPedConfigFlag(alt.Player.local.scriptID, 184, 1);
    native.setPedConfigFlag(alt.Player.local.scriptID, 35, 1);
    alt.setInterval(vehicleInterval, 100);
}

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

export function startEngine(value) {
    if (!alt.Player.local.vehicle) return;
    native.setVehicleEngineOn(alt.Player.local.vehicle.scriptID, value, false, true);
}

function vehicleInterval() {
    if (!alt.Player.local.vehicle) return;

    //const passenger = native.getPedInVehicleSeat(alt.Player.local.vehicle.scriptID, 0);

    /*
    if (native.getIsTaskActive(passenger, 165)) {
        for (let i = 0; i < 800; i++) {
            let value = native.getPedConfigFlag(passenger, i, undefined);
            //alt.log(`Flag: ${i}, ${value}`);
        }
        
        if (native.isVehicleSeatFree(alt.Player.local.vehicle.scriptID, -1)) {
            if (passenger === alt.Player.local.scriptID) {
                native.setPedIntoVehicle(
                    alt.Player.local.scriptID,
                    alt.Player.local.vehicle.scriptID,
                    0
                );
            }
        }
        
    }
    */

    if (
        native.getPedInVehicleSeat(alt.Player.local.vehicle.scriptID, -1) ===
        alt.Player.local.scriptID
    ) {
        if (native.getIsVehicleEngineRunning(alt.Player.local.scriptID)) {
            let interval = alt.setInterval(() => {
                if (!alt.Player.local.vehicle) {
                    native.setVehicleEngineOn(
                        alt.Player.local.vehicle.scriptID,
                        true,
                        true,
                        true
                    );
                    alt.clearInterval(interval);
                }
            }, 100);
        }
    }
}
