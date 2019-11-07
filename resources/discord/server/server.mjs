import * as alt from 'alt';
import { getEndpoint } from './express.mjs';

alt.on('playerConnect', (player) => {
    player.loginTimeout = Date.now() + 60000 * 2;
    alt.emitClient(player, 'discord:Connect', `${getEndpoint()}`);
});

alt.onClient('discord:ParseLogin', (client, token) => {
    alt.emit('discord:Login', client, token);
});

alt.on('discord:Login', (player, data) => {
    delete player.loginTimeout;
    player.authenticated = true;

    alt.emitClient(player, 'discord:LoggedIn');
    alt.emit('discord:FinishLogin', player, token);
})

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