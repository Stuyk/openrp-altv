import * as alt from 'alt';
import * as native from 'natives';

alt.onServer('explosion:Play', playExplosion);

function playExplosion(pos, type, size = 1) {
    alt.log('explode?');
    native.addExplosion(pos.x, pos.y, pos.z, type, size, true, false, true, true);
}
