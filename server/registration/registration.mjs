import * as alt from 'alt';
import * as chat from 'chat';
import * as crypto from '../utility/encryption.mjs';
import SQL from '../../../postgres-wrapper/database.mjs';

console.log('Registration Module was Started.');

const db = new SQL(); // Get DB Reference

// Called when a user wants to login from events folder.
alt.on('login:Event', (player, username, password) => {
    if (player.guid !== undefined) return;

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

        player.guid = user.id;
        alt.emit('onPlayerLoggedIn', player);
    });
});

// Called when a user wants to register from the events folder.
alt.on('register:Event', (player, username, password) => {
    if (player.guid !== undefined) return;

    // Insure that username and password field are filled out.
    if (username === undefined || password === undefined) {
        alt.emitClient(player, 'registerEvent', 'Registration failed.');
        return;
    }

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

        const encryptedData = crypto.encryptPassword(password);

        const playerAccDoc = {
            username,
            password: encryptedData
        };

        db.upsertData(playerAccDoc, 'Account', () => {
            alt.emitClient(
                player,
                'registerEventSuccess',
                'New account was registered.'
            );
        });
    });
});
