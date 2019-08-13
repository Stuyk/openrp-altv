// List of all the facial features and functions that they need to use.
const facialFeatures = {
    Sex: {
        label: 'Sex',
        value: 0,
        min: 0,
        max: 1,
        increment: 1,
        func: updateSex
    }, // 0
    FatherFace: {
        label: 'Father Face',
        value: 0,
        min: 0,
        max: 45,
        increment: 1,
        func: updatePlayerFace
    }, // 1
    FatherSkin: {
        label: 'Father Skin',
        value: 0,
        min: 0,
        max: 45,
        increment: 1,
        func: updatePlayerFace
    }, // 2
    MotherFace: {
        label: 'Mother Face',
        value: 0,
        min: 0,
        max: 45,
        increment: 1,
        func: updatePlayerFace
    }, // 3
    MotherSkin: {
        label: 'Mother Skin',
        value: 0,
        min: 0,
        max: 45,
        increment: 1,
        func: updatePlayerFace
    }, // 4
    ExtraFace: {
        label: 'Extra Face',
        value: 0,
        min: 0,
        max: 45,
        increment: 1,
        func: updatePlayerFace
    }, // 5
    ExtraSkin: {
        label: 'Extra Skin',
        value: 0,
        min: 0,
        max: 45,
        increment: 1,
        func: updatePlayerFace
    }, // 6
    FaceMix: {
        label: 'Face Mix',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        func: updatePlayerFace
    }, // 7
    SkinMix: {
        label: 'Skin Mix',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        func: updatePlayerFace
    }, // 8
    ExtraMix: {
        label: 'Third Mix',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        func: updatePlayerFace
    }, // 9
    Hair: {
        label: 'Hair',
        value: 0,
        min: 0,
        max: 78,
        increment: 1,
        id: 2,
        func: updateHair
    }, // 10
    HairColor: {
        label: 'Hair Color',
        value: 0,
        min: 0,
        max: 78,
        id: 2,
        increment: 1,
        func: updateHair
    }, // 11
    HairHighlights: {
        label: 'Hair Highlights',
        value: 0,
        min: 0,
        max: 78,
        id: 2,
        increment: 1,
        func: updateHair
    }, // 12
    HairTexture: {
        label: 'Hairs Texture',
        value: 0,
        min: 0,
        max: 0,
        id: 2,
        increment: 1,
        func: updateHair
    }, // 13
    EyesColor: {
        label: 'Eyes Color',
        value: 0,
        min: 0,
        max: 32,
        id: 7,
        func: updateEyes,
        increment: 1
    }, // 14
    NoseWidth: {
        label: 'Nose Width',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 0,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 15
    NoseHeight: {
        label: 'Nose Height',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 1,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 16
    NoseLength: {
        label: 'Nose Length',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 2,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 17
    NoseBridge: {
        label: 'Nose Bridge',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 3,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 18
    NoseTip: {
        label: 'Nose Tip',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 4,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 19
    NoseBridgeShaft: {
        label: 'Nose Bridge Shaft',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 5,
        func: updateFaceFeature,
        isFaceFeature: true
    }, //20
    BrowHeight: {
        label: 'Brow Height',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 6,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 21
    BrowWidth: {
        label: 'Brow Width',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 7,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 22
    CheekboneHeight: {
        label: 'Cheekbone Height',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 8,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 23
    CheekboneWidth: {
        label: 'Cheekbone Width',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 9,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 24
    CheekWidth: {
        label: 'Cheek Width',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 10,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 25
    Eyelids: {
        label: 'Eyelids',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 11,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 26
    Lips: {
        label: 'Lips',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 12,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 27
    JawWidth: {
        label: 'Jaw Width',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 13,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 28
    JawHeight: {
        label: 'Jaw Height',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 14,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 29
    ChinLength: {
        label: 'Chin Length',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 15,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 30
    ChinPosition: {
        label: 'Chin Position',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 16,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 31
    ChinWidth: {
        label: 'Chin Width',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 17,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 32
    ChinShape: {
        label: 'Chin Shape',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 18,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 33
    NeckWidth: {
        label: 'Neck Width',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 19,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 34
    Blemish: {
        label: 'Blemish',
        value: 0,
        min: 0,
        max: 23,
        increment: 1,
        id: 0,
        func: updateFaceDecor,
        isFacialDecor: true
    }, // 35
    BlemishOpacity: {
        label: 'Blemish Opacity',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        id: 0,
        func: updateFaceDecor,
        isFacialDecor: true
    },
    FacialHair: {
        label: 'Facial Hair',
        value: 0,
        min: 0,
        max: 28,
        increment: 1,
        id: 1,
        func: updateFaceDecor,
        isFacialDecor: true
    }, // 37, 2
    FacialHairOpacity: {
        label: 'Facial Hair Opacity',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        id: 1,
        func: updateFaceDecor,
        isFacialDecor: true
    },
    FacialHairColor: {
        label: 'Facial Hair Color',
        value: 0,
        min: 0,
        max: 1,
        increment: 1,
        id: 1,
        colorType: 1,
        func: updateFaceDecor,
        isFacialDecor: true
    },
    FacialHairColor2: {
        label: 'Facial Hair Color 2',
        value: 0,
        min: 0,
        max: 1,
        increment: 1,
        id: 1,
        func: updateFaceDecor,
        isFacialDecor: true
    },
    Eyebrows: {
        label: 'Eyebrows',
        value: 0,
        min: 0,
        max: 33,
        increment: 1,
        id: 2,
        func: updateFaceDecor,
        isFacialDecor: true
    }, // 41
    EyebrowsOpacity: {
        label: 'Eyebrows Opacity',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        id: 2,
        func: updateFaceDecor,
        isFacialDecor: true
    },
    EyebrowsColor: {
        label: 'Eyebrows Color',
        value: 0,
        min: 0,
        max: 1,
        increment: 1,
        id: 2,
        colorType: 1,
        func: updateFaceDecor,
        isFacialDecor: true
    },
    EyebrowsColor2: {
        label: 'Eyebrows Color 2',
        value: 0,
        min: 0,
        max: 1,
        increment: 1,
        id: 2,
        func: updateFaceDecor,
        isFacialDecor: true
    },
    Age: {
        label: 'Age',
        value: 0,
        min: 0,
        max: 14,
        increment: 1,
        id: 3,
        func: updateFaceDecor,
        isFacialDecor: true
    }, // 45
    AgeOpacity: {
        label: 'Age Opacity',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        id: 3,
        func: updateFaceDecor,
        isFacialDecor: true
    },
    Makeup: {
        label: 'Makeup',
        value: 0,
        min: 0,
        max: 74,
        increment: 1,
        id: 4,
        func: updateFaceDecor,
        isFacialDecor: true
    }, // 47
    MakeupOpacity: {
        label: 'Makeup Opacity',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        id: 4,
        func: updateFaceDecor,
        isFacialDecor: true
    },
    MakeupColor: {
        label: 'Makeup Color',
        value: 0,
        min: 0,
        max: 1,
        increment: 1,
        id: 4,
        colorType: 1,
        func: updateFaceDecor,
        isFacialDecor: true
    },
    MakeupColor2: {
        label: 'Makeup Color 2',
        value: 0,
        min: 0,
        max: 1,
        increment: 1,
        id: 4,
        func: updateFaceDecor,
        isFacialDecor: true
    },
    Blush: {
        label: 'Blush',
        value: 0,
        min: 0,
        max: 6,
        increment: 1,
        id: 5,
        func: updateFaceDecor,
        isFacialDecor: true
    }, // 51
    BlushOpacity: {
        label: 'Blush Opacity',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        id: 5,
        func: updateFaceDecor,
        isFacialDecor: true
    },
    BlushColor: {
        label: 'Blush Color',
        value: 0,
        min: 0,
        max: 1,
        increment: 1,
        id: 5,
        colorType: 1,
        func: updateFaceDecor,
        isFacialDecor: true
    },
    Complexion: {
        label: 'Complexion',
        value: 0,
        min: 0,
        max: 11,
        increment: 1,
        id: 6,
        func: updateFaceDecor,
        isFacialDecor: true
    }, // 54
    ComplexionOpacity: {
        label: 'Complexion Opacity',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        id: 6,
        func: updateFaceDecor,
        isFacialDecor: true
    },
    SunDamage: {
        label: 'Sun Damage',
        value: 0,
        min: 0,
        max: 10,
        increment: 1,
        id: 7,
        func: updateFaceDecor,
        isFacialDecor: true
    }, // 56
    SunDamageOpacity: {
        label: 'Sun Damage Opacity',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        id: 7,
        func: updateFaceDecor,
        isFacialDecor: true
    },
    Lipstick: {
        label: 'Lipstick',
        value: 0,
        min: 0,
        max: 9,
        increment: 1,
        id: 8,
        func: updateFaceDecor,
        isFacialDecor: true
    }, // 58, 22
    LipstickOpacity: {
        label: 'Lipstick Opacity',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        id: 8,
        func: updateFaceDecor,
        isFacialDecor: true
    },
    LipstickColor: {
        label: 'Lipstick Color',
        value: 0,
        min: 0,
        max: 1,
        increment: 1,
        id: 8,
        colorType: 1,
        func: updateFaceDecor,
        isFacialDecor: true
    },
    LipstickColor2: {
        label: 'Lipstick Color 2',
        value: 0,
        min: 0,
        max: 1,
        increment: 1,
        id: 8,
        func: updateFaceDecor,
        isFacialDecor: true
    },
    Freckles: {
        label: 'Freckles',
        value: 0,
        min: 0,
        max: 17,
        increment: 1,
        id: 9,
        func: updateFaceDecor,
        isFacialDecor: true
    }, // 62, 26
    FrecklesOpacity: {
        label: 'Freckles Opacity',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        id: 9,
        func: updateFaceDecor,
        isFacialDecor: true
    }
};

const dataGroups = {
    Freckles: [facialFeatures['Freckles'], facialFeatures['FrecklesOpacity']],
    Lipstick: [
        facialFeatures['Lipstick'],
        facialFeatures['LipstickOpacity'],
        facialFeatures['LipstickColor'],
        facialFeatures['LipstickColor2']
    ],
    SunDamage: [
        facialFeatures['SunDamage'],
        facialFeatures['SunDamageOpacity']
    ],
    Complexion: [
        facialFeatures['Complexion'],
        facialFeatures['ComplexionOpacity']
    ],
    Blush: [
        facialFeatures['Blush'],
        facialFeatures['BlushOpacity'],
        facialFeatures['BlushColor']
    ],
    Makeup: [
        facialFeatures['Makeup'],
        facialFeatures['MakeupOpacity'],
        facialFeatures['MakeupColor'],
        facialFeatures['MakeupColor2']
    ],
    Age: [facialFeatures['Age'], facialFeatures['AgeOpacity']],
    Eyebrows: [
        facialFeatures['Eyebrows'],
        facialFeatures['EyebrowsOpacity'],
        facialFeatures['EyebrowsColor'],
        facialFeatures['EyebrowsColor2']
    ],
    FacialHair: [
        facialFeatures['FacialHair'],
        facialFeatures['FacialHairOpacity'],
        facialFeatures['FacialHairColor'],
        facialFeatures['FacialHairColor2']
    ],
    Blemishes: [facialFeatures['Blemish'], facialFeatures['BlemishOpacity']],
    Hair: [
        facialFeatures['Hair'],
        facialFeatures['HairColor'],
        facialFeatures['HairHighlights'],
        facialFeatures['HairTexture']
    ],
    Face: [
        facialFeatures['FatherFace'],
        facialFeatures['FatherSkin'],
        facialFeatures['MotherFace'],
        facialFeatures['MotherSkin'],
        facialFeatures['ExtraFace'],
        facialFeatures['ExtraSkin'],
        facialFeatures['FaceMix'],
        facialFeatures['SkinMix'],
        facialFeatures['ExtraMix']
    ]
};

// Setup buttons programatically for usage.
$(() => {
    for (let key in facialFeatures) {
        $('#populateButtons').append(
            `<div id="group-${key}" class="btn-group w-100 p-2 pl-3 pr-3" role="group"></div>`
        );

        // Decrease Value Button
        $(`#group-${key}`).append(
            `<button type="button" class="btn btn-sm btn-secondary" onclick="changeValue('${key}', false);">&lt;</button>`
        );

        // Label Text
        $(`#group-${key}`).append(
            `<button type="button" id="button-${key}" class="btn btn-sm btn-block btn-secondary" disabled>${
                facialFeatures[key].label
            } <span class="badge badge-secondary">[${
                facialFeatures[key].value
            }/${facialFeatures[key].max}]</span></button>`
        );

        // Increase Value Button
        $(`#group-${key}`).append(
            `<button type="button" class="btn btn-sm btn-secondary" onclick="changeValue('${key}', true);">&gt;</button>`
        );
    }

    // Submit Changes Button
    $('#populateButtons').append(
        `<button type="button" class="btn btn-sm btn-block btn-primary" onclick="submitChanges();">Submit Changes</button>`
    );
});

// Called when the player is submitting the values from above.
function submitChanges() {
    const dataPairs = {};

    Object.keys(facialFeatures).forEach(key => {
        dataPairs[key] = {};
        dataPairs[key].value = facialFeatures[key].value;

        if (facialFeatures[key].id !== undefined) {
            dataPairs[key].id = facialFeatures[key].id;
        }
    });

    let playerFacialData = JSON.stringify(dataPairs);
    alt.emit('setPlayerFacialData', playerFacialData);
}

// Updates the local facial values registered in this WebView
function changeValue(key, increment) {
    if (increment) {
        facialFeatures[key].value += facialFeatures[key].increment;
    } else {
        facialFeatures[key].value -= facialFeatures[key].increment;
    }

    // If we go above max, roll back around to min
    if (facialFeatures[key].value > facialFeatures[key].max) {
        facialFeatures[key].value = facialFeatures[key].min;
    }

    // If we go below min, roll back up to max
    if (facialFeatures[key].value < facialFeatures[key].min) {
        facialFeatures[key].value = facialFeatures[key].max;
    }

    if (facialFeatures[key].increment === 0.1) {
        facialFeatures[key].value =
            Number.parseFloat(facialFeatures[key].value).toFixed(2) * 1;
    }

    // Update the Value of the Key Pressed
    $(`#button-${key}`).html(
        `${facialFeatures[key].label} <span class="badge badge-secondary">[${
            facialFeatures[key].value
        }/${facialFeatures[key].max}]</span>`
    );

    // Call the function tied to the object element.
    facialFeatures[key].func(key);
}

// Change the player model / sex.
function updateSex(key) {
    alt.emit('updateSex', facialFeatures[key].value);
}

// Change the head blend data.
function updatePlayerFace(key) {
    let values = [];

    dataGroups['Face'].forEach(element => {
        values.push(element.value);
    });

    alt.emit('updatePlayerFace', JSON.stringify(values));
}

// Update the face decor; ie. blemish, sundamage, facial hair, etc.
function updateFaceDecor(key) {
    let result = getGroupByKey(key);

    if (result === undefined) return;

    alt.emit('updateFaceDecor', JSON.stringify(result));
}

// Update the face features such as nosewidth, height, etc.
function updateFaceFeature(key) {
    alt.emit(
        'updateFaceFeature',
        facialFeatures[key].id,
        facialFeatures[key].value
    );
}

// Update the hair for the player.
function updateHair(key) {
    let result = getGroupByKey(key);

    if (result === undefined) return;

    alt.emit('updateHair', JSON.stringify(result));
}

// Update the eyes for the player.
function updateEyes(key) {
    alt.emit('updateEyes', facialFeatures[key].value);
}

/**
 * Returns undefined or the group of elements to pass.
 * @param {keyFromButton} key
 */
function getGroupByKey(key) {
    let labelUsed = facialFeatures[key].label;

    let dataGroupKey = undefined;

    for (let data in dataGroups) {
        let foundData = dataGroups[data].find(dat => dat.label === labelUsed);
        if (foundData === undefined) continue;

        dataGroupKey = data;
        break;
    }

    if (dataGroupKey === undefined) return undefined;

    return dataGroups[dataGroupKey];
}

if ('alt' in window) {
    // Grab the Style Variations

    alt.on('stylesUpdate', (hairStyles, hairColors) => {
        facialFeatures['Hair'].max = hairStyles;

        Object.keys(facialFeatures).forEach(element => {
            if (facialFeatures[element].label.toLowerCase().includes('color')) {
                facialFeatures[element].max = hairColors;
                $(`#button-${element}`).html(`
				${facialFeatures[element].label} <span class="badge badge-secondary">[${
                    facialFeatures[element].value
                }/${facialFeatures[element].max}]</span>`);
            }
        });
    });

    // Called when the player changes their hair so we can setup new hair texture variations.
    alt.on('setHairTextureVariations', hairTextureVariations => {
        console.log(hairTextureVariations);

        facialFeatures['HairTexture'].max = hairTextureVariations;
        facialFeatures['HairTexture'].value = 0;

        $(`#button-HairTexture`).html(`
			${facialFeatures['HairTexture'].label} <span class="badge badge-secondary">[${
            facialFeatures['HairTexture'].value
        }/${facialFeatures['HairTexture'].max}]</span>`);
    });
}
