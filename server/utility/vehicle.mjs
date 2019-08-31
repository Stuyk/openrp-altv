import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';

console.log('Loaded: utility->vehicle.mjs');

// Load the database handler.
const db = new SQL();

export function setupVehicleFunctions(vehicle) {
    // ======================================
    // Saving Functionality
    vehicle.save = () => {
        db.upsertData(vehicle.data, 'Vehicle', res => {});
    };

    // Save only a specific field.
    vehicle.saveField = (id, fieldName, fieldValue) => {
        db.updatePartialData(id, { [fieldName]: fieldValue }, 'Vehicle', () => {});
    };

    vehicle.saveVehicleData = () => {
        console.log('Saved Vehicle Data');

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

    vehicle.setEngineOn = () => {
        alt.emitClient(null, 'vehicle:EngineOn', vehicle);
    };

    vehicle.setEngineOff = () => {
        alt.emitClient(null, 'vehicle:EngineOff', vehicle);
    };

    vehicle.honkHorn = (times, duration) => {
        alt.emitClient(null, 'vehicle:HonkHorn', vehicle, times, duration);
    };

    vehicle.repair = () => {
        alt.emitClient(null, 'vehicle:Repair', vehicle);
    };
}
