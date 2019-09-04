import * as alt from 'alt';
import * as native from 'natives';

let webview = new alt.WebView('http://resource/client/html/sound/index.html');

export function playAudio(soundName) {
    webview.emit('playAudio', soundName);
}

native.startAudioScene('FBI_HEIST_H5_MUTE_AMBIENCE_SCENE');
