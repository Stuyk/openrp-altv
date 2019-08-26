/* eslint-disable no-undef */
const { createElement, render, Component } = preact;
const h = createElement;

let appendMessageSpecial;
let appendMessage;
let clearChatBox;

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.lastMessage = preact.createRef();
        this.messagesBlock = preact.createRef();
        this.state = {
            messages: [{ message: 'Chat has loaded successfully.' }]
        };

        appendMessageSpecial = msg => {
            this.appendMessage(msg);
        };

        appendMessage = msg => {
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
                h('input', { id: 'chat-input', type: 'text', maxlength: '255' }, 'test')
            )
        );
        // Render HTML / Components and Shit Here
    }
}

const Messages = ({ messages, lastMessageRef, messagesBlockRef }) => {
    const msgs = messages.map((msgData, index) => {
        if (messages.length - 1 === index) {
            return h(
                'div',
                {
                    class: 'msg',
                    id: 'lastmsg',
                    ref: lastMessageRef
                },
                msgData.message
            );
        }

        if (msgData.style !== undefined) {
            return h(
                'div',
                {
                    class: 'msg',
                    style: msgData.style
                },
                msgData.message
            );
        }

        return h('div', { class: 'msg' }, msgData.message);
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
            if (input.value.length <= 0) {
                alt.emit('routeMessage');
            } else {
                alt.emit('routeMessage', input.value);
            }
            input.value = '';
        }

        // Escape
        if (e.key === 'Escape') {
            let input = document.querySelector('#chat-input');
            input.classList.add('hidden');
            input.value = '';
            alt.emit('routeMessage');
        }
    });

    const showChatInput = () => {
        document.getElementById('chat-input').classList.remove('hidden');
        document.getElementById('chat-input').focus();
    };

    if ('alt' in window) {
        alt.on('showChatInput', showChatInput);
        alt.on('appendMessage', appendMessage);
        alt.on('appendMessageSpecial', appendMessageSpecial); // Preformated Objects
        //alt.on('appendMessageClickable'); // Soon ^tm;
        alt.on('clearChatBox', clearChatBox);
    }
}
