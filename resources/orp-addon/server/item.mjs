import * as alt from 'alt';

alt.on('orp:Ready', () => {
    const addons = {
        weapon2: {
            name: '',
            base: 'weapon',
            key: 'weapon',
            props: {},
            quantity: 0,
            icon: 'weapon'
        },
        weapon3: {
            name: '',
            base: 'weapon',
            key: 'weapon',
            props: {},
            quantity: 0,
            icon: 'weapon'
        }
    };

    alt.emit('orp:AddItems', JSON.stringify(addons));
});
