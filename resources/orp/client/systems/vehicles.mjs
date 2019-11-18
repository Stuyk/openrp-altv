import * as alt from 'alt';
import * as native from 'natives';
import { createBlip } from '/client/blips/bliphelper.mjs';

alt.log('Loaded: client->systems->vehicles.mjs');

alt.on('gameEntityCreate', entity => {
    if (entity.constructor.name === 'Vehicle') {
        const primaryPaint = entity.getSyncedMeta('primaryPaint');
        const secondaryPaint = entity.getSyncedMeta('secondaryPaint');
        const primaryColor = entity.getSyncedMeta('primaryColor');
        const secondaryColor = entity.getSyncedMeta('secondaryColor');
        const wheels = entity.getSyncedMeta('vehicleWheels');

        alt.setTimeout(() => {
            if (primaryPaint) {
                native.setVehicleModColor1(entity.scriptID, primaryPaint, 0, 0);
            }

            if (secondaryPaint) {
                native.setVehicleModColor2(entity.scriptID, secondaryPaint, 0, 0);
            }

            if (primaryColor) {
                native.setVehicleCustomPrimaryColour(
                    entity.scriptID,
                    primaryColor.r,
                    primaryColor.g,
                    primaryColor.b
                );
            }

            if (secondaryColor) {
                native.setVehicleCustomSecondaryColour(
                    entity.scriptID,
                    secondaryColor.r,
                    secondaryColor.g,
                    secondaryColor.b
                );
            }

            if (wheels) {
                native.setVehicleMod(entity.scriptID, 23, wheels, true);
                native.setVehicleMod(entity.scriptID, 24, wheels, true);
            }
        }, 1000);
    }
});

alt.on('syncedMetaChange', (entity, key, value) => {
    if (entity.constructor.name !== 'Vehicle') return;

    alt.setTimeout(() => {
        if (key === 'primaryPaint') {
            native.setVehicleModColor1(entity.scriptID, value, 0, 0);
        }

        if (key === 'secondaryPaint') {
            native.setVehicleModColor2(entity.scriptID, value, 0, 0);
        }

        if (key === 'primaryColor') {
            native.setVehicleCustomPrimaryColour(
                entity.scriptID,
                value.r,
                value.g,
                value.b
            );
        }

        if (key === 'secondaryColor') {
            native.setVehicleCustomSecondaryColour(
                entity.scriptID,
                value.r,
                value.g,
                value.b
            );
        }

        if (key === 'vehicleWheels') {
            native.setVehicleMod(entity.scriptID, 23, value, true);
            native.setVehicleMod(entity.scriptID, 24, value, true);
        }
    }, 1000);
});

alt.on('vehicle:Fuel', () => {
    alt.Player.local.isFueling = true;
    alt.emit(
        'chat:Send',
        `{00FF00} Select the vehicle you want to fuel with your cursor.`
    );
    alt.Player.local.fuelLocation = alt.Player.local.pos;
});

alt.onServer('vehicle:Rotate', (vehicle, rot) => {
    alt.nextTick(() => {
        native.setEntityCollision(vehicle.scriptID, false, true);
        alt.setTimeout(() => {
            native.setEntityHeading(vehicle.scriptID, rot);
            native.setEntityCollision(vehicle.scriptID, true, true);
        }, 100);
    });
});

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
    native.setVehicleDeformationFixed(vehicle.scriptID);
    native.setVehicleUndriveable(vehicle.scriptID, false);
}

export function startEngine(value) {
    if (!alt.Player.local.vehicle) return;
    native.setVehicleEngineOn(alt.Player.local.vehicle.scriptID, value, false, true);
}

// Called from a keybind.
export function toggleEngine() {
    if (!alt.Player.local.vehicle) return;

    const pedInSeat = native.getPedInVehicleSeat(alt.Player.local.vehicle.scriptID, -1);
    if (pedInSeat !== alt.Player.local.scriptID) return;

    alt.emitServer('vehicle:ToggleEngine', { vehicle: alt.Player.local.vehicle });
}

// Called from a keybind.
export function toggleLock() {
    const vehicle = native.getVehiclePedIsIn(alt.Player.local.scriptID, 1);
    if (!native.doesEntityExist(vehicle)) return;

    let veh = alt.Vehicle.all.find(x => x.scriptID === vehicle);
    if (!veh) return;

    if (alt.Player.local.vehicle) return;

    alt.emitServer('vehicle:ToggleLock', { vehicle: alt.Player.local.vehicle });
}

// Called from a keybind.
export function keepEngineRunning() {
    alt.emitServer('vehicle:LeaveEngineRunning');
}

export function forceEngineOn(vehicle) {
    native.setVehicleEngineOn(vehicle.scriptID, true, true, false);
}

export function killEngine(vehicle) {
    native.setVehicleEngineOn(vehicle.scriptID, false, true, false);
}

// Called when the user locks their vehicle.
export function soundHorn(vehicle, state) {
    let id = vehicle.scriptID;

    let count = 0;
    if (state) {
        let interval = alt.setInterval(() => {
            native.setVehicleLights(id, 0);
            native.startVehicleHorn(id, 50, native.getHashKey('HELDDOWN'), false);
            native.setVehicleLights(id, 2);
            if (count == 1) {
                alt.clearInterval(interval);
            }
            native.setVehicleLights(id, 0);
            count += 1;
        }, 100);
    } else {
        native.setVehicleLights(id, 2);
        native.startVehicleHorn(id, 50, native.getHashKey('HELDDOWN'), false);

        alt.setTimeout(() => {
            native.setVehicleLights(id, 0);
        }, 50);
    }
}

export function setIntoVehicle(vehicle) {
    alt.setTimeout(() => {
        native.setPedIntoVehicle(alt.Player.local.scriptID, vehicle.scriptID, -1);
    }, 200);
}

export function trackVehicle(pos) {
    const blip = createBlip('temporary', pos, 1, 61, 'A Vehicle Tracker');
    alt.emit(
        'hud:QueueNotification',
        `A pink blip was placed on your map named 'A Vehicle Tracker'`
    );

    alt.setTimeout(() => {
        try {
            native.removeBlip(blip);
        } catch (err) {
            console.log('Locate vehicle blip could not be destroyed.');
        }
    }, 15000);
}
