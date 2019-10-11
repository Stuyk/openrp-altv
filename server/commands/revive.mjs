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
        player.spawn(player.revivePos.x, player.revivePos.y, player.revivePos.z, 2000);
        player.clearBlood();
        player.data.health = 200;
        player.revivePos = undefined;
        player.reviveTime = undefined;
        player.revive = false;
        player.isArrested = false;
        player.saveDead(false);
        player.taxIncome(configurationHospitals.Currency.feePct, true, 'Hospital Fee');
        player.send('You have been revived.');
    }, 20000);
});
