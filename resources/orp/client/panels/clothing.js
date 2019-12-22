import * as alt from 'alt';
import * as native from 'natives';
import { View } from '/client/utility/view.js';
import { Camera } from '/client/utility/camera.js';
import { ClothingProperties } from '/client/gamedata/clothingProperties.js';
import { showCursor } from '/client/utility/cursor.js';

alt.log('Loaded: client->panels->clothing.js');

const url = 'http://resource/client/html/clothing/index.html';
let webview;
let camera = undefined;
let rotation = 180;
let zoom = 90;
let zpos = 0;
let campos;

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
    webview.on('clothing:Ready', ready);
    webview.on('clothing:UpdateComponent', updateComponent);
    webview.on('clothing:GetComponentData', getComponentData);
    webview.on('clothing:ChangeZoom', changeZoom);
    webview.on('clothing:ChangeZPos', changeZPos);
    webview.on('clothing:ChangeRotation', changeRotation);
    webview.on('clothing:Close', closeDialogue);
    webview.on('clothing:Purchase', purchaseClothing);
    alt.emit('hud:Hide', true);
    alt.emit('chat:Hide', true);

    changeRotation(rotation);
}

function changeZoom(value) {
    zoom = value;
    adjustCamera();
}

function changeZPos(value) {
    zpos = value;
    alt.log(value);
    adjustCamera();
}

function changeRotation(value) {
    rotation = value;
    native.setEntityHeading(alt.Player.local.scriptID, rotation);
}

function adjustCamera() {
    const forwardVector = native.getEntityForwardVector(alt.Player.local.scriptID);
    const pPos = alt.Player.local.pos;

    campos = {
        x: pPos.x + forwardVector.x * 1.2,
        y: pPos.y + forwardVector.y * 1.2,
        z: pPos.z + zpos
    };

    if (!camera) {
        camera = new Camera(campos, zoom);
    }
    camera.position(campos.x, campos.y, campos.z);

    const playerPosOffset = {
        x: pPos.x,
        y: pPos.y,
        z: pPos.z + zpos
    };
    camera.pointAtCoord(playerPosOffset);
    camera.fov(zoom);
    camera.render();
}

function ready() {
    if (!webview) return;
    showCursor(true);
    const sexGroup = JSON.parse(alt.Player.local.getMeta('sexgroup'));
    if (!sexGroup) {
        sexGroup = [{ value: 0 }];
    }

    webview.emit('clothing:SetSex', sexGroup[0].value);
    webview.emit('clothing:SetClothingProps', JSON.stringify(ClothingProperties));

    const skip = [5, 2, 9, 10];

    // Setup Component Data
    for (let drawable = 1; drawable < 12; drawable++) {
        if (skip.includes(drawable)) {
            continue;
        }

        getComponentData(drawable, 0, false);
        getPreviousData(drawable, false);
    }

    // Props
    getComponentData(0, -1, true);
    getComponentData(1, -1, true);
    getComponentData(2, -1, true);
    getComponentData(6, -1, true);
    getComponentData(7, -1, true);

    getPreviousData(0, true);
    getPreviousData(1, true);
    getPreviousData(2, true);
    getPreviousData(6, true);
    getPreviousData(7, true);

    // Get Current Clothing
    adjustCamera();
}

function getPreviousData(id, isProp) {
    const scriptID = alt.Player.local.scriptID;

    if (isProp) {
        let index = native.getPedPropIndex(scriptID, isProp);
        let texture = native.getPedPropTextureIndex(scriptID, 0);

        if (index === undefined) {
            index = -1;
            texture = 0;
        }

        webview.emit('clothing:SetPrevComponentValue', id, index, texture, true);
    } else {
        const index = native.getPedDrawableVariation(scriptID, id);
        const texture = native.getPedTextureVariation(scriptID, id);
        webview.emit('clothing:SetPrevComponentValue', id, index, texture, false);
    }
}

function getComponentData(id, value, isProp = false) {
    const scriptID = alt.Player.local.scriptID;

    if (!isProp) {
        const drawables = native.getNumberOfPedDrawableVariations(scriptID, id);
        let textures = native.getNumberOfPedTextureVariations(scriptID, id, value);
        if (textures !== 0) {
            textures -= 1;
        }

        webview.emit('clothing:SetComponentMax', id, drawables, textures, false);
    } else {
        const drawables = native.getNumberOfPedPropDrawableVariations(scriptID, id);
        let textures = native.getNumberOfPedPropTextureVariations(scriptID, id, value);
        if (textures !== 0) {
            textures -= 1;
        }
        webview.emit('clothing:SetComponentMax', id, drawables, textures, true);
    }
}

function updateComponent(id, drawable, texture, isProp) {
    const scriptID = alt.Player.local.scriptID;
    if (isProp) {
        native.setPedPropIndex(scriptID, id, drawable, texture, true);
        if (drawable === -1) {
            native.clearPedProp(scriptID, id);
        } else {
            getComponentData(id, drawable, true);
        }
        return;
    }

    getComponentData(id, drawable, false);
    native.setPedComponentVariation(scriptID, id, drawable, texture, 0);
}

export function closeDialogue() {
    if (webview) {
        webview.close();
    }

    if (camera) {
        camera.destroy();
        camera = undefined;
    }

    alt.emit('hud:Hide', false);
    alt.emit('chat:Hide', false);

    native.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.emitServer('clothing:Resync');
}

function purchaseClothing(json) {
    alt.emitServer('clothing:Purchase', json);
}
