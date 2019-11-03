import * as alt from 'alt';
import { getEndPoint, getRemoteIP } from './express.mjs';

alt.on('playerConnect', player => {
    player.loginTimeout = Date.now() + 60000 * 2;
    pendingLogins.push(player);
    alt.emitClient(player, 'discord:Request', `${getEndPoint()}`);
});

alt.on('discord:ParseLogin', (ip, data) => {
    const remoteIP = getRemoteIP();
    const target = alt.Player.all.find(player => {
        if (player) {
            const userID = player.getMeta('id');
            if (!userID && player.ip === ip) {
                return player;
            }

            if (ip.includes('127.0.0.1')) {
                if (!userID && player.ip.includes(remoteIP)) {
                    return player;
                }
            }
        }
    });

    if (!target) {
        console.log('A user was not able to login.');
        return;
    }

    alt.emit('discord:Login', target, data);
});

alt.on('discord:Login', (player, data) => {
    delete player.loginTimeout;
    player.authenticated = true;
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
