import * as alt from 'alt';

alt.on('orp:Ready', () => {
    const addons = {
        badfood: {
            eventcall: 'itemeffects:Consume',
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

    alt.emit('orp:AddBaseItems', JSON.stringify(addons));
});
