/* eslint-disable no-undef */
const { createElement, render, Component } = preact;
const h = createElement;

const tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';
const tagOrComment = new RegExp(
    '<(?:' +
        // Comment body.
        '!--(?:(?:-*[^->])*--+|-?)' +
        // Special "raw text" elements whose content should be elided.
        '|script\\b' +
        tagBody +
        '>[\\s\\S]*?</script\\s*' +
        '|style\\b' +
        tagBody +
        '>[\\s\\S]*?</style\\s*' +
        // Regular name
        '|/?[a-z]' +
        tagBody +
        ')>',
    'gi'
);

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: new Array(15).fill({ message: ' ' }),
            hide: false,
            showingInput: false,
            inputValue: ''
        };
        this.sendInputBind = this.sendInput.bind(this);
        setInterval(this.focusInputBox.bind(this), 200);
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('chat:ShowChatInput', this.showChatInput.bind(this)); // Show the input.
            alt.on('chat:AppendMessage', this.appendMessage.bind(this)); // Non Formatted Messages
            alt.on('chat:ClearChatBox', this.clearChatBox.bind(this)); // Clears the chat box.
            alt.on('chat:Hide', this.hide.bind(this));
            alt.emit('chat:Ready');
            this.appendMessage('O:RP Framework');
            this.appendMessage('Hit F1 to toggle help menu.');
            this.appendMessage('Hold TAB to interact with objects by right-clicking.');
        } else {
            setInterval(() => {
                this.appendMessage(
                    `${Math.random() *
                        200}  Message Sed convallis libero non eleifend luctus. Etiam condimentum massa a turpis luctus, at lobortis tortor venenatis. Vestibulum euismod tempor tortor ac ultricies. Sed bibendum quam vel enim facilisis, et imperdiet quam posuere. `
                );
            }, 1000);

            this.setState({ showingInput: true });
        }

        window.addEventListener('keyup', this.sendInputBind);
    }

    componentDidUpdate() {
        this.focusInputBox();

        const bottom = document.getElementById('bottom');
        if (bottom) {
            bottom.scrollIntoView();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.sendInput);
    }

    async appendMessage(msg) {
        const messages = [...this.state.messages];
        if (!msg) return;

        msg = this.colorify(msg);
        messages.push({ message: msg });

        if (messages.length >= 15) {
            messages.shift();
        }

        this.setState({ messages });
    }

    async sendInput(e) {
        if (e.key === 'Enter') {
            const messages = [...this.state.messages];
            const msg = this.removeHtmlTags(e.target.value);

            if (msg.length >= 1 && 'alt' in window) {
                alt.emit('chat:RouteMessage', msg);
            } else {
                messages.push({ message: this.colorify(msg) });
            }

            this.setState({ inputValue: '', showingInput: false, messages });
            return;
        }

        if (e.key === 'Escape') {
            this.setState({ inputValue: '', showingInput: false });
            return;
        }

        if (e.key === 'Delete') {
            this.setState({ inputValue: '' });
            return;
        }

        e.preventDefault();
    }

    colorify(text) {
        if (!text) return text;
        if (text.length <= 0) return text;

        let matches = [];
        let m = null;
        let curPos = 0;
        do {
            m = /\{[A-Fa-f0-9]{3}\}|\{[A-Fa-f0-9]{6}\}/g.exec(text.substr(curPos));
            if (!m) break;
            matches.push({
                found: m[0],
                index: m['index'] + curPos
            });
            curPos = curPos + m['index'] + m[0].length;
        } while (m != null);
        if (matches.length > 0) {
            text += '</font>';
            for (let i = matches.length - 1; i >= 0; --i) {
                let color = matches[i].found.substring(1, matches[i].found.length - 1);
                let insertHtml =
                    (i != 0 ? '</font>' : '') + '<font color="#' + color + '">';
                text =
                    text.slice(0, matches[i].index) +
                    insertHtml +
                    text.slice(matches[i].index + matches[i].found.length, text.length);
            }
        }
        return text;
    }

    removeHtmlTags(html) {
        var oldHtml;
        do {
            oldHtml = html;
            html = html.replace(tagOrComment, '');
        } while (html !== oldHtml);
        return html.replace(/</g, '&lt;');
    }

    focusInputBox() {
        if (this.state.showingInput) {
            const element = document.getElementById('inputbox');
            if (element) {
                element.focus();
            }
        }
    }

    clearChatBox() {
        this.setState({ messages: [] });
    }

    hide(value) {
        this.setState({ hidden: value });
    }

    setInput(e) {
        if (!this.state.showingInput) return;
        if (e.target.value.length > 255) return;
        this.setState({ inputValue: e.target.value });
    }

    showChatInput() {
        this.setState({ showingInput: true, inputValue: '' });
    }

    renderInputBox() {
        return h('input', {
            type: 'text',
            value: this.state.inputValue,
            placeholder: 'Chat Message or... /command',
            class: 'input',
            maxwidth: 255,
            id: 'inputbox',
            oninput: this.setInput.bind(this)
        });
    }

    renderMessages() {
        const messages = this.state.messages.map((msgData, index) => {
            const isLast = index === this.state.messages.length - 1 ? true : false;
            if (msgData.message.includes('<font')) {
                return h('div', {
                    class: 'message',
                    dangerouslySetInnerHTML: { __html: msgData.message },
                    id: isLast ? 'bottom' : ''
                });
            }

            return h(
                'div',
                { class: 'message', id: isLast ? 'bottom' : '' },
                msgData.message
            );
        });
        return h('div', { class: 'messages' }, messages);
    }

    render() {
        return h(
            'div',
            { class: 'chatbox' },
            h(this.renderMessages.bind(this)),
            this.state.showingInput && h(this.renderInputBox.bind(this))
        );
    }
}

render(h(App), document.querySelector('#render'));
