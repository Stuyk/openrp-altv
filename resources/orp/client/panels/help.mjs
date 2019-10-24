import * as alt from 'alt';
import { View } from '/client/utility/view.mjs';

alt.log(`Loaded: client->panels->help.mjs`);

const url = 'http://resource/client/html/help/index.html';
let webview;
let open = false;

// Show the help dialogue
export function toggleHelp() {
    if (!webview) {
        webview = new View();
    }

    if (alt.Player.local.getMeta('viewOpen')) return;

    alt.emit('chat:Toggle');
    webview.open(url, true);
    webview.on('help:Close', close);
    open = true;
}

function close() {
    if (!webview) return;
    alt.emit('chat:Toggle');
    alt.setTimeout(() => {
        webview.close();
    }, 500);
}
