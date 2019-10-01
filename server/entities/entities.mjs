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
        dob: {
            type: 'text',
            default: `${Date.now()}`
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
            default: `${JSON.stringify(new Array(128).fill(null))}`
        },
        equipment: {
            type: 'text',
            default: `${JSON.stringify(new Array(15).fill(null))}`
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
        },
        skills: {
            type: 'text',
            default: JSON.stringify({
                agility: { xp: 0 },
                cooking: { xp: 0 },
                crafting: { xp: 0 },
                fishing: { xp: 0 },
                gathering: { xp: 0 },
                mechanic: { xp: 0 },
                medicine: { xp: 0 },
                mining: { xp: 0 },
                nobility: { xp: 0 },
                notoriety: { xp: 0 },
                smithing: { xp: 0 },
                woodcutting: { xp: 0 }
            })
        },
        contacts: {
            type: 'text',
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
        },
        customization: {
            type: 'text',
            nullable: true
        }
    }
});
