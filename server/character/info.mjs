import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';
import * as cache from '../cache/cache.mjs';

const db = new SQL();

console.log('Loaded: character->info.mjs');

export function setRoleplayInfo(player, info) {

    player.needsRoleplayInfo = false;

    let randid = Math.floor(100000000 + Math.random() * 900000000);
    // Cache the idnum.
    cache.cacheIdNum(randid);
    // Sets and saves the player's roleplay name.
    player.saveRoleplayInfo({name: info.name, dob: info.dob, idnum: randid.toString()});
    player.closeRoleplayInfoDialogue();
}


