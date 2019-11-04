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
    'auto-repair',
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
    'jerrycan',
    'leaf',
    'mechanic',
    'medicine',
    'medical-pack',
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
    'unknown', // 12
    'chelsea-boot', // 13
    'outfit' // 14
];

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

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AirplaneMode: false,
            YandexKey: '',
            Language: 'none'
        };
        this.setOptionBind = this.setOption.bind(this);
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('option:SetOption', this.setOptionBind);
            alt.emit('option:LoadOptions');
        }
    }

    componentWillUnmount() {
        if ('alt' in window) {
            alt.off('option:SetOption', this.setOptionBind);
        }
    }

    setOption(key, value) {
        this.setState({ [key]: value });
    }

    setAirplaneMode(e) {
        this.setState({ AirplaneMode: e.target.checked });

        if ('alt' in window) {
            alt.emit('option:SetOption', 'option:AirplaneMode', e.target.checked);
        } else {
            console.log(e.target.checked);
        }
    }

    setYandexKey(e) {
        this.setState({ YandexKey: e.target.value });

        if ('alt' in window) {
            alt.emit('option:SetOption', 'option:YandexKey', this.state.YandexKey);
        } else {
            console.log(e.target.value);
        }
    }

    setPreferredLanguage(e) {
        this.setState({ Language: e.target.value });
        if ('alt' in window) {
            alt.emit('option:SetOption', 'option:Language', e.target.value);
        } else {
            console.log(e.target.value);
        }
    }

    renderOptions() {
        return h(
            'div',
            { class: 'options' },
            // Put Phone on Airplane Mode
            h(
                'div',
                { class: 'option' },
                h('div', { class: 'title' }, 'Put Phone on Airplane Mode'),
                h(
                    'div',
                    { class: 'description' },
                    'Stops all incoming and outgoing messages.'
                ),
                h('input', {
                    type: 'checkbox',
                    class: 'input',
                    checked: this.state.AirplaneMode,
                    onchange: this.setAirplaneMode.bind(this)
                })
            ),
            // Translation Service
            h(
                'div',
                { class: 'option' },
                h('div', { class: 'title' }, 'Yandex Translation API Key'),
                h(
                    'div',
                    { class: 'description' },
                    'Used to translate English text into your native language. Can be obtained here: https://translate.yandex.com/developers/keys'
                ),
                h('input', {
                    type: 'password',
                    class: 'input',
                    value: this.state.YandexKey,
                    onchange: this.setYandexKey.bind(this)
                })
            ),
            // Translation Language
            h(
                'div',
                { class: 'option' },
                h('div', { class: 'title' }, '-- Used with API Key'),
                h(
                    'div',
                    { class: 'description' },
                    'Set your preferred language. This only translates chat; not interfaces.'
                ),
                h(
                    'select',
                    {
                        value: this.state.Language,
                        oninput: this.setPreferredLanguage.bind(this)
                    },
                    h('option', { value: 'none', disabled: true }, 'Select Language'),
                    h('option', { value: 'az' }, 'Azerbaijan'),
                    h('option', { value: 'sq' }, 'Albanian'),
                    h('option', { value: 'am' }, 'Amharic'),
                    h('option', { value: 'en' }, 'English'),
                    h('option', { value: 'ar' }, 'Arabic'),
                    h('option', { value: 'hy' }, 'Armenian'),
                    h('option', { value: 'af' }, 'Afrikaans'),
                    h('option', { value: 'eu' }, 'Basque'),
                    h('option', { value: 'ba' }, 'Bashkir'),
                    h('option', { value: 'be' }, 'Belarusian'),
                    h('option', { value: 'bn' }, 'Bengali'),
                    h('option', { value: 'my' }, 'Burmese'),
                    h('option', { value: 'bg' }, 'Bulgarian'),
                    h('option', { value: 'bs' }, 'Bosnian'),
                    h('option', { value: 'cy' }, 'Welsh'),
                    h('option', { value: 'hu' }, 'Hungarian'),
                    h('option', { value: 'vi' }, 'Vietnamese'),
                    h('option', { value: 'ht' }, 'Haitan'),
                    h('option', { value: 'gl' }, 'Galician'),
                    h('option', { value: 'nl' }, 'Dutch'),
                    h('option', { value: 'mrj' }, 'Hill Mari'),
                    h('option', { value: 'el' }, 'Greek'),
                    h('option', { value: 'ka' }, 'Georgian'),
                    h('option', { value: 'gu' }, 'Gujarati'),
                    h('option', { value: 'da' }, 'Danish'),
                    h('option', { value: 'he' }, 'Hebrew'),
                    h('option', { value: 'yi' }, 'Yiddish'),
                    h('option', { value: 'id' }, 'Indonesian'),
                    h('option', { value: 'ga' }, 'Irish'),
                    h('option', { value: 'it' }, 'Italian'),
                    h('option', { value: 'is' }, 'Icelandic'),
                    h('option', { value: 'es' }, 'Spanish'),
                    h('option', { value: 'kk' }, 'Kazakh'),
                    h('option', { value: 'kn' }, 'Kannada'),
                    h('option', { value: 'ca' }, 'Katalan'),
                    h('option', { value: 'ky' }, 'Kyrgyz'),
                    h('option', { value: 'zh' }, 'Chinese'),
                    h('option', { value: 'ko' }, 'Korean'),
                    h('option', { value: 'xh' }, 'Xhosa'),
                    h('option', { value: 'km' }, 'Khmer'),
                    h('option', { value: 'lo' }, 'Laotian'),
                    h('option', { value: 'la' }, 'Latin'),
                    h('option', { value: 'lv' }, 'Lativan'),
                    h('option', { value: 'lt' }, 'Lithuanian'),
                    h('option', { value: 'lb' }, 'Luxembourgish'),
                    h('option', { value: 'mg' }, 'Malagasy'),
                    h('option', { value: 'ms' }, 'Malay'),
                    h('option', { value: 'ml' }, 'Malayalam'),
                    h('option', { value: 'mt' }, 'Maltese'),
                    h('option', { value: 'mk' }, 'Macedonian'),
                    h('option', { value: 'mi' }, 'Maori'),
                    h('option', { value: 'mr' }, 'Marathi'),
                    h('option', { value: 'mhr' }, 'Mari'),
                    h('option', { value: 'mn' }, 'Mongolian'),
                    h('option', { value: 'de' }, 'German'),
                    h('option', { value: 'ne' }, 'Nepali'),
                    h('option', { value: 'no' }, 'Norweigan'),
                    h('option', { value: 'pa' }, 'Punjabi'),
                    h('option', { value: 'pap' }, 'Papiamento'),
                    h('option', { value: 'fa' }, 'Persian'),
                    h('option', { value: 'pl' }, 'Polish'),
                    h('option', { value: 'pt' }, 'Portuguese'),
                    h('option', { value: 'ro' }, 'Romanian'),
                    h('option', { value: 'ru' }, 'Russian'),
                    h('option', { value: 'ceb' }, 'Cebuano'),
                    h('option', { value: 'sr' }, 'Serbian'),
                    h('option', { value: 'si' }, 'Sinhala'),
                    h('option', { value: 'sk' }, 'Slovakian'),
                    h('option', { value: 'sl' }, 'Slovenian'),
                    h('option', { value: 'sw' }, 'Swahili'),
                    h('option', { value: 'su' }, 'Sundanese'),
                    h('option', { value: 'tg' }, 'Tajik'),
                    h('option', { value: 'th' }, 'Thai'),
                    h('option', { value: 'tl' }, 'Tagalog'),
                    h('option', { value: 'ta' }, 'Tamil'),
                    h('option', { value: 'tt' }, 'Tatar'),
                    h('option', { value: 'te' }, 'Telugu'),
                    h('option', { value: 'tr' }, 'Turkish'),
                    h('option', { value: 'udm' }, 'Udmurt'),
                    h('option', { value: 'uz' }, 'Uzbek'),
                    h('option', { value: 'uk' }, 'Ukrainian'),
                    h('option', { value: 'ur' }, 'Urdu'),
                    h('option', { value: 'fi' }, 'Finnish'),
                    h('option', { value: 'fr' }, 'French'),
                    h('option', { value: 'hi' }, 'Hindi'),
                    h('option', { value: 'hr' }, 'Croatian'),
                    h('option', { value: 'cs' }, 'Czech'),
                    h('option', { value: 'sv' }, 'Swedish'),
                    h('option', { value: 'gd' }, 'Scottish'),
                    h('option', { value: 'et' }, 'Estonian'),
                    h('option', { value: 'eo' }, 'Esperanto'),
                    h('option', { value: 'jv' }, 'Javanese'),
                    h('option', { value: 'ja' }, 'Japanese')
                )
            )
        );
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
            return h(
                'div',
                { class: 'contact' },
                h('div', { class: 'id' }, contact.id),
                h('div', { class: 'name' }, contact.name),
                h('div', { class: 'isOnline' }, `Online? ${contact.isOnline}`),
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
                    value: this.state.contact,
                    onchange: this.contactNumber.bind(this),
                    onkeydown: this.addContactEnter.bind(this)
                }),
                h(
                    'button',
                    { class: 'addcontact', onmousedown: this.addContact.bind(this) },
                    'Add Contact'
                )
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
            inventory: new Array(128).fill(null),
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

    renderItem({ item, index }) {
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
                    h(
                        'button',
                        {
                            class: 'item-button',
                            id: index,
                            onclick: this.splitItem.bind(this)
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
        const items = this.state.inventory.map((item, index) => {
            if (index >= 28) return;
            return h(this.renderItem.bind(this), {
                item,
                index
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
