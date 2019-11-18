const { createElement, render, Component } = preact;
const h = createElement;

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            vehiclename: 'My Vehicle Name',
            vehicles: [],
            price: 0,
            rotation: 0,
            classType: ''
        };
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('vehiclevendor:SetVehicleData', this.setVehicleData.bind(this));
            alt.on('vehiclevendor:SetVehiclePrices', this.setVehiclePrices.bind(this));
            alt.on(
                'vehiclevendor:SetVehicleClassType',
                this.setVehicleClassType.bind(this)
            );
            setTimeout(() => {
                alt.emit('vehvendor:Ready');
            }, 1000);
        }
    }

    setVehicleClassType(classType) {
        this.setState({ classType });
    }

    setVehiclePrices(jsonPrices) {
        this.setState({ prices: JSON.parse(jsonPrices) });
        this.parseIndex(0);
    }

    setVehicleData(vehicle) {
        const vehicles = [...this.state.vehicles];
        vehicles.push(vehicle);
        this.setState({ vehicles });
        this.parseIndex(0);
    }

    leftButton() {
        let curVal = this.state.index;

        if (curVal - 1 < 0) {
            curVal = this.state.vehicles.length - 1;
        } else {
            curVal -= 1;
        }

        this.parseIndex(curVal);
    }

    rightButton() {
        let curVal = this.state.index;

        if (curVal + 1 > this.state.vehicles.length - 1) {
            curVal = 0;
        } else {
            curVal += 1;
        }

        this.parseIndex(curVal);
    }

    parseIndex(index) {
        if ('alt' in window) {
            alt.emit('vehvendor:ChangeIndex', index, parseInt(this.state.rotation));
        }

        let price = 0;
        if (this.state.prices) {
            price = this.state.prices[this.state.vehicles[index].class];
            price = !price ? 0 : price;
        }

        this.setState({
            index,
            vehiclename: this.state.vehicles[index].display,
            price
        });
    }

    rotate(e) {
        this.setState({ rotation: parseInt(e.target.value) });

        if ('alt' in window) {
            alt.emit('vehvendor:ChangeRotation', parseInt(e.target.value));
        }
    }

    exit() {
        if ('alt' in window) {
            alt.emit('vehvendor:Exit');
        }
    }

    purchase() {
        if ('alt' in window) {
            alt.emit('vehvendor:Purchase', this.state.vehicles[this.state.index].name);
        }
    }

    render() {
        return h(
            'div',
            { class: '' },
            // <div>
            h('div', { class: 'title' }, this.state.vehiclename),
            // <div>
            h(
                'div',
                { class: 'panel' },
                // <button>
                h(
                    'button',
                    { class: 'indexButton', onclick: this.leftButton.bind(this) },
                    '<'
                ),
                // <div>
                h('div', { class: 'currentIndex' }, `$${this.state.price}`),
                // <button>
                h(
                    'button',
                    { class: 'indexButton', onclick: this.rightButton.bind(this) },
                    '>'
                )
            ),
            h('input', {
                type: 'range',
                class: 'rotation',
                min: 0,
                max: 360,
                value: this.state.rotation,
                oninput: this.rotate.bind(this)
            }),
            h(
                'button',
                { class: 'purchase', onclick: this.purchase.bind(this) },
                'Purchase'
            ),
            h('button', { class: 'exit', onclick: this.exit.bind(this) }, 'Exit')
        );
    }
}

render(h(App), document.querySelector('#render'));
