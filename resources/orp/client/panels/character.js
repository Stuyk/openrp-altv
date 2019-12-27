import * as alt from 'alt';
import * as native from 'natives';
import { View } from '/client/utility/view.js';
import { Camera } from '/client/utility/camera.js';
import { HairOverlaysMale, HairOverlaysFemale } from '/client/gamedata/headOverlays.js';
import { FaceProperties } from '/client/gamedata/faceProperties.js';
import { showCursor } from '/client/utility/cursor.js';

alt.log('Loaded: client->panels->character.js');

const playerPoint = {
    x: -131.62091064453125,
    y: -633.7816772460938,
    z: 168.82057189941406
};

const url = 'http://resource/client/html/character/index.html';
let webview; // Used for the HTML View.
let camera; // Used for the Camera Manipulation
let lastHair = 0; // Get the last hair the player set.
let lastHairDecor = undefined;
let playerModel = 0;
let tattoos = [];
let zPos = 0.6;
let zoom = 35;
let rotation = 279;
let playerStandPoint;
let playerCamPoint;
let groupFlags;
let removeClothes = true;

export function showAsBarbershop() {
    const pos = alt.Player.local.pos;
    const flags = 88; // Hair, Eyes, and Makeup
    showDialogue(pos, flags, false);
}

export function showAsTattooShop() {
    const pos = alt.Player.local.pos;
    const flags = 128; // Hair, Eyes, and Makeup
    showDialogue(pos, flags, true);
}

// Load the character customizer, freeze controls, create camera, and ped.
export function showDialogue(playerPos, flags = 255, removeAllClothes = true) {
    if (!webview) {
        webview = new View();
    }

    if (playerPos) {
        playerStandPoint = playerPos;
    } else {
        playerStandPoint = playerPoint;
    }

    groupFlags = flags;
    removeClothes = removeAllClothes;

    alt.emitServer('utility:SetLastLocation', playerStandPoint);

    // Setup Webview
    webview.open(url, true);
    webview.on('character:HandleGroupChange', handleGroupChange);
    webview.on('character:Ready', ready);
    webview.on('character:CleanTattoos', cleanTattoos);
    webview.on('character:SetTattoos', setTattoos);
    webview.on('character:Rotate', changeRotate);
    webview.on('character:Zoom', changeZoom);
    webview.on('character:ZPos', changeZPos);
    webview.on('character:SaveChanges', saveChanges);
    // Setup a temporary teleport.
    alt.emit('chat:Toggle');

    // Request these models if they're not already loaded.
    const mHash = native.getHashKey('mp_m_freemode_01');
    const fHash = native.getHashKey('mp_f_freemode_01');

    native.requestModel(mHash);
    native.requestModel(fHash);
    alt.loadModel(mHash);
    alt.loadModel(fHash);
}

function ready() {
    if (!webview) {
        return;
    }

    alt.emit('hud:Hide', true);
    alt.emit('chat:Hide', true);
    showCursor(true);
    webview.emit('character:SetGroupFlags', groupFlags);
    if (groupFlags === 255) {
        webview.emit('character:SetFaceProperties', JSON.stringify(FaceProperties));
        updateSex(0);
    } else {
        const facePropsClone = { ...FaceProperties };
        const playerFaceData = {
            SexGroup: JSON.parse(alt.Player.local.getMeta('sexgroup')),
            FaceGroup: JSON.parse(alt.Player.local.getMeta('facegroup')),
            StructureGroup: JSON.parse(alt.Player.local.getMeta('structuregroup')),
            HairGroup: JSON.parse(alt.Player.local.getMeta('hairgroup')),
            EyesGroup: JSON.parse(alt.Player.local.getMeta('eyesgroup')),
            DetailGroup: JSON.parse(alt.Player.local.getMeta('detailgroup')),
            MakeupGroup: JSON.parse(alt.Player.local.getMeta('makeupgroup'))
        };

        playerModel = playerFaceData.SexGroup[0].value;

        Object.keys(playerFaceData).forEach(key => {
            playerFaceData[key].forEach((row, index) => {
                facePropsClone[key][index].value = row.value;
            });
        });

        const Tattoos = JSON.parse(alt.Player.local.getMeta('tattoogroup'));
        Tattoos.forEach(currentTattoo => {
            const index = facePropsClone.TattooGroup.findIndex(
                tat => tat.tattoo === currentTattoo.tattoo
            );

            if (index <= -1) {
                alt.log('Tat not found.');
                return;
            }

            facePropsClone.TattooGroup[index].value = 1;
        });

        webview.emit('character:SetFaceProperties', JSON.stringify(facePropsClone));
    }

    alt.emit('animation:Play', {
        dict: 'amb@world_human_hang_out_street@female_arms_crossed@base',
        name: 'base',
        duration: -1,
        flag: 2
    });

    alt.setTimeout(() => {
        resetCamera();
        adjustCamera();
    }, 500);
}

function changeZoom(value) {
    zoom = parseFloat(value);
    adjustCamera();
}

function changeZPos(value) {
    zPos = parseFloat(value);
    adjustCamera();
}

function adjustCamera() {
    const forwardVector = native.getEntityForwardVector(alt.Player.local.scriptID);
    const pPos = alt.Player.local.pos;
    const testCamPoint = {
        x: pPos.x + forwardVector.x * 1.2,
        y: pPos.y + forwardVector.y * 1.2,
        z: pPos.z + zPos
    };

    if (!playerCamPoint) {
        playerCamPoint = testCamPoint;
    }

    const isXUnequal = testCamPoint.x !== playerCamPoint.x;
    const isYUnequal = testCamPoint.y !== playerCamPoint.y;
    const isZUnequal = testCamPoint.z !== playerCamPoint.z;

    if (!camera) {
        camera = new Camera(playerCamPoint, zoom);
    }

    if (isXUnequal || isYUnequal || isZUnequal) {
        playerCamPoint = testCamPoint;
        camera.position(playerCamPoint.x, playerCamPoint.y, playerCamPoint.z);
    }

    const playerPosOffset = {
        x: pPos.x,
        y: pPos.y,
        z: pPos.z + zPos
    };
    camera.pointAtCoord(playerPosOffset);
    camera.fov(zoom);
    camera.render();
}

function changeRotate(value) {
    rotation = value;
    native.setEntityHeading(alt.Player.local.scriptID, parseFloat(value));
}

function cleanTattoos() {
    native.clearPedDecorations(alt.Player.local.scriptID);
    if (lastHairDecor) {
        const collection = native.getHashKey(lastHairDecor.collection);
        const overlay = native.getHashKey(lastHairDecor.overlay);
        native.addPedDecorationFromHashes(alt.Player.local.scriptID, collection, overlay);
    }
}

function setTattoos(tattoosData) {
    if (!tattoosData || tattoosData.length <= 0) {
        return;
    }

    tattoosData.forEach(tatt => {
        const tattooData = tatt.split('@');
        const collection = native.getHashKey(tattooData[0]);
        const overlay = native.getHashKey(tattooData[1]);
        native.addPedDecorationFromHashes(alt.Player.local.scriptID, collection, overlay);
    });

    tattoos = tattoosData;
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
            alt.Player.local.scriptID,
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
            native.setPedFaceFeature(
                alt.Player.local.scriptID,
                structure.id,
                structure.value
            );
        });
        return;
    }

    if (groupName === 'HairGroup') {
        if (lastHair !== data[0].value) {
            const variants = native.getNumberOfPedTextureVariations(
                alt.Player.local.scriptID,
                2,
                data[0].value
            );
            webview.emit('character:UpdateHairTextures', variants);
            data[3].value = 0;
            lastHair = data[0].value;
        }

        native.clearPedDecorations(alt.Player.local.scriptID);

        const decor =
            playerModel === 0
                ? HairOverlaysFemale[data[0].value]
                : HairOverlaysMale[data[0].value];

        lastHairDecor = decor;

        if (decor) {
            const collection = native.getHashKey(decor.collection);
            const overlay = native.getHashKey(decor.overlay);
            native.addPedDecorationFromHashes(
                alt.Player.local.scriptID,
                collection,
                overlay
            );
        }

        native.setPedComponentVariation(
            alt.Player.local.scriptID,
            2,
            data[0].value,
            data[3].value,
            0
        );
        native.setPedHairColor(alt.Player.local.scriptID, data[1].value, data[2].value);
        native.setPedHeadOverlay(
            alt.Player.local.scriptID,
            1,
            data[4].value,
            data[5].value
        );
        native.setPedHeadOverlayColor(
            alt.Player.local.scriptID,
            1,
            1,
            data[6].value,
            data[7].value
        );

        // Re-parse Tattoos
        tattoos.forEach(tattoo => {
            const tattooData = tattoo.split('@');
            const collection = native.getHashKey(tattooData[0]);
            const overlay = native.getHashKey(tattooData[1]);
            native.addPedDecorationFromHashes(
                alt.Player.local.scriptID,
                collection,
                overlay
            );
        });
        return;
    }

    if (groupName === 'EyesGroup') {
        native.setPedEyeColor(alt.Player.local.scriptID, data[0].value);
        native.setPedHeadOverlay(
            alt.Player.local.scriptID,
            2,
            data[1].value,
            data[2].value
        );
        native.setPedHeadOverlayColor(
            alt.Player.local.scriptID,
            2,
            1,
            data[3].value,
            data[4].value
        );
        return;
    }

    if (groupName === 'MakeupGroup') {
        // Makeup
        native.setPedHeadOverlay(
            alt.Player.local.scriptID,
            4,
            data[0].value,
            data[1].value
        );
        native.setPedHeadOverlayColor(
            alt.Player.local.scriptID,
            4,
            2,
            data[2].value,
            data[3].value
        );

        // Blush
        native.setPedHeadOverlay(
            alt.Player.local.scriptID,
            5,
            data[4].value,
            data[5].value
        );
        native.setPedHeadOverlayColor(
            alt.Player.local.scriptID,
            5,
            2,
            data[6].value,
            data[6].value
        );

        // Lipstick
        native.setPedHeadOverlay(
            alt.Player.local.scriptID,
            8,
            data[7].value,
            data[8].value
        );
        native.setPedHeadOverlayColor(
            alt.Player.local.scriptID,
            8,
            2,
            data[9].value,
            data[10].value
        );
        return;
    }

    if (groupName === 'DetailGroup') {
        let lastValue = 0;
        data.forEach((detail, index) => {
            if (index === 0 || index % 2 === 0) {
                lastValue = detail.value;
                return;
            }

            native.setPedHeadOverlay(
                alt.Player.local.scriptID,
                detail.id,
                lastValue,
                detail.value
            );
        });
        return;
    }
}

function updateSex(value) {
    if (value === 0) {
        playerModel = 0;
        resetCamera('mp_f_freemode_01');
    } else {
        playerModel = 1;
        resetCamera('mp_m_freemode_01');
    }
}

function resetCamera(modelToUse) {
    native.freezeEntityPosition(alt.Player.local.scriptID, false);

    if (modelToUse) {
        native.setPlayerModel(alt.Player.local.scriptID, native.getHashKey(modelToUse));
        native.setEntityCoords(
            alt.Player.local.scriptID,
            playerStandPoint.x,
            playerStandPoint.y,
            playerStandPoint.z,
            false,
            false,
            false,
            false
        );

        // Set Hair Fuzz
        native.addPedDecorationFromHashes(
            alt.Player.local.scriptID,
            native.getHashKey('mpbeach_overlays'),
            native.getHashKey('fm_hair_fuzz')
        );

        // Set the head blend data to 0 to prevent weird hair texture glitches. Thanks Matspyder
        native.setPedHeadBlendData(
            alt.Player.local.scriptID,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            false
        );
    }

    if (removeClothes) {
        if (playerModel === 0) {
            native.setPedComponentVariation(alt.Player.local.scriptID, 3, 15, 0, 0); // arms
            native.setPedComponentVariation(alt.Player.local.scriptID, 4, 14, 0, 0); // pants
            native.setPedComponentVariation(alt.Player.local.scriptID, 6, 35, 0, 0); // shoes
            native.setPedComponentVariation(alt.Player.local.scriptID, 8, 15, 0, 0); // shirt
            native.setPedComponentVariation(alt.Player.local.scriptID, 11, 15, 0, 0); // torso
        } else {
            native.setPedComponentVariation(alt.Player.local.scriptID, 3, 15, 0, 0); // arms
            native.setPedComponentVariation(alt.Player.local.scriptID, 4, 14, 0, 0); // pants
            native.setPedComponentVariation(alt.Player.local.scriptID, 6, 34, 0, 0); // shoes
            native.setPedComponentVariation(alt.Player.local.scriptID, 8, 15, 0, 0); // shirt
            native.setPedComponentVariation(alt.Player.local.scriptID, 11, 91, 0, 0); // torso
        }
    }

    alt.nextTick(() => {
        adjustCamera();
        webview.emit('character:SexUpdate');
    });

    alt.emit('animation:Play', {
        dict: 'amb@world_human_hang_out_street@female_arms_crossed@base',
        name: 'base',
        duration: -1,
        flag: 2
    });
}

function saveChanges(data) {
    if (webview) {
        webview.close();
    }

    if (camera) {
        camera.destroy();
        camera = undefined;
    }

    if (!data) {
        alt.emitServer('face:SetFacialData');
        return;
    }

    alt.emit('hud:Hide', false);
    alt.emit('chat:Hide', false);
    alt.emitServer('face:SetFacialData', data);
}
