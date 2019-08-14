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
        charactername: {
            type: 'varchar',
            nullable: true
        },
        characterface: {
            type: 'varchar',
            nullable: true
        },
        lastposition: {
            type: 'varchar'
        },
        model: {
            type: 'varchar'
        },
        health: {
            type: 'int'
        }
    }
});
