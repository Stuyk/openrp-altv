import orm from 'typeorm';

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
        userid: {
            type: 'varchar'
        },
        rank: {
            type: 'int',
            default: 0
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
            generated: true
        },
        guid: {
            type: 'text',
            default: ''
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
        rewardpoints: {
            type: 'int',
            default: 0
        },
        totalrewardpoints: {
            type: 'int',
            default: 0
        },
        sexgroup: {
            type: 'text',
            nullable: true,
            default: null
        },
        facegroup: {
            type: 'text',
            nullable: true,
            default: null
        },
        structuregroup: {
            type: 'text',
            nullable: true,
            default: null
        },
        hairgroup: {
            type: 'text',
            nullable: true,
            default: null
        },
        eyesgroup: {
            type: 'text',
            nullable: true,
            default: null
        },
        detailgroup: {
            type: 'text',
            nullable: true,
            default: null
        },
        makeupgroup: {
            type: 'text',
            nullable: true,
            default: null
        },
        tattoogroup: {
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
                smithing: { xp: 0 },
                woodcutting: { xp: 0 }
            })
        },
        contacts: {
            type: 'text',
            default: '[]'
        },
        arrestTime: {
            type: 'text',
            default: '-1'
        },
        extraVehicleSlots: {
            type: 'numeric',
            default: 0
        },
        extraHouseSlots: {
            type: 'numeric',
            default: 0
        },
        extraBusinessSlots: {
            type: 'numeric',
            default: 0
        },
        dimension: {
            type: 'int',
            default: 0
        },
        faction: {
            type: 'int',
            default: -1
        }
    }
});

export const Factions = new orm.EntitySchema({
    name: 'Factions',
    columns: {
        // ID of User who Created Gang
        id: {
            primary: true,
            type: 'int',
            generated: false
        },
        // Creation
        creation: {
            type: 'bigint',
            default: Date.now()
        },
        // Name of Gang
        name: {
            type: 'text'
        },
        // Members
        members: {
            type: 'text',
            default: '[]'
        },
        // Ranks
        ranks: {
            type: 'text',
            default: JSON.stringify(['Recruit', 'Owner'])
        },
        turfs: {
            type: 'text',
            default: '[]'
        },
        color: {
            type: 'int',
            default: 1
        },
        classification: {
            type: 'int',
            default: 0
        },
        skills: {
            type: 'text',
            default: '[]'
        },
        notice: {
            type: 'text',
            default: 'Welcome to your faction. You can write messages here.'
        },
        home: {
            type: 'text',
            default: null
        },
        vehiclepoints: {
            type: 'text',
            default: '[]'
        },
        subtype: {
            type: 'text',
            default: ''
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
        },
        fuel: {
            type: 'decimal',
            default: 100
        },
        dimension: {
            type: 'int',
            default: 0
        },
        inventory: {
            type: 'text',
            default: '[]'
        }
    }
});

export const Details = new orm.EntitySchema({
    name: 'Details',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        mdc: {
            type: 'text',
            nullable: true
        }
    }
});

export const Door = new orm.EntitySchema({
    name: 'Door',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: false
        },
        guid: {
            type: 'int',
            default: -1
        },
        lockstate: {
            type: 'int',
            default: 0
        },
        salePrice: {
            type: 'int',
            default: 100000
        }
    }
});
