import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';
import * as cache from '../cache/cache.mjs';
import { setupPlayerFunctions } from '../utility/player.mjs';

const db = new SQL(); // Get DB Reference

alt.on('discord:FinishLogin', (player, result) => {
    const userData = JSON.parse(result);
    const account = cache.getAccount(userData.id);
    setupPlayerFunctions(player);

    alt.log(
        `${player.name} authenticated as ${userData.username}#${userData.discriminator}`
    );

    if (account) {
        alt.emit('orp:Login', player, account.id, userData.id);
        return;
    }

    db.upsertData({ userid: userData.id }, 'Account', res => {
        cache.cacheAccount(res.userid, res.id);
        alt.emit('orp:Register', player, res.id, userData.id);
        alt.emit('orp:Login', player, res.id, userData.id);
    });
});
