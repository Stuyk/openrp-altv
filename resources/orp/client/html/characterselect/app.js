const { createElement, render, Component } = preact;
const h = createElement;

//webview.on('character:Next', nextCharacter);
//webview.on('character:Select', selectCharacter);
//webview.on('character:New', newCharacter);

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentID: 0,
            characters: [],
            watermark: 'O:RP - Created by Stuyk - www.github.com/stuyk'
        };
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('character:Append', this.characterAppend.bind(this));
            setTimeout(() => {
                alt.emit('character:Ready');
            }, 500);
        } else {
            this.characterAppend(
                25,
                'Johnny_Ringo the absolute pog fucking champ',
                '{"agility":{"xp":0},"cooking":{"xp":0},"crafting":{"xp":0},"fishing":{"xp":0},"gathering":{"xp":0},"mechanic":{"xp":0},"medicine":{"xp":0},"mining":{"xp":0},"nobility":{"xp":0},"notoriety":{"xp":0},"smithing":{"xp":0},"woodcutting":{"xp":0}}'
            );
        }
    }

    characterAppend(id, name, skills) {
        const characters = [...this.state.characters];
        characters.push({
            id,
            name,
            skills
        });
        this.setState({ characters });
    }

    next() {
        const len = this.state.characters.length;
        if (this.state.currentID + 1 > len - 1) {
            this.setState({ currentID: 0 });
        } else {
            this.setState({ currentID: this.state.currentID + 1 });
        }

        if ('alt' in window) {
            alt.emit('character:Next', this.state.currentID);
        }
    }

    back() {
        const len = this.state.characters.length;
        if (this.state.currentID - 1 < 0) {
            this.setState({ currentID: len - 1 });
        } else {
            this.setState({ currentID: this.state.currentID - 1 });
        }

        if ('alt' in window) {
            alt.emit('character:Next', this.state.currentID);
        }
    }

    select() {
        if ('alt' in window) {
            alt.emit('character:Select', this.state.characters[this.state.currentID].id);
        }
    }

    newcharacter() {
        if ('alt' in window) {
            alt.emit('character:New');
        }
    }

    renderCharacter() {
        if (this.state.characters.length <= 0) return;
        const currentCharacter = this.state.characters[this.state.currentID];
        const currentSkills = JSON.parse(currentCharacter.skills);
        const renderData = [];

        renderData.unshift(
            h(
                'div',
                { class: 'character' },
                h(
                    'div',
                    { class: 'skills' },
                    Object.keys(currentSkills).map(key => {
                        return h(
                            'div',
                            { class: 'skill' },
                            h('div', { class: 'skill-title' }, key.toUpperCase()),
                            h('div', { class: 'level' }, getLevel(currentSkills[key].xp))
                        );
                    })
                ),
                h(
                    'div',
                    { class: 'controls' },
                    h('div', { class: 'control', onclick: this.back.bind(this) }, '<'),
                    h(
                        'div',
                        { class: 'control-select', onclick: this.select.bind(this) },
                        `${currentCharacter.name}`
                    ),
                    h('div', { class: 'control', onclick: this.next.bind(this) }, '>')
                ),
                h(
                    'button',
                    { class: 'char-button', onclick: this.newcharacter.bind(this) },
                    'New Character'
                )
                /*
                h(
                    'button',
                    { class: 'char-button', onclick: this.newcharacter.bind(this) },
                    'Delete Character'
                )
                */
            )
        );
        return h('div', null, renderData);
    }

    render() {
        return h(this.renderCharacter.bind(this));
        // Render HTML / Components and Shit Here
    }
}

render(h(App), document.querySelector('#render'));
