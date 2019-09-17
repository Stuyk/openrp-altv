import * as alt from 'alt';
import { getLevel } from './xp.mjs';

const skills = {
    agility: { xp: 0 },
    cooking: { xp: 0 },
    crafting: { xp: 0 },
    fishing: { xp: 0 },
    gathering: { xp: 0 },
    mechanic: { xp: 0 },
    medicine: { xp: 0 },
    mining: { xp: 0 },
    nobility: { xp: 0 },
    notoriety: { xp: 0 },
    smithing: { xp: 0 },
    woodcutting: { xp: 0 }
};

export function addXP(player, skill, xpToAdd) {
    skill = skill.toLowerCase();
    let oldLevel = 1;
    let newLevel;
    let skills = !player.data.skills ? { ...skills } : JSON.parse(player.data.skills);

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

    player.emitMeta('gainxp', xpToAdd);
    player.data.skills = JSON.stringify(skills);
    player.emitMeta('skills', player.data.skills);
    player.saveField(player.data.id, 'skills', player.data.skills);
}

export function agility(player) {
    addXP(player, 'agility', 20);
}
