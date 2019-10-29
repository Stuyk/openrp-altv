import * as alt from 'alt';
import * as systemsInteraction from '../systems/interaction.mjs';
import * as systemsPolice from '../systems/police.mjs';

alt.on('entityEnterColshape', (colshape, entity) => {
    // Forward any interaction events to the player.
    if (entity.constructor.name === 'Player') {
        if (colshape.sector) {
            entity.colshape = colshape;
            entity.sector = colshape.sector;
            alt.emitClient(entity, 'blip:CleanSectorBlips'); // Remove all sector blips
            alt.emitClient(entity, 'blip:CreateSectorBlip', colshape.sector); // Show the sector blip, the user is currently in
            alt.emitClient(entity, 'door:RenderDoors', colshape.sector.doors);
        }

        systemsInteraction.forwardEventToPlayer(colshape, entity);
        systemsPolice.forwardColshapeEnter(colshape, entity);
    }
});
