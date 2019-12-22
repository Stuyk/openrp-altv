import * as alt from 'alt';
import { randPosAround, distance } from '../utility/vector.js';
import { Config } from '../configuration/config.js';
import { actionMessage } from '../chat/chat.js';
import { Items, BaseItems } from '../configuration/items.js';

/**
 * Vehicles are spawned when the player logs in.
 * Vehicles that are owned by the user have blips for 30 seconds when tracking.
 * Vehicle positions are saved after the player exits the vehicle.
 * Only the owner can save the position; after they exit.
 */
export function spawnVehicle(player, veh, newVehicle = false) {
    let pos = undefined;
    let rot = undefined;

    try {
        pos = JSON.parse(veh.position);
    } catch (err) {
        pos = randPosAround(player.pos, 3);
    }

    try {
        rot = JSON.parse(veh.rotation);
    } catch (err) {
        rot = new alt.Vector3(0, 0, 0);
    }

    const vehicle = new alt.Vehicle(veh.model, pos.x, pos.y, pos.z, rot.x, rot.y, rot.z);
    vehicle.startTick()

    if (vehicle.modKitsCount >= 1) {
        vehicle.modKit = 1;
    }

    // Set the data on the vehicle from the DB.
    vehicle.data = { ...veh };
    vehicle.engineOn = false;
    vehicle.lockState = 2;
    vehicle.fuel = vehicle.data.fuel ? parseFloat(vehicle.data.fuel) : Config.vehicleBaseFuel;
    vehicle.setSyncedMeta('fuel', vehicle.fuel);
    vehicle.setSyncedMeta('id', veh.id);
    vehicle.dimension = parseInt(vehicle.data.dimension);
    vehicle.sync();

    // Synchronize the Stats
    /*
        bodyHealth: vehicle.bodyHealth,
        engineHealth: vehicle.engineHealth,
        lockState: vehicle.lockState
    */
    if (veh.stats !== null) {
        let stats = JSON.parse(veh.stats);
        vehicle.bodyHealth = stats.bodyHealth;
        vehicle.engineHealth = stats.engineHealth;
        vehicle.lockState = stats.lockState;
        vehicle.syncCustom();
    }

    if (newVehicle) {
        alt.emitClient(player, 'vehicle:SetIntoVehicle', vehicle);
        vehicle.lockState = 1;
    }

    player.vehicles.push(vehicle);
    player.emitMeta('vehicles', player.vehicles);

    const vehData = [];
    player.vehicles.forEach(currentVehicle => {
        vehData.push(JSON.stringify(currentVehicle.data));
    });
    player.emitMeta('vehiclesMeta', vehData);
    return vehicle;
}

/*
0 = Front Left Door
1 = Front Right Door
2 = Back Left Door
3 = Back Right Door
4 = Hood
5 = Trunk
6 = Back
7 = Back2
*/

export function closeAllDoors(player, data) {
    const vehicle = data.vehicle;
    if (!vehicle) {
        return;
    }


    const dist = distance(player.pos, vehicle.pos);
    if (dist > 5) return;
    if (vehicle.lockState === 2) {
        if (player.vehicles === undefined) return;

        if (!player.vehicles.includes(vehicle)) {
            player.send('{FF0000} This vehicle does not belong to you.');
            return;
        }

        player.send('{00FF00} Your vehicle was unlocked.');
        vehicle.lockState = 1;
    }

    for (let i = 0; i < 6; i++) {
        vehicle.toggleDoor(player, i, true);
    }
}

export function toggleDoor(player, data) {
    const vehicle = data.vehicle;
    if (!vehicle) {
        return;
    }

    const id = data.door;
    const dist = distance(player.pos, vehicle.pos);
    if (dist > 5) return;

    if (vehicle.lockState === 2) {
        if (player.vehicles === undefined) return;

        if (!player.vehicles.includes(vehicle)) {
            player.send('{FF0000} This vehicle does not belong to you.');
            return;
        }

        player.send('{00FF00} Your vehicle was unlocked.');
        vehicle.lockState = 1;
    }

    vehicle.toggleDoor(player, id);
}

export function toggleLock(player, data) {
    let vehicle = data.vehicle;
    if (!vehicle) {
        vehicle = alt.Vehicle.all.find(veh => {
            if (veh && distance(veh.pos, player.pos) <= 4) return veh;
        });
    }
    if (!vehicle) return;
    const dist = distance(player.pos, vehicle.pos);
    if (dist > 5) {
        player.send(`{FF0000} You're too far away to toggle the lock.`);
        return;
    }

    if (player.vehicles === undefined) return;

    if (!player.vehicles.includes(vehicle)) return;

    if (vehicle.lockState >= 2 || vehicle.lockState === 0) {
        vehicle.lockState = 1; // Unlocked
        player.send('Your vehicle is now unlocked.');

        if (!player.vehicle) {
            alt.emitClient(null, 'vehicle:SoundHorn', vehicle, false);
        }
    } else {
        vehicle.lockState = 2; // Locked
        player.send('Your vehicle is now locked.');

        if (!player.vehicle) {
            alt.emitClient(null, 'vehicle:SoundHorn', vehicle, true);
        }
    }
}

export function toggleEngine(player, data) {
    const vehicle = data.vehicle;
    if (!player.vehicle) return;
    if (player.vehicles === undefined) return;
    if (!player.vehicles.includes(vehicle)) return;

    vehicle.isEngineOn = !vehicle.isEngineOn ? true : !vehicle.isEngineOn;

    if (vehicle.fuel <= 0) {
        vehicle.isEngineOn = false;
        vehicle.setSyncedMeta('fuel', 0);
        player.send(`{FFFF00} You are out of fuel.`);
    }

    alt.emitClient(player, 'vehicle:StartEngine', vehicle.isEngineOn);
}

export function toggleSafetyLock(player, data) {
    const vehicle = data.vehicle;

    if (!player.vehicle) return;

    if (player.vehicles === undefined) return;

    if (!player.vehicles.includes(vehicle)) return;

    if (vehicle.lockState === 4) {
        vehicle.lockState = 2;
        player.send('Safety Lock was turned off.');
    } else {
        vehicle.lockState = 4;
        player.send('Safety Lock was turned on.');
    }
}

export function saveChanges(player, vehicle, jsonData) {
    if (!vehicle.saveCustom) return;

    if (!player.vehicles || !player.vehicles.includes(vehicle)) {
        player.send('This is not your vehicle; you cannot modify it.');
        vehicle.syncCustom();
        return;
    }

    vehicle.saveCustom(jsonData);
    player.playAudio('buy');
}

export function fillFuel(player, data) {
    const vehicle = data.vehicle;
    if (!vehicle) return;
    if (vehicle.isBeingFilled) {
        player.notify('Vehicle is already being filled up.');
        return;
    }

    const fuelUntilFull = 100 - vehicle.fuel;
    const perUnit = 0.5;
    const totalCost = fuelUntilFull * perUnit;

    if (isNaN(fuelUntilFull)) return;
    if (isNaN(totalCost)) return;

    let msg = `{FFFF00} Total Cost was: {00FF00} $${totalCost}.`;
    if (!player.subCash(totalCost)) {
        player.send(msg + `{FF0000}You do not have enough cash.`);
        return;
    }
    player.send(msg);
    actionMessage(player, 'Begins to fill the closest vehicle with fuel.');
    vehicle.isBeingFilled = {
        time: Date.now() + Config.vehicleFuelTime,
        player
    };
}

export function checkFuel(player, data) {
    const vehicle = data.vehicle;
    if (!vehicle) return;
    player.send(`{FFFF00}Remaining Fuel: {FFFFFF}${vehicle.fuel}`);
}

export function repairVehicle(player, data) {
    if (!player.subItem('repairkit', 1)) {
        player.notify('You do not have a repair kit.');
        return;
    }

    const vehicle = data.vehicle;
    if (!vehicle) {
        return;
    }

    actionMessage(player, 'Begins repairing the vehicle...');
    player.playAnimation('missmechanic', 'work2_base', -1, 1);
    vehicle.isBeingRepaired = {
        time: Date.now() + Config.vehicleRepairTime,
        player
    };
}

export function trackVehicle(player, id) {
    if (!player.vehicles) return;
    const vehicle = player.vehicles.find(x => x.data.id === id);
    if (!vehicle) return;
    alt.emitClient(player, 'vehicle:TrackVehicle', vehicle.pos);
}

export function destroyVehicle(player, id) {
    if (!player.vehicles) return;
    const vehicle = player.vehicles.find(x => parseInt(x.data.id) === id);
    if (!vehicle) return;
    player.send(`{FFFF00} Confirm Destroying your ${vehicle.data.model} at ${id}.`);
    player.send(`{FFFF00} Type: {FFFFFF}/destroyvehicle`);
    player.destroyVehicle = id;
}

export function refuelVehicle(player, data) {
    const vehicle = data.vehicle;
    if (!vehicle) return;
    if (vehicle.fuel >= 100) {
        player.notify('The tank is already full.');
        return;
    }

    actionMessage(player, 'Begins to fill the vehicle with fuel.');
    vehicle.isBeingFilled = {
        time: Date.now() + Config.vehicleFuelTime,
        player
    };
}

export function leaveEngineRunning(player) {
    if (!player) return;

    const vehicle = player.lastVehicle;
    if (!vehicle) return;

    const dist = distance(player.pos, vehicle.pos);
    if (dist > 5) return;

    if (player.vehicles === undefined) return;
    if (!player.vehicles.includes(vehicle)) return;
    vehicle.isEngineOn = true;
    alt.emitClient(null, 'vehicle:ForceEngineOn', vehicle);
}

alt.onClient('vehicle:AccessInventory', (player, data) => {
    if (!player) {
        return;
    }

    const vehicle = data.vehicle;
    if (!vehicle) {
        return;
    }

    if (!player.vehicles.includes(vehicle)) {
        if (vehicle.lockState !== 1) {
            player.notify('This is not your vehicle. The trunk is locked.');
            return;
        }
    }

    player.accessingInventory = vehicle;
    const inventory = vehicle.getInventory();
    alt.emitClient(player, 'vehicle:AccessTrunk', vehicle, inventory);
});

alt.onClient('vehicle:AddItemToVehicle', (player, hash, vehicle) => {
    const index = player.inventory.findIndex(item => item && item.hash === hash);
    if (index <= -1) {
        player.notify('Could not add item to vehicle inventory.');
        return;
    }

    if (vehicle.getSlots() >= 27) {
        alt.emitClient(
            null,
            'vehicle:SyncInventory',
            vehicle,
            vehicle.getInventory(),
            true
        );
        return;
    }

    const item = { ...player.inventory[index] };

    if (Items[item.key]) {
        const baseKey = Items[item.key].base;
        if (!BaseItems[baseKey].abilities.sell) {
            alt.emitClient(
                null,
                'vehicle:SyncInventory',
                vehicle,
                vehicle.getInventory(),
                true
            );
            return;
        }
    }

    if (!player.subItemByHash(hash, item.quantity)) {
        player.notify('Could not find that item in your inventory.');
        return;
    }

    if (!vehicle.addItem(item)) {
        player.notify('Could not add item to vehicle.');
        return;
    }

    const inventory = vehicle.getInventory();
    alt.emitClient(null, 'vehicle:SyncInventory', vehicle, inventory);
});

alt.onClient('vehicle:RemoveItemFromVehicle', (player, hash, vehicle) => {
    const inventory = vehicle.getInventory();
    const index = inventory.findIndex(item => item && item.hash === hash);

    if (index <= -1) {
        player.notify('Could not find that item.');
        alt.emitClient(null, 'vehicle:SyncInventory', vehicle, inventory);
        return;
    }

    if (player.getNullSlots() === 0) {
        player.notify('You have no room in in your inventory.');
        return;
    }

    const item = { ...inventory[index] };
    // key, quantity, props = {}, skipStackable = false, skipSave = false, name = undefined, icon = undefined, keyOverride = undefined
    if (
        !player.addItem(
            item.key,
            item.quantity,
            item.props,
            false,
            false,
            item.name,
            item.icon,
            item.key
        )
    ) {
        player.notify('Failed to add item to inventory.');
        return;
    }

    if (!vehicle.subItemByHash(item.hash)) {
        return;
    }

    alt.emitClient(null, 'vehicle:SyncInventory', vehicle, vehicle.getInventory());
});
