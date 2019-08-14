import * as alt from 'alt';

console.log(`Loaded: customizers->facialcustomizer.mjs`);

export function requestFacialCustomizer(player) {
    player.lastLocation = player.pos;
    alt.emitClient(player, 'requestFaceCustomizer');
}
