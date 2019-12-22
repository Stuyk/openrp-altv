import * as alt from 'alt';
import { forwardEventToPlayer } from '../systems/interaction.js';
import { forwardColshapeEnter } from '../systems/police.js';

alt.on('entityEnterColshape', (colshape, entity) => {
    if (!entity.data) {
        return;
    }

    if (!entity) {
        return;
    }

    const isPlayer = entity.constructor.name === 'Player';
    const isVehicle = entity.constructor.name === 'Vehicle';
    const isTurf = colshape.constructor.name === 'GridCuboid';

    if (entity.dimension !== 0 && isPlayer) {
        forwardEventToPlayer(colshape, entity);
        if (colshape.isSafetyNet) {
            alt.log(`Player fell through map and was reset.`);
        }
        return;
    }

    if (isTurf && isPlayer && entity.dimension === 0) {
        const player = entity;
        colshape.addPlayer(player);
        if (!colshape.players.includes(player)) {
            colshape.addPlayer(player);
        }

        player.colshape = colshape;
        player.sector = colshape.sector;
        forwardEventToPlayer(colshape, player);
        forwardColshapeEnter(colshape, player);
    }
});
