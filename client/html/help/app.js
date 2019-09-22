const helpCommands = {
    TAB: 'Context menu toggle',
    I: 'Inventory',
    F: 'Enter/exit vehicle',
    H: 'Lock/Unlock vehicle',
    T: 'Toggle chat window',
    '/me <action>': 'Perform an action',
    '/b <msg>': 'Speak out of character',
    '/addveh <model_name>': 'Spawn vehicle',
    '/addcash <amount>': 'Add cash',
    '/addwep <weapon_name>': 'Spawn weapon',
    '/face': 'Customize your character',
    '/granola, /coffee': 'Spawn an item',
    '/tpto [roleplay_name]': 'Teleport to another player',
    '/players': 'List online players',
    '/taxi': 'Call a taxi service',
    '/cancel, /quitjob': 'Cancel active job',
    '/getsector': 'Get current sector',
    '/phonenumber': 'Get your phonenumber',
    '/t, /call <number>, /hangup': 'Text, Call, or Hangup',
    '/addcontact <id>': 'Add player to contacts',
    '/removecontact <id>': 'Remove player from contacts',
};

/* eslint-disable no-undef */
const { createElement, render, Component } = preact;
const h = createElement;

// The main rendering function.
class App extends Component {

    constructor(props) {
        super(props);
        this.state = { helpCommands: helpCommands };
    }
         
    createHelpItems = (helpCommands) => {
        let items = [];
        Object.keys(helpCommands).forEach(function (key) {
            items.push(
                h('div',
                    { class: 'helpItem' },
                    h('span',
                        { class: 'helpKey' },
                        key
                    ),
                    h('span',
                        { class: 'helpDesc' },
                        helpCommands[key]
                    )
                )
            );
        });

        return items;
    };

    render() {
        return h('div',
            { id: 'helpBox' },
            this.createHelpItems(this.state.helpCommands));
    }
}

render(h(App), document.querySelector('#render'));

