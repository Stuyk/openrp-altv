const { createElement, render, Component } = preact;
const h = createElement;

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: 'loading...',
            hairChanged: false,
            faceData: []
        };
    }

    render(props, state) {
        return h('div', { class: '' }, 'test');
        // Render HTML / Components and Shit Here
    }
}

render(h(App), document.querySelector('#render'));
