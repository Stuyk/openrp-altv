import * as alt from 'alt';

const time = 60000;
let nextSavePlayerPlayTime = Date.now() + 60000 * 5;

setInterval(() => {
    console.log('Saving ALL player data.');
    for (let i = 0; i < alt.Player.all.length; i++) {
        if (!alt.Player.all[i].data) continue;
        alt.Player.all[i].saveData();

        if (nextSavePlayerPlayTime < Date.now()) {
            nextSavePlayerPlayTime = Date.now() + 60000 * 5;
            alt.Player.all[i].updatePlayingTime();
        }
    }
}, time);
