import * as alt from 'alt';
import { View } from 'client/utility/view.mjs';

alt.log('Loaded: client->panels->name.mjs');

const url = 'http://resource/client/html/roleplayname/index.html';
let webview = undefined;

// Show the webview for the player to type in their roleplay name.
export function showDialogue() {
    if (!alt.Player.local.getSyncedMeta('loggedin')) return;
    // Load Webview
    webview = new View(url);
    webview.on('setname', setRoleplayName);
}

// Emit to the webview that the username is taken.
export function showNameTaken() {
    if (webview === undefined || webview === null) return;

    webview.emit('nameTaken');
}

// Finish using this webview.
export function closeDialogue() {
    webview.close();
}

// Routed to the server; to set the user's roleplay name.
function setRoleplayName(roleplayname) {
    alt.emitServer('character:SetRoleplayName', roleplayname);
}
