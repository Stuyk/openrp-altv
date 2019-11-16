import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';
import * as cache from '../cache/cache.mjs';
import { setupPlayerFunctions } from '../utility/player.mjs';

const db = new SQL(); // Get DB Reference

alt.on('discord:FinishLogin', (player, discord) => {
    player.loginTimeout = undefined;
    delete player.loginTimeout;

    alt.log(`Authenticated ${discord.username}#${discord.discriminator}`);

    const account = cache.getAccount(discord.id);
    setupPlayerFunctions(player);

    if (account) {
        player.pgid = account.pgid;
        player.rank = account.rank;
        alt.emit('orp:Login', player, account.id, discord.id);
        return;
    }

    player.rank = 0;
    db.upsertData({ userid: discord.id }, 'Account', res => {
        player.pgid = res.id;
        cache.cacheAccount(res.userid, res.id, 0);
        alt.emit('orp:Login', player, res.id, discord.id);
    });
});
