const { createElement, render, Component } = preact;
const h = createElement;

const keys = [
    'W'.charCodeAt(0),
    'A'.charCodeAt(0),
    'S'.charCodeAt(0),
    'D'.charCodeAt(0),
    27
];

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feedback: 'Welcome, deposit or withdraw.',
            cash: 0,
            bank: 0,
            ready: false,
            amount: 0
        };
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('setBank', this.setBankBalance.bind(this));
            alt.on('setCash', this.setCashBalance.bind(this));
            alt.on('showSuccess', this.showSuccess.bind(this));
        }

        window.addEventListener('keyup', e => {
            if (keys.includes(e.keyCode)) {
                if ('alt' in window) {
                    alt.emit('close');
                }
            }
        });
    }

    setBankBalance(bank) {
        console.log(bank);
        this.setState({ bank });
    }

    setCashBalance(cash) {
        console.log(cash);
        this.setState({ cash });
    }

    showSuccess(feedback) {
        this.setState({ feedback });
    }

    amountChange(e) {
        let amount = e.target.value * 1;

        if (amount > 800000) {
            this.setState({
                feedback: `Cannot move more than $800,000 at a time.`,
                ready: false
            });
            return;
        }

        if (amount < 0) {
            this.setState({ feedback: `${amount} must be positive.`, ready: false });
            return;
        }

        this.setState({ ready: true, amount });
    }

    deposit() {
        if (!this.state.ready) {
            this.setState({ feedback: `Conditions for deposit not met.` });
            return;
        }

        if (this.state.cash < this.state.amount) {
            this.setState({ feedback: `You don't have that much cash to deposit.` });
            return;
        }

        const amount = Math.abs(this.state.amount);
        if ('alt' in window) {
            alt.emit('atm:Deposit', amount);
        }
    }

    withdraw() {
        if (!this.state.ready) {
            this.setState({ feedback: `Conditions for withdraw not met.` });
            return;
        }

        if (this.state.bank < this.state.amount) {
            this.setState({ feedback: `You don't have that much cash to withdraw.` });
            return;
        }

        const amount = Math.abs(this.state.amount);
        if ('alt' in window) {
            alt.emit('atm:Withdraw', amount);
        }
    }

    render() {
        return h(
            'div',
            { id: 'app' },
            h('div', { class: 'header' }, h('div', { class: 'logo' }, 'Bank')),
            h(
                'div',
                { class: 'animated flash container' },
                h('p', { class: 'center-feedback', id: 'feedback' }, this.state.feedback)
            ),
            h(
                'div',
                {
                    ref: this.wrapper,
                    class: 'innerwrapper'
                },
                h(
                    'div',
                    { class: 'container' },
                    h(
                        'div',
                        { class: 'center-p' },
                        h('p', {}, `Cash: $${this.state.cash}`),
                        h('p', {}, `Bank: $${this.state.bank}`)
                    )
                ),
                h(
                    'div',
                    { class: 'container' },
                    h(
                        'div',
                        {
                            class: 'content'
                        },
                        h('p', {}, 'Amount'),
                        h('input', {
                            type: 'number',
                            name: 'value',
                            min: 1,
                            max: 150000,
                            placerholder: 'value',
                            oninput: this.amountChange.bind(this)
                        })
                    )
                ),
                h('div', { class: 'container' }),
                h(
                    'div',
                    { class: 'container' },
                    h(
                        'div',
                        { class: 'center' },
                        h('button', { onclick: this.withdraw.bind(this) }, 'Withdraw'),
                        h('button', { onclick: this.deposit.bind(this) }, 'Deposit')
                    )
                )
            )
        );
    }
}

render(h(App), document.querySelector('#render'));

function ready() {
    if ('alt' in window) {
        alt.emit('atm:Ready');
    }
}
