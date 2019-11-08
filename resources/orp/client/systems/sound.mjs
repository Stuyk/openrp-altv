import * as alt from 'alt';
import * as native from 'natives';
import { distance } from '/client/utility/vector.mjs';

alt.log('Loaded: client->systems->sound.mjs');

let webview = new alt.WebView('http://resource/client/html/sound/index.html');

export function playAudio(soundName, pan = 0, volume = 0.35) {
    webview.emit('playAudio', soundName, pan, volume);
}

export function playAudio3D(target, soundName) {
    if (!target || !soundName) return;

    const dist = distance(target.pos, alt.Player.local.pos);
    let volume = 0.35;
    let pan = 0;

    if (alt.Player.local.scriptID !== target.scriptID) {
        if (!native.isEntityOnScreen(target.scriptID)) {
            volume -= 0.25;
        } else {
            const pos = target.pos;
            const [_, x, y] = native.getScreenCoordFromWorldCoord(
                pos.x,
                pos.y,
                pos.z,
                undefined,
                undefined
            );
            pan = x * 2 - 1;
            volume = dist / 100 / 0.35;
        }
    } else {
        volume = 0.35;
        alt.emitServer('audio:Sync3D', soundName);
    }

    webview.emit('playAudio', soundName, pan, volume);
}

native.startAudioScene('FBI_HEIST_H5_MUTE_AMBIENCE_SCENE');
native.startAudioScene('CHARACTER_CHANGE_IN_SKY_SCENE');
