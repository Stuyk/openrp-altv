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
            type: 'varchar',
            nullable: true
        },
        face: {
            type: 'longtext',
            nullable: true
        },
        clothing: {
            type: 'longtext',
            nullable: true
        },
        lastposition: {
            type: 'varchar',
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
        },
        inventory: {
            type: 'varchar',
            default: '[]'
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
            type: 'varchar'
        },
        health: {
            type: 'varchar',
            nullable: true
        },
        position: {
            type: 'varchar',
            nullable: true
        },
        rotation: {
            type: 'varchar',
            nullable: true
        },
        stats: {
            type: 'varchar',
            nullable: true
        }
    }
});
