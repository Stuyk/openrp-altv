const { createElement, render, Component } = preact;
const h = createElement;

const ClothingProperties = {
    ShirtGroup: [
        {
            label: 'Shirt',
            key: 'shirt',
            value: 0,
            min: 0,
            max: 1,
            id: 11,
            isProp: false
        },
        {
            label: 'Shirt Texture',
            key: 'shirttexture',
            value: 0,
            min: 0,
            max: 1,
            id: 11,
            isProp: false
        },
        {
            label: 'Undershirt',
            key: 'undershirt',
            value: 0,
            min: 0,
            max: 1,
            id: 8,
            isProp: false
        },
        {
            label: 'Undershirt Texture',
            key: 'undershirt',
            value: 0,
            min: 0,
            max: 1,
            id: 8,
            isProp: false
        },
        {
            label: 'Arms',
            key: 'arms',
            value: 0,
            min: 0,
            max: 1,
            id: 3,
            isProp: false
        },
        {
            label: 'Arms Texture',
            key: 'armstexture',
            value: 0,
            min: 0,
            max: 1,
            id: 3,
            isProp: false
        }
    ],
    PantsGroup: [
        {
            label: 'Pants',
            key: 'pants',
            value: 0,
            min: 0,
            max: 1,
            id: 4,
            isProp: false
        },
        {
            label: 'Pants Texture',
            key: 'pantstexture',
            value: 0,
            min: 0,
            max: 1,
            id: 4,
            isProp: false
        }
    ],
    ShoesGroup: [
        {
            label: 'Shoes',
            key: 'shoes',
            value: 0,
            min: 0,
            max: 1,
            id: 6,
            isProp: false
        },
        {
            label: 'Shoes Texture',
            key: 'shoestexture',
            value: 0,
            min: 0,
            max: 1,
            id: 6,
            isProp: false
        }
    ],
    AccessoriesGroup: [
        {
            label: 'Accessories',
            key: 'accessories',
            value: 0,
            min: 0,
            max: 1,
            id: 7,
            isProp: false
        },
        {
            label: 'Accessories Texture',
            key: 'accessoriestexture',
            value: 0,
            min: 0,
            max: 1,
            id: 7,
            isProp: false
        }
    ],
    HatGroup: [
        {
            label: 'Hat',
            key: 'hat',
            value: -1,
            min: -1,
            max: 1,
            id: 0,
            isProp: true
        },
        {
            label: 'Hat Texture',
            key: 'hattexture',
            value: 0,
            min: 0,
            max: 1,
            id: 0,
            isProp: true
        }
    ],
    GlassesGroup: [
        {
            label: 'Glasses',
            key: 'glasses',
            value: -1,
            min: -1,
            max: 1,
            id: 1,
            isProp: true
        },
        {
            label: 'Glasses Texture',
            key: 'glassestexture',
            value: 0,
            min: 0,
            max: 1,
            id: 1,
            isProp: true
        }
    ],
    Earpiece: [
        {
            label: 'Earpiece',
            key: 'earpiece',
            value: -1,
            min: -1,
            max: 1,
            id: 2,
            isProp: true
        },
        {
            label: 'Earpiece Texture',
            key: 'earpiecetexture',
            value: 0,
            min: 0,
            max: 1,
            id: 2,
            isProp: true
        }
    ],
    Watches: [
        {
            label: 'Watches',
            key: 'watches',
            value: -1,
            min: -1,
            max: 1,
            id: 6,
            isProp: true
        },
        {
            label: 'Watches Texture',
            key: 'watchestexture',
            value: 0,
            min: 0,
            max: 1,
            id: 6,
            isProp: true
        }
    ],
    Bracelet: [
        {
            label: 'Bracelet',
            key: 'bracelet',
            value: -1,
            min: -1,
            max: 1,
            id: 7,
            isProp: true
        },
        {
            label: 'Bracelet Texture',
            key: 'bracelettexture',
            value: 0,
            min: 0,
            max: 1,
            id: 7,
            isProp: true
        }
    ],
    MaskGroup: [
        {
            label: 'Mask',
            key: 'mask',
            value: 0,
            min: 0,
            max: 1,
            id: 1,
            isProp: false
        },
        {
            label: 'Mask Texture',
            key: 'masktexture',
            value: 0,
            min: 0,
            max: 1,
            id: 1,
            isProp: false
        }
    ]
};

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clothingData: [],
            sex: 0,
            basket: []
        };
        this.zpos = 0;
        this.zoom = 90;
        this.rotate = 180;
        this.prefix = '';
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('clothing:SetClothingProps', this.setClothingProperties.bind(this));
            alt.on('clothing:SetComponentMax', this.setComponentMax.bind(this));
            alt.on('clothing:SetSex', this.setSex.bind(this));
            alt.on(
                'clothing:SetPrevComponentValue',
                this.setPrevComponentValue.bind(this)
            );
            alt.emit('clothing:Ready');
        } else {
            this.setClothingProperties(JSON.stringify(ClothingProperties));
        }
    }

    setSex(sex) {
        this.setState({ sex });
    }

    setPrevComponentValue(id, value, texture, isProp) {
        const clothingData = [...this.state.clothingData];

        let groupIndex = -1;
        let categoryIndex = -1;
        for (let group = 0; group < clothingData.length; group++) {
            groupIndex = group;
            const catIndex = clothingData[groupIndex].values.findIndex(category => {
                if (category.id === id && category.isProp === isProp) return category;
            });

            if (catIndex <= -1) {
                continue;
            }

            categoryIndex = catIndex;
            break;
        }

        if (categoryIndex === -1) {
            console.log('Could not find category.');
            return;
        }

        clothingData[groupIndex].values[categoryIndex].value = value;
        clothingData[groupIndex].values[categoryIndex + 1].value = texture;
        this.setState({ clothingData });
    }

    setComponentMax(id, maxDrawables, maxTextures, isProp = false) {
        const clothingData = [...this.state.clothingData];

        let groupIndex = -1;
        let categoryIndex = -1;
        for (let group = 0; group < clothingData.length; group++) {
            groupIndex = group;
            const catIndex = clothingData[groupIndex].values.findIndex(category => {
                if (category.id === id && category.isProp === isProp) return category;
            });

            if (catIndex <= -1) {
                continue;
            }

            categoryIndex = catIndex;
            break;
        }

        if (categoryIndex === -1) {
            console.log('Could not find category.');
            return;
        }

        clothingData[groupIndex].values[categoryIndex].max = maxDrawables;
        clothingData[groupIndex].values[categoryIndex + 1].max = maxTextures;
        this.setState({ clothingData });
    }

    setComponentValue(groupIndex, categoryIndex, value) {
        const clothingData = [...this.state.clothingData];
        clothingData[groupIndex].values[categoryIndex].value = value;

        if ('alt' in window) {
            const row = clothingData[groupIndex].values[categoryIndex];
            const isTexture = row.key.includes('texture');

            if (isTexture) {
                const otherRow = clothingData[groupIndex].values[categoryIndex - 1];
                alt.emit(
                    'clothing:UpdateComponent',
                    row.id,
                    otherRow.value,
                    row.value,
                    row.isProp
                );
            } else {
                clothingData[groupIndex].values[categoryIndex + 1].value = 0;
                alt.emit('clothing:UpdateComponent', row.id, row.value, 0, row.isProp);
            }
        }

        this.setState({ clothingData });
    }

    setClothingProperties(properties) {
        const data = JSON.parse(properties);
        const clothingData = [];
        Object.keys(data).forEach(key => {
            clothingData.push({
                key,
                values: data[key]
            });
        });
        this.setState({ clothingData });
    }

    addToBasket(groupIndex) {
        const clothingData = [...this.state.clothingData];
        const group = clothingData[parseInt(groupIndex)];
        const femOrMale = this.state.sex === 0 ? 'female' : 'male';
        const clothing = {
            label: group.values[0].label,
            description: 'Clothing Item',
            isProp: group.values[0].isProp,
            restriction: this.state.sex
        };

        if (parseInt(groupIndex) === 0) {
            const data = [];
            group.values.forEach((row, index) => {
                if (index === 0 || index % 2 === 0) {
                    console.log(row);
                    data.push({
                        id: row.id,
                        value: row.value,
                        texture: group.values[index + 1].value
                    });
                }
            });
            clothing[femOrMale] = data;
        } else {
            clothing[femOrMale] = [
                {
                    id: group.values[0].id,
                    value: group.values[0].value,
                    texture: group.values[1].value
                }
            ];
        }

        const basket = [...this.state.basket];
        basket.push(clothing);
        this.setState({ basket });
    }

    removeFromBasket(e) {
        const index = parseInt(e.target.id);
        const basket = [...this.state.basket];
        basket.splice(index, 1);
        this.setState({ basket });
    }

    changeRotation(e) {
        const value = e.target.value;
        if ('alt' in window) {
            alt.emit('clothing:ChangeRotation', parseFloat(value));
        }
        this.rotate = parseFloat(value);
    }

    changeZoom(e) {
        const value = e.target.value;
        if ('alt' in window) {
            alt.emit('clothing:ChangeZoom', parseFloat(value));
        }
        this.zoom = parseFloat(value);
    }

    changeZPos(e) {
        const value = e.target.value;
        if ('alt' in window) {
            alt.emit('clothing:ChangeZPos', parseFloat(value));
        }
        this.zpos = parseFloat(value);
    }

    exit() {
        if ('alt' in window) {
            alt.emit('clothing:Close');
        }
    }

    prefixChange(e) {
        const value = e.target.value;
        this.prefix = value;
    }

    purchaseAll() {
        const basket = [...this.state.basket];

        basket.forEach(item => {
            if (this.prefix !== '') {
                item.label = `${this.prefix} ${item.label}`;
            }

            if ('alt' in window) {
                alt.emit('clothing:Purchase', JSON.stringify(item));
            } else {
                console.log(JSON.stringify(item));
            }
        });

        this.prefix = '';
        this.setState({ basket: [] });

        if ('alt' in window) {
            alt.emit('clothing:Close');
        }
    }

    renderBasket() {
        const basket = this.state.basket.map((basket, index) => {
            return h(
                'div',
                { class: 'item' },
                h('div', { class: 'item-title' }, basket.label),
                h(
                    'button',
                    {
                        class: 'remove',
                        id: index,
                        onclick: this.removeFromBasket.bind(this)
                    },
                    '-'
                )
            );
        });

        basket.unshift(
            h(
                'div',
                { class: 'item' },
                h('input', {
                    type: 'text',
                    placeholder: 'Prefix clothes with...',
                    value: this.prefix,
                    oninput: this.prefixChange.bind(this)
                })
            )
        );

        basket.unshift(
            h('div', { class: 'item' }, h('div', { class: 'title' }, 'Clothing Basket'))
        );

        return h('div', { class: 'basket' }, basket);
    }

    render() {
        return h(
            'div',
            { id: 'app' },
            h(Categories, {
                state: this.state,
                setComponentValue: this.setComponentValue.bind(this),
                addToBasket: this.addToBasket.bind(this)
            }),
            h('input', {
                class: 'rotation',
                type: 'range',
                value: this.rotate,
                min: 0,
                max: 360,
                oninput: this.changeRotation.bind(this)
            }),
            h('input', {
                class: 'zoom',
                type: 'range',
                value: this.zoom,
                min: 20,
                max: 120,
                oninput: this.changeZoom.bind(this)
            }),
            h('input', {
                class: 'zpos',
                type: 'range',
                value: this.zpos,
                min: -1,
                max: 1,
                step: 0.01,
                oninput: this.changeZPos.bind(this)
            }),
            h(
                'button',
                {
                    class: 'exit',
                    onclick: this.exit.bind(this)
                },
                'Exit [Do Not Buy]'
            ),
            h(this.renderBasket.bind(this)),
            this.state.basket.length >= 1 &&
                h(
                    'button',
                    { class: 'purchase', onclick: this.purchaseAll.bind(this) },
                    'Purchase All'
                )
        );
    }
}

class Categories extends App {
    constructor(props) {
        super(props);
    }

    toggleCategory(e) {
        const value =
            this.state[e.target.id] === undefined ? true : !this.state[e.target.id];
        this.setState({ [e.target.id]: value });
    }

    sliderRender({ props, row, index, groupIndex }) {
        return h('input', {
            type: 'range',
            value: row.value,
            min: row.min,
            max: row.max,
            step: 1,
            id: row.key,
            oninput: e => {
                const value = parseInt(e.target.value);
                props.setComponentValue(groupIndex, index, value);
            }
        });
    }

    render(props) {
        const state = props.state;
        const groups = state.clothingData.map((group, groupIndex) => {
            const rows = group.values.map((row, index) => {
                return h(
                    'div',
                    { class: 'row' },
                    h(
                        'div',
                        { class: 'label' },
                        `${row.label} - (${row.value}/${row.max})`
                    ),
                    h(this.sliderRender, { props, row, index, groupIndex })
                );
            });

            rows.push(
                h(
                    'div',
                    { class: 'row' },
                    h(
                        'button',
                        {
                            class: 'addbasket',
                            id: groupIndex,
                            onclick: e => {
                                const groupIndexData = e.target.id;
                                props.addToBasket(groupIndexData);
                            }
                        },
                        'Add To Basket'
                    )
                )
            );

            return h(
                'div',
                { class: 'group' },
                h(
                    'div',
                    { class: 'group-header' },
                    h('div', { class: 'group-title' }, group.key.replace('Group', '')),
                    !this.state[group.key] &&
                        h(
                            'button',
                            {
                                class: 'toggle',
                                id: group.key,
                                onclick: this.toggleCategory.bind(this)
                            },
                            '+'
                        ),
                    this.state[group.key] &&
                        h(
                            'button',
                            {
                                class: 'toggle',
                                id: group.key,
                                onclick: this.toggleCategory.bind(this)
                            },
                            '-'
                        )
                ),
                this.state[group.key] && h('div', { class: 'rows' }, rows)
            );
        });

        return h('div', { class: 'categories' }, groups);
    }
}

render(h(App), document.querySelector('#render'));

window.addEventListener('keydown', e => {
    if (e.keyCode === 32) {
        e.preventDefault();
        return;
    }
});
