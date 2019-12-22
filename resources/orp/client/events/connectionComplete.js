import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->events->connectionComplete.js');

let ready = false;
let loginAttempts = 0;
let maxAttempts = 120;

alt.on('connectionComplete', () => {
    alt.emitServer('connectionComplete');
    alt.emit('discord:Request');
    alt.log('Loading Interiors');
    alt.loadModel('mp_f_freemode_01');
    alt.loadModel('mp_m_freemode_01');
    alt.emit('load:Interiors');
    native.displayRadar(true);
    native.setMinimapComponent(15, true);
    bearerTokenAttempt();
});

// discord:BearerToken
function bearerTokenAttempt() {
    const interval = alt.setInterval(() => {
        loginAttempts += 1;
        if (loginAttempts >= maxAttempts) {
            alt.clearInterval(interval);
            return;
        }

        // Make a single request for authentication.
        if (!ready && !alt.isDiscordOAuth2Finished()) {
            ready = true;
            alt.discordRequestOAuth2();
        }

        // Checks if the user accepted or declined.
        if (!alt.isDiscordOAuth2Finished()) {
            return;
        }

        // If the user accepted; we get a key.
        // Otherwise we get null.
        const object = alt.getDiscordOAuth2Result();
        if (!object) {
            alt.log('Did not accept oAuth request.');
            return;
        }

        alt.emitServer('discord:BearerToken', object.token);
        alt.clearInterval(interval);
    }, 1000);
}
