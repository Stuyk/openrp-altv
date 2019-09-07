const { createElement, render, Component } = preact;
const h = createElement;

const maxItemLength = 30;

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: 0,
            items: new Array(30),
            mX: 0,
            mY: 0,
            dragging: undefined,
            info: 'None',
            desc: {},
            itemContext: false,
            contextItem: undefined,
            contextX: 0,
            contextY: 0,
            quantityPrompt: false,
            quantityCallback: undefined,
            quantityMax: 0,
            quantity: 0
        };

        this.mousemove = this.mousemove.bind(this);
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('inventory:ClearItems', this.clearItems.bind(this));
            alt.on('inventory:AddItem', this.addItem.bind(this));
        } else {
            for (let i = 0; i < 10; i++) {
                this.addItem(
                    i,
                    `Fish ${i}`,
                    2,
                    { description: 'Stinky fish.' },
                    '902809821'
                );
            }
        }

        window.addEventListener('keyup', this.closeInventory.bind(this));
    }

    closeInventory(e) {
        if (e.keyCode !== 'I'.charCodeAt(0)) return;

        if ('alt' in window) {
            alt.emit('inventory:SavePositions', this.state.items);
            alt.emit('close');
        }

        console.log(this.state.items);
    }

    clearItems() {
        this.setState({ items: [] });
    }

    addItem(...args) {
        const [index, label, quantity, props, hash] = args;
        let items = [...this.state.items];
        items[index] = { label, quantity, props, hash };
        this.setState({ items });
    }

    navigate(e) {
        const currentTab = e.target.id * 1;
        this.setState({ currentTab });
    }

    clickItem(e) {
        // Right-Click
        if (e.which === 3) {
            this.setState({
                itemContext: true,
                contextX: e.screenX,
                contextY: e.screenY,
                contextItem: e.target.id
            });

            console.log(e.target.id);
            return;
        }

        // Left-Click
        this.setState({
            itemContext: false,
            contextItem: undefined,
            dragging: e.target.id,
            mX: e.screenX,
            mY: e.screenY
        }); // Stores Index
        document.addEventListener('mousemove', this.mousemove);
    }

    drop() {
        const itemIndex = this.state.contextItem;
        this.setState({ itemContext: false, contextItem: undefined });

        if (!this.state.items[itemIndex]) return;

        this.dropItem = amount => {
            if (amount <= 0 || this.state.items[itemIndex].quantity < amount) return;

            if ('alt' in window) {
                alt.emit('inventory:Drop', this.state.items[itemIndex].hash, amount);
            } else {
                console.log(`${this.state.items[itemIndex].hash} Dropping -> ${amount}`);
            }
        };

        this.setState({
            quantityPrompt: true,
            quantityCallback: this.dropItem.bind(this),
            quantityMax: this.state.items[itemIndex].quantity
        });
    }

    use() {
        const itemIndex = this.state.contextItem;
        this.setState({ itemContext: false, contextItem: undefined });

        if (!this.state.items[itemIndex]) return;
    }

    destroy() {
        const itemIndex = this.state.contextItem;
        this.setState({ itemContext: false, contextItem: undefined });

        if (!this.state.items[itemIndex]) return;
        console.log(this.state.items[itemIndex].hash);
    }

    quantityChange(e) {
        this.setState({ quantity: e.target.value });
    }

    processQuantity() {
        this.state.quantityCallback(this.state.quantity);

        this.setState({
            quantityPrompt: false,
            quantityCallback: undefined,
            quantityMax: 0,
            quantity: 0
        });
    }

    release(e) {
        if (!this.state.dragging) return;

        document.removeEventListener('mousemove', this.mousemove);
        let items = [...this.state.items];
        const dropIndex = e.target.id;
        const dragIndex = this.state.dragging;

        const dropItem = items[dropIndex];
        const dragItem = items[dragIndex];

        items[dropIndex] = dragItem;
        items[dragIndex] = dropItem;

        this.setState({ items, dragging: undefined });
    }

    mousemove(e) {
        this.setState({ mX: e.screenX, mY: e.screenY });
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
        if (e.target.className === 'item' || e.target.className === 'context') return;
        this.setState({
            itemContext: false,
            contextItem: undefined,
            itemHover: undefined,
            showHover: false
        });
    }

    // Just prevent context menu from coming up.
    preventContextMenu(e) {
        e.preventDefault();
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
                h('div', { class: 'panelcon' }, 'Equipment'),
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
                            contextMenu: this.preventContextMenu.bind(this),
                            mouseover: this.mouseover.bind(this)
                        })
                ),
                // ===> INFO
                h('div', { class: 'panelcon' }, 'Info')
            ),
            this.state.dragging &&
                h(
                    'div',
                    {
                        class: 'item-dragging',
                        style: `left: ${this.state.mX + 5}px; top: ${this.state.mY -
                            50}px;`
                    },
                    `${this.state.items[this.state.dragging].label}`
                )

            /*
            h(
                'div',
                { class: 'container' },
                // Inventory
                this.state.currentTab === 0 &&
                    h(
                        'div',
                        { class: 'panel scroll' },
                        h('div', { class: 'title' }, 'Items'),
                        h(Items, {
                            items: this.state.items,
                            click: this.clickItem.bind(this),
                            release: this.release.bind(this),
                            contextMenu: this.preventContextMenu.bind(this),
                            mouseover: this.mouseover.bind(this),
                            dragging: this.state.dragging
                        })
                    ),
                // Stats
                this.state.currentTab === 1 &&
                    h('div', { class: 'panel' }, h('div', { class: 'title' }, 'Stats')),
                // Profile
                this.state.currentTab === 2 &&
                    h('div', { class: 'panel' }, h('div', { class: 'title' }, 'Profile')),
                this.state.itemContext &&
                    h(
                        'div',
                        {
                            id: 'context',
                            class: 'context',
                            style: `left: ${this.state.contextX - 25}px; top: ${this.state
                                .contextY - 50}px`
                        },
                        h('div', { class: 'item', onclick: this.use.bind(this) }, 'Use'),
                        h(
                            'div',
                            { class: 'item', onclick: this.drop.bind(this) },
                            'Drop'
                        ),
                        h(
                            'div',
                            { class: 'item', onclick: this.destroy.bind(this) },
                            'Destroy'
                        )
                    )
            ),
            // Hovering
            //this.state.showHover &&
            h(
                'div',
                {
                    class: 'info'
                },
                h('div', { class: 'infopanel' }, this.state.info),
                h(ItemProps, { props: this.state.desc })
            ),
            // Dragging
            this.state.dragging &&
                h(
                    'div',
                    {
                        class: 'dragging',
                        style: `left: ${this.state.mX + 5}px; top: ${this.state.mY -
                            50}px;`
                    },
                    `${this.state.items[this.state.dragging].label}`
                ),
            // Quantity Prompt
            this.state.quantityPrompt &&
                h(
                    'div',
                    { class: 'quantityPrompt' },
                    h(
                        'div',
                        { class: 'panel' },
                        h('div', { class: 'title' }, this.state.quantity),
                        h('input', {
                            type: 'range',
                            min: 0,
                            max: this.state.quantityMax,
                            oninput: this.quantityChange.bind(this)
                        }),
                        h(
                            'button',
                            { class: 'button', onclick: this.processQuantity.bind(this) },
                            'Drop'
                        )
                    )
                )
            */
        );
    }
}

const Items = ({ state, click, release, contextMenu, mouseover }) => {
    let itemDivs = state.items.map((item, index) => {
        if (item === undefined) {
            return h(
                'div',
                {
                    class: 'item item-place',
                    id: index,
                    onmouseup: release.bind(this),
                    onmouseover: mouseover.bind(this),
                    oncontextmenu: contextMenu.bind(this)
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
                oncontextmenu: contextMenu.bind(this),
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
        return h('li', {}, `${key}: ${props[key]}`);
    });

    return h('ul', { class: 'itemdescriptions' }, propDivs);
};

render(h(App), document.querySelector('#render'));
