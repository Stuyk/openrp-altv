import * as alt from 'alt';
import * as native from 'natives';

alt.on('meta:Changed', startInterval);

function startInterval(key, value) {
    if (key !== 'pedflags') return;
    alt.off('meta:Changed', startInterval);
    //alt.setInterval(disableCombat, 0);
}

/*
function disableCombat() {
    const [_hash, _unk] = native.getCurrentPedWeapon(
        alt.Player.local.scriptID,
        undefined,
        undefined
    );

    if (_hash === -1569615261) {
       native_d;
    }
}
*/
