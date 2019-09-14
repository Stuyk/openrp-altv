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
        value: -1,
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
        value: -1,
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
        value: -1,
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
        value: -1,
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
        value: -1,
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

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: 'loading...',
            hairChanged: false,
            clothingData: [],
            sex: 0,
            basket: []
        };
    }

    componentDidMount() {
        this.setState({
            clothingData: [...this.state.clothingData, ...Object.values(clothing)]
        });

        if ('alt' in window) {
            alt.on('setSex', this.setSex.bind(this));
            alt.on('updateMinMax', this.updateMinMax.bind(this));
            alt.on('showError', this.showError.bind(this));
            alt.on('updateClothes', this.updateClothes.bind(this));
        } else {
            this.forceClothing();
        }
    }

    basket(e) {
        let props = {
            label: this.state.clothingData[e.target.id].label,
            description: 'Clothing Item',
            isProp: this.state.clothingData[e.target.id].isProp,
            restriction: this.state.sex
        };

        let data = [];

        // Shirt, Undershirt, Torso
        if (parseInt(e.target.id) === 0) {
            for (let i = 0; i < 6; i++) {
                let index = data.findIndex(x => x.id === this.state.clothingData[i].id);
                if (index !== -1) {
                    console.log('match?');
                    data[index].texture = this.state.clothingData[i].value;
                } else {
                    data.push({
                        id: this.state.clothingData[i].id,
                        value: this.state.clothingData[i].value
                    });
                }
            }
        } else {
            const index = parseInt(e.target.id);
            data.push({
                id: this.state.clothingData[index].id,
                value: this.state.clothingData[index].value,
                texture: this.state.clothingData[index + 1].value
            });
        }

        if (this.state.sex === 0) {
            props.female = data;
        } else {
            props.male = data;
        }

        this.state.basket.push(props);
        this.setState(this.state.basket);

        setTimeout(() => {
            this.forceClothing();
        }, 200);
    }

    purchase() {
        this.state.basket.forEach((item, index) => {
            if ('alt' in window) {
                alt.emit('clothing:Purchase', JSON.stringify(item));
            } else {
                console.log(JSON.stringify(item));
            }
        })

        this.state.basket = [];
        this.setState(this.state.basket);
    }

    removeItem(e) {
        let index = e.target.id;

        if (this.state.basket[index]) {
            this.state.basket.splice(index, 1);
        }

        console.log(this.state.basket.length);
        this.setState(this.state.basket);
    }

    setSex(sex) {
        this.setState({ sex });
        this.forceClothing();
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

    forceClothing() {
        let clothingData = [...this.state.clothingData];
        //console.log(clothingData.length);

        clothingData.forEach((item, index) => {
            if (item.label.includes('Texture')) return;
            if ('alt' in window) {
                alt.emit(
                    'clothing:UpdateComponent',
                    clothingData[index].id,
                    clothingData[index].value,
                    clothingData[index + 1].value,
                    clothingData[index].isProp
                );
            } else {
                //console.log(item);
            }
        });
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
        alt.emit('clothing:CloseDialogue');
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
                    setItemValue: this.setItemValue.bind(this),
                    basket: this.basket.bind(this)
                })
            ),
            h(
                'div',
                { class: `basket scroll ${this.state.basket.length ? 'show' : null}` },
                h('div', { class: 'basket-title' }, h('h1', { class: 'title' }, 'Basket')),
                h('hr'),
                h(ShoppingBasket, {
                    basket: this.state.basket,
                    removeItem: this.removeItem.bind(this)
                }),
                h('hr'),
                h('div', { class: 'basket-purchase', onclick: this.purchase.bind(this) }, 'Purchase')
            ),
            h('div', { class: 'footer', onclick: this.submitChanges.bind(this) }, 'Exit')
        );
        // Render HTML / Components and Shit Here
    }
}

const ClothingList = ({ clothingData, setItemValue, basket }) => {
    const itemList = clothingData.map((item, index) =>
        h(ClothingItem, { index, item, setItemValue, basket })
    );

    return h('div', null, itemList);
};

// Items to Display in a Group
const ClothingItem = ({ index, item, setItemValue, basket }) => {
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
            { class: 'spacer-left' },
            h('div', { class: 'title' }, `${item.label}`),
            h('div', { class: 'count' }, `${item.value}/${item.max}`)
        ),
        h(
            'div',
            { class: 'spacer-right' },
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
        ),
        h(
            'div',
            { class: 'spacer' },
            !item.label.includes('Texture') &&
                !item.label.includes('Arms') &&
                !item.label.includes('Undershirt') &&
                h(
                    'button',
                    { class: 'buy', id: `${index}`, onclick: basket.bind(this) },
                    `Put into basket`
                )
        )
    );
};

const ShoppingBasket = ({ basket, removeItem }) => {
    const basketList = basket.map((item, index) => 
        h(BasketItem, { index, item, removeItem })
    );

    return h('div', null, basketList)
}

// Items to Display in the Basket
const BasketItem = ({ index, item, removeItem }) => {
    return h(
        'div',
        { class: 'basket-item' },
        h(
            'div',
            { class: 'basket-label' },
            `${item.label}`
        ),
        h(
            'div',
            {
                class: 'remove',
                id: `${index}`,
                onclick: removeItem.bind(this)
            },
            'X'
        )
    )
}

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
        alt.emit('clothing:GetSex');
    }
}
