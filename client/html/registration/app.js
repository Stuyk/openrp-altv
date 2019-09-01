const { createElement, render, Component } = preact;
const h = createElement;

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            register: 0,
            fadeOut: 0,
            feedback: 'Welcome Home',
            username: '',
            password1: '',
            password2: '',
            valid: false,
            isWaiting: false
        };

        this.wrapper = preact.createRef();
        this.username = preact.createRef();
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('error', errorName => {
                this.updateFeedback(errorName);
                this.setState({ isWaiting: false });
            });

            alt.on('success', successMessage => {
                this.updateFeedback(successMessage);
            });

            alt.on('setUsername', username => {
                this.setState({ username });
                setTimeout(() => {
                    this.username.current.value = this.state.username;
                }, 500);
            });

            alt.on('goToLogin', () => {
                this.setState({ register: 0, isWaiting: false });
            });
        }

        setTimeout(() => {
            if ('alt' in window) {
                alt.emit('ready');
            }
            this.username.current.focus();
        }, 500);
    }

    updateFeedback(msg) {
        this.setState({ feedback: msg });
    }

    validData(e) {
        if (e.target.id === 'username') {
            this.setState({ username: e.target.value });
        }

        if (e.target.id === 'password1') {
            this.setState({ password1: e.target.value });
        }

        if (e.target.id === 'password2') {
            this.setState({ password2: e.target.value });
        }

        if (this.state.username.length <= 5) {
            this.setState({
                feedback: 'Username must be greater than 5 characters.',
                valid: false
            });

            return;
        }

        if (this.state.password1.length <= 5) {
            this.setState({
                feedback: 'Password must be greater than 5 characters.',
                valid: false
            });
            return;
        }

        if (this.state.register === 1 && this.state.password1 !== this.state.password2) {
            this.setState({ feedback: 'Passwords do not match.', valid: false });
            return;
        }

        if (this.state.username.length >= 6 && this.state.password1.length >= 6) {
            this.setState({ valid: true });
        } else {
            this.setState({ valid: false });
        }

        this.setState({ feedback: 'Ready to go!' });
    }

    setRegister() {
        this.setState({ fadeOut: 1 });

        setTimeout(() => {
            this.setState({ register: 1, fadeOut: 0 });
        }, 1000);
    }

    setLogin() {
        this.setState({ fadeOut: 1 });

        setTimeout(() => {
            this.setState({ register: 0, fadeOut: 0 });
        }, 1000);
    }

    submitData() {
        this.setState({ isWaiting: true });

        if ('alt' in window) {
            if (this.state.register === 1) {
                alt.emit('registerAccount', this.state.username, this.state.password1);
            } else {
                alt.emit(
                    'existingAccount',
                    this.state.username,
                    this.state.password1,
                    true
                );
            }
        }
    }

    render() {
        return h(
            'div',
            {
                id: 'app',
                class: this.state.isWaiting
                    ? 'none animated fadeOut faster'
                    : 'regular animated fadeIn faster'
            },
            h(
                'div',
                { class: 'container' },
                h('div', { class: 'center' }, h('div', { class: 'logo' }, 'Open:RP'))
            ),
            h(
                'div',
                { class: 'animated flash container' },
                h('p', { class: 'center', id: 'feedback' }, this.state.feedback)
            ),
            h(
                'div',
                {
                    ref: this.wrapper,
                    class: this.state.fadeOut
                        ? 'animated fadeOut innerwrapper'
                        : 'animated fadeIn innerwrapper'
                },
                // New Account?
                this.state.register === 0 &&
                    h(
                        'div',
                        { class: 'container' },
                        h(
                            'div',
                            { class: 'right' },
                            h(
                                'button',
                                { onclick: this.setRegister.bind(this) },
                                'New Account >'
                            )
                        )
                    ),
                this.state.register === 1 &&
                    h(
                        'div',
                        { class: 'container' },
                        h(
                            'div',
                            { class: 'right' },
                            h(
                                'button',
                                { onclick: this.setLogin.bind(this) },
                                'Existing Account >'
                            )
                        )
                    ),

                // Login
                h(
                    'div',
                    { class: 'container' },
                    h(
                        'div',
                        {
                            class: 'content'
                        },
                        h('p', {}, 'Login'),
                        h('input', {
                            type: 'text',
                            name: 'username',
                            placeholder: 'username',
                            autocomplete: 'off',
                            oninput: this.validData.bind(this),
                            id: 'username',
                            ref: this.username,
                            class: this.state.username.length >= 6 ? 'green' : 'red'
                        })
                    )
                ),
                // Password
                h(
                    'div',
                    { class: 'container' },
                    h(
                        'div',
                        {
                            class: 'content'
                        },
                        h('p', {}, 'Pass'),
                        h('input', {
                            type: 'password',
                            name: 'password',
                            placeholder: 'password',
                            oninput: this.validData.bind(this),
                            id: 'password1',
                            class:
                                (this.state.register &&
                                    (this.state.password1.length >= 6 &&
                                        this.state.password2.length >= 6 &&
                                        this.state.password1 === this.state.password2)) ||
                                (!this.state.register && this.state.password1.length >= 6)
                                    ? 'green'
                                    : 'red'
                        })
                    )
                ),
                this.state.register === 1
                    ? h(
                          'div',
                          {
                              class: 'container'
                          },
                          h(
                              'div',
                              { class: 'content' },
                              h('p', {}, ''),
                              h('input', {
                                  type: 'password',
                                  name: 'password',
                                  placeholder: 'password confirmation',
                                  oninput: this.validData.bind(this),
                                  id: 'password2',
                                  class:
                                      this.state.register &&
                                      (this.state.password1.length >= 6 &&
                                          this.state.password2.length >= 6 &&
                                          this.state.password1 === this.state.password2)
                                          ? 'green'
                                          : 'red'
                              })
                          )
                      )
                    : h('div', { class: 'container' }),
                h(
                    'div',
                    {
                        class: 'container'
                    },
                    h(
                        'div',
                        { class: 'center' },
                        h(
                            'div',
                            { class: 'content' },
                            h(
                                'button',
                                {
                                    onclick: this.submitData.bind(this),
                                    disabled: !this.state.valid,
                                    class: this.state.valid ? 'green' : 'red'
                                },
                                'Submit'
                            )
                        )
                    )
                )
            ),
            h(
                'div',
                { class: 'footer' },
                'https://www.twitch.tv/stuykgaming | https://github.com/team-stuyk-alt-v'
            )
        );

        // Render HTML / Components and Shit Here
    }
}

render(h(App), document.querySelector('#render'));
