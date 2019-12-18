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
            messages: [],
            redeem: 1,
            perPoint: 40
        };
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('atm:SetAvailablePoints', this.setAvailablePoints.bind(this));
            alt.on('atm:SetTotalPoints', this.setTotalPoints.bind(this));
            alt.on('atm:Message', this.message.bind(this));
            alt.on('atm:CashPerPoint', this.setCashPerPoint.bind(this));

            setTimeout(() => {
                alt.emit('atm:Ready');
            }, 200);
        } else {
            this.setAvailablePoints(0);
            this.setTotalPoints(30);
        }

        window.addEventListener('keyup', this.handleKeyPresses.bind(this));
    }

    handleKeyPresses(e) {
        if (keys.includes(e.keyCode)) {
            if ('alt' in window) {
                alt.emit('atm:Close');
            }
        }
    }

    message(message) {
        const messages = [...this.state.messages];
        messages.push({ expire: Date.now() + 2500, message });
        this.setState({ messages });
    }

    setAvailablePoints(availablePoints) {
        this.setState({ availablePoints });
    }

    setTotalPoints(totalPoints) {
        this.setState({ totalPoints });
    }

    setCashPerPoint(perPoint) {
        this.setState({ perPoint });
    }

    inputChange(e) {
        const value = e.target.value;
        this.setState({ redeem: parseInt(value) });
    }

    redeemPoints() {
        if ('alt' in window) {
            alt.emit('atm:Redeem', this.state.redeem);
        } else {
            console.log(this.state.redeem);
        }
    }

    render() {
        const pointsAvailable = this.state.availablePoints >= 1;
        return h(
            'div',
            { class: 'atmPage' },
            h('div', { class: 'title' }, 'Reward Point Exchange'),
            h(
                'p',
                {},
                `Reward points act as your paycheck. Reward points at a ratio of 1:${this.state.perPoint} may be exchanged for cash. Keep note that reward points are used for other rewards.`
            ),
            h(
                'div',
                { class: 'dataPoints' },
                h('div', { class: 'dataTitle' }, 'Available Points'),
                h('div', { class: 'dataTitle' }, 'Total Points')
            ),

            h(
                'div',
                { class: 'dataPoints' },
                h('div', { class: 'availablePoints' }, this.state.availablePoints),
                h('div', { class: 'totalPoints' }, this.state.totalPoints)
            ),
            pointsAvailable &&
                h(rangeInput, {
                    state: this.state,
                    inputChange: this.inputChange.bind(this)
                }),
            pointsAvailable &&
                h(
                    'div',
                    { class: 'redeemTitle' },
                    `Redeeming: ${this.state.redeem} Points`
                ),
            pointsAvailable &&
                h(
                    'button',
                    { class: 'redeemCash', onclick: this.redeemPoints.bind(this) },
                    `Redeem Cash: $${this.state.redeem * this.state.perPoint}`
                )
        );
    }
}

const rangeInput = ({ state, inputChange }) => {
    return h('input', {
        type: 'range',
        value: state.redeem,
        min: 1,
        max: state.availablePoints,
        oninput: inputChange.bind(this)
    });
};

render(h(App), document.querySelector('#render'));
