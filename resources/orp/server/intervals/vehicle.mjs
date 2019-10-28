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
    for (let i = 0; i < alt.Vehicle.all.length; i++) {
        const vehicle = alt.Vehicle.all[i];
        const now = Date.now();
        if (!vehicle) continue;
        alt.emit('parse:Vehicle', vehicle, now);
    }

    handling = false;
}

alt.on('parse:Vehicle', (vehicle, now) => {
    // Synchronize Fuel
    if (vehicle.syncFuel) {
        vehicle.syncFuel();
    }

    // Save Vehicles
    if (Date.now() > nextVehicleSaveTime) {
        nextVehicleSaveTime = Date.now() + Config.vehicleSaveTime;
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
                console.error('Failed to refill tank of vehicle.');
            }
        }
    }

    // Check for Repair Update
    if (vehicle.isBeingRepaired) {
        if (now > vehicle.isBeingRepaired.time) {
            try {
                vehicle.repair();
                if (vehicle.isBeingRepaired.player) {
                    addXP(vehicle.isBeingRepaired.player, 'mechanic', 25);
                    actionMessage(
                        vehicle.isBeingRepaired.player,
                        'Successfully repairs the vehicle.'
                    );
                }
                vehicle.isBeingRepaired = undefined;
            } catch (err) {
                console.error('Failed to repair the vehicle.');
            }
        }
    }
});
