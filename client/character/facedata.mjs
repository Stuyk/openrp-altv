import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->character->facedata.mjs');

// Used for facial features loop.
const faceFeatureNames = [
    'NoseWidth',
    'NoseHeight',
    'NoseLength',
    'NoseBridge',
    'NoseTip',
    'NoseBridgeShaft',
    'BrowHeight',
    'BrowWidth',
    'CheekboneHeight',
    'CheekboneWidth',
    'CheekWidth',
    'Eyelids',
    'Lips',
    'JawWidth',
    'JawHeight',
    'ChinLength',
    'ChinPosition',
    'ChinWidth',
    'ChinShape',
    'NeckWidth'
];

// Apply all of the facial data to the player.
export function applyFacialData(jsonData) {
    const parsedData = JSON.parse(jsonData);

    const localPlayer = alt.Player.local.scriptID;

    // Set all to zero to prevent bugs.
    native.setPedHeadBlendData(localPlayer, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);

    // Setup Player Face Outright
    native.setPedHeadBlendData(
        localPlayer,
        parsedData['FatherFace'].value,
        parsedData['MotherFace'].value,
        parsedData['ExtraFace'].value,
        parsedData['FatherSkin'].value,
        parsedData['MotherSkin'].value,
        parsedData['ExtraSkin'].value,
        parsedData['FaceMix'].value,
        parsedData['SkinMix'].value,
        parsedData['ExtraMix'].value,
        false
    );

    // Set Hair, Texture, Highlights, etc.
    native.setPedComponentVariation(
        localPlayer,
        2,
        parsedData['Hair'].value,
        parsedData['HairTexture'].value,
        2
    );

    native.setPedHairColor(
        localPlayer,
        parsedData['HairColor'].value,
        parsedData['HairHighlights'].value
    );

    // Set Eye Color
    native.setPedEyeColor(localPlayer, parsedData['EyesColor'].value);

    // Facial Features - 0 to 19
    faceFeatureNames.forEach((faceFeature, index) => {
        native.setPedFaceFeature(
            localPlayer,
            index,
            parsedData[faceFeature].value
        );
    });

    // Ped Overlay Features
    native.setPedHeadOverlay(
        localPlayer,
        0,
        parsedData['Blemish'].value,
        parsedData['BlemishOpacity'].value
    );

    // Facial Hair
    native.setPedHeadOverlay(
        localPlayer,
        1,
        parsedData['FacialHair'].value,
        parsedData['FacialHairOpacity'].value
    );
    native.setPedHeadOverlayColor(
        localPlayer,
        1,
        1,
        parsedData['FacialHairColor'].value,
        parsedData['FacialHairColor2'].value
    );

    // Eyebrows
    native.setPedHeadOverlay(
        localPlayer,
        2,
        1,
        parsedData['Eyebrows'].value,
        parsedData['EyebrowsOpacity'].value
    );
    native.setPedHeadOverlayColor(
        localPlayer,
        2,
        1,
        parsedData['EyebrowsColor'].value,
        parsedData['EyebrowsColor2'].value
    );

    // Ageing
    native.setPedHeadOverlay(
        localPlayer,
        3,
        parsedData['Age'].value,
        parsedData['AgeOpacity'].value
    );

    // Makeup
    native.setPedHeadOverlay(
        localPlayer,
        4,
        parsedData['Makeup'].value,
        parsedData['MakeupOpacity'].value
    );
    native.setPedHeadOverlayColor(
        localPlayer,
        4,
        2,
        parsedData['MakeupColor'].value,
        parsedData['MakeupColor2'].value
    );

    // Blush
    native.setPedHeadOverlay(
        localPlayer,
        5,
        parsedData['Blush'].value,
        parsedData['BlushOpacity'].value
    );
    native.setPedHeadOverlayColor(
        localPlayer,
        5,
        2,
        parsedData['BlushColor'].value,
        parsedData['BlushColor'].value
    );

    // Complexion
    native.setPedHeadOverlay(
        localPlayer,
        6,
        parsedData['Complexion'].value,
        parsedData['ComplexionOpacity'].value
    );

    // SunDamage
    native.setPedHeadOverlay(
        localPlayer,
        7,
        parsedData['SunDamage'].value,
        parsedData['SunDamageOpacity'].value
    );

    // Lipstick
    native.setPedHeadOverlay(
        localPlayer,
        8,
        parsedData['Lipstick'].value,
        parsedData['LipstickOpacity'].value
    );

    native.setPedHeadOverlayColor(
        localPlayer,
        8,
        2,
        parsedData['LipstickColor'].value,
        parsedData['LipstickColor2'].value
    );

    // Freckles
    native.setPedHeadOverlay(
        localPlayer,
        9,
        parsedData['Freckles'].value,
        parsedData['FrecklesOpacity'].value
    );
}
