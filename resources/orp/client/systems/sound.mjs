import * as alt from 'alt';
import * as native from 'natives';
import { distance } from '/client/utility/vector.mjs';

alt.log('Loaded: client->systems->sound.mjs');

const hash = native.getHashKey('prop_yacht_table_01');
alt.loadModel(hash);
native.requestModel(hash);

let webview = new alt.WebView('http://resource/client/html/sound/index.html');
let cooldown = Date.now();

alt.on('play:Sound', playAudio);
alt.on('play:Sound3DCoords', playAudio3DCoord);

export function playAudio(soundName, pan = 0, volume = 0.35) {
    if (Date.now() < cooldown) return;
    cooldown = Date.now() + 10;

    webview.emit('playAudio', soundName, pan, volume);
}

export function playAudio3DCoord(coords, soundName) {
    if (Date.now() < cooldown) return;
    cooldown = Date.now() + 10;

    const dist = distance(alt.Player.local.pos, coords);
    let volume = 0.35;
    let pan = 0;

    const tempObject = native.createObjectNoOffset(
        hash,
        coords.x,
        coords.y,
        coords.z,
        false,
        false,
        false
    );

    if (!native.isEntityOnScreen(tempObject)) {
        volume -= 0.25;
    } else {
        const [_, x, y] = native.getScreenCoordFromWorldCoord(
            coords.x,
            coords.y,
            coords.z,
            undefined,
            undefined
        );
        pan = x * 2 - 1;
        volume = dist / 100 / 0.35;
    }

    if (pan < -1) {
        pan = -1;
    }

    if (pan > 1) {
        pan = 1;
    }

    if (volume > 1) {
        volume = 1;
    }

    native.deleteEntity(tempObject);
    webview.emit('playAudio', soundName, pan, volume);
}

export function playAudio3D(target, soundName) {
    if (Date.now() < cooldown) return;
    cooldown = Date.now() + 10;

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

    if (pan < -1) {
        pan = -1;
    }

    if (pan > 1) {
        pan = 1;
    }

    if (volume > 1) {
        volume = 1;
    }

    webview.emit('playAudio', soundName, pan, volume);
}

native.startAudioScene('FBI_HEIST_H5_MUTE_AMBIENCE_SCENE');
native.startAudioScene('CHARACTER_CHANGE_IN_SKY_SCENE');
