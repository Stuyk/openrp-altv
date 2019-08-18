import * as alt from 'alt';

// Save the player's clothing.
export function saveClothing(player, jsonData) {
    player.saveField(player.data.id, 'clothing', jsonData);
    player.closeClothingDialogue();
}
