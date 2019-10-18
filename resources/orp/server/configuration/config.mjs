import * as alt from 'alt';

export const Config = {
    // Max Range of some RP Commands
    maxChatRange: 25,
    maxMeRange: 15,
    maxDoRange: 15,
    maxOocRange: 15,
    // Spawn Location / Camera Point
    registerCamPoint: {
        x: -443.31427001953125,
        y: 1059.4945068359375,
        z: 327.6732177734375
    },
    defaultSpawnPoint: {
        x: 813,
        y: -279,
        z: 66
    },
    // Player Data
    defaultPlayerCash: 100.0, // Starting Cash
    defaultPlayerBank: 1000.0, // Starting Bank
    defaultPlayerReviveTime: 1000 * 20, // 20 Seconds
    defaultPlayerMaxVehicles: 3, // Max Vehicles Per Player
    defaultPlayerPaycheck: 40.0, // Every 'timePaycheckTime' minutes they recieve $40.00. $480/h.
    // Timers
    // - Player
    timePlayingTime: 60000 * 5, // How much time before we save player playing time.
    timePlayerSaveTime: 60000 * 7, // How many minutes before we save all player data.
    timePaycheckTime: 60000 * 5, // Every 5 Minutes
    // - Vehicle
    vehicleSaveTime: 60000 * 5, // 5 Minutes
    vehicleBaseFuel: 100, // Increase this to visit the pump less often.
    vehicleFuelTime: 1000 * 10,
    // Hospital
    hospitalPctFee: 0.02 // Percentage fee for hospital.
};

alt.on('orp:SetConfig', jsonString => {
    const newData = JSON.parse(jsonString);
    Object.keys(newData).forEach(key => {
        if (Config[key]) {
            alt.log(`\r\n Configuration ${key} is already defined. Overwrote it. \r\n`);
            return;
        }
        Config[key] = newData[key];
        alt.log(`Configuration Modified: ${key}`);
    });
});
