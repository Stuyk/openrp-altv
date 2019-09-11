import * as alt from 'alt';
import { View } from 'client/utility/view.mjs';

alt.log('Loaded: client->panels->info.mjs');

const url = 'http://resource/client/html/roleplayinfo/index.html';
let webview = undefined;

// Show the webview for the player to type in their roleplay name.
export function showDialogue() {
    if (!alt.Player.local.getSyncedMeta('loggedin')) return;
    // Load Webview
    webview = new View(url);
    webview.on('setinfo', setRoleplayInfo);
}

// Finish using this webview.
export function closeDialogue() {
    webview.close();
}

// Routed to the server; to set the user's roleplay info.
function setRoleplayInfo(info) {
    alt.emitServer('character:SetRoleplayInfo', info);
}
