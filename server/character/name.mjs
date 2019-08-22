import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';
import * as cache from '../cache/cache.mjs';

const db = new SQL();

console.log('Loaded: character->name.mjs');

export function setRoleplayName(player, roleplayName) {
    if (cache.isNameUsed(roleplayName)) {
        player.showRoleplayNameTaken();
        return;
    }

    // Cache the name.
    cache.cacheName(roleplayName);

    // Sets and saves the player's roleplay name.
    player.saveRoleplayName(roleplayName);
    player.closeRoleplayNameDialogue();
}
