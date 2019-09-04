import * as alt from 'alt';
import * as native from 'natives';

let isMetric = false;

alt.setInterval(() => {
    if (!alt.Player.local.getSyncedMeta('loggedin')) return;
    isMetric = native.getProfileSetting(227);
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
    alt.emit('hud:SetCash', alt.Player.local.getSyncedMeta('cash'));
}, 2500);

alt.setInterval(() => {
    if (alt.Player.local.vehicle) {
        let speed = native.getEntitySpeed(alt.Player.local.vehicle.scriptID);
        let actualSpeed = `${(speed * (isMetric ? 3.6 : 2.236936)).toFixed(2)}${
            isMetric ? 'KM/H' : 'MPH'
        }`;
        alt.emit('hud:SetSpeed', actualSpeed);
    } else {
        alt.emit('hud:SetSpeed', '');
    }
}, 100);
