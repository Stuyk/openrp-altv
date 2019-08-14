import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';

const db = new SQL();

console.log(`Loaded: database->saveevents.mjs`);

// The different entities we want to save if entities store their data on themselves.
export function saveCharacterData(player) {
    if (player.characterData === undefined) return;

    db.upsertData(player.characterData, 'Character', res => {
        player.characterData = res;
    });
}
