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
    const lastPos = JSON.parse(data.lastposition);
    player.setSyncedMeta('loggedin', true);
    player.needsRoleplayName = true;
    player.spawn(lastPos.x, lastPos.y, lastPos.z, 1);

    // Set player name.
    if (data.name !== null) {
        player.needsRoleplayName = false;
        player.setSyncedMeta('name', data.name);
        alt.log(`${data.name} has spawned.`);
    }

    // Check if the player has a face.
    if (data.face === null) {
        console.log('No Face');
        player.model = 'mp_f_freemode_01';
        player.isNewPlayer = true;
        player.showFaceCustomizerDialogue(lastPos);
    } else {
        player.applyFace(data.face);

        if (player.needsRoleplayName) {
            player.showRoleplayNameDialogue();
        }
    }

    // Fixes any 'string' issue that may arise.
    data.cash = data.cash * 1;
    data.bank = data.bank * 1;

    if (data.clothing !== null || data.clothing !== undefined) {
        player.syncClothing(data.clothing);
    }

    // Make sure they spawn dead.
    player.loginHealth = setTimeout(() => {
        if (data.dead) {
            player.health = 0;
        } else {
            player.health = data.health;
            player.armour = data.armour;
        }
    }, 5000);

    // Setup data on the player.
    player.data = data;
    player.dimension = 0;
    player.startTime = Date.now(); // Used for time tracking
    player.syncInventory();
    player.screenFadeIn(1000);
    player.syncVehicles();
    player.syncMoney();
    player.syncInteractionBlips();
    player.updateTime();
    player.disableEngineControl();
    player.setLastLogin();
}

export function removeLoggedInPlayer(username) {
    let res = LoggedInPlayers.findIndex(x => x === username);

    if (res <= -1) return;

    let removedUser = LoggedInPlayers.splice(res, 1);
    console.log(`${removedUser} was was logged out.`);
}
