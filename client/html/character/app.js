// List of all the facial features.
const facialFeatures = {
    Sex: { value: 0, min: 0, max: 1, increment: 1, func: updateSex }, // 0
    'Father Face': {
        value: 0,
        min: 0,
        max: 45,
        increment: 1,
        func: updatePlayerFace
    }, // 1
    'Father Skin': {
        value: 0,
        min: 0,
        max: 45,
        increment: 1,
        func: updatePlayerFace
    }, // 2
    'Mother Face': {
        value: 0,
        min: 0,
        max: 45,
        increment: 1,
        func: updatePlayerFace
    }, // 3
    'Mother Skin': {
        value: 0,
        min: 0,
        max: 45,
        increment: 1,
        func: updatePlayerFace
    }, // 4
    'Extra Face': {
        value: 0,
        min: 0,
        max: 45,
        increment: 1,
        func: updatePlayerFace
    }, // 5
    'Extra Skin': {
        value: 0,
        min: 0,
        max: 45,
        increment: 1,
        func: updatePlayerFace
    }, // 6
    'Face Mix': {
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        func: updatePlayerFace
    }, // 7
    'Skin Mix': {
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        func: updatePlayerFace
    }, // 8
    'Third Mix': {
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        func: updatePlayerFace
    }, // 9
    Hair: { value: 0, min: 0, max: 78, increment: 1, func: updateHair }, // 10
    'Hair Color 1': {
        value: 0,
        min: 0,
        max: 78,
        increment: 1,
        func: updateHair
    }, // 11
    'Hair Color 2': {
        value: 0,
        min: 0,
        max: 78,
        increment: 1,
        func: updateHair
    }, // 12
    'Hair Texture': {
        value: 0,
        min: 0,
        max: 0,
        increment: 1,
        func: updateHair
    }, // 13
    'Eye Color': { value: 0, min: 0, max: 32, increment: 1 }, // 14
    'Nose Width': { value: 0, min: -1, max: 1, increment: 0.1 }, // 15
    'Nose Height': { value: 0, min: -1, max: 1, increment: 0.1 }, // 16
    'Nose Length': { value: 0, min: -1, max: 1, increment: 0.1 }, // 17
    'Nose Bridge': { value: 0, min: -1, max: 1, increment: 0.1 }, // 18
    'Nose Tip': { value: 0, min: -1, max: 1, increment: 0.1 }, // 19
    'Nose Bridge Shaft': { value: 0, min: -1, max: 1, increment: 0.1 }, //20
    'Brow Height': { value: 0, min: -1, max: 1, increment: 0.1 }, // 21
    'Brow Width': { value: 0, min: -1, max: 1, increment: 0.1 }, // 22
    'Cheekbone Height': { value: 0, min: -1, max: 1, increment: 0.1 }, // 23
    'Cheekbone Width': { value: 0, min: -1, max: 1, increment: 0.1 }, // 24
    'Cheek Width': { value: 0, min: -1, max: 1, increment: 0.1 }, // 25
    Eyelids: { value: 0, min: -1, max: 1, increment: 0.1 }, // 26
    Lips: { value: 0, min: -1, max: 1, increment: 0.1 }, // 27
    'Jaw Width': { value: 0, min: -1, max: 1, increment: 0.1 }, // 28
    'Jaw Height': { value: 0, min: -1, max: 1, increment: 0.1 }, // 29
    'Chin Length': { value: 0, min: -1, max: 1, increment: 0.1 }, // 30
    'Chin Position': { value: 0, min: -1, max: 1, increment: 0.1 }, // 31
    'Chin Width': { value: 0, min: -1, max: 1, increment: 0.1 }, // 32
    'Chin Shape': { value: 0, min: -1, max: 1, increment: 0.1 }, // 33
    'Neck Width': { value: 0, min: -1, max: 1, increment: 0.1 }, // 34
    Blemish: { value: 0, min: 0, max: 23, increment: 1 }, // 35
    'Blemish Opacity': { value: 0, min: 0, max: 1, increment: 0.1 },
    'Facial Hair': { value: 0, min: 0, max: 28, increment: 1 }, // 37, 2
    'Facial Hair Opacity': { value: 0, min: 0, max: 1, increment: 0.1 },
    'Facial Hair Color': { value: 0, min: 0, max: 1, increment: 1 },
    'Facial Hair Color 2': { value: 0, min: 0, max: 1, increment: 1 },
    Eyebrows: { value: 0, min: 0, max: 33, increment: 1 }, // 41
    'Eyebrows Opacity': { value: 0, min: 0, max: 1, increment: 0.1 },
    'Eyebrows Color': { value: 0, min: 0, max: 1, increment: 1 },
    'Eyebrows Color 2': { value: 0, min: 0, max: 1, increment: 1 },
    Age: { value: 0, min: 0, max: 14, increment: 1 }, // 45
    'Age Opacity': { value: 0, min: 0, max: 1, increment: 0.1 },
    Makeup: { value: 0, min: 0, max: 74, increment: 1 }, // 47
    'Makeup Opacity': { value: 0, min: 0, max: 1, increment: 0.1 },
    'Makeup Color': { value: 0, min: 0, max: 1, increment: 1 },
    'Makeup Color 2': { value: 0, min: 0, max: 1, increment: 1 },
    Blush: { value: 0, min: 0, max: 6, increment: 1 }, // 51
    'Blush Opacity': { value: 0, min: 0, max: 1, increment: 0.1 },
    'Blush Color': { value: 0, min: 0, max: 1, increment: 1 },
    Complexion: { value: 0, min: 0, max: 11, increment: 1 }, // 54
    'Complexion Opacity': { value: 0, min: 0, max: 1, increment: 0.1 },
    'Sun Damage': { value: 0, min: 0, max: 10, increment: 1 }, // 56
    'Sun Damage Opacity': { value: 0, min: 0, max: 1, increment: 0.1 },
    Lipstick: { value: 0, min: 0, max: 9, increment: 1 }, // 58, 22
    'Lipstick Opacity': { value: 0, min: 0, max: 1, increment: 0.1 },
    'Lipstick Color': { value: 0, min: 0, max: 1, increment: 1 },
    'Lipstick Color 2': { value: 0, min: 0, max: 1, increment: 1 },
    Freckles: { value: 0, min: 0, max: 17, increment: 1 }, // 62, 26
    'Freckles Opacity': { value: 0, min: 0, max: 1, increment: 0.1 }
};

// Setup buttons programatically for usage.
$(() => {
    for (let key in facialFeatures) {
        $('#populateButtons').append(`
			<div class="btn-group w-100 p-2 pl-3 pr-3" role="group">
				<button type="button" class="btn btn-sm btn-secondary" onclick="changeValue(${
                    facialFeatures[key]
                }, false);">&lt;</button>
				<button type="button" id="button-${key}" class="btn btn-sm btn-block btn-secondary" disabled>${key} <span class="badge badge-secondary">[${
            facialFeatures[key].value
        }/${facialFeatures[key].max}]</span></button>
				<button type="button" class="btn btn-sm btn-secondary" onclick="changeValue(${
                    facialFeatures[key]
                }, true);">&gt;</button>
			</div>
  		`);
    }
});

// Updates the local facial values registered in this WebView
function changeValue(key, increment) {
    if (increment) {
        facialFeatures[key].value += facialFeatures[key].increment;
    } else {
        facialFeatures[key].value -= facialFeatures[key].increment;
    }

    if (facialFeatures[key].value > facialFeatures[key].max) {
        facialFeatures[key].value = facialFeatures[key].min;
    }

    if (facialFeatures[key].value < facialFeatures[key].min) {
        facialFeatures[key].value = facialFeatures[key].max;
    }

    if (facialFeatures[key].increment === 0.1) {
        facialFeatures[key].value =
            Number.parseFloat(facialFeatures[key].value).toFixed(2) * 1;
    }

    // Update the Value of the Key Pressed
    $(`#button-${key}`).html(
        `${facialFeatures[key].name} <span class="badge badge-secondary">[${
            facialFeatures[key].value
        }/${facialFeatures[key].max}]</span>`
    );

    facialFeatures[key].func();
}

function updateSex() {
    alt.emit('updateSex', facialFeatures[key].value);
    setTimeout(() => {
        updatePlayerFace();
        updateHair();
        updateFacialFeatures();
        updateFacialDecor();
    }, 500);
}

// Update the player's face completely.
function updatePlayerFace(emitCall, min, max) {
    var data = [];

    Object.keys(facialFeatures).forEach((key, index) => {
        if (index > max && index < min) return;

        data.push(facialFeatures[key].value);
    });

    alt.emit(`${emitCall}`, JSON.stringify(data));

    alt.emit(
        'updateHeadBlend',
        facialFeatures[1].value,
        facialFeatures[2].value,
        facialFeatures[3].value,
        facialFeatures[4].value,
        facialFeatures[5].value,
        facialFeatures[6].value,
        facialFeatures[7].value,
        facialFeatures[8].value,
        facialFeatures[9].value
    );
}

// Update the player's facial details; nose, eyes, etc.
function updateFacialFeatures() {
    let arrayOfFaceFeatures = [];

    // Thanks superiouzz; missed the last facial feature.
    for (var i = 15; i < 35; i++) {
        arrayOfFaceFeatures.push(facialFeatures[i].value);
    }

    alt.emit(
        'updateFacialFeatures',
        facialFeatures[14].value,
        JSON.stringify(arrayOfFaceFeatures)
    );
}

// Update Hair Style, Color, and Texture
function updateHair() {
    alt.emit(
        'updateHairStyle',
        facialFeatures[10].value,
        facialFeatures[11].value,
        facialFeatures[12].value,
        facialFeatures[13].value
    );
}

function updateFacialDecor() {
    let arrayOfFacialDecor = [];

    for (var i = 35; i < facialFeatures.length; i++) {
        arrayOfFacialDecor.push(facialFeatures[i].value);
    }

    alt.emit('updateFacialDecor', JSON.stringify(arrayOfFacialDecor));
}

if ('alt' in window) {
    // Grab the Style Variations
    alt.on('stylesUpdate', (beardStyles, hairStyles, hairColors) => {
        facialFeatures[10].max = hairStyles;

        for (var i = 0; i < facialFeatures.length; i++) {
            if (facialFeatures[i].name.toLowerCase().includes('color')) {
                console.log(facialFeatures[i].name);
                facialFeatures[i].max = hairColors;
                $(`#button-${i}`).html(`
				${facialFeatures[i].name} <span class="badge badge-secondary">[${
                    facialFeatures[i].value
                }/${facialFeatures[i].max}]</span>`);
            }
        }

        for (var i = 10; i < 12; i++) {
            $(`#button-${i}`).html(`
				${facialFeatures[i].name} <span class="badge badge-secondary">[${
                facialFeatures[i].value
            }/${facialFeatures[i].max}]</span>`);
        }
    });

    // Called when the player changes their hair so we can setup new hair texture variations.
    alt.on('setHairTextureVariations', hairTextureVariations => {
        facialFeatures[13].max = hairTextureVariations;
        facialFeatures[13].value = 0;

        $(`#button-13`).html(`
			${facialFeatures[13].name} <span class="badge badge-secondary">[${
            facialFeatures[13].value
        }/${facialFeatures[13].max}]</span>`);
    });
}
