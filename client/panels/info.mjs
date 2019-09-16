import * as alt from 'alt';
import { View } from 'client/utility/view.mjs';

alt.log('Loaded: client->panels->info.mjs');

const url = 'http://resource/client/html/roleplayinfo/index.html';
let webview = undefined;

// Show the webview for the player to type in their roleplay info.
export function showDialogue() {
    if (!webview) {
        webview = new View();
    }

    if (alt.Player.local.getMeta('viewOpen')) return;

    // Setup Webview
    webview.open(url, true);
    webview.on('setinfo', setRoleplayInfo);
}

// Finish using this webview.
export function closeDialogue() {
    webview.close();
}

// Routed to the server; to set the user's roleplay info.
function setRoleplayInfo(roleplayinfo) {
    alt.emitServer('character:SetRoleplayInfo', roleplayinfo);
}
