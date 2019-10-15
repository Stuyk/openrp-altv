import * as alt from 'alt';
import * as native from 'natives';
import { ContextMenu } from '/client/systems/context.mjs';
import { distance } from '/client/utility/vector.mjs';

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

    if (alt.Player.local.vehicle) {
        let vehClass = native.getVehicleClass(alt.Player.local.vehicle.scriptID);
        let items = [
            {
                label: name
            },
            {
                label: 'Toggle Lock',
                isServer: true,
                event: 'vehicle:ToggleLock'
            },
            {
                label: 'Toggle Engine',
                isServer: true,
                event: 'vehicle:ToggleEngine'
            },
            {
                label: 'Check Fuel',
                isServer: true,
                event: 'vehicle:CheckFuel'
            },
            {
                label: 'Safety Lock',
                isServer: true,
                event: 'vehicle:SafetyLock'
            }
        ];

        if (vehClass === 8) {
            items.pop();
        }

        if (alt.Player.local.isFueling) {
            alt.Player.local.isFueling = false;
            items.push({
                label: 'Fuel Vehicle',
                isServer: true,
                event: 'vehicle:FillFuel'
            });
        }

        new ContextMenu(ent, items);
        return;
    }

    let nonSuperItems = [
        {
            label: name
        },
        {
            label: 'Toggle Lock',
            isServer: true,
            event: 'vehicle:ToggleLock'
        },
        {
            label: 'Check Fuel',
            isServer: true,
            event: 'vehicle:CheckFuel'
        },
        {
            label: 'Doors Menu',
            isServer: false,
            event: 'submenu:VehicleDoors'
        }
    ];

    if (alt.Player.local.isFueling) {
        const dist = distance(
            alt.Player.local.fuelLocation,
            native.getEntityCoords(ent, false)
        );
        alt.Player.local.isFueling = false;
        if (dist <= 4) {
            nonSuperItems.push({
                label: 'Fuel Vehicle',
                isServer: true,
                event: 'vehicle:FillFuel'
            });
        }
    }

    new ContextMenu(ent, nonSuperItems);
});

alt.on('submenu:VehicleDoors', ent => {
    const doorCount = native.getVehicleMaxNumberOfPassengers(ent) + 1;

    let items = [
        {
            label: 'Door Control'
        },
        {
            label: 'Trunk',
            isServer: true,
            event: 'vehicle:ToggleDoor',
            data: 5
        },
        {
            label: 'Hood',
            isServer: true,
            event: 'vehicle:ToggleDoor',
            data: 4
        }
    ];

    for (let i = 0; i < doorCount; i++) {
        items.push({
            label: doorNames[i],
            isServer: true,
            event: 'vehicle:ToggleDoor',
            data: i
        });
    }

    new ContextMenu(ent, items);
});
