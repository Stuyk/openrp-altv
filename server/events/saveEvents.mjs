import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';

const db = new SQL(); // Get DB Reference

alt.on('saveCharacter', player => {
    db.upsertData(player.characterData, 'Character', res => {
        player.characterData = res;
    });
});
