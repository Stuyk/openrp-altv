import * as alt from 'alt';
import { View } from '/client/utility/view.mjs';
import { getLevel } from '/client/systems/xp.mjs';
import { showCursor } from '/client/utility/cursor.mjs';

alt.log('Loaded: client->panels->info.mjs');

const url = 'http://resource/client/html/crafting/index.html';
let webview;
let craftType;

export function weaponryCrafting() {
    alt.emitServer('gangs:CheckCraftDialogue', 'weaponry');
}

alt.onServer('gangs:ShowCraftingDialogue', type => {
    craftType = type;
    showDialogue(type);
});

// Show the webview for the player to type in their roleplay info.
export function showDialogue(type) {
    if (!webview) {
        webview = new View();
    }

    if (alt.Player.local.getMeta('viewOpen')) return;
    if (alt.Player.local.getSyncedMeta('dead')) return;
    if (alt.Player.local.getMeta('arrest')) return;

    // Setup Webview
    webview.open(url, true);
    webview.on('craft:Close', closeDialogue);
    webview.on('craft:CraftItem', craftItem);
    webview.on('craft:Ready', ready);
    alt.emitServer('craft:GetRecipes', type);
}

function closeDialogue() {
    craftType = undefined;
    if (!webview) return;
    webview.close();
}

function ready() {
    if (!webview) return;
}

function craftItem(itemkey) {
    alt.emitServer('craft:CraftItem', craftType, itemkey);
}

alt.onServer('craft:ParseRecipes', recipes => {
    if (!webview) return;
    alt.setTimeout(() => {
        Object.keys(recipes).forEach(key => {
            webview.emit('craft:AddRecipe', key, recipes[key]);
        });

        const skills = JSON.parse(alt.Player.local.getMeta('skills'));
        const level = getLevel(skills.crafting.xp);

        webview.emit('craft:CraftingLevel', level);
        webview.emit('craft:SetInventory', alt.Player.local.getMeta('inventory'));
    }, 1000);
});
