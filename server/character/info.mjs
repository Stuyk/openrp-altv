import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';
import * as cache from '../cache/cache.mjs';
import { generateHash } from '../utility/encryption.mjs';

const db = new SQL();

console.log('Loaded: character->info.mjs');

export function setRoleplayInfo(player, info) {
    player.needsRoleplayInfo = false;

    let randid = generateHash(info.name);
    var matches = str.match(/(\d+9)/);

    if (matches) {
        randid = matches[0];
    }
    // Cache the idnum.
    cache.cacheIdNum(randid);
    // Sets and saves the player's roleplay name.
    player.saveRoleplayInfo({ name: info.name, dob: info.dob, idnum: randid.toString() });
    player.closeRoleplayInfoDialogue();
}
