import * as alt from 'alt';
import { getCharacterName } from '../cache/cache.mjs';
import { Config } from '../configuration/config.mjs';

let nextTimePlayingTime = Date.now() + Config.timePlayingTime;
let nextSavePlayerTime = Date.now() + Config.timePlayerSaveTime;
let nextPaycheckTime = Date.now() + Config.timePaycheckTime;
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

    if (nextTimePlayingTime < now) {
        alt.log('Saving Playing Time');
        nextTimePlayingTime = now + Config.timePlayingTime;
    }

    if (nextPaycheckTime < now) {
        alt.log('Adding Paychecks');
        nextPaycheckTime = now + Config.timePaycheckTime;
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
    if (nextTimePlayingTime < now) {
        if (player.updatePlayingTime) {
            try {
                player.updatePlayingTime();
            } catch (err) {
                alt.log(err);
                alt.error(`Could not save playing time.`);
            }
        }
    }

    if (nextPaycheckTime < now) {
        if (player.addCash(Config.defaultPlayerPaycheck)) {
            try {
                const msg = `+$${Config.defaultPlayerPaycheck} from Paycheck`;
                player.notify(msg);
            } catch (err) {
                alt.log(err);
                alt.error(`Could not add paycheck.`);
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
});
