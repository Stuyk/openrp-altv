const { createElement, render, Component } = preact;
const h = createElement;

const regex = new RegExp(
    '^(([A-Z][a-z]+)(([ _][A-Z][a-z]+)|([ _][A-z]+[ _][A-Z][a-z]+)))$'
);

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    nameChange(e) {
        const result = regex.test(e.target.value);

        if (!result) {
            this.setState({
                feedback: 'Username is not roleplay format. ie. Joe_Don',
                usernamevalid: false,
                allvalid: false
            });
            return;
        }

        this.setState({
            roleplayname: e.target.value,
            feedback: 'Username is valid.',
            usernamevalid: true,
            allvalid: false
        });

        if (this.state.datevalid && this.state.usernamevalid) {
            this.setState({ allvalid: true });
        }
    }

    dateChange(e) {
        const currentYear = new Date().getFullYear();
        const year = new Date(e.target.value).getFullYear();
        if (year <= 1920 || year > currentYear) {
            this.setState({
                feedback: `Date is invalid. Year must be between 1920 and ${currentYear}`,
                datevalid: false,
                allvalid: false
            });
            return;
        }

        this.setState({
            date: new Date(e.target.value).getTime(),
            feedback: 'Date is valid.',
            datevalid: true,
            allvalid: false
        });

        if (this.state.datevalid && this.state.usernamevalid) {
            this.setState({ allvalid: true });
        }
    }

    submit() {
        const result = regex.test(this.state.roleplayname);
        if (!result) {
            this.setState({
                feedback: 'Username is not roleplay format. ie. Joe_Don',
                usernamevalid: false,
                allvalid: false
            });
            return;
        }

        if ('alt' in window) {
            alt.emit('roleplay:SetInfo', {
                name: this.state.roleplayname,
                dob: this.state.date
            });
        }
    }

    render() {
        return h(
            'div',
            { id: 'app' },
            h(
                'div',
                { class: 'header' },
                h('div', { class: 'logo' }, 'Set Roleplay Info')
            ),
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
                        {
                            class: 'content'
                        },
                        h('p', {}, 'Roleplay Name'),
                        h('input', {
                            type: 'text',
                            name: 'value',
                            placerholder: 'value',
                            oninput: this.nameChange.bind(this)
                        })
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
                        h('p', {}, 'Date of Birth'),
                        h('input', {
                            type: 'date',
                            name: 'value',
                            placerholder: 'value',
                            oninput: this.dateChange.bind(this)
                        })
                    )
                ),
                h(
                    'div',
                    { class: 'container' },
                    this.state.allvalid &&
                        h(
                            'div',
                            { class: 'center' },
                            h('button', { onclick: this.submit.bind(this) }, 'Submit')
                        )
                ),
                h('div', { class: 'container' })
            )
        );
    }
}

render(h(App), document.querySelector('#render'));
