import * as alt from 'alt';
import * as chat from 'chat';

chat.registerCmd('revive', player => {
    if (player.revive) {
        player.sendMessage(
            `You will revive in ${(player.reviveTime - Date.now()) /
                1000} seconds.`
        );
        return;
    }

    player.reviveTime = Date.now() + 20000;
    player.revive = true;
    player.sendMessage('Please wait; you will be revived in twenty seconds.');

    setTimeout(() => {
        player.screenFadeOutFadeIn(1000, 5000);
        player.spawn(
            player.revivePos.x,
            player.revivePos.y,
            player.revivePos.z,
            2000
        );

        player.revivePos = undefined;
        player.reviveTime = undefined;
        player.revive = false;
        player.sendMessage('You have been revived.');
    }, 20000);
});
