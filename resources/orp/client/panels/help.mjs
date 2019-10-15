import * as alt from 'alt';

alt.log(`Loaded: client->panels->help.mjs`);

const url = 'http://resource/client/html/help/index.html';
let webview;
let isViewShown = false;

// Show the help dialogue
export function toggleHelp() {
    if (!webview) {
        webview = new alt.WebView(url);
    }

    // hide the chat while help is shown
    alt.emit('chat:Toggle');

    isViewShown = !isViewShown;
    webview.emit('help:Toggle', isViewShown);
}
