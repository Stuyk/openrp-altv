export const Items = {
    GranolaBar: {
        label: 'Granola Bar',
        stackable: true,
        consumeable: true,
        useitem: false,
        eventcall: 'itemeffects:Consume',
        sellable: true,
        message: 'You eat the granola the bar. It tastes great.',
        quantity: 0,
        sound: 'eat',
        props: {
            health: 5
        }
    },
    Coffee: {
        label: 'Coffee',
        stackable: true,
        consumeable: true,
        useitem: false,
        eventcall: 'itemeffects:Consume',
        sellable: true,
        message: 'You drink the hot coffee.',
        quantity: 0,
        sound: 'drink',
        props: {
            health: 5,
            armor: 5
        }
    },
    Soda: {
        label: 'Soda',
        stackable: true,
        consumeable: true,
        useitem: false,
        eventcall: 'itemeffects:Consume',
        sellable: true,
        message: 'You drink the soda.',
        quantity: 0,
        sound: 'drink',
        props: {
            health: 3
        }
    },
    DriversLicense: {
        label: 'Drivers License',
        stackable: false,
        consumeable: false,
        useitem: true,
        eventcall: 'itemeffects:ShowLicense',
        sellable: false,
        message: '',
        quantity: 0,
        props: {}
    },
    PilotsLicense: {
        label: 'Pilots License',
        stackable: false,
        consumeable: false,
        useitem: true,
        eventcall: 'itemeffects:ShowLicense',
        sellable: false,
        message: '',
        quantity: 0,
        props: {}
    },
    OpenCarryLicense: {
        label: 'Open Carry License',
        stackable: false,
        consumeable: false,
        useitem: true,
        eventcall: 'itemeffects:ShowLicense',
        sellable: false,
        message: '',
        quantity: 0,
        props: {}
    },
    WeaponLicense: {
        label: 'Weapon License',
        stackable: false,
        consumeable: false,
        useitem: true,
        eventcall: 'itemeffects:ShowLicense',
        sellable: false,
        message: '',
        quantity: 0,
        props: {}
    },
    MilitaryLicense: {
        label: 'Military License',
        stackable: false,
        consumeable: false,
        useitem: true,
        eventcall: 'itemeffects:ShowLicense',
        sellable: false,
        message: '',
        quantity: 0,
        props: {}
    }
};
