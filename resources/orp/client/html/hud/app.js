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
            isInVehicle: false,
            watermark: 'O:RP - Created by Stuyk - www.github.com/stuyk'
        };
        this.contextRef = createRef();
        setInterval(this.notificationInterval.bind(this), 1000);
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
            alt.on('hud:SetWeather', this.setWeather.bind(this));

            setTimeout(() => {
                alt.emit('hud:Ready');
            }, 500);
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

            /*
            setInterval(() => {
                this.queueNotification(
                    `Message Test - ${Math.floor(Math.random() * 50)}`
                );
            }, 500);
            */

            this.setWeather('thunder');
            //this.adjustHud(true);
        }
    }

    notificationInterval() {
        if (this.state.notifications.length <= 0) return;
        let notifications = [...this.state.notifications];
        notifications.forEach((note, index) => {
            if (Date.now() > note.endTime) {
                notifications.splice(index, 1);
            }
        });

        if (notifications.length === this.state.notifications.length) return;
        this.setState({ notifications });
    }

    setWeather(name) {
        this.setState({ weather: name });
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
        notifications.push({ message: msg, endTime: Date.now() + 5000 });
        this.setState({ notifications });
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

    displayNotifications() {
        const notifications = this.state.notifications.map(note => {
            return h('div', { class: 'notification' }, note.message);
        });
        notifications.unshift(h('div', { class: 'txt' }, this.state.watermark));
        return h(
            'div',
            {
                class: 'notifications',
                style: `right: ${this.state.xOffset + 25}px !important;`
            },
            notifications
        );
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
            !this.state.watermark &&
                h('div', {
                    style:
                        'position: fixed !important; width: 100%; height: 100%; display: block !important; background: black !important; z-index: 99'
                }),
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
            this.state.weather &&
                h(
                    'div',
                    {
                        class: 'weather',
                        style: `right: ${this.state.xOffset + 25}px !important`
                    },
                    h('svg', {
                        type: 'image/svg+xml',
                        style: `background: url('../icons/${this.state.weather}.svg');`
                    })
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
            this.state.notice !== '' && h('div', { class: 'notice' }, this.state.notice),
            // Minigame Text for Jobs
            this.state.data.minigametext !== '' &&
                h('div', { class: 'minigametext' }, this.state.data.minigametext),
            // Notifications
            h(this.displayNotifications.bind(this))
        );
    }
}

render(h(App), document.querySelector('#render'));
