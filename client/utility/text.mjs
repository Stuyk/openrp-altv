import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->utility->text.mjs');

alt.onServer('text:Animated', (text, duration) => {
    let pos = alt.Player.local.pos;
    let alpha = 255;
    const interval = alt.setInterval(() => {
        if (alpha <= 0) alpha = 0;
        drawText3d(
            text,
            pos.x,
            pos.y,
            pos.z + 1,
            0.5,
            4,
            255,
            255,
            255,
            alpha,
            true,
            false
        );
        pos.z += 0.0075;
        alpha -= 3;
    }, 0);
    alt.setTimeout(() => {
        alt.clearInterval(interval);
    }, duration);
});

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

export function drawText2d(
    msg,
    x,
    y,
    scale,
    fontType,
    r,
    g,
    b,
    a,
    useOutline = true,
    useDropShadow = true,
    layer = 0,
    align = 0
) {
    //native.setScriptGfxDrawOrder(layer);
    native.beginTextCommandDisplayText('STRING');
    native.addTextComponentSubstringPlayerName(msg);
    native.setTextFont(fontType);
    native.setTextScale(1, scale);
    native.setTextWrap(0.0, 1.0);
    native.setTextCentre(true);
    native.setTextColour(r, g, b, a);
    native.setTextJustification(align);

    if (useOutline) native.setTextOutline();

    if (useDropShadow) native.setTextDropShadow();

    native.endTextCommandDisplayText(x, y);
}
