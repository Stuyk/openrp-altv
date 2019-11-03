import * as alt from 'alt';
import { getEndPoint } from './express.mjs';
import { fetchPlayerByIP } from './utility.mjs';

alt.on('playerConnect', player => {
    player.loginTimeout = Date.now() + 60000 * 2;
    alt.emitClient(player, 'discord:Request', `${getEndPoint()}`);
});

alt.on('discord:ParseLogin', (ip, data) => {
    const target = fetchPlayerByIP(ip);

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
    }
});

setInterval(() => {
    alt.Player.all.forEach(player => {
        if (player.loginTimeout !== undefined && player.loginTimeout !== null) {
            alt.emit('discord:CheckLoginTimeout', player);
        }
    });
}, 60000);
