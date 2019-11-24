import * as alt from 'alt';
import { goToLastLocation } from '../utility/locationhelper.mjs';

// Save & Apply Face, Check if Needs Roleplay Name
export function setFacialData(player, faceJSON) {
    if (!player.data.sexgroup) {
        player.addStarterItems();
    }

    if (faceJSON) {
        const data = JSON.parse(faceJSON);
        Object.keys(data).forEach(key => {
            const entityName = key.toLowerCase();
            player.data[entityName] = JSON.stringify(data[key]);
            player.saveField(player.data.id, entityName, player.data[entityName]);
        });
    }

    player.applyFace();
    player.syncInventory();
    goToLastLocation(player);

    if (!player.needsRoleplayInfo) {
        return;
    }

    player.showRoleplayInfoDialogue();
}

alt.onClient('character:UpdateModel', (player, model) => {
    if (model !== '')
    
    try {

    } catch(err) {

    }
});