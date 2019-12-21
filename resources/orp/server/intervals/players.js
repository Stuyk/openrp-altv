import * as alt from 'alt';
import { getCharacterName } from '../cache/cache.js';
import { Config } from '../configuration/config.js';

alt.on('parse:Player', parsePlayer);

function parsePlayer(player) {
    if (!player) {
        return;
    }

    const now = Date.now();
    player.timeoutTicker = setTimeout(() => {
        alt.emit('parse:Player', player);
    }, 10000);

    if (!player.timePlayerSaveTime) {
        player.timePlayerSaveTime = Date.now() + Config.timePlayerSaveTime;
    } else {
        if (Date.now() > player.timePlayerSaveTime) {
            alt.log(`${player.data.name} was saved.`);
            player.timePlayerSaveTime = Date.now() + Config.timePlayerSaveTime;
            savePlayer(player);
        }
        
    }

    if (!player.timeRewardTime) {
        player.timeRewardTime = Date.now() + Config.timeRewardTime;
    } else {
        if (Date.now() > player.timeRewardTime) {
            alt.log(`${player.data.name} was given a reward point.`);
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
}

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
            player.saveData();
        } catch (err) {
            alt.log(err);
            alt.error(`Could not save player data.`);
        }
    }
}