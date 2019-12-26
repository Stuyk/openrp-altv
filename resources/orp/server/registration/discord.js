import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.js';
import * as cache from '../cache/cache.js';

const db = new SQL(); // Get DB Reference

alt.on('discord:FinishLogin', async (player, discord) => {
    clearInterval(player.loginTimer);
    player.loginTimeout = undefined;
    delete player.loginTimeout;

    alt.log(`Authenticated ${discord.username}#${discord.discriminator}`);

    const account = cache.getAccount(discord.id);

    if (account) {
        player.accountID = account.id;
        player.pgid = account.pgid;
        player.rank = account.rank;
        alt.emit('orp:Login', player, account.id, discord.id);
        if (account.email) {
            alt.emit('gumroad:GetSubbedProducts', player, account.email);
        }
        return;
    }

    player.rank = 0;
    const accData = await db.upsertData({ userid: discord.id }, 'Account');
    player.accountID = accData.id;
    player.pgid = accData.userid;
    cache.cacheAccount(accData.userid, accData.id, 0);
    alt.emit('orp:Login', player, accData.id, discord.id);
});
