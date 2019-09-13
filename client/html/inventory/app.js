const { render, Component, h } = preact;

const maxItemLength = 128;
let usingTextBox = false;
const itemIcons = {
    unknown: 'unknown',
    fishingrod: 'fishingrod',
    fish: 'fish',
    granolabar: 'chocolate-bar',
    coffee: 'coffee-cup',
    soda: 'soda-can',
    license: 'id-card',
    weapon: 'weapon',
    28: 'hat',
    29: 'bandana',
    30: 'shirt',
    31: 'trousers',
    32: 'chelsea-boot',
    33: 'body-armour',
    34: 'accessory',
    35: 'earring',
    36: 'backpack',
    37: 'hand',
    38: 'watch',
    39: 'bracelet',
    40: 'glasses',
    41: 'outfit'
};

function ready() {
    if ('alt' in window) {
        alt.emit('inventory:FetchItems');
    }
}

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: 0,
            items: new Array(maxItemLength),
            mX: 0,
            mY: 0,
            dragging: undefined,
            info: 'None',
            desc: {},
            itemContext: false,
            contextItem: undefined,
            contextX: 0,
            contextY: 0,
            quantity: 1,
            mask: undefined,
            targetHover: -1,
            renaming: false,
            newname: ''
        };

        this.mousemove = this.mousemove.bind(this);
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('inventory:ClearItems', this.clearItems.bind(this));
            alt.on('inventory:AddItem', this.addItem.bind(this));
        } else {
            // _index,label,hash,props,quantity,equipSlot,
            // rename,useitem,droppable,icon
            this.addItem(
                0,
                'Fish',
                '2151251',
                { description: 'Whatever' },
                2,
                undefined,
                false,
                false,
                true,
                'fish'
            );
            this.addItem(
                1,
                'Fishing Rod',
                '2151251',
                { description: 'Whatever' },
                1,
                37,
                false,
                false,
                true,
                'fishingrod'
            );
            this.addItem(
                2,
                'Really Ugly Fish',
                '2151251',
                { description: 'Whatever' },
                2
            );
            this.addItem(
                3,
                'Hat',
                '0',
                { description: 'Whatever' },
                1,
                28,
                true,
                true,
                true
            );
            this.addItem(4, 'Helmet', '0', { description: 'Whatever' }, 1, 29);
            this.addItem(5, 'Shirt', '0', { description: 'Whatever' }, 1, 30);
            this.addItem(6, 'Pants', '0', { description: 'Whatever' }, 1, 31);
            this.addItem(7, 'Shoes', '0', { description: 'Whatever' }, 1, 32);
            this.addItem(8, 'Body Armor', '0', { description: 'Whatever' }, 1, 33);
            this.addItem(9, 'Accessory', '0', { description: 'Whatever' }, 1, 34);
            this.addItem(10, 'Earring', '0', { description: 'Whatever' }, 1, 35);
            this.addItem(11, 'Backpack', '0', { description: 'Whatever' }, 1, 36);
            this.addItem(12, 'Pistol', '0', { description: 'Whatever' }, 1, 37);
            this.addItem(13, 'Watch', '0', { description: 'Whatever' }, 1, 38);
            this.addItem(14, 'Bracelet', '0', { description: 'Whatever' }, 1, 39);
            this.addItem(15, 'Glasses', '0', { description: 'Whatever' }, 1, 40);
            this.addItem(16, 'Police Uniform', '0', { description: 'Whatever' }, 1, 41);
            this.addItem(
                17,
                'Fire Uniform',
                '0',
                { description: 'Whatever' },
                1,
                41,
                true
            );
        }

        window.addEventListener('keyup', this.closeInventory.bind(this));
    }

    playAudio(name) {
        if ('alt' in window) {
            const audio = new Audio(`../sound/sounds/${name}.ogg`);
            audio.play();
        }
    }

    closeInventory(e) {
        if (e.keyCode !== 'I'.charCodeAt(0)) return;
        if (usingTextBox) return;

        if ('alt' in window) {
            alt.emit('inventory:Exit');
        }
    }

    clearItems() {
        this.setState({ items: [] });
    }

    /*
    index,
    item.label,
    item.hash,
    item.props,
    item.quantity
    */
    addItem(...args) {
        const [
            _index,
            label,
            hash,
            props,
            quantity,
            slot,
            rename,
            useitem,
            droppable,
            icon
        ] = args;
        let items = [...this.state.items];

        if (!label) {
            items[_index] = null;
        } else {
            items[_index] = {
                label,
                hash,
                props,
                quantity,
                slot,
                rename,
                useitem,
                droppable,
                icon
            };
        }
        this.setState({ items });
    }

    navigate(e) {
        usingTextBox = false;
        const currentTab = e.target.id * 1;
        this.setState({ currentTab, renaming: false });
    }

    clickItem(e) {
        if (e.which === 3) {
            this.openItemContext(e);
            return;
        }

        this.beginDragState(e);
    }

    openItemContext(e) {
        if (e.target.className.includes('item-place')) return;
        this.setState({
            itemContext: true,
            contextX: e.clientX,
            contextY: e.clientY,
            contextItem: e.target.id
        });
        window.addEventListener('mousedown', this.clearcontext);
    }

    closeContext(e) {
        if (e.which === 3) return;

        window.removeEventListener('mousedown', this.clearcontext);
        if (e.target.className.includes('context-item')) return;

        this.setState({
            itemContext: false,
            contextItem: undefined
        });
    }

    beginDragState(e) {
        if (e.target.className.includes('item-place')) return;
        this.setState({
            itemContext: false,
            contextItem: undefined,
            dragging: e.target.id,
            mX: e.clientX,
            mY: e.clientY
        });
        document.addEventListener('mousemove', this.mousemove);
    }

    drop() {
        let result = this.subItem(this.state.contextItem, this.state.quantity);
        if (!result.result) return;

        this.setState({ itemContext: false, contextItem: undefined });
        if ('alt' in window) {
            alt.emit('inventory:Drop', result.hash, this.state.quantity);
        }
    }

    use() {
        let result = this.subItem(this.state.contextItem, 1);
        if (!result.result) return;

        this.setState({ itemContext: false, contextItem: undefined });
        if ('alt' in window) {
            alt.emit('inventory:Use', result.hash);
        }
    }

    rename() {
        usingTextBox = true;
        this.setState({
            itemContext: false,
            renaming: true
        });
    }

    destroy() {
        let result = this.subItem(this.state.contextItem, 1);
        if (!result.result) return;

        this.setState({ itemContext: false, contextItem: undefined });
        if ('alt' in window) {
            alt.emit('inventory:Destroy', result.hash);
        }
    }

    subItem(itemIndex, quantity) {
        let items = [...this.state.items];
        const item = items[itemIndex];

        if (!item) return { hash: item.hash, result: false };

        if (item.quantity < this.state.quantity) {
            this.setState({ quantity: item.quantity });
            return { hash: item.hash, result: false };
        }

        if (item.quantity === quantity) {
            items[itemIndex] = undefined;
            this.setState({ items });
        } else {
            items[itemIndex].quantity -= quantity;
            if (items[itemIndex].quantity <= 0) items[itemIndex] = undefined;
            this.setState({ items });
        }

        return { hash: item.hash, result: true };
    }

    quantityChange(e) {
        this.setState({ quantity: e.target.value });
    }

    renameChange(e) {
        let value = e.target.value + '';
        if (value.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
            this.setState({ newname: '' });
            return;
        }
        this.setState({ newname: e.target.value });
    }

    parseRename() {
        let items = [...this.state.items];
        const index = this.state.contextItem;
        const hash = this.state.items[index].hash;
        const name = this.state.newname;

        items[index].label = name;

        this.setState({ renaming: false, contextItem: undefined, newname: '' });
        usingTextBox = false;

        if ('alt' in window) {
            alt.emit('inventory:Rename', hash, name);
        }
    }

    release(e) {
        if (!this.state.dragging) return;
        document.removeEventListener('mousemove', this.mousemove);
        let items = [...this.state.items];

        const dropIndex = e.target.id;
        const dragIndex = this.state.dragging;

        const dropItem = items[dropIndex];
        const dragItem = items[dragIndex];

        // Head Slot
        if (parseInt(dropIndex) >= 28) {
            if (!this.handleSlot(dragItem, parseInt(dropIndex))) {
                this.setState({ items, dragging: undefined, targetHover: -1 });
                return;
            }
        }

        // Dragging into Inventory
        if (parseInt(dragIndex) >= 28) {
            if (dropItem !== undefined && dropItem !== null) {
                if (dragItem.slot !== dropItem.slot) {
                    this.setState({ items, dragging: undefined, targetHover: -1 });
                    return;
                }
            }
        }

        items[dropIndex] = dragItem;
        items[dragIndex] = dropItem;

        if ('alt' in window) {
            alt.emit('inventory:SetPosition', dropIndex, dragIndex);
        }
        this.setState({ items, dragging: undefined, targetHover: -1 });
    }

    handleSlot(item, targetSlot) {
        if (item.slot !== targetSlot) return false;
        return true;
    }

    mousemove(e) {
        if (this.state.dragging) {
            this.setState({ mX: e.clientX, mY: e.clientY, targetHover: e.target.id });
        } else {
            this.setState({ mX: e.clientX, mY: e.clientY });
        }
    }

    mouseover(e) {
        let info = this.state.items[e.target.id]
            ? this.state.items[e.target.id].label
            : 'Empty';
        let desc = this.state.items[e.target.id]
            ? this.state.items[e.target.id].props
            : '';

        if (info !== 'Empty') {
            this.playAudio('tick');
        }

        this.setState({
            info,
            desc
        });
    }

    clearmouseover(e) {
        if (e.target.id === 'context') return;

        this.setState({
            itemContext: false
        });
    }

    render() {
        return h(
            'div',
            {
                id: 'app',
                onmouseover: this.clearmouseover.bind(this)
            },
            // ===> NAVIGATION
            h(
                'div',
                { class: 'navigation' },
                h(
                    'div',
                    { class: 'navcon' },
                    h('div', { class: 'navtitle' }, 'Equipment')
                ),
                h(
                    'div',
                    { class: 'navcon' },

                    h(
                        'div',
                        {
                            class:
                                this.state.currentTab === 0
                                    ? 'navtab navfocus'
                                    : 'navtab',
                            id: 0,
                            onclick: this.navigate.bind(this)
                        },
                        'Inventory'
                    ),
                    h(
                        'div',
                        {
                            class:
                                this.state.currentTab === 1
                                    ? 'navtab navfocus'
                                    : 'navtab',
                            id: 1,
                            onclick: this.navigate.bind(this)
                        },
                        'Stats'
                    ),
                    h(
                        'div',
                        {
                            class:
                                this.state.currentTab === 2
                                    ? 'navtab navfocus'
                                    : 'navtab',
                            id: 2,
                            onclick: this.navigate.bind(this)
                        },
                        'Profile'
                    )
                ),
                h('div', { class: 'navcon' }, h('div', { class: 'navtitle' }, 'Info'))
            ),
            this.state.dragging &&
                h(
                    'div',
                    {
                        class: 'item-dragging',
                        style: `left: ${this.state.mX - 37.5}px; top: ${this.state.mY -
                            37.5}px;`
                    },
                    `${this.state.items[this.state.dragging].label}`
                ),
            h(
                'div',
                { class: 'panels' },
                // ===> EQUIPMENT
                h(
                    'div',
                    { class: 'panelcon' },
                    h(
                        'div',
                        { class: 'equip-panel' },
                        h(Equipment, {
                            id: 28,
                            state: this.state,
                            click: this.clickItem.bind(this),
                            release: this.release.bind(this),
                            mouseover: this.mouseover.bind(this),
                            icon: 'hat'
                        }),
                        h(Equipment, {
                            id: 34,
                            state: this.state,
                            click: this.clickItem.bind(this),
                            release: this.release.bind(this),
                            mouseover: this.mouseover.bind(this),
                            icon: 'accessory'
                        }),
                        h(Equipment, {
                            id: 29,
                            state: this.state,
                            click: this.clickItem.bind(this),
                            release: this.release.bind(this),
                            mouseover: this.mouseover.bind(this),
                            icon: 'bandana'
                        }),

                        h(Equipment, {
                            id: 35,
                            state: this.state,
                            click: this.clickItem.bind(this),
                            release: this.release.bind(this),
                            mouseover: this.mouseover.bind(this),
                            icon: 'earring'
                        }),
                        h(Equipment, {
                            id: 30,
                            state: this.state,
                            click: this.clickItem.bind(this),
                            release: this.release.bind(this),
                            mouseover: this.mouseover.bind(this),
                            icon: 'shirt'
                        }),

                        h(Equipment, {
                            id: 33,
                            state: this.state,
                            click: this.clickItem.bind(this),
                            release: this.release.bind(this),
                            mouseover: this.mouseover.bind(this),
                            icon: 'body-armour'
                        }),
                        h(Equipment, {
                            id: 31,
                            state: this.state,
                            click: this.clickItem.bind(this),
                            release: this.release.bind(this),
                            mouseover: this.mouseover.bind(this),
                            icon: 'trousers'
                        }),
                        h(Equipment, {
                            id: 36,
                            state: this.state,
                            click: this.clickItem.bind(this),
                            release: this.release.bind(this),
                            mouseover: this.mouseover.bind(this),
                            icon: 'backpack'
                        }),
                        h(Equipment, {
                            id: 32,
                            state: this.state,
                            click: this.clickItem.bind(this),
                            release: this.release.bind(this),
                            mouseover: this.mouseover.bind(this),
                            icon: 'chelsea-boot'
                        }),
                        h(Equipment, {
                            id: 37,
                            state: this.state,
                            click: this.clickItem.bind(this),
                            release: this.release.bind(this),
                            mouseover: this.mouseover.bind(this),
                            icon: 'hand'
                        }),
                        h(Equipment, {
                            id: 38,
                            state: this.state,
                            click: this.clickItem.bind(this),
                            release: this.release.bind(this),
                            mouseover: this.mouseover.bind(this),
                            icon: `watch`
                        }),
                        h(Equipment, {
                            id: 39,
                            state: this.state,
                            click: this.clickItem.bind(this),
                            release: this.release.bind(this),
                            mouseover: this.mouseover.bind(this),
                            icon: 'bracelet'
                        }),
                        h(Equipment, {
                            id: 40,
                            state: this.state,
                            click: this.clickItem.bind(this),
                            release: this.release.bind(this),
                            mouseover: this.mouseover.bind(this),
                            icon: 'glasses'
                        }),
                        h(Equipment, {
                            id: 41,
                            state: this.state,
                            click: this.clickItem.bind(this),
                            release: this.release.bind(this),
                            mouseover: this.mouseover.bind(this),
                            icon: 'outfit'
                        })
                    )
                ),
                // ===> CENTER PANEL
                h(
                    'div',
                    { class: 'panelcon scroll' },
                    // ===> ITEMS
                    this.state.renaming === true &&
                        this.state.currentTab === 0 &&
                        h(
                            'div',
                            { class: 'renamecon' },
                            h('div', { class: 'input-label' }, 'Rename Item'),
                            h(
                                'div',
                                { class: 'rename-group' },
                                h('input', {
                                    type: 'text',
                                    class: 'inputname',
                                    value: this.state.newname,
                                    maxlength: '20',
                                    oninput: this.renameChange.bind(this)
                                }),
                                h(
                                    'button',
                                    {
                                        type: 'text',
                                        class: 'rename-button',
                                        maxlength: 20,
                                        onclick: this.parseRename.bind(this)
                                    },
                                    'Submit'
                                )
                            )
                        ),
                    this.state.renaming === false &&
                        this.state.currentTab === 0 &&
                        h(Items, {
                            state: this.state,
                            click: this.clickItem.bind(this),
                            release: this.release.bind(this),
                            mouseover: this.mouseover.bind(this)
                        }),
                    this.state.renaming === false &&
                        this.state.currentTab === 0 &&
                        h(
                            'div',
                            { class: 'inputcon' },
                            h('div', { class: 'input-label' }, 'Drop Amount'),
                            h(
                                'div',
                                { class: 'input-group' },
                                h('input', {
                                    type: 'number',
                                    class: 'inputquantity',
                                    value: this.state.quantity,
                                    oninput: this.quantityChange.bind(this)
                                }),
                                h(
                                    'button',
                                    {
                                        onclick: this.quantityChange.bind(this),
                                        value: '1'
                                    },
                                    'x1'
                                ),
                                h(
                                    'button',
                                    {
                                        onclick: this.quantityChange.bind(this),
                                        value: '5'
                                    },
                                    'x5'
                                ),
                                h(
                                    'button',
                                    {
                                        onclick: this.quantityChange.bind(this),
                                        value: '10'
                                    },
                                    'x10'
                                ),
                                h(
                                    'button',
                                    {
                                        onclick: this.quantityChange.bind(this),
                                        value: '25'
                                    },
                                    'x25'
                                ),
                                h(
                                    'button',
                                    {
                                        onclick: this.quantityChange.bind(this),
                                        value: '100'
                                    },
                                    'x100'
                                )
                            )
                        )
                ),
                // ===> INFO
                h(
                    'div',
                    { class: 'panelcon' },
                    h(
                        'div',
                        { class: 'info-panel' },
                        h('div', { class: 'info-title' }, this.state.info),
                        h(ItemProps, { props: this.state.desc })
                    )
                )
            ),
            // ===> Context Menu
            this.state.itemContext &&
                h(ItemContext, {
                    contextItem: this.state.items[this.state.contextItem],
                    use: this.use.bind(this),
                    drop: this.drop.bind(this),
                    destroy: this.destroy.bind(this),
                    rename: this.rename.bind(this),
                    contextX: this.state.contextX,
                    contextY: this.state.contextY
                })
        );
    }
}

const Items = ({ state, click, release, mouseover }) => {
    let itemDivs = state.items.map((item, index) => {
        if (index >= 28) return;

        if (!item) {
            return h(
                'div',
                {
                    class:
                        parseInt(state.targetHover) === index
                            ? 'item item-place item-hovered'
                            : 'item item-place',
                    id: index,
                    onmouseup: release.bind(this),
                    onmouseover: mouseover.bind(this)
                },
                'Empty'
            );
        }
        return h(
            'div',
            {
                class:
                    index === state.dragging * 1 ? 'item item-dragged' : 'item non-equip',
                id: index,
                onmousedown: click.bind(this),
                onmouseup: release.bind(this),
                onmouseover: mouseover.bind(this)
            },

            item.quantity >= 2 &&
                h('div', { class: 'item-quantity' }, `x${item.quantity}`),
            item.slot >= 28 &&
                !item.icon &&
                h(
                    'object',
                    {
                        type: 'image/svg+xml',
                        class: `svg ${itemIcons[item.slot]}`,
                        style: `background: url('../icons/${itemIcons[item.slot]}.svg');`
                    }
                    //icon
                ),
            item.icon &&
                h('object', {
                    type: 'image/svg+xml',
                    class: `svg ${itemIcons[item.icon]}`,
                    style: `background: url('../icons/${itemIcons[item.icon]}.svg');`
                }),
            !item.icon &&
                !item.slot &&
                h('object', {
                    type: 'image/svg+xml',
                    class: `svg unknown`,
                    style: `background: url('../icons/unknown.svg');`
                }),
            item.label
        );
    });

    return h('div', { class: 'item-grid' }, itemDivs);
};

const ItemProps = ({ props }) => {
    const propDivs = Object.keys(props).map((key, index) => {
        return h('li', {}, `${key.toUpperCase()}: ${props[key]}`);
    });

    return h('ul', { class: 'info-desc' }, propDivs);
};

const ItemContext = ({ contextItem, use, drop, destroy, rename, contextX, contextY }) => {
    return h(
        'div',
        {
            id: 'context',
            class: 'context',
            style: `left: ${contextX - 37.5}px; top: ${contextY - 5}px`
        },
        contextItem.useitem &&
            h('div', { id: 'context', class: 'context-item', onclick: use }, 'Use'),
        contextItem.droppable &&
            h('div', { id: 'context', class: 'context-item', onclick: drop }, 'Drop'),
        h('div', { id: 'context', class: 'context-item', onclick: destroy }, 'Destroy'),
        contextItem.rename &&
            h('div', { id: 'context', class: 'context-item', onclick: rename }, 'Rename')
    );
};

const Equipment = ({ state, click, release, mouseover, id, icon }) => {
    return h(
        'div',
        { class: 'single-item' },
        state.items[id]
            ? h(
                  'div',
                  {
                      class: 'item equipped',
                      id: id,
                      onmousedown: click.bind(this),
                      onmouseup: release.bind(this),
                      onmouseover: mouseover.bind(this)
                  },
                  state.items[id] ? state.items[id].label : slotName,
                  h(
                      'object',
                      {
                          type: 'image/svg+xml',
                          class: `svg ${icon}`,
                          style: `background: url('../icons/${icon}.svg');`
                      },
                      icon
                  )
              )
            : h(
                  'div',
                  {
                      class:
                          parseInt(state.targetHover) === id
                              ? parseInt(state.items[state.dragging].slot) === id
                                  ? 'item equipped-hover item-place item-hovered'
                                  : 'item item-place item-hovered-disabled'
                              : 'item item-place',
                      id: id,
                      onmousedown: click.bind(this),
                      onmouseup: release.bind(this),
                      onmouseover: mouseover.bind(this)
                  },
                  h(
                      'object',
                      {
                          type: 'image/svg+xml',
                          class: `svg ${icon}`,
                          style: `background: url('../icons/${icon}.svg');`
                      },
                      icon
                  )
              )
    );
};

render(h(App), document.querySelector('#render'));

document.addEventListener('contextmenu', e => {
    e.preventDefault();
});
