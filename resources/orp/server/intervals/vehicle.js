import * as alt from 'alt';
import { Config } from '../configuration/config.js';
import { actionMessage } from '../chat/chat.js';
import { addXP } from '../systems/skills.js';

alt.on('parse:Vehicle', vehicle => {
    if (!vehicle) {
        return;
    }

    setTimeout(() => {
        alt.emit('parse:Vehicle', vehicle);
    }, 10000);

    const now = Date.now();
    if (!vehicle.vehicleSyncFuelTime) {
        vehicle.vehicleSyncFuelTime = Date.now() + Config.vehicleSyncFuelTime;
    } else {
        if (Date.now() > vehicle.vehicleSyncFuelTime) {
            vehicle.vehicleSyncFuelTime = Date.now() + Config.vehicleSyncFuelTime;
            try {
                vehicle.syncFuel();
            } catch (err) {
                alt.log(`Could not sync vehicle fuel.`);
            }
        }
    }

    if (!vehicle.vehicleSaveTime) {
        vehicle.vehicleSaveTime = Date.now() + Config.vehicleSaveTime;
    } else {
        if (Date.now() > vehicle.vehicleSaveTime) {
            vehicle.vehicleSaveTime = Date.now() + Config.vehicleSaveTime;
            if (vehicle.saveVehicleData) {
                try {
                    vehicle.saveVehicleData();
                } catch (err) {
                    alt.log('Could not save vehicle data.');
                }
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

        if (!player.valid) {
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

                addXP(player, 'mechanic', 50);
                actionMessage(player, 'Successfully repairs the vehicle.');
                alt.emitClient(player, 'vehicle:FinishRepair');
                vehicle.repair(player);
                vehicle.isBeingRepaired = undefined;
            } catch (err) {
                console.error('Failed to repair the vehicle.');
            }
        }
    }
});
