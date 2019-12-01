import * as alt from 'alt';
import { Config } from '../configuration/config.mjs';
import { actionMessage } from '../chat/chat.mjs';
import { addXP } from '../systems/skills.mjs';

let nextVehicleSaveTime = Date.now() + Config.vehicleSaveTime;
let handling = false;

setInterval(handleVehicleInterval, 10000);

function handleVehicleInterval() {
    alt.emit('interval:Vehicle');
    if (handling) return;
    handling = true;
    const now = Date.now();
    for (let i = 0; i < alt.Vehicle.all.length; i++) {
        const vehicle = alt.Vehicle.all[i];
        if (!vehicle) continue;
        alt.emit('parse:Vehicle', vehicle, now);
    }

    if (now > nextVehicleSaveTime) {
        nextVehicleSaveTime = now + Config.vehicleSaveTime;
    }

    handling = false;
}

alt.on('parse:Vehicle', (vehicle, now) => {
    // Synchronize Fuel
    if (vehicle.syncFuel) {
        vehicle.syncFuel();
    }

    // Save Vehicles
    if (now > nextVehicleSaveTime) {
        if (vehicle.saveVehicleData) {
            try {
                vehicle.saveVehicleData();
            } catch (err) {
                console.log('Could not save vehicle data.');
            }
        }
    }

    // Check for Refill Update
    if (vehicle.isBeingFilled) {
        if (now > vehicle.isBeingFilled.time) {
            try {
                vehicle.fillFuel();
                if (vehicle.isBeingFilled.player) {
                    actionMessage(
                        vehicle.isBeingFilled.player,
                        'Tops off the tank; and secures the handle to the pump.'
                    );
                }
                vehicle.isBeingFilled = undefined;
            } catch (err) {
                vehicle.isBeingFilled = undefined;
                console.error('Failed to refill tank of vehicle.');
            }
        }
    }

    // Check for Repair Update
    if (vehicle.isBeingRepaired) {
        const player = vehicle.isBeingRepaired.player;
        if (!player) {
            vehicle.isBeingRepaired = undefined;
            return;
        }

        player.playAudio3D(player, 'ratchet');
        if (now > vehicle.isBeingRepaired.time) {
            try {
                if (player.vehicle) {
                    player.notify('You cannot be inside a vehicle while repairing.');
                    vehicle.isBeingRepaired = undefined;
                    return;
                }

                addXP(player, 'mechanic', 25);
                actionMessage(player, 'Successfully repairs the vehicle.');
                alt.emitClient(player, 'vehicle:FinishRepair');
                vehicle.repair();
                vehicle.isBeingRepaired = undefined;
            } catch (err) {
                console.error('Failed to repair the vehicle.');
            }
        }
    }
});
