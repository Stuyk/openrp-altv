const { createElement, render, Component } = preact;
const h = createElement;

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
          }
        : null;
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mods: [],
            wheelType: 0,
            rotation: 0,
            pr: 0,
            pg: 0,
            pb: 0,
            sr: 0,
            sg: 0,
            sb: 0
        };
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('custom:SetMods', this.customSetMods.bind(this));
            alt.emit('custom:FetchMods');
        } else {
            const mods =
                '[{"active":-1,"index":0,"max":20,"slotName":"Spoiler"},{"active":-1,"index":1,"max":6,"slotName":"Frontbumper"},{"active":-1,"index":2,"max":3,"slotName":"Rearbumper"},{"active":-1,"index":3,"max":5,"slotName":"Sideskirt"},{"active":-1,"index":4,"max":9,"slotName":"Exhaust"},{"active":-1,"index":5,"max":5,"slotName":"Chassis"},{"active":-1,"index":6,"max":3,"slotName":"Grille"},{"active":-1,"index":7,"max":12,"slotName":"Hood"},{"active":-1,"index":8,"max":6,"slotName":"Fender"},{"active":-1,"index":9,"max":0,"slotName":"Rightfender"},{"active":-1,"index":10,"max":7,"slotName":"Roof"},{"active":-1,"index":11,"max":4,"slotName":"Engine"},{"active":-1,"index":12,"max":3,"slotName":"Brakes"},{"active":-1,"index":13,"max":3,"slotName":"Transmission"},{"active":-1,"index":14,"max":58,"slotName":"Horns"},{"active":-1,"index":15,"max":4,"slotName":"Suspension"},{"active":-1,"index":16,"max":5,"slotName":"Armor"},{"active":-1,"index":18,"max":0,"slotName":"Turbo"},{"active":-1,"index":20,"max":0,"slotName":"Tiresmoke"},{"active":-1,"index":22,"max":0,"slotName":"Xenonlights"},{"active":-1,"index":23,"max":50,"slotName":"Frontwheels"},{"active":-1,"index":24,"max":0,"slotName":"Backwheels"},{"active":-1,"index":25,"max":3,"slotName":"Plateholder"},{"active":-1,"index":26,"max":4,"slotName":"Vanityplates"},{"active":-1,"index":27,"max":1,"slotName":"Trim"},{"active":-1,"index":28,"max":0,"slotName":"Ornaments"},{"active":-1,"index":29,"max":5,"slotName":"Dashboard"},{"active":-1,"index":30,"max":15,"slotName":"Dial"},{"active":-1,"index":31,"max":7,"slotName":"Doorspeaker"},{"active":-1,"index":32,"max":14,"slotName":"Seats"},{"active":-1,"index":33,"max":16,"slotName":"Steeringwheel"},{"active":-1,"index":34,"max":0,"slotName":"Shifterleavers"},{"active":-1,"index":35,"max":0,"slotName":"Plaques"},{"active":-1,"index":36,"max":0,"slotName":"Speakers"},{"active":-1,"index":37,"max":0,"slotName":"Trunk"},{"active":-1,"index":38,"max":0,"slotName":"Hydrulics"},{"active":-1,"index":39,"max":4,"slotName":"Engineblock"},{"active":-1,"index":40,"max":8,"slotName":"Airfilter"},{"active":-1,"index":41,"max":12,"slotName":"Struts"},{"active":-1,"index":42,"max":6,"slotName":"Archcover"},{"active":-1,"index":43,"max":11,"slotName":"Aerials"},{"active":-1,"index":44,"max":2,"slotName":"Trim"},{"active":-1,"index":45,"max":5,"slotName":"Tank"},{"active":-1,"index":46,"max":2,"slotName":"Windows"},{"active":-1,"index":47,"max":0,"slotName":"Unk47"},{"active":-1,"index":48,"max":9,"slotName":"Sticker"}]';
            this.customSetMods(JSON.parse(mods));
        }
    }

    customSetMods(mods) {
        this.setState({ mods });
    }

    adjustRotation(e) {
        this.setState({ rotation: e.target.value });

        if ('alt' in window) {
            alt.emit('custom:AdjustRotation', e.target.value);
        }
    }

    adjustMod(index, value) {
        value = parseInt(value);

        this.setState({ [index]: value });
        if ('alt' in window) {
            alt.emit('custom:AdjustMod', index, value);
        }
    }

    adjustWheelType(value) {
        value = parseInt(value);
        this.setState({ wheelType: value });
        if ('alt' in window) {
            alt.emit('custom:AdjustWheelType', value);
        }
    }

    adjustColor(variable, value) {
        this.setState({ [variable]: value });
        if ('alt' in window) {
            alt.emit(
                'custom:AdjustColor',
                {
                    pr: this.state.pr,
                    pg: this.state.pg,
                    pb: this.state.pb
                },
                {
                    sr: this.state.sr,
                    sg: this.state.sg,
                    sb: this.state.sb
                }
            );
        }
    }

    toggleExpand(e) {
        const value = e.target.id;
        const toggleState = !this.state[`toggle${value}`] ? true : false;
        this.setState({ [`toggle${value}`]: toggleState });
    }

    render() {
        return h(
            'div',
            { class: 'page' },
            h(ModItem, {
                state: this.state,
                functions: {
                    adjustMod: this.adjustMod.bind(this),
                    adjustWheelType: this.adjustWheelType.bind(this),
                    toggleExpand: this.toggleExpand.bind(this),
                    adjustColor: this.adjustColor.bind(this)
                }
            }),
            h(
                'div',
                { class: 'rotation' },
                h('input', {
                    type: 'range',
                    min: 0,
                    max: 360,
                    oninput: this.adjustRotation.bind(this)
                })
            )
        );
    }
}

const ModItem = ({ state, functions }) => {
    const filteredMods = state.mods.filter(mod => {
        if (mod.max >= 1) {
            return mod;
        }
    });

    let mods = [];
    let wheelIndex = 0;
    mods = filteredMods.map((mod, index) => {
        const value = state[mod.index] === undefined ? 0 : state[mod.index];
        if (mod.index === 23) {
            wheelIndex = index;
        }

        const isToggled = state[`toggle${mod.index}`] ? true : false;

        return h(
            'div',
            { class: 'mod' },
            h(
                'div',
                { class: 'header' },
                isToggled &&
                    h('button', { onclick: functions.toggleExpand, id: mod.index }, '-'),
                !isToggled &&
                    h('button', { onclick: functions.toggleExpand, id: mod.index }, '+'),
                h('div', { class: 'label' }, mod.slotName)
            ),
            isToggled &&
                h(
                    'div',
                    { class: 'footer' },
                    h(
                        'div',
                        { class: 'rangeBox' },
                        h('p', {}, value),
                        h('input', {
                            type: 'range',
                            min: 0,
                            max: mod.max,
                            value,
                            oninput: e => {
                                functions.adjustMod(mod.index, e.target.value);
                            }
                        }),
                        h('p', {}, mod.max)
                    ),
                    h('button', { class: 'addToBasket' }, 'Add To Basket')
                )
        );
    });

    const typeToggled = state[`toggleWheelType`] ? true : false;
    mods.splice(
        wheelIndex,
        0,
        h(
            'div',
            { class: 'mod' },
            h(
                'div',
                { class: 'header' },
                typeToggled &&
                    h(
                        'button',
                        { onclick: functions.toggleExpand, id: 'WheelType' },
                        '-'
                    ),
                !typeToggled &&
                    h(
                        'button',
                        { onclick: functions.toggleExpand, id: 'WheelType' },
                        '+'
                    ),
                h('div', { class: 'label' }, 'Wheel Type')
            ),
            typeToggled &&
                h(
                    'div',
                    { class: 'footer' },
                    h(
                        'div',
                        { class: 'rangeBox' },
                        h('p', {}, state.wheelType),
                        h('input', {
                            type: 'range',
                            min: 0,
                            max: 7,
                            value: state.wheelType,
                            oninput: e => {
                                functions.adjustWheelType(e.target.value);
                            }
                        }),
                        h('p', {}, 7)
                    ),
                    h('button', { class: 'addToBasket' }, 'Add To Basket')
                )
        )
    );

    const secToggled = state[`toggleSecondaryColor`] ? true : false;
    mods.unshift(
        h(
            'div',
            { class: 'mod' },
            h(
                'div',
                { class: 'header' },
                secToggled &&
                    h(
                        'button',
                        { onclick: functions.toggleExpand, id: 'SecondaryColor' },
                        '-'
                    ),
                !secToggled &&
                    h(
                        'button',
                        { onclick: functions.toggleExpand, id: 'SecondaryColor' },
                        '+'
                    ),
                h('div', { class: 'label' }, 'Secondary Color')
            ),
            secToggled &&
                h(
                    'div',
                    { class: 'footer' },
                    h(colorPicker, { state, functions, letter: 's' }),
                    h('input', {
                        class: 'largeInput',
                        type: 'text',
                        placeholder: '#HEXCODE',
                        onchange: e => {
                            const value = e.target.value;
                            const color = hexToRgb(value);
                            if (!color) {
                                return;
                            }

                            functions.adjustColor('sr', color.r);
                            functions.adjustColor('sg', color.g);
                            functions.adjustColor('sb', color.b);
                        }
                    }),
                    h('button', { class: 'addToBasket' }, 'Add To Basket')
                )
        )
    );

    const primaryToggled = state[`togglePrimaryColor`] ? true : false;
    mods.unshift(
        h(
            'div',
            { class: 'mod' },
            h(
                'div',
                { class: 'header' },
                primaryToggled &&
                    h(
                        'button',
                        { onclick: functions.toggleExpand, id: 'PrimaryColor' },
                        '-'
                    ),
                !primaryToggled &&
                    h(
                        'button',
                        { onclick: functions.toggleExpand, id: 'PrimaryColor' },
                        '+'
                    ),
                h('div', { class: 'label' }, 'Primary Color')
            ),
            primaryToggled &&
                h(
                    'div',
                    { class: 'footer' },
                    h(colorPicker, { state, functions, letter: 'p' }),
                    h('input', {
                        class: 'largeInput',
                        type: 'text',
                        placeholder: '#HEXCODE',
                        onchange: e => {
                            const value = e.target.value;
                            const color = hexToRgb(value);
                            if (!color) {
                                return;
                            }

                            functions.adjustColor('pr', color.r);
                            functions.adjustColor('pg', color.g);
                            functions.adjustColor('pb', color.b);
                        }
                    }),
                    h('button', { class: 'addToBasket' }, 'Add To Basket')
                )
        )
    );

    return h('div', { class: 'mods' }, mods);
};

const colorPicker = ({ state, functions, letter }) => {
    const colors = [];
    const letters = ['r', 'g', 'b'];
    const classes = ['red', 'green', 'blue'];
    for (let i = 0; i < 3; i++) {
        const prefix = `${letter}${letters[i]}`;
        colors.push(
            h(
                'div',
                { class: 'rangeBox' },
                h('input', {
                    class: 'smallInput',
                    type: 'number',
                    value: state[`${prefix}`],
                    onchange: e => {
                        let newValue = parseInt(e.target.value);
                        if (newValue < 0) {
                            newValue = 0;
                        }
                        if (newValue > 255) {
                            newValue = 255;
                        }
                        functions.adjustColor(prefix, e.target.value);
                    }
                }),
                h('input', {
                    class: classes[i],
                    type: 'range',
                    min: 0,
                    max: 255,
                    value: state[`${prefix}`],
                    oninput: e => {
                        functions.adjustColor(prefix, e.target.value);
                    }
                }),
                h('p', {}, 255)
            )
        );
    }

    colors.unshift(
        h('div', {
            class: 'colorBox',
            style: `background-color: rgb(${state[letter + 'r']}, ${
                state[letter + 'g']
            }, ${state[letter + 'b']}); width: 90%; height: 35px; margin: 5px 5%;`
        })
    );
    return h('div', { class: 'colors' }, colors);
};

render(h(App), document.querySelector('#render'));
