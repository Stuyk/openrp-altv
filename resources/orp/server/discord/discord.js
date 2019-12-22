import * as alt from 'alt';
import { generateHash } from '../utility/encryption.js';
import config from './configuration.json';

alt.on('playerConnect', player => {
    player.loginTimeout = Date.now() + 60000 * 3;
    player.loginTimer = setTimeout(() => {
        loginTimer(player);
    }, 60000 * 3);

    player.token = generateHash(
        JSON.stringify(
            `${player.name}${player.ip}${Math.floor(Math.random() * 5000000000)}`
        )
    );
    alt.emitClient(player, 'discord:Connect', player.token, config.discord);
});

function loginTimer(player) {
    if (!player) {
        return;
    }

    if (!player.valid) {
        return;
    }

    if (!player.loginTimeout) {
        return;
    }

    if (Date.now() > player.loginTimeout) {
        try {
            player.kick();
            alt.log(`${player.name} was kicked for not logging in.`);
        } catch (err) {
            return;
        }
    }
}
