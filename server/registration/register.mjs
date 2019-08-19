import * as alt from 'alt';
import * as utilityEncryption from '../utility/encryption.mjs';
import SQL from '../../../postgres-wrapper/database.mjs';

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

    // Check for existing username.
    db.fetchData('username', username, 'Account', result => {
        // Check if Username is taken
        if (result !== undefined) {
            player.showRegisterEventError('Username is already taken.');
            return;
        }

        // Encrypt the password.
        const encryptedData = utilityEncryption.encryptPassword(password);

        // Setup data for the account.
        const playerAccDoc = {
            username,
            password: encryptedData
        };

        // Add the data to the database.
        db.upsertData(playerAccDoc, 'Account', () => {
            player.showRegisterEventSuccess(
                'New account was registered successfully.'
            );

            player.showRegisterLogin();
        });
    });
}
