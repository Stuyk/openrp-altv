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

function colorify(text) {
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
            let insertHtml = (i != 0 ? '</font>' : '') + '<font color="#' + color + '">';
            text =
                text.slice(0, matches[i].index) +
                insertHtml +
                text.slice(matches[i].index + matches[i].found.length, text.length);
        }
    }
    return text;
}

function removeTags(html) {
    var oldHtml;
    do {
        oldHtml = html;
        html = html.replace(tagOrComment, '');
    } while (html !== oldHtml);
    return html.replace(/</g, '&lt;');
}

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.lastMessage = preact.createRef();
        this.messagesBlock = preact.createRef();
        this.chatInput = preact.createRef();
        this.page = preact.createRef();
        this.state = {
            messages: [
                {
                    message: `Hit F1 to toggle help.`,
                    style: 'color: rgba(255, 255, 255, 1) !important;'
                },
                {
                    message: 'Press TAB to use context cursor.',
                    style: 'color: rgba(255, 255, 255, 1) !important;'
                }
            ],
            cash: `0`,
            location: '',
            task: '',
            speed: '0 MPH',
            hide: false
        };
    }

    setCash(cash) {
        this.setState({ cash });
    }

    setSpeed(speed) {
        this.setState({ speed });
    }

    setLocation(location) {
        this.setState({ location });
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('chat:ShowChatInput', this.showChatInput.bind(this)); // Show the input.
            alt.on('chat:AppendMessage', this.appendMessage.bind(this)); // Non Formatted Messages
            alt.on('chat:AppendMessageSpecial', this.appendMessageSpecial.bind(this)); // Preformated Objects
            //alt.on('appendMessageClickable'); // Soon ^tm;
            alt.on('chat:ClearChatBox', this.clearChatBox.bind(this)); // Clears the chat box.
            alt.on('chat:Hide', this.hide.bind(this));
            //alt.on('chat:AppendTask', appendTask);
            alt.on('chat:SetCash', this.setCash.bind(this));
            alt.on('chat:SetLocation', this.setLocation.bind(this));
            alt.on('chat:SetSpeed', this.setSpeed.bind(this));
            alt.emit('chat:Ready');
        } else {
            setInterval(() => {
                this.appendMessage(`${Math.random() * 500000}`);
            }, 200);

            document.getElementById('chat-input').classList.remove('hidden');
        }

        this.setState({ ready: true });
        document.addEventListener('keyup', e => {
            // Enter
            if (e.key === 'Enter') {
                const input = this.chatInput.current;
                if (!input) return;

                input.classList.add('hidden');
                if (input.value.length <= 0) {
                    if ('alt' in window) {
                        alt.emit('routeMessage');
                    }
                } else {
                    let result = removeTags(input.value);
                    if ('alt' in window) {
                        alt.emit('routeMessage', result);
                    }
                }
                input.value = '';
            }

            // Escape
            if (e.key === 'Escape') {
                let input = this.chatInput.current;
                if (!input) return;
                input.classList.add('hidden');
                input.value = '';
                if ('alt' in window) {
                    alt.emit('routeMessage');
                }
            }
        });

        document.addEventListener('scroll', e => {
            console.log('scrolling');

            if (this.state.scrollTimeout) {
                clearTimeout(this.state.scrollTimeout);
            }

            if (!this.state.scrolling) {
                let timeout = setTimeout(() => {
                    this.setState({ scrolling: false, scrollTimeout: undefined });
                }, 10000);

                this.setState({ scrolling: true, scrollTimeout: timeout });
            }
        });
    }

    showChatInput() {
        this.chatInput.current.classList.remove('hidden');
        this.chatInput.current.focus();
    }

    scrollToBottom() {
        if (this.state.scrolling) return;
        if (this.state.hide || this.lastMessage.current === null) return;
        this.lastMessage.current.scrollIntoView({ behavior: 'instant' });
    }

    scrolling() {
        console.log('Reee');
    }

    appendMessage(msg) {
        let messages = [...this.state.messages];
        if (!msg) return;
        msg = colorify(msg);
        messages.push({ message: msg });

        if (messages.length >= 50) {
            messages.pop();
        }

        this.setState({ messages });
        this.scrollToBottom();
    }

    appendMessageSpecial(msg) {
        let messages = [...this.state.messages];
        if (!msg) return;
        messages.push(msg);
        this.setState({ messages });
        this.scrollToBottom();
    }

    appendTask(msg) {
        this.setState({ task: msg });
    }

    clearTask() {
        this.setState({ task: '' });
    }

    clearChatBox() {
        this.setState({ messages: [] });
    }

    hide(value) {
        this.setState({ hidden: value });
    }

    componentDidUpdate() {
        if (this.state.hidden) {
            this.page.current.classList.add('hidden');
        } else {
            this.page.current.classList.remove('hidden');
            this.scrollToBottom();
        }
    }

    render() {
        return h(
            'div',
            {
                ref: this.page
            },
            h(Messages, {
                messages: this.state.messages,
                lastMessageRef: this.lastMessage,
                messagesBlockRef: this.messagesBlock
            }),
            h(
                'div',
                { id: 'chat-input-wrapper' },
                h(
                    'input',
                    {
                        class: 'hidden',
                        id: 'chat-input',
                        type: 'text',
                        maxlength: '255',
                        ref: this.chatInput
                    },
                    'test'
                )
            ),
            h(
                'div',
                { class: 'hud' },
                h(
                    'div',
                    { class: 'element' },
                    h('div', { class: 'label money' }, `$${this.state.cash}`)
                ),
                h(
                    'div',
                    { class: 'element' },
                    h('div', { class: 'label location' }, `${this.state.location}`)
                ),
                this.state.task !== '' &&
                    h('div', { class: 'element' }, `${this.state.task}`)
            ),
            h('div', { class: 'speed' }, `${this.state.speed}`)
        );
        // Render HTML / Components and Shit Here
    }
}

const Messages = ({ messages, lastMessageRef, messagesBlockRef }) => {
    const msgs = messages.map((msgData, index) => {
        if (messages.length - 1 === index) {
            if (!msgData.message) {
                return h(
                    'div',
                    {
                        class: 'msg',
                        id: 'lastmsg',
                        ref: lastMessageRef
                    },
                    ''
                );
            }

            if (msgData.message.includes('<font')) {
                return h(
                    'div',
                    {
                        class: 'msg',
                        id: 'lastmsg',
                        ref: lastMessageRef,
                        dangerouslySetInnerHTML: { __html: msgData.message }
                    },
                    ''
                );
            }

            return h(
                'div',
                {
                    class: 'msg',
                    id: 'lastmsg',
                    ref: lastMessageRef,
                    style: msgData.style
                },
                msgData.message
            );
        }

        if (msgData.message.includes('<font')) {
            return h(
                'div',
                {
                    class: 'slideInLeft msg',
                    id: 'lastmsg',
                    dangerouslySetInnerHTML: { __html: msgData.message }
                },
                ''
            );
        }

        return h(
            'div',
            {
                class: 'msg',
                style: msgData.style
            },
            msgData.message
        );
    });

    return h('div', { id: 'messages', ref: messagesBlockRef }, msgs);
};

render(h(App), document.querySelector('#render'));
