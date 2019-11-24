const FaceNames = [
    'Benjamin',
    'Daniel',
    'Joshua',
    'Noah',
    'Andrew',
    'Joan',
    'Alex',
    'Isaac',
    'Evan',
    'Ethan',
    'Vincent',
    'Angel',
    'Diego',
    'Adrian',
    'Gabriel',
    'Michael',
    'Santiago',
    'Kevin',
    'Louis',
    'Samuel',
    'Anthony',
    'Hannah',
    'Audrey',
    'Jasmine',
    'Giselle',
    'Amelia',
    'Isabella',
    'Zoe',
    'Ava',
    'Camilla',
    'Violet',
    'Sophia',
    'Eveline',
    'Nicole',
    'Ashley',
    'Grace',
    'Brianna',
    'Natalie',
    'Olivia',
    'Elizabeth',
    'Charlotte',
    'Emma',
    'Claude',
    'Niko',
    'John',
    'Misty'
];

// Create Element, Render, Component, etc.
const { createElement, render, Component } = preact;
const h = createElement;

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            props: []
        };

        this.zpos = 0.6;
        this.zoom = 35;
        this.rotate = 275;
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('character:SetFaceProperties', this.setFaceProperties.bind(this));
            alt.on('character:UpdateHairTextures', this.updateHairTextures.bind(this));
            alt.on('character:SexUpdate', this.sexUpdate.bind(this));
            setTimeout(() => {
                alt.emit('character:Ready');
            }, 500);
        }
    }

    setFaceProperties(propertiesJSON) {
        const properties = JSON.parse(propertiesJSON);
        const groupings = [];
        Object.keys(properties).forEach((key, index) => {
            groupings.push({ key, values: properties[key] });
        });
        this.setState({ props: groupings });
    }

    sexUpdate() {
        const props = [...this.state.props];
        props.forEach(prop => {
            if (prop.key === 'SexGroup') return;
            if ('alt' in window) {
                alt.emit(
                    'character:HandleGroupChange',
                    prop.key,
                    JSON.stringify(prop.values)
                );
            }
        });
    }

    updateHairTextures(amount) {
        const props = [...this.state.props];
        const groupIndex = props.findIndex(prop => prop.key === 'HairGroup');
        if (groupIndex <= -1) {
            alt.log('no group');
            return;
        }

        props[groupIndex].values[3].value = 0;
        props[groupIndex].values[3].max = amount - 1;
        this.setState({ props });
    }

    changeInput(groupIndex, index, value) {
        const props = [...this.state.props];
        props[groupIndex].values[index].value = value;
        this.setState({ props });

        if ('alt' in window) {
            if (props[groupIndex].key === 'TattooGroup') {
                alt.emit('character:CleanTattoos');
                props[groupIndex].values.forEach(tattoo => {
                    if (tattoo.value === 0) {
                        alt.emit('character:HandleTattoo', tattoo.tattoo, false);
                        return;
                    }
                    alt.emit('character:HandleTattoo', tattoo.tattoo, true);
                });
            } else {
                alt.emit(
                    'character:HandleGroupChange',
                    props[groupIndex].key,
                    JSON.stringify(props[groupIndex].values)
                );
            }
        }
    }

    changeRotation(e) {
        const value = e.target.value;
        if ('alt' in window) {
            alt.emit('character:Rotate', value);
        }
        this.rotate = parseFloat(value);
    }

    changeZoom(e) {
        const value = e.target.value;
        if ('alt' in window) {
            alt.emit('character:Zoom', value);
        }
        this.zoom = parseFloat(value);
    }

    changeZPos(e) {
        const value = e.target.value;
        if ('alt' in window) {
            alt.emit('character:ZPos', value);
        }
        this.zpos = parseFloat(value);
    }

    render() {
        return h(
            'div',
            { id: 'app' },
            h(Categories, {
                state: this.state.props,
                changeInput: this.changeInput.bind(this)
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
            })
        );
    }
}

class Categories extends App {
    constructor(props) {
        super(props);
        this.state = {};
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
            step: row.increment,
            id: row.key,
            oninput: () => {
                const newValue = document.getElementById(row.key).value;
                props.changeInput(groupIndex, index, newValue);
            }
        });
    }

    checkRender({ props, row, index, groupIndex }) {
        return h('input', {
            type: 'checkbox',
            checked: row.value === 1 ? true : false,
            onchange: () => {
                const isChecked = document.getElementById(row.key).checked;
                const checkValue = isChecked === true ? 1 : 0;
                props.changeInput(groupIndex, index, checkValue);
            },
            id: row.key
        });
    }

    render(props) {
        const categoryData = props.state.map((group, groupIndex) => {
            const groupData = group.values.map((row, index) => {
                if (row.tattoo) {
                    return h(
                        'div',
                        { class: 'row-tattoo' },
                        h('div', { class: 'label' }, `${row.label}`),
                        h(this.checkRender, { props, groupIndex, index, row })
                    );
                }

                return h(
                    'div',
                    { class: 'row' },
                    !row.useFaceNames &&
                        h(
                            'div',
                            { class: 'label' },
                            `${row.label} - ${row.value}/${row.max}`
                        ),
                    row.useFaceNames &&
                        h(
                            'div',
                            { class: 'label' },
                            `${row.label} - ${FaceNames[row.value]}`
                        ),
                    h(this.sliderRender, { props, groupIndex, index, row })
                );
            });

            return h(
                'div',
                { class: 'group' },
                h(
                    'div',
                    { class: 'group-header' },
                    h('div', { class: 'group-title' }, group.key.split('Group')),
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
                this.state[group.key] &&
                    h(
                        'div',
                        {
                            class: 'rows'
                        },
                        groupData
                    )
            );
        });
        return h('div', { class: 'categories' }, categoryData);
    }
}

// Render the above component
render(h(App), document.querySelector('#render'));

window.addEventListener('keydown', e => {
    if (e.keyCode === 32) {
        e.preventDefault();
        return;
    }
});
