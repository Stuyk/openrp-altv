import * as alt from 'alt';
import * as native from 'natives';
import { View } from '/client/utility/view.mjs';
import { Camera } from '/client/utility/camera.mjs';
import { Ped } from '/client/systems/peds.mjs';
import { HairOverlaysMale, HairOverlaysFemale } from '/client/gamedata/headOverlays.mjs';
import { FaceProperties } from '/client/gamedata/faceProperties.mjs';
import { getDirection } from '/client/utility/vector.mjs';

alt.log('Loaded: client->panels->character.mjs');

const cameraPoint = {
    x: -130.614990234375,
    y: -633.6951904296875,
    z: 168.82057189941406
};

const offsetPoint = {
    x: -130.7032928466797,
    y: -644.9724975585938,
    z: 169.413232421875
};

const playerPoint = {
    x: -131.62091064453125,
    y: -633.7816772460938,
    z: 168.82057189941406
};

const url = 'http://resource/client/html/character-new/index.html';
let webview; // Used for the HTML View.
let camera; // Used for the Camera Manipulation
let ped; // The pedestrian we create.
let lastHair = 0; // Get the last hair the player set.
let lastHairDecor = undefined;
let playerModel = 0;
let tattoos = [];
let zPos = 0.6;
let zoom = 35;

// Load the character customizer, freeze controls, create camera, and ped.
export function showDialogue() {
    if (!webview) {
        webview = new View();
    }

    // Setup Webview
    webview.open(url, true);
    webview.on('character:HandleGroupChange', handleGroupChange);
    webview.on('character:Ready', ready);
    webview.on('character:CleanTattoos', cleanTattoos);
    webview.on('character:HandleTattoo', handleTattoo);
    webview.on('character:Rotate', changeRotate);
    webview.on('character:Zoom', changeZoom);
    webview.on('character:ZPos', changeZPos);

    // Setup a temporary teleport.
    alt.emitServer('temporaryTeleport', offsetPoint);
    alt.emit('chat:Toggle');

    // Request these models if they're not already loaded.
    const mHash = native.getHashKey('mp_m_freemode_01');
    const fHash = native.getHashKey('mp_f_freemode_01');

    native.requestModel(mHash);
    native.requestModel(fHash);
    alt.loadModel(mHash);
    alt.loadModel(fHash);
    native.displayRadar(false);
}

function ready() {
    if (!webview) return;
    webview.emit('character:SetFaceProperties', JSON.stringify(FaceProperties));
    updateSex(0);
}

function changeZoom(value) {
    zoom = parseFloat(value);
    alt.log(`Zoom: ${zoom}`);
    adjustCamera();
}

function changeZPos(value) {
    zPos = parseFloat(value);
    alt.log(`ZPos: ${zPos}`);
    adjustCamera();
}

function adjustCamera() {
    const modifiedCam = {
        x: cameraPoint.x,
        y: cameraPoint.y,
        z: cameraPoint.z + zPos
    };

    camera.position(modifiedCam.x, modifiedCam.y, modifiedCam.z);
    const modifiedPos = {
        x: playerPoint.x,
        y: playerPoint.y,
        z: playerPoint.z + zPos
    };
    camera.pointAtCoord(modifiedPos);
    camera.fov(zoom);
    camera.render();
}

function changeRotate(value) {
    if (!ped) return;
    native.setEntityHeading(ped.scriptID, parseFloat(value));
}

function cleanTattoos() {
    native.clearPedDecorations(ped.scriptID);
    if (lastHairDecor) {
        const collection = native.getHashKey(lastHairDecor.collection);
        const overlay = native.getHashKey(lastHairDecor.overlay);
        native.addPedDecorationFromHashes(ped.scriptID, collection, overlay);
    }
}

function handleTattoo(tattoo, addTattoo) {
    if (!addTattoo) {
        const index = tattoos.findIndex(tat => tat === tattoo);
        if (index <= -1) return;
        tattoos.splice(index, 1);
        return;
    }

    const tattooData = tattoo.split('@');
    const collection = native.getHashKey(tattooData[0]);
    const overlay = native.getHashKey(tattooData[1]);
    native.addPedDecorationFromHashes(ped.scriptID, collection, overlay);
    tattoos.push(tattoo);
}

function handleGroupChange(groupName, values) {
    const data = JSON.parse(values);

    if (groupName === 'SexGroup') {
        const newSex = playerModel === 0 ? 1 : 0;
        updateSex(newSex);
        return;
    }

    if (groupName === 'FaceGroup') {
        native.setPedHeadBlendData(
            ped.scriptID,
            data[0].value,
            data[1].value,
            0,
            data[2].value,
            data[3].value,
            0,
            data[4].value,
            data[5].value,
            0,
            false
        );
        return;
    }

    if (groupName === 'StructureGroup') {
        data.forEach(structure => {
            native.setPedFaceFeature(ped.scriptID, structure.id, structure.value);
        });
        return;
    }

    if (groupName === 'HairGroup') {
        if (lastHair !== data[0].value) {
            const variants = native.getNumberOfPedTextureVariations(
                ped.scriptID,
                2,
                data[0].value
            );
            webview.emit('character:UpdateHairTextures', variants);
            data[3].value = 0;
            lastHair = data[0].value;
        }

        native.clearPedDecorations(ped.scriptID);
        const decor =
            playerModel === 0
                ? HairOverlaysFemale[data[0].value]
                : HairOverlaysMale[data[0].value];

        lastHairDecor = decor;

        if (decor) {
            const collection = native.getHashKey(decor.collection);
            const overlay = native.getHashKey(decor.overlay);
            native.addPedDecorationFromHashes(ped.scriptID, collection, overlay);
        }

        native.setPedComponentVariation(ped.scriptID, 2, data[0].value, data[3].value, 0);
        native.setPedHairColor(ped.scriptID, data[1].value, data[2].value);
        native.setPedHeadOverlay(ped.scriptID, 1, data[4].value, data[5].value);
        native.setPedHeadOverlayColor(ped.scriptID, 1, 1, data[6].value, data[7].value);

        // Re-parse Tattoos
        tattoos.forEach(tattoo => {
            const tattooData = tattoo.split('@');
            const collection = native.getHashKey(tattooData[0]);
            const overlay = native.getHashKey(tattooData[1]);
            native.addPedDecorationFromHashes(ped.scriptID, collection, overlay);
        });
        return;
    }

    if (groupName === 'EyesGroup') {
        native.setPedEyeColor(ped.scriptID, data[0].value);
        native.setPedHeadOverlay(ped.scriptID, 2, data[1].value, data[2].value);
        native.setPedHeadOverlayColor(ped.scriptID, 2, 1, data[3].value, data[4].value);
        return;
    }

    if (groupName === 'MakeupGroup') {
        // Makeup
        native.setPedHeadOverlay(ped.scriptID, 4, data[0].value, data[1].value);
        native.setPedHeadOverlayColor(ped.scriptID, 4, 2, data[2].value, data[3].value);

        // Blush
        native.setPedHeadOverlay(ped.scriptID, 5, data[4].value, data[5].value);
        native.setPedHeadOverlayColor(ped.scriptID, 5, 2, data[6].value, data[6].value);

        // Lipstick
        native.setPedHeadOverlay(ped.scriptID, 8, data[7].value, data[8].value);
        native.setPedHeadOverlayColor(ped.scriptID, 8, 2, data[9].value, data[10].value);
        return;
    }

    if (groupName === 'DetailGroup') {
        let lastValue = 0;
        data.forEach((detail, index) => {
            if (index === 0 || index % 2 === 0) {
                lastValue = detail.value;
                return;
            }

            native.setPedHeadOverlay(ped.scriptID, detail.id, lastValue, detail.value);
        });
        return;
    }
}

function updateSex(value) {
    if (value === 0) {
        resetCamera('mp_f_freemode_01');
        playerModel = 0;
    } else {
        resetCamera('mp_m_freemode_01');
        playerModel = 1;
    }
}

function resetCamera(modelToUse) {
    if (ped) {
        // Delete the new ped.
        ped.destroy();
    }

    // Re-Create the Ped
    ped = new Ped(modelToUse, playerPoint);
    const heading = native.getEntityHeading(ped.scriptID);
    native.setEntityHeading(ped.scriptID, heading - 90);

    // Set Hair Fuzz
    native.addPedDecorationFromHashes(
        ped.scriptID,
        native.getHashKey('mpbeach_overlays'),
        native.getHashKey('fm_hair_fuzz')
    );

    // Set the head blend data to 0 to prevent weird hair texture glitches. Thanks Matspyder
    native.setPedHeadBlendData(ped.scriptID, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);

    if (modelToUse === 'mp_f_freemode_01') {
        native.setPedComponentVariation(ped.scriptID, 3, 15, 0, 0); // arms
        native.setPedComponentVariation(ped.scriptID, 4, 14, 0, 0); // pants
        native.setPedComponentVariation(ped.scriptID, 6, 35, 0, 0); // shoes
        native.setPedComponentVariation(ped.scriptID, 8, 15, 0, 0); // shirt
        native.setPedComponentVariation(ped.scriptID, 11, 15, 0, 0); // torso
    } else {
        native.setPedComponentVariation(ped.scriptID, 3, 15, 0, 0); // arms
        native.setPedComponentVariation(ped.scriptID, 4, 14, 0, 0); // pants
        native.setPedComponentVariation(ped.scriptID, 6, 34, 0, 0); // shoes
        native.setPedComponentVariation(ped.scriptID, 8, 15, 0, 0); // shirt
        native.setPedComponentVariation(ped.scriptID, 11, 91, 0, 0); // torso
    }

    if (!camera) {
        camera = new Camera(cameraPoint, zoom);
    }

    adjustCamera();

    // camera.pointAtBone(ped.scriptID, 31086, 0.05, 0, 0);
    webview.emit('character:SexUpdate');
}

alt.on('consoleCommand', (cmd, ...args) => {
    if (cmd === 'ttt') {
        showDialogue();
    }
});
