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
let [_dontCare, screenWidth, screenHeight] = native.getActiveScreenResolution(
    0,
    0
); // Get the current screen resolution the user is using.
let lastHair = 0; // Get the last hair the player set.

// Load the character customizer, freeze controls, create camera, and ped.
export function showDialogue() {
    if (modPed !== undefined) return;

    // Reload Active Res for Reference
    [_dontCare, screenWidth, screenHeight] = native.getActiveScreenResolution(
        0,
        0
    );

    // Setup a temporary teleport, and turn off the radar.
    alt.emitServer('temporaryTeleport', cameraPoint);
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

    // Set the head blend data to 0 to prevent texture issues.
    native.setPedHeadBlendData(modPed, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);

    // Hide the player's model.
    native.setEntityAlpha(alt.Player.local.scriptID, 0, false);

    // Load the WebView
    webView = new alt.WebView(
        'http://resources/orp/client/html/character/index.html'
    );

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
    native.pointCamAtPedBone(characterCamera, modPed, 31086, 0, 0, 0, false);

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

    // Halt controls, add zoom in zoom out, and rotation.
    alt.on('update', onUpdateEventCharacterCustomizer);
}

// Player Sex Updates, for model changes.
function updateSex(value) {
    if (value === 0) {
        resetCamera(native.getHashKey('mp_f_freemode_01'));
    } else {
        resetCamera(native.getHashKey('mp_m_freemode_01'));
    }
}

// Player Face Updates; for head blend and such.
function updatePlayerFace(valuesAsJSON) {
    const values = JSON.parse(valuesAsJSON);
    native.setPedHeadBlendData(
        modPed,
        values[0],
        values[1],
        0,
        values[2],
        values[3],
        0,
        values[4],
        values[5],
        0,
        false
    );
}

// Player Face Decor, SunDamage, Makeup, Lipstick, etc.
function updateFaceDecor(dataAsJSON) {
    let results = JSON.parse(dataAsJSON);
    native.setPedHeadOverlay(
        modPed,
        results[0].id,
        results[0].value,
        results[1].value
    );

    // Only if one color is present.
    if (results.length > 2 && results.length <= 3) {
        native.setPedHeadOverlayColor(
            modPed,
            results[0].id,
            results[2].colorType,
            results[2].value,
            results[2].value
        );
    }

    // If two colors are present.
    if (results.length > 3) {
        native.setPedHeadOverlayColor(
            modPed,
            results[0].id,
            results[2].colorType,
            results[2].value,
            results[3].value
        );
    }
}

function updateFaceFeature(id, value) {
    native.setPedFaceFeature(modPed, id, value);
}

// Set the hair style, color, texture, etc. from the webview.
// 'Hair', HairColor', 'HairHighlights', 'HairTexture'
function updateHair(dataAsJSON) {
    let results = JSON.parse(dataAsJSON);

    if (lastHair !== results[0].value) {
        lastHair = results[0].value;

        let hairTextureVariations = native.getNumberOfPedTextureVariations(
            modPed,
            2,
            results[0].value
        );
        webView.emit('setHairTextureVariations', hairTextureVariations);
    }

    native.setPedComponentVariation(
        modPed,
        2,
        results[0].value,
        results[3].value,
        2
    );
    native.setPedHairColor(modPed, results[1].value, results[2].value);
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

    // Set the head blend data to 0 to prevent weird hair texture glitches. Thanks Matspyder
    native.setPedHeadBlendData(modPed, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);

    updateHairColorChoices();

    // Point camera at entity; with no offset.
    native.pointCamAtPedBone(characterCamera, modPed, 31086, 0, 0, 0, false);

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
    if (native.isDisabledControlJustPressed(0, 14)) {
        if (cursorRelativePos < screenWidth / 2) return;

        fov += 1;
        if (fov >= 29) fov = 28;
        updateCamera();
    }

    // Scroll to zoom out
    if (native.isDisabledControlJustPressed(0, 15)) {
        if (cursorRelativePos < screenWidth - screenWidth / 2) return;

        fov -= 1;
        if (fov <= 16) fov = 17;
        updateCamera();
    }

    // Right-Click Drag Rotation
    if (native.isDisabledControlPressed(0, 25)) {
        let heading = native.getEntityHeading(modPed);

        if (cursorRelativePos < screenWidth / 2) {
            cursorRelativePos = -0.5;
        }

        if (cursorRelativePos > screenWidth - screenWidth / 2) {
            cursorRelativePos = 0.5;
        }

        native.setEntityHeading(modPed, heading + cursorRelativePos);
    }
}

export function cleanupSpawnedPed() {
    if (modPed !== undefined) native.deletePed(modPed);
}
