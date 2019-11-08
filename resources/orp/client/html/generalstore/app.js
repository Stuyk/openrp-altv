const { createElement, render, Component } = preact;
const h = createElement;

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        };

        this.closeBind = this.close.bind(this);
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('general:AddItem', this.addItem.bind(this));
            setTimeout(() => {
                alt.emit('general:Ready');
            }, 100);
        } else {
            for (let i = 0; i < 5; i++) {
                this.addItem({
                    key: 'gascan',
                    price: 800
                });
                this.addItem({
                    key: 'rope',
                    price: 800
                });
                this.addItem({
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

    addItem(item) {
        const items = [...this.state.items];
        items.push(item);
        this.setState({ items });
    }

    buyItem(e) {
        if (!e.target.id) return;
        const index = parseInt(e.target.id);
        const item = this.state.items[index];
        if (!item) return;

        if ('alt' in window) {
            alt.emit('general:Buy', item.key);
        } else {
            console.log(item);
        }
    }

    renderItems() {
        const items = this.state.items.map((item, index) => {
            return h(
                'div',
                { class: 'item' },
                h('div', { class: 'label' }, item.key.toUpperCase()),
                h('div', { class: 'price' }, `$${item.price}`),
                h('button', { id: index, onclick: this.buyItem.bind(this) }, 'Buy')
            );
        });

        items.unshift(
            h(
                'div',
                { class: 'labels' },
                h('div', { class: 'label' }, 'Item'),
                h('div', { class: 'label' }, 'Price'),
                h('div', { class: 'label' }, 'Options')
            )
        );
        items.unshift(h('div', { class: 'cash' }, `General Store`));

        return h('div', { class: 'items' }, items);
    }

    render() {
        return h('div', { class: 'panel' }, h(this.renderItems.bind(this)));
    }
}

render(h(App), document.querySelector('#render'));
