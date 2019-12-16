import * as alt from 'alt';
import * as systemsInteraction from '../systems/interaction.js';
import * as systemsPolice from '../systems/police.js';

alt.on('entityEnterColshape', (colshape, entity) => {
    if (!entity) return;

    // Forward any interaction events to the player.
    if (entity.constructor.name === 'Player') {
        if (colshape.isSafetyNet) {
            console.log('Hit the safety net.');
        }

        if (entity.dimension !== 0) return;
        if (colshape.sector) {
            entity.colshape = colshape;
            entity.sector = colshape.sector;

            if (colshape.factions) {
                const isPvPEnabled = colshape.factions.owner.id !== -2;
                alt.emitClient(entity, 'combat:ToggleCombat', isPvPEnabled);
            }

            alt.emitClient(entity, 'blip:CleanSectorBlips'); // Remove all sector blips
            alt.emitClient(entity, 'blip:CreateSectorBlip', colshape.sector); // Show the sector blip, the user is currently in
            alt.emitClient(entity, 'door:RenderDoors', colshape.sector.doors);
            const weather = colshape.getMeta('weather');
            if (weather !== null) {
                alt.emitClient(
                    entity,
                    'transition:Weather',
                    weather.weatherType,
                    weather.lastWeather
                );
            }
        }

        systemsInteraction.forwardEventToPlayer(colshape, entity);
        systemsPolice.forwardColshapeEnter(colshape, entity);
    }
});
