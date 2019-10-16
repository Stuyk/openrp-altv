import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';
import { distance } from '../utility/vector.mjs';
import { Config } from '../configuration/config.mjs';

const db = new SQL();

const playerPoint = {
    x: -140.45274353027344,
    y: -646.4044189453125,
    z: 168.813232421875
};

export function setRoleplayInfo(player, info) {
    player.needsRoleplayInfo = false;

    // Saves Name, DOB, and a ID HASH.
    player.saveRoleplayInfo({
        name: info.name,
        dob: info.dob
    });

    if (distance(player.pos, playerPoint) <= 20) {
        player.pos = Config.defaultSpawnPoint;
    }

    player.closeRoleplayInfoDialogue();
}
