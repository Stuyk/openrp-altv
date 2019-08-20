import * as alt from 'alt';

let webview = new alt.WebView(
    'http://resources/orp/client/html/sound/index.html'
);

export function playAudio(soundName) {
    webview.emit('playAudio', soundName);
}
