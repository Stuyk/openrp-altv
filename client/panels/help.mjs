import * as alt from 'alt';
import { View } from '/client/utility/view.mjs';

alt.log(`Loaded: client->panels->help.mjs`);

const url = 'http://resource/client/html/help/index.html';
let webview;

// Show the help dialogue
export function showHelp() {
    if (!webview) {
        webview = new View();
    }

    if (alt.Player.local.getMeta('viewOpen')) return;

    // Ideally killControls would be set to false here
    // but doing so prevents us from closing the view
    // for some reason.
    webview.open(url, true);
    webview.on('help:Exit', exit);
}

function exit() {
    console.log('exiting...');
    webview.close();
    webview = undefined;
}
