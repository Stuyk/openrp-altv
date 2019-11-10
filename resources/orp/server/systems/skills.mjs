import * as alt from 'alt';
import { getLevel } from './xp.mjs';

const currentSkills = {
    agility: { xp: 0 }, //
    cooking: { xp: 0 },
    crafting: { xp: 0 },
    fishing: { xp: 0 },
    gathering: { xp: 0 },
    mechanic: { xp: 0 },
    medicine: { xp: 0 },
    mining: { xp: 0 }, //
    nobility: { xp: 0 },
    notoriety: { xp: 0 },
    smithing: { xp: 0 }, //
    woodcutting: { xp: 0 } //
};

export function addXP(player, skill, xpToAdd) {
    if (parseInt(xpToAdd) > 13034431) return;

    skill = skill.toLowerCase();
    let oldLevel = 1;
    let newLevel;
    let skills = !player.data.skills
        ? { ...currentSkills }
        : JSON.parse(player.data.skills);

    if (!skills[skill]) {
        skills[skill] = {
            xp: xpToAdd * 1
        };

        if (skills[skill].xp < 0) {
            skills[skill].xp = 0;
        }

        newLevel = getLevel(skills[skill].xp);
    } else {
        oldLevel = getLevel(skills[skill].xp);
        skills[skill].xp += xpToAdd * 1;

        if (skills[skill].xp < 0) {
            skills[skill].xp = 0;
        }

        if (skills[skill].xp > 13034431) {
            skills[skill].xp = 13034431;
        }

        newLevel = getLevel(skills[skill].xp);
    }

    if (newLevel > oldLevel) {
        player.playAudio('levelup');
        player.notify(`Level Up! ${newLevel} ${skill.toUpperCase()}`);
    } else {
        player.notify(`+${xpToAdd} XP to ${skill.toUpperCase()}`);
    }

    player.data.skills = JSON.stringify(skills);
    player.emitMeta('skills', player.data.skills);
    player.saveField(player.data.id, 'skills', player.data.skills);
}

export function setXP(player, skill, amount) {
    if (amount > 13034431) {
        player.send('You cant set your XP higher than 13034431');
        return;
    }

    let skills = !player.data.skills
        ? { ...currentSkills }
        : JSON.parse(player.data.skills);
    skills[skill].xp = parseInt(amount);
    player.emitMeta('gainxp', amount);
    player.data.skills = JSON.stringify(skills);
    player.emitMeta('skills', player.data.skills);
    player.saveField(player.data.id, 'skills', player.data.skills);
}

export function agility(player) {
    addXP(player, 'agility', 20);
}
