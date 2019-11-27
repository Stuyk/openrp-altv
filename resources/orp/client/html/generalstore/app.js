const { createElement, render, Component } = preact;
const h = createElement;

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            cash: 1000
        };
        this.closeBind = this.close.bind(this);
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('general:AddItem', this.addItem.bind(this));
            alt.on('general:SetCash', this.setCash.bind(this));
            setTimeout(() => {
                alt.emit('general:Ready');
            }, 100);
        } else {
            for (let i = 0; i < 5; i++) {
                this.addItem({
                    name: 'Gascan',
                    key: 'gascan',
                    price: 200
                });
                this.addItem({
                    name: 'Rope',
                    key: 'rope',
                    price: 800
                });
                this.addItem({
                    name: 'Medkit',
                    key: 'medkit',
                    price: 800
                });
            }
        }

        window.addEventListener('keyup', this.closeBind);
    }

    componentDidUnmount() {
        window.removeEventListener('keyup', this.closeBind);
    }

    close(e) {
        if (e.key !== 'Escape') return;
        if ('alt' in window) {
            alt.emit('general:Close');
        } else {
            console.log('Exiting');
        }
    }

    setCash(cash) {
        this.setState({ cash });
    }

    addItem(item) {
        const items = [...this.state.items];
        items.push(item);
        this.setState({ items });
    }

    buyItem(e, amount = 1) {
        if (!e.target.id) return;
        const index = parseInt(e.target.id);
        const item = this.state.items[index];
        if (!item) return;

        if ('alt' in window) {
            alt.emit('general:Buy', item.key, amount);
        } else {
            console.log(item);
        }
    }

    buyItemMultiple(e) {
        this.buyItem(e, 5);
    }

    renderItems() {
        const items = this.state.items.map((item, index) => {
            const enoughCash = this.state.cash >= item.price ? true : false;
            const enoughForMultiple = this.state.cash >= item.price * 5 ? true : false;

            return h(
                'div',
                { class: 'item' },
                h('div', { class: enoughCash ? 'label' : 'label disabled' }, item.name),
                h(
                    'div',
                    { class: enoughCash ? 'price' : 'price disabled' },
                    `$${item.price}`
                ),
                enoughCash &&
                    h('button', { id: index, onclick: this.buyItem.bind(this) }, '1x'),
                enoughForMultiple &&
                    h(
                        'button',
                        { id: index, onclick: this.buyItemMultiple.bind(this) },
                        '5x'
                    ),
                !enoughCash && h('button', { class: 'disabled', id: index }, '1x'),
                !enoughForMultiple && h('button', { class: 'disabled', id: index }, '5x')
            );
        });

        return h('div', { class: 'items' }, items);
    }

    render() {
        return h('div', { class: 'panel' }, h(this.renderItems.bind(this)));
    }
}

render(h(App), document.querySelector('#render'));
