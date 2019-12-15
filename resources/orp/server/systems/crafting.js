import * as alt from 'alt';
import { Recipes } from '../configuration/recipes.js';
import { getLevel } from './xp.js';
import { addXP } from './skills.js';
import { addBoundWeapon, addWeapon } from './inventory.js';
import { Items } from '../configuration/items.js';

alt.onClient('craft:CraftItem', (player, type, key) => {
    if (!Recipes[type]) {
        player.notify('No recipes available');
        return;
    }

    const skills = JSON.parse(player.data.skills);
    const craftingLevel = getLevel(skills.crafting.xp);
    const cookingLevel = getLevel(skills.cooking.xp);
    const totals = {};
    const itemsUnfiltered = [...player.inventory];
    const items = itemsUnfiltered.filter(item => item !== null && item !== undefined);

    items.forEach(item => {
        if (!item) return;
        if (!totals[item.key]) {
            totals[item.key] = item.quantity;
        } else {
            totals[item.key] = totals[item.key] + item.quantity;
        }
    });

    const recipe = Recipes[type][key];
    const requirements = recipe.requirements;
    for (let i = 0; i < requirements.length; i++) {
        if (requirements[i].key === 'cooking') {
            if (cookingLevel < requirements[i].level) {
                player.notify(`Not proficient enough to cook ${recipe.name}.`);
                return;
            } else {
                continue;
            }
        }

        if (requirements[i].key === 'crafting') {
            if (craftingLevel < requirements[i].level) {
                player.notify(`Not proficient enough to craft ${recipe.name}.`);
                return;
            } else {
                continue;
            }
        }

        if (!totals[requirements[i].key]) {
            player.notify(`Not enough materials to craft ${recipe.name}.`);
            return;
        }

        if (requirements[i].amount > totals[requirements[i].key]) {
            player.notify(`Not enough materials to craft ${recipe.name}.`);
            return;
        }
    }

    requirements.forEach(item => {
        if (item.key === 'crafting') return;
        player.subItem(item.key, item.amount);
    });

    if (type === 'weaponry') {
        addXP(player, 'crafting', recipe.xp);
        addXP(player, 'notoriety', recipe.xp);
        addXP(player, 'nobility', -recipe.xp);
        addXP(player, 'smithing', Math.floor(recipe.xp / 2));

        if (recipe.requirements[0].level >= 90) {
            addBoundWeapon(player, key, recipe.name);
            player.notify(`You have crafted a ${recipe.name}. It is bound to you.`);
        } else {
            addWeapon(player, key, recipe.name);
            player.notify(`You have crafted a ${recipe.name}.`);
        }

        player.playAudio3D(player, 'craftweapon');
        return;
    }

    if (type === 'cooking') {
        addXP(player, 'cooking', recipe.xp);
        addXP(player, 'crafting', recipe.xp / 3);

        const healthRestore = Math.floor(recipe.requirements[0].level / 3);
        const validRestore = healthRestore <= 0 ? 1 : healthRestore;

        player.addItem(
            'cookedfood',
            1,
            { health: validRestore },
            false,
            false,
            recipe.name,
            undefined,
            recipe.key
        );

        player.notify(`You have created ${recipe.name}!`);
        player.playAudio3D(player, 'cook');
        return;
    }

    if (type === 'tools') {
        const toolLevel = recipe.requirements[0].level;
        const itemKey = recipe.key.replace(/[0-9]/g, '');
        const props = { ...Items[itemKey].props };

        if (props.lvl) {
            props.lvl.requirement = toolLevel;
            props.lvl.bonus = Math.floor(toolLevel / 3);
        }

        if (
            !player.addItem(
                itemKey,
                1,
                props,
                false,
                false,
                `[${toolLevel}] ${recipe.name}`,
                undefined,
                itemKey
            )
        ) {
            player.notify(`Could not craft ${recipe.name}`);
            return;
        }

        player.playAudio3D(player, 'craft');
        addXP(player, 'crafting', recipe.xp);
        addXP(player, 'smithing', Math.floor(recipe.xp / 2));
        player.notify(`You have crafted ${recipe.name}!`);
    }
});

alt.onClient('craft:GetRecipes', (player, type) => {
    if (!Recipes[type]) {
        player.notify('No recipes available.');
        return;
    }

    alt.emitClient(player, 'craft:ParseRecipes', Recipes[type]);
});
