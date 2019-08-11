import * as alt from 'alt';
import * as native from 'natives';

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

var webView = undefined; // Used for the HTML View.
var characterCamera = undefined; // Used for the Camera Manipulation
var modPed = undefined; // The pedestrian we create.
var fov = 28; // The FOV we change with scroll wheel.
var [_dontCare, screenWidth, screenHeight] = native.getActiveScreenResolution(
    0,
    0
); // Get the current screen resolution the user is using.
var lastHair = 0; // Get the last hair the player set.

// Load the character customizer, freeze controls, create camera, and ped.
export function loadCharacterCustomizer() {
    if (modPed !== undefined) return;

    // Reload Active Res for Reference
    [_dontCare, screenWidth, screenHeight] = native.getActiveScreenResolution(
        0,
        0
    );

    // Setup a temporary teleport, and turn off the radar.
    alt.emitServer('temporaryTeleport', cameraPoint);
    native.displayRadar(false);

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

    // Request these models if they're not already loaded.
    native.requestModel(native.getHashKey('mp_m_freemode_01'));
    native.requestModel(native.getHashKey('mp_f_freemode_01'));

    // Create a pedestrian to customize.
    modPed = native.createPed(
        26,
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

    // Point camera at entity; with no offset.
    native.pointCamAtPedBone(characterCamera, modPed, 31086, 0, 0, 0, false);

    // Render the now setup camera; to the player.
    native.renderScriptCams(true, false, 0, true, false);

    // Hide the player's model.
    native.setEntityAlpha(alt.Player.local.scriptID, 0, false);

    // Load the WebView
    webView = new alt.WebView(
        'http://resources/orp/client/html/character/index.html'
    );

    webView.focus();
    alt.showCursor(true);

    // Setup the events for the webview.
    // Update the player's face.
    webView.on(
        'updateHeadBlend',
        // fFace - Father Face, mFace - Mother Face, tFace - Third Skin
        // fMix - Face Mix
        // sMix = Skin Mix
        // tMix = Third Mix
        (fFace, fSkin, mFace, mSkin, tFace, tSkin, fMix, sMix, tMix) => {
            native.setPedHeadBlendData(
                modPed,
                fFace,
                mFace,
                tFace,
                fSkin,
                mSkin,
                tSkin,
                fMix,
                sMix,
                tMix,
                false
            );
        }
    );

    // Update Sex
    webView.on('updateSex', value => {
        if (value === 0) {
            resetCamera(native.getHashKey('mp_f_freemode_01'));
        } else {
            resetCamera(native.getHashKey('mp_m_freemode_01'));
        }
    });

    // Update Hair Style
    webView.on('updateHairStyle', (hair, colorA, colorB, hairTexture) => {
        native.setPedComponentVariation(modPed, 2, hair, hairTexture, 0);
        native.setPedHairColor(modPed, colorA, colorB);

        if (lastHair !== hair) {
            lastHair = hair;

            const hairTextureVariations = native.getNumberOfPedTextureVariations(
                modPed,
                2,
                hair
            );

            webView.emit('setHairTextureVariations', hairTextureVariations);
        }
    });

    // Update Facial Features - Nose, and stuff. f = face feature
    // Names are listed inside of the app.js for the names of the ff features.
    webView.on('updateFacialFeatures', (eyeColor, faceValuesJSON) => {
        native.setPedEyeColor(modPed, eyeColor);
        let faceValues = JSON.parse(faceValuesJSON);

        for (var index in faceValues) {
            native.setPedFaceFeature(modPed, index, faceValues[index]);
        }
    });

    webView.on('updateFacialDecor', arrayOfDecor => {
        let decorData = JSON.parse(arrayOfDecor);

        alt.log(arrayOfDecor);

        for (var index = 0; index < decorData.length; index++) {
            // Blemish, Blemish Opacity
            if (index === 0) {
                native.setPedHeadOverlay(
                    modPed,
                    0,
                    decorData[index],
                    decorData[index + 1]
                );

                alt.log('yep that a blemish');
            }

            // Facial Hair
            if (index === 2) {
                native.setPedHeadOverlay(
                    modPed,
                    1,
                    decorData[index],
                    decorData[index + 1]
                );

                native.setPedHeadOverlayColor(
                    modPed,
                    1,
                    1,
                    decorData[index + 2],
                    decorData[index + 3]
                );
            }

            // Eyebrows, Eyebrow Opacity, Eyebrow Color 1, Color 2
            if (index === 6) {
                native.setPedHeadOverlay(
                    modPed,
                    2,
                    decorData[index],
                    decorData[index + 1]
                );

                native.setPedHeadOverlayColor(
                    modPed,
                    2,
                    1,
                    decorData[index + 2],
                    decorData[index + 3]
                );
            }

            // Ageing
            if (index === 10) {
                native.setPedHeadOverlay(
                    modPed,
                    3,
                    decorData[index],
                    decorData[index + 1]
                );
            }

            // Makeup
            if (index === 12) {
                native.setPedHeadOverlay(
                    modPed,
                    4,
                    decorData[index],
                    decorData[index + 1]
                );

                native.setPedHeadOverlayColor(
                    modPed,
                    4,
                    2,
                    decorData[index + 2],
                    decorData[index + 3]
                );
            }

            // Blush
            if (index === 16) {
                native.setPedHeadOverlay(
                    modPed,
                    5,
                    decorData[index],
                    decorData[index + 1]
                );

                native.setPedHeadOverlayColor(
                    modPed,
                    5,
                    2,
                    decorData[index + 2],
                    decorData[index + 2]
                );
            }

            // Complexion
            if (index === 19) {
                native.setPedHeadOverlay(
                    modPed,
                    6,
                    decorData[index],
                    decorData[index + 1]
                );
            }

            // Sun Damage
            if (index === 21) {
                native.setPedHeadOverlay(
                    modPed,
                    7,
                    decorData[index],
                    decorData[index + 1]
                );
            }

            // Lipstick
            if (index === 23) {
                native.setPedHeadOverlay(
                    modPed,
                    8,
                    decorData[index],
                    decorData[index + 1]
                );

                native.setPedHeadOverlayColor(
                    modPed,
                    8,
                    2,
                    decorData[index + 2],
                    decorData[index + 3]
                );
            }

            // Freckles
            if (index === 27) {
                native.setPedHeadOverlay(
                    modPed,
                    9,
                    decorData[index],
                    decorData[index + 1]
                );
            }
        }
    });
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

    // Fetch number of styles from natives.
    var beardStyles = native.getNumberOfPedDrawableVariations(modPed, 1);
    var hairStyles = native.getNumberOfPedDrawableVariations(modPed, 2);
    var hairColors = native.getNumHairColors();

    // Emit the webview to update the style choices.
    webView.emit('stylesUpdate', beardStyles, hairStyles, hairColors);

    // Point camera at entity; with no offset.
    native.pointCamAtPedBone(characterCamera, modPed, 31086, 0, 0, 0, false);

    // Render the now setup camera; to the player.
    native.renderScriptCams(true, false, 0, true, false);
}

// Called Constantly
alt.on('update', () => {
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
});

// Update the Camera when the FOV changes.
function updateCamera() {
    native.setCamFov(characterCamera, fov);
    native.renderScriptCams(true, false, 0, true, false);
}

// Delete the additional ped created on disconnect.
alt.on('disconnect', () => {
    native.deletePed(modPed);
});
