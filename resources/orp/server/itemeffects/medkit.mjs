import * as alt from 'alt';
import { addXP } from '../systems/skills.mjs';
import { getLevel } from '../systems/xp.mjs';

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

    // Add health to the user. The amount healed is based
    // on the level of the user's medical experience.
    // ie. A level 5 medic skill will only heal 5 health.
    const skills = JSON.parse(player.data.skills);
    const level = getLevel(skills['medicine'].xp);

    player.setHealth(player.health + level);

    // increase medicine skill
    addXP(player, 'medicine', 25);

    player.notify(`Health has increased: +${level}`);
});
