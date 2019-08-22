import * as alt from 'alt';
import * as utilityVector from '../utility/vector.mjs';
import * as utilityVehicle from '../utility/vehicle.mjs';

console.log('Loaded: systems->vehicles.mjs');

/**
 * Vehicles are spawned when the player logs in.
 * Vehicles that are owned by the user have blips for 30 seconds when tracking.
 * Vehicle positions are saved after the player exits the vehicle.
 * Only the owner can save the position; after they exit.
 */
alt.on('vehicles:SpawnVehicle', (player, veh) => {
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

    let vehicle = new alt.Vehicle(
        veh.model,
        pos.x,
        pos.y,
        pos.z,
        rot.x,
        rot.y,
        rot.z
    );

    vehicle.setHealthDataBase64(veh.health);

    // Setup extended functions for the new vehicle.
    utilityVehicle.setupVehicleFunctions(vehicle);

    // Set the data on the vehicle from the DB.
    vehicle.data = veh;

    // Add modifictions from the 'stats' JSON here.
    // TODO

    // Create the vehicles array for the player.
    if (!Array.isArray(player.vehicles)) {
        player.vehicles = [];
    }

    // Keep track of player vehicles.
    player.vehicles.push(vehicle);
});
