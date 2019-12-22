import * as alt from 'alt';
import * as systemsInteraction from '../systems/interaction.js';

alt.on('entityLeaveColshape', (colshape, entity) => {
    if (!entity.data) {
        return;
    }

    const isPlayer = entity.constructor.name === 'Player';
    const isVehicle = entity.constructor.name === 'Vehicle';
    const isTurf = colshape.constructor.name === 'GridCuboid';

    if (isPlayer) {
        const player = entity;

        if (isTurf) {
            colshape.rmvPlayer(player);
        }

        systemsInteraction.clearInteraction(player);
        player.isInPoliceBooking = false;
    }
});
