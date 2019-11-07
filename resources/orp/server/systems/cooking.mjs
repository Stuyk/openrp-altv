import * as alt from 'alt';
import { Config } from '../configuration/config.mjs';
import { addXP } from '../systems/skills.mjs';
import { distance } from '../utility/vector.mjs';

alt.on('parse:Player', (player, now) => {
    if (!player.cooking || player.cooking.list.length <= 0) return;
    if (now < player.cooking.time + Config.timeCookingTime) return;

    if (player.cooking && !player.cooking.position) {
        player.cooking = undefined;
        player.notify('You stopped cooking.');
        return;
    }

    if (distance(player.pos, player.cooking.position) > 3.5) {
        player.cooking = undefined;
        player.notify('You stopped cooking.');
        return;
    }

    // Has Cooking Items
    player.cooking.time = now;
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
});
