const { createElement, render, Component } = preact;
const h = createElement;

let appendData;

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.lastMessage = preact.createRef();
        this.messagesBlock = preact.createRef();
        this.state = {
            messages: []
        };

        appendData = msg => {
            this.appendMessage(msg);
        };

        for (let i = 0; i < 2; i++) {
            this.appendMessage(
                'this is a really long message and I really want you tos ee it.'
            );
        }
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

    render(props, state) {
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
                    { id: 'chat-input', type: 'text', maxlength: '255' },
                    'test'
                )
            )
        );
        // Render HTML / Components and Shit Here
    }
}

const Messages = ({ messages, lastMessageRef, messagesBlockRef }) => {
    const msgs = messages.map((msg, index) => {
        if (messages.length - 1 === index) {
            return h(
                'div',
                { class: 'msg', id: 'lastmsg', ref: lastMessageRef },
                msg
            );
        }
        return h('div', { class: 'msg' }, msg);
    });

    return h('div', { id: 'messages', ref: messagesBlockRef }, msgs);
};

render(h(App), document.querySelector('#render'));

setInterval(() => {
    appendData('Hello World! ' + Math.random(0, 999999999));
}, 250);
