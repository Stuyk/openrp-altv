import * as alt from 'alt';
import { getCharacterName } from '../cache/cache.mjs';
import { Config } from '../configuration/config.mjs';

let nextTimePlayingTime = Date.now() + Config.timePlayingTime;
let nextSavePlayerTime = Date.now() + Config.timePlayerTime;
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
    for (let i = 0; i < activePlayers.length; i++) {
        const player = activePlayers[i];
        const now = Date.now();
        if (!player) continue;
        alt.emit('parse:Player', player, now);
    }

    handling = false;
}

alt.on('parse:Player', (player, now) => {
    // Save Player Data
    if (nextSavePlayerTime < now) {
        nextSavePlayerTime = now + Config.timePlayerSaveTime;
        if (player.saveData) {
            try {
                player.saveData();
            } catch (err) {
                console.error(`Could not save player data.`);
            }
        }
    }

    // Save Playing Time
    if (nextTimePlayingTime < now) {
        nextTimePlayingTime = now + Config.timePlayingTime;
        if (player.updatePlayingTime) {
            try {
                player.updatePlayingTime();
            } catch (err) {
                console.error(`Could not save playing time.`);
            }
        }
    }

    if (nextPaycheckTime < now) {
        nextPaycheckTime = now + Config.timePaycheckTime;
        if (player.addCash(Config.defaultPlayerPaycheck)) {
            try {
                const msg = `+$${Config.defaultPlayerPaycheck} from Paycheck`;
                player.notify(msg);
            } catch (err) {
                console.error(`Could not add paycheck.`);
            }
        }
    }

    if (nextRefreshContactsTime < now) {
        nextRefreshContactsTime = now + Config.timeRefreshContactsTime;
        const contacts = JSON.parse(player.data.contacts);
        if (contacts.length >= 1) {
            const contactList = [];
            contacts.forEach(contact => {
                const target = alt.Player.all.find(p => p.data && p.data.id === contact);
                const isOnline = target ? true : false;
                contactList.push({
                    id: contact,
                    name: getCharacterName(contact),
                    online: isOnline
                });
            });
            player.emitMeta('contactList', contactList);
        }
    }

    // Handle Arrest Times / Prison Releases
    const arrestTime = parseInt(player.data.arrestTime);
    if (now > arrestTime && arrestTime !== -1) {
        if (player.setArrestTime) {
            try {
                player.setArrestTime(-1);
            } catch (err) {
                console.error(`Could not handle arrest time in interval.`);
            }
        }
    }

    // Revive Dead Players
    if (player.reviving) {
        if (now > player.reviveTime && player.revive) {
            try {
                player.revive();
            } catch (err) {
                console.error(`Could not revive player.`);
            }
        }
    }
});
