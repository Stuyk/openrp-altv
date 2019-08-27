import * as alt from 'alt';

console.log('Loaded: systems->time.mjs');

let lastDate = new Date();

export function setTimeForNewPlayer(player) {
    player.setDateTime(
        lastDate.getDay(),
        lastDate.getMonth(),
        lastDate.getFullYear(),
        lastDate.getHours(),
        lastDate.getMinutes(),
        lastDate.getSeconds()
    );
}

setInterval(() => {
    alt.Player.all.forEach(player => {
        lastDate = new Date();
        setTimeForNewPlayer(player);
    });
}, 60000);
