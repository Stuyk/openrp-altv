import * as alt from 'alt';
import * as cache from '../cache/cache.mjs';
import SQL from '../../../postgres-wrapper/database.mjs';
import { generateHash } from '../utility/encryption.mjs';

const db = new SQL();

console.log('Loaded: character->info.mjs');

export function setRoleplayInfo(player, info) {
    player.needsRoleplayInfo = false;

    console.log(info);

    // Saves Name, DOB, and a ID HASH.
    player.saveRoleplayInfo({
        name: info.name,
        dob: info.dob
    });

    player.closeRoleplayInfoDialogue();
}
