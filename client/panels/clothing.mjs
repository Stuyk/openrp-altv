import * as alt from 'alt';
import * as native from 'natives';
import { View } from '/client/utility/view.mjs';
import { Camera } from '/client/utility/camera.mjs';
import * as utilityVector from '/client/utility/vector.mjs';

alt.log('Loaded: client->panels->clothing.mjs');

const url = 'http://resource/client/html/clothing/index.html';
let webview;
let camera = undefined;

// Setup the player clothing customizer.
export function showDialogue() {
    if (!webview) {
        webview = new View();
    }

    if (alt.Player.local.getMeta('viewOpen')) return;

    // Setup Webview
    webview.open(url, true);
    webview.on('clothing:RequestComponentData', requestComponentData);
    webview.on('clothing:UpdateComponent', updateComponent);
    webview.on('clothing:CloseDialogue', closeDialogue);
    webview.on('clothing:Purchase', purchaseClothing);
    webview.on('clothing:GetSex', getSex);

    native.freezeEntityPosition(alt.Player.local.scriptID, true);

    let pPos = utilityVector.getForwardVector(alt.Player.local.scriptID, 1.2);

    camera = new Camera(pPos, 90);
    camera.pointAtCoord(alt.Player.local.pos);
    camera.playerControlsEntity(alt.Player.local.scriptID);
}

function getSex() {
    let isMale = native.isPedMale(alt.Player.local.scriptID);
    webview.emit('setSex', isMale === true ? 1 : 0);
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
    alt.emitServer('clothing:Resync');
}

function purchaseClothing(json) {
    alt.emitServer('clothing:Purchase', json);
}
