import * as alt from 'alt';
import * as native from 'natives';

alt.onServer(
    'tryParticle',
    (dict, name, duration, scale, x, y, z, player = undefined) => {
        playParticleFX(dict, name, duration, scale, x, y, z, player);
    }
);

alt.on('playParticleAtCoords', (dict, name, duration, scale, x, y, z) => {
    playParticleFXCoords(dict, name, duration, scale, x, y, z);
});

export function playParticleFXCoords(dict, name, duration, scale, x, y, z) {
    const particles = [];
    if (name.includes('scr')) return; // scr particles break things easily.
    const interval = alt.setInterval(() => {
        native.requestPtfxAsset(dict);
        native.useParticleFxAsset(dict);
        const particle = native.startParticleFxLoopedAtCoord(
            name,
            x,
            y,
            z,
            0,
            0,
            0,
            scale,
            0,
            0,
            0,
            0
        );
        particles.push(particle);
    }, 0);

    alt.setTimeout(() => {
        alt.clearInterval(interval);
        native.stopFireInRange(x, y, z, 10);
        alt.setTimeout(() => {
            particles.forEach(particle => {
                alt.nextTick(() => {
                    native.stopParticleFxLooped(particle, false);
                });
            });
        }, duration * 2);
    }, duration);
}

export function playParticleFX(
    dict,
    name,
    duration,
    scale,
    x = 0,
    y = 0,
    z = 0,
    player = undefined
) {
    const particles = [];
    if (name.includes('scr')) return; // scr particles break things easily.
    const target = player !== undefined ? player : alt.Player.local;
    if (target === alt.Player.local) {
        alt.emitServer('particle:Sync', dict, name, duration, scale, x, y, z);
    }

    const interval = alt.setInterval(() => {
        native.requestPtfxAsset(dict);
        native.useParticleFxAsset(dict);
        const particle = native.startParticleFxLoopedOnEntity(
            name,
            target.scriptID,
            x,
            y,
            z,
            0,
            0,
            0,
            scale,
            false,
            false,
            false
        );
        particles.push(particle);
    }, 0);
    alt.log(`particle.mjs ${interval}`);

    alt.setTimeout(() => {
        alt.clearInterval(interval);
        native.stopFireInRange(target.pos.x, target.pos.y, target.pos.z, 10);
        alt.setTimeout(() => {
            particles.forEach(particle => {
                alt.nextTick(() => {
                    native.stopParticleFxLooped(particle, false);
                });
            });
        }, duration * 2);
    }, duration);
}
