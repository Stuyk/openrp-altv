import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';

console.log('Loaded: utility->vehicle.mjs');

// Load the database handler.
const db = new SQL();

export function setupVehicleFunctions(vehicle, isSaveable = true) {
    // ======================================
    // Saving Functionality
    if (isSaveable) {
        vehicle.save = () => {
            db.upsertData(vehicle.data, 'Vehicle', res => {});
        };

        // Save only a specific field.
        vehicle.saveField = (id, fieldName, fieldValue) => {
            db.updatePartialData(id, { [fieldName]: fieldValue }, 'Vehicle', () => {});
        };

        vehicle.saveVehicleData = () => {
            vehicle.saveField(vehicle.data.id, 'position', JSON.stringify(vehicle.pos));
            vehicle.saveField(vehicle.data.id, 'rotation', JSON.stringify(vehicle.rot));

            let vehicleData = {
                appearance: vehicle.getAppearanceDataBase64(),
                damageStatus: vehicle.getDamageStatusBase64(),
                health: vehicle.getHealthDataBase64(),
                lockState: vehicle.lockState,
                scriptData: vehicle.getScriptDataBase64()
            };

            vehicle.saveField(vehicle.data.id, 'stats', JSON.stringify(vehicleData));
        };

        // Save the position of the vehicle.
        vehicle.savePosition = () => {
            vehicle.saveField(vehicle.data.id, 'position', JSON.stringify(vehicle.pos));
        };

        // Save the rotation of the vehicle.
        vehicle.saveRotation = () => {
            vehicle.saveField(vehicle.data.id, 'rotation', JSON.stringify(vehicle.rot));
        };

        vehicle.despawnVehicle = () => {
            vehicle.saveVehicleData();
            vehicle.destroy();
        };

        // vehicle.data.customization
        vehicle.saveCustom = json => {
            vehicle.data.customization = json;
            vehicle.saveField(
                vehicle.data.id,
                'customization',
                vehicle.data.customization
            );
            vehicle.syncCustom();
        };

        vehicle.syncCustom = () => {
            if (!vehicle.data.customization) return;
            let mods = JSON.parse(vehicle.data.customization);
            Object.keys(mods).forEach(key => {
                if (key !== 'colors') {
                    vehicle.modKit = 1;
                    let index = parseInt(key);
                    let value = parseInt(mods[key]) + 1;
                    try {
                        vehicle.setMod(index, value);
                    } catch (e) {
                        console.log(
                            `Mod: ${index} could not be applied with value ${value}`
                        );
                    }
                    return;
                }

                if (key === 'colors') {
                    if (mods[key].primary) {
                        vehicle.setSyncedMeta('primaryPaint', mods[key].primary.type);
                        vehicle.setSyncedMeta('primaryColor', mods[key].primary.color);
                    }

                    if (mods[key].secondary) {
                        vehicle.setSyncedMeta('secondaryPaint', mods[key].secondary.type);
                        vehicle.setSyncedMeta(
                            'secondaryColor',
                            mods[key].secondary.color
                        );
                    }
                    return;
                }
            });
        };
    }

    vehicle.honkHorn = (times, duration) => {
        alt.emitClient(null, 'vehicle:HonkHorn', vehicle, times, duration);
    };

    vehicle.repair = () => {
        alt.emitClient(null, 'vehicle:Repair', vehicle);
    };

    vehicle.toggleDoor = (player, id) => {
        if (vehicle.doorStates === undefined) {
            vehicle.doorStates = {
                0: false,
                1: false,
                2: false,
                3: false,
                4: false,
                5: false
            };
        }

        // Toggle
        vehicle.doorStates[id] = !vehicle.doorStates[id];
        alt.emitClient(player, 'vehicle:ToggleDoor', vehicle, id, vehicle.doorStates[id]);
    };
}
