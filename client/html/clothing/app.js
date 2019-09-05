const { createElement, render, Component } = preact;
const h = createElement;

/* eslint-disable no-undef */
const clothing = {
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
    Arms: {
        label: 'Arms',
        value: 0,
        min: 0,
        max: 1,
        id: 3
    },
    ArmsTexture: {
        label: 'Arms Texture',
        value: 0,
        min: 0,
        max: 1,
        id: 3
    },
    Pants: {
        label: 'Pants',
        value: 0,
        min: 0,
        max: 1,
        id: 4
    },
    PantsTexture: {
        label: 'Pants Texture',
        value: 0,
        min: 0,
        max: 1,
        id: 4
    },
    Shoes: {
        label: 'Shoes',
        value: 0,
        min: 0,
        max: 1,
        id: 6
    },
    ShoesTexture: {
        label: 'Shoes Texture',
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
    Earpiece: {
        label: 'Earpiece',
        value: 0,
        min: -1,
        max: 1,
        id: 2,
        isProp: true
    },
    EarpieceTexture: {
        label: 'Earpiece Texture',
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
    },
    Mask: {
        label: 'Mask',
        value: 0,
        min: 0,
        max: 1,
        id: 1
    },
    MaskTexture: {
        label: 'Mask Texture',
        value: 0,
        min: 0,
        max: 1,
        id: 1
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
    }
};

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: 'loading...',
            hairChanged: false,
            clothingData: []
        };
    }

    componentDidMount() {
        this.setState({
            clothingData: [...this.state.clothingData, ...Object.values(clothing)]
        });

        if ('alt' in window) {
            alt.on('updateMinMax', this.updateMinMax.bind(this));
            alt.on('showError', this.showError.bind(this));
            alt.on('updateClothes', this.updateClothes.bind(this));
        }
    }

    updateMinMax(...args) {
        let [key, res] = args;
        let clothingData = [...this.state.clothingData];

        let index = clothingData.findIndex(x => x.label.split(' ').join('') === key);

        if (index === -1) {
            console.log('Was not found.');
            return;
        }

        // Update clothing element + texture
        clothingData[index].max = res.components;
        clothingData[index + 1].value = 0;
        clothingData[index + 1].max = res.textures;

        this.setState({ clothingData });
    }

    showError(msg) {
        // Not sure how to handle this yet?
    }

    updateClothes(...args) {
        let clothingData = [...this.state.clothingData];
        const data = JSON.parse(args);

        clothingData.forEach((item, index) => {
            let dataIndex = data.findIndex(x => x.label === item.label);

            if (dataIndex <= -1) return;

            item.value = data[dataIndex].value;
            clothingData[index + 1].value = data[dataIndex].texture;
        });

        this.setState({ clothingData });
    }

    setItemValue(index, increment) {
        let clothingData = [...this.state.clothingData];

        // Play ticky noises :)
        var audio = new Audio('../sound/sounds/tick.ogg');
        audio.volume = 0.35;
        audio.play();

        if (increment) {
            clothingData[index].value += 1;

            if (clothingData[index].value > clothingData[index].max) {
                clothingData[index].value = clothingData[index].min;
            }
        } else {
            clothingData[index].value -= 1;

            if (clothingData[index].value < clothingData[index].min) {
                clothingData[index].value = clothingData[index].max;
            }
        }

        if (!clothingData[index].label.includes('Texture')) {
            if ('alt' in window) {
                alt.emit(
                    'clothing:RequestComponentData',
                    clothingData[index].label.split(' ').join(''),
                    clothingData[index].id,
                    clothingData[index].value
                );
            }
        }

        if (clothingData[index].label.includes('Texture')) if (index >= 1) index -= 1;

        // componentID, drawable, texture
        if ('alt' in window) {
            alt.emit(
                'clothing:UpdateComponent',
                clothingData[index].id,
                clothingData[index].value,
                clothingData[index + 1].value,
                clothingData[index].isProp
            );
        }

        this.setState({ clothingData });
    }

    submitChanges() {
        const data = [];
        let clothingData = [...this.state.clothingData];

        clothingData.forEach((item, index) => {
            if (item.label.includes('Texture')) {
                return;
            }

            data.push({
                label: item.label,
                value: item.value,
                id: item.id,
                texture: clothingData[index + 1].value,
                isProp: item.isProp
            });
        });

        alt.emit('clothing:VerifyClothing', JSON.stringify(data));
    }

    render() {
        return h(
            'div',
            { id: 'app' },
            h('div', { class: 'tab' }, h('h1', { class: 'title' }, 'Clothing')),
            h(
                'div',
                { class: 'mod-list scroll' },
                h(ClothingList, {
                    clothingData: this.state.clothingData,
                    setItemValue: this.setItemValue.bind(this)
                })
            ),
            h(
                'div',
                { class: 'footer', onclick: this.submitChanges.bind(this) },
                'Submit'
            )
        );
        // Render HTML / Components and Shit Here
    }
}

const ClothingList = ({ clothingData, setItemValue }) => {
    const itemList = clothingData.map((item, index) =>
        h(ClothingItem, { index, item, setItemValue })
    );

    return h('div', null, itemList);
};

// Items to Display in a Group
const ClothingItem = ({ index, item, setItemValue }) => {
    left = () => {
        setItemValue(index, false);
    };
    right = () => {
        setItemValue(index, true);
    };
    return h(
        'div',
        { class: 'mod' },
        h(
            'div',
            { class: 'spacer' },
            h('div', { class: 'title' }, `${item.label}`),
            h('div', { class: 'count' }, `${item.value}/${item.max}`)
        ),
        h(
            'div',
            { class: 'spacer' },
            h(
                'button',
                {
                    class: 'left button',
                    onclick: this.left.bind(this)
                },
                '-'
            ),
            h(
                'button',
                {
                    class: 'right button',
                    onclick: this.right.bind(this)
                },
                '+'
            )
        )
    );
};

render(h(App), document.querySelector('#render'));

function ready() {
    for (let key in clothing) {
        if (!clothing[key].label.includes('Texture')) {
            if ('alt' in window) {
                alt.emit(
                    'clothing:RequestComponentData',
                    key,
                    clothing[key].id,
                    clothing[key].value,
                    clothing[key].isProp
                );
            }
        }
    }

    if ('alt' in window) {
        alt.emit('clothing:GetPreviousClothes');
    }
}

/*


function pushChanges(key) {
    if (key.includes('Texture')) {
        key = key.replace('Texture', '');
    }

    // componentID, drawable, texture
    alt.emit(
        'clothing:UpdateComponent',
        clothing[key].id,
        clothing[key].value,
        clothing[`${key}Texture`].value,
        clothing[key].isProp
    );
}

// eslint-disable-next-line no-unused-vars
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

    alt.emit('clothing:VerifyClothing', JSON.stringify(data));
}

function updateClothes(...args) {
    let [key, data] = args;
    clothing[key].value = data.value;
    clothing[`${key}Texture`].value = data.texture;

    $(`#button-${key}`).html(
        `${clothing[key].label} <span class="badge badge-secondary">[${clothing[key].value}|${clothing[key].max}]</span>`
    );

    $(`#button-${key}Texture`).html(
        `${clothing[`${key}Texture`].label} <span class="badge badge-secondary">[${clothing[`${key}Texture`].value}|${clothing[`${key}Texture`].max}]</span>`
    );
    }
*/
