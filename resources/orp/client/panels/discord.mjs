import * as alt from 'alt';
import * as native from 'natives';
import { View } from '/client/utility/view.mjs';
import { showCursor } from '/client/utility/cursor.mjs';

const url = 'http://resource/client/html/discord-token/index.html';
let webview;
let discordToken;
let discordURL;

native.freezeEntityPosition(alt.Player.local.scriptID, true);

alt.onServer('discord:Connect', (token, communityDiscord) => {
    if (!webview) {
        webview = new View();
    }

    discordURL = communityDiscord;
    discordToken = token;
    webview.open(url, true);
    webview.on('ready', ready);
    native.transitionToBlurred(0);
});

alt.onServer('discord:Done', () => {
    webview.close();
    discordToken = null;
    native.transitionFromBlurred(5000);
});

function ready() {
    if (!webview) return;
    showCursor(true);
    webview.emit('ready', discordToken, discordURL);
}
