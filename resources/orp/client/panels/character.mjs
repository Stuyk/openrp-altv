import * as alt from 'alt';
import * as native from 'natives';
import { View } from '/client/utility/view.mjs';
import { Camera } from '/client/utility/camera.mjs';
import { Ped } from '/client/systems/peds.mjs';

alt.log('Loaded: client->panels->character.mjs');

const cameraPoint = {
    x: -140.7032928466797,
    y: -644.9724975585938,
    z: 170.413232421875
};

const offsetPoint = {
    x: -130.7032928466797,
    y: -644.9724975585938,
    z: 169.413232421875
};

const playerPoint = {
    x: -140.45274353027344,
    y: -646.4044189453125,
    z: 168.813232421875
};

const url = 'http://resource/client/html/character/index.html';
let webview; // Used for the HTML View.
let camera; // Used for the Camera Manipulation
let ped; // The pedestrian we create.
let lastHair = 0; // Get the last hair the player set.

// Load the character customizer, freeze controls, create camera, and ped.
export function showDialogue() {
    if (!webview) {
        webview = new View();
    }

    // Setup Webview
    webview.open(url, true);
    webview.on('updateSex', updateSex);
    webview.on('updatePlayerFace', updatePlayerFace);
    webview.on('updateFaceDecor', updateFaceDecor);
    webview.on('updateFaceFeature', updateFaceFeature);
    webview.on('updateHair', updateHair);
    webview.on('updateEyes', updateEyes);
    webview.on('setPlayerFacialData', setPlayerFacialData);

    // Setup a temporary teleport.
    alt.emitServer('temporaryTeleport', offsetPoint);

    // Request these models if they're not already loaded.
    const mHash = native.getHashKey('mp_m_freemode_01');
    const fHash = native.getHashKey('mp_f_freemode_01');

    native.requestModel(mHash);
    native.requestModel(fHash);
    alt.loadModel(mHash);
    alt.loadModel(fHash);

    camera = new Camera(cameraPoint, 28);
    alt.setTimeout(() => {
        // Create a pedestrian to customize.
        ped = new Ped('mp_f_freemode_01', playerPoint);

        native.setPedComponentVariation(ped.scriptID, 6, 1, 0, 0);

        // Set the head blend data to 0 to prevent texture issues.
        native.setPedHeadBlendData(ped.scriptID, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);

        // Hide the player's model.
        native.setEntityAlpha(alt.Player.local.scriptID, 0, false);

        // Setup the ped camera point.

        camera.pointAtBone(ped.scriptID, 31086, 0.05, 0, 0);
        camera.playerControlsEntity(ped.scriptID, true);

        // Update Hair Color Choices for Buttons
        updateHairColorChoices();

        native.addPedDecorationFromHashes(
            ped.scriptID,
            native.getHashKey('mpbeach_overlays'),
            native.getHashKey('fm_hair_fuzz')
        );

        alt.setTimeout(() => {
            webview.emit('sexUpdated', 0);
        }, 1000);
    }, 1500);
}

export function clearPedBloodDamage() {
    native.clearPedBloodDamage(alt.Player.local.scriptID);
}

// Player Sex Updates, for model changes.
function updateSex(value) {
    if (value === 0) {
        resetCamera('mp_f_freemode_01');
        webview.emit('sexUpdated', 0);
    } else {
        resetCamera('mp_m_freemode_01');
        webview.emit('sexUpdated', 1);
    }
}

// Player Face Updates; for head blend and such.
function updatePlayerFace(valuesAsJSON) {
    const values = JSON.parse(valuesAsJSON);
    native.setPedHeadBlendData(
        ped.scriptID,
        values[0],
        values[2],
        0,
        values[1],
        values[3],
        0,
        values[4],
        values[5],
        0,
        false
    );
}

// Player Face Decor, SunDamage, Makeup, Lipstick, etc.
function updateFaceDecor(id, colorType, dataAsJSON) {
    let results = JSON.parse(dataAsJSON);
    native.setPedHeadOverlay(ped.scriptID, id, results[0], results[1]);

    // Only if one color is present.
    if (results.length > 2 && results.length <= 3) {
        native.setPedHeadOverlayColor(
            ped.scriptID,
            id,
            colorType,
            results[2],
            results[2]
        );
    }

    // If two colors are present.
    if (results.length > 3) {
        native.setPedHeadOverlayColor(
            ped.scriptID,
            id,
            colorType,
            results[2],
            results[3]
        );
    }
}

function updateFaceFeature(id, value) {
    native.setPedFaceFeature(ped.scriptID, id, value);
}

// Set the hair style, color, texture, etc. from the webview.
// 'Hair', HairColor', 'HairHighlights', 'HairTexture'
function updateHair(dataAsJSON, overlayData) {
    let results = JSON.parse(dataAsJSON);

    if (lastHair !== results[0]) {
        lastHair = results[0];

        let hairTextureVariations = native.getNumberOfPedTextureVariations(
            ped.scriptID,
            2,
            results[0]
        );
        webview.emit('setHairTextureVariations', hairTextureVariations);
    }

    native.clearPedDecorations(ped.scriptID);
    if (overlayData) {
        native.addPedDecorationFromHashes(
            ped.scriptID,
            native.getHashKey(overlayData.collection),
            native.getHashKey(overlayData.overlay)
        );
    }

    native.setPedComponentVariation(ped.scriptID, 2, results[0], results[3], 2);
    native.setPedHairColor(ped.scriptID, results[1], results[2]);
    updateHairColorChoices();
}

// Set the eye color from the webview.
function updateEyes(value) {
    native.setPedEyeColor(ped.scriptID, value);
}

function resetCamera(modelToUse) {
    // Delete the new ped.
    ped.destroy();

    // Re-Create the Ped
    ped = new Ped(modelToUse, playerPoint);

    // Lower User
    native.setPedComponentVariation(ped.scriptID, 6, 1, 0, 0);

    // Set Hair Fuzz
    native.addPedDecorationFromHashes(
        ped.scriptID,
        native.getHashKey('mpbeach_overlays'),
        native.getHashKey('fm_hair_fuzz')
    );

    // Set the head blend data to 0 to prevent weird hair texture glitches. Thanks Matspyder
    native.setPedHeadBlendData(ped.scriptID, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);

    updateHairColorChoices();

    if (camera) {
        camera.destroy();
    }

    camera = new Camera(cameraPoint, 28);
    camera.pointAtBone(ped.scriptID, 31086, 0.05, 0, 0);
    camera.playerControlsEntity(ped.scriptID, true);
}

// Update the number of hair colors available.
function updateHairColorChoices() {
    // Fetch number of styles from natives.
    let hairStyles = native.getNumberOfPedDrawableVariations(ped.scriptID, 2);
    let hairColors = native.getNumHairColors();

    // Emit the webview to update the style choices.
    webview.emit('stylesUpdate', hairStyles, hairColors);
}

function setPlayerFacialData(facialDataJSON) {
    alt.emitServer('face:SetFacialData', facialDataJSON);

    // Remove the CharacterCamera
    camera.destroy();
    webview.close();
    ped.destroy();

    // Hide the player's model.
    native.setEntityAlpha(alt.Player.local.scriptID, 255, false);
    native.freezeEntityPosition(alt.Player.local.scriptID, false);

    // Request the last location.
    alt.emitServer('utility:GoToLastLocation');
}

export function cleanupSpawnedPed() {
    if (ped !== undefined) ped.destroy();
}
