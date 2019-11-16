import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';
import { Config } from '../configuration/config.mjs';
import { getDoor } from '../systems/door.mjs';

const db = new SQL(); // Get DB Reference
const LoggedInPlayers = [];

alt.on('orp:Login', (player, id, discordID) => {
    if (player.data) {
        player.kick('Already logged in.');
        return;
    }

    player.discord = discordID;
    player.guid = id;

    if (LoggedInPlayers.includes(player.discord)) {
        player.kick('Already logged in.');
        return;
    }

    player.setMeta('id', player.guid);
    player.setMeta('discord', player.discord);
    LoggedInPlayers.push(player.discord);

    db.fetchAllByField('guid', player.guid, 'Character', characters => {
        if (Array.isArray(characters) && characters.length >= 1) {
            // Existing Characters
            player.characters = characters;
            alt.emitClient(
                player,
                'character:Select',
                characters,
                Config.characterPoint,
                Config.characterCamPoint
            );
        } else {
            // New Character
            const currentTime = Date.now();
            const data = {
                guid: player.guid,
                lastposition: JSON.stringify(Config.defaultSpawnPoint),
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
        }
    });
});

// Called for any existing characters.
export function existingCharacter(player, data) {
    player.data = data;
    player.emitMeta('loggedin', true);
    player.dimension = 0;
}

alt.on('logout:Player', player => {
    if (!player) {
        return;
    }

    const res = LoggedInPlayers.findIndex(target => target.discord === player.discord);
    if (res !== -1) {
        LoggedInPlayers.splice(res, 1);
    }

    // UnArrest on Disconnect
    if (player.cuffedPlayer) {
        player.cuffedPlayer.setSyncedMeta('arrested', undefined);
        player.cuffedPlayer.emitMeta('arrest', undefined);
    }

    // Standard Player Logout Routine
    player.updatePlayingTime();
    player.data.health = player.health;
    player.data.armour = player.armour;

    // Determine Last Location
    if (player.isArrested) {
        player.data.lastposition = JSON.stringify({
            x: 459.00830078125,
            y: -998.204833984375,
            z: 24.91485023498535
        });
    } else {
        const loc = !player.lastLocation ? player.lastLocation : player.pos;
        player.data.lastposition = JSON.stringify(loc);
    }

    // Save Player
    player.save();

    // Logout Message
    alt.log(`${player.discord} has disconnected.`);
});

/**
 * This is called after the chat is started.
 * It's called from a client-side event.
 * @param player
 */
export function sync(player) {
    if (player.synced) {
        console.log(`${player.discord} attempted to get resynced.`);
        return;
    }

    player.synced = true;
    player.screenFadeOut(250);

    setTimeout(() => {
        alt.emit('sync:Player', player);
    }, 1500);
}

alt.on('sync:Player', player => {
    player.startTime = Date.now();

    // Setup Position
    const lastKnownPos = JSON.parse(player.data.lastposition);
    player.needsRoleplayInfo = true;
    player.spawn(lastKnownPos.x, lastKnownPos.y, lastKnownPos.z, 1);
    player.setSyncedMeta('id', player.data.id);
    alt.emitClient(player, 'camera:SetupSky', lastKnownPos);

    // Set player name.
    if (player.data.name !== null && player.data.dob !== null) {
        player.needsRoleplayInfo = false;
        player.setSyncedMeta('name', player.data.name);
        player.setSyncedMeta('dob', player.data.dob);
        alt.log(`${player.data.name} has spawned.`);
    }

    // Check if the player has a face.
    if (player.data.face === null) {
        player.isNewPlayer = true;
        player.showFaceCustomizerDialogue(lastPos);
    } else {
        player.applyFace(player.data.face);
        if (player.needsRoleplayInfo) {
            player.showRoleplayInfoDialogue();
        }
    }

    // Fixes any 'string' issue that may arise.
    player.data.cash = parseInt(player.data.cash);
    player.data.bank = parseInt(player.data.bank);

    if (player.data.dimension !== 0) {
        player.dimension = parseInt(player.data.dimension);
        const door = getDoor(player.data.dimension);
        if (!door) {
            player.pos = Config.defaultSpawnPoint;
        } else {
            player.emitMeta('door:EnteredInterior', door);
        }
    }

    player.spawnVehicles();
    player.setLastLogin();
    player.updateTime();
    player.syncInteractionBlips();
    player.syncXP();
    player.syncContacts();
    player.syncGang();
    player.syncInventory(true);
    player.syncMoney();
    player.syncDoorStates();
    player.syncArrest();
    player.screenFadeIn(1500);

    alt.emitClient(player, 'camera:FinishSky');

    if (player.data.dead) {
        player.health = 0;
        player.armour = 0;
        player.notify('You logged out as dead.');
        return;
    }

    player.health = player.data.health;
    player.armour = player.data.armour;
});
