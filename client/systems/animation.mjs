import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->systems->animation.mjs');

/*
	Flags need to be added together for desired effects.
	ie. Upper Body + Last Frame = 16 + 2 = 18 <-- This value.
	normal = 0
	repeat = 1
	stop_last_frame = 2
	unk1 = 4
	unk2_air = 8
	upperbody = 16
	enablePlCtrl = 32
	unk3 = 64
	cancelable = 128
	unk4_creature = 256
	unk5_freezePos = 512
	unk6_rot90 = 1024
*/

alt.on('animation:Play', (player, data) => {
    playAnimation(alt.Player.local, data.dict, data.name, data.duration, data.flag);
});

alt.on('animation:Clear', ent => {
    native.clearPedTasks(alt.Player.local.scriptID);
    native.clearPedSecondaryTask(alt.Player.local.scriptID);
});

export function playAnimation(
    player,
    dict,
    name,
    duration,
    flag,
    freezeX = false,
    freezeY = false,
    freezeZ = false
) {
    // Local Player Version
    if (player.scriptID === alt.Player.local.scriptID) {
        if (alt.Player.local.inAnimation) return;
        alt.Player.local.inAnimation = true;
        startAnimation(player, dict, name, duration, flag, freezeX, freezeY, freezeZ);
    } else {
        startAnimation(player, dict, name, duration, flag, freezeX, freezeY, freezeZ);
    }
}

function startAnimation(player, dict, name, duration, flag, frzx, frzy, frzz) {
    if (native.hasAnimDictLoaded(dict)) {
        native.taskPlayAnim(
            player.scriptID,
            dict,
            name,
            1,
            -1,
            duration,
            flag,
            1.0,
            frzx,
            frzy,
            frzz
        );
        return;
    }

    let res = loadAnim(dictionary);
    res.then(() => {
        native.taskPlayAnim(
            player.scriptID,
            dict,
            name,
            1,
            -1,
            duration,
            flag,
            1.0,
            frzx,
            frzy,
            frzz
        );
    });
}

async function loadAnim(dict) {
    return new Promise(resolve => {
        native.requestAnimDict(dict);
        let inter = alt.setInterval(() => {
            if (native.hasAnimDictLoaded(dict)) {
                resolve(true);
                alt.clearInterval(inter);
                return;
            }
        }, 5);
    });
}
