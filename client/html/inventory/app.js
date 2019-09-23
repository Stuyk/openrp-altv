const { render, Component, h } = preact;

const itemIcons = {
    unknown: 'unknown',
    fishingrod: 'fishingrod',
    fish: 'fish',
    granolabar: 'chocolate-bar',
    coffee: 'coffee-cup',
    soda: 'soda-can',
    license: 'id-card',
    weapon: 'weapon',
    pickaxe: 'pickaxe',
    rock: 'rock',
    axe: 'axe',
    wood: 'wood',
    phone: 'phone',
    metal: 'metal',
    hammer: 'hammer',
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

/**
 * These are purposely out of order.
 * Please do not change this unless
 * you know what you're doing.
 */
const inventorySlots = [
    {
        id: 28,
        icon: 'hat'
    },
    {
        id: 34,
        icon: 'accessory'
    },
    {
        id: 29,
        icon: 'bandana'
    },
    {
        id: 35,
        icon: 'earring'
    },
    {
        id: 30,
        icon: 'shirt'
    },
    {
        id: 33,
        icon: 'body-armour'
    },
    {
        id: 31,
        icon: 'trousers'
    },
    {
        id: 36,
        icon: 'backpack'
    },
    {
        id: 32,
        icon: 'chelsea-boot'
    },
    {
        id: 37,
        icon: 'hand'
    },
    {
        id: 38,
        icon: 'watch'
    },
    {
        id: 39,
        icon: 'bracelet'
    },
    {
        id: 40,
        icon: 'glasses'
    },
    {
        id: 41,
        icon: 'outfit'
    }
];

const addItemArgs = [
    'index',
    'label',
    'hash',
    'props',
    'quantity',
    'slot',
    'rename',
    'useitem',
    'droppable',
    'icon'
];

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
            items: new Array(128),
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
            newname: '',
            stats: []
        };

        this.mousemove = this.mousemove.bind(this);
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('inventory:ClearItems', this.clearItems.bind(this));
            alt.on('inventory:AddItem', this.addItem.bind(this));
            alt.on('inventory:AddStat', this.addStat.bind(this));
        } else {
            // These are considered DEMO items.
            // Used for out of game reference.
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

            this.addStat('agility', 32, 16456);
            this.addStat('mechanic', 32, 16456);
            this.addStat('gathering', 32, 16456);
            this.addStat('cooking', 32, 16456);
            this.addStat('mining', 32, 16456);
            this.addStat('crafting', 32, 16456);
            this.addStat('agility', 32, 16456);
        }

        window.addEventListener('keyup', this.close.bind(this));
    }

    playAudio(name) {
        if ('alt' in window) {
            const audio = new Audio(`../sound/sounds/${name}.ogg`);
            audio.play();
        }
    }

    /**
     * Close the user's inventory.
     * @param {*} e
     */
    close(e) {
        if (this.state.usingTextBox) return;

        // I Key
        if (e.keyCode === 'I'.charCodeAt(0)) {
            alt.emit('inventory:Exit');
            return;
        }

        // Escape
        if (e.keyCode === 27) {
            alt.emit('inventory:Exit');
            return;
        }
    }

    /**
     * Clears the items in the inventory.
     * Called before refreshing inventory.
     */
    clearItems() {
        this.setState({ items: [] });
    }

    /**
     * Called from clientside.
     * Adds items into the inventory grid.
     * Based on their addItemArguments.
     * @param  {...any} args
     */
    addItem(...args) {
        let items = [...this.state.items];
        if (!args[1]) {
            items[args[0]] = null;
        } else {
            let item = {};
            addItemArgs.forEach((prop, index) => {
                item[prop] = args[index];
            });
            items[args[0]] = item;
        }
        this.setState({ items });
    }

    /**
     * Called when the user navigates
     * to a specific tab by the id.
     * @param {*} e
     */
    navigate(e) {
        const currentTab = e.target.id * 1;
        this.setState({
            currentTab,
            renaming: false,
            usingTextBox: false,
            info: '',
            stat: ''
        });
    }

    /**
     * Called when a user left-clicks
     * or right-clicks an item.
     * @param {*} e
     */
    click(e) {
        // Context Menu
        if (e.which === 3) {
            if (e.target.className.includes('item-place')) return;
            this.setState({
                itemContext: true,
                contextX: e.clientX,
                contextY: e.clientY,
                contextItem: e.target.id
            });
            window.addEventListener('mousedown', this.clearcontext);
            return;
        }

        // Dragging State
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

    /**
     * Called when an item is dropped
     * from the context menu.
     * Takes into account the drop
     * amount at the bottom of the
     * inventory.
     */
    drop() {
        let result = this.subtractItem(this.state.contextItem, this.state.quantity);
        if (!result.result) return;

        this.setState({ itemContext: false, contextItem: undefined });
        if ('alt' in window) {
            alt.emit('inventory:Drop', result.hash, this.state.quantity);
        }
    }

    /**
     * Called when an item is used
     * from the context menu.
     */
    use() {
        let result = this.subtractItem(this.state.contextItem, 1);
        if (!result.result) return;

        this.setState({ itemContext: false, contextItem: undefined });
        if ('alt' in window) {
            alt.emit('inventory:Use', result.hash);
        }
    }

    /**
     * Called when an item is
     * renamed from context
     * menu.
     */
    rename() {
        this.setState({
            itemContext: false,
            renaming: true,
            usingTextBox: true
        });
    }

    /**
     * Called when an item is
     * destroyed from context
     * menu.
     */
    destroy() {
        let result = this.subtractItem(this.state.contextItem, 1);
        if (!result.result) return;

        this.setState({ itemContext: false, contextItem: undefined });
        if ('alt' in window) {
            alt.emit('inventory:Destroy', result.hash);
        }
    }

    /**
     * Called when an item is
     * dropped or destroyed.
     * Mimics what happens on
     * server-side.
     * @param {*} itemIndex
     * @param {*} quantity
     */
    subtractItem(itemIndex, quantity) {
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

    /**
     * Called when the drop quantity is changed.
     * @param {*} e
     */
    quantityChange(e) {
        this.setState({ quantity: e.target.value });
    }

    /**
     * Called when a user is
     * renaming their item.
     * Takes anything but a Symbol.
     * @param {*} e
     */
    renameInput(e) {
        let value = e.target.value + '';
        if (value.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
            this.setState({ newname: '' });
            return;
        }
        this.setState({ newname: e.target.value });
    }

    /**
     * Parses the renamed item.
     */
    renameParse() {
        let items = [...this.state.items];
        const index = this.state.contextItem;
        const hash = this.state.items[index].hash;
        const name = this.state.newname;

        items[index].label = name;

        this.setState({
            renaming: false,
            contextItem: undefined,
            newname: '',
            usingTextBox: false
        });

        if ('alt' in window) {
            alt.emit('inventory:Rename', hash, name);
        }
    }

    /**
     * Called when the user releases
     * their mouse from dragging.
     * @param {*} e
     */
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
            if (dragItem.slot !== parseInt(dropIndex)) {
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

    /**
     * Only called in the dragging state
     * of an item.
     * @param {*} e
     */
    mousemove(e) {
        if (this.state.dragging) {
            this.setState({ mX: e.clientX, mY: e.clientY, targetHover: e.target.id });
        } else {
            this.setState({ mX: e.clientX, mY: e.clientY });
        }
    }

    /**
     * Used for hovering over
     * various items.
     * @param {*} e
     */
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

    /**
     * Called when the user hovers
     * over their stat.
     * @param {*} e
     */
    mouseoverStat(e) {
        if (this.state.stats[e.target.id] === undefined) return;
        let info = this.state.stats[e.target.id].name;
        this.setState({ info, desc: { xp: this.state.stats[e.target.id].xp } });
    }

    /**
     * Clear's the mouse over when the id
     * is not of the 'context' type.
     * @param {*} e
     */
    clearmouseover(e) {
        if (e.target.id === 'context') return;

        this.setState({
            itemContext: false
        });
    }

    /**
     * Add statistic information.
     * @param  {...any} args
     */
    addStat(...args) {
        let [name, lvl, xp] = args;
        let stats = [...this.state.stats];

        stats.push({
            name,
            lvl,
            xp
        });

        this.setState({ stats });
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
                    h(NavTab, {
                        id: 0,
                        currentTab: this.state.currentTab,
                        onclick: this.navigate.bind(this),
                        name: 'Inventory'
                    }),
                    h(NavTab, {
                        id: 1,
                        currentTab: this.state.currentTab,
                        onclick: this.navigate.bind(this),
                        name: 'Stats'
                    }),
                    h(NavTab, {
                        id: 2,
                        currentTab: this.state.currentTab,
                        onclick: this.navigate.bind(this),
                        name: 'Profile'
                    })
                ),
                h('div', { class: 'navcon' }, h('div', { class: 'navtitle' }, 'Info'))
            ),
            h(
                'div',
                { class: 'panels' },
                // ===> EQUIPMENT
                h(
                    'div',
                    { class: 'panelcon' },
                    h(CreateEquipment, {
                        state: this.state,
                        click: this.click.bind(this),
                        release: this.release.bind(this),
                        mouseover: this.mouseover.bind(this)
                    })
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
                                    oninput: this.renameInput.bind(this)
                                }),
                                h(
                                    'button',
                                    {
                                        type: 'text',
                                        class: 'rename-button',
                                        maxlength: 20,
                                        onclick: this.renameParse.bind(this)
                                    },
                                    'Submit'
                                )
                            )
                        ),
                    this.state.renaming === false &&
                        this.state.currentTab === 0 &&
                        h(Items, {
                            state: this.state,
                            click: this.click.bind(this),
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
                        ),
                    this.state.renaming === false &&
                        this.state.currentTab === 1 &&
                        h(Stats, {
                            stats: this.state.stats,
                            hover: this.mouseoverStat.bind(this)
                        })
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
                // Context Menu Div
                h(ItemContext, {
                    contextItem: this.state.items[this.state.contextItem],
                    use: this.use.bind(this),
                    drop: this.drop.bind(this),
                    destroy: this.destroy.bind(this),
                    rename: this.rename.bind(this),
                    contextX: this.state.contextX,
                    contextY: this.state.contextY
                }),
            this.state.dragging &&
                // Item Dragging Div
                h(ItemDrag, { state: this.state })
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

const NavTab = ({ id, currentTab, onclick, name }) => {
    return h(
        'div',
        {
            class: currentTab === id ? 'navtab navfocus' : 'navtab',
            id,
            onclick: onclick.bind(this)
        },
        name
    );
};

const ItemDrag = ({ state }) => {
    return h(
        'div',
        {
            class: 'item-dragging',
            style: `left: ${state.mX - 37.5}px; top: ${state.mY - 37.5}px;`
        },
        `${state.items[state.dragging].label}`
    );
};

const CreateEquipment = ({ state, click, release, mouseover }) => {
    const elements = inventorySlots.map(item => {
        return h(Equipment, {
            state,
            click,
            release,
            mouseover,
            id: item.id,
            icon: item.icon
        });
    });
    return h('div', { class: 'equip-panel' }, elements);
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
                          style: `background: url('../icons/${icon}.svg'); cursor: grab;`
                      },
                      icon
                  )
              )
    );
};

const Stats = ({ stats, hover }) => {
    const statList = stats.map((stat, index) => {
        return h(
            'div',
            { class: 'stat', id: index, onmouseover: hover.bind(this) },
            h('div', { class: 'name' }, stat.name),
            h('div', { class: 'level' }, `${stat.lvl}/99`),
            h('svg', {
                type: 'image/svg+xml',
                class: `statsvg ${stat.name}`,
                style: `background: url('../icons/${stat.name}.svg');`
            })
        );
    });

    return h('div', { class: 'statlist' }, statList);
};

render(h(App), document.querySelector('#render'));

document.addEventListener('contextmenu', e => {
    e.preventDefault();
});
