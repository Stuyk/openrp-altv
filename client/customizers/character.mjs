import * as alt from 'alt';
import * as native from 'natives';

// mp_m_freemode_01
// mp_f_freemode_01

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

var webView = undefined;
var characterCamera = undefined;
var modPed = undefined;
var fov = 28;
var [_dontCare, screenWidth, screenHeight] = native.getActiveScreenResolution(
    0,
    0
);
var lastHair = 0;

// Load the character customizer, freeze controls, create camera, and ped.
export function loadCharacterCustomizer() {
    if (modPed !== undefined) return;

    // Reload Active Res for Reference
    [_dontCare, screenWidth, screenHeight] = native.getActiveScreenResolution(
        0,
        0
    );

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

    native.requestModel(native.getHashKey('mp_m_freemode_01'));
    native.requestModel(native.getHashKey('mp_f_freemode_01'));

    // Create a ped.
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
}

function resetCamera(modelToUse) {
    native.deletePed(modPed);

    // Create a ped.
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

    native.setPedHeadBlendData(modPed, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);

    var beardStyles = native.getNumberOfPedDrawableVariations(modPed, 1);
    var hairStyles = native.getNumberOfPedDrawableVariations(modPed, 2);
    var hairColors = native.getNumHairColors();

    webView.emit('stylesUpdate', beardStyles, hairStyles, hairColors);

    // Point camera at entity; with no offset.
    native.pointCamAtPedBone(characterCamera, modPed, 31086, 0, 0, 0, false);

    // Render the now setup camera; to the player.
    native.renderScriptCams(true, false, 0, true, false);
}

alt.on('update', () => {
    if (characterCamera === undefined) return;

    native.disableAllControlActions(0);
    native.disableAllControlActions(1);

    // Scroll to zoom in.
    if (native.isDisabledControlJustPressed(0, 14)) {
        fov += 1;
        if (fov >= 29) fov = 28;
        updateCamera();
    }

    // Scroll to zoom out
    if (native.isDisabledControlJustPressed(0, 15)) {
        fov -= 1;
        if (fov <= 16) fov = 17;
        updateCamera();
    }

    // Right-Click Drag Rotation
    if (native.isDisabledControlPressed(0, 25)) {
        let heading = native.getEntityHeading(modPed);

        // So it'll go negative.
        let cursorRelativePos = alt.getCursorPos().x;

        if (cursorRelativePos < screenWidth / 2) {
            cursorRelativePos = -0.5;
        }

        if (cursorRelativePos > screenWidth / 2) {
            cursorRelativePos = 0.5;
        }

        native.setEntityHeading(modPed, heading + cursorRelativePos);
    }
});

function updateCamera() {
    native.setCamFov(characterCamera, fov);
    native.renderScriptCams(true, false, 0, true, false);
}

alt.on('disconnect', () => {
    native.deletePed(modPed);
});
