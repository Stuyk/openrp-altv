import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->hud->hud.mjs');
const [_, width, height] = native.getActiveScreenResolution(0, 0);

/**
 * This file was modified to only update less important hud stats once in a while.
 * This should help with setInterval a bit.
 */

let isMetric = false;
let cooldown = Date.now() + 5000;
let lastSpeed;

alt.on('meta:Changed', loadInterval);

// Only starts the interval after the player has logged in.
function loadInterval(key, value) {
    if (key !== 'loggedin') return;
    const intervalID = alt.setInterval(startInterval, 50);
    alt.log(`hud.mjs ${intervalID}`);
    alt.off('meta:Changed', loadInterval);
}

function startInterval() {
    if (Date.now() > cooldown) {
        cooldown = Date.now() + 2500;
        isMetric = native.getProfileSetting(227);
        native.invalidateIdleCam();
        updateLocation();
        return;
    }

    if (!alt.Player.local.vehicle) {
        alt.emit('hud:IsInVehicle', false);

        const sprintTime = native.getPlayerSprintStaminaRemaining(
            alt.Player.local.scriptID
        );
        const timeLeft = 100 - sprintTime;
        if (timeLeft !== 100) {
            const progress = timeLeft / 100;
            alt.nextTick(() => {
                alt.emit('hud:SetKeyValue', 'sprintbar', progress);
            });
        }

        if (lastSpeed !== '') {
            lastSpeed = '';
            alt.nextTick(() => {
                alt.emit('hud:SetKeyValue', 'speed', lastSpeed);
            });
        }
    } else {
        alt.emit('hud:IsInVehicle', true);
        vehicleHudData();
        vehicleFuel();
    }
}

function vehicleFuel() {
    const veh = alt.Player.local.vehicle;
    let fuel = veh.getSyncedMeta('fuel');
    let basefuel = veh.getSyncedMeta('basefuel');
    if (fuel === null) fuel = 1;
    if (basefuel === null) basefuel = 100;
    const currentFuel = fuel / basefuel;
    alt.emit('hud:SetKeyValue', 'fuel', currentFuel);
}

function vehicleHudData() {
    let speed = native.getEntitySpeed(alt.Player.local.vehicle.scriptID);
    lastSpeed = `${(speed * (isMetric ? 3.6 : 2.236936)).toFixed(2)}${
        isMetric ? 'KM/H' : 'MPH'
    }`;
    alt.nextTick(() => {
        alt.emit('hud:SetKeyValue', 'speed', lastSpeed);
    });
}

function updateLocation() {
    let [_unk, _street, _cross] = native.getStreetNameAtCoord(
        alt.Player.local.pos.x,
        alt.Player.local.pos.y,
        alt.Player.local.pos.z
    );

    let zone = native.getLabelText(
        native.getNameOfZone(
            alt.Player.local.pos.x,
            alt.Player.local.pos.y,
            alt.Player.local.pos.z
        )
    );

    let streetName = native.getStreetNameFromHashKey(_street);

    alt.nextTick(() => {
        alt.emit('hud:SetKeyValue', 'location', `${zone}, ${streetName}`);
    });
}
