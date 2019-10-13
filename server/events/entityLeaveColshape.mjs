import * as alt from 'alt';
import * as systemsInteraction from '../systems/interaction.mjs';

alt.on('entityLeaveColshape', (colshape, entity) => {
    // Clear intereaction event on leaving colshape.
    if (entity.constructor.name === 'Player') {
        systemsInteraction.clearInteraction(entity);
        entity.isInPoliceBooking = false;
    }
});
