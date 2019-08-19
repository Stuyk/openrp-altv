import orm from 'typeorm';
import * as configurationItems from '../configuration/items.mjs';

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

// Inventory is linked to Character IDs
// The inventory schema is populated by
// the items configuration. There's a function
// below that handles this.
let InventoryObject = {
    name: 'Inventory',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: false
        }
    }
};

Object.keys(configurationItems.Items).forEach(key => {
    if (InventoryObject.columns[key] === undefined) {
        InventoryObject.columns[key] = {
            type: 'numeric',
            default: 0
        };
    }
});

export let Inventory = new orm.EntitySchema(InventoryObject);
