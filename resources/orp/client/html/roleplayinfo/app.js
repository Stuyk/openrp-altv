const { createElement, render, Component } = preact;
const h = createElement;

const regex = new RegExp('^([A-Z]?|[A-Z][a-z]*)$');

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstNames: [],
            lastNames: [],
            firstFilter: '',
            lastFilter: '',
            firstName: '',
            lastName: ''
        };
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.emit('roleplay:Ready');
        }
    }

    setFirstName(e) {
        const firstName = e.target.value;
        const nameCapitalized = firstName.charAt(0).toUpperCase() + firstName.slice(1);

        if (!regex.test(nameCapitalized) || nameCapitalized.length > 12) {
            this.setState({ firstName: this.state.firstName });
            return;
        }

        this.setState({ firstName: nameCapitalized });
    }

    setLastName(e) {
        const lastName = e.target.value;
        const nameCapitalized = lastName.charAt(0).toUpperCase() + lastName.slice(1);

        if (!regex.test(nameCapitalized) || nameCapitalized.length > 12) {
            this.setState({ lastName: this.state.lastName });
            return;
        }

        this.setState({ lastName: nameCapitalized });
    }

    submit() {
        const name = `${this.state.firstName}_${this.state.lastName}`;
        if ('alt' in window) {
            alt.emit('roleplay:SetInfo', name);
        } else {
            console.log(name);
        }
    }

    render() {
        const firstName = this.state.firstName === '' ? 'Select' : this.state.firstName;
        const lastName = this.state.lastName === '' ? 'Name' : this.state.lastName;
        let allValid = firstName.length >= 2 && lastName.length >= 2 ? true : false;
        allValid = firstName !== 'Select' && lastName !== 'Name' ? true : false;

        return h(
            'div',
            { id: 'app' },
            h(
                'div',
                { class: 'wrapper' },
                h(
                    'div',
                    { class: 'current-name' },
                    h('p', {}, `${firstName}_${lastName}`),
                    h('input', {
                        type: 'text',
                        oninput: this.setFirstName.bind(this),
                        value: this.state.firstName,
                        placeholder: 'First Name'
                    }),
                    h('input', {
                        type: 'text',
                        oninput: this.setLastName.bind(this),
                        value: this.state.lastName,
                        placeholder: 'Last Name'
                    }),
                    allValid &&
                        h(
                            'button',
                            { class: 'submit', onclick: this.submit.bind(this) },
                            'Set Roleplay Name'
                        )
                )
            )
        );
    }
}

render(h(App), document.querySelector('#render'));
