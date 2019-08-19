export const Items = {
    GranolaBar: {
        label: 'Granola Bar',
        stackable: true,
        consumeable: true,
        useitem: false,
        eventcall: 'itemeffects:Consume',
        sellable: true,
        message: 'You eat the granola the bar. It tastes great.',
        props: {
            health: 5
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
        props: {}
    }
};
