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

    if (vehicle.modKitsCount >= 1) {
        vehicle.modKit = 1;
    }

    // Setup extended functions for the new vehicle.
    utilityVehicle.setupVehicleFunctions(vehicle);

    // Set the data on the vehicle from the DB.
    vehicle.data = veh;
    vehicle.engineOn = false;
    vehicle.lockState = 2;

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
        vehicle.syncCustom();
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

export function toggleDoor(player, vehicle, id) {
    const dist = utilityVector.distance(player.pos, vehicle.pos);
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

export function toggleLock(player, vehicle) {
    const dist = utilityVector.distance(player.pos, vehicle.pos);
    if (dist > 5) {
        player.send(`{FF0000} You're too far away to toggle the lock.`);
        return;
    }

    if (player.vehicles === undefined) return;

    if (!player.vehicles.includes(vehicle)) return;

    if (vehicle.lockState === 2) {
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

export function toggleEngine(player, vehicle) {
    if (!player.vehicle) return;

    if (player.vehicles === undefined) return;

    if (!player.vehicles.includes(vehicle)) return;

    if (!vehicle.isEngineOn) {
        vehicle.isEngineOn = true;
    } else {
        vehicle.isEngineOn = !vehicle.isEngineOn;
    }

    alt.emitClient(player, 'vehicle:StartEngine', vehicle.isEngineOn);
}

export function toggleSafetyLock(player, vehicle) {
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
    if (!player.vehicles || !player.vehicles.includes(vehicle)) {
        player.send('This is not your vehicle; you cannot modify it.');
        vehicle.syncCustom();
        return;
    }

    console.log(jsonData);

    vehicle.saveCustom(jsonData);
    player.playAudio('buy');
}
