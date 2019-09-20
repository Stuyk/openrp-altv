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
    Weapon: {
        label: '',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        eventcall: '',
        sellable: true,
        isWeapon: true,
        message: '',
        quantity: 0,
        slot: 37,
        icon: 'weapon',
        props: {
            hash: 0
        }
    },
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
        icon: 'granolabar',
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
        icon: 'coffee',
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
        icon: 'soda',
        props: {
            health: 3
        }
    },
    Phone: {
        label: 'Phone',
        stackable: false,
        consumeable: false,
        useitem: false,
        eventcall: '',
        sellable: true,
        droppable: true,
        message: '',
        quantity: 0,
        icon: 'phone',
        props: {}
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
        icon: 'license',
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
        icon: 'license',
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
        icon: 'license',
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
        icon: 'license',
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
        icon: 'license',
        props: {}
    },
    Hat: {
        label: 'Hat',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        sellable: true,
        rename: true,
        message: '',
        quantity: 0,
        slot: 28,
        props: {}
    },
    Helmet: {
        label: 'Helmet',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        sellable: true,
        rename: true,
        message: '',
        quantity: 0,
        slot: 29,
        props: {}
    },
    Shirt: {
        label: 'Shirt',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        sellable: true,
        rename: true,
        message: '',
        quantity: 0,
        slot: 30,
        props: {}
    },
    Pants: {
        label: 'Pants',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        sellable: true,
        rename: true,
        message: '',
        quantity: 0,
        slot: 31,
        props: {}
    },
    Shoes: {
        label: 'Shoes',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        sellable: true,
        rename: true,
        message: '',
        quantity: 0,
        slot: 32,
        props: {}
    },
    BodyArmour: {
        label: 'BodyArmour',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        sellable: true,
        rename: true,
        message: '',
        quantity: 0,
        slot: 33,
        props: {}
    },
    Accessory: {
        label: 'Accessory',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        sellable: true,
        rename: true,
        message: '',
        quantity: 0,
        slot: 34,
        props: {}
    },
    Earrings: {
        label: 'Earrings',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        sellable: true,
        rename: true,
        message: '',
        quantity: 0,
        slot: 35,
        props: {}
    },
    Backpack: {
        label: 'Backpack',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        sellable: true,
        rename: true,
        message: '',
        quantity: 0,
        slot: 36,
        props: {}
    },
    Hand: {
        label: 'Hand',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        sellable: true,
        rename: true,
        message: '',
        quantity: 0,
        slot: 37,
        props: {}
    },
    Watch: {
        label: 'Watch',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        sellable: true,
        rename: true,
        message: '',
        quantity: 0,
        slot: 38,
        props: {}
    },
    Bracelet: {
        label: 'Bracelet',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        sellable: true,
        rename: true,
        message: '',
        quantity: 0,
        slot: 39,
        props: {}
    },
    Glasses: {
        label: 'Glasses',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        sellable: true,
        rename: true,
        message: '',
        quantity: 0,
        slot: 40,
        props: {}
    },
    PoliceUniform: {
        label: 'Police Uniform',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: false,
        sellable: false,
        message: '',
        quantity: 0,
        slot: 41,
        props: {
            description: 'Standard Issue Police Uniform',
            restriction: -1,
            female: [
                { id: 3, value: 9 },
                { id: 4, value: 30 },
                { id: 6, value: 24 },
                { id: 8, value: 35 },
                { id: 11, value: 48 }
            ],
            male: [
                { id: 3, value: 0 },
                { id: 4, value: 31 },
                { id: 6, value: 24 },
                { id: 8, value: 58 },
                { id: 11, value: 55 }
            ]
        }
    },
    SkiMask: {
        label: 'Ski Mask',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        sellable: false,
        message: '',
        quantity: 0,
        slot: 28,
        props: {
            description: 'Conceal Your Identity',
            restriction: -1,
            female: [
                {
                    id: 1,
                    value: 35
                }
            ],
            male: [
                {
                    id: 1,
                    value: 35
                }
            ]
        }
    },
    LooseSkiMask: {
        label: 'Loose Ski Mask',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        sellable: false,
        message: '',
        quantity: 0,
        slot: 28,
        props: {
            description: 'Conceal Your Identity',
            restriction: -1,
            female: [
                {
                    id: 1,
                    value: 37
                }
            ],
            male: [
                {
                    id: 1,
                    value: 37
                }
            ]
        }
    },
    Bandana: {
        label: 'Bandana',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        sellable: false,
        message: '',
        quantity: 0,
        slot: 28,
        props: {
            description: 'Conceal Your Identity',
            restriction: -1,
            female: [
                {
                    id: 1,
                    value: 51
                }
            ],
            male: [
                {
                    id: 1,
                    value: 51
                }
            ]
        }
    },
    OpenMotorcycleHelmet: {
        label: 'Open Motorcycle Helmet',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        sellable: false,
        message: '',
        quantity: 0,
        slot: 28,
        props: {
            description: 'Protect Your Face',
            isProp: true,
            restriction: -1,
            female: [
                {
                    id: 0,
                    value: 48
                }
            ],
            male: [
                {
                    id: 0,
                    value: 48
                }
            ]
        }
    },
    ClosedMotorcycleHelmet: {
        label: 'Closed Motorcycle Helmet',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        sellable: false,
        message: '',
        quantity: 0,
        slot: 28,
        props: {
            description: 'Protect Your Face',
            isProp: true,
            restriction: -1,
            female: [
                {
                    id: 0,
                    value: 81
                }
            ],
            male: [
                {
                    id: 0,
                    value: 82
                }
            ]
        }
    },
    TrackSuit: {
        label: 'Track Suit',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: false,
        sellable: false,
        message: '',
        quantity: 0,
        slot: 41,
        props: {
            description: 'Standard Issue Track Suit',
            restriction: -1,
            female: [
                { id: 3, value: 15 },
                { id: 4, value: 16 },
                { id: 6, value: 4 },
                { id: 8, value: 9 },
                { id: 11, value: 16 }
            ],
            male: [
                { id: 3, value: 15 },
                { id: 4, value: 18 },
                { id: 6, value: 31 },
                { id: 8, value: 15 },
                { id: 11, value: 5 }
            ]
        }
    },
    HikingOutfit: {
        label: 'Hiking Outfit',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: false,
        sellable: false,
        message: '',
        quantity: 0,
        slot: 41,
        props: {
            description: 'Standard Issue Mountain Gear',
            restriction: -1,
            female: [
                { id: 3, value: 1 },
                { id: 4, value: 25 },
                { id: 5, value: 33 },
                { id: 6, value: 65 },
                { id: 8, value: 26 },
                { id: 11, value: 1 }
            ],
            male: [
                { id: 3, value: 1 },
                { id: 4, value: 15 },
                { id: 5, value: 33 },
                { id: 6, value: 62 },
                { id: 8, value: 15 },
                { id: 11, value: 41 }
            ]
        }
    },
    UnrefinedRock: {
        label: 'Unrefined Rock',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        eventcall: '',
        sellable: true,
        message: '',
        quantity: 0,
        icon: 'rock',
        props: {
            description: 'A hunk of unrefined rock.'
        }
    },
    UnrefinedWood: {
        label: 'Unrefined Wood',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        eventcall: '',
        sellable: true,
        message: '',
        quantity: 0,
        icon: 'wood',
        props: {
            description: 'A hunk of unrefined wood.'
        }
    },
    Pickaxe1: {
        label: 'Garbage Pickaxe',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        eventcall: '',
        sellable: true,
        message: '',
        quantity: 0,
        slot: 37,
        icon: 'pickaxe',
        props: {
            lvl: 0,
            propData: {
                name: 'prop_tool_pickaxe',
                bone: 57005,
                x: 0.1,
                y: -0.1,
                z: -0.02,
                pitch: 80,
                roll: 0,
                yaw: 170
            }
        }
    },
    Pickaxe2: {
        label: 'Shoddy Pickaxe',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        eventcall: '',
        sellable: true,
        message: '',
        quantity: 0,
        slot: 37,
        icon: 'pickaxe',
        props: {
            lvl: 10,
            propData: {
                name: 'prop_tool_pickaxe',
                bone: 57005,
                x: 0.1,
                y: -0.1,
                z: -0.02,
                pitch: 80,
                roll: 0,
                yaw: 170
            }
        }
    },
    Axe1: {
        label: 'Garbage Axe',
        stackable: false,
        consumeable: false,
        useitem: false,
        droppable: true,
        eventcall: '',
        sellable: true,
        message: '',
        quantity: 0,
        slot: 37,
        icon: 'axe',
        props: {
            lvl: 0,
            propData: {
                name: 'prop_tool_fireaxe',
                bone: 57005,
                x: 0.1,
                y: -0.1,
                z: -0.02,
                pitch: 80,
                roll: 0,
                yaw: 170
            }
        }
    }
};
