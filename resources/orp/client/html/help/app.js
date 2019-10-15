const helpCommands = {
    'TAB': 'Context menu toggle',
    'I': 'Inventory',
    'F': 'Enter/exit vehicle',
    'Shift + H': 'Lock/Unlock Vehicle (Must enter vehicle once)',
    'Shift + G': 'Start/Stop Engine',
    'Shift + F': 'Keep Engine Running',
    'Shift + F7': 'Toggle Chat',
    'T': 'Toggle chat window',
    '/me <action>': 'Perform an action',
    '/b <msg>': 'Speak out of character',
    '/players': 'List online players',
    '/taxi': 'Call a taxi service',
    '/cancel, /quitjob': 'Cancel active job',
    '/getsector': 'Get current sector',
    '/phonenumber': 'Get your phonenumber',
    '/t, /call <number>, /hangup': 'Text, Call, or Hangup',
    '/addcontact <id>': 'Add player to contacts',
    '/removecontact <id>': 'Remove player from contacts',
    '/additem <key> <quantity>': 'Add an item your inventory.',
    '/sf': 'Succeed or Fail (Used to Randomize RP)',
    '/d20': 'Roll a d20 Dice (Used to Randomize RP)',
    '/flipcoin': 'Flip a Coin (Used to Randomize RP)'
};

/* eslint-disable no-undef */
const { createElement, render, Component } = preact;
const h = createElement;

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.page = preact.createRef();
        this.state = { helpCommands: helpCommands };
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('help:Toggle', this.toggle.bind(this));
        }
    }

    toggle(value) {
        this.setState({ display: value });
    }

    componentDidUpdate() {
        if (this.state.display) {
            this.page.current.classList.remove('hidden');
        } else {
            this.page.current.classList.add('hidden');
        }
    }

    createHelpItems(helpCommands) {
        let items = [];
        Object.keys(helpCommands).forEach(function(key) {
            items.push(
                h(
                    'div',
                    { class: 'helpItem' },
                    h('span', { class: 'helpKey' }, key),
                    h('span', { class: 'helpDesc' }, helpCommands[key])
                )
            );
        });

        return items;
    }

    render() {
        return h(
            'div',
            {
                ref: this.page,
                id: 'helpBox'
            },
            this.createHelpItems(this.state.helpCommands)
        );
    }
}

render(h(App), document.querySelector('#render'));
