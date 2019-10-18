import * as alt from 'alt';

export const Config = {
    maxChatRange: 25,
    maxMeRange: 15,
    maxDoRange: 15,
    maxOocRange: 15,
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
    defaultPlayerCash: 100.0,
    defaultPlayerBank: 1000.0,
    defaultPlayerReviveTime: 1000 * 20, // 20 Seconds
    defaultPlayerMaxVehicles: 25,
    vehicleBaseFuel: 100,
    vehicleSaveTime: 60000 * 5, // 5 Minutes
    hospitalPctFee: 0.02
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
