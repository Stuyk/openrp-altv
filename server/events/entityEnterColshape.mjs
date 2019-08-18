import * as alt from 'alt';
import * as interactions from '../systems/interactionsystem.mjs';

alt.on('entityEnterColshape', (colshape, entity) => {
    // Forward any interaction events to the player.
    if (entity.constructor.name === 'Player') {
        interactions.forwardEventToPlayer(colshape, entity);
    }
});
