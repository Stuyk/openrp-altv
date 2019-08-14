import * as alt from 'alt';
import * as crypto from '../utility/encryption.mjs';
import SQL from '../../../postgres-wrapper/database.mjs';
import { DefaultSpawn } from '../configuration/coordinates.mjs';

console.log('Loaded: registration->login.mjs');

const db = new SQL(); // Get DB Reference

// Called when a user wants to login from events folder.
export function userLogin(player, username, password) {
    if (player.guid !== undefined) return;

    // Console Logging for Login Attempts
    alt.log(`${player.name} is attempting a login with ${username}.`);

    // Insure that username and password field are filled out.
    if (username === undefined || password === undefined) {
        alt.emitClient(
            player,
            'registerEvent',
            'Username or password is undefined.'
        );
        return;
    }

    db.fetchData('username', username, 'Account', user => {
        // Check if Username is taken
        if (user === undefined) {
            console.log('No account was found.');
            alt.emitClient(player, 'registerEvent', 'Account was not found.');
            return;
        }

        if (!crypto.verifyPassword(password, user.password)) {
            alt.emitClient(
                player,
                'registerEvent',
                'Username or Password does not match.'
            );
            return;
        }

        alt.emitClient(
            player,
            'registerEventSuccess',
            'Successful login! Please wait...'
        );

        finishPlayerLogin(player, user.id);
        alt.log(`${player.name} has logged in.`);
    });
}

// Called when the player is finishing their login.
export function finishPlayerLogin(player, databaseID) {
    player.guid = databaseID;

    db.fetchByIds(player.guid, 'Character', results => {
        alt.emitClient(player, 'finishLogin');

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
    const characterData = {
        id: player.guid,
        lastposition: JSON.stringify(DefaultSpawn),
        model: 'mp_m_freemode_01',
        health: 200
    };

    // Save the new Character data to the database and assign to the player.
    db.upsertData(characterData, 'Character', characterData => {
        existingCharacter(player, characterData);
    });
}

// Called for any existing characters.
function existingCharacter(player, characterData) {
    // Setup characterData on the player.
    player.characterData = characterData;

    // Logout or Spawn Position
    const lastLogoutPos = JSON.parse(player.characterData.lastposition);

    // Spawn the player.
    player.spawn(lastLogoutPos.x, lastLogoutPos.y, lastLogoutPos.z, 0);

    // Set Character Model and Data
    if (player.characterData.characterface === null) {
        // Show them the new character / new name menu.
        // TODO: Force show the menu.
        player.model = 'mp_m_freemode_01';
    } else {
        // Load Existing Model
        const characterFaceData = JSON.parse(
            player.characterData.characterface
        );
        if (characterFaceData['Sex'].value === 0) {
            player.model = 'mp_f_freemode_01';
        } else {
            player.model = 'mp_m_freemode_01';
        }

        // Apply the face to the player.
        alt.emitClient(player, 'applyFacialData', characterData.characterface);
    }

    // Set Player Health
    player.health = player.characterData.health;

    // Set the player's name if its not null.
    if (characterData.name !== null) {
        player.name = characterData.name;
    }

    alt.log(`${player.name} has spawned.`);
}
