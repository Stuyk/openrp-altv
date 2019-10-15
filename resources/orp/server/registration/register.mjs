import * as alt from 'alt';
import * as utilityEncryption from '../utility/encryption.mjs';
import SQL from '../../../postgres-wrapper/database.mjs';
import * as cache from '../cache/cache.mjs';

console.log('Loaded: registration->register.mjs');

const db = new SQL(); // Get DB Reference

// Called when a user wants to register from the events folder.
export function newAccount(player, username, password) {
    if (player.guid !== undefined) return;

    // Console Logging for Registration Attempts
    alt.log(`${player.name} is attempting a registration with ${username}.`);

    // Insure that username and password field are filled out.
    if (username === undefined || password === undefined) {
        player.showRegisterEventError('Registration failed.');
        return;
    }

    const account = cache.getAccount(username);

    // Check our Cache if the username exists.
    if (account !== undefined) {
        player.showRegisterEventError('Username is already taken.');
        return;
    }

    // Encrypt the Password
    const passHashSalt = utilityEncryption.encryptPassword(password);

    // Create Player Document
    const playerAccDoc = {
        username,
        password: passHashSalt
    };

    db.upsertData(playerAccDoc, 'Account', res => {
        // Add account to cache
        cache.cacheAccount(res.username, res.id, passHashSalt);

        player.showRegisterEventSuccess('New account was registered successfully.');

        player.showRegisterLogin();
    });
}
