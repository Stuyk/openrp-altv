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
    alt.setInterval(disableCombat, 0);
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

    if (_hash === -1569615261) {
        native.disableControlAction(0, 24, true);
    }
}
