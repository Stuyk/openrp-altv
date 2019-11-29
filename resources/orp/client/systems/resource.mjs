import * as alt from 'alt';
import * as native from 'natives';
import { playAudio } from '/client/systems/sound.mjs';
import { playParticleFX } from '/client/utility/particle.mjs';

const resources = {
    tree: {},
    rock: {}
};

let cooldown = Date.now();

const effectData = {
    tree: {
        sound: 'chop',
        particle: {
            dict: 'core',
            name: 'ent_dst_wood_splinter',
            duration: 25,
            scale: 0.8,
            offset: {
                x: 0,
                y: 1,
                z: 0
            }
        },
        animation: {
            dict: 'melee@large_wpn@streamed_core',
            name: 'car_side_attack_a',
            flag: 1,
            duration: 2400
        },
        ticks: [0.21]
    },
    rock: {
        sound: 'dirt',
        particle: {
            dict: 'core',
            name: 'ent_dst_rocks',
            duration: 50,
            scale: 1,
            offset: {
                x: 0,
                y: 0.8,
                z: -1
            }
        },
        animation: {
            dict: 'melee@large_wpn@streamed_core',
            name: 'ground_attack_on_spot',
            flag: 1,
            duration: 2400
        },
        ticks: [0.35]
    }
};

alt.onServer('resource:Update', (type, coords, resourceData) => {
    alt.log(`${type} / ${JSON.stringify(coords)} / ${JSON.stringify(resourceData)}`);

    if (!resources[type]) {
        return;
    }

    resources[type][JSON.stringify(coords)] = {
        amount: resourceData.amount
    };

    alt.log(JSON.stringify(resources, null, '\t'));
});

export function getResource(type, coords) {
    if (!resources[type]) {
        return undefined;
    }

    return resources[type][JSON.stringify(coords)];
}

alt.on('resource:BeginResourceFarming', data => {
    const coords = data.coords;
    const type = data.type;
    const scriptID = alt.Player.local.scriptID;
    native.taskTurnPedToFaceCoord(scriptID, coords.x, coords.y, coords.z, 1000);
    alt.emitServer('resource:BeginFarming', coords, type);
});

alt.on('resource:StopFarming', () => {
    native.clearPedTasks(alt.Player.local.scriptID);
    native.freezeEntityPosition(alt.Player.local.scriptID, false);
});

alt.onServer('resource:FarmTick', (coords, type) => {
    native.taskTurnPedToFaceCoord(
        alt.Player.local.scriptID,
        coords.x,
        coords.y,
        coords.z,
        200
    );

    alt.setTimeout(() => {
        native.freezeEntityPosition(alt.Player.local.scriptID, true);
        const fx = effectData[type];
        const time = fx.animation.duration;

        // data.dict, data.name, data.duration, data.flag
        alt.emit('animation:Play', fx.animation);
        const currentInterval = alt.setInterval(() => {
            if (Date.now() < cooldown) {
                return;
            }

            cooldown = Date.now() + 50;
            const animTime =
                native
                    .getEntityAnimCurrentTime(
                        alt.Player.local.scriptID,
                        fx.animation.dict,
                        fx.animation.name
                    )
                    .toFixed(2) * 1;

            fx.ticks.forEach(tick => {
                if (animTime !== tick) {
                    return;
                }

                if (fx.sound !== '') {
                    // Might have to add cooldown, might not.
                    playAudio(fx.sound);
                    alt.emitServer('audio:Sync3D', fx.sound);
                }

                const particle = fx.particle;
                if (particle) {
                    playParticleFX(
                        particle.dict,
                        particle.name,
                        particle.duration,
                        particle.scale,
                        particle.offset.x,
                        particle.offset.y,
                        particle.offset.z
                    );
                }
            });
        }, 3);

        alt.setTimeout(() => {
            alt.clearInterval(currentInterval);
            native.freezeEntityPosition(alt.Player.local.scriptID, false);
        }, time);
    }, 200);
});
