export const BaseItems = {
    food: {
        eventcall: 'use:Food',
        abilities: {
            drop: true,
            use: true,
            destroy: true,
            sell: true,
            rename: false,
            stack: true
        },
        slot: -1
    }
};

export const Items = {
    granolabar: {
        name: 'Granola Bar',
        base: 'food',
        key: 'granolabar',
        props: {},
        quantity: 0
    }
};
