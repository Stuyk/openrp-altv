const { createElement, render, Component } = preact;
const h = createElement;

const regex = new RegExp(
    '^(([A-Z][a-z]+)(([ _][A-Z][a-z]+)|([ _][A-z]+[ _][A-Z][a-z]+)))$'
);

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: false,
            roleplayname: '',
            currentYear: new Date().getFullYear(),
            errors: {
                name: false,
                dob: false
            }
        };
    }

    nameChange(e) {
        const result = regex.test(e.target.value);

        if (!result) {
            this.state.errors.name = true;
            this.setState();
            return;
        }

        this.state.errors.name = false;
        this.setState({ roleplayname: e.target.value });
    }

    dateChange(e) {
        if (!this.dateValid(e.target.value)) {
            this.state.errors.dob = true;
            this.setState();
            return;
        }

        this.state.errors.dob = false;
        this.setState({ date: e.target.value });
    }

    dateValid(date) {
        date = new Date(date);

        if (!date || isNaN(date.getTime())) return false;

        if (date.getFullYear() <= 1920) return false;

        if (date.getFullYear() > this.state.currentYear) return false;

        return true;
    }

    submit() {
        const result = regex.test(this.state.roleplayname);
        if (!result) {
            this.state.errors.name = true;
            this.setState();
            return;
        }

        if ('alt' in window) {
            alt.emit('roleplay:SetInfo', {
                name: this.state.roleplayname,
                dob: this.state.date
            });
        } else {
            console.log([this.state.roleplayname, this.state.date]);
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
            h('div', { class: 'animated flash container' }, ''), // @FIXME - Personally like it as a placeholder, lol
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
                            class: this.state.errors.name ? 'content error' : 'content',
                            id: 'name'
                        },
                        h('p', {}, 'Roleplay Name'),
                        h('input', {
                            type: 'text',
                            name: 'value',
                            placerholder: 'value',
                            oninput: this.nameChange.bind(this)
                        }),
                        h('span', {}, 'Username is not roleplay format. ie. Joe_Don')
                    )
                ),
                h(
                    'div',
                    { class: 'container' },
                    h(
                        'div',
                        {
                            class: this.state.errors.dob ? 'content error' : 'content',
                            id: 'dob'
                        },
                        h('p', {}, 'Date of Birth'),
                        h('input', {
                            type: 'date',
                            name: 'value',
                            placerholder: 'value',
                            oninput: this.dateChange.bind(this)
                        }),
                        h(
                            'span',
                            {},
                            `Date is invalid. Date must be between 1920 and ${this.state.currentYear}`
                        )
                    )
                ),
                h(
                    'div',
                    { class: 'container' },
                    !this.state.errors.name &&
                        !this.state.errors.dob &&
                        this.state.date &&
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
