import * as alt from 'alt';
import { getCharacterName } from '../cache/cache.mjs';
import { Config } from '../configuration/config.mjs';
import { addXP } from '../systems/skills.mjs';

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
                alt.log(err);
                alt.error(`Could not save player data.`);
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
                alt.log(err);
                alt.error(`Could not save playing time.`);
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
                alt.log(err);
                alt.error(`Could not add paycheck.`);
            }
        }
    }

    if (nextRefreshContactsTime < now) {
        nextRefreshContactsTime = now + Config.timeRefreshContactsTime;
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

    if (player.cooking && player.cooking.list.length >= 1) {
        if (Date.now() > player.cooking.time + Config.timeCookingTime) {
            player.cooking.time = Date.now();
            const cookableCount = player.cooking.cookable;
            let count = 0;

            if (player.cooking.list <= cookableCount) {
                player.cooking.list.forEach(item => {
                    const result = player.subItemByHash(item.hash);
                    if (!result) return;
                    addXP(player, 'cooking', item.props.xp);
                    count += 1;
                    player.notify(`You cooked ${count}x ${item.name}.`);

                    const healthRestore = Math.floor(item.props.lvl / 3);
                    const validRestore = healthRestore <= 0 ? 1 : healthRestore;
                    player.addItem(
                        'cookedfood',
                        1,
                        { health: validRestore },
                        false,
                        false,
                        item.name.replace('Raw', 'Cooked')
                    );
                });
                player.cooking.list = [];
                delete player.cooking;
            } else {
                const itemsToCook = [];
                while (itemsToCook.length < cookableCount) {
                    itemsToCook.push(player.cooking.list.pop());
                }

                let finished = false;
                itemsToCook.forEach(item => {
                    if (finished) return;
                    if (item === undefined) {
                        finished = true;
                        return;
                    }

                    const result = player.subItemByHash(item.hash);
                    if (!result) return;
                    addXP(player, 'cooking', item.props.xp);
                    count += 1;
                    player.notify(`You cooked ${count}x ${item.name}.`);

                    const healthRestore = Math.floor(item.props.lvl / 3);
                    const validRestore = healthRestore <= 0 ? 1 : healthRestore;
                    player.addItem(
                        'cookedfood',
                        1,
                        { health: validRestore },
                        false,
                        false,
                        item.name.replace('Raw', 'Cooked')
                    );
                });

                if (finished) {
                    delete player.cooking;
                }
            }
        }
    }
});
