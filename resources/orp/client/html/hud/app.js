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
            showContext: false,
            data: {
                cash: 25,
                location: '404 Location Not Found',
                speed: '',
                sprintbar: 0.5,
                minigametext: '',
                notice: '',
                fuel: 0.8
            },
            notifications: [],
            notification: '',
            noteFade: 0.0,
            xOffset: 0,
            isInVehicle: false
        };
        this.contextRef = createRef();
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('context:SetContextPosition', this.setContextPosition.bind(this));
            alt.on('context:AppendContextItem', this.appendContextItem.bind(this));
            alt.on('context:SetContextTitle', this.setContextTitle.bind(this));
            alt.on('context:CloseContext', this.contextClose.bind(this));
            // HUD
            alt.on('hud:AdjustHud', this.adjustHud.bind(this));
            alt.on('hud:SetHudData', this.setHudData.bind(this));
            alt.on('hud:SetHudNotice', this.setHudNotice.bind(this));
            alt.on('hud:QueueNotification', this.queueNotification.bind(this));
            alt.on('hud:isInVehicle', this.isInVehicle.bind(this));
        } else {
            this.setContextPosition(0, 0);
            for (let i = 0; i < 5; i++) {
                this.appendContextItem('Test', false, 'doStuff', 'lkfejwlkfew');
            }
            this.setContextTitle('Context');
            const data = { ...this.state.data };
            data.minigametext = 'WORDS';
            data.notice = 'BIG Ol Words';
            this.setState({ data });

            this.queueNotification(
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            );
            this.queueNotification('Hello World B');
            this.queueNotification('Hello World C');
        }
    }

    adjustHud(shouldAdjust) {
        if (shouldAdjust) {
            this.setState({ xOffset: innerWidth / 3 });
        } else {
            this.setState({ xOffset: 0 });
        }
    }

    isInVehicle(isInVehicle) {
        this.setState({ isInVehicle });
    }

    queueNotification(msg) {
        const notifications = [...this.state.notifications];

        if (msg.length > 100) {
            msg = msg.slice(0, 100) + '...';
        }

        // Start a timeout if it doesn't exist.
        if (notifications.length === 0 && this.state.notification === '') {
            setTimeout(() => {
                this.parseNotification();
            }, 3500);
        }

        if (this.state.notification === '') {
            this.setState({ notifications, notification: msg });
        } else {
            notifications.push(msg);
            this.setState({ notifications });
        }
    }

    parseNotification() {
        const notifications = [...this.state.notifications];
        if (notifications.length <= 0) {
            this.setState({ notifications: [], notification: '' });
            return;
        }

        this.setState({ notification: '' });

        setTimeout(() => {
            const notification = notifications.shift();
            this.setState({ notifications, notification });
            setTimeout(() => {
                this.parseNotification();
            }, 3500);
        }, 1000);
    }

    setHudNotice(notice) {
        this.setState({ notice });

        setTimeout(() => {
            this.setState({ notice: '' });
        }, 3000); // notice lasts for 3 seconds
    }

    setHudData(key, value) {
        const data = { ...this.state.data };
        data[key] = value;
        this.setState({ data });
    }

    setContextPosition(x, y) {
        this.setState({ x, y });
    }

    setContextTitle(title) {
        this.setState({ title, showContext: true });
    }

    appendContextItem(name, isServer, eventName, hash) {
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
                { class: 'option', id: item.hash, onmousedown: this.onclick.bind(this) },
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
            this.state.showContext && h(this.displayItems.bind(this), null),
            h(
                'div',
                {
                    class: 'hudpanel',
                    style: `right: ${this.state.xOffset + 20}px !important;`
                },
                h('div', { class: 'cash' }, `$${this.state.data.cash}`),
                h('div', { class: 'location' }, `${this.state.data.location}`)
            ),
            // Fuel Bar
            this.state.isInVehicle &&
                h(
                    'div',
                    {
                        class: 'fuel',
                        style: `width: ${310 *
                            this.state.data.fuel}px !important; right: ${this.state
                            .xOffset + 15}px !important;`
                    },
                    'FUEL'
                ),
            // Sprint Bar
            !this.state.isInVehicle &&
                h(
                    'div',
                    {
                        class: 'sprintbar',
                        style: `width: ${300 *
                            this.state.data.sprintbar}px !important; right: ${this.state
                            .xOffset + 25}px !important;`
                    },
                    'SPRINT'
                ),
            // Vehicle Speed Data
            this.state.data.speed !== '' &&
                h(
                    'div',
                    {
                        class: 'speed'
                    },
                    this.state.data.speed
                ),
            // player.notice
            this.state.data.notice !== '' &&
                h('div', { class: 'notice' }, this.state.data.notice),
            // Minigame Text for Jobs
            this.state.data.minigametext !== '' &&
                h('div', { class: 'minigametext' }, this.state.data.minigametext),
            // Notifications
            h(
                'div',
                {
                    class: this.state.notification === '' ? '' : 'notification',
                    style: `right: ${this.state.xOffset + 25}px !important;`
                },
                this.state.notification
            )
        );
    }
}

render(h(App), document.querySelector('#render'));
