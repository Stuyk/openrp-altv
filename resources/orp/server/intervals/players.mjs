import * as alt from 'alt';

const time = 60000;
let nextSavePlayerPlayTime = Date.now() + 60000 * 5;

setInterval(() => {
    for (let i = 0; i < alt.Player.all.length; i++) {
        if (!alt.Player.all[i].data) continue;
        const player = alt.Player.all[i];
        const now = Date.now();

        if (player.saveData) player.saveData();

        if (nextSavePlayerPlayTime < now) {
            nextSavePlayerPlayTime = now + 60000 * 5;
            if (player.updatePlayingTime) player.updatePlayingTime();
        }

        if (
            now > parseInt(player.data.arrestTime) &&
            parseInt(player.data.arrestTime) !== -1
        ) {
            if (player.setArrestTime) player.setArrestTime(-1);
        }

        if (player.reviveTime) {
            if (now > player.reviveTime && player.revive) {
                player.revive();
            }
        }
    }
}, time);
