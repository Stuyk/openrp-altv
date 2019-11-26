import * as alt from 'alt';
import { Recipes } from '../configuration/recipes.mjs';
import { getLevel } from './xp.mjs';
import { addXP } from './skills.mjs';
import { addBoundWeapon, addWeapon } from './inventory.mjs';

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
                player.notify(`Not proficient enough to cook ${key}.`);
                return;
            } else {
                continue;
            }
        }

        if (requirements[i].key === 'crafting') {
            if (craftingLevel < requirements[i].level) {
                player.notify(`Not proficient enough to craft ${key}.`);
                return;
            } else {
                continue;
            }
        }

        if (!totals[requirements[i].key]) {
            player.notify(`Not enough materials to craft a ${key}.`);
            return;
        }

        if (requirements[i].amount > totals[requirements[i].key]) {
            player.notify(`Not enough materials to craft a ${key}.`);
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

        if (recipe.requirements[0].level >= 90) {
            addBoundWeapon(player, key);
            player.notify(`You have crafted a ${key}. It is bound to you.`);
        } else {
            addWeapon(player, key);
            player.notify(`You have crafted a ${key}.`);
        }
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
            recipe.key
        );
        player.notify(`You have cooked ${key}.`);
    }
});

alt.onClient('craft:GetRecipes', (player, type) => {
    if (!Recipes[type]) {
        player.notify('No recipes available.');
        return;
    }

    alt.emitClient(player, 'craft:ParseRecipes', Recipes[type]);
});
