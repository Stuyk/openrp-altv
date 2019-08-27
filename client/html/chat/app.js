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
let clearChatBox;

function colorify(text) {
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
                    message: 'Chat has loaded successfully.',
                    style: 'color: rgba(0, 150, 255, 1) !important;'
                },
                {
                    message: 'Created by Stuyk',
                    style: 'color: rgba(0, 255, 0, 0.5) !important;'
                }
            ]
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
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        setTimeout(() => {
            this.lastMessage.current.scrollIntoView({ behavior: 'smooth' });
        }, 500);
    }

    appendMessage(msg) {
        let messages = [...this.state.messages];
        messages.push(msg);
        this.setState({ messages });
    }

    clearChatBox() {
        this.setState({ messages: [] });
    }

    render() {
        return h(
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
                        class: 'animated fadeIn hidden',
                        id: 'chat-input',
                        type: 'text',
                        maxlength: '255'
                    },
                    'test'
                )
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
            input.classList.add('hidden');
            input.classList.remove('animated');
            input.classList.remove('fadeIn');
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
        alt.on('showChatInput', showChatInput); // Show the input.
        alt.on('appendMessage', appendMessage); // Non Formatted Messages
        alt.on('appendMessageSpecial', appendMessageSpecial); // Preformated Objects
        //alt.on('appendMessageClickable'); // Soon ^tm;
        alt.on('clearChatBox', clearChatBox); // Clears the chat box.
    }
}
