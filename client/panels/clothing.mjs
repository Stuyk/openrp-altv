import * as alt from 'alt';
import * as native from 'natives';
import { View } from 'client/utility/view.mjs';
import { Camera } from 'client/utility/camera.mjs';
import * as utilityVector from 'client/utility/vector.mjs';

alt.log('Loaded: client->customizers->clothing.mjs');

const url = 'http://resource/client/html/clothing/index.html';
let webview;
let camera = undefined;

// Setup the player clothing customizer.
export function showDialogue() {
    if (!alt.Player.local.getSyncedMeta('loggedin')) return;
    // Setup Webview
    const exists = webview === undefined ? false : true;
    webview = new View(url, false);
    if (!exists) {
        webview.on('clothing:RequestComponentData', requestComponentData);
        webview.on('clothing:UpdateComponent', updateComponent);
        webview.on('clothing:VerifyClothing', verifyClothing);
        webview.on('clothing:GetPreviousClothes', getPreviousClothes);
    }

    native.freezeEntityPosition(alt.Player.local.scriptID, true);

    let pPos = utilityVector.getForwardVector(alt.Player.local.scriptID, 1.2);

    camera = new Camera(pPos, 90);
    camera.pointAtCoord(alt.Player.local.pos);
    camera.playerControlsEntity(alt.Player.local.scriptID);
}

function getPreviousClothes() {
    const clothingData = alt.Player.local.getSyncedMeta('clothing');
    if (clothingData === undefined || clothingData === null) return;

    alt.log(clothingData);

    const data = JSON.parse(clothingData);

    if (data === undefined) return;

    for (let key in data) {
        webview.emit('updateClothes', key, data[key]);
    }
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

        webview.emit('updateMinMax', key, { id, components, textures });
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

        webview.emit('updateMinMax', key, { id, components, textures });
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
    webview.close();
    camera.destroy();
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
                webview.emit('showError', `Invalid combination for ${key}`);
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
                webview.emit('showError', `Invalid combination for ${key}`);
                cancelSave = true;
                return;
            }
        }
    }

    if (cancelSave) {
        return;
    }

    alt.emitServer('clothing:SaveClothing', jsonData);
}
