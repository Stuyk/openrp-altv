import * as alt from 'alt';
import { goToLastLocation } from '../utility/locationhelper.js';

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

    player.dimension = 0;
    player.applyFace();
    player.syncInventory();
    goToLastLocation(player);

    if (!player.needsRoleplayInfo) {
        return;
    }

    player.showRoleplayInfoDialogue();
}
