const { createElement, render, Component } = preact;
const h = createElement;

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feedback: 'Welcome, deposit or withdraw.',
            cash: 0,
            bank: 0
        };
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
                            placerholder: 'value'
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
                        h('button', {}, 'Withdraw'),
                        h('button', {}, 'Deposit')
                    )
                )
            )
        );
    }
}

render(h(App), document.querySelector('#render'));
