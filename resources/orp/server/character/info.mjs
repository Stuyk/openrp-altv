import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';
import { cacheCharacter } from '../cache/cache.mjs';
import { distance } from '../utility/vector.mjs';
import { Config } from '../configuration/config.mjs';
import { existingCharacter } from '../registration/login.mjs';

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

    cacheCharacter(player.data.id, info.name);
    player.closeRoleplayInfoDialogue();
}

export function select(player, id) {
    const index = player.characters.findIndex(char => parseInt(char.id) === parseInt(id));
    if (index <= -1) {
        return;
    }

    existingCharacter(player, { ...player.characters[index] });
    delete player.characters;
}

export function newCharacter(player) {
    const currentTime = Date.now();

    // New Character
    const data = {
        guid: player.guid,
        lastposition: JSON.stringify(Config.defaultSpawnPoint),
        model: 'mp_m_freemode_01',
        health: 200,
        cash: Config.defaultPlayerCash,
        bank: Config.defaultPlayerBank,
        creation: currentTime,
        lastlogin: currentTime
    };

    // Update ped flags for new user.
    player.emitMeta('pedflags', undefined);

    // Save the new Character data to the database and assign to the player.
    db.upsertData(data, 'Character', data => {
        existingCharacter(player, data);
    });
}
