import * as alt from 'alt';
import * as native from 'natives';
import { View } from '/client/utility/view.mjs';
import { Camera } from '/client/utility/camera.mjs';
import { playAnimation } from '/client/systems/animation.mjs';

const url = 'http://resource/client/html/characterselect/index.html';
let webview;
let currentCharacter;
let characters;
let camera;
let camPoint;

const randomAnims = [
    {
        dict: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
        anim: 'hi_dance_crowd_13_v2_male^6'
    },
    {
        dict: 'anim@amb@nightclub@dancers@crowddance_facedj@hi_intensity',
        anim: 'hi_dance_facedj_09_v2_male^6'
    },
    {
        dict: 'anim@amb@nightclub@dancers@crowddance_facedj@',
        anim: 'hi_dance_facedj_09_v1_female^6'
    },
    {
        dict: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
        anim: 'hi_dance_crowd_09_v1_female^6'
    }
];

export function showDialogue(passedCharacters, characterPoint, characterCamPoint) {
    alt.log('Showing Character Select Dialogue');

    if (!webview) {
        webview = new View();
    }

    characters = passedCharacters;
    native.freezeEntityPosition(alt.Player.local.scriptID, false);

    alt.log('Showing Dialogue');

    // Setup Webview
    webview.open(url, true);
    webview.on('character:Ready', ready);
    webview.on('character:Next', nextCharacter);
    webview.on('character:Select', selectCharacter);
    webview.on('character:New', newCharacter);

    alt.log('Dialogue Shown');

    camera = new Camera(characterCamPoint, 30);
    camera.pointAtCoord(characterPoint);
    camPoint = characterCamPoint;

    alt.log('Camera Shown');
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

    alt.setTimeout(() => {
        const heading = native.getEntityHeading(alt.Player.local.scriptID);
        native.clearPedTasksImmediately(alt.Player.local.scriptID);
        native.setEntityHeading(alt.Player.local.scriptID, heading);

        const randomAnim = randomAnims[Math.floor(Math.random() * randomAnims.length)];
        alt.log(JSON.stringify(randomAnim));
        playAnimation(alt.Player.local, randomAnim.dict, randomAnim.anim, -1, 1);
    }, 1000);
}

function selectCharacter(id) {
    if (!webview) return;
    webview.close();
    camera.destroy();
    alt.emitServer('character:Select', id);
}

function newCharacter() {
    if (!webview) return;
    webview.close();
    camera.destroy();
    alt.emitServer('character:New');
}
