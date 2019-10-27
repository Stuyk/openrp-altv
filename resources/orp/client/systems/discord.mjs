import * as alt from 'alt';

let ready = false;

alt.onServer('discord:Request', () => {
    const interval = alt.setInterval(() => {
        // Make a single request for authentication.
        if (!ready && !alt.isDiscordOAuth2Finished()) {
            ready = true;
            alt.discordRequestOAuth2();
        }

        // Checks if the user accepted or declined.
        if (!alt.isDiscordOAuth2Finished()) return;

        // If the user accepted; we get a key.
        // Otherwise we get null.
        const object = alt.getDiscordOAuth2Result();

        /*
            Token is of the bearer type.
            {
                token: 'some stupid token',
                expires: 0,
                scopes: 'identify'
            }
        */
        if (!object) {
            alt.log('Did not accept oAuth request.');
            return;
        }

        alt.emitServer('discord:Authorization', object);
        alt.clearInterval(interval);
    }, 2000);
});
