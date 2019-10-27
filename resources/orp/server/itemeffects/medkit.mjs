import * as alt from 'alt';
import { getXP, addXP } from '../systems/skills.mjs';

alt.on('itemeffects:UseMedkit', (player, item, hash) => {
    // Do nothing if at full health
    if (player.health >= 200) {
        player.notify("You are already at full health!");
        return;
    }

    // Remove from inventory
    if (!player.subItem(item.key, 1)) {
        return;
    }

    const xp = getXP(player, 'medicine');

    // Add health to the user. The amount healed is based
    // on the level of the user's medical experience.
    // ie.A level 5 medic skill will only heal 5 health.
    player.setHealth(player.health + xp);

    // increase medicine skill
    addXP(player, 'medicine', 5);

    player.notify(`Health has increased: +${xp}`);
});
