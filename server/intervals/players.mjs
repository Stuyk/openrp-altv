import * as alt from 'alt';

const time = 60000;

setInterval(() => {
    console.log('Saving ALL player data.');
    for (let i = 0; i < alt.Player.all.length; i++) {
        if (!alt.Player.all[i].data) continue;
        alt.Player.all[i].saveData();
    }
}, time);
