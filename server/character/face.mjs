import * as alt from 'alt';

console.log('Loaded: character->facedata.mjs');

// Save & Apply Face, Check if Needs Roleplay Name
export function setFacialData(player, facialJSON, isBarbershop) {
    player.saveFace(facialJSON, isBarbershop);

    // Sync Clothing After Barbershop Changes
    if (isBarbershop) {
        player.syncInventory();
    }

    if (!player.needsRoleplayInfo) return;

    player.showRoleplayInfoDialogue();
}
