import * as alt from 'alt';
import { getCharacterName } from '../cache/cache.js';
import { Config } from '../configuration/config.js';

let nextRewardPointTime = Date.now() + Config.timeRewardTime;
let nextSavePlayerTime = Date.now() + Config.timePlayerSaveTime;
let nextRefreshContactsTime = Date.now() + Config.timeRefreshContactsTime;
let handling = false;

setInterval(handlePlayerInterval, 10000);

function handlePlayerInterval() {
    alt.emit('interval:Player');
    if (alt.Player.all.length <= 0) return;
    if (handling) return;
    handling = true;

    const activePlayers = alt.Player.all.filter(p => p && p.data);
    const now = Date.now();
    for (let i = 0; i < activePlayers.length; i++) {
        const player = activePlayers[i];
        if (!player) continue;
        alt.emit('parse:Player', player, now);
    }

    if (nextSavePlayerTime < now) {
        alt.log('Saving Players');
        nextSavePlayerTime = now + Config.timePlayerSaveTime;
    }

    if (nextRewardPointTime < now) {
        alt.log('Saving Reward Points');
        nextRewardPointTime = now + Config.timeRewardTime;
    }

    if (nextRefreshContactsTime < now) {
        nextRefreshContactsTime = now + Config.timeRefreshContactsTime;
    }

    handling = false;
}

alt.on('parse:Player', (player, now) => {
    // Save Player Data
    if (nextSavePlayerTime < now) {
        if (player.saveData) {
            try {
                console.log('Saving player...');
                player.saveData();
            } catch (err) {
                alt.log(err);
                alt.error(`Could not save player data.`);
            }
        }
    }

    // Save Playing Time
    if (nextRewardPointTime < now) {
        if (player.addRewardPoint) {
            try {
                player.addRewardPoint();
            } catch (err) {
                alt.log(err);
                alt.error(`Could not add a reward point.`);
            }
        }
    }

    if (nextRefreshContactsTime < now) {
        player.syncContacts();
    }

    // Handle Arrest Times / Prison Releases
    const arrestTime = parseInt(player.data.arrestTime);
    if (now > arrestTime && arrestTime !== -1) {
        if (player.setArrestTime) {
            try {
                player.setArrestTime(-1);
            } catch (err) {
                alt.log(err);
                alt.error(`Could not handle arrest time in interval.`);
            }
        }
    }

    // Revive Dead Players
    if (player.reviving) {
        if (now > player.reviveTime && player.revive) {
            try {
                player.revive();
            } catch (err) {
                alt.log(err);
                alt.error(`Could not revive player.`);
            }
        }
    }

    if (player.farming) {
        try {
            alt.emit('resource:Farm', player);
        } catch (err) {
            alt.log('Could not parse farming data.');
        }
    }
});
