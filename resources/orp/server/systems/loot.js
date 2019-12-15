import { LootTable } from '../configuration/loottable.js';

export function getRandomLoot(type, maxlvl) {
    const lootables = getLootItemsByLevel(LootTable[type], maxlvl);

    if (lootables.length <= 1) {
        return lootables[0];
    }

    const chance = Math.floor(Math.random() * 100);
    let lastLoot;
    let choice;
    lootables.forEach((loot, index) => {
        if (choice) return;
        if (!lastLoot) {
            lastLoot = loot;
            return;
        }

        if (chance > loot.chance && chance <= lastLoot.chance) {
            choice = lastLoot;
            return;
        }

        if (index === lootables.length - 1) {
            choice = loot;
            return;
        }

        lastLoot = loot;
    });

    return choice;
}

function getLootItemsByLevel(lootList, maxlvl) {
    const lootables = [];
    lootList.forEach((loot, index) => {
        if (loot.lvl > maxlvl) return;
        loot.chance = Math.floor(100 / (index + 1));
        lootables.push(loot);
    });
    return lootables;
}
