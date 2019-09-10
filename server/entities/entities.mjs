import orm from 'typeorm';

console.log('Loaded: entities->entities.mjs');

// These are the different table schemas provided.
// Account is required for the login system.
export const Account = new orm.EntitySchema({
    name: 'Account',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        username: {
            type: 'varchar'
        },
        password: {
            type: 'varchar'
        }
    }
});

// Character is used to link an account to a character on creation.
export const Character = new orm.EntitySchema({
    name: 'Character',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: false
        },
        name: {
            type: 'text',
            nullable: true,
            default: null
        },
        creation: {
            type: 'bigint',
            default: Date.now()
        },
        lastlogin: {
            type: 'bigint',
            default: Date.now()
        },
        playingtime: {
            type: 'int',
            default: 0
        },
        upgradestotal: {
            type: 'int',
            default: 0
        },
        upgrades: {
            type: 'int',
            default: 0
        },
        face: {
            type: 'text',
            nullable: true,
            default: null
        },
        inventory: {
            type: 'text',
            default: `${JSON.stringify(new Array(128))}`
        },
        lastposition: {
            type: 'text',
            nullable: true
        },
        health: {
            type: 'int',
            default: 200
        },
        armour: {
            type: 'int',
            default: 0
        },
        cash: {
            type: 'numeric',
            default: 0
        },
        bank: {
            type: 'numeric',
            default: 0
        },
        dead: {
            type: 'bool',
            default: false
        }
    }
});

export const Vehicle = new orm.EntitySchema({
    name: 'Vehicle',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        // Who owns this vehicle.
        guid: {
            type: 'int'
        },
        // The vehicle model.
        model: {
            type: 'text'
        },
        position: {
            type: 'text',
            nullable: true
        },
        rotation: {
            type: 'text',
            nullable: true
        },
        stats: {
            type: 'text',
            nullable: true
        }
    }
});
