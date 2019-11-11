const { createElement, render, Component } = preact;
const h = createElement;

const pages = ['Users'];

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0
        };
    }

    componentDidMount() {}

    componentWillUnmount() {}

    renderNavigation() {}

    render(props, state) {
        return h('div', { class: '' }, 'test');
    }
}

render(h(App), document.querySelector('#render'));
