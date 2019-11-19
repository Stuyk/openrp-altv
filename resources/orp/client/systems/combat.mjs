import * as alt from 'alt';
import * as native from 'natives';

alt.on('meta:Changed', startInterval);

const disableControls = [
    //
    37 // Weapon Wheel
];

function startInterval(key, value) {
    if (key !== 'pedflags') return;
    alt.off('meta:Changed', startInterval);

    const intervalID = alt.setInterval(disableCombat, 0);
    alt.log(`combat.mjs ${intervalID}`);
}

function disableCombat() {
    // Disable Tab
    disableControls.forEach(key => {
        native.disableControlAction(0, key, true);
    });

    const [_unk, _hash] = native.getCurrentPedWeapon(
        alt.Player.local.scriptID,
        undefined,
        undefined
    );

    if (_hash === -1569615261 || _hash === 911657153) {
        native.disableControlAction(0, 24, true);
        native.disableControlAction(0, 140, true);
        native.disableControlAction(0, 141, true);
        native.disableControlAction(0, 142, true);
    } else {
        native.disableControlAction(0, 140, true);
        native.disableControlAction(0, 141, true);
        native.disableControlAction(0, 142, true);
    }
}
