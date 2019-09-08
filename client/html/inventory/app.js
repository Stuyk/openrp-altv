const { createElement, render, Component } = preact;
const h = createElement;

const maxItemLength = 128;

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
            targetHover: -1
        };

        this.mousemove = this.mousemove.bind(this);
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('inventory:ClearItems', this.clearItems.bind(this));
            alt.on('inventory:AddItem', this.addItem.bind(this));
        } else {
            this.addItem(0, 'Fish', '2151251', { description: 'Whatever' }, 1);
            this.addItem(
                2,
                'Really Ugly Fish',
                '2151251',
                { description: 'Whatever' },
                1
            );
            this.addItem(3, 'Helmet', '2151251', { description: 'Whatever' }, 1, 28);
            this.addItem(4, 'Gloves', '2151251', { description: 'Whatever' }, 1, 29);
            this.addItem(5, 'Body Armor', '2151251', { description: 'Whatever' }, 1, 30);
        }

        window.addEventListener('keyup', this.closeInventory.bind(this));
    }

    closeInventory(e) {
        if (e.keyCode !== 'I'.charCodeAt(0)) return;

        if ('alt' in window) {
            alt.emit('inventory:SavePositions', this.state.items);
            alt.emit('close');
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
        const [_index, label, hash, props, quantity, slot] = args;
        let items = [...this.state.items];

        if (!label) {
            items[_index] = null;
        } else {
            items[_index] = {
                label,
                hash,
                props,
                quantity,
                slot
            };
        }
        this.setState({ items });
    }

    navigate(e) {
        const currentTab = e.target.id * 1;
        this.setState({ currentTab });
    }

    clickItem(e) {
        if (e.which === 3) {
            this.openItemContext(e);
            return;
        }

        this.beginDragState(e);
    }

    openItemContext(e) {
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

        this.setState({
            info,
            desc
        });
    }

    clearmouseover(e) {
        if (e.target.id === 'context') return;

        this.setState({
            itemContext: false,
            contextItem: undefined
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
                        h('div', { class: 'equip-title' }, 'Mask'),
                        h(Equipment, {
                            id: 28,
                            state: this.state,
                            click: this.clickItem.bind(this),
                            release: this.release.bind(this),
                            mouseover: this.mouseover.bind(this)
                        }),
                        h('div', { class: 'equip-title' }, 'Hand'),
                        h(Equipment, {
                            id: 29,
                            state: this.state,
                            click: this.clickItem.bind(this),
                            release: this.release.bind(this),
                            mouseover: this.mouseover.bind(this)
                        }),
                        h('div', { class: 'equip-title' }, 'Body'),
                        h(Equipment, {
                            id: 30,
                            state: this.state,
                            click: this.clickItem.bind(this),
                            release: this.release.bind(this),
                            mouseover: this.mouseover.bind(this)
                        })
                    )
                ),
                // ===> CENTER PANEL
                h(
                    'div',
                    { class: 'panelcon scroll' },
                    // ===> ITEMS
                    this.state.currentTab === 0 &&
                        h(Items, {
                            state: this.state,
                            click: this.clickItem.bind(this),
                            release: this.release.bind(this),
                            mouseover: this.mouseover.bind(this)
                        }),
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
            // ===> Context Menu
            this.state.itemContext &&
                h(ItemContext, {
                    use: this.use.bind(this),
                    drop: this.drop.bind(this),
                    destroy: this.destroy.bind(this),
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
                class: index === state.dragging * 1 ? 'item item-dragged' : 'item',
                id: index,
                onmousedown: click.bind(this),
                onmouseup: release.bind(this),
                onmouseover: mouseover.bind(this)
            },
            item.label,
            h('div', { class: 'item-quantity' }, `x${item.quantity}`)
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

const ItemContext = ({ use, drop, destroy, contextX, contextY }) => {
    return h(
        'div',
        {
            id: 'context',
            class: 'context',
            style: `left: ${contextX - 37.5}px; top: ${contextY - 5}px`
        },
        h('div', { id: 'context', class: 'context-item', onclick: use }, 'Use'),
        h('div', { id: 'context', class: 'context-item', onclick: drop }, 'Drop'),
        h('div', { id: 'context', class: 'context-item', onclick: destroy }, 'Destroy')
    );
};

const Equipment = ({ state, click, release, mouseover, id }) => {
    return h(
        'div',
        { class: 'single-item' },
        state.items[id]
            ? h(
                  'div',
                  {
                      class: 'item',
                      id: id,
                      onmousedown: click.bind(this),
                      onmouseup: release.bind(this),
                      onmouseover: mouseover.bind(this)
                  },
                  state.items[id] ? state.items[id].label : 'Empty'
              )
            : h(
                  'div',
                  {
                      class:
                          parseInt(state.targetHover) === id
                              ? 'item item-place item-hovered'
                              : 'item item-place',
                      id: id,
                      onmousedown: click.bind(this),
                      onmouseup: release.bind(this),
                      onmouseover: mouseover.bind(this)
                  },
                  state.items[id] ? state.items[id].label : 'Empty'
              )
    );
};

render(h(App), document.querySelector('#render'));

document.addEventListener('contextmenu', e => {
    e.preventDefault();
});

function ready() {
    if ('alt' in window) {
        alt.emit('inventory:FetchItems');
    }
}
