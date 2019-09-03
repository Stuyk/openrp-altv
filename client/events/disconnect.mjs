import * as alt from 'alt';
import * as native from 'natives';
import * as panelsCharacter from 'client/panels/character.mjs';

alt.log('Loaded: client->events->disconnect.mjs');

alt.on('disconnect', () => {
    native.destroyAllCams(true);
    native.displayRadar(true);
    native.renderScriptCams(false, false, 0, false, false);
    native.transitionFromBlurred(0);

    // Cleanup any spawned peds.
    panelsCharacter.cleanupSpawnedPed();
});
