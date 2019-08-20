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
            type: 'varchar',
            nullable: true
        },
        clothing: {
            type: 'varchar',
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
