const facialFeatures = [
    { name: 'Sex', value: 0, min: 0, max: 1, increment: 1 },
    { name: 'Father Face', value: 0, min: 0, max: 45, increment: 1 },
    { name: 'Father Skin', value: 0, min: 0, max: 45, increment: 1 },
    { name: 'Mother Face', value: 0, min: 0, max: 45, increment: 1 },
    { name: 'Mother Skin', value: 0, min: 0, max: 45, increment: 1 },
    { name: 'Extra Face', value: 0, min: 0, max: 45, increment: 1 },
    { name: 'Extra Skin', value: 0, min: 0, max: 45, increment: 1 },
    { name: 'Face Mix', value: 0, min: 0, max: 1, increment: 0.1 },
    { name: 'Skin Mix', value: 0, min: 0, max: 1, increment: 0.1 },
    { name: 'Third Mix', value: 0, min: 0, max: 1, increment: 0.1 },
    { name: 'Hair', value: 0, min: 0, max: 78, increment: 1 }, // 10
    { name: 'Hair Color 1', value: 0, min: 0, max: 78, increment: 1 }, // 11
    { name: 'Hair Color 2', value: 0, min: 0, max: 78, increment: 1 }, // 12
    { name: 'Hair Texture', value: 0, min: 0, max: 0, increment: 1 } // 13
];

$(() => {
    for (var index in facialFeatures) {
        let increment = facialFeatures[index].increment;
        let name = facialFeatures[index].name;
        let value = facialFeatures[index].value;
        let max = facialFeatures[index].max;

        $('#populateButtons').append(`
			<div class="btn-group w-100 p-2 pl-3 pr-3" role="group">
				<button type="button" class="btn btn-sm btn-secondary" onclick="changeValue(${index}, false);">&lt;</button>
				<button type="button" id="button-${index}" class="btn btn-sm btn-block btn-secondary" disabled>${name} <span class="badge badge-secondary">[${value}/${max}]</span></button>
				<button type="button" class="btn btn-sm btn-secondary" onclick="changeValue(${index}, true);">&gt;</button>
			</div>
  		`);
    }
});

// Updates the local facial values registered in this WebView
function changeValue(index, increment) {
    if (increment) {
        facialFeatures[index].value += facialFeatures[index].increment;
    } else {
        facialFeatures[index].value -= facialFeatures[index].increment;
    }

    if (facialFeatures[index].value > facialFeatures[index].max) {
        facialFeatures[index].value = facialFeatures[index].min;
    }

    if (facialFeatures[index].value < facialFeatures[index].min) {
        facialFeatures[index].value = facialFeatures[index].max;
    }

    if (facialFeatures[index].increment === 0.1) {
        facialFeatures[index].value =
            Number.parseFloat(facialFeatures[index].value).toFixed(2) * 1;
    }

    $(`#button-${index}`).html(
        `${facialFeatures[index].name} <span class="badge badge-secondary">[${
            facialFeatures[index].value
        }/${facialFeatures[index].max}]</span>`
    );

    // Sex
    if (index === 0) {
        alt.emit('updateSex', facialFeatures[index].value);
        setTimeout(() => {
            updatePlayerFace();
        }, 1000);

        return;
    }

    // Update Face (Head Blend Data)
    if (index >= 1 && index <= 9) {
        updatePlayerFace();
        return;
    }

    if (index >= 10 && index <= 13) {
        alt.emit(
            'updateHairStyle',
            facialFeatures[10].value,
            facialFeatures[11].value,
            facialFeatures[12].value,
            facialFeatures[13].value
        );
    }
}

function updatePlayerFace() {
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

if ('alt' in window) {
    // Grab the Style Variations
    alt.on('stylesUpdate', (beardStyles, hairStyles, hairColors) => {
        facialFeatures[10].max = hairStyles;
        facialFeatures[11].max = hairColors;
        facialFeatures[12].max = hairColors;

        for (var i = 10; i < 12; i++) {
            $(`#button-${i}`).html(`
				${facialFeatures[i].name} <span class="badge badge-secondary">[${
                facialFeatures[i].value
            }/${facialFeatures[i].max}]</span>`);
        }
    });

    alt.on('setHairTextureVariations', hairTextureVariations => {
        facialFeatures[13].max = hairTextureVariations;
        facialFeatures[13].value = 0;

        $(`#button-13`).html(`
			${facialFeatures[13].name} <span class="badge badge-secondary">[${
            facialFeatures[13].value
        }/${facialFeatures[13].max}]</span>`);
    });
}
