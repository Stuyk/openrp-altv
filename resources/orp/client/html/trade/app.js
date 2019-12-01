const { createElement, render, Component } = preact;
const h = createElement;

const itemsJSON =
    '[{"name":"Rusty Pickaxe","base":"pickaxe","key":"pickaxe1","props":{"lvl":{"skill":"mining","requirement":1,"bonus":0},"propData":{"name":"prop_tool_pickaxe","bone":57005,"x":0.1,"y":-0.1,"z":-0.02,"pitch":80,"roll":0,"yaw":170}},"quantity":1,"icon":"pickaxe","hash":"a4af643bcc5bd2fa7ff565f5856e0302506b5a7e36b306e7b90414371ba700ab"},{"name":"Rusty Hammer","base":"hammer","key":"hammer1","props":{"lvl":{"skill":"smithing","requirement":0,"bonus":0},"propData":{"name":"prop_tool_mallet","bone":57005,"x":0.1,"y":0.1,"z":0,"pitch":80,"roll":0,"yaw":180}},"quantity":1,"icon":"hammer","hash":"731e3340901667b8a35870c44ccdf1ff9a09dbeb03d857cddf0530833f14ff83"},{"name":"Rusty Axe","base":"axe","key":"axe1","props":{"lvl":{"skill":"woodcutting","requirement":0,"bonus":0},"propData":{"name":"prop_tool_fireaxe","bone":57005,"x":0.1,"y":-0.1,"z":-0.02,"pitch":80,"roll":0,"yaw":170}},"quantity":1,"icon":"axe","hash":"787c706e2dfa8d818a9071d63ec72819771bc6085310eb61d31b5c0bfd40d109"},{"name":"Rusty Fishing Rod","base":"fishingrod","key":"fishingrod1","props":{"lvl":{"skill":"fishing","requirement":0,"bonus":0},"propData":{"name":"prop_fishing_rod_01","bone":18905,"x":0.1,"y":0.05,"z":0,"pitch":80,"roll":120,"yaw":160}},"quantity":1,"icon":"fishingrod","hash":"9cabc54fcbbea356205530d1890f597b6714185e2d0f6348565dc089d4159cad"},{"name":"Shirt","base":"shirt","key":"shirt","props":{"restriction":-1,"female":[{"id":11,"value":2,"texture":2},{"id":8,"value":2,"texture":0},{"id":3,"value":2,"texture":0}],"male":[{"id":11,"value":16,"texture":0},{"id":8,"value":16,"texture":0},{"id":3,"value":0,"texture":0}]},"quantity":0,"icon":"shirt","hash":"6306c1a57cfbe36f53a98eb9eec9255b22bb44f49bd0b188f3c97fa1e3c62b57"},{"name":"Testy Shirt","base":"shirt","key":"shirt","props":{"label":"Testy Shirt","description":"Clothing Item","isProp":false,"restriction":0,"female":[{"id":11,"value":40,"texture":0},{"id":8,"value":0,"texture":0},{"id":3,"value":0,"texture":0}]},"quantity":1,"icon":"shirt","hash":"e0fe8e21328433bd7a329fbbc986d859ce44385440093e4f765496edcd1846d0"},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]';

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Someone Else
            targetName: 'Johnny_Bilgewater',
            offeredItems: [], // Target User Offered Items
            offeredCash: 0, // Target User Offered Cash
            lockedState: false,
            targetSlots: 0,
            // Me
            inventory: [],
            myCash: 0,
            myOfferedCash: 0,
            myOfferedItems: [],
            lockedIn: false
        };
        this.closeBind = this.close.bind(this);
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('trade:SetInventory', this.setInventory.bind(this));
            alt.on('trade:SetCash', this.setCash.bind(this));
            alt.on('trade:SetOfferedItems', this.setOfferedItems.bind(this));
            alt.on('trade:SetOfferedCash', this.setOfferedCash.bind(this));
            alt.on('trade:SetTargetName', this.setTargetName.bind(this));
            alt.on('trade:SetLockState', this.setLockState.bind(this));
            alt.on('trade:SetTargetSlots', this.setTargetSlots.bind(this));
            alt.on('trade:Unlock', this.unlockTrade.bind(this));
            setTimeout(() => {
                alt.emit('trade:Ready');
            }, 100);
        } else {
            this.setInventory(JSON.parse(itemsJSON));
            this.setCash(2500);
            this.setOfferedCash(25);
            this.setOfferedItems(
                JSON.parse(
                    `[{"name":"Rusty Pickaxe","base":"pickaxe","key":"pickaxe1","props":{"lvl":{"skill":"mining","requirement":1,"bonus":0},"propData":{"name":"prop_tool_pickaxe","bone":57005,"x":0.1,"y":-0.1,"z":-0.02,"pitch":80,"roll":0,"yaw":170}},"quantity":1,"icon":"pickaxe","hash":"a4af643bcc5bd2fa7ff565f5856e0302506b5a7e36b306e7b90414371ba700ab"}]`
                )
            );
            this.setTargetSlots(1);
        }

        window.addEventListener('keyup', this.closeBind);
    }

    componentDidUnmount() {
        window.removeEventListener('keyup', this.closeBind);
    }

    close(e) {
        if (e.key !== 'Escape') return;
        if ('alt' in window) {
            alt.emit('trade:Close');
        } else {
            console.log('Exiting');
        }
    }

    setTargetSlots(slots) {
        this.setState({ targetSlots: parseInt(slots) });
    }

    setTargetName(name) {
        this.setState({ targetName: name });
    }

    setLockState(lockedState) {
        this.setState({ lockedState });
    }

    unlockTrade() {
        this.setState({ lockedIn: false });
    }

    clearItems() {
        this.setState({ inventory: [] });
    }

    setOfferedItems(offeredItems) {
        this.setState({ offeredItems, lockedIn: false, lockedState: false });
    }

    setOfferedCash(offeredCash) {
        this.setState({ offeredCash, lockedIn: false, lockedState: false });
    }

    setInventory(inventory) {
        this.setState({ inventory });
    }

    setCash(value) {
        this.setState({ myCash: value, myOfferedCash: 0 });
    }

    appendItem(e) {
        const id = e.target.id;
        if (!id) return;

        const myOfferedItems = [...this.state.myOfferedItems];
        const inventory = [...this.state.inventory];

        if (this.state.targetSlots < myOfferedItems.length + 1) {
            return;
        }

        const itemIndex = inventory.findIndex(item => item && item.hash === id);
        if (itemIndex <= -1) {
            console.log('Item was not found.');
            return;
        }

        const removedItem = inventory.splice(itemIndex, 1)[0];
        myOfferedItems.push(removedItem);
        this.setState({ inventory, myOfferedItems, lockedIn: false, lockedState: false });
        if ('alt' in window) {
            alt.emit('trade:OfferItems', this.state.myOfferedItems);
        }
    }

    removeItem(e) {
        const id = e.target.id;
        if (!id) return;

        const myOfferedItems = [...this.state.myOfferedItems];
        const inventory = [...this.state.inventory];

        const itemIndex = myOfferedItems.findIndex(item => item && item.hash === id);
        if (itemIndex <= -1) {
            console.log('Item was not found.');
            return;
        }

        const removedItem = myOfferedItems.splice(itemIndex, 1)[0];
        inventory.push(removedItem);
        this.setState({ inventory, myOfferedItems, lockedIn: false, lockedState: false });
        if ('alt' in window) {
            alt.emit('trade:OfferItems', this.state.myOfferedItems);
        }
    }

    offerCash(e) {
        let value = parseInt(e.target.value);

        if (value > this.state.myCash) {
            value = this.state.myCash;
        }

        if (value <= 0) {
            value = 0;
        }

        this.setState({ myOfferedCash: value, lockedIn: false, lockedState: false });
        if ('alt' in window) {
            alt.emit('trade:OfferCash', this.state.myOfferedCash);
        }
    }

    toggleLock() {
        const newState = !this.state.lockedIn;
        this.setState({ lockedIn: newState });

        if ('alt' in window) {
            alt.emit('trade:LockState', newState);
        }
    }

    renderTradePanel() {
        const offers = this.state.myOfferedItems.map(item => {
            return h(
                'div',
                { class: 'item' },
                h('div', { class: 'itemName' }, `- ${item.quantity}x - ${item.name}`),
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
            { class: 'trade' },
            h(
                'div',
                { class: 'header' },
                h(
                    'div',
                    { class: 'text' },
                    `${this.state.targetName} (${28 -
                        this.state.targetSlots +
                        this.state.myOfferedItems.length}/28)`
                ),
                this.state.lockedState && h('div', { class: 'locked' }, 'Locked'),
                !this.state.lockedState && h('div', { class: 'unlocked' }, 'Unlocked')
            ),
            h(
                'div',
                { class: 'cashgroup' },
                h('div', { class: 'cashToMe' }, `+$${this.state.offeredCash} -> Me`),
                h('div', { class: 'cashFromMe' }, `Them <- $${this.state.myOfferedCash}`)
            ),
            offers
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

        let offeredToMe = this.state.offeredItems.map(item => {
            return h(
                'div',
                { class: 'item offered' },
                h('div', { class: 'itemName' }, `+ ${item.quantity}x - ${item.name}`)
            );
        });

        items = items.concat(offeredToMe);

        return h(
            'div',
            { class: 'items' },
            h(
                'div',
                { class: 'header' },
                h(
                    'div',
                    { class: 'text' },
                    `Inventory ( $${this.state.myCash - this.state.myOfferedCash} )`
                ),
                this.state.lockedIn &&
                    h(
                        'button',
                        { class: 'locked', onclick: this.toggleLock.bind(this) },
                        'Locked'
                    ),
                !this.state.lockedIn &&
                    h(
                        'button',
                        { class: 'unlocked', onclick: this.toggleLock.bind(this) },
                        'Unlocked'
                    )
            ),
            h('input', {
                type: 'number',
                class: 'sendCash',
                placeholder: 'Set cash value and hit enter...',
                onchange: this.offerCash.bind(this)
            }),
            items
        );
    }

    render() {
        return h(
            'div',
            { class: 'panel' },
            h(this.renderTradePanel.bind(this)),
            h(this.renderItemsPanel.bind(this))
        );
    }
}

render(h(App), document.querySelector('#render'));
