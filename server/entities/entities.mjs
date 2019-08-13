import orm from 'typeorm';

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
