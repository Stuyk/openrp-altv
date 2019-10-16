import * as chat from '../chat/chat.mjs';
import { Config } from '../configuration/config.mjs';

chat.registerCmd('revive', player => {
    if (!player.data.dead) return;

    if (player.revive) {
        player.send(
            `You will revive in ${(player.reviveTime - Date.now()) / 1000} seconds.`
        );
        return;
    }

    player.reviveTime = Date.now() + 20000;
    player.revive = true;
    player.send('Please wait; you will be revived in twenty seconds.');
});

chat.registerCmd('cancelrevive', player => {
    if (!player.data.dead) return;
    if (!player.revive) return;

    player.revive = false;
    player.reviveTime = undefined;
    player.send('You have cancelled your revive time.');
});
