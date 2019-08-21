const clothing = {
    Head: {
        label: 'Head',
        value: 0,
        min: 0,
        max: 1,
        id: 1
    },
    HeadTexture: {
        label: 'Head Texture',
        value: 0,
        min: 0,
        max: 1,
        id: 1
    },
    Torso: {
        label: 'Torso',
        value: 0,
        min: 0,
        max: 1,
        id: 3
    },
    TorsoTexture: {
        label: 'Torso Texture',
        value: 0,
        min: 0,
        max: 1,
        id: 3
    },
    Legs: {
        label: 'Legs',
        value: 0,
        min: 0,
        max: 1,
        id: 4
    },
    LegsTexture: {
        label: 'Legs Texture',
        value: 0,
        min: 0,
        max: 1,
        id: 4
    },
    Bag: {
        label: 'Bag',
        value: 0,
        min: 0,
        max: 1,
        id: 5
    },
    BagTexture: {
        label: 'Bag Texture',
        value: 0,
        min: 0,
        max: 1,
        id: 5
    },
    Feet: {
        label: 'Feet',
        value: 0,
        min: 0,
        max: 1,
        id: 6
    },
    FeetTexture: {
        label: 'Feet Texture',
        value: 0,
        min: 0,
        max: 1,
        id: 6
    },
    Accessories: {
        label: 'Accessories',
        value: 0,
        min: 0,
        max: 1,
        id: 7
    },
    AccessoriesTexture: {
        label: 'Accessories Texture',
        value: 0,
        min: 0,
        max: 1,
        id: 7
    },
    Undershirt: {
        label: 'Undershirt',
        value: 0,
        min: 0,
        max: 1,
        id: 8
    },
    UndershirtTexture: {
        label: 'Undershirt Texture',
        value: 0,
        min: 0,
        max: 1,
        id: 8
    },
    Shirt: {
        label: 'Shirt',
        value: 0,
        min: 0,
        max: 1,
        id: 11
    },
    ShirtTexture: {
        label: 'Shirt Texture',
        value: 0,
        min: 0,
        max: 1,
        id: 11
    },
    Hat: {
        label: 'Hat',
        value: 0,
        min: -1,
        max: 1,
        id: 0,
        isProp: true
    },
    HatTexture: {
        label: 'Hat Texture',
        value: 0,
        min: 0,
        max: 1,
        id: 0,
        isProp: true
    },
    Glasses: {
        label: 'Glasses',
        value: 0,
        min: -1,
        max: 1,
        id: 1,
        isProp: true
    },
    GlassesTexture: {
        label: 'Glasses Texture',
        value: 0,
        min: 0,
        max: 1,
        id: 1,
        isProp: true
    },
    Ears: {
        label: 'Ears',
        value: 0,
        min: -1,
        max: 1,
        id: 2,
        isProp: true
    },
    EarsTexture: {
        label: 'Ears Texture',
        value: 0,
        min: 0,
        max: 1,
        id: 2,
        isProp: true
    },
    Watches: {
        label: 'Watches',
        value: 0,
        min: -1,
        max: 1,
        id: 6,
        isProp: true
    },
    WatchesTexture: {
        label: 'Watches Texture',
        value: 0,
        min: 0,
        max: 1,
        id: 6,
        isProp: true
    },
    Bracelet: {
        label: 'Bracelet',
        value: 0,
        min: -1,
        max: 1,
        id: 7,
        isProp: true
    },
    BraceletTexture: {
        label: 'Bracelet Texture',
        value: 0,
        min: 0,
        max: 1,
        id: 7,
        isProp: true
    }
};

$(() => {
    $('#modal').hide();

    for (let key in clothing) {
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
                clothing[key].label
            } <span class="badge badge-secondary">[${clothing[key].value}|${
                clothing[key].max
            }]</span></button>`
        );

        // Increase Value Button
        $(`#group-${key}`).append(
            `<button type="button" class="btn btn-sm btn-secondary" onclick="changeValue('${key}', true);">&gt;</button>`
        );
    }

    // Submit Changes Button
    $('#populateButtons').append(
        `<div class="btn-group w-100 p-2 pl-3 pr-3" role="group"><button type="button" class="btn btn-sm btn-block btn-primary" onclick="submitChanges();">Submit Changes</button></div>`
    );

    for (let key in clothing) {
        if (!clothing[key].label.includes('Texture')) {
            alt.emit(
                'requestComponentData',
                key,
                clothing[key].id,
                clothing[key].value,
                clothing[key].isProp
            );
        }
    }

    alt.emit('getPreviousClothes');
});

// Updates the local facial values registered in this WebView
function changeValue(key, increment) {
    if (increment) {
        clothing[key].value += 1;
    } else {
        clothing[key].value -= 1;
    }

    // If we go above max, roll back around to min
    if (clothing[key].value > clothing[key].max) {
        clothing[key].value = clothing[key].min;
    }

    // If we go below min, roll back up to max
    if (clothing[key].value < clothing[key].min) {
        clothing[key].value = clothing[key].max;
    }

    if (clothing[key].increment === 0.1) {
        clothing[key].value =
            Number.parseFloat(clothing[key].value).toFixed(2) * 1;
    }

    // Update the Value of the Key Pressed
    $(`#button-${key}`).html(
        `${clothing[key].label} <span class="badge badge-secondary">[${
            clothing[key].value
        }|${clothing[key].max}]</span>`
    );

    if (!clothing[key].label.includes('Texture')) {
        alt.emit(
            'requestComponentData',
            key,
            clothing[key].id,
            clothing[key].value
        );
    }

    // Call the function tied to the object element.
    pushChanges(key);
}

function updateMinMax(key, res) {
    // {res.id, res.components, res.textures}
    clothing[key].max = res.components;
    clothing[`${key}Texture`].value = 0;
    clothing[`${key}Texture`].max = res.textures;

    $(`#button-${key}`).html(
        `${clothing[key].label} <span class="badge badge-secondary">[${
            clothing[key].value
        }|${clothing[key].max}]</span>`
    );

    $(`#button-${key}Texture`).html(
        `${
            clothing[`${key}Texture`].label
        } <span class="badge badge-secondary">[${
            clothing[`${key}Texture`].value
        }|${clothing[`${key}Texture`].max}]</span>`
    );
}

function pushChanges(key) {
    if (key.includes('Texture')) {
        key = key.replace('Texture', '');
    }

    // componentID, drawable, texture
    alt.emit(
        'updateComponent',
        clothing[key].id,
        clothing[key].value,
        clothing[`${key}Texture`].value,
        clothing[key].isProp
    );
}

function submitChanges() {
    const data = {};

    for (let key in clothing) {
        // If this is a Texture; append to normal key.
        if (key.includes('Texture')) {
            let tempKey = key.replace('Texture', '');
            data[tempKey].texture = clothing[key].value;
            continue;
        }

        // Create the object.
        if (data[key] === undefined) {
            data[key] = {};
        }

        // Append normal data.
        data[key] = {
            value: clothing[key].value,
            id: clothing[key].id,
            texture: 0
        };

        // Add Prop Info
        if (clothing[key].isProp !== undefined) {
            data[key].isProp = true;
        }
    }

    alt.emit('verifyClothing', JSON.stringify(data));
}

function showError(msg) {
    $('#modal').show();
    $('#modalText').html(`${msg}`);
}

$('#closeModal').on('click', () => {
    $('#modal').hide();
});

function updateClothes(key, data) {
    clothing[key].value = data.value;
    clothing[`${key}Texture`].value = data.texture;

    $(`#button-${key}`).html(
        `${clothing[key].label} <span class="badge badge-secondary">[${
            clothing[key].value
        }|${clothing[key].max}]</span>`
    );

    $(`#button-${key}Texture`).html(
        `${
            clothing[`${key}Texture`].label
        } <span class="badge badge-secondary">[${
            clothing[`${key}Texture`].value
        }|${clothing[`${key}Texture`].max}]</span>`
    );
}

if ('alt' in window) {
    alt.on('updateMinMax', updateMinMax);
    alt.on('showError', showError);
    alt.on('updateClothes', updateClothes);
}
