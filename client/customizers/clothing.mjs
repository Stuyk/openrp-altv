import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->customizers->clothing.mjs');

const path = 'http://resources/orp/client/html/clothing/index.html';
let webView = undefined;
let characterCamera = undefined;
let fov = 90;
let [_dontCare, screenWidth, screenHeight] = native.getActiveScreenResolution(
    0,
    0
);
let cameraHeight = 0;

// Setup the player clothing customizer.
export function showDialogue() {
    native.freezeEntityPosition(alt.Player.local.scriptID, true);

    let forVec = native.getEntityForwardVector(alt.Player.local.scriptID);
    let pPos = alt.Player.local.pos;

    webView = new alt.WebView(path);
    webView.focus();

    pPos.x = pPos.x + forVec.x * 1.2;
    pPos.y = pPos.y + forVec.y * 1.2;
    pPos.z = pPos.z + forVec.z * 1.2;

    characterCamera = native.createCamWithParams(
        'DEFAULT_SCRIPTED_CAMERA',
        pPos.x,
        pPos.y,
        pPos.z,
        0,
        0,
        0,
        fov,
        true,
        0
    );

    native.pointCamAtCoord(
        characterCamera,
        alt.Player.local.pos.x,
        alt.Player.local.pos.y,
        alt.Player.local.pos.z
    );

    native.renderScriptCams(true, false, 0, true, false);

    // Hide Radar
    native.displayRadar(false);

    // Show Cursor
    alt.showCursor(true);

    // On Update Function
    alt.on('update', onUpdateCustomizer);

    // Turn on Webview Events
    webView.on('requestComponentData', requestComponentData);
    webView.on('updateComponent', updateComponent);
    webView.on('verifyClothing', verifyClothing);
    webView.on('getPreviousClothes', getPreviousClothes);
}

function getPreviousClothes() {
    const clothingData = alt.Player.local.getSyncedMeta('clothing');
    if (clothingData === undefined || clothingData === null) return;

    const data = JSON.parse(clothingData);

    for (let key in data) {
        webView.emit('updateClothes', key, data[key]);
    }
}

// On Update Customizer
function onUpdateCustomizer() {
    if (characterCamera === undefined) return;

    // Disable Controls for the Player
    native.disableAllControlActions(0);
    native.disableAllControlActions(1);
    let cursorRelativePos = alt.getCursorPos().x;

    // Scroll to zoom in.
    if (native.isDisabledControlPressed(0, 14)) {
        if (cursorRelativePos < screenWidth / 4) return;

        fov += 3;
        if (fov >= 100) fov = 100;
        updateCamera();
    }

    // Scroll to zoom out
    if (native.isDisabledControlPressed(0, 15)) {
        if (cursorRelativePos < screenWidth / 4) return;

        fov -= 3;
        if (fov <= 30) fov = 30;
        updateCamera();
    }

    // Right-Click Drag Rotation
    if (native.isDisabledControlPressed(0, 25)) {
        let heading = native.getEntityHeading(alt.Player.local.scriptID);

        if (cursorRelativePos < screenWidth / 2) {
            cursorRelativePos = -1.5;
        }

        if (cursorRelativePos > screenWidth - screenWidth / 2) {
            cursorRelativePos = 1.5;
        }

        native.setEntityHeading(
            alt.Player.local.scriptID,
            heading + cursorRelativePos
        );
    }

    // W - Up
    if (native.isDisabledControlPressed(0, 32)) {
        updateCamPos(true);
    }

    // S - Down
    if (native.isDisabledControlPressed(0, 33)) {
        updateCamPos(false);
    }
}

// Update Camera FOV
function updateCamera() {
    native.setCamFov(characterCamera, fov);
    native.renderScriptCams(true, false, 0, true, false);
}

// Update Camera Position
function updateCamPos(isUp) {
    let coord = native.getCamCoord(characterCamera);

    if (isUp) {
        cameraHeight += 0.01;
        if (cameraHeight > 2) {
            native.setCamCoord(characterCamera, coord.x, coord.y, coord.z);
        } else {
            native.setCamCoord(
                characterCamera,
                coord.x,
                coord.y,
                coord.z + 0.01
            );
        }
    } else {
        cameraHeight -= 0.01;
        if (cameraHeight < -0.5) {
            native.setCamCoord(characterCamera, coord.x, coord.y, coord.z);
        } else {
            native.setCamCoord(
                characterCamera,
                coord.x,
                coord.y,
                coord.z - 0.01
            );
        }
    }

    native.renderScriptCams(true, false, 0, true, false);
}

function requestComponentData(key, id, value, isProp) {
    if (!isProp) {
        let components = native.getNumberOfPedDrawableVariations(
            alt.Player.local.scriptID,
            id
        );

        let textures = native.getNumberOfPedTextureVariations(
            alt.Player.local.scriptID,
            id,
            value
        );

        webView.emit('updateMinMax', key, { id, components, textures });
    } else {
        let components = native.getNumberOfPedPropDrawableVariations(
            alt.Player.local.scriptID,
            id
        );

        let textures = native.getNumberOfPedPropTextureVariations(
            alt.Player.local.scriptID,
            id,
            value
        );

        webView.emit('updateMinMax', key, { id, components, textures });
    }
}

// componentID, drawable, texture, palette
function updateComponent(componentId, drawable, texture, isProp) {
    if (!isProp) {
        native.setPedComponentVariation(
            alt.Player.local.scriptID,
            componentId,
            drawable,
            texture,
            0
        );
    } else {
        native.setPedPropIndex(
            alt.Player.local.scriptID,
            componentId,
            drawable,
            texture,
            true
        );

        if (drawable === -1) {
            native.clearPedProp(alt.Player.local.scriptID, componentId);
        }
    }
}

export function closeDialogue() {
    native.freezeEntityPosition(alt.Player.local.scriptID, false);
    // On Update Function
    alt.off('update', onUpdateCustomizer);

    // Turn on Webview Events
    webView.off('requestComponentData', requestComponentData);
    webView.off('updateComponent', updateComponent);
    webView.off('verifyClothing', verifyClothing);
    webView.off('getPreviousClothes', getPreviousClothes);

    webView.unfocus();
    webView.destroy();

    characterCamera = undefined;
    native.destroyAllCams(true);

    native.displayRadar(true);

    alt.showCursor(false);
    native.renderScriptCams(false, false, 0, false, false);
}

// Verify the clothing is correct; before saving.
function verifyClothing(jsonData) {
    const result = JSON.parse(jsonData);

    let cancelSave = false;

    for (let key in result) {
        // Not a prop.
        if (!result[key].isProp) {
            let isValid = native.isPedComponentVariationValid(
                alt.Player.local.scriptID,
                result[key].id,
                result[key].value,
                result[key].texture
            );

            native.setPedComponentVariation(
                alt.Player.local.scriptID,
                result[key].id,
                result[key].value,
                result[key].texture,
                0
            );

            if (!isValid) {
                webView.emit('showError', `Invalid combination for ${key}`);
                cancelSave = true;
                return;
            }
        } else {
            // is a prop
            let isValid = native.isPedPropValid(
                alt.Player.local.scriptID,
                result[key].id,
                result[key].value,
                result[key].texture
            );

            // Make an exception for turning off
            // a prop.
            if (result[key].value === -1) {
                isValid = true;
                native.clearPedProp(alt.Player.local.scriptID, result[key].id);
            }

            native.setPedPropIndex(
                alt.Player.local.scriptID,
                result[key].id,
                result[key].value,
                result[key].texture,
                true
            );

            if (!isValid) {
                webView.emit('showError', `Invalid combination for ${key}`);
                cancelSave = true;
                return;
            }
        }
    }

    if (cancelSave) {
        return;
    }

    alt.log('Emitted up');
    alt.emitServer('clothing:SaveClothing', jsonData);
}
