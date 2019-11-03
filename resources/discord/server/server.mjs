import * as alt from 'alt';
import { getEndPoint } from './express.mjs';

let pendingLogins = [];

alt.on('playerConnect', player => {
    player.loginTimeout = Date.now() + 60000 * 2;
    pendingLogins.push(player);
    alt.emitClient(player, 'discord:Request', `${getEndPoint()}`);
});

alt.on('discord:ParseLogin', (ip, data) => {
    const index = pendingLogins.findIndex(player => {
        if (player && player.ip === ip) return player;
    });

    if (index <= -1) {
        console.log('A user was not able to login.');
        return;
    }

    const player = pendingLogins[index];
    pendingLogins.splice(index, 1);
    alt.emit('discord:Login', player, data);
});

alt.on('discord:Login', (player, data) => {
    delete player.loginTimeout;
    alt.emitClient(player, 'discord:LoggedIn');
    alt.emit('discord:FinishLogin', player, data);
});

alt.on('discord:CheckLoginTimeout', player => {
    if (!player) return;
    if (Date.now() > player.loginTimeout) {
        player.kick();
        alt.log(`${player.name} was kicked for not logging in.`);
        const index = pendingLogins.findIndex(player);
        if (index <= -1) return;
        pendingLogins.splice(index, 1);
    }
});

setInterval(() => {
    alt.Player.all.forEach(player => {
        if (player.loginTimeout !== undefined && player.loginTimeout !== null) {
            alt.emit('discord:CheckLoginTimeout', player);
        }
    });
}, 60000);
