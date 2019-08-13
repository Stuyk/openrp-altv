import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';

console.log('onPlayerLoggedIn event was started.');

const db = new SQL(); // Get DB Reference
const defaultSpawn = { x: 813, y: -279, z: 66 };

alt.on('onPlayerLoggedIn', player => {
    db.fetchByIds(player.guid, 'Character', results => {
        alt.emitClient(player, 'finishLogin');

        // Existing Character
        if (Array.isArray(results) && results.length >= 1) {
            existingCharacter(player, results[0]);
            return;
        }

        // New Character
        newCharacter(player);
    });
});

function newCharacter(player) {
    // Character does not exist.
    const characterData = {
        id: player.guid,
        lastposition: JSON.stringify(defaultSpawn),
        model: 'mp_m_freemode_01',
        health: 200
    };

    // Take the player and spawn them at the default spawn location.
    player.spawn(defaultSpawn.x, defaultSpawn.y, defaultSpawn.z, 0);
    player.model = 'mp_m_freemode_01';

    // Save the new Character data to the database and assign to the player.
    db.upsertData(characterData, 'Character', characterData => {
        player.characterData = characterData;
    });
}

function existingCharacter(player, characterData) {
    // Character Exists
    const lastPos = JSON.parse(characterData.lastposition);

    player.spawn(lastPos.x, lastPos.y, lastPos.z, 0);
    player.model = characterData.model;
    player.health = characterData.health;

    if (characterData.name !== null) {
        player.name = characterData.name;
    }

    // Setup Character Data for Player
    player.characterData = characterData;

    // Set Character Model
    const characterFaceData = JSON.parse(characterData.characterface);

    if (characterFaceData['Sex'].value === 0) {
        player.model = 'mp_f_freemode_01';
    } else {
        player.model = 'mp_m_freemode_01';
    }

    // Apply the face to the player.
    alt.emitClient(player, 'applyFacialData', characterData.characterface);
}
