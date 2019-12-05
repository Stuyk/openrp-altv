import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';
import { Config } from '../configuration/config.mjs';
import { getDoor } from '../systems/door.mjs';

const db = new SQL(); // Get DB Reference

alt.on('orp:Login', (player, id, discordID) => {
    const existing = alt.Player.all.find(
        target => target && target.discord === discordID
    );

    if (existing) {
        console.log('Player is already logged in. [1]');
        player.kick('Already logged in.');
        return;
    }

    player.discord = discordID;
    player.guid = id;

    player.setMeta('id', player.guid);
    player.setMeta('discord', player.discord);

    db.fetchAllByField('guid', player.guid, 'Character', characters => {
        if (Array.isArray(characters) && characters.length >= 1) {
            alt.log('Loading existing characters...');

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
            alt.log('Creating new character...');

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

    if (player.trading) {
        alt.emit('trade:KillTrade', player);
    }

    // UnArrest on Disconnect
    if (player.cuffedPlayer) {
        player.cuffedPlayer.setSyncedMeta('arrested', undefined);
        player.cuffedPlayer.emitMeta('arrest', undefined);
    }

    // Standard Player Logout Routine
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
    if (!player.data) {
        player.kick();
        alt.log('Player has unknown data.');
        return;
    }

    player.startTime = Date.now();

    // Setup Position
    let lastKnownPos = JSON.parse(player.data.lastposition);
    if (lastKnownPos === null) {
        lastKnownPos = Config.defaultSpawnPoint;
    }

    player.needsRoleplayInfo = true;

    player.spawn(lastKnownPos.x, lastKnownPos.y, lastKnownPos.z, 0);
    player.setSyncedMeta('id', player.data.id);

    // Set player name.
    if (player.data.name !== null) {
        player.needsRoleplayInfo = false;
        player.setSyncedMeta('name', player.data.name);
        alt.log(`${player.data.name} has spawned.`);
    }

    // Check if the player has a face.
    if (!player.data.sexgroup) {
        player.isNewPlayer = true;
        player.showFaceCustomizerDialogue(lastKnownPos);
    } else {
        alt.emitClient(player, 'camera:SetupSky', lastKnownPos);
        player.applyFace();
        if (player.needsRoleplayInfo) {
            player.showRoleplayInfoDialogue();
        }
        alt.emitClient(player, 'camera:FinishSky');
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
            player.pos = door.exit.position;
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

    if (player.data.dead) {
        player.health = 0;
        player.armour = 0;
        player.notify('You logged out as dead.');
        return;
    }

    player.health = player.data.health;
    player.armour = player.data.armour;
    player.spawn(lastKnownPos.x, lastKnownPos.y, lastKnownPos.z, 0);
});
