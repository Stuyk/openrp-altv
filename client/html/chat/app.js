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

let appendMessageSpecial;
let appendMessage;
let appendTask;
let setHide;
let clearTask;
let clearChatBox;

function colorify(text) {
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
        this.state = {
            messages: [
                {
                    message: `Use /help for help.`,
                    style: 'color: rgba(255, 255, 255, 1) !important;'
                },
                {
                    message: 'Z + Right-Click to Interact',
                    style: 'color: rgba(255, 255, 255, 1) !important;'
                }
            ],
            cash: `0`,
            location: '',
            task: '',
            speed: '0 MPH',
            hide: false
        };

        appendMessageSpecial = msg => {
            this.appendMessage(msg);
        };

        appendMessage = msg => {
            msg = colorify(msg);
            this.appendMessage({ message: msg });
        };

        clearChatBox = () => {
            this.clearChatBox();
        };

        appendTask = msg => {
            this.appendTask(msg);
        };

        clearTask = () => {
            this.clearTask();
        };

        setHide = value => {
            this.hide(value);
        };

        if ('alt' in window) {
            alt.on('chat:SetCash', this.setCash.bind(this));
            alt.on('chat:SetLocation', this.setLocation.bind(this));
            alt.on('chat:SetSpeed', this.setSpeed.bind(this));
        }
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

    componentDidUpdate() {
        //if (this.state.hide) return;
        //this.scrollToBottom();
    }

    scrollToBottom() {
        setTimeout(() => {
            if (this.state.hide || this.lastMessage.current === null) return;

            this.lastMessage.current.scrollIntoView({ behavior: 'smooth' });
        }, 500);
    }

    appendMessage(msg) {
        let messages = [...this.state.messages];
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
        this.setState({ hide: value });

        if (!value) {
            this.appendMessage({ message: '' });
        }
    }

    render() {
        return (
            !this.state.hide &&
            h(
                'div',
                null,
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
                            maxlength: '255'
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
            )
        );
        // Render HTML / Components and Shit Here
    }
}

const Messages = ({ messages, lastMessageRef, messagesBlockRef }) => {
    const msgs = messages.map((msgData, index) => {
        if (messages.length - 1 === index) {
            if (msgData.message.includes('<font')) {
                return h(
                    'div',
                    {
                        class: 'animated slideInLeft msg',
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
                    class: 'animated slideInLeft msg',
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
                    class: 'animated slideInLeft msg',
                    id: 'lastmsg',
                    dangerouslySetInnerHTML: { __html: msgData.message }
                },
                ''
            );
        }

        return h(
            'div',
            { class: 'animated slideInLeft msg', style: msgData.style },
            msgData.message
        );
    });

    return h('div', { id: 'messages', ref: messagesBlockRef }, msgs);
};

render(h(App), document.querySelector('#render'));

// eslint-disable-next-line no-unused-vars
function ready() {
    document.getElementById('chat-input').focus();
    document.addEventListener('keyup', e => {
        // Enter
        if (e.key === 'Enter') {
            let input = document.querySelector('#chat-input');
            if (input === undefined || input === null) return;

            input.classList.add('hidden');
            if (input.value.length <= 0) {
                alt.emit('routeMessage');
            } else {
                let result = removeTags(input.value);
                alt.emit('routeMessage', result);
            }
            input.value = '';
        }

        // Escape
        if (e.key === 'Escape') {
            let input = document.querySelector('#chat-input');
            input.classList.add('hidden');
            input.classList.remove('animated');
            input.classList.remove('fadeIn');
            input.value = '';
            alt.emit('routeMessage');
        }
    });

    const showChatInput = () => {
        document.getElementById('chat-input').classList.remove('hidden');
        document.getElementById('chat-input').focus();
    };

    if ('alt' in window) {
        alt.on('chat:ShowChatInput', showChatInput); // Show the input.
        alt.on('chat:AppendMessage', appendMessage); // Non Formatted Messages
        alt.on('chat:AppendMessageSpecial', appendMessageSpecial); // Preformated Objects
        //alt.on('appendMessageClickable'); // Soon ^tm;
        alt.on('chat:ClearChatBox', clearChatBox); // Clears the chat box.
        alt.on('chat:Hide', setHide);
        alt.on('chat:AppendTask', appendTask);
    }
}

/*
for (let i = 0; i < 25; i++) {
    appendMessage('test');
}

document.getElementById('chat-input').classList.remove('hidden');
*/
