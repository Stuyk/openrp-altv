const { createElement, render, Component } = preact;
const h = createElement;

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: 'Oops. Token was not ready. Try again.',
            url: 'https://discord.gg/fc7P9eH'
        };
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('ready', this.ready.bind(this));
            setTimeout(() => {
                alt.emit('ready');
            }, 100);
        }
    }

    ready(token, url) {
        this.setState({ token, url });
    }

    copy() {
        const target = document.getElementById('copyText');
        target.select();
        target.setSelectionRange(0, 99999);
        document.execCommand('copy');
        this.setState({ copied: true });
    }

    render() {
        return h(
            'div',
            { class: 'panel' },
            h(
                'div',
                { class: 'info' },
                h('h2', { class: 'title' }, 'Discord Bot Authentication'),
                h('p', { class: 'discord' }, this.state.url),
                h(
                    'p',
                    { class: 'info-p' },
                    `Visit the above url and join the Discord. Hit the button below to copy your token.`
                ),
                h(
                    'p',
                    { class: 'info-p' },
                    'PM their O:RP BOT with !login <token> to login.'
                ),
                h('button', { onclick: this.copy.bind(this) }, 'Copy Token to Clipboard'),
                this.state.copied &&
                    h('p', { class: 'copied' }, 'Token was copied to clipboard.')
            ),
            h('textarea', {
                class: 'token',
                value: this.state.token,
                onclick: this.copy.bind(this),
                id: 'copyText'
            })
        );
    }
}

render(h(App), document.querySelector('#render'));
