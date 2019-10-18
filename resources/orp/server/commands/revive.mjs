import * as chat from '../chat/chat.mjs';
import { Config } from '../configuration/config.mjs';

chat.registerCmd('revive', player => {
    if (!player.data.dead) return;

    if (player.reviving) {
        player.send(
            `You will revive in ${(player.reviveTime - Date.now()) / 1000} seconds.`
        );
        return;
    }

    player.reviveTime = Date.now() + Config.defaultPlayerReviveTime;
    player.reviving = true;
    player.send('Please wait; you will be revived within 20 to 30 seconds.');
});

chat.registerCmd('cancelrevive', player => {
    if (!player.data.dead) return;
    if (!player.revive) return;

    player.reviving = false;
    player.reviveTime = undefined;
    player.send('You have cancelled your revive time.');
});
