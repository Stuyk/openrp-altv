const { createElement, render, Component } = preact;
const h = createElement;

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dynamic: '',
            style: ''
        };
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('dynamic', (data, style) => {
                this.setDynamic(data, style);
            });
        }
    }

    setDynamic(dynamic, style) {
        this.setState({ dynamic, style });
    }

    render() {
        return h('div', {
            class: '',
            dangerouslySetInnerHTML: { __html: this.state.dynamic },
            style: this.state.style
        });
    }
}

render(h(App), document.querySelector('#render'));
