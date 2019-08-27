import * as alt from 'alt';
import * as panelsPanelStatus from 'client/panels/panelstatus.mjs';

alt.log('Loaded: client->panels->name.mjs');

const viewPath = 'http://resources/orp/client/html/roleplayname/index.html';
let webView = undefined;

// Show the webview for the player to type in their roleplay name.
export function showDialogue() {
    if (panelsPanelStatus.isAnyPanelOpen()) return;

    alt.emit('panel:SetStatus', 'name', true);

    webView = new alt.WebView(viewPath);
    webView.focus();

    alt.showCursor(true);

    alt.toggleGameControls(false);

    webView.on('setname', setRoleplayName);
}

// Emit to the webview that the username is taken.
export function showNameTaken() {
    if (webView === undefined || webView === null) return;

    webView.emit('nameTaken');
}

// Finish using this webView.
export function closeDialogue() {
    alt.emit('panel:SetStatus', 'inventory', false);
    webView.off('setname', setRoleplayName);
    webView.unfocus();
    webView.destroy();
    alt.showCursor(false);
    alt.toggleGameControls(true);
}

// Routed to the server; to set the user's roleplay name.
function setRoleplayName(roleplayname) {
    alt.emitServer('character:SetRoleplayName', roleplayname);
}
