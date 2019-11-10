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
                'Johnny_Ringo',
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

    renderCharacters() {
        if (this.state.characters.length <= 0) return;
        const char = this.state.characters[this.state.currentID];
        let renderData = [];

        // Character Selection
        renderData.push(
            h(
                'div',
                { class: 'character', id: this.state.currentID },
                h('div', { class: 'title' }, char.name),
                h(
                    'div',
                    { class: 'controls' },
                    h('button', { class: 'back', onclick: this.back.bind(this) }, '<'),
                    h(
                        'button',
                        { class: 'select', onclick: this.select.bind(this) },
                        'Select'
                    ),
                    h('button', { class: 'next', onclick: this.next.bind(this) }, '>')
                ),
                h(
                    'button',
                    { class: 'newcharacter', onclick: this.newcharacter.bind(this) },
                    'New Character'
                )
            )
        );

        // Skill Data
        const skills = JSON.parse(char.skills);
        const skillData = Object.keys(skills).map(key => {
            return h(
                'div',
                { class: 'skill' },
                h('div', { class: 'skill-title' }, key.toUpperCase()),
                h('div', { class: 'level' }, getLevel(skills[key].xp))
            );
        });
        renderData.push(h('div', { class: 'skills' }, skillData));
        renderData.push(h('div', { class: 'txt' }, this.state.watermark));
        return h('div', {}, renderData);
    }

    render() {
        return h(this.renderCharacters.bind(this));
        // Render HTML / Components and Shit Here
    }
}

render(h(App), document.querySelector('#render'));
