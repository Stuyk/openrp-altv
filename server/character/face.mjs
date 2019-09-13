import * as alt from 'alt';

console.log('Loaded: character->facedata.mjs');

// Save & Apply Face, Check if Needs Roleplay Name
export function setFacialData(player, facialJSON, isBarbershop) {
    player.saveFace(facialJSON, isBarbershop);

    if (!player.needsRoleplayName) return;

    player.showRoleplayNameDialogue();
}
