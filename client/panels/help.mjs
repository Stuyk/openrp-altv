import * as alt from 'alt';
import { View } from '/client/utility/view.mjs';

alt.log(`Loaded: client->panels->help.mjs`);

const url = 'http://resource/client/html/help/index.html';
let webview;

// Show the help dialogue
export function showDialogue() {
    if (!webview) {
        webview = new View();
    }

    if (alt.Player.local.getMeta('viewOpen')) return;

    // Setup Webview
    webview.open(url, true);
}

