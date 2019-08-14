import * as alt from 'alt';
import * as crypto from '../utility/encryption.mjs';
import SQL from '../../../postgres-wrapper/database.mjs';

console.log('Loaded: registration->register.mjs');

const db = new SQL(); // Get DB Reference

// Called when a user wants to register from the events folder.
export function userRegister(player, username, password) {
    if (player.guid !== undefined) return;

    // Console Logging for Registration Attempts
    alt.log(`${player.name} is attempting a registration with ${username}.`);

    // Insure that username and password field are filled out.
    if (username === undefined || password === undefined) {
        alt.emitClient(player, 'registerEvent', 'Registration failed.');
        return;
    }

    // Check for existing username.
    db.fetchData('username', username, 'Account', result => {
        // Check if Username is taken
        if (result !== undefined) {
            alt.emitClient(
                player,
                'registerEvent',
                'Username is already taken.'
            );
            return;
        }

        // Encrypt the password.
        const encryptedData = crypto.encryptPassword(password);

        // Setup data for the account.
        const playerAccDoc = {
            username,
            password: encryptedData
        };

        // Add the data to the database.
        db.upsertData(playerAccDoc, 'Account', () => {
            alt.emitClient(
                player,
                'registerEventSuccess',
                'New account was registered.'
            );

            alt.emitClient(player, 'registerEventGoToLogin');
        });
    });
}
