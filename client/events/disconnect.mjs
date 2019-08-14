import * as alt from 'alt';
import * as native from 'natives';
import * as facecustomizer from 'client/customizers/character.mjs';

alt.log('Loaded: client->events->disconnect.mjs');

alt.on('disconnect', () => {
    native.destroyAllCams(true);
    native.displayRadar(true);
    native.renderScriptCams(false, false, 0, false, false);
    native.transitionFromBlurred(0);

    // Cleanup any spawned peds.
    facecustomizer.cleanupSpawnedPed();
});
