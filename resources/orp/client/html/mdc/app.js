const { createElement, render, Component } = preact;
const h = createElement;

const weight = {
    Murder: 1,
    Speeding: 0.1
};

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cases: []
        };
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('mdc:AddCase', this.addcase.bind(this));
        } else {
            let cases = [];

            for (let i = 0; i < 50; i++) {
                this.addcase('john', 'boe', 'Murder', 'jlkfdslk');
            }

            for (let i = 0; i < 1; i++) {
                this.addcase('john', 'boe', 'Speeding', 'jlkfdslk');
            }

            cases.sort((a, b) => {
                return weight[a.reason] - weight[b.reason];
            });

            cases.reverse();
        }

        window.addEventListener('keyup', this.close.bind(this));

        if ('alt' in window) {
            setTimeout(() => {
                alt.emit('mdc:Ready');
            }, 250);
        }
    }

    addcase(...args) {
        const [attacker, victim, reason, hash] = args;
        let cases = [...this.state.cases];
        cases.push({
            attacker,
            victim,
            reason,
            hash
        });
        this.setState({ cases });
    }

    pursue(e) {
        if ('alt' in window) {
            alt.emit('mdc:Pursue', e.target.id);
        }
    }

    turnin(e) {
        if ('alt' in window) {
            alt.emit('mdc:TurnIn', e.target.id);
        }
    }

    close(e) {
        if (e.keyCode === 27) {
            if ('alt' in window) {
                alt.emit('mdc:Close');
            } else {
                console.log('close');
            }
            return;
        }

        if ('alt' in window) {
            alt.emit('mdc:Close');
        } else {
            console.log('close');
        }
    }

    loadCases() {
        const data = this.state.cases.map(currentCase => {
            return h(
                'div',
                { class: 'case' },
                h('div', { class: 'attacker' }, currentCase.attacker),
                h('div', { class: 'victim' }, currentCase.victim),
                h('div', { class: 'reason' }, currentCase.reason),
                h(
                    'div',
                    { class: 'buttons' },
                    h(
                        'button',
                        {
                            class: 'option',
                            id: currentCase.hash,
                            onClick: this.pursue.bind(this)
                        },
                        'Pursue'
                    ),
                    h(
                        'button',
                        {
                            class: 'option',
                            id: currentCase.hash,
                            onClick: this.turnin.bind(this)
                        },
                        'Turn In'
                    )
                )
            );
        });

        data.unshift(
            h(
                'div',
                { class: 'case' },
                h('div', { class: 'header' }, 'Criminal'),
                h('div', { class: 'header' }, 'Victim'),
                h('div', { class: 'header' }, 'Reason')
            )
        );

        return h(
            'div',
            { class: 'cases' },
            data,
            h('div', { class: 'close', onClick: this.close }, 'X')
        );
    }

    render() {
        return h(this.loadCases.bind(this));
    }
}

render(h(App), document.querySelector('#render'));
