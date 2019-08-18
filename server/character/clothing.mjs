import * as alt from 'alt';

console.log('Loaded: character->clothing.mjs');

// Save the player's clothing.
export function saveClothing(player, jsonData) {
    player.saveField(player.data.id, 'clothing', jsonData);
    player.closeClothingDialogue();
}
