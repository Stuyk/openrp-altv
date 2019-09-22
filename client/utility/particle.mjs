import * as alt from 'alt';
import * as native from 'natives';

alt.onServer('tryParticle', (dict, name, duration, scale) => {
    playParticleFX(
        dict,
        name,
        duration,
        scale,
        alt.Player.local.pos.x,
        alt.Player.local.pos.y,
        alt.Player.local.pos.z
    );
});

export function playParticleFX(dict, name, duration, scale, x, y, z) {
    const particles = [];
    const interval = alt.setInterval(() => {
        native.requestPtfxAsset(dict);
        if (!native.hasPtfxAssetLoaded(dict));
        native.useParticleFxAsset(dict);

        let particle;
        if (name.includes('scr')) {
            native.startParticleFxLoopedOnEntity(
                name,
                alt.Player.local.scriptID,
                0,
                0,
                0,
                0,
                0,
                0,
                scale,
                false,
                false,
                false
            );
        } else {
            particle = native.startParticleFxLoopedAtCoord(
                name,
                x,
                y,
                z,
                0,
                0,
                0,
                scale,
                false,
                false,
                false,
                false
            );
        }

        particles.push(particle);
    }, 0);

    alt.setTimeout(() => {
        particles.forEach(particle => {
            native.stopParticleFxLooped(particle, true);
        });
        alt.clearInterval(interval);
    }, duration);
}
