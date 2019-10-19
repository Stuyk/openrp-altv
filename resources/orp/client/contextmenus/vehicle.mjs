import * as alt from 'alt';
import * as native from 'natives';
//import { ContextMenu } from '/client/systems/context.mjs';
import { distance } from '/client/utility/vector.mjs';
import { appendContextItem, setContextTitle } from '/client/panels/hud.mjs';

alt.log('Loaded: client->contextmenus->vehicle.mjs');

const doorNames = [
    'Driver Door',
    'Passenger Door',
    'Driver Rear Door',
    'Passenger Back Door'
];

alt.on('menu:Vehicle', ent => {
    if (alt.Player.local.getMeta('arrest')) return;
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

    if (alt.Player.local.isRepairing) {
        const dist = distance(
            alt.Player.local.pos,
            native.getEntityCoords(ent, false)
        );
        if (dist <= 4) {
            appendContextItem('Repair Vehicle', true, 'vehicle:RepairVehicle', { vehicle });
            alt.Player.local.isRepairing = false;
        }
    }

    setContextTitle(name);
});

alt.on('submenu:VehicleDoors', data => {
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
