import * as alt from 'alt';
import { Recipes } from '../configuration/recipes.mjs';

alt.onClient('craft:CraftItem', (player, type, key) => {
    console.log(type);
    console.log(key);
});

alt.onClient('craft:GetRecipes', (player, type) => {
    if (!Recipes[type]) {
        player.notify('No recipes available.');
        return;
    }

    alt.emitClient(player, 'craft:ParseRecipes', Recipes[type]);
});
