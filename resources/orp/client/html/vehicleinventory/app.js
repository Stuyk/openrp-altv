const { createElement, render, Component } = preact;
const h = createElement;

const itemsJSON =
    '[{"name":"Rusty Pickaxe","base":"pickaxe","key":"pickaxe1","props":{"lvl":{"skill":"mining","requirement":1,"bonus":0},"propData":{"name":"prop_tool_pickaxe","bone":57005,"x":0.1,"y":-0.1,"z":-0.02,"pitch":80,"roll":0,"yaw":170}},"quantity":1,"icon":"pickaxe","hash":"a4af643bcc5bd2fa7ff565f5856e0302506b5a7e36b306e7b90414371ba700ab"},{"name":"Rusty Hammer","base":"hammer","key":"hammer1","props":{"lvl":{"skill":"smithing","requirement":0,"bonus":0},"propData":{"name":"prop_tool_mallet","bone":57005,"x":0.1,"y":0.1,"z":0,"pitch":80,"roll":0,"yaw":180}},"quantity":1,"icon":"hammer","hash":"731e3340901667b8a35870c44ccdf1ff9a09dbeb03d857cddf0530833f14ff83"},{"name":"Rusty Axe","base":"axe","key":"axe1","props":{"lvl":{"skill":"woodcutting","requirement":0,"bonus":0},"propData":{"name":"prop_tool_fireaxe","bone":57005,"x":0.1,"y":-0.1,"z":-0.02,"pitch":80,"roll":0,"yaw":170}},"quantity":1,"icon":"axe","hash":"787c706e2dfa8d818a9071d63ec72819771bc6085310eb61d31b5c0bfd40d109"},{"name":"Rusty Fishing Rod","base":"fishingrod","key":"fishingrod1","props":{"lvl":{"skill":"fishing","requirement":0,"bonus":0},"propData":{"name":"prop_fishing_rod_01","bone":18905,"x":0.1,"y":0.05,"z":0,"pitch":80,"roll":120,"yaw":160}},"quantity":1,"icon":"fishingrod","hash":"9cabc54fcbbea356205530d1890f597b6714185e2d0f6348565dc089d4159cad"},{"name":"Shirt","base":"shirt","key":"shirt","props":{"restriction":-1,"female":[{"id":11,"value":2,"texture":2},{"id":8,"value":2,"texture":0},{"id":3,"value":2,"texture":0}],"male":[{"id":11,"value":16,"texture":0},{"id":8,"value":16,"texture":0},{"id":3,"value":0,"texture":0}]},"quantity":0,"icon":"shirt","hash":"6306c1a57cfbe36f53a98eb9eec9255b22bb44f49bd0b188f3c97fa1e3c62b57"},{"name":"Testy Shirt","base":"shirt","key":"shirt","props":{"label":"Testy Shirt","description":"Clothing Item","isProp":false,"restriction":0,"female":[{"id":11,"value":40,"texture":0},{"id":8,"value":0,"texture":0},{"id":3,"value":0,"texture":0}]},"quantity":1,"icon":"shirt","hash":"e0fe8e21328433bd7a329fbbc986d859ce44385440093e4f765496edcd1846d0"},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]';

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vehicleInventory: [],
            inventory: []
        };
        this.closeBind = this.close.bind(this);
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('vehinv:SyncInventory', this.setVehicleInventory.bind(this));
            alt.on('vehinv:SetInventory', this.setInventory.bind(this));
            setTimeout(() => {
                alt.emit('vehinv:Ready');
            }, 100);
        } else {
            this.setInventory(JSON.parse(itemsJSON));
        }

        window.addEventListener('keyup', this.closeBind);
    }

    componentDidUnmount() {
        window.removeEventListener('keyup', this.closeBind);
    }

    close(e) {
        if (e.key !== 'Escape') return;
        if ('alt' in window) {
            alt.emit('vehinv:Close');
        } else {
            console.log('Exiting');
        }
    }

    setInventory(inventory) {
        this.setState({ inventory });
    }

    setVehicleInventory(vehicleInventory) {
        this.setState({ vehicleInventory });
    }

    appendItem(e) {
        const hash = e.target.id;
        const inventory = [...this.state.inventory];
        const index = inventory.findIndex(item => item && item.hash === hash);
        if (index <= -1) {
            return;
        }

        const duplicate = { ...this.state.inventory[index] };
        const vehicleInventory = [...this.state.vehicleInventory];
        vehicleInventory.push(duplicate);
        inventory.splice(index, 1);
        this.setState({ inventory, vehicleInventory });

        if ('alt' in window) {
            alt.emit('vehinv:AddItem', hash);
        }
    }

    removeItem(e) {
        const hash = e.target.id;
        const vehicleInventory = [...this.state.vehicleInventory];
        const index = vehicleInventory.findIndex(item => item && item.hash === hash);
        if (index <= -1) {
            return;
        }

        const duplicate = { ...vehicleInventory[index] };
        const inventory = [...this.state.inventory];

        inventory.push(duplicate);
        vehicleInventory.splice(index, 1);
        this.setState({ vehicleInventory, inventory });

        if ('alt' in window) {
            alt.emit('vehinv:SubItem', hash);
        }
    }

    renderVehiclePanel() {
        const filteredItems = this.state.vehicleInventory.filter(item => item);
        let items = filteredItems.map(item => {
            return h(
                'div',
                { class: 'item' },
                h('div', { class: 'itemName' }, `${item.quantity}x - ${item.name}`),
                h(
                    'button',
                    {
                        class: 'removeItem',
                        id: item.hash,
                        onclick: this.removeItem.bind(this)
                    },
                    '>'
                )
            );
        });
        return h(
            'div',
            { class: 'vehicle' },
            h('div', { class: 'header' }, 'Vehicle'),
            items
        );
    }

    renderItemsPanel() {
        const filteredItems = this.state.inventory.filter(item => item);
        let items = filteredItems.map(item => {
            return h(
                'div',
                { class: 'item' },
                h(
                    'button',
                    {
                        class: 'addItem',
                        id: item.hash,
                        onclick: this.appendItem.bind(this)
                    },
                    '<'
                ),
                h('div', { class: 'itemName' }, `${item.quantity}x - ${item.name}`)
            );
        });

        return h(
            'div',
            { class: 'items' },
            h('div', { class: 'header' }, 'My Inventory'),
            items
        );
    }

    render() {
        return h(
            'div',
            { class: 'panel' },
            h(this.renderVehiclePanel.bind(this)),
            h(this.renderItemsPanel.bind(this))
        );
    }
}

render(h(App), document.querySelector('#render'));
