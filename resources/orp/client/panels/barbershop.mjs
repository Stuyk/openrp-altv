import * as alt from 'alt';
import * as native from 'natives';
import { View } from '/client/utility/view.mjs';
import { Camera } from '/client/utility/camera.mjs';
import * as utilityVector from '/client/utility/vector.mjs';

alt.log('Loaded: client->panels->barbershop.mjs');

const url = 'http://resource/client/html/barbershop/index.html';
let webview;
let camera = undefined;
let lastHair;

// Setup the player clothing customizer.
export function showDialogue() {
    if (!webview) {
        webview = new View();
    }

    if (alt.Player.local.getMeta('viewOpen')) return;
    if (alt.Player.local.getSyncedMeta('dead')) return;
    if (alt.Player.local.getMeta('arrest')) return;

    // Setup Webview
    webview.open(url, true);
    webview.on('barbershop:FetchFace', fetchFace);
    webview.on('barbershop:Save', save);
    webview.on('barbershop:UpdateFaceDecor', updateFaceDecor);
    webview.on('barbershop:UpdateEyes', updateEyes);
    webview.on('barbershop:UpdateHair', updateHair);

    native.freezeEntityPosition(alt.Player.local.scriptID, true);

    let pPos = utilityVector.getForwardVector(alt.Player.local.scriptID, 1.2);

    pPos.z += 0.5;
    camera = new Camera(pPos, 90);
    camera.pointAtBone(alt.Player.local.scriptID, 31086, 0.05, 0, 0);
    camera.playerControlsEntity(alt.Player.local.scriptID, true);
}

function fetchFace() {
    let faceData = JSON.parse(alt.Player.local.getMeta('face'));

    for (let key in faceData) {
        webview.emit('updateComponent', key, faceData[key].value);
    }
}

function updateEyes(value) {
    native.setPedEyeColor(alt.Player.local.scriptID, value);
}

function updateHair(dataAsJSON, overlayData) {
    let results = JSON.parse(dataAsJSON);

    if (lastHair !== results[0]) {
        lastHair = results[0];

        let hairTextureVariations = native.getNumberOfPedTextureVariations(
            alt.Player.local.scriptID,
            2,
            results[0]
        );
        webview.emit('setHairTextureVariations', hairTextureVariations);
    }

    native.clearPedDecorations(alt.Player.local.scriptID);
    if (overlayData) {
        native.addPedDecorationFromHashes(
            alt.Player.local.scriptID,
            native.getHashKey(overlayData.collection),
            native.getHashKey(overlayData.overlay)
        );
    }

    native.setPedComponentVariation(
        alt.Player.local.scriptID,
        2,
        results[0],
        results[3],
        2
    );
    native.setPedHairColor(alt.Player.local.scriptID, results[1], results[2]);
    updateHairColorChoices();
}

// Player Face Decor, SunDamage, Makeup, Lipstick, etc.
function updateFaceDecor(id, colorType, dataAsJSON) {
    let results = JSON.parse(dataAsJSON);
    native.setPedHeadOverlay(alt.Player.local.scriptID, id, results[0], results[1]);

    // Only if one color is present.
    if (results.length > 2 && results.length <= 3) {
        native.setPedHeadOverlayColor(
            alt.Player.local.scriptID,
            id,
            colorType,
            results[2],
            results[2]
        );
    }

    // If two colors are present.
    if (results.length > 3) {
        native.setPedHeadOverlayColor(
            alt.Player.local.scriptID,
            id,
            colorType,
            results[2],
            results[3]
        );
    }
}

function updateHairColorChoices() {
    // Fetch number of styles from natives.
    let hairStyles = native.getNumberOfPedDrawableVariations(
        alt.Player.local.scriptID,
        2
    );
    let hairColors = native.getNumHairColors();

    // Emit the webview to update the style choices.
    webview.emit('stylesUpdate', hairStyles, hairColors);
}

function save(newFaceJSON) {
    let previousFace = JSON.parse(alt.Player.local.getMeta('face'));
    let newFace = JSON.parse(newFaceJSON);
    native.freezeEntityPosition(alt.Player.local.scriptID, false);

    for (let key in newFace) {
        if (key === 'Overlay') {
            previousFace[key] = newFace[key];
            continue;
        }

        if (previousFace[key]) {
            previousFace[key].value = newFace[key].value;
        }
    }

    alt.emitServer('face:SetFacialData', JSON.stringify(previousFace), true);

    // Remove the CharacterCamera
    camera.destroy();
    webview.close();
}
