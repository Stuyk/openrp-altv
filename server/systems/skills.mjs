import * as alt from 'alt';
import { getLevel } from './xp.mjs';

export function addXP(player, skill, xpToAdd) {
    let oldLevel = 1;
    let newLevel;
    let skills = !player.data.skills ? {} : JSON.parse(player.data.skills);

    if (!skills[skill]) {
        skills[skill] = {
            xp: xpToAdd
        };
        newLevel = getLevel(skills[skill].xp);
    } else {
        oldLevel = getLevel(skills[skill].xp);
        skills[skill].xp += xpToAdd;
        newLevel = getLevel(skills[skill].xp);
    }

    if (newLevel > oldLevel) {
        player.send(`${skill} is now level: ${newLevel}`);
    }

    player.data.skills = JSON.stringify(skills);
    player.emitMeta('skills', player.data.skills);
    player.saveField(player.data.id, 'skills', player.data.skills);
}

export function agility(player) {
    addXP(player, 'agility', 20);
}
