const { createElement, render, Component } = preact;
const h = createElement;

const tabData = {
    profile: 0,
    stats: 1,
    inventory: 2,
    keys: 3,
    contact: 4,
    settings: 5
};

const icons = [
    'accessory',
    'agility',
    'almond',
    'apple',
    'asparagus',
    'auto-repair',
    'avocado',
    'axe',
    'backpack',
    'banana',
    'bandana',
    'beer',
    'beet',
    'body-armour',
    'bracelet',
    'brandy',
    'bread',
    'burger',
    'cake',
    'carrot',
    'cheese',
    'chelsea-boot',
    'cherry',
    'chocolate-bar',
    'clear',
    'clearing',
    'clouds',
    'coffee-cup',
    'contact',
    'cookie',
    'cooking',
    'corn',
    'crafting',
    'croissant',
    'cuffs',
    'donut',
    'earring',
    'extrasunny',
    'farming',
    'fish',
    'fishing',
    'fishingrod',
    'foggy',
    'garlic',
    'gathering',
    'glasses',
    'globe',
    'grain',
    'grapes',
    'hammer',
    'hand',
    'hat',
    'herbs',
    'id-card',
    'inventory',
    'jalapeno',
    'jerrycan',
    'jug',
    'keys',
    'leaf',
    'mechanic',
    'medical-pack',
    'medicine',
    'metal',
    'mining',
    'mushroom',
    'mushrooms',
    'nobility',
    'notoriety',
    'outfit',
    'overcast',
    'peach',
    'phone',
    'pickaxe',
    'pills',
    'pizza',
    'planks',
    'potato',
    'powder',
    'profile',
    'rain',
    'rock',
    'rope',
    'salt',
    'sausage',
    'seed',
    'seeds',
    'settings',
    'shirt',
    'smithing',
    'soda-can',
    'soda',
    'spice',
    'stats',
    'sugar',
    'syringe',
    'thunder',
    'tomato',
    'trousers',
    'unknown',
    'watch',
    'waterjug',
    'watermelon',
    'weapon',
    'wheat',
    'wine',
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
    'unknown', // 12
    'chelsea-boot', // 13
    'outfit' // 14
];

const skillDescriptions = {
    agility: 'Sprint for longer a longer period of time.',
    cooking: 'Cook raw food like fish at campfires and bbqs.',
    crafting: 'Craft weaponry, better tools, and more at their dedicated locations.',
    mechanic: 'Repair vehicles and gain access to repair kits.',
    fishing: 'Catch raw fish and rarer fish with a Fishing Rod.',
    smithing: 'Create refined metal for crafting tools.',
    woodcutting: 'Chop wood for unrefined wood and refine that wood.',
    medicine: 'Heal others with medical kits, and work as an EMS.',
    gathering: 'Gather unrefined plants as as kevlarium and vigorium.',
    mining: 'Mine unrefined metal from the quarries and shafts.'
};

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 2,
            tabIcons: true,
            inputIsFocused: false
        };
        this.inputIsFocused = false;
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
        window.addEventListener('keyup', this.close.bind(this));
        if ('alt' in window) {
            alt.emit('inventory:Ready');
            alt.emit('inventory:FetchItems');
        }
    }

    navigate(e) {
        this.setState({ tabIndex: parseInt(e.target.id) });
    }

    close(e) {
        if (this.inputIsFocused) return;
        if ('alt' in window) {
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
    }

    setInputFocused(e) {
        this.inputIsFocused = true;
    }

    setInputUnfocused(e) {
        this.inputIsFocused = false;
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
                this.state.tabIndex == 2 &&
                    h(Inventory, {
                        setInputFocused: this.setInputFocused.bind(this),
                        setInputUnfocused: this.setInputUnfocused.bind(this)
                    }),
                // Vehicles
                this.state.tabIndex === 3 && h(Vehicles),
                // Contacts
                this.state.tabIndex == 4 && h(Contacts),
                // Settings
                this.state.tabIndex == 5 && h(Settings)
            )
        );
    }
}

const Navigation = ({ navigate, index }) => {
    const tabs = Object.keys(tabData).map((key, currIndex) => {
        const isActive = currIndex === index ? true : false;
        return h(
            'div',
            {
                class: currIndex === index ? 'tabcon active' : 'tabcon',
                id: currIndex,
                onclick: navigate.bind(this)
            },
            h(
                'div',
                { class: 'icon-wrapper', id: currIndex },
                h('svg', {
                    type: 'image/svg+xml',
                    style: `background: url('../icons/${key}.svg');`
                })
            )
        );
    });
    return h('div', { class: 'navcon' }, tabs);
};

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: []
        };
        this.addCategoryBind = this.addCategory.bind(this);
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('option:AddCategory', this.addCategoryBind);
            setTimeout(() => {
                alt.emit('option:Ready');
            }, 500);
        } else {
            for (let i = 0; i < 50; i++) {
                this.addCategory('whatever', 'whatever', 'whatever');
            }
        }
    }

    componentWillUnmount() {
        if ('alt' in window) {
            alt.off('option:AddCategory', this.addCategoryBind);
        }
    }

    addCategory(name, value, description) {
        const categories = [...this.state.categories];
        categories.push({ name, description });
        let toggle = value === null ? true : value;
        this.setState({ categories, [name]: toggle });
    }

    updateOption(e) {
        this.setState({ [e.target.id]: e.target.checked });
        this.pushOptionUpdate(e.target.id, e.target.checked);
    }

    pushOptionUpdate(id, value) {
        if ('alt' in window) {
            alt.emit('option:SetOption', id, value);
        } else {
            console.log(`Updated: ${id} to ${value}`);
        }
    }

    renderOptions() {
        const categories = this.state.categories.map(info => {
            return h(
                'div',
                { class: 'option' },
                h('div', { class: 'title' }, info.description),
                h('input', {
                    type: 'checkbox',
                    class: 'input',
                    checked: this.state[info.name],
                    onchange: this.updateOption.bind(this),
                    id: info.name
                })
            );
        });
        return h('div', { class: 'options' }, categories);
    }

    render() {
        return h(this.renderOptions.bind(this));
    }
}

class Vehicles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vehicles: []
        };
        this.recieveVehicleBind = this.recieveVehicle.bind(this);
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('inventory:RecieveVehicle', this.recieveVehicleBind);
            alt.emit('inventory:FetchVehicles');
        } else {
            for (let i = 0; i < 50; i++) {
                this.recieveVehicle({
                    id: i,
                    guid: 3,
                    model: 'akuma',
                    position:
                        '{"x":627.7186889648438,"y":263.9736328125,"z":102.5933837890625}',
                    rotation: '{"x":0,"y":-0.25,"z":-0.09375}',
                    stats:
                        '{"appearance":"ACYEnAAAACAAAIYUAAAAMAYMypWAAAAAAAAAAAAAAAA=","damageStatus":"AA==","health":"DwAA","lockState":1,"scriptData":"wCYkADgAAAP/+AAQAAABAgA="}',
                    customization: null,
                    fuel: '100'
                });
            }
        }
    }

    componentWillUnmount() {
        if ('alt' in window) {
            alt.off('inventory:RecieveVehicle', this.recieveVehiclesBind);
        }
    }

    recieveVehicle(vehicle) {
        const vehicles = [...this.state.vehicles];
        vehicles.push(vehicle);
        this.setState({ vehicles });
    }

    locate(e) {
        const id = parseInt(e.target.id);
        if ('alt' in window) {
            alt.emit('inventory:LocateVehicle', id);
        } else {
            console.log(`Locate: ${id}`);
        }
    }

    sell(e) {
        const id = parseInt(e.target.id);
        if ('alt' in window) {
            alt.emit('inventory:SellVehicle', id);
        } else {
            console.log(`Sell: ${id}`);
        }
    }

    destroy(e) {
        const id = parseInt(e.target.id);
        if ('alt' in window) {
            alt.emit('inventory:DestroyVehicle', id);
        } else {
            console.log(`Destroy: ${id}`);
        }
    }

    renderVehicles() {
        const vehicles = this.state.vehicles.map(veh => {
            return h(
                'div',
                { class: 'vehiclerow' },
                h('div', { class: 'id' }, `ID: ${veh.id}`),
                h('div', { class: 'title' }, `Model: ${veh.model}`),
                h(
                    'button',
                    { class: 'btn', id: veh.id, onclick: this.locate.bind(this) },
                    'Locate'
                ),
                h(
                    'button',
                    { class: 'btn', id: veh.id, onclick: this.sell.bind(this) },
                    'Sell'
                ),
                h(
                    'button',
                    { class: 'btn', id: veh.id, onclick: this.destroy.bind(this) },
                    'Destroy'
                )
            );
        });
        return h('div', { class: 'vehiclelist' }, vehicles);
    }

    render() {
        return h(this.renderVehicles.bind(this));
    }
}

class Contacts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: [],
            contact: 0
        };
        this.setContactBind = this.setContact.bind(this);
        this.clearContactsBind = this.clearContacts.bind(this);
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('inventory:SetContact', this.setContactBind);
            alt.on('inventory:ClearContacts', this.clearContactsBind);
            alt.emit('inventory:FetchContacts');
        } else {
            this.setContact(1, 'Joe', true);
            this.setContact(2, 'Dane', false);
        }
    }

    componentWillUnmount() {
        if ('alt' in window) {
            alt.off('inventory:SetContact', this.setContactBind);
            alt.off('inventory:ClearContacts', this.clearContactsBind);
        }
    }

    setContact(id, name, isOnline) {
        const contacts = [...this.state.contacts];
        contacts.push({ id, name, isOnline });
        this.setState({ contacts });
    }

    contactNumber(e) {
        this.setState({ contact: parseInt(e.target.value) });
    }

    addContact() {
        if (this.state.contact <= 0) return;
        if ('alt' in window) {
            alt.emit('inventory:AddContact', parseInt(this.state.contact));
        } else {
            console.log(e.target.value);
        }
    }

    clearContacts() {
        this.setState({ contacts: [] });
    }

    addContactEnter(e) {
        if (e.key !== 'Enter') return;
        if (e.target.value <= 0) return;
        if ('alt' in window) {
            alt.emit('inventory:AddContact', parseInt(e.target.value));
        } else {
            console.log(e.target.value);
        }
    }

    deleteContact(e) {
        if ('alt' in window) {
            alt.emit('inventory:DeleteContact', parseInt(e.target.id));
        }
    }

    renderContacts() {
        const contacts = this.state.contacts.map(contact => {
            const isOn = contact.isOnline;

            return h(
                'div',
                { class: 'contact' },
                h('div', { class: 'id' }, contact.id),
                h('div', { class: 'name' }, contact.name),
                isOn &&
                    h('svg', {
                        type: 'image/svg+xml',
                        style: `background: url('../icons/globe.svg');`
                    }),
                !isOn &&
                    h('svg', {
                        type: 'image/svg+xml',
                        style: `background: url('../icons/globe.svg'); opacity: 0.2;`
                    }),
                h(
                    'button',
                    {
                        class: 'removeContact',
                        onclick: this.deleteContact.bind(this),
                        id: contact.id
                    },
                    'Delete Contact'
                )
            );
        });

        contacts.unshift(
            h(
                'div',
                { class: 'input' },
                h('input', {
                    type: 'number',
                    onchange: this.contactNumber.bind(this),
                    onkeydown: this.addContactEnter.bind(this),
                    placeholder: `Add a contact's number from '/phonenumber'`
                })
            )
        );

        return h('div', { class: 'contactlist' }, contacts);
    }

    render() {
        return h(this.renderContacts.bind(this));
    }
}

class Inventory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inventory: [],
            search: ''
        };
        this.forceUpdateBind = this.forceUpdate.bind(this);
        this.addItemBind = this.addItem.bind(this);
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
                quantity: 1,
                hash: '90840921921',
                icon: 'leaf'
            };
            items[1] = {
                name: 'Fish Taco That Is Super Delicious',
                base: 'Food',
                quantity: 1,
                hash: '90840921922',
                icon: 'fish'
            };
            items[2] = {
                name: 'Fishing Rod',
                base: 'Hand',
                quantity: 1,
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

    cleanseItem(item) {
        if (item.constructor === Object && Object.entries(item).length <= 0) return null;
        return item;
    }

    useItem(e) {
        const item = this.state.inventory[parseInt(e.target.id)];
        if (!item) return;
        if ('alt' in window) {
            alt.emit('inventory:Use', item.hash);
            this.mockRemove(parseInt(e.target.id));
        } else {
            this.mockRemove(parseInt(e.target.id));
        }
    }

    dropItem(e) {
        const item = this.state.inventory[parseInt(e.target.id)];
        if (!item) return;
        if ('alt' in window) {
            alt.emit('inventory:Drop', item.hash);
            this.mockRemove(parseInt(e.target.id));
        } else {
            this.mockRemove(parseInt(e.target.id));
        }
    }

    destroyItem(e) {
        const item = this.state.inventory[parseInt(e.target.id)];
        if (!item) return;
        if ('alt' in window) {
            alt.emit('inventory:Destroy', item.hash);
            this.mockRemove(parseInt(e.target.id));
        } else {
            this.mockRemove(parseInt(e.target.id));
        }
    }

    splitItem(e) {
        const item = this.state.inventory[parseInt(e.target.id)];
        if (!item) return;
        if ('alt' in window) {
            alt.emit('inventory:Split', item.hash);
            this.mockRemove(parseInt(e.target.id));
        } else {
            this.mockRemove(parseInt(e.target.id));
        }
    }

    mockRemove(index) {
        const items = [...this.state.inventory];
        items[index] = null;
        this.setState({ inventory: items });
    }

    renderItem({ item, index, itemCount }) {
        if (!item) return;
        if (this.state.search.length >= 2) {
            if (!item.name.includes(this.state.search)) return;
        }

        let icon;
        if (item && item.icon) {
            icon = icons.includes(item.icon) ? item.icon : 'unknown';
        }

        return h(
            'div',
            { class: 'item' },
            h(
                'div',
                { class: 'icon' },
                h('svg', {
                    type: 'image/svg+xml',
                    style: `background: url('../icons/${icon}.svg');`
                })
            ),
            h('div', { class: 'item-name' }, `${item.quantity}x - ${item.name}`),
            h(
                'div',
                { class: 'buttons' },
                h(
                    'button',
                    { class: 'item-button', id: index, onclick: this.useItem.bind(this) },
                    'Use'
                ),
                h(
                    'button',
                    {
                        class: 'item-button',
                        id: index,
                        onclick: this.dropItem.bind(this)
                    },
                    'Drop'
                ),
                h(
                    'button',
                    {
                        class: 'item-button',
                        id: index,
                        onclick: this.destroyItem.bind(this)
                    },
                    'Destroy'
                ),
                item.quantity >= 2 &&
                    itemCount <= 27 &&
                    h(
                        'button',
                        {
                            class: 'item-button',
                            id: index,
                            onclick: this.splitItem.bind(this)
                        },
                        'Split'
                    ),
                item.quantity >= 2 &&
                    itemCount >= 28 &&
                    h(
                        'button',
                        {
                            class: 'item-button disabled',
                            id: index
                        },
                        'Split'
                    ),
                item.quantity <= 1 &&
                    h('button', { class: 'item-button disabled', id: index }, 'Split')
            )
        );
    }

    onInputEvent(e) {
        this.setState({ search: e.target.value });
    }

    renderItems({ setInputFocused, setInputUnfocused }) {
        const validItems = this.state.inventory.filter(item => item);
        const items = this.state.inventory.map((item, index) => {
            if (index >= 28) return;
            return h(this.renderItem.bind(this), {
                item,
                index,
                itemCount: validItems.length
            });
        });

        items.unshift(
            h(
                'div',
                { class: 'search-wrapper' },
                h('input', {
                    class: 'search',
                    placeholder: 'Search for item...',
                    onfocusin: setInputFocused,
                    onfocusout: setInputUnfocused,
                    onchange: this.onInputEvent.bind(this),
                    value: this.state.search
                })
            )
        );

        items.unshift(
            h(
                'div',
                { class: 'item-stats-wrapper' },
                h('div', { class: 'total-items' }, `${validItems.length}/28`)
            )
        );

        return h('div', { class: 'inventory' }, items);
    }

    render(props, state) {
        return h(this.renderItems.bind(this), {
            setInputFocused: props.setInputFocused,
            setInputUnfocused: props.setInputUnfocused
        });
    }
}

class Stats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stats: []
        };
        this.addStatBind = this.addStat.bind(this);
        this.clearStatsBind = this.clearStats.bind(this);
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('inventory:AddStat', this.addStatBind);
            alt.on('inventory:ClearStats', this.clearStatsBind);
            alt.emit('inventory:FetchStats');
        } else {
            this.addStat('agility', 1, 1);
            this.addStat('cooking', 25, 859215);
            this.addStat('crafting', 25, 459215);
            this.addStat('mechanic', 25, 555215);
            this.addStat('fishing', 25, 859215);
            this.addStat('smithing', 25, 651215);
            this.addStat('woodcutting', 25, 859215);
            this.addStat('medicine', 25, 849215);
            this.addStat('gathering', 25, 859215);
            this.addStat('mining', 25, 739215);
        }
    }

    componentWillUnmount() {
        if ('alt' in window) {
            alt.off('inventory:AddStat', this.addStatBind);
            alt.off('inventory:ClearStats', this.clearStatsBind);
        }
    }

    clearStats() {
        this.setState({ stats: [] });
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
            const progress = currentXP / xpForNextLvl;
            const color = {
                r: Math.floor(Math.random() * 155) + 100,
                g: Math.floor(Math.random() * 155) + 100,
                b: Math.floor(Math.random() * 155) + 100
            };

            return h(
                'div',
                { class: 'stat' },
                h('div', { class: 'statlvl' }, stat.lvl),
                h('div', { class: 'statname' }, stat.name),
                h('div', {
                    class: 'progressbar',
                    style: `width: ${progress * 100}% !important; background: rgba(${
                        color.r
                    }, ${color.g}, ${color.b});`
                }),
                h('div', { class: 'description' }, skillDescriptions[stat.name]),
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
