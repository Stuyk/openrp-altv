import * as alt from 'alt';
import * as native from 'natives';
import { View } from '/client/utility/view.mjs';
import { Camera } from '/client/utility/camera.mjs';

const url = 'http://resource/client/html/characterselect/index.html';
let webview;
let currentCharacter;
let characters;
let camera;
let camPoint;

export function showDialogue(passedCharacters, characterPoint, characterCamPoint) {
    if (!webview) {
        webview = new View();
    }

    characters = passedCharacters;
    native.freezeEntityPosition(alt.Player.local.scriptID, false);

    // Setup Webview
    webview.open(url, true);
    webview.on('character:Ready', ready);
    webview.on('character:Next', nextCharacter);
    webview.on('character:Select', selectCharacter);
    webview.on('character:New', newCharacter);

    camera = new Camera(characterCamPoint, 30);
    camera.pointAtCoord(characterPoint);
    camPoint = characterCamPoint;
}

function ready() {
    if (!webview) return;
    characters.forEach(char => {
        webview.emit('character:Append', char.id, char.name, char.skills);
    });
    nextCharacter(0);
}

function nextCharacter(index) {
    const charData = JSON.parse(characters[parseInt(index)].face);
    if (charData) {
        const sex = charData.Sex.value;
        const modelName = sex === 1 ? 'mp_m_freemode_01' : 'mp_f_freemode_01';
        const hash = native.getHashKey(modelName);
        alt.loadModel(hash);
        native.setPlayerModel(alt.Player.scriptID, hash);
    } else {
        const hash = native.getHashKey('mp_m_freemode_01');
        alt.loadModel(hash);
        native.setPlayerModel(alt.Player.scriptID, hash);
    }

    alt.emit('meta:Changed', 'face', characters[parseInt(index)].face);
    alt.emit('meta:Changed', 'equipment', characters[parseInt(index)].equipment);

    native.taskTurnPedToFaceCoord(
        alt.Player.local.scriptID,
        camPoint.x,
        camPoint.y,
        camPoint.z,
        -1
    );
}

function selectCharacter(id) {
    if (!webview) return;
    webview.close();
    camera.destroy();
    alt.emitServer('character:Select', id);
    native.freezeEntityPosition(alt.Player.local.scriptID, false);
}

function newCharacter() {
    if (!webview) return;
    webview.close();
    camera.destroy();
    alt.emitServer('character:New');
    native.freezeEntityPosition(alt.Player.local.scriptID, false);
}
