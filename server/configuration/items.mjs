/*
    Animations:
	Flags need to be added together for desired effects.
	ie. Upper Body + Last Frame = 16 + 2 = 18 <-- This value.
    Normal = 0
    Repeat = 1
	Stop on Last Frame = 2
	Just Upper Body = 16
	Enable Player Control = 32
	Cancel Animation on Key Press = 128
    
    // Common Ones
    17 - Repeat + Just Upper Body
    49 - Repeat + Just Upper Body + Enable Player Control
    18 - Stop Last Frame + Just Upper Body
*/

export const Items = {
    GranolaBar: {
        label: 'Granola Bar',
        stackable: true,
        consumeable: true,
        useitem: false,
        droppable: true,
        eventcall: 'itemeffects:Consume',
        sellable: true,
        message: 'You eat the granola the bar. It tastes great.',
        quantity: 0,
        sound: 'eat',
        anim: {
            dict: 'mp_player_inteat@burger',
            name: 'mp_player_int_eat_burger_fp',
            duration: 3500,
            flag: 49
        },
        props: {
            health: 5
        }
    },
    Coffee: {
        label: 'Coffee',
        stackable: true,
        consumeable: true,
        useitem: false,
        droppable: true,
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
        droppable: true,
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
        droppable: false,
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
        droppable: false,
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
        droppable: false,
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
        droppable: false,
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
        droppable: false,
        eventcall: 'itemeffects:ShowLicense',
        sellable: false,
        message: '',
        quantity: 0,
        props: {}
    }
};
