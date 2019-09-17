/* eslint-disable no-undef */
import * as alt from 'alt';
import * as utilityEncryption from '../utility/encryption.mjs';
import * as cache from '../cache/cache.mjs';
import SQL from '../../../postgres-wrapper/database.mjs';
import { DefaultSpawn } from '../configuration/coordinates.mjs';
import { PlayerDefaults } from '../configuration/player.mjs';

console.log('Loaded: registration->login.mjs');

const db = new SQL(); // Get DB Reference
const LoggedInPlayers = [];

// Called when a user wants to login from events folder.
export function existingAccount(player, username, password) {
    if (player.guid !== undefined) return;

    // Console Logging for Login Attempts
    alt.log(`${player.name} is attempting a login with ${username}.`);

    // Insure that username and password field are filled out.
    if (username === undefined || password === undefined) {
        player.showRegisterEventError('Username or password is undefined.');
        return;
    }

    // Get the account from the cache.
    const account = cache.getAccount(username);

    if (account === undefined) {
        player.showRegisterEventError('Account was not found.');
        return;
    }

    if (!utilityEncryption.verifyPassword(password, account.password)) {
        player.showRegisterEventError('Username or Password does not match.');
        return;
    }

    if (LoggedInPlayers.includes(username)) {
        player.showRegisterEventError('This account is already logged in.');
        return;
    }

    // Keep track of logged in players.
    LoggedInPlayers.push(username);

    player.username = username;
    player.showRegisterEventSuccess('Successful login! Please wait...');
    finishPlayerLogin(player, account.id);
    alt.log(`${player.name} has logged in.`);
}

// Called when the player is finishing their login.
export function finishPlayerLogin(player, databaseID) {
    player.closeRegisterDialogue();
    player.screenFadeOut(500);
    player.guid = databaseID;

    db.fetchByIds(player.guid, 'Character', results => {
        // Existing Character
        if (Array.isArray(results) && results.length >= 1) {
            existingCharacter(player, results[0]);
            return;
        }

        const currentTime = Date.now();

        // New Character
        const data = {
            id: player.guid,
            lastposition: JSON.stringify(DefaultSpawn),
            model: 'mp_m_freemode_01',
            health: 200,
            cash: PlayerDefaults.cash,
            bank: PlayerDefaults.bank,
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
function existingCharacter(player, data) {
    player.data = data;
    player.emitMeta('loggedin', true);
}

export function removeLoggedInPlayer(username) {
    let res = LoggedInPlayers.findIndex(x => x === username);

    if (res <= -1) return;

    let removedUser = LoggedInPlayers.splice(res, 1);
    console.log(`${removedUser} was was logged out.`);
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
        alt.log(`${player.data.name} has spawned.`);
    }

    // Check if the player has a face.
    if (player.data.face === null) {
        player.model = 'mp_f_freemode_01';
        player.isNewPlayer = true;

        let timeout = setTimeout(() => {
            if (!player) {
                clearTimeout(timeout);
                return;
            }
            player.showFaceCustomizerDialogue(lastPos);
        }, 1500);
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
    player.startTime = Date.now(); // Used for time tracking
    player.spawnVehicles();
    player.screenFadeIn(1000);
    player.setLastLogin();
    player.updateTime();
    player.syncInteractionBlips();
    player.syncInventory(true);
    player.syncMoney();
    player.syncXP();

    // Setup Health / Armor
    let timeout = setTimeout(() => {
        if (!player) clearTimeout(timeout);

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
