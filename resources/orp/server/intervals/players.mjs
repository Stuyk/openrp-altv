import * as alt from 'alt';
import { Config } from '../configuration/config.mjs';

let nextTimePlayingTime = Date.now() + Config.timePlayingTime;
let nextSavePlayerTime = Date.now() + Config.timePlayerTime;
let nextPaycheckTime = Date.now() + Config.timePaycheckTime;
let handling = false;

setInterval(handlePlayerInterval, 10000);

function handlePlayerInterval() {
    if (alt.Player.all.length <= 0) return;
    if (handling) return;
    handling = true;

    const activePlayers = alt.Player.all.filter(p => p && p.data);
    for (let i = 0; i < activePlayers.length; i++) {
        const player = activePlayers[i];
        const now = Date.now();
        if (!player) continue;

        // Save Player Data
        if (nextSavePlayerTime < now) {
            nextSavePlayerTime = now + Config.timePlayerTime;
            if (player.saveData) {
                try {
                    player.saveData();
                } catch (err) {
                    console.error(`Could not save player data.`);
                    continue;
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
                    continue;
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
                    continue;
                }
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
                    continue;
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
                    continue;
                }
            }
        }
    }

    handling = false;
}
