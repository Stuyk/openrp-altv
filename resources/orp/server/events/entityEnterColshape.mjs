import * as alt from 'alt';
import * as systemsInteraction from '../systems/interaction.mjs';
import * as systemsPolice from '../systems/police.mjs';

alt.on('entityEnterColshape', (colshape, entity) => {
    if (!entity) return;

    // Forward any interaction events to the player.
    if (entity.constructor.name === 'Player') {
        if (entity.dimension !== 0) return;
        if (colshape.sector) {
            entity.colshape = colshape;
            entity.sector = colshape.sector;
            alt.emitClient(entity, 'blip:CleanSectorBlips'); // Remove all sector blips
            alt.emitClient(entity, 'blip:CreateSectorBlip', colshape.sector); // Show the sector blip, the user is currently in
            alt.emitClient(entity, 'door:RenderDoors', colshape.sector.doors);
            const weather = colshape.getMeta('weather');
            if (weather !== null) {
                alt.emitClient(entity, 'transition:Weather', weather.weatherType);
            }
        }

        systemsInteraction.forwardEventToPlayer(colshape, entity);
        systemsPolice.forwardColshapeEnter(colshape, entity);
    }
});
