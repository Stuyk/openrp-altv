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
        db.updatePartialData(
            id,
            { [fieldName]: fieldValue },
            'Vehicle',
            () => {}
        );
    };

    // Save the position of the vehicle.
    vehicle.savePosition = () => {
        vehicle.saveField(
            vehicle.data.id,
            'position',
            JSON.stringify(vehicle.pos)
        );
    };

    // Save the rotation of the vehicle.
    vehicle.saveRotation = () => {
        vehicle.saveField(
            vehicle.data.id,
            'rotation',
            JSON.stringify(vehicle.rot)
        );
    };

    vehicle.saveHealth = () => {
        vehicle.saveField(
            vehicle.data.id,
            'health',
            vehicle.getHealthDataBase64()
        );
    };

    // Update stats.
    vehicle.saveStats = stats => {
        vehicle.data.stats = JSON.stringify(stats);
        vehicle.saveField(
            vehicle.data.id,
            'stats',
            JSON.stringify(vehicle.data.stats)
        );
    };

    vehicle.despawnVehicle = () => {
        vehicle.saveHealth();
        vehicle.savePosition();
        vehicle.saveRotation();
        vehicle.destroy();
    };
}
