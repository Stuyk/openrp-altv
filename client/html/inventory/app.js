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
    'cuffs',
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
    'leaf',
    'mechanic',
    'medicine',
    'metal',
    'mining',
    'nobility',
    'notoriety',
    'outfit',
    'phone',
    'pickaxe',
    'pills',
    'planks',
    'profile',
    'rock',
    'rope',
    'seeds',
    'settings',
    'shirt',
    'smithing',
    'soda-can',
    'stats',
    'syringe',
    'trousers',
    'unknown',
    'watch',
    'weapon',
    'wood',
    'woodcutting'
];

const slots = [
    'accessory', // 0
    'hat', // 1
    'earring', // 2
    'glasses', // 3
    'bandana', // 4
    'watch', // 5
    'backpack', // 6
    'shirt', // 7
    'body-armour', // 8
    'bracelet', // 9
    'trousers', // 10
    'hand', // 11
    'outfit', // 12
    'chelsea-boot', // 13
    'unknown' // 14
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
        window.addEventListener('keyup', this.close.bind(this));

        if ('alt' in window) {
            alt.emit('inventory:FetchItems');
        }
    }

    componentDidUpdate() {
        SVGInject(document.getElementsByClassName('injectable'));
    }

    navigate(e) {
        this.setState({ tabIndex: parseInt(e.target.id) });
    }

    close(e) {
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
                this.state.tabIndex == 0 && h(Profile),
                // Stats
                this.state.tabIndex == 1 && h(Stats),
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
            inventory: new Array(128).fill(null)
        };
        this.mouseMoveEvent = this.mousemove.bind(this);
        this.hoverContextMenu = this.hoverWhileContextMenu.bind(this);
        this.addItemBind = this.addItem.bind(this);
        this.keydownBind = this.keydown.bind(this);
        this.keyupBind = this.keyup.bind(this);
        this.forceUpdateBind = this.forceUpdate.bind(this);
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('inventory:AddItem', this.addItemBind);
            alt.on('inventory:ForceUpdate', this.forceUpdateBind);
        } else {
            const items = new Array(128).fill(null);
            items[0] = {
                name: 'Taco',
                base: 'Food',
                hash: '90840921921',
                icon: 'leaf'
            };
            items[1] = {
                name: 'Fish Taco That Is Super Delicious',
                base: 'Food',
                hash: '90840921922',
                icon: 'fish'
            };
            items[2] = {
                name: 'Fishing Rod',
                base: 'Hand',
                hash: '149214',
                icon: 'fishingrod'
            };
            items[3] = {
                name: 'Refined Metal',
                base: 'metal',
                quantity: 5000,
                hash: '1492174',
                icon: 'metal'
            };

            this.setState({ inventory: items });
        }

        document.addEventListener('keydown', this.keydownBind);
        document.addEventListener('keyup', this.keyupBind);

        if ('alt' in window) {
            setTimeout(() => {
                alt.emit('inventory:FetchItems');
            }, 50);
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.keydownBind);
        document.removeEventListener('keyup', this.keyupBind);

        if ('alt' in window) {
            alt.off('inventory:AddItem', this.addItemBind);
            alt.off('inventory:ForceUpdate', this.forceUpdateBind);
        }
    }

    forceUpdate() {
        this.setState({ forceUpdate: true });
    }

    addItem(...args) {
        let inventory = [...this.state.inventory];
        const [name, index, base, hash, quantity, props, icon] = args;

        if (name) {
            inventory[index] = {
                name,
                base,
                hash,
                quantity,
                props,
                icon
            };
        } else {
            inventory[index] = null;
        }

        this.setState({ inventory });
    }

    mouseover(e) {
        this.hoverItem(e);
    }

    hoverWhileContextMenu(e) {
        const classList = e.target.classList;

        if (this.state.context && !classList.contains('contextOption')) {
            document.removeEventListener('mouseover', this.hoverContextMenu);
            this.setState({ context: false });
            return;
        } else if (this.state.context) {
            return;
        }
    }

    hoverItem(e) {
        const classList = e.target.classList;
        const id = e.target.id;

        if (!classList.contains('item')) {
            this.setState({ draggedItem: -1 });
            return;
        }

        if (this.state.held) {
            if (this.state.draggedItem === parseInt(id)) return;
            this.setState({ draggedItem: parseInt(id) });
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

        document.addEventListener('mousemove', this.mouseMoveEvent);
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

        document.addEventListener('mouseover', this.hoverContextMenu);
        this.setState({
            context: true,
            contextItem: parseInt(e.target.id),
            contextX: e.clientX - 75,
            contextY: e.clientY - 15
        });
    }

    mouseup(e) {
        if (this.state.context) return;
        if (e.which === 3) {
            return;
        }

        const list = e.target.classList;
        document.removeEventListener('mousemove', this.mouseMoveEvent);
        if (!list.contains('item') && !list.contains('item-place')) {
            document.removeEventListener('mousemove', this.mouseMoveEvent);
            this.setState({ held: false, heldItem: -1, draggedItem: -1 });
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
            document.removeEventListener('mousemove', this.mouseMoveEvent);
            this.setState({ held: false, heldItem: -1, draggedItem: -1 });
            return;
        }

        if (heldIndex === dropIndex) {
            document.removeEventListener('mousemove', this.mouseMoveEvent);
            this.setState({ held: false, heldItem: -1, draggedItem: -1 });
            return;
        }

        let inventory = [...this.state.inventory];

        if ('alt' in window) {
            alt.emit('inventory:SwapItem', heldIndex, dropIndex);
        }

        if (inventory[heldIndex] && inventory[dropIndex]) {
            const heldName = inventory[heldIndex].name;
            const dropName = inventory[dropIndex].name;

            if (heldName === dropName) {
                inventory[dropIndex].quantity += inventory[heldIndex].quantity;
                inventory[heldIndex] = null;
            }
        } else {
            inventory[heldIndex] = inventory[dropIndex];
            inventory[dropIndex] = inventory[heldIndex];
        }

        document.removeEventListener('mousemove', this.mouseMoveEvent);
        this.setState({ held: false, heldItem: -1, inventory, draggedItem: -1 });
    }

    doubleClick(e) {
        if (!e.target.id) {
            this.setState({
                held: false,
                heldItem: -1,
                draggedItem: -1
            });
            document.removeEventListener('mousemove', this.mouseMoveEvent);
            return;
        }

        document.removeEventListener('mousemove', this.mouseMoveEvent);
        let inventory = [...this.state.inventory];
        inventory[parseInt(e.target.id)] = null;

        if ('alt' in window) {
            alt.emit('inventory:Use', this.state.inventory[parseInt(e.target.id)].hash);
        } else {
            console.log('Double Clicked');
        }

        this.setState({
            held: false,
            heldItem: -1,
            draggedItem: -1,
            inventory
        });
    }

    shiftClick(e) {
        if (!this.state.inventory[parseInt(e.target.id)]) return;
        if (this.state.inventory[parseInt(e.target.id)].quantity <= 1) return;

        if ('alt' in window) {
            alt.emit('inventory:Split', this.state.inventory[parseInt(e.target.id)].hash);
        } else {
            console.log('Shift Clicked');
        }

        let inventory = [...this.state.inventory];
        inventory[parseInt(e.target.id)] = null;
        this.setState({ inventory });
    }

    cleanseItem(item) {
        if (item.constructor === Object && Object.entries(item).length <= 0) return null;
        return item;
    }

    useItem() {
        if (!this.state.inventory[this.state.contextItem]) return;

        if ('alt' in window) {
            alt.emit('inventory:Use', this.state.inventory[this.state.contextItem].hash);
        }

        let inventory = [...this.state.inventory];
        inventory[parseInt(this.state.contextItem)] = null;

        document.removeEventListener('mouseover', this.hoverContextMenu);
        this.setState({
            context: false,
            contextItem: -1,
            inventory
        });
    }

    dropItem() {
        if (!this.state.inventory[this.state.contextItem]) return;

        if ('alt' in window) {
            alt.emit('inventory:Drop', this.state.inventory[this.state.contextItem].hash);
        }

        let inventory = [...this.state.inventory];
        inventory[this.state.contextItem] = null;

        document.removeEventListener('mouseover', this.hoverContextMenu);
        this.setState({ context: false, contextItem: -1, inventory });
    }

    destroyItem() {
        if (!this.state.inventory[this.state.contextItem]) return;

        if ('alt' in window) {
            alt.emit(
                'inventory:Destroy',
                this.state.inventory[this.state.contextItem].hash
            );
        }

        let inventory = [...this.state.inventory];
        inventory[this.state.contextItem] = null;

        document.removeEventListener('mouseover', this.hoverContextMenu);
        this.setState({ context: false, contextItem: -1, inventory });
    }

    renameItem() {
        document.removeEventListener('mouseover', this.hoverContextMenu);
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

    renderItem({ index, item, draggedItem, mouseover, mousedown, mouseup, held }) {
        let icon;
        if (item && item.icon) {
            icon = icons.includes(item.icon) ? item.icon : 'unknown';
        }

        let classData = 'item';
        if (!item) {
            classData += ' item-place';
        }

        if (index === draggedItem) {
            classData += ' item-hovered';
        }

        const newItem = h(
            'div',
            {
                class: classData,
                id: index,
                onmouseover: mouseover.bind(this),
                onmouseup: mouseup.bind(this),
                onmousedown: mousedown.bind(this)
            },
            item &&
                h('svg', {
                    type: 'image/svg+xml',
                    style: `background: url('../icons/${icon}.svg');`
                }),
            item && !held && h('div', { class: 'itemname' }, item.name),
            item && held && h('div', { class: 'itemnameheld' }, item.name),
            item &&
                !held &&
                parseInt(item.quantity) >= 2 &&
                h(
                    'div',
                    { class: 'itemquantity' },
                    `${parseInt(item.quantity).toLocaleString()}`
                ),
            item &&
                held &&
                parseInt(item.quantity) >= 2 &&
                h(
                    'div',
                    { class: 'itemquantityheld' },
                    `${parseInt(item.quantity).toLocaleString()}`
                ),
            item &&
                !held &&
                h(
                    'div',
                    { class: 'tooltip' },
                    h(
                        'span',
                        { class: 'tooltiptext' },
                        h('h4', {}, item.name),
                        h('p', {}, `Base: ${item.base}`)
                    )
                ),
            !item && 'empty'
        );
        return newItem;
    }

    renderItems() {
        const items = this.state.inventory.map((item, index) => {
            if (index >= 28) return;
            return h(this.renderItem, {
                item,
                index,
                draggedItem: this.state.draggedItem,
                mouseover: this.mouseover.bind(this),
                mousedown: this.mousedown.bind(this),
                mouseup: this.mouseup.bind(this),
                held: this.state.held
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

    render() {
        return h(this.renderItems.bind(this));
    }
}

class Stats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stats: []
        };
        this.addStatBind = this.addStat.bind(this);
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('inventory:AddStat', this.addStatBind);
            alt.emit('inventory:FetchStats');
        } else {
            this.addStat('agility', 1, 55);
            this.addStat('cooking', 25, 859215);
            this.addStat('crafting', 25, 859215);
            this.addStat('mechanic', 25, 859215);
            this.addStat('notoriety', 25, 859215);
            this.addStat('nobility', 25, 859215);
            this.addStat('fishing', 25, 859215);
            this.addStat('smithing', 25, 859215);
            this.addStat('woodcutting', 25, 859215);
            this.addStat('medicine', 25, 859215);
            this.addStat('gathering', 25, 859215);
            this.addStat('mining', 25, 859215);
        }
    }

    componentWillUnmount() {
        if ('alt' in window) {
            alt.off('inventory:AddStat', this.addStatBind);
        }
    }

    addStat(...args) {
        let stats = [...this.state.stats];
        const [name, lvl, xp] = args;

        stats.push({
            name,
            lvl,
            xp
        });

        this.setState({ stats });
    }

    renderStats() {
        const stats = this.state.stats.map(stat => {
            let icon;
            if (stat) {
                icon = icons.includes(stat.name) ? stat.name : 'unknown';
            }

            const currentXP = parseInt(stat.xp);
            const xpForNextLvl = getXP(getLevel(currentXP) + 1);
            const xpDifference = xpForNextLvl - currentXP;

            return h(
                'div',
                { class: 'stat' },
                h('div', { class: 'statlvl' }, stat.lvl),
                h('div', { class: 'statname' }, stat.name),
                h('svg', {
                    type: 'image/svg+xml',
                    style: `background: url('../icons/${icon}.svg');`
                }),
                h(
                    'div',
                    { class: 'stattip' },
                    h(
                        'span',
                        { class: 'stattiptext' },
                        h(
                            'p',
                            {},
                            `${stat.xp.toLocaleString()}/${xpForNextLvl.toLocaleString()}`
                        ),
                        h('p', {}, `Diff: ${xpDifference.toLocaleString()}`)
                    )
                )
            );
        });

        return h('div', { class: 'stats' }, stats);
    }

    render() {
        return h(this.renderStats.bind(this));
    }
}

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            equipment: new Array(15).fill(null)
        };
        this.hoverContextMenu = this.hoverWhileContextMenu.bind(this);
        this.equipItemBind = this.equipItem.bind(this);
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('inventory:EquipItem', this.equipItemBind);
        } else {
            this.equipItem('Accessory', 0);
            this.equipItem('Shirt', 7);
            this.equipItem('Shoes', 13);
        }

        if ('alt' in window) {
            setTimeout(() => {
                alt.emit('inventory:FetchEquipment');
            }, 100);
        }
    }

    componentWillUnmount() {
        if ('alt' in window) {
            alt.off('inventory:EquipItem', this.equipItemBind);
        }
    }

    equipItem(...args) {
        let equipment = [...this.state.equipment];
        const [name, index, hash, icon] = args;

        if (name) {
            equipment[index] = { name, index, hash, icon };
        } else {
            equipment[index] = null;
        }

        this.setState({ equipment });
    }

    mousedown(e) {
        if (this.state.context) return;
        const list = e.target.classList;
        if (!list.contains('profileitem') || !list.contains('equipitem')) return;

        if (e.which !== 3) {
            if (Date.now() < this.state.doubleClickTime) {
                this.unequipItem();
                return;
            }

            this.setState({
                doubleClickTime: Date.now() + 200,
                contextItem: parseInt(e.target.id)
            });
            return;
        }

        document.addEventListener('mouseover', this.hoverContextMenu);
        this.setState({
            context: true,
            contextItem: parseInt(e.target.id),
            contextX: e.clientX - 75,
            contextY: e.clientY - 15
        });
    }

    hoverWhileContextMenu(e) {
        const classList = e.target.classList;

        if (this.state.context && !classList.contains('contextOption')) {
            document.removeEventListener('mouseover', this.hoverContextMenu);
            this.setState({ context: false });
            return;
        } else if (this.state.context) {
            return;
        }
    }

    unequipItem() {
        if (this.state.contextItem === null || this.state.contextItem === undefined)
            return;

        if (!this.state.equipment[parseInt(this.state.contextItem)]) return;
        document.removeEventListener('mouseover', this.hoverContextMenu);

        if ('alt' in window) {
            alt.emit(
                'inventory:UnequipItem',
                this.state.equipment[parseInt(this.state.contextItem)].hash
            );
        }

        let equipment = [...this.state.equipment];
        equipment[parseInt(this.state.contextItem)] = null;
        this.setState({ context: false, contextItem: undefined, equipment });
    }

    contextMenu({ x, y }) {
        return h(
            'div',
            { class: 'contextMenu', style: `left: ${x}px; top: ${y}px;` },
            h(
                'button',
                { class: 'contextOption', onclick: this.unequipItem.bind(this) },
                'Unequip'
            )
        );
    }

    renderProfile() {
        const equips = this.state.equipment.map((item, index) => {
            if (item) {
                const icon = icons.includes(item.icon) ? item.icon : 'unknown';

                return h(
                    'div',
                    {
                        class: 'profileitem equipitem',
                        id: index,
                        onmousedown: this.mousedown.bind(this)
                    },
                    h('svg', {
                        class: 'equipped',
                        type: 'image/svg+xml',
                        style: `background: url('../icons/${icon}.svg');`
                    }),
                    h('div', { class: 'itemname' }, item.name)
                );
            }

            return h(
                'div',
                { class: 'profileitem' },
                h('svg', {
                    type: 'image/svg+xml',
                    style: `background: url('../icons/${slots[index]}.svg');`
                })
            );
        });

        return h(
            'div',
            { class: 'profile' },
            equips,
            this.state.context &&
                h(this.contextMenu.bind(this), {
                    x: this.state.contextX,
                    y: this.state.contextY
                })
        );
    }

    render() {
        return h(this.renderProfile.bind(this));
    }
}

render(h(App), document.querySelector('#render'));

document.addEventListener('contextmenu', e => {
    e.preventDefault();
});
