import * as alt from 'alt';
import { get } from 'https';
import SQL from '../../../postgres-wrapper/database.mjs';
import { Config } from '../configuration/config.mjs';
import * as cache from '../cache/cache.mjs';

const db = new SQL(); // Get DB Reference

alt.onClient('discord:Authorization', async (player, bearerToken) => {
    const result = await new Promise(resolve => {
        get(
            'https://discordapp.com/api/users/@me',
            {
                headers: {
                    Authorization: `Bearer ${bearerToken}`
                }
            },
            res => {
                res.on('data', d => {
                    resolve({ statusCode: res.statusCode, data: d.toString() });
                });
            }
        ).on('error', e => {
            return resolve({ statusCode: e.statusCode, data: '' });
        });
    });

    if (result.statusCode !== 200) {
        alt.emitClient(player, 'discord:AuthorizationFailure');
        return;
    }

    const userData = JSON.parse(result.data);
    const account = cache.getAccount(userData.id);
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
