import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->hud->hud.mjs');

/**
 * This file was modified to only update less important hud stats once in a while.
 * This should help with setInterval a bit.
 */

let isMetric = false;
let cooldown = Date.now() + 5000;

alt.on('meta:Changed', loadInterval);

// Only starts the interval after the player has logged in.
function loadInterval(key, value) {
    if (key !== 'loggedin') return;
    const intervalID = alt.setInterval(startInterval, 0);
    alt.log(`hud.mjs ${intervalID}`);
    alt.off('meta:Changed', loadInterval);
}

function startInterval() {
    if (Date.now() > cooldown) {
        native.invalidateIdleCam();
        cooldown = Date.now() + 2500;
        isMetric = native.getProfileSetting(227);
        updateLocation();
    }

    if (alt.Player.local.vehicle) {
        vehicleHudData();
    } else {
        alt.emit('hud:SetSpeed', '');
    }

    if (!alt.Player.local.vehicle) {
        const sprintTime = native.getPlayerSprintStaminaRemaining(
            alt.Player.local.scriptID
        );
        const timeLeft = 100 - sprintTime;
        if (timeLeft !== 100) {
            sprint(timeLeft);
        }
    }
}

function sprint(sprintTimeLeft) {
    let progress = sprintTimeLeft / 100;
    native.drawRect(progress / 2, 0, progress, 0.01, 255, 255, 255, 150);
}

function vehicleHudData() {
    let speed = native.getEntitySpeed(alt.Player.local.vehicle.scriptID);
    let actualSpeed = `${(speed * (isMetric ? 3.6 : 2.236936)).toFixed(2)}${
        isMetric ? 'KM/H' : 'MPH'
    }`;
    alt.emit('hud:SetSpeed', actualSpeed);
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

    alt.emit('hud:SetLocation', `${zone}, ${streetName}`);
}
