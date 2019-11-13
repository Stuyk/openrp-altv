const { createElement, render, Component } = preact;
const h = createElement;

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render(props, state) {
        return h('div', { class: '' }, 'test');
        // Render HTML / Components and Shit Here
    }
}

render(h(App), document.querySelector('#render'));
