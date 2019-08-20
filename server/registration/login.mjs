import * as alt from 'alt';
import * as utilityEncryption from '../utility/encryption.mjs';
import * as customizersFace from '../customizers/face.mjs';
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

    db.fetchData('username', username, 'Account', user => {
        // Check if Username is taken
        if (user === undefined) {
            player.showRegisterEventError('Account was not found.');
            return;
        }

        if (!utilityEncryption.verifyPassword(password, user.password)) {
            player.showRegisterEventError(
                'Username or Password does not match.'
            );
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
        finishPlayerLogin(player, user.id);
        alt.log(`${player.name} has logged in.`);
    });
}

// Called when the player is finishing their login.
export function finishPlayerLogin(player, databaseID) {
    // Fade the screen out in 1 second, then fade back after 2 seconds in 1 second.
    player.screenFadeOutFadeIn(200, 2000);

    player.guid = databaseID;

    db.fetchByIds(player.guid, 'Character', results => {
        // Close the registration dialogue.
        player.closeRegisterDialogue();

        // Existing Character
        if (Array.isArray(results) && results.length >= 1) {
            existingCharacter(player, results[0]);
            return;
        }

        // New Character
        newCharacter(player);
    });
}

// Called when a new character needs to be added to the database.
function newCharacter(player) {
    // Character does not exist.
    const data = {
        id: player.guid,
        lastposition: JSON.stringify(DefaultSpawn),
        model: 'mp_m_freemode_01',
        health: 200,
        cash: PlayerDefaults.cash,
        bank: PlayerDefaults.bank
    };

    // Save the new Character data to the database and assign to the player.
    db.upsertData(data, 'Character', data => {
        existingCharacter(player, data);
    });
}

// Called for any existing characters.
function existingCharacter(player, data) {
    const lastPos = JSON.parse(data.lastposition);
    player.needsRoleplayName = true;
    player.spawn(lastPos.x, lastPos.y, lastPos.z, 1);
    player.health = data.health;
    player.armour = data.armour;

    // Set player name.
    if (data.name !== null) {
        player.needsRoleplayName = false;
        player.setSyncedMeta('name', data.name);
        alt.log(`${data.name} has spawned.`);
    }

    // Check if the player has a face.
    if (data.face === null) {
        player.model = 'mp_f_freemode_01';
        customizersFace.showFace(player, lastPos);
    } else {
        player.applyFace(data.face);

        if (player.needsRoleplayName) {
            player.showRoleplayNameDialogue();
        }
    }

    data.cash = data.cash * 1;
    data.bank = data.bank * 1;

    if (data.clothing !== null || data.clothing !== undefined) {
        player.syncClothing(data.clothing);
    }

    // Tax if PLAYER was dead on login.

    // Setup data on the player.
    player.data = data;
    player.syncInventory();
    player.setSyncedMeta('loggedin', true);
}

export function removeLoggedInPlayer(username) {
    let res = LoggedInPlayers.findIndex(x => x === username);

    if (res <= -1) return;

    let removedUser = LoggedInPlayers.splice(res, 1);
    console.log(`${removedUser} was was logged out.`);
}
