import * as alt from 'alt';

const time = 60000;
let nextSavePlayerPlayTime = Date.now() + 60000 * 5;

setInterval(() => {
    console.log('Saving ALL player data.');
    for (let i = 0; i < alt.Player.all.length; i++) {
        if (!alt.Player.all[i].data) continue;
        const player = alt.Player.all[i];

        player.saveData();
        if (nextSavePlayerPlayTime < Date.now()) {
            nextSavePlayerPlayTime = Date.now() + 60000 * 5;
            player.updatePlayingTime();
        }

        if (
            Date.now() > parseInt(player.data.arrestTime) &&
            parseInt(player.data.arrestTime) !== -1
        ) {
            player.setArrestTime(-1);
        }
    }
}, time);
