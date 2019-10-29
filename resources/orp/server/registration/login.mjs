import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';
import { Config } from '../configuration/config.mjs';
import { getDoor } from '../cache/cache.mjs';

const db = new SQL(); // Get DB Reference
const LoggedInPlayers = [];

alt.on('orp:Login', (player, id, discordID) => {
    // id is the unique id we want to use for looking up users.
    if (player.data) return;

    if (LoggedInPlayers.includes(discordID)) {
        player.kick('Already logged in.');
        return;
    }

    player.setMeta('id', id);
    player.setMeta('discord', discordID);

    player.username = discordID;
    LoggedInPlayers.push(discordID);
    finishPlayerLogin(player, id);
});

// Called when the player is finishing their login.
export function finishPlayerLogin(player, databaseID) {
    player.screenFadeIn(500);
    player.guid = databaseID;

    db.fetchAllByField('guid', databaseID, 'Character', results => {
        // Existing Character
        if (Array.isArray(results) && results.length >= 1) {
            player.characters = results;
            alt.emitClient(
                player,
                'character:Select',
                results,
                Config.characterPoint,
                Config.characterCamPoint
            );
            return;
        }

        const currentTime = Date.now();

        // New Character
        const data = {
            guid: databaseID,
            lastposition: JSON.stringify(Config.defaultSpawnPoint),
            model: 'mp_m_freemode_01',
            health: 200,
            cash: Config.defaultPlayerCash,
            bank: Config.defaultPlayerBank,
            creation: currentTime,
            lastlogin: currentTime
        };

        // Save the new Character data to the database and assign to the player.
        db.upsertData(data, 'Character', data => {
            existingCharacter(player, data);
        });
    });
}

// Called for any existing characters.
export function existingCharacter(player, data) {
    player.data = data;
    player.emitMeta('loggedin', true);
    player.dimension = 0;
}

export function removeLoggedInPlayer(username) {
    let res = LoggedInPlayers.findIndex(x => x === username);

    if (res <= -1) return;

    let removedUser = LoggedInPlayers.splice(res, 1);
    alt.log(`${removedUser} was was logged out.`);
}

/**
 * This is called after the chat is started.
 * It's called from a client-side event.
 * @param player
 */
export function sync(player) {
    if (player.synced) return;
    player.synced = true;

    // Setup Position
    const lastPos = JSON.parse(player.data.lastposition);
    player.needsRoleplayInfo = true;
    player.spawn(lastPos.x, lastPos.y, lastPos.z, 1);

    // Set player name.
    if (player.data.name !== null && player.data.dob !== null) {
        player.needsRoleplayInfo = false;
        player.setSyncedMeta('name', player.data.name);
        player.setSyncedMeta('dob', player.data.dob);
        player.setSyncedMeta('id', player.data.id);
        alt.log(`${player.data.name} has spawned.`);
    }

    // Check if the player has a face.
    if (player.data.face === null) {
        player.model = 'mp_f_freemode_01';
        player.isNewPlayer = true;
        player.showFaceCustomizerDialogue(lastPos);
    } else {
        player.applyFace(player.data.face);
        if (player.needsRoleplayInfo) {
            player.showRoleplayInfoDialogue();
        }
    }

    // Fixes any 'string' issue that may arise.
    player.data.cash = player.data.cash * 1;
    player.data.bank = player.data.bank * 1;

    // Setup data on the player.
    player.dimension = 0;

    if (player.data.dimension !== 0) {
        player.dimension = parseInt(player.data.dimension);
        const door = getDoor(player.data.dimension);
        if (!door) {
            player.pos = Config.defaultSpawnPoint;
        } else {
            player.emitMeta('door:EnteredInterior', door);
        }
    }

    player.startTime = Date.now(); // Used for time tracking
    player.spawnVehicles();
    player.screenFadeIn(1000);
    player.setLastLogin();
    player.updateTime();
    player.syncInteractionBlips();
    player.syncXP();
    player.syncContacts();

    // Setup Health / Armor
    let timeout = setTimeout(() => {
        if (!player) clearTimeout(timeout);
        player.syncInventory(true);
        player.syncMoney();
        player.syncDoorStates();
        player.syncArrest();
        if (player.data.dead) {
            player.health = 0;
            player.armour = 0;
            player.send('You last logged out as dead.');
        } else {
            player.health = player.data.health;
            player.armour = player.data.armour;
        }
    }, 1500);
}
