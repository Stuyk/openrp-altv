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

const GroupFlag = {
    MIN: 0,
    SexGroup: 1,
    FaceGroup: 2,
    StructureGroup: 4,
    HairGroup: 8,
    EyesGroup: 16,
    DetailGroup: 32,
    MakeupGroup: 64,
    TattooGroup: 128,
    MAX: 255
};

function isFlagged(flags, flagValue) {
    if ((flags & flagValue) === flagValue) {
        return true;
    }
    return false;
}

// Create Element, Render, Component, etc.
const { createElement, render, Component } = preact;
const h = createElement;

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            props: [],
            groupFlags: GroupFlag.MAX
        };
        this.zpos = 0.6;
        this.zoom = 35;
        this.rotate = 279;
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('character:SetFaceProperties', this.setFaceProperties.bind(this));
            alt.on('character:UpdateHairTextures', this.updateHairTextures.bind(this));
            alt.on('character:SexUpdate', this.sexUpdate.bind(this));
            alt.on('character:SetGroupFlags', this.setGroupFlags.bind(this));
            setTimeout(() => {
                alt.emit('character:Ready');
            }, 500);
        }
    }

    setGroupFlags(flags) {
        this.setState({ groupFlags: flags });
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

    changeInput(groupKey, index, value) {
        const props = [...this.state.props];
        const groupIndex = props.findIndex(prop => prop.key === groupKey);
        if (groupIndex <= -1) {
            console.log('Group key was not found.');
            return;
        }

        props[groupIndex].values[index].value = value;
        this.setState({ props });

        if ('alt' in window) {
            if (props[groupIndex].key === 'TattooGroup') {
                alt.emit('character:CleanTattoos');
                const flaggedTattoos = [];
                props[groupIndex].values.forEach(tattoo => {
                    if (tattoo.value === 0) {
                        return;
                    }

                    flaggedTattoos.push(tattoo.tattoo);
                });

                alt.emit('character:SetTattoos', flaggedTattoos);
                this.setState({ tattoos: flaggedTattoos });
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

    saveChanges() {
        const groupData = {};
        this.state.props.forEach(group => {
            if (!groupData[group.key]) {
                groupData[group.key] = [];
            }

            group.values.forEach(row => {
                if (row.tattoo) {
                    if (row.value !== 1) {
                        return;
                    }

                    groupData[group.key].push({
                        tattoo: row.tattoo,
                        value: 1
                    });
                    return;
                }

                groupData[group.key].push({
                    key: row.key,
                    value: parseFloat(row.value),
                    id: row.id
                });
            });
        });

        if ('alt' in window) {
            alt.emit('character:SaveChanges', JSON.stringify(groupData));
        }
    }

    discardChanges() {
        alt.emit('character:SaveChanges', null);
    }

    render() {
        return h(
            'div',
            { id: 'app' },
            h(Categories, {
                groupFlags: this.state.groupFlags,
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
            }),
            h(
                'button',
                {
                    class: 'savechanges',
                    onclick: this.saveChanges.bind(this)
                },
                'Save Changes'
            )
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

    sliderRender({ props, row, index, groupKey }) {
        return h('input', {
            type: 'range',
            value: row.value,
            min: row.min,
            max: row.max,
            step: row.increment,
            id: row.key,
            oninput: () => {
                const newValue = document.getElementById(row.key).value;
                props.changeInput(groupKey, index, newValue);
            }
        });
    }

    checkRender({ props, row, index, groupKey }) {
        return h('input', {
            type: 'checkbox',
            checked: row.value === 1 ? true : false,
            onchange: () => {
                const isChecked = document.getElementById(row.key).checked;
                const checkValue = isChecked === true ? 1 : 0;
                props.changeInput(groupKey, index, checkValue);
            },
            id: row.key
        });
    }

    render(props) {
        const filteredCategories = props.state.filter(category => {
            if (isFlagged(props.groupFlags, GroupFlag[category.key])) return category;
        });

        const categoryData = filteredCategories.map(group => {
            const groupData = group.values.map((row, index) => {
                if (row.tattoo) {
                    return h(
                        'div',
                        { class: 'row-tattoo' },
                        h('div', { class: 'label' }, `${row.label}`),
                        h(this.checkRender, { props, groupKey: group.key, index, row })
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
                    h(this.sliderRender, { props, groupKey: group.key, index, row })
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
