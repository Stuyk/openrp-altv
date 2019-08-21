import * as alt from 'alt';
import * as native from 'natives';

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

export function playAnimation(dictionary, name, durationInMS, flag) {
    let res = loadAnim(dictionary);

    res.then(() => {
        alt.log('triggered');
        native.taskPlayAnim(
            alt.Player.local.scriptID,
            dictionary,
            name,
            1,
            -1,
            durationInMS,
            flag,
            1.0,
            true,
            true,
            true
        );
    });
}

async function loadAnim(dict) {
    return new Promise((resolve, reject) => {
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
