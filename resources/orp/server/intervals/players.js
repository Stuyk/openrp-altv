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
    if (alt.Player.all.length <= 0) {
        return;
    }

    if (handling) {
        return;
    }

    handling = true;

    const activePlayers = alt.Player.all.filter(p => p && p.data);
    const now = Date.now();
    for (let i = 0; i < activePlayers.length; i++) {
        const player = activePlayers[i];
        if (!player) {
            continue;
        }

        alt.emit('parse:Player', player, now);
    }

    handling = false;
}

alt.on('parse:Player', async (player, now) => {
    if (!player) {
        return;
    }

    if (!player.timePlayerSaveTime) {
        player.timePlayerSaveTime = Date.now() + Config.timePlayerSaveTime;
    } else {
        if (Date.now() > player.timePlayerSaveTime) {
            player.timePlayerSaveTime = Date.now() + Config.timePlayerSaveTime;
            savePlayer(player);
        }
        
    }

    if (!player.timeRewardTime) {
        player.timeRewardTime = Date.now() + Config.timeRewardTime;
    } else {
        if (Date.now() > player.timeRewardTime) {
            player.timeRewardTime = Date.now() + Config.timeRewardTime;
            addRewardPoint(player);
        }
    }

    if (!player.timeRefreshContactsTime) {
        player.timeRefreshContactsTime = Date.now() + Config.timeRefreshContactsTime;
    } else {
        if (Date.now() > player.timeRefreshContactsTime) {
            player.timeRefreshContactsTime = Date.now() + Config.timeRefreshContactsTime;
            player.syncContacts();
        }
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

function addRewardPoint(player) {
    if (player.addRewardPoint) {
        try {
            player.addRewardPoint();
        } catch (err) {
            alt.log(err);
            alt.error(`Could not add a reward point.`);
        }
    }
}

function savePlayer(player) {
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