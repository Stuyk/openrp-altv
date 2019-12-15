import * as alt from 'alt';
import { View } from '/client/utility/view.js';
import { FirstNames } from '/client/gamedata/firstNames.js';
import { LastNames } from '/client/gamedata/lastNames.js';
import { showCursor } from '/client/utility/cursor.js';

alt.log('Loaded: client->panels->info.js');

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
    webview.on('roleplay:SetInfo', setRoleplayInfo);
    webview.on('roleplay:Ready', ready);
}

// Finish using this webview.
export function closeDialogue() {
    webview.close();
    showCursor(false);
    alt.emit('hud:Hide', false);
    alt.emit('chat:Hide', false);
}

function ready() {
    if (!webview) return;
    showCursor(true);
    alt.emit('hud:Hide', true);
    alt.emit('chat:Hide', true);
    webview.emit('roleplay:SetFirstNames', JSON.stringify(FirstNames));
    webview.emit('roleplay:SetLastNames', JSON.stringify(LastNames));
}

// Routed to the server; to set the user's roleplay info.
function setRoleplayInfo(name) {
    alt.emitServer('character:SetRoleplayInfo', name);
    showCursor(false);
}
