import * as native from 'natives';

export function drawMarker(type, pos, dir, rot, scale, r, g, b, alpha) {
    native.drawMarker(
        type,
        pos.x,
        pos.y,
        pos.z,
        dir.x,
        dir.y,
        dir.z,
        rot.x,
        rot.y,
        rot.z,
        scale.x,
        scale.y,
        scale.z,
        r,
        g,
        b,
        alpha,
        false,
        false,
        2,
        false,
        undefined,
        undefined,
        false
    );
}
