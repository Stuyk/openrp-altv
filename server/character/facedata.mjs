import * as alt from 'alt';
import * as saveEvents from '../database/saveevents.mjs';

console.log('Loaded: character->facedata.mjs');

export function setFacialData(player, facialJSON) {
    player.characterData.characterface = facialJSON;
    player.pos = player.lastLocation;

    // Parse the character data.
    const characterFaceData = JSON.parse(facialJSON);

    if (characterFaceData['Sex'].value === 0) {
        player.model = 'mp_f_freemode_01';
    } else {
        player.model = 'mp_m_freemode_01';
    }

    saveEvents.saveCharacterData(player);
    alt.emitClient(player, 'applyFacialData', facialJSON);
}
