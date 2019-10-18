const { createElement, render, Component, createRef } = preact;
const h = createElement;

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            items: [],
            x: 0,
            y: 0,
            showContext: false
        };
        this.contextRef = createRef();
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('context:SetContextPosition', this.setContextPosition.bind(this));
            alt.on('context:AppendContextItem', this.appendContextItem.bind(this));
            alt.on('context:SetContextTitle', this.setContextTitle.bind(this));
            alt.on('context:CloseContext', this.contextClose.bind(this));
        } else {
            this.setContextPosition(500, 500);
            for (let i = 0; i < 5; i++) {
                this.appendContextItem('Test', false, 'doStuff', 'lkfejwlkfew');
            }
            this.setContextTitle('Context');
        }
    }

    setContextPosition(...args) {
        const [x, y] = args;
        this.setState({ x, y });
    }

    setContextTitle(...args) {
        const [title] = args;
        this.setState({ title, showContext: true });
    }

    appendContextItem(...args) {
        const [name, isServer, eventName, hash] = args;
        const items = [...this.state.items];
        items.push({
            name,
            isServer,
            eventName,
            hash
        });
        this.setState({ items });
    }

    contextClose() {
        this.setState({ showContext: false, items: [] });
    }

    onclick(e) {
        if (!e.target.id) return;
        const item = this.state.items.find(x => x.hash === e.target.id);
        if (!item) return;
        if ('alt' in window) {
            alt.emit('context:Click', item.isServer, item.eventName, item.hash);
            this.setState({ showContext: false, items: [] });
        } else {
            console.log(item);
        }
    }

    displayItems() {
        const contextItems = this.state.items.map(item => {
            return h(
                'div',
                { class: 'option', id: item.hash, onclick: this.onclick.bind(this) },
                item.name
            );
        });

        contextItems.unshift(h('div', { class: 'title' }, this.state.title));

        // Handles off-screen menus.
        const totalHeight = contextItems.length * 30;
        const y =
            this.state.y + totalHeight > window.innerHeight
                ? window.innerHeight - totalHeight - 10
                : this.state.y;
        const x =
            this.state.x + 220 > window.innerWidth
                ? window.innerWidth - 220
                : this.state.x;

        const context = h(
            'div',
            {
                class: 'context-menu',
                style: `left: ${x}px; top: ${y}px;`
            },
            contextItems
        );
        return context;
    }

    render() {
        return h(
            'div',
            { class: 'hud' },
            this.state.showContext && h(this.displayItems.bind(this))
        );
    }
}

render(h(App), document.querySelector('#render'));
