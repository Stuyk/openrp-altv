import * as alt from 'alt';

console.log(`Loaded: customizers->face.mjs`);

export function showFace(player, location) {
    if (location !== undefined) {
        player.lastLocation = location;
    } else {
        player.lastLocation = player.pos;
    }

    player.showFaceCustomizerDialogue();
}
