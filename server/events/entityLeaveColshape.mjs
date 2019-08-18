import * as alt from 'alt';
import * as interactions from '../systems/interactionsystem.mjs';

alt.on('entityLeaveColshape', (colshape, entity) => {
    // Clear intereaction event on leaving colshape.
    if (entity.constructor.name === 'Player') {
        interactions.clearInteraction(entity);
    }
});
