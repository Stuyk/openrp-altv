import * as alt from 'alt';
import * as native from 'natives';
import { View } from '/client/utility/view.js';
import { Camera } from '/client/utility/camera.js';
import { playAnimation } from '/client/systems/animation.js';
import { showCursor } from '/client/utility/cursor.js';

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
    showCursor(true);
    characters.forEach(char => {
        webview.emit('character:Append', char.id, char.name, char.skills);
    });
    nextCharacter(0);
}

function nextCharacter(index) {
    const character = characters[parseInt(index)];
    const sexGroup = character.sexgroup === null ? null : JSON.parse(character.sexgroup);

    if (sexGroup) {
        const modelName =
            parseInt(sexGroup[0].value) === 1 ? 'mp_m_freemode_01' : 'mp_f_freemode_01';
        const hash = native.getHashKey(modelName);
        alt.loadModel(hash);
        native.requestModel(hash);
        native.setPlayerModel(alt.Player.local.scriptID, hash);
        alt.emit(
            'meta:Changed',
            'sexgroup',
            JSON.stringify([{ value: parseInt(sexGroup[0].value) }])
        );
    } else {
        alt.log('No Model Found');
        const hash = native.getHashKey('mp_f_freemode_01');
        alt.loadModel(hash);
        native.requestModel(hash);
        native.setPlayerModel(alt.Player.local.scriptID, hash);
        alt.emit('meta:Changed', 'sexgroup', JSON.stringify([{ value: 0 }]));
    }

    Object.keys(character).forEach(key => {
        if (character[key] === null) return;
        if (key.includes('group')) {
            alt.emit('meta:Changed', key, character[key]);
        }
    });

    alt.emit('meta:Changed', 'equipment', character.equipment);

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
