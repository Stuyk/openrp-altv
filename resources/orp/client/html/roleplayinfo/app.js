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
            alt.on('roleplay:SetFirstNames', this.setFirstNames.bind(this));
            alt.on('roleplay:SetLastNames', this.setLastNames.bind(this));
            alt.emit('roleplay:Ready');
        } else {
            this.setFirstNames([
                'Aaren',
                'Aarika',
                'Abagael',
                'Abagail',
                'Abbe',
                'Abbey',
                'Abbi',
                'Abbie',
                'Abby',
                'Abbye',
                'Abigael',
                'Abigail',
                'Abigale',
                'Abra',
                'Ada',
                'Adah',
                'Adaline',
                'Adan',
                'Adara',
                'Adda',
                'Addi',
                'Addia',
                'Addie',
                'Addy',
                'Adel',
                'Adela',
                'Adelaida',
                'Adelaide',
                'Adele',
                'Adelheid',
                'Adelice',
                'Adelina',
                'Adelind',
                'Adeline',
                'Adella',
                'Adelle',
                'Adena',
                'Adey',
                'Adi',
                'Adiana',
                'Adina',
                'Adora',
                'Adore',
                'Adoree',
                'Adorne',
                'Adrea',
                'Adria',
                'Adriaens',
                'Adrian',
                'Adriana',
                'Adriane',
                'Adrianna',
                'Adrianne',
                'Adriena',
                'Adrienne',
                'Aeriel',
                'Aeriela',
                'Aeriell',
                'Afton',
                'Ag',
                'Agace',
                'Agata',
                'Agatha',
                'Agathe',
                'Aggi',
                'Aggie',
                'Aggy',
                'Agna',
                'Agnella',
                'Agnes',
                'Agnese',
                'Agnesse',
                'Agneta',
                'Agnola',
                'Agretha',
                'Aida',
                'Aidan',
                'Aigneis',
                'Aila',
                'Aile',
                'Ailee',
                'Aileen',
                'Ailene',
                'Ailey',
                'Aili',
                'Ailina',
                'Ailis',
                'Ailsun',
                'Ailyn',
                'Aime',
                'Aimee',
                'Aimil',
                'Aindrea',
                'Ainslee',
                'Ainsley',
                'Ainslie',
                'Ajay',
                'Alaine',
                'Alameda',
                'Alana',
                'Alanah',
                'Alane',
                'Alanna',
                'Alayne'
            ]);

            this.setLastNames([
                'Aaronsburg',
                'Abbeville',
                'Abbotsford',
                'Abbottstown',
                'Abbyville',
                'Abell',
                'Abercrombie',
                'Abernant',
                'Abilene',
                'Abingdon',
                'Abington',
                'Abiquiu',
                'Abrams',
                'Absaraka',
                'Absarokee',
                'Absecon',
                'Acampo',
                'Accokeek',
                'Accomac',
                'Accoville',
                'Achille',
                'Ackerly',
                'Ackermanville',
                'Ackworth',
                'Acosta',
                'Acra',
                'Acushnet',
                'Acworth',
                'Adah',
                'Adairsville',
                'Adairville',
                'Adamsbasin',
                'Adamsburg',
                'Adamstown',
                'Adamsville',
                'Addieville',
                'Addington',
                'Addy',
                'Addyston',
                'Adel',
                'Adelanto',
                'Adell',
                'Adelphi',
                'Adelphia',
                'Adena',
                'Adger',
                'Adin',
                'Adjuntas',
                'Adna',
                'Adona',
                'Aflex',
                'Afton',
                'Agana',
                'Agar',
                'Agawam',
                'Agness',
                'Agra',
                'Aguada',
                'Aguadilla',
                'Aguadulce',
                'Aguanga'
            ]);
        }
    }

    setFirstNames(firstNames) {
        this.setState({ firstNames: JSON.parse(firstNames) });
    }

    setLastNames(lastNames) {
        this.setState({ lastNames: JSON.parse(lastNames) });
    }

    setFirstName(e) {
        const firstName = e.target.id;
        this.setState({ firstName });
    }

    setLastName(e) {
        const lastName = e.target.id;
        this.setState({ lastName });
    }

    filterFirstNames(e) {
        const value = e.target.value;
        this.setState({ firstFilter: value });
    }

    filterLastNames(e) {
        const value = e.target.value;
        this.setState({ lastFilter: value });
    }

    submit() {
        const name = `${this.state.firstName}_${this.state.lastName}`;

        if ('alt' in window) {
            alt.emit('roleplay:SetInfo', name);
        } else {
            console.log(name);
        }
    }

    filterNames() {
        const filteredFirst = this.state.firstNames.filter(name =>
            name.includes(this.state.firstFilter)
        );

        const filteredLast = this.state.lastNames.filter(name =>
            name.includes(this.state.lastFilter)
        );

        const firstNames = filteredFirst.map(name => {
            const isChecked = this.state.firstName === name ? true : false;
            return h(
                'li',
                { class: 'name-box' },
                h('div', { class: 'current' }, name),
                h('input', {
                    id: name,
                    onchange: this.setFirstName.bind(this),
                    type: 'checkbox',
                    checked: isChecked
                })
            );
        });

        const lastNames = filteredLast.map(name => {
            const isChecked = this.state.lastName === name ? true : false;
            return h(
                'li',
                { class: 'name-box' },
                h('div', { class: 'current' }, name),
                h('input', {
                    id: name,
                    onchange: this.setLastName.bind(this),
                    type: 'checkbox',
                    checked: isChecked
                })
            );
        });

        return { firstNames, lastNames };
    }

    render() {
        const filteredNames = this.filterNames();
        const firstName = this.state.firstName === '' ? 'Select' : this.state.firstName;
        const lastName = this.state.lastName === '' ? 'Name' : this.state.lastName;
        const allValid = firstName !== 'Select' && lastName !== 'Name' ? true : false;
        return h(
            'div',
            { id: 'app' },
            h(
                'div',
                { class: 'wrapper' },
                h(
                    'div',
                    { class: 'current-name' },
                    h('p', {}, `${firstName}_${lastName}`)
                ),
                h(
                    'div',
                    { class: 'search-boxes' },
                    h(
                        'div',
                        { class: 'first' },
                        h('input', {
                            type: 'text',
                            placeholder: 'Search for First Name',
                            onchange: this.filterFirstNames.bind(this)
                        }),
                        h('ul', { class: 'name-list' }, filteredNames.firstNames)
                    ),
                    h(
                        'div',
                        { class: 'last' },
                        h('input', {
                            type: 'text',
                            placeholder: 'Search for Last Name',
                            onchange: this.filterLastNames.bind(this)
                        }),
                        h('ul', { class: 'name-list' }, filteredNames.lastNames)
                    )
                ),
                allValid &&
                    h(
                        'button',
                        { class: 'submit', onclick: this.submit.bind(this) },
                        'Set Roleplay Name'
                    )
            )
        );
    }
}

render(h(App), document.querySelector('#render'));
