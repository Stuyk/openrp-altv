import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->customizers->character.mjs');

const cameraPoint = {
    x: -140.7032928466797,
    y: -644.9724975585938,
    z: 169.413232421875
};

const playerPoint = {
    x: -140.45274353027344,
    y: -646.4044189453125,
    z: 168.813232421875
};

let webView = undefined; // Used for the HTML View.
let characterCamera = undefined; // Used for the Camera Manipulation
let modPed = undefined; // The pedestrian we create.
let fov = 28; // The FOV we change with scroll wheel.

// eslint-disable-next-line no-unused-vars
let [_dontCare, screenWidth, screenHeight] = native.getActiveScreenResolution(0, 0); // Get the current screen resolution the user is using.
let lastHair = 0; // Get the last hair the player set.

// Load the character customizer, freeze controls, create camera, and ped.
export function showDialogue() {
    if (modPed !== undefined) return;
    alt.emit('panel:SetStatus', 'character', true);

    // Reload Active Res for Reference
    [_dontCare, screenWidth, screenHeight] = native.getActiveScreenResolution(0, 0);

    let offsetPoint = { ...cameraPoint };
    offsetPoint.x += 10;

    // Setup a temporary teleport, and turn off the radar.
    alt.emitServer('temporaryTeleport', offsetPoint);
    native.displayRadar(false);

    // Request these models if they're not already loaded.
    native.requestModel(native.getHashKey('mp_m_freemode_01'));
    native.requestModel(native.getHashKey('mp_f_freemode_01'));

    // Create a pedestrian to customize.
    modPed = native.createPed(
        1,
        native.getHashKey('mp_f_freemode_01'),
        playerPoint.x,
        playerPoint.y,
        playerPoint.z,
        0,
        false,
        false
    );

    native.setPedComponentVariation(modPed, 6, 1, 0, 0);

    // Set the head blend data to 0 to prevent texture issues.
    native.setPedHeadBlendData(modPed, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);

    // Hide the player's model.
    native.setEntityAlpha(alt.Player.local.scriptID, 0, false);

    // Load the WebView
    webView = new alt.WebView('http://resource/client/html/character/index.html');

    webView.focus();
    alt.showCursor(true);

    // Setup the ped camera point.
    characterCamera = native.createCamWithParams(
        'DEFAULT_SCRIPTED_CAMERA',
        cameraPoint.x,
        cameraPoint.y,
        cameraPoint.z,
        0,
        0,
        0,
        fov,
        true,
        0
    );

    // Point camera at entity; with no offset.
    native.pointCamAtPedBone(characterCamera, modPed, 31086, 0.1, 0, 0, false);

    // Render the now setup camera; to the player.
    native.renderScriptCams(true, false, 0, true, false);

    // Update Sex
    webView.on('updateSex', updateSex);

    // Update Head Blend / Player Face
    webView.on('updatePlayerFace', updatePlayerFace);

    // Update Face Decor; Sun Damage, Lipstick, etc.
    webView.on('updateFaceDecor', updateFaceDecor);

    // Update Face Feature
    webView.on('updateFaceFeature', updateFaceFeature);

    // Update Hair
    webView.on('updateHair', updateHair);

    // Update Eyes
    webView.on('updateEyes', updateEyes);

    // Save Entire Face
    webView.on('setPlayerFacialData', setPlayerFacialData);

    // Update Hair Color Choices for Buttons
    updateHairColorChoices();

    native.setPedDecoration(
        modPed,
        native.getHashKey('mpbeach_overlays'),
        native.getHashKey('fm_hair_fuzz')
    );

    // Halt controls, add zoom in zoom out, and rotation.
    alt.on('update', onUpdateEventCharacterCustomizer);

    alt.setTimeout(() => {
        webView.emit('sexUpdated', 0);
    }, 1000);
}

export function clearPedBloodDamage() {
    native.clearPedBloodDamage(alt.Player.local.scriptID);
}

// Player Sex Updates, for model changes.
function updateSex(value) {
    if (value === 0) {
        resetCamera(native.getHashKey('mp_f_freemode_01'));
        webView.emit('sexUpdated', 0);
    } else {
        resetCamera(native.getHashKey('mp_m_freemode_01'));
        webView.emit('sexUpdated', 1);
    }
}

// Player Face Updates; for head blend and such.
function updatePlayerFace(valuesAsJSON) {
    const values = JSON.parse(valuesAsJSON);
    native.setPedHeadBlendData(
        modPed,
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
    alt.log(colorType);
    native.setPedHeadOverlay(modPed, id, results[0], results[1]);

    // Only if one color is present.
    if (results.length > 2 && results.length <= 3) {
        native.setPedHeadOverlayColor(modPed, id, colorType, results[2], results[2]);
    }

    // If two colors are present.
    if (results.length > 3) {
        native.setPedHeadOverlayColor(modPed, id, colorType, results[2], results[3]);
    }
}

function updateFaceFeature(id, value) {
    native.setPedFaceFeature(modPed, id, value);
}

// Set the hair style, color, texture, etc. from the webview.
// 'Hair', HairColor', 'HairHighlights', 'HairTexture'
function updateHair(dataAsJSON, overlayData) {
    let results = JSON.parse(dataAsJSON);

    if (lastHair !== results[0]) {
        lastHair = results[0];

        let hairTextureVariations = native.getNumberOfPedTextureVariations(
            modPed,
            2,
            results[0]
        );
        webView.emit('setHairTextureVariations', hairTextureVariations);
    }

    native.clearPedDecorations(modPed);
    if (overlayData) {
        native.setPedDecoration(
            modPed,
            native.getHashKey(overlayData.collection),
            native.getHashKey(overlayData.overlay)
        );
    }

    native.setPedComponentVariation(modPed, 2, results[0], results[3], 2);
    native.setPedHairColor(modPed, results[1], results[2]);
    updateHairColorChoices();
}

// Set the eye color from the webview.
function updateEyes(value) {
    native.setPedEyeColor(modPed, value);
}

function resetCamera(modelToUse) {
    // Delete the new ped.
    native.deletePed(modPed);

    // Re-Create the Ped
    modPed = native.createPed(
        26,
        modelToUse,
        playerPoint.x,
        playerPoint.y,
        playerPoint.z,
        0,
        false,
        false
    );

    // Lower User
    native.setPedComponentVariation(modPed, 6, 1, 0, 0);

    // Set Hair Fuzz
    native.setPedDecoration(
        modPed,
        native.getHashKey('mpbeach_overlays'),
        native.getHashKey('fm_hair_fuzz')
    );

    // Set the head blend data to 0 to prevent weird hair texture glitches. Thanks Matspyder
    native.setPedHeadBlendData(modPed, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);

    updateHairColorChoices();

    // Point camera at entity; with no offset.
    native.pointCamAtPedBone(characterCamera, modPed, 31086, 0.1, 0, 0, false);

    // Render the now setup camera; to the player.
    native.renderScriptCams(true, false, 0, true, false);
}

// Update the number of hair colors available.
function updateHairColorChoices() {
    // Fetch number of styles from natives.
    let hairStyles = native.getNumberOfPedDrawableVariations(modPed, 2);
    let hairColors = native.getNumHairColors();

    // Emit the webview to update the style choices.
    webView.emit('stylesUpdate', hairStyles, hairColors);
}

// Update the Camera when the FOV changes.
function updateCamera() {
    native.setCamFov(characterCamera, fov);
    native.renderScriptCams(true, false, 0, true, false);
}

function setPlayerFacialData(facialDataJSON) {
    alt.emitServer('face:SetFacialData', facialDataJSON);
    alt.emit('panel:SetStatus', 'character', false);

    // Remove the CharacterCamera
    characterCamera = undefined;

    // Turn off webview events.
    webView.off('updateSex', updateSex);
    webView.off('updatePlayerFace', updatePlayerFace);
    webView.off('updateFaceDecor', updateFaceDecor);
    webView.off('updateFaceFeature', updateFaceFeature);
    webView.off('updateHair', updateHair);
    webView.off('updateEyes', updateEyes);
    webView.off('setPlayerFacialData', setPlayerFacialData);
    webView.unfocus();

    // Destroy the webview.
    webView.destroy();

    // Stop rendering the cameras.
    native.renderScriptCams(false, false, 0, false, false);

    // Hide the player's model.
    native.setEntityAlpha(alt.Player.local.scriptID, 255, false);

    // Destroy All Cameras
    native.destroyAllCams(true);

    // Delete the ped.
    native.deletePed(modPed);

    modPed = undefined;

    // Show the Radar
    native.displayRadar(true);

    // Stop showing the cursor
    alt.showCursor(false);

    // Turn off the update function.
    alt.off('update', onUpdateEventCharacterCustomizer);

    // Request the last location.
    alt.emitServer('utility:GoToLastLocation');
}

function onUpdateEventCharacterCustomizer() {
    if (characterCamera === undefined) return;

    // Disable Controls for the Player
    native.disableAllControlActions(0);
    native.disableAllControlActions(1);
    let cursorRelativePos = alt.getCursorPos().x;

    // Scroll to zoom in.
    if (native.isDisabledControlPressed(0, 14)) {
        if (cursorRelativePos < screenWidth / 4) return;

        fov += 2;
        if (fov >= 29) fov = 28;
        updateCamera();
    }

    // Scroll to zoom out
    if (native.isDisabledControlPressed(0, 15)) {
        if (cursorRelativePos < screenWidth / 4) return;

        fov -= 2;
        if (fov <= 16) fov = 17;
        updateCamera();
    }

    // Right-Click Drag Rotation
    if (native.isDisabledControlPressed(0, 25)) {
        let heading = native.getEntityHeading(modPed);

        if (cursorRelativePos < screenWidth / 2) {
            cursorRelativePos = -1;
        }

        if (cursorRelativePos > screenWidth - screenWidth / 2) {
            cursorRelativePos = 1;
        }

        native.setEntityHeading(modPed, heading + cursorRelativePos);
    }
}

export function cleanupSpawnedPed() {
    if (modPed !== undefined) native.deletePed(modPed);
}
