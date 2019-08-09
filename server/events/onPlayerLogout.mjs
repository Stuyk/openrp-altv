import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';

const db = new SQL(); // Get DB Reference

alt.on('playerDisconnect', (player, reason) => {
    // If the player isn't logged in; don't do anything else.
    if (player.guid === undefined) return;
    const playerName = player.name;

    // The data that is saved on player log out.
    player.characterData.lastposition = JSON.stringify(player.pos);
    player.characterData.health = player.health;

    // Save data that is changed.
    db.upsertData(player.characterData, 'Character', () => {
        console.log(`${playerName} has logged out, character data was saved.`);
    });
});
