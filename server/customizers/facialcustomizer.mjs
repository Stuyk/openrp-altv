import * as alt from 'alt';

console.log(`Loaded: customizers->facialcustomizer.mjs`);

export function requestFacialCustomizer(player, location) {
    if (location !== undefined) {
        player.lastLocation = location;
    } else {
        player.lastLocation = player.pos;
    }

    player.showFaceCustomizerDialogue();
}
