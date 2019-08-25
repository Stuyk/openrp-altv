import * as alt from 'alt';

setInterval(() => {
    alt.Player.all.forEach(player => {
        /*let date = new Date();
        player.setDateTime(
            date.getDay(),
            date.getMonth(),
            date.getFullYear(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        );
        */

        player.setDateTime(25, 25, 2019, 12, 0, 0);
    });
}, 100000);
