import * as alt from 'alt';
import * as native from 'natives';
import { ContextMenu } from 'client/systems/context.mjs';

const objectInteractions =
    // Red Soda Machine
    {
        992069095: {
            func: sodaMachine
        }
    };

alt.on('menu:Object', ent => {
    let model = native.getEntityModel(ent);

    // find interaction; and call it if necessary.
    let interaction = objectInteractions[model];
    if (interaction === undefined) {
        unknown(ent);
        return;
    }

    interaction.func(ent);
});

function unknown(ent) {
    new ContextMenu(ent, [
        {
            label: 'Unknown'
        }
    ]);
}

function sodaMachine(ent) {
    new ContextMenu(ent, [
        {
            label: 'Soda Machine'
        },
        {
            label: 'Buy Soda',
            isServer: true,
            event: 'use:SodaMachine'
        }
    ]);
}
