import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: utility->text.mjs');

export function drawText3d(
    msg,
    x,
    y,
    z,
    scale,
    fontType,
    r,
    g,
    b,
    a,
    useOutline = true,
    useDropShadow = true,
    layer = 0
) {
    native.setDrawOrigin(x, y, z, 0);
    native.setUiLayer(layer);
    native.beginTextCommandDisplayText('STRING');
    native.addTextComponentSubstringPlayerName(msg);
    native.setTextFont(fontType);
    native.setTextScale(1, scale);
    native.setTextWrap(0.0, 1.0);
    native.setTextCentre(true);
    native.setTextColour(r, g, b, a);

    if (useOutline) native.setTextOutline();

    if (useDropShadow) native.setTextDropShadow();

    native.endTextCommandDisplayText(0, 0);
    native.clearDrawOrigin();
}
