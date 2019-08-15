import * as alt from 'alt';
import * as saveEvents from '../database/saveevents.mjs';
import SQL from '../../../postgres-wrapper/database.mjs';

const db = new SQL();

console.log('Loaded: character->roleplayname.mjs');

export function setRoleplayName(player, roleplayName) {
    db.selectData('Character', ['charactername'], results => {
        if (results === undefined) {
            player.characterData.charactername = roleplayName;
            saveEvents.saveCharacterData(player);
            alt.emitClient(player, 'closeRoleplayNameDialog');
            player.setSyncedMeta(
                'charactername',
                player.characterData.charactername
            );
            return;
        }

        var result = results.find(
            dbData =>
                dbData.charactername.toLowerCase() ===
                roleplayName.toLowerCase()
        );

        if (result !== undefined) {
            alt.emitClient(player, 'roleplayNameTaken');
            return;
        }

        player.characterData.charactername = roleplayName;
        saveEvents.saveCharacterData(player);
        alt.emitClient(player, 'closeRoleplayNameDialog');
        player.setSyncedMeta(
            'charactername',
            player.characterData.charactername
        );
    });
}
