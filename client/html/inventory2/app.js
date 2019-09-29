const { createElement, render, Component } = preact;
const h = createElement;

const tabData = {
    profile: 0,
    stats: 1,
    inventory: 2,
    unknown: 3,
    settings: 4
};

const icons = [
    'accessory',
    'agility',
    'axe',
    'backpack',
    'bandana',
    'body-armour',
    'bracelet',
    'chelsea-boot',
    'chocolate-bar',
    'coffee-cup',
    'cooking',
    'crafting',
    'earring',
    'farming',
    'fish',
    'fishing',
    'fishingrod',
    'gathering',
    'glasses',
    'hammer',
    'hand',
    'hat',
    'id-card',
    'inventory',
    'mechanic',
    'medicine',
    'metal',
    'mining',
    'nobility',
    'notoriety',
    'outfit',
    'phone',
    'pickaxe',
    'planks',
    'profile',
    'rock',
    'settings',
    'shirt',
    'smithing',
    'soda-can',
    'stats',
    'trousers',
    'unknown',
    'watch',
    'weapon',
    'wood',
    'woodcutting'
];

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 2,
            tabIcons: true
        };
    }

    shouldComponentUpdate() {
        const data = document.querySelectorAll('.tabcon');

        for (let doc in data) {
            while (data[doc].firstChild) {
                data[doc].removeChild(data[doc].firstChild);
            }
        }
    }

    componentDidMount() {
        SVGInject(document.getElementsByClassName('injectable'));
    }

    componentDidUpdate() {
        SVGInject(document.getElementsByClassName('injectable'));
    }

    navigate(e) {
        this.setState({ tabIndex: parseInt(e.target.id) });
    }

    render() {
        return h(
            'div',
            { class: 'container' },
            // Headers
            h('div'),
            h('div'),
            h(Navigation, {
                navigate: this.navigate.bind(this),
                index: this.state.tabIndex
            }),
            // Panels
            h('div', { class: 'panel' }),
            h('div', { class: 'panel' }),
            h(
                'div',
                { class: 'panel panel-bg' },
                // Profile
                this.state.tabIndex == 0 && h('div', {}, 'profile'),
                // Stats
                this.state.tabIndex == 1 && h('div', {}, 'stats'),
                // Inventory
                this.state.tabIndex == 2 && h(Inventory),
                // Idk Yet
                this.state.tabIndex == 3 && h('div', {}, 'idk'),
                // Settings
                this.state.tabIndex == 4 && h('div', {}, 'settings')
            )
        );
    }
}

const Navigation = ({ navigate, index }) => {
    const tabs = Object.keys(tabData).map((key, currIndex) => {
        return h(
            'div',
            {
                class: currIndex === index ? 'tabcon active' : 'tabcon',
                id: tabData[key],
                onclick: navigate.bind(this)
            },
            h('img', {
                src: `../icons/${key}.svg`,
                class: 'injectable'
            })
        );
    });
    return h('div', { class: 'navcon' }, tabs);
};

class Inventory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inventory: new Array(128)
        };
    }

    componentDidMount() {
        if ('alt' in window) {
            // Stuff
        } else {
            const items = new Array(128).fill(null);
            items[0] = {
                name: 'Taco',
                hash: '90840921921',
                icon: 'fish'
            };
            items[1] = {
                name: 'Fish Taco',
                hash: '90840921922',
                icon: 'fish'
            };
            items[2] = {
                name: 'Fishing Rod',
                hash: '149214',
                icon: 'fishingrod'
            };

            this.setState({ inventory: items });
        }

        document.addEventListener('mouseover', this.mouseover.bind(this));
        document.addEventListener('mousedown', this.mousedown.bind(this));
        document.addEventListener('mouseup', this.mouseup.bind(this));
        document.addEventListener('mousemove', this.mousemove.bind(this));
        document.addEventListener('keydown', this.keydown.bind(this));
        document.addEventListener('keyup', this.keyup.bind(this));
    }

    mouseover(e) {
        if (this.state.context) {
            this.hoverWhileContextMenu(e);
        } else {
            this.hoverWhileDragging(e);
        }
    }

    hoverWhileContextMenu(e) {
        const classList = e.target.classList;

        if (this.state.context && !classList.contains('contextOption')) {
            this.setState({ context: false });
            return;
        } else if (this.state.context) {
            return;
        }
    }

    hoverWhileDragging(e) {
        const classList = e.target.classList;
        const id = e.target.id;

        if (!classList.contains('item')) {
            this.setState({ hoveredItem: -1 });
            return;
        }

        if (this.state.held) {
            if (this.state.hoveredItem === parseInt(id)) return;
            this.setState({ hoveredItem: parseInt(id) });
            return;
        }
    }

    mousemove(e) {
        if (this.state.context) return;
        this.setState({ x: e.clientX, y: e.clientY });
    }

    mousedown(e) {
        if (this.state.context) return;
        // Right-Click
        if (e.which === 3) {
            this.rightClick(e);
            return;
        } else {
            this.leftClick(e);
            return;
        }
    }

    leftClick(e) {
        const list = e.target.classList;
        if (!list.contains('item') || list.contains('item-place')) return;
        if (Date.now() < this.state.doubleClickTime) {
            this.doubleClick(e);
            return;
        }

        if (this.state.shiftModifier) {
            this.shiftClick(e);
            return;
        }

        this.setState({
            held: true,
            doubleClickTime: Date.now() + 200,
            heldItem: e.target.id
        });
    }

    rightClick(e) {
        if (this.state.context) return;
        const list = e.target.classList;
        if (!list.contains('item') || list.contains('item-place')) return;
        this.setState({
            context: true,
            contextItem: parseInt(e.target.id),
            contextX: this.state.x - 25,
            contextY: this.state.y - 10
        });
    }

    mouseup(e) {
        if (this.state.context) return;
        if (e.which === 3) {
            return;
        }

        const list = e.target.classList;
        if (!list.contains('item') && !list.contains('item-place')) {
            this.setState({ held: false, heldItem: -1, hoveredItem: -1 });
            return;
        }

        this.moveItem(parseInt(this.state.heldItem), parseInt(e.target.id));
    }

    keydown(e) {
        if (this.state.context) return;
        // Shift
        if (e.keyCode === 16) {
            this.setState({ shiftModifier: true });
        }
    }

    keyup(e) {
        if (this.state.context) return;
        if (e.keyCode === 16) {
            this.setState({ shiftModifier: false });
        }
    }

    moveItem(heldIndex, dropIndex) {
        if (heldIndex <= -1 || dropIndex <= -1) {
            this.setState({ held: false, heldItem: -1 });
            return;
        }

        let inventory = [...this.state.inventory];
        let heldItem = { ...inventory[heldIndex] };
        let dropItem = { ...inventory[dropIndex] };

        dropItem = this.cleanseItem(dropItem);
        heldItem = this.cleanseItem(heldItem);

        inventory[heldIndex] = dropItem;
        inventory[dropIndex] = heldItem;
        this.setState({ held: false, heldItem: -1, inventory, hoveredItem: -1 });

        if ('alt' in window) {
            alt.emitServer('inventory:SwapItem', heldIndex, dropIndex);
        }
    }

    doubleClick(e) {
        if ('alt' in window) {
            alt.emit('inventory:Use', this.state.inventory[parseInt(e.target.id)].hash);
        } else {
            console.log('Double Clicked');
        }
    }

    shiftClick(e) {
        if ('alt' in window) {
            alt.emit('inventory:Split', this.state.inventory[parseInt(e.target.id)].hash);
        } else {
            console.log('Shift Clicked');
        }
    }

    cleanseItem(item) {
        if (item.constructor === Object && Object.keys(item).length <= 0) return null;
        return item;
    }

    renderItems() {
        const items = this.state.inventory.map((item, index) => {
            if (index >= 28) return;
            return h(this.renderItem, {
                item,
                index,
                hoveredItem: this.state.hoveredItem
            });
        });

        return h(
            'div',
            { class: 'inventory' },
            items,
            this.state.held &&
                h(this.renderItemHeld, {
                    x: this.state.x,
                    y: this.state.y,
                    item: this.state.inventory[parseInt(this.state.heldItem)]
                }),
            this.state.context &&
                h(this.contextMenu.bind(this), {
                    x: this.state.contextX,
                    y: this.state.contextY
                })
        );
    }

    useItem() {
        this.setState({ context: false });
    }

    dropItem() {
        this.setState({ context: false });
    }

    destroyItem() {
        this.setState({ context: false });
    }

    renameItem() {
        this.setState({ context: false });
    }

    contextMenu({ x, y }) {
        return h(
            'div',
            { class: 'contextMenu', style: `left: ${x}px; top: ${y}px;` },
            h(
                'button',
                { class: 'contextOption', onclick: this.useItem.bind(this) },
                'Use'
            ),
            h(
                'button',
                { class: 'contextOption', onclick: this.dropItem.bind(this) },
                'Drop'
            ),
            h(
                'button',
                { class: 'contextOption', onclick: this.destroyItem.bind(this) },
                'Destroy'
            ),
            h(
                'button',
                { class: 'contextOption', onclick: this.renameItem.bind(this) },
                'Rename'
            )
        );
    }

    renderItemHeld({ x, y, item }) {
        let icon;
        if (item && item.icon) {
            icon = icons.includes(item.icon) ? item.icon : 'unknown';
        }

        return h(
            'div',
            {
                class: 'item-held',
                style: `left: ${x}px; top: ${y}px;`
            },
            h('svg', {
                type: 'image/svg+xml',
                style: `background: url('../icons/${icon}.svg');`
            })
        );
    }

    renderItem({ index, item, hoveredItem }) {
        let icon;
        if (item && item.icon) {
            icon = icons.includes(item.icon) ? item.icon : 'unknown';
        }

        let classData = 'item';
        if (!item) {
            classData += ' item-place';
        }

        if (index === hoveredItem) {
            classData += ' item-hovered';
        }

        const newItem = h(
            'div',
            {
                class: classData,
                id: index
            },
            item &&
                h('svg', {
                    type: 'image/svg+xml',
                    style: `background: url('../icons/${icon}.svg');`
                }),
            item && h('name', {}, item.name),
            !item && 'empty'
        );
        return newItem;
    }

    render() {
        return h(this.renderItems.bind(this));
    }
}

render(h(App), document.querySelector('#render'));

document.addEventListener('contextmenu', e => {
    e.preventDefault();
});
