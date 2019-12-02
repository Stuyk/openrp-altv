import * as alt from 'alt';
import * as native from 'natives';
//import { ContextMenu } from '/client/systems/context.mjs';
import { distance } from '/client/utility/vector.mjs';
import { appendContextItem, setContextTitle } from '/client/panels/hud.mjs';
import { showCursor } from '/client/utility/cursor.mjs';

alt.log('Loaded: client->contextmenus->vehicle.mjs');

const doorNames = [
    'Driver Door',
    'Passenger Door',
    'Driver Rear Door',
    'Passenger Back Door'
];

alt.on('menu:Vehicle', ent => {
    if (alt.Player.local.getMeta('arrest')) return;

    if (!alt.Player.local.vehicle) {
        const running = native.isPedRunning(alt.Player.local.scriptID);
        const walking = native.isPedWalking(alt.Player.local.scriptID);
        if (!running && !walking) {
            native.taskTurnPedToFaceEntity(alt.Player.local.scriptID, ent, 1000);
        }
    }

    const name = native.getLabelText(
        native.getDisplayNameFromVehicleModel(native.getEntityModel(ent))
    );

    const vehicle = alt.Vehicle.all.find(veh => veh.scriptID === ent);
    if (!vehicle) return;

    if (alt.Player.local.vehicle) {
        appendContextItem('Toggle Lock', true, 'vehicle:ToggleLock', { vehicle });
        appendContextItem('Toggle Engine', true, 'vehicle:ToggleEngine', { vehicle });
        appendContextItem('Check Fuel', true, 'vehicle:CheckFuel', { vehicle });

        const vehClass = native.getVehicleClass(alt.Player.local.vehicle.scriptID);
        if (vehClass !== 8) {
            appendContextItem('Safety Lock', true, 'vehicle:SafetyLock', { vehicle });
        }

        setContextTitle(name);
        return;
    }

    appendContextItem('Toggle Lock', true, 'vehicle:ToggleLock', { vehicle });
    appendContextItem('Check Fuel', true, 'vehicle:CheckFuel', { vehicle });
    appendContextItem('Doors Menu', false, 'submenu:VehicleDoors', { vehicle });

    if (alt.Player.local.isFueling) {
        const dist = distance(
            alt.Player.local.fuelLocation,
            native.getEntityCoords(ent, false)
        );
        alt.Player.local.isFueling = false;
        if (dist <= 4) {
            appendContextItem('Fill Vehicle', true, 'vehicle:FillFuel', { vehicle });
        }
    }

    // RepairKit
    if (alt.Player.local.isRepairing) {
        const boneName = native.getEntityBoneIndexByName(ent, 'engine');
        const coords = native.getWorldPositionOfEntityBone(ent, boneName);
        const dist = distance(alt.Player.local.pos, coords);
        if (dist <= 1.5) {
            appendContextItem('Repair Vehicle', false, 'vehicle:BeginRepairingVehicle', {
                ent,
                coords,
                vehicle
            });
        }
    }

    // Gas Can
    if (alt.Player.local.isUsingGasCan) {
        const dist = distance(alt.Player.local.pos, native.getEntityCoords(ent, false));
        if (dist <= 4) {
            appendContextItem('Refuel with Gas Can', true, 'vehicle:RefuelVehicle', {
                vehicle
            });
            alt.Player.local.isUsingGasCan = false;
        }
    }

    // Trunk
    const boneName = native.getEntityBoneIndexByName(ent, 'boot');
    const coords = native.getWorldPositionOfEntityBone(ent, boneName);
    const dist = distance(alt.Player.local.pos, coords);
    if (dist <= 1.5) {
        appendContextItem('Inventory', true, 'vehicle:AccessInventory', {
            vehicle
        });
    }

    setContextTitle(name);
});

alt.on('submenu:VehicleDoors', data => {
    showCursor(true);
    const doorCount = native.getVehicleMaxNumberOfPassengers(data.vehicle.scriptID) + 1;
    const vehicle = alt.Vehicle.all.find(veh => veh.scriptID === data.vehicle.scriptID);
    if (!vehicle) return;

    appendContextItem('Close All Doors', true, 'vehicle:CloseAllDoors', { vehicle });
    appendContextItem('Trunk', true, 'vehicle:ToggleDoor', { vehicle, door: 5 });
    appendContextItem('Hood', true, 'vehicle:ToggleDoor', { vehicle, door: 4 });

    for (let i = 0; i < doorCount; i++) {
        appendContextItem(doorNames[i], true, 'vehicle:ToggleDoor', { vehicle, door: i });
    }

    setContextTitle('Toggle Door', true);
});
