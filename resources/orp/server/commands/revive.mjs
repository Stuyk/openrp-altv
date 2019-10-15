import * as chat from '../chat/chat.mjs';
import * as configurationHospitals from '../configuration/hospitals.mjs';

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

    // Clear timeout on disconnect.
    player.reviveTimeout = setTimeout(() => {
        clearTimeout(player.reviveTimeout);
        player.screenFadeOutFadeIn(1000, 5000);
        if (!player.revivePos) {
            player.spawn(player.pos.x, player.pos.y, player.pos.z, 2000);
        } else {
            player.spawn(
                player.revivePos.x,
                player.revivePos.y,
                player.revivePos.z,
                2000
            );
        }

        player.clearBlood();
        player.health = 200;
        player.data.health = 200;
        player.revivePos = undefined;
        player.reviveTime = undefined;
        player.revive = false;
        player.isArrested = false;
        player.lastLocation = undefined;
        player.sendToJail = false;
        player.saveDead(false);
        player.taxIncome(configurationHospitals.Currency.feePct, true, 'Hospital Fee');
        player.send('You have been revived.');
        player.setSyncedMeta('dead', false);
    }, 20000);
});
