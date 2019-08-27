import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->character->face.mjs');

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

    // Set all to zero to prevent bugs.
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

    native.clearPedBloodDamage(alt.Player.local.scriptID);
    native.clearPedDecorations(alt.Player.local.scriptID);

    // Setup Player Face Outright
    native.setPedHeadBlendData(
        alt.Player.local.scriptID,
        parsedData['FatherFace'].value,
        parsedData['MotherFace'].value,
        0,
        parsedData['FatherSkin'].value,
        parsedData['MotherSkin'].value,
        0,
        parsedData['FaceMix'].value,
        parsedData['SkinMix'].value,
        0,
        false
    );

    // Set Eye Color
    native.setPedEyeColor(alt.Player.local.scriptID, parsedData['EyesColor'].value);

    // Facial Features - 0 to 19
    faceFeatureNames.forEach((faceFeature, index) => {
        native.setPedFaceFeature(
            alt.Player.local.scriptID,
            index,
            parsedData[faceFeature].value
        );
    });

    // Ped Overlay Features
    native.setPedHeadOverlay(
        alt.Player.local.scriptID,
        0,
        parsedData['Blemish'].value,
        parsedData['BlemishOpacity'].value
    );

    // Facial Hair
    native.setPedHeadOverlay(
        alt.Player.local.scriptID,
        1,
        parsedData['FacialHair'].value,
        parsedData['FacialHairOpacity'].value
    );
    native.setPedHeadOverlayColor(
        alt.Player.local.scriptID,
        1,
        1,
        parsedData['FacialHairColor'].value,
        parsedData['FacialHairColor2'].value
    );

    // Eyebrows
    native.setPedHeadOverlay(
        alt.Player.local.scriptID,
        2,
        1,
        parsedData['Eyebrows'].value,
        parsedData['EyebrowsOpacity'].value
    );
    native.setPedHeadOverlayColor(
        alt.Player.local.scriptID,
        2,
        1,
        parsedData['EyebrowsColor'].value,
        parsedData['EyebrowsColor2'].value
    );

    // Ageing
    native.setPedHeadOverlay(
        alt.Player.local.scriptID,
        3,
        parsedData['Age'].value,
        parsedData['AgeOpacity'].value
    );

    // Makeup
    native.setPedHeadOverlay(
        alt.Player.local.scriptID,
        4,
        parsedData['Makeup'].value,
        parsedData['MakeupOpacity'].value
    );
    native.setPedHeadOverlayColor(
        alt.Player.local.scriptID,
        4,
        2,
        parsedData['MakeupColor'].value,
        parsedData['MakeupColor2'].value
    );

    // Blush
    native.setPedHeadOverlay(
        alt.Player.local.scriptID,
        5,
        parsedData['Blush'].value,
        parsedData['BlushOpacity'].value
    );
    native.setPedHeadOverlayColor(
        alt.Player.local.scriptID,
        5,
        2,
        parsedData['BlushColor'].value,
        parsedData['BlushColor'].value
    );

    // Complexion
    native.setPedHeadOverlay(
        alt.Player.local.scriptID,
        6,
        parsedData['Complexion'].value,
        parsedData['ComplexionOpacity'].value
    );

    // SunDamage
    native.setPedHeadOverlay(
        alt.Player.local.scriptID,
        7,
        parsedData['SunDamage'].value,
        parsedData['SunDamageOpacity'].value
    );

    // Lipstick
    native.setPedHeadOverlay(
        alt.Player.local.scriptID,
        8,
        parsedData['Lipstick'].value,
        parsedData['LipstickOpacity'].value
    );

    native.setPedHeadOverlayColor(
        alt.Player.local.scriptID,
        8,
        2,
        parsedData['LipstickColor'].value,
        parsedData['LipstickColor2'].value
    );

    // Freckles
    native.setPedHeadOverlay(
        alt.Player.local.scriptID,
        9,
        parsedData['Freckles'].value,
        parsedData['FrecklesOpacity'].value
    );

    // Set Hair, Texture, Highlights, etc.
    native.setPedComponentVariation(
        alt.Player.local.scriptID,
        2,
        parsedData['Hair'].value,
        parsedData['HairTexture'].value,
        2
    );

    native.setPedHairColor(
        alt.Player.local.scriptID,
        parsedData['HairColor'].value,
        parsedData['HairHighlights'].value
    );

    if (parsedData['Overlay']) {
        const coll = native.getHashKey(parsedData['Overlay'].collection);
        const over = native.getHashKey(parsedData['Overlay'].overlay);
        native.clearPedDecorations(alt.Player.local.scriptID);
        native.setPedDecoration(alt.Player.local.scriptID, coll, over);
    }
}
