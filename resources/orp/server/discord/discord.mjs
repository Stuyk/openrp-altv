import * as alt from 'alt';
import { generateHash } from '../utility/encryption.mjs';
import config from './configuration.json';

alt.on('playerConnect', player => {
    player.loginTimeout = Date.now() + 60000 * 2;
    player.token = generateHash(
        JSON.stringify(
            `${player.name}${player.ip}${Math.floor(Math.random() * 5000000000)}`
        )
    );
    alt.emitClient(player, 'discord:Connect', player.token, config.discord);
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
