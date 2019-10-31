import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';
import { distance } from '../utility/vector.mjs';
import { Config } from '../configuration/config.mjs';

// Load the database handler.
const db = new SQL();

const notVehicles = [
    'bmx',
    'cruiser',
    'fixter',
    'scorcher',
    'tribike',
    'tribike2',
    'tribike3'
];

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
            vehicle.saveField(vehicle.data.id, 'fuel', vehicle.fuel);

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

        vehicle.saveDimension = number => {
            vehicle.data.dimension = number;
            vehicle.saveField(vehicle.data.id, 'dimension', number);
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

    vehicle.toggleDoor = (player, id, closeAll = false) => {
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
        vehicle.doorStates[id] = closeAll ? false : !vehicle.doorStates[id];
        alt.emitClient(player, 'vehicle:ToggleDoor', vehicle, id, vehicle.doorStates[id]);
    };

    const included = notVehicles.find(veh => {
        const hash = alt.hash(veh);
        if (hash === vehicle.model) return veh;
    });

    if (included) {
        return;
    }

    vehicle.syncFuel = () => {
        const currentFuel = vehicle.fuel;

        if (!vehicle.lastPosition) {
            vehicle.lastPosition = vehicle.pos;
        }

        const dist = distance(vehicle.pos, vehicle.lastPosition);
        if (dist > 10 && vehicle.driver) {
            const fuelConsumed = dist / Config.vehicleBaseFuel;
            const remainingFuel = currentFuel - fuelConsumed;
            vehicle.lastPosition = vehicle.pos;
            vehicle.fuel = remainingFuel <= 0 ? 0 : remainingFuel;

            if (vehicle.fuel <= 0 && vehicle.isEngineOn) {
                vehicle.isEngineOn = false;
                if (vehicle.driver) {
                    alt.emitClient(vehicle.driver, 'vehicle:StartEngine', false);
                    vehicle.driver.send(`{FFFF00} You are out of fuel.`);
                }
            }
        }

        vehicle.setSyncedMeta('fuel', vehicle.fuel);
        vehicle.setSyncedMeta('basefuel', Config.vehicleBaseFuel);
    };

    vehicle.fillFuel = () => {
        vehicle.fuel = Config.vehicleBaseFuel;
        vehicle.setSyncedMeta('fuel', vehicle.fuel);
        if (vehicle.data) {
            vehicle.saveField(vehicle.data.id, 'fuel', vehicle.fuel);
        }
    };
}

alt.on('orp:VehicleFunc', (...args) => {
    const passedVehicle = args.shift();
    const vehicle = alt.Vehicle.all.find(x => x.id === passedVehicle.id);
    if (!vehicle) {
        console.error('Vehicle was not found from VehicleFunc call.');
        return;
    }

    if (args.length <= 0) return;
    const funcName = args.shift();

    if (!vehicle[funcName]) {
        console.error('That function does not exist for the vehicle.');
        return;
    }

    if (args.length >= 1) {
        vehicle[funcName](args);
    } else {
        vehicle[funcName]();
    }
});
