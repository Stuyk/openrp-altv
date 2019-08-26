import * as alt from 'alt';
import * as utilityVector from '../utility/vector.mjs';
import * as utilityVehicle from '../utility/vehicle.mjs';
import * as configurationVehicles from '../configuration/vehicles.mjs';

console.log('Loaded: systems->vehicles.mjs');
let VehicleMap = new Map();

/**
 * Vehicles are spawned when the player logs in.
 * Vehicles that are owned by the user have blips for 30 seconds when tracking.
 * Vehicle positions are saved after the player exits the vehicle.
 * Only the owner can save the position; after they exit.
 */
alt.on('vehicles:SpawnVehicle', (player, veh) => {
    // Existing Vehicle; Player Rejoined
    if (VehicleMap.has(veh.id)) {
        let mappedVehicle = VehicleMap.get(veh.id);

        if (!Array.isArray(player.vehicles)) {
            player.vehicles = [];
            player.vehicles.push(mappedVehicle);
            return;
        }

        if (player.vehicles.includes(mappedVehicle)) return;
        player.vehicles.push(mappedVehicle);
        return;
    }

    // Otherwise Create / Spawn the Vehicle
    let pos = undefined;
    let rot = undefined;

    try {
        pos = JSON.parse(veh.position);
    } catch (err) {
        pos = utilityVector.randPosAround(player.pos, 3);
    }

    try {
        rot = JSON.parse(veh.rotation);
    } catch (err) {
        rot = new alt.Vector3(0, 0, 0);
    }

    let vehicle = new alt.Vehicle(veh.model, pos.x, pos.y, pos.z, rot.x, rot.y, rot.z);

    // Setup extended functions for the new vehicle.
    utilityVehicle.setupVehicleFunctions(vehicle);

    // Set the data on the vehicle from the DB.
    vehicle.data = veh;
    vehicle.setEngineOff();

    // Synchronize the Stats
    /*
        appearance: vehicle.getAppearanceDataBase64(),
        damageStatus: vehicle.getDamageStatusBase64(),
        health: vehicle.getHealthDataBase64(),
        lockState: vehicle.lockState,
        scriptData: vehicle.getScriptDataBase64()
    */
    if (veh.stats !== null) {
        let stats = JSON.parse(veh.stats);

        vehicle.setAppearanceDataBase64(stats.appearance);
        vehicle.setDamageStatusBase64(stats.damageStatus);
        vehicle.setHealthDataBase64(stats.health);
        vehicle.setScriptDataBase64(stats.scriptData);
        vehicle.lockState = stats.lockState;
    }

    // Set the vehicle into the map.
    VehicleMap.set(veh.id, vehicle);

    // Create the vehicles array for the player.
    if (!Array.isArray(player.vehicles)) {
        player.vehicles = [];
        player.vehicles.push(vehicle);
    } else {
        // Keep track of player vehicles.
        player.vehicles.push(vehicle);
    }
});

// Save Vehicle Data
setInterval(() => {
    // Saves All Vehicles Every 5 Minutes
    for (let key in VehicleMap) {
        VehicleMap[key].saveVehicleData();
    }
}, configurationVehicles.Configuration.saveTimeInMS);

export function toggleDoor(player, vehicle, id) {
    if (vehicle.lockState === 2) {
        // Doesn't own the car.
        if (!Array.isArray(player.vehicles)) return;

        if (!player.vehicles.includes(vehicle)) {
            player.sendMessage('This is not your vehicle.');
            return;
        }

        player.sendMessage('Your vehicle is now unlocked.');
        vehicle.lockState = 1;
        return;
    }

    let state = vehicle.getDoorState(id);
    if (state === 0) {
        alt.emitClient(null, 'vehicle:OpenDoor', vehicle, id);
    } else {
        /*
        if (id >= 4) {
            alt.emitClient(null, 'vehicle:ShutAllDoors', vehicle);
            return;
        }
        */

        alt.emitClient(null, 'vehicle:CloseDoor', vehicle, id);
    }
}

export function engineOn(player) {
    if (!player.vehicle) return;

    if (!Array.isArray(player.vehicles)) return;

    if (!player.vehicles.includes(player.vehicle)) {
        player.sendMessage('This is not your vehicle.');
        return;
    }

    player.vehicle.engineOn = true;
    player.vehicle.setEngineOn();
}

export function engineOff(player) {
    if (!player.vehicle) return;

    if (!Array.isArray(player.vehicles)) return;

    if (!player.vehicles.includes(player.vehicle)) {
        player.sendMessage('This is not your vehicle.');
        return;
    }

    player.vehicle.engineOn = false;
    player.vehicle.setEngineOff();
}

export function lockAllDoors(player, vehicle) {
    if (!Array.isArray(player.vehicles)) return;

    if (!player.vehicles.includes(vehicle)) {
        player.sendMessage(`Can't lock a car you don't own.`);
        return;
    }

    if (vehicle.lockState === 1) {
        vehicle.lockState = 2;
        vehicle.honkHorn(2, 100);
        player.sendMessage('Vehicle was locked.');
    } else {
        vehicle.lockState = 1;
        vehicle.honkHorn(1, 100);
        player.sendMessage('Vehicle was unlocked.');
    }
}
